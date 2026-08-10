/* ============================================================================
   AI-SYV — delad modul (mobil + desktop)
   ----------------------------------------------------------------------------
   Enda källan för AI-SYV / "Utbilda dig"-chatten. Laddas av både index.html
   (mobil) och desktop.html via <script src="/aisyv.js"></script> och startas
   med window.createAiSyv({...}).

   Tidigare fanns denna logik dubblerad — en kopia i index.html och en i
   desktop.html — som drivit isär (mobilen fick user-scoped storage, desktop
   fick isSending-lås). Modulen återskapar båda beteendena exakt via config:

     scopedStorage : true  -> spara via _scopedGet/_scopedSet (user-scoped)   [mobil]
                     false -> spara via localStorage direkt                   [desktop]
     dualKeyRead   : true  -> getSaved läser båda nycklarna och tar den längsta [mobil]
                     false -> getSaved läser bara cvmatchen_edu_saved           [desktop]
     sendLock      : true  -> isSending-lås + setChatLocked under svar          [desktop]
                     false -> inget lås                                          [mobil]

   DOM-kontraktet (edu-home, edu-chat, edu-messages, edu-input, edu-send,
   edu-framtidsyrken[-list], edu-link-modal m.fl.) är identiskt på båda
   sidorna. _sbSync / logEvent / _scopedGet / _scopedSet slås upp globalt,
   precis som den tidigare inline-koden gjorde.
   ========================================================================== */
(function () {
  'use strict';

  // Gemensam persona-bas — AI-SYV:s identitet + geografi + språk. Delas av ALLA
  // AI-SYV-ytor: de stora chattarna (mobil/desktop) OCH övnings-chatten i
  // index.html (exAiChat). Håll den format-NEUTRAL — inga KORT-regler här, så
  // att ytor utan KORT-rendering kan återanvända basen utan att få kort-syntax.
  var AISYV_BASE = "Du är en AI-SYV för Familjen Helsingborg. Svara på SAMMA språk som användaren skriver på; när du svarar på svenska, använd korrekt och enkel klarspråks-svenska (å/ä/ö, korta ord och meningar, förklara facktermer som CSN, behörighet, YH och SFI första gången). Var varm, uppmuntrande och dömfri. Vid stora eller livsavgörande beslut, uppmuntra användaren att också boka en riktig studie- och yrkesvägledare i kommunen (det är kostnadsfritt). Om användaren uttrycker psykisk ohälsa, kris eller desperation: bemöt varsamt, hänvisa till 1177 eller vårdcentral, och visa inte utbildningskort då.";

  // Full systemprompt för de stora chattarna = bas + KORT-regler + utbildningsdata.
  var AISYV_SYSTEM_PROMPT = AISYV_BASE + " REGLER: 1) Håll din egen text till EN kort mening (max ca 15 ord) så frågan blir tydlig - skriv aldrig långa stycken brödtext. 2) När du föreslår utbildningar - skriv BARA KORT-kort, ingen fritext om utbildningarna. 3) KORT-format (en per rad): KORT:namn|skola|typ|ort|längd|krav| (lämna url-fältet ALLTID tomt - appen genererar rätt länkar automatiskt baserat på typ). 4) En kort mening FÖRE korten är ok (t.ex. 'Här är tre YH-utbildningar:'). 5) Avsluta ALLTID med 3-6 svarsalternativ, var och en på egen rad som börjar med >>. Ge 4-6 alternativ när frågan gäller intressen, områden eller yrken (så användaren kan markera FLERA), och 3 vid ja/nej-liknande frågor. Formulera dem i användarens röst (t.ex. '>>Teknik/IT', '>>Ja, visa fler') så man kan välja genom att trycka istället för att skriva. Användaren kan markera upp till 3 alternativ och skicka dem ihop. 6) Inga markdown-symboler. Exempel på svar: 'Här är YH-utbildningar i Helsingborg:\nKORT:Systemutvecklare .NET|Medieinstitutet|YH|Helsingborg|2 år|Gymnasieexamen|\nKORT:Logistiker|NTI-skolan|YH|Helsingborg|2 år|Gymnasieexamen|\n>>Visa fler\n>>Andra yrken\n>>Tillbaka till start'. 7) VIKTIGT: Om utbildningen INTE finns i Familjen Helsingborg (t.ex. universitetsprogram som läkarprogram, SYV, psykolog, jurist) - visa ALLTID både: (a) det nationella programmet med orten tydligt namngiven, OCH (b) 1-2 lokala alternativ från Familjen Helsingborg som bygger liknande kompetenser (t.ex. för SYV: Service Management, Strategisk kommunikation, Pedagogik). Skriv en kort mening som förklarar att de lokala alternativen är relaterade men inte samma yrke. Hitta ALDRIG på utbildningar, löner, CSN-belopp eller exakta behörighetskrav - om du är osäker på en skola/url, använd antagning.se; om du är osäker på lön/CSN/behörighet, säg det ungefär och hänvisa till csn.se, arbetsformedlingen.se eller en riktig SYV. KÄNDA NATIONELLA PROGRAM (använd dessa när relevant): KORT:Studie- och yrkesvägledarprogrammet|Malmö Universitet|Högskola|Malmö|3 år (180 hp)|Grundläggande behörighet|https://www.mau.se/utbildning/program/studie--och-yrkesvagledarprogrammet/; KORT:Studie- och yrkesvägledare|Stockholms Universitet|Högskola|Stockholm|3 år (180 hp)|Grundläggande behörighet|https://www.su.se; KORT:Studie- och yrkesvägledare|Umeå Universitet|Högskola|Umeå|3 år (180 hp)|Grundläggande behörighet|https://www.umu.se";

  // 30 Framtidsyrken
  var FRAMTIDSYRKEN = [
    // Vård & omsorg
    { namn:'Undersköterska', skola:'Skanevux', typ:'Yrkesvux', ort:'Helsingborg', langd:'1 år', krav:'Grundskola', url:'' },
    { namn:'Socionom', skola:'Malmö Universitet', typ:'Högskola', ort:'Malmö', langd:'3,5 år (210 hp)', krav:'Grundläggande behörighet', url:'' },
    { namn:'Tandsköterska', skola:'Komvux Helsingborg', typ:'Komvux', ort:'Helsingborg', langd:'1,5 år', krav:'Grundläggande behörighet', url:'' },
    { namn:'Sjuksköterska', skola:'Malmö Universitet', typ:'Högskola', ort:'Malmö', langd:'3 år (180 hp)', krav:'Grundläggande behörighet', url:'' },
    { namn:'Behandlingsassistent', skola:'Yrkeshögskolan Syd', typ:'YH', ort:'Malmö', langd:'2 år', krav:'Gymnasieexamen', url:'' },
    { namn:'Stödpedagog / Personlig assistent', skola:'Komvux Helsingborg', typ:'Komvux', ort:'Helsingborg', langd:'1 år', krav:'Grundläggande behörighet', url:'' },
    // IT & teknik
    { namn:'Systemutvecklare .NET', skola:'Medieinstitutet', typ:'YH', ort:'Helsingborg', langd:'2 år', krav:'Gymnasieexamen', url:'' },
    { namn:'Webbutvecklare', skola:'NTI-skolan', typ:'YH', ort:'Helsingborg', langd:'2 år', krav:'Gymnasieexamen', url:'' },
    { namn:'IT-tekniker / Support', skola:'Lernia', typ:'YH', ort:'Helsingborg', langd:'1,5 år', krav:'Gymnasieexamen', url:'' },
    { namn:'Cybersäkerhetsanalytiker', skola:'Yrgo', typ:'YH', ort:'Göteborg', langd:'2 år', krav:'Gymnasieexamen', url:'' },
    { namn:'Data scientist / AI', skola:'Hyper Island', typ:'YH', ort:'Malmö', langd:'2 år', krav:'Gymnasieexamen', url:'' },
    { namn:'Molnarkitekt / DevOps', skola:'EC Utbildning', typ:'YH', ort:'Malmö', langd:'2 år', krav:'Gymnasieexamen', url:'' },
    // Transport & logistik
    { namn:'Lokförare', skola:'Antagning.se', typ:'YH', ort:'Malmö', langd:'1,5 år', krav:'Gymnasieexamen + körkort B', url:'' },
    { namn:'Logistiker / Inköpare', skola:'Skanevux', typ:'YH', ort:'Helsingborg', langd:'2 år', krav:'Gymnasieexamen', url:'' },
    { namn:'Yrkesförare (buss / lastbil)', skola:'Trafikverkets förarutbildning', typ:'Yrkesutbildning', ort:'Helsingborg', langd:'3 månader', krav:'18 år + körkort B', url:'' },
    { namn:'Hamnarbetare / Godshanterare', skola:'Skanevux', typ:'Yrkesvux', ort:'Helsingborg', langd:'6 månader', krav:'Grundläggande behörighet', url:'' },
    // Bygg, industri & el
    { namn:'Elektriker', skola:'Skanevux', typ:'Yrkesvux', ort:'Helsingborg', langd:'2 år', krav:'Gymnasieexamen el/elprogrammet', url:'' },
    { namn:'VVS-montör', skola:'Skanevux', typ:'Yrkesvux', ort:'Helsingborg', langd:'2 år', krav:'Grundläggande behörighet', url:'' },
    { namn:'Svetsare', skola:'Skanevux', typ:'Yrkesvux', ort:'Helsingborg', langd:'1 år', krav:'Grundläggande behörighet', url:'' },
    { namn:'Fastighetsskötare', skola:'Yrkeshögskolan Syd', typ:'YH', ort:'Helsingborg', langd:'2 år', krav:'Gymnasieexamen', url:'' },
    // Ekonomi & administration
    { namn:'Redovisningsekonom', skola:'EC Utbildning', typ:'YH', ort:'Helsingborg', langd:'2 år', krav:'Gymnasieexamen', url:'' },
    { namn:'HR-administratör', skola:'Yrkeshögskolan Syd', typ:'YH', ort:'Malmö', langd:'2 år', krav:'Gymnasieexamen', url:'' },
    { namn:'Marknadsförare / Digital kommunikation', skola:'Skanevux', typ:'YH', ort:'Helsingborg', langd:'2 år', krav:'Gymnasieexamen', url:'' },
    { namn:'Jurist', skola:'Lunds Universitet', typ:'Högskola', ort:'Lund', langd:'4,5 år (270 hp)', krav:'Grundläggande behörighet', url:'' },
    // Utbildning & socialt
    { namn:'Förskollärare', skola:'Malmö Universitet', typ:'Högskola', ort:'Malmö', langd:'3,5 år (210 hp)', krav:'Grundläggande behörighet', url:'' },
    { namn:'Lärare (grundskola)', skola:'Malmö Universitet', typ:'Högskola', ort:'Malmö', langd:'4,5 år (270 hp)', krav:'Grundläggande behörighet', url:'' },
    { namn:'Socialsekreterare', skola:'Malmö Universitet', typ:'Högskola', ort:'Malmö', langd:'3,5 år (210 hp)', krav:'Grundläggande behörighet', url:'' },
    { namn:'Studie- och yrkesvägledare (SYV)', skola:'Malmö Universitet', typ:'Högskola', ort:'Malmö', langd:'3 år (180 hp)', krav:'Grundläggande behörighet', url:'https://mau.se/utbildning/program/studie--och-yrkesvagledarprogrammet/' },
    // Mat, service & hotell
    { namn:'Kock / Restaurangchef', skola:'Skanevux', typ:'Yrkesvux', ort:'Helsingborg', langd:'1,5 år', krav:'Grundläggande behörighet', url:'' },
    { namn:'Hotell, turism & event', skola:'EC Utbildning', typ:'YH', ort:'Helsingborg', langd:'2 år', krav:'Gymnasieexamen', url:'' }
  ];

  // HTML-escape — måste användas på ALL text från LLM:en och /api/utbildningar
  // innan den sätts via innerHTML (annars XSS via t.ex. <img onerror=...>).
  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // Navigationsalternativ (t.ex. "Tillbaka") ska alltid vara enkel-tryck och
  // aldrig kunna markeras ihop med innehåll i fler-val.
  function isNavReply(t) { return /tillbaka|visa fler|börja om|starta om/i.test(t || ''); }

  // Injicera fokus-stil en gång (WCAG 2.4.7/1.4.11 — tydlig tangentbordsfokus).
  var _aisyvStyled = false;
  function ensureAisyvStyles() {
    if (_aisyvStyled || typeof document === 'undefined' || !document.head) return;
    _aisyvStyled = true;
    var st = document.createElement('style');
    st.textContent = '.aisyv-choice:focus-visible,.aisyv-send:focus-visible{outline:3px solid #eafaf3;outline-offset:2px;}';
    document.head.appendChild(st);
  }

  // Bygg svarsboxar (förvalda svar som tappbara textrutor + en "Övrigt"-box).
  // Delas av de stora chattarna OCH övnings-chatten (exAiChat i index.html).
  //   opts.maxSelect : 1 (default) = ett klick skickar direkt (navigering).
  //                    >1 = fler-val: markera upp till N, "Skicka N →" skickar ihop.
  //   opts.onPick(text) : körs med valt svar (eller kommaseparerade val vid fler-val).
  //   opts.onOther()    : körs när användaren vill skriva eget (fokusera rutan).
  function buildChoiceBoxes(replies, opts) {
    opts = opts || {};
    ensureAisyvStyles();
    var maxSelect = opts.maxSelect || 1;
    var list = replies || [];
    var qDiv = document.createElement('div');
    qDiv.setAttribute('role', 'group');
    qDiv.style.cssText = 'margin-top:12px;display:flex;flex-direction:column;gap:8px;';

    var BASE_BG = 'rgba(62,180,137,0.10)', SEL_BG = 'rgba(62,180,137,0.30)';
    var selected = [];          // valda index (endast vid fler-val)
    var boxes = [];             // { btn, mark, text }
    var footer = null;

    function updateVisual() {
      boxes.forEach(function(b, i) {
        var on = selected.indexOf(i) !== -1;
        var checkable = maxSelect > 1 && !isNavReply(b.text);
        var capped = !on && checkable && selected.length >= maxSelect;
        b.btn.style.background = on ? SEL_BG : BASE_BG;
        b.btn.style.borderColor = on ? 'rgba(62,180,137,0.95)' : 'rgba(62,180,137,0.35)';
        b.btn.style.opacity = capped ? '0.45' : '1';
        // Markerbara alternativ visar en synlig kryssruta (☐/☑) + aria-pressed;
        // navigationsalternativ visar pil (enkel-tryck). Dekor-tecknen är aria-hidden.
        b.mark.textContent = checkable ? (on ? '☑' : '☐') : '›';
        if (checkable) b.btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        b.btn.setAttribute('aria-disabled', capped ? 'true' : 'false');
      });
      if (footer) {
        var n = selected.length;
        footer._hint.textContent = n ? (n + ' av ' + maxSelect + ' valda') : ('Välj upp till ' + maxSelect + ' – tryck sedan Skicka');
        footer._send.textContent = n ? ('Skicka ' + n + ' →') : 'Skicka';
        footer._send.disabled = !n;
        footer._send.style.opacity = n ? '1' : '0.5';
      }
    }

    list.forEach(function(qr, idx) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'aisyv-choice';
      btn.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;text-align:left;background:' + BASE_BG + ';border:1.5px solid rgba(62,180,137,0.35);border-radius:14px;padding:13px 15px;color:#eafaf3;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;-webkit-tap-highlight-color:transparent;line-height:1.35;transition:background .12s,border-color .12s,opacity .12s;';
      var lbl = document.createElement('span'); lbl.textContent = qr; lbl.style.cssText = 'flex:1;';
      var mark = document.createElement('span'); mark.setAttribute('aria-hidden', 'true'); mark.style.cssText = 'color:#3eb489;font-size:18px;font-weight:900;flex-shrink:0;width:16px;text-align:center;';
      btn.appendChild(lbl); btn.appendChild(mark);
      boxes.push({ btn: btn, mark: mark, text: qr });

      btn.addEventListener('click', function() {
        // Enkel-tryck vid maxSelect<=1 ELLER för navigationsalternativ (Tillbaka m.fl.)
        // — nav får aldrig markeras ihop med innehåll och skickas alltid direkt.
        if (maxSelect <= 1 || isNavReply(qr)) { if (opts.onPick) opts.onPick(qr); return; }
        var pos = selected.indexOf(idx);
        if (pos !== -1) selected.splice(pos, 1);
        else { if (selected.length >= maxSelect) return; selected.push(idx); }
        updateVisual();
      });
      qDiv.appendChild(btn);
    });

    // Fler-val: räknare (aria-live) + Skicka-knapp (äkta disabled)
    if (maxSelect > 1 && list.length) {
      footer = document.createElement('div');
      footer.style.cssText = 'display:flex;align-items:center;gap:10px;margin-top:2px;';
      var hint = document.createElement('span');
      hint.setAttribute('role', 'status'); hint.setAttribute('aria-live', 'polite');
      hint.style.cssText = 'font-size:12px;color:rgba(255,255,255,0.55);flex:1;';
      var send = document.createElement('button');
      send.type = 'button'; send.className = 'aisyv-send';
      send.style.cssText = 'background:linear-gradient(135deg,#3eb489,#10b981);border:none;border-radius:12px;padding:11px 18px;color:#fff;font-size:14px;font-weight:800;cursor:pointer;font-family:inherit;flex-shrink:0;';
      send.addEventListener('click', function() {
        if (!selected.length) return;
        var texts = selected.map(function(i){ return boxes[i].text; });
        qDiv.style.pointerEvents = 'none'; qDiv.style.opacity = '0.7';   // lås efter skick
        if (opts.onPick) opts.onPick(texts.join(', '));
      });
      footer._hint = hint; footer._send = send;
      footer.appendChild(hint); footer.appendChild(send);
      qDiv.appendChild(footer);
    }
    updateVisual();

    // "Övrigt" — skriv en egen fråga i rutan
    if (opts.onOther) {
      var other = document.createElement('button');
      other.type = 'button'; other.className = 'aisyv-choice';
      other.style.cssText = 'display:flex;align-items:center;gap:8px;width:100%;text-align:left;background:transparent;border:1.5px dashed rgba(255,255,255,0.22);border-radius:14px;padding:12px 15px;color:rgba(255,255,255,0.62);font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;-webkit-tap-highlight-color:transparent;';
      other.textContent = '✏️ Övrigt – skriv en egen fråga';
      other.addEventListener('mouseenter', function(){ other.style.background = 'rgba(255,255,255,0.04)'; });
      other.addEventListener('mouseleave', function(){ other.style.background = 'transparent'; });
      other.addEventListener('click', function(){ opts.onOther(); });
      qDiv.appendChild(other);
    }
    return qDiv;
  }

  /**
   * Starta AI-SYV på den aktuella sidan.
   * @param {Object} [options]
   * @param {boolean} [options.scopedStorage=false] user-scoped storage (_scopedGet/_scopedSet)
   * @param {boolean} [options.dualKeyRead=false]    getSaved läser båda nycklarna, tar längsta
   * @param {boolean} [options.sendLock=false]       isSending-lås + setChatLocked under svar
   */
  window.createAiSyv = function createAiSyv(options) {
    var cfg = options || {};
    var scopedStorage = !!cfg.scopedStorage;
    var dualKeyRead   = !!cfg.dualKeyRead;
    var sendLock      = !!cfg.sendLock;

    var eduHistory = [];
    var eduCurrentView = null;
    var eduData = null; // laddas från /api/utbildningar
    var EDU_SAVED_KEY = 'cvmatchen_edu_saved';
    var isSending = false; // 🔒 Lås (endast när sendLock)

    // Ladda utbildningsdata
    async function loadEduData() {
      if (eduData) return;
      try {
        var res = await fetch('/api/utbildningar');
        if (res.ok) eduData = await res.json();
      } catch(e) { eduData = { utbildningar: [], antal: 0 }; }
    }

    // Bygg AI system-prompt med riktig data
    function buildSystem() {
      var base = AISYV_SYSTEM_PROMPT;
      if (!eduData || !eduData.utbildningar || !eduData.utbildningar.length) return base;
      var lista = eduData.utbildningar.slice(0, 30).map(function(u) {
        return u.namn + ' (' + u.typ + ', ' + u.ort + ', ' + (u.langd || '') + ', krav: ' + (u.krav || '') + ', ' + u.url + ')';
      }).join('; ');
      return base + " REELLA UTBILDNINGAR I FAMILJEN HELSINGBORG (källa: " + (eduData.kalla || '') + "): " + lista + ". Använd dessa när det passar. Mer info: skanevux.se, myh.se, lu.se/campus-helsingborg.";
    }

    // ── Storage-primitiv (scoped vs rå) ──────────────────────────────────
    function _get(key) {
      // _scopedGet är global på mobilen; på desktop används localStorage direkt.
      return scopedStorage ? _scopedGet(key) : localStorage.getItem(key);
    }
    function _set(key, value) {
      if (scopedStorage) _scopedSet(key, value);
      else localStorage.setItem(key, value);
    }

    // Spara-funktioner
    function getSaved() {
      try {
        if (dualKeyRead) {
          // Läs från båda nycklarna och returnera den som har flest poster —
          // så datan inte försvinner om bara den ena synkats.
          var a = JSON.parse(_get(EDU_SAVED_KEY) || '[]');
          var b = JSON.parse(_get('pf_saved_edu') || '[]');
          return a.length >= b.length ? a : b;
        }
        return JSON.parse(_get(EDU_SAVED_KEY) || '[]');
      } catch(e) { return []; }
    }
    var _lastSavedEduCount = -1;
    function setSaved(arr) {
      // Skriv till BÅDA nycklarna så badge + lista är synkade
      try { _set(EDU_SAVED_KEY, JSON.stringify(arr)); } catch(e) {}
      try { _set('pf_saved_edu', JSON.stringify(arr)); } catch(e) {}
      if (typeof _sbSync === 'function') _sbSync('saved_edu', arr);
      // Logga bara när antalet ändras, inte vid init
      if (_lastSavedEduCount !== -1 && typeof logEvent === 'function') {
        if (arr.length > _lastSavedEduCount) {
          logEvent('edu_saved', { count: arr.length });
        } else if (arr.length < _lastSavedEduCount) {
          logEvent('edu_removed', { count: arr.length });
        }
      }
      _lastSavedEduCount = arr.length;
      updateSavedBadge();
    }
    function updateSavedBadge() {
      var n = getSaved().length;
      // Badge i Kort 4 (röd cirkel i hörnet)
      document.querySelectorAll('.edu-saved-count-badge').forEach(function(el) {
        if (n > 0) { el.textContent = n; el.style.display = 'block'; }
        else { el.style.display = 'none'; }
      });
      // Gamla .edu-saved-count (om den finns kvar någonstans)
      document.querySelectorAll('.edu-saved-count').forEach(function(el) {
        el.textContent = n > 0 ? '(' + n + ')' : '';
      });
    }

    // Alias för anrop från mobSwitchTab / switchView
    window.syvUpdateSavedBtn = updateSavedBadge;
    window.syvFetchUtbildningar = function() { loadEduData(); };
    window.showEduModal = showEduModal;
    window.showChat = showChat;
    window.showHome = showHome;

    // Global delegation: Läs-mer-länkar öppnar modal, Spara-knappar togglar bokmärke.
    document.addEventListener('click', function(e) {
      var link = e.target.closest('.edu-link-btn');
      if (link) { showEduModal(link.dataset.namn || '', link.dataset.url || ''); return; }
      var save = e.target.closest('.edu-save-btn');
      if (save) { toggleSaveBtn(save); }
    });

    // Toggla bokmärke från en Spara-knapp (event-delegerat). Uppdaterar knappens
    // utseende + badge. Matchning på namn+ort, samma nyckel som makeEduCard använder.
    function toggleSaveBtn(btn) {
      var prog = {
        namn: btn.dataset.namn || '', ort: btn.dataset.ort || '', skola: btn.dataset.skola || '',
        typ: btn.dataset.typ || '', krav: btn.dataset.krav || '', langd: btn.dataset.langd || '',
        url: btn.dataset.url || '',
        kommun: btn.dataset.ort || ''  // alias så handläggarvyn (läser 'kommun') visar orten
      };
      var arr = getSaved();
      var idx = arr.findIndex(function(s){ return s.namn === prog.namn && s.ort === prog.ort; });
      if (idx !== -1) {
        arr.splice(idx, 1);
        setSaved(arr);
        btn.textContent = '+ Spara';
        btn.style.background = 'rgba(62,180,137,0.12)';
        btn.style.border = '1.5px solid rgba(62,180,137,0.35)';
        btn.style.color = '#3eb489';
      } else {
        prog.sparad = new Date().toLocaleDateString('sv-SE');
        arr.push(prog);
        setSaved(arr);
        btn.textContent = '🔖 Sparad';
        btn.style.background = 'rgba(240,192,64,0.2)';
        btn.style.border = '1.5px solid rgba(240,192,64,0.5)';
        btn.style.color = '#f0c040';
      }
    }

    // CV-kontext
    function getCVContext() {
      try {
        var keys = ['cvData', 'PATHFINDER_CV', 'cvmatchen_cv'];
        var cvData = null;
        for (var k of keys) { var r = localStorage.getItem(k); if (r) { cvData = JSON.parse(r); break; } }
        if (!cvData) return '';
        var parts = [];
        if (cvData.name) parts.push('Namn: ' + cvData.name);
        if (cvData.title) parts.push('Yrke: ' + cvData.title);
        if (cvData.jobs && cvData.jobs.length) parts.push('Erfarenhet: ' + cvData.jobs.slice(0,3).map(function(j){ return j.title||''; }).join(', '));
        if (cvData.education && cvData.education.length) parts.push('Utbildning: ' + cvData.education.slice(0,2).map(function(e){ return e.degree||e.school||''; }).join(', '));
        if (cvData.skills && cvData.skills.length) parts.push('Kompetenser: ' + cvData.skills.slice(0,5).join(', '));
        return parts.length ? ' Användarens CV: ' + parts.join('. ') : '';
      } catch(e) { return ''; }
    }

    // Rendera text — rensa markdown, hantera LANK: och KORT:
    function renderText(rawText) {
      var lines = rawText.split('\n');
      var mainLines = [], quickReplies = [], cards = [];

      lines.forEach(function(line) {
        var t = line.trim();
        if (t.startsWith('>>')) {
          quickReplies.push(t.slice(2).trim());
        } else if (t.startsWith('KORT:')) {
          // Format: KORT:namn|skola|typ|ort|langd|krav|url
          var parts = t.slice(5).split('|');
          cards.push({ namn: parts[0]||'', skola: parts[1]||'', typ: parts[2]||'', ort: parts[3]||'', langd: parts[4]||'', krav: parts[5]||'', url: parts[6]||'' });
        } else if (t.startsWith('LANK:')) {
          var url = t.slice(5).trim();
          // Tillåt bara http(s) — blockera javascript:/data: och escapa som attribut.
          if (/^https?:\/\//i.test(url)) {
            var safeUrl = escapeHtml(url);
            var label = escapeHtml(url.replace(/^https?:\/\//, '').replace(/\/$/, ''));
            mainLines.push('<a href="' + safeUrl + '" target="_blank" rel="noopener" style="display:inline-block;margin-top:4px;background:rgba(62,180,137,0.12);border:1px solid rgba(62,180,137,0.3);border-radius:20px;padding:5px 12px;color:#3eb489;font-size:13px;font-weight:700;text-decoration:none;">🔗 ' + label + '</a>');
          } else {
            mainLines.push(escapeHtml(url)); // icke-http: visa som text, ingen aktiv länk
          }
        } else {
          // Escapa FÖRST, inför sedan endast kontrollerad markdown (<strong>/<em>).
          var cleaned = escapeHtml(line)
            .replace(/^#{1,3}\s*/g, '')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            .replace(/^---+$/, '');
          mainLines.push(cleaned);
        }
      });

      return { text: mainLines.join('\n').trim(), quickReplies: quickReplies, cards: cards };
    }

    // Utbildningskort (sparbart)
    function getSiteName(url) {
      if (url.includes('google.com')) return 'Google — sök efter utbildningen på kommunens webbplats';
      if (url.includes('antagning.se')) return 'antagning.se — nationell ansökningsportal';
      if (url.includes('myh.se')) return 'myh.se — Myndigheten för yrkeshögskolan';
      if (url.includes('arbetsformedlingen.se')) return 'arbetsformedlingen.se';
      return url.replace(/^https?:\/\//, '').split('/')[0];
    }

    function showEduModal(namn, url) {
      var modal = document.getElementById('edu-link-modal');
      var siteEl = document.getElementById('edu-modal-site');
      var namnEl = document.getElementById('edu-modal-namn');
      var goBtn  = document.getElementById('edu-modal-go');
      if (!modal) { window.open(url, '_blank'); return; }
      siteEl.textContent = getSiteName(url);
      namnEl.textContent = namn;
      goBtn.onclick = function() { window.open(url, '_blank'); modal.style.display = 'none'; };
      modal.style.display = 'flex';
    }

    // URL-generator baserat på utbildningstyp
    function getEduUrl(prog) {
      // Använd en riktig direktlänk från datan om den finns (t.ex. mau.se för SYV).
      if (prog.url && /^https?:\/\//i.test(prog.url)) return prog.url;
      var typ = (prog.typ || '').toLowerCase();
      // Rensa parenteser ur sök-query (t.ex. "Studie- och yrkesvägledare (SYV)").
      var namn = (prog.namn || '').replace(/\s*\([^)]*\)/g, '').trim();
      var q = encodeURIComponent([namn, prog.typ, prog.ort].filter(Boolean).join(' '));
      // YH + Högskola — officiell ansökningsportal
      if (typ === 'yh' || typ === 'hogskola' || typ === 'högskola') return 'https://www.antagning.se/se/search/?q=' + encodeURIComponent(namn);
      // AF-utbildning
      if (typ === 'af-utbildning') return 'https://arbetsformedlingen.se/utbildning/hitta-utbildningar';
      // Komvux/Yrkesvux/SFI m.fl. → kommunens vuxenutbildning (bättre landning än Google)
      if (typ === 'komvux' || typ === 'yrkesvux' || typ === 'sfi' || typ === 'yrkesutbildning' || typ === 'kombi sfi+yrke') return 'https://www.skanevux.se/';
      // Sista fallback
      return 'https://www.google.com/search?q=' + q;
    }

    function makeEduCard(prog) {
      var saved = getSaved().some(function(s){ return s.namn === prog.namn && s.ort === prog.ort; });
      var isSav = saved;
      var div = document.createElement('div');
      div.style.cssText = 'background:rgba(255,255,255,0.05);border:1px solid rgba(62,180,137,0.25);border-radius:16px;padding:14px 14px 12px;margin-top:10px;';
      var linkUrl = getEduUrl(prog);

      // Typ-badge färg
      var typeColors = { 'YH':'#a78bfa','Komvux':'#38bdf8','Yrkesvux':'#3eb489','Yrkesutbildning':'#3eb489','SFI':'#f0c040','Kombi SFI+Yrke':'#f0c040','Högskola':'#f87171','AF-utbildning':'#fb923c' };
      var tc = typeColors[prog.typ] || '#3eb489';

      // Escapa ALLA fält (namn/skola/etc. kommer från LLM/utbildningsdata) — XSS-skydd.
      var eNamn = escapeHtml(prog.namn||''), eOrt = escapeHtml(prog.ort||''), eSkola = escapeHtml(prog.skola||'');
      var eTyp = escapeHtml(prog.typ||''), eKrav = escapeHtml(prog.krav||''), eLangd = escapeHtml(prog.langd||'');
      var eUrl = escapeHtml(linkUrl);
      var eOrtLangd = escapeHtml([prog.ort, prog.langd].filter(Boolean).join(' · '));

      div.innerHTML =
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;">' +
          '<div style="flex:1;min-width:0;">' +
            // Typ-badge
            '<span style="background:' + tc + '22;border:1px solid ' + tc + '55;border-radius:6px;padding:2px 7px;font-size:10px;font-weight:800;color:' + tc + ';letter-spacing:0.5px;">' + eTyp + '</span>' +
            // Namn
            '<div style="font-size:15px;font-weight:900;color:#fff;margin:5px 0 2px;line-height:1.3;">' + eNamn + '</div>' +
            // Ort + längd
            '<div style="font-size:12px;color:rgba(255, 255, 255, 0.72);margin-bottom:6px;">' + eOrtLangd + '</div>' +
            // Krav
            (prog.krav ? '<span style="background:rgba(240,192,64,0.12);border:1px solid rgba(240,192,64,0.3);border-radius:8px;padding:3px 8px;font-size:11px;color:#f0c040;font-weight:700;">Krav: ' + eKrav + '</span>' : '') +
          '</div>' +
          // Spara-knapp
          '<button class="edu-save-btn" data-namn="' + eNamn + '" data-ort="' + eOrt + '" data-skola="' + eSkola + '" data-typ="' + eTyp + '" data-krav="' + eKrav + '" data-langd="' + eLangd + '" data-url="' + eUrl + '" style="flex-shrink:0;align-self:flex-start;background:' + (isSav?'rgba(240,192,64,0.2)':'rgba(62,180,137,0.12)') + ';border:1.5px solid ' + (isSav?'rgba(240,192,64,0.5)':'rgba(62,180,137,0.35)') + ';border-radius:20px;padding:7px 13px;color:' + (isSav?'#f0c040':'#3eb489') + ';font-size:13px;font-weight:800;cursor:pointer;font-family:inherit;-webkit-tap-highlight-color:transparent;white-space:nowrap;">' + (isSav?'🔖 Sparad':'+ Spara') + '</button>' +
        '</div>' +
        // Läs mer-länk
        '<button class="edu-link-btn" data-namn="' + eNamn + '" data-url="' + eUrl + '" style="background:none;border:none;display:inline-flex;align-items:center;gap:4px;margin-top:10px;font-size:12px;color:#3eb489;text-decoration:none;font-weight:700;cursor:pointer;font-family:inherit;padding:0;">🔗 Sök utbildningen</button>';
      return div;
    }

    // Lägg till bot-bubbla. boxOpts.maxSelect styr svarsboxarna:
    //   default 3 (AI-svar → markera upp till 3), 1 för navigerings-meddelanden.
    function addBot(rawText, boxOpts) {
      boxOpts = boxOpts || {};
      var maxSelect = (boxOpts.maxSelect != null) ? boxOpts.maxSelect : 3;
      var msgs = document.getElementById('edu-messages');
      if (!msgs) return;

      var parsed = renderText(rawText);

      var wrapper = document.createElement('div');
      wrapper.style.cssText = 'display:flex;align-items:flex-start;gap:10px;';

      var av = document.createElement('div');
      av.setAttribute('aria-hidden', 'true');
      av.style.cssText = 'width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#3eb489,#10b981);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;margin-top:2px;';
      av.textContent = '🤖';

      var bubble = document.createElement('div');
      bubble.style.cssText = 'background:#1e2545;border:1px solid rgba(62,180,137,0.2);border-radius:18px;border-bottom-left-radius:4px;padding:13px 16px;max-width:85%;';

      // Huvudtext
      var textEl = document.createElement('div');
      textEl.style.cssText = 'font-size:16px;color:rgba(255,255,255,0.92);line-height:1.65;white-space:pre-wrap;';
      textEl.innerHTML = parsed.text;
      bubble.appendChild(textEl);

      // Utbildningskort
      parsed.cards.forEach(function(prog) {
        bubble.appendChild(makeEduCard(prog));
      });

      // Snabbsvar — förvalda svarsalternativ som fulla textrutor (delad hjälpare).
      if (parsed.quickReplies.length) {
        bubble.appendChild(buildChoiceBoxes(parsed.quickReplies, {
          maxSelect: maxSelect,
          onPick: function(qr) {
            if (qr.toLowerCase().includes('tillbaka')) showHome();
            else sendMessage(qr);
          },
          onOther: function() {
            var i = document.getElementById('edu-input');
            if (i) { i.focus(); i.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
          }
        }));
      }

      // Bredda bubblan när den innehåller kort eller svarsboxar — större tappmål.
      if (parsed.cards.length || parsed.quickReplies.length) bubble.style.maxWidth = '92%';

      wrapper.appendChild(av);
      wrapper.appendChild(bubble);
      msgs.appendChild(wrapper);

      // Scroll smart
      setTimeout(function() {
        var h = wrapper.offsetHeight, ch = msgs.clientHeight;
        if (h < ch * 0.65) msgs.scrollTop = msgs.scrollHeight;
        else wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);

      eduHistory.push({ role: 'assistant', content: rawText });
    }

    function addUser(text) {
      var msgs = document.getElementById('edu-messages');
      if (!msgs) return;
      var div = document.createElement('div');
      div.style.cssText = 'display:flex;justify-content:flex-end;';
      var b = document.createElement('div');
      b.style.cssText = 'background:linear-gradient(135deg,#3eb489,#10b981);border-radius:18px;border-bottom-right-radius:4px;padding:12px 16px;max-width:80%;font-size:16px;color:#fff;line-height:1.5;word-break:break-word;';
      b.textContent = text;
      div.appendChild(b); msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
      eduHistory.push({ role: 'user', content: text });
    }

    function showTyping() {
      var msgs = document.getElementById('edu-messages');
      if (!msgs) return;
      var d = document.createElement('div');
      d.id = 'edu-typing';
      d.style.cssText = 'display:flex;align-items:center;gap:10px;';
      d.innerHTML = '<div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#3eb489,#10b981);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">🤖</div><div style="background:#1e2545;border:1px solid rgba(62,180,137,0.2);border-radius:18px;border-bottom-left-radius:4px;padding:12px 16px;display:flex;align-items:center;gap:8px;"><span id="edu-hg" style="font-size:18px;display:inline-block;">⏳</span><span style="color:rgba(255, 255, 255, 0.72);font-size:14px;">Tänker...</span></div>';
      msgs.appendChild(d);
      msgs.scrollTop = msgs.scrollHeight;
      // Animera timglaset
      var hg = d.querySelector('#edu-hg');
      var frames = ['⏳','⌛','⏳','⌛'];
      var fi = 0;
      d._timer = setInterval(function() { if(hg) hg.textContent = frames[fi++ % frames.length]; }, 600);
    }
    function hideTyping() {
      var t = document.getElementById('edu-typing');
      if (t) { if(t._timer) clearInterval(t._timer); t.remove(); }
    }

    async function sendMessage(text) {
      if (!text || !text.trim()) return;
      if (sendLock) {
        if (isSending) return; // 🔒 Förhindra parallella frågor innan svar kommit
        isSending = true;
      }

      var inp = document.getElementById('edu-input');
      var btn = document.getElementById('edu-send');
      if (inp) { inp.value = ''; inp.style.height = 'auto'; }
      if (btn) { btn.disabled = true; btn.style.opacity = '0.5'; }
      if (sendLock) setChatLocked(true); // dimmar chips + inputfält

      addUser(text);
      showTyping();
      await loadEduData(); // se till att data finns

      var cvCtx = (eduCurrentView === 'cv-match') ? getCVContext() : '';
      var system = buildSystem() + (cvCtx ? ' ' + cvCtx : '');
      var messages = eduHistory.filter(function(m){ return m.role==='user'||m.role==='assistant'; });

      try {
        var resp = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 800, system: system, messages: messages })
        });
        var data = await resp.json();
        var reply = (data.content||[]).filter(function(b){return b.type==='text';}).map(function(b){return b.text;}).join('').trim() || 'Något gick fel.';
        hideTyping(); addBot(reply);
      } catch(e) {
        hideTyping(); addBot('Kunde inte ansluta.\n\n>>Försök igen\n>>Tillbaka till start', { maxSelect: 1 });
      } finally {
        if (btn) { btn.disabled = false; btn.style.opacity = '1'; }
        if (sendLock) { setChatLocked(false); isSending = false; }
      }
    }

    // Hjälpare för att låsa/låsa upp chatten visuellt
    function setChatLocked(locked) {
      var chat = document.getElementById('edu-chat');
      if (!chat) return;
      if (locked) chat.classList.add('edu-chat-locked');
      else chat.classList.remove('edu-chat-locked');
    }

    function showChat(viewKey) {
      eduCurrentView = viewKey;
      eduHistory = [];
      var home = document.getElementById('edu-home');
      var chat = document.getElementById('edu-chat');
      var title = document.getElementById('edu-chat-title');
      var msgs = document.getElementById('edu-messages');
      var titles = { 'region':'🗺️ Familjen Helsingborg', 'cv-match':'🤖 Matchar ditt CV', 'search':'🤖 Din AI-SYV', 'saved':'🔖 Sparade utbildningar' };
      if (home) home.style.display = 'none';
      if (chat) { chat.style.display = 'flex'; chat.style.flexDirection = 'column'; }
      if (title) title.textContent = titles[viewKey] || 'Utbildningar';
      if (msgs) msgs.innerHTML = '';

      if (viewKey === 'saved') { showSavedList(); return; }

      loadEduData().then(function() {
        if (viewKey === 'cv-match') {
          // CV-kontexten läggs bara i systemprompten (via sendMessage för cv-match),
          // aldrig i den synliga användarbubblan och aldrig dubbelt.
          var hasCV = !!getCVContext();
          var prompt = hasCV
            ? 'Matcha utbildningar i Familjen Helsingborg mot mitt CV. Ge 2-3 förslag med KORT-format.'
            : 'Jag vill hitta utbildningar. Ställ mig frågor om vad jag vill göra och min bakgrund.';
          addBot('Analyserar din bakgrund...');
          setTimeout(function(){ sendMessage(prompt); }, 400);
        } else {
          var openers = {
            'region': 'Hej! Jag hjälper dig hitta utbildningar i Familjen Helsingborg.\n\nVilken typ letar du efter?\n\n>>Yrkesutbildning / Komvux\n>>Yrkeshögskola (YH)\n>>Jag vet inte - hjälp mig!',
            'search': 'Hej! Fråga mig vad som helst om utbildningar och studier.\n\n>>Vad tjänar man som sjuksköterska?\n>>Vilka YH-utbildningar finns i Helsingborg?\n>>Hur söker man till Komvux?'
          };
          setTimeout(function(){ addBot(openers[viewKey]||'Hur kan jag hjälpa dig?', { maxSelect: 1 }); }, 200);
        }
      });
    }

    function showSavedList() {
      var msgs = document.getElementById('edu-messages');
      if (!msgs) return;
      var saved = getSaved();
      if (!saved.length) {
        addBot('Du har inga sparade utbildningar än.\n\nNär AI nämner en utbildning visas ett kort med en Spara-knapp!\n\n>>Utforska Familjen Helsingborg\n>>Fråga AI-SYV', { maxSelect: 1 });
        return;
      }
      var wrapper = document.createElement('div');
      wrapper.style.cssText = 'display:flex;align-items:flex-start;gap:10px;';
      var av = document.createElement('div');
      av.style.cssText = 'width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#3eb489,#10b981);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;';
      av.textContent = '🤖';
      var bubble = document.createElement('div');
      bubble.style.cssText = 'background:#1e2545;border:1px solid rgba(62,180,137,0.2);border-radius:18px;border-bottom-left-radius:4px;padding:13px 16px;max-width:92%;width:100%;';
      var hdr = document.createElement('div');
      hdr.style.cssText = 'font-size:16px;color:#fff;font-weight:700;margin-bottom:10px;';
      hdr.textContent = 'Dina sparade utbildningar (' + saved.length + ')';
      bubble.appendChild(hdr);
      saved.forEach(function(prog, i) {
        var card = document.createElement('div');
        card.style.cssText = 'background:rgba(255,255,255,0.04);border:1px solid rgba(62,180,137,0.2);border-radius:12px;padding:12px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;gap:8px;';
        var sNamn = escapeHtml(prog.namn||''), sUrl = escapeHtml(getEduUrl(prog));
        var sMeta = escapeHtml([prog.typ,prog.ort,prog.skola].filter(Boolean).join(' · '));
        var sKrav = escapeHtml(prog.krav||''), sSparad = escapeHtml(prog.sparad||'');
        card.innerHTML =
          '<div style="flex:1;">' +
            '<div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:2px;">' + sNamn + '</div>' +
            '<div style="font-size:12px;color:rgba(255, 255, 255, 0.72);margin-bottom:6px;">' + sMeta + '</div>' +
            (prog.krav ? '<span style="background:rgba(240,192,64,0.12);border:1px solid rgba(240,192,64,0.25);border-radius:8px;padding:2px 7px;font-size:11px;color:#f0c040;font-weight:600;">Krav: ' + sKrav + '</span>' : '') +
            '<br><button class="edu-link-btn" data-namn="' + sNamn + '" data-url="' + sUrl + '" style="background:none;border:none;display:inline-flex;align-items:center;gap:4px;margin-top:6px;font-size:12px;color:#3eb489;font-weight:600;cursor:pointer;font-family:inherit;padding:0;">🔗 Sök utbildningen</button>' +
            '<div style="font-size:10px;color:rgba(255, 255, 255, 0.72);margin-top:4px;">Sparad ' + sSparad + '</div>' +
          '</div>';
        var rmBtn = document.createElement('button');
        rmBtn.type = 'button';
        rmBtn.setAttribute('aria-label', 'Ta bort utbildning');
        rmBtn.textContent = '✕';
        rmBtn.style.cssText = 'background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.3);border-radius:8px;padding:5px 10px;color:#ef4444;font-size:13px;cursor:pointer;font-family:inherit;flex-shrink:0;';
        rmBtn.addEventListener('click', function() {
          var arr = getSaved(); arr.splice(i,1); setSaved(arr);
          msgs.innerHTML = ''; showSavedList();
        });
        card.appendChild(rmBtn);
        bubble.appendChild(card);
      });
      wrapper.appendChild(av); wrapper.appendChild(bubble);
      msgs.appendChild(wrapper);
      msgs.scrollTop = msgs.scrollHeight;
    }

    function showFramtidsyrken() {
      var home = document.getElementById('edu-home');
      var chat = document.getElementById('edu-chat');
      var framtid = document.getElementById('edu-framtidsyrken');
      if (home) home.style.display = 'none';
      if (chat) chat.style.display = 'none';
      if (framtid) { framtid.style.display = 'flex'; framtid.style.flexDirection = 'column'; }
      // Rendera kort om inte redan gjort
      var list = document.getElementById('edu-framtidsyrken-list');
      if (list && list.children.length === 0) {
        FRAMTIDSYRKEN.forEach(function(prog) {
          list.appendChild(makeEduCard(prog));
        });
      }
    }

    function showHome() {
      var home = document.getElementById('edu-home');
      var chat = document.getElementById('edu-chat');
      var framtid = document.getElementById('edu-framtidsyrken');
      if (home) home.style.display = '';
      if (chat) chat.style.display = 'none';
      if (framtid) framtid.style.display = 'none';
      eduCurrentView = null; eduHistory = [];
      updateSavedBadge();
    }

    function init() {
      // Ladda data i bakgrunden direkt
      loadEduData();
      updateSavedBadge();

      document.querySelectorAll('.edu-card').forEach(function(card) {
        card.addEventListener('click', function() {
          var v = card.getAttribute('data-view');
          if (v === 'framtidsyrken') showFramtidsyrken();
          else if (v) showChat(v);
        });
      });

      var backBtn = document.getElementById('edu-back');
      if (backBtn) backBtn.addEventListener('click', showHome);

      var backFramtid = document.getElementById('edu-back-framtid');
      if (backFramtid) backFramtid.addEventListener('click', showHome);

      var backBtmBtn = document.getElementById('edu-back-bottom');
      if (backBtmBtn) backBtmBtn.addEventListener('click', showHome);

      var sendBtn = document.getElementById('edu-send');
      if (sendBtn) sendBtn.addEventListener('click', function() {
        var inp = document.getElementById('edu-input');
        if (inp) sendMessage(inp.value.trim());
      });

      var inp = document.getElementById('edu-input');
      if (inp) {
        inp.addEventListener('keydown', function(e) {
          if (e.key==='Enter'&&!e.shiftKey) { e.preventDefault(); sendMessage(inp.value.trim()); }
        });
        inp.addEventListener('input', function() {
          this.style.height = 'auto';
          this.style.height = Math.min(this.scrollHeight,100)+'px';
        });
      }

      // Spara via event delegation — chatt + framtidsyrken
      function wireSaveDelegate(container) {
        if (!container) return;
        container.addEventListener('click', function(e) {
          var btn = e.target.closest('.edu-save-btn, .edu-link-btn');
          if (btn && btn.classList.contains('edu-link-btn')) {
            var url = btn.dataset.url;
            var namn = btn.dataset.namn;
            if (url) showEduModal(namn, url);
          }
        });
      }

      wireSaveDelegate(document.getElementById('edu-messages'));
      wireSaveDelegate(document.getElementById('edu-framtidsyrken-list'));
    }

    // Kör init när sidan laddat. Om DOM redan är klar (modulen laddades sent),
    // kör direkt så init inte missas.
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }

    // Exponera ett litet API för ev. framtida bruk (lekplats etc.)
    return {
      showChat: showChat,
      showHome: showHome,
      showFramtidsyrken: showFramtidsyrken,
      sendMessage: sendMessage,
      updateSavedBadge: updateSavedBadge,
      buildSystem: buildSystem,
      getSaved: getSaved
    };
  };

  // Exponera prompt + data för lekplats/återanvändning
  window.createAiSyv.AISYV_BASE = AISYV_BASE;                     // format-neutral persona-bas
  window.createAiSyv.AISYV_SYSTEM_PROMPT = AISYV_SYSTEM_PROMPT;   // bas + KORT-regler (stora chattarna)
  window.createAiSyv.FRAMTIDSYRKEN = FRAMTIDSYRKEN;
  window.createAiSyv.buildChoiceBoxes = buildChoiceBoxes;        // delad svarsbox-rendering (även exAiChat)
})();
