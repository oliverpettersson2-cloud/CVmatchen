/* ============================================================
   CVmatchen — Språkträning (yrkessvenska)
   ------------------------------------------------------------
   Fristående modul, samma mönster som intervju.js:
   bygger sitt eget UI i #trainView-sprak, exponerar bara
   window.sprInit() och window.sprCleanup().

   FAS 1 — medvetet INGA nivåpåståenden (GERS/CEFR).
   Nivåbedömning kräver validerade testuppgifter och jämförelse
   mot deltagarnas faktiska sfi-betyg. Den byggs när det finns
   deltagare att validera mot, inte före.
   ============================================================ */
(function () {
  'use strict';

  function $(sel, root) { return (root || document).querySelector(sel); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function shuffle(a) {
    var r = a.slice();
    for (var i = r.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = r[i]; r[i] = r[j]; r[j] = t;
    }
    return r;
  }

  // ── Innehåll ────────────────────────────────────────────────
  // Yrkessvenska för de branscher programmet riktar sig mot.
  // Ord: { o: ordet, b: betydelse, e: exempelmening }
  // Fraser: { f: frasen, n: när man säger den }
  var CONTENT = {
    vard: {
      namn: 'Vård & omsorg',
      ikon: '🩺',
      ord: [
        { o: 'brukare', b: 'Person som får hjälp av omsorgen', e: 'Jag hjälper tre brukare på förmiddagen.' },
        { o: 'förflyttning', b: 'Att hjälpa någon byta plats eller ställning', e: 'Vi gör förflyttningen tillsammans, aldrig ensam.' },
        { o: 'dokumentation', b: 'Att skriva ned vad som gjorts', e: 'Dokumentationen görs i slutet av passet.' },
        { o: 'avvikelse', b: 'När något inte blev som det skulle', e: 'Jag skrev en avvikelse efter fallet.' },
        { o: 'delegering', b: 'Tillåtelse att utföra en uppgift från sjuksköterska', e: 'Jag har delegering för att ge medicin.' },
        { o: 'hygienrutin', b: 'Regler för att hindra smitta', e: 'Hygienrutinen gäller före varje besök.' },
        { o: 'bemötande', b: 'Hur du talar med och behandlar någon', e: 'Ett bra bemötande skapar trygghet.' },
        { o: 'sekretess', b: 'Tystnadsplikt om det du får veta', e: 'Sekretessen gäller även efter arbetspasset.' },
        { o: 'rapportering', b: 'Att lämna över information till nästa pass', e: 'Rapporteringen sker klockan 14.' },
        { o: 'vårdplan', b: 'Skriftlig plan för en persons vård', e: 'Det står i hennes vårdplan.' },
        { o: 'trycksår', b: 'Sår som uppstår av att ligga eller sitta still', e: 'Vi vänder henne för att undvika trycksår.' },
        { o: 'anhörig', b: 'Nära släkting till brukaren', e: 'Anhöriga ringer ofta på eftermiddagen.' },
        { o: 'larm', b: 'Signal när någon behöver hjälp', e: 'Larmet gick klockan tre i natt.' },
        { o: 'skyddsutrustning', b: 'Handskar, förkläde och munskydd', e: 'Ta på skyddsutrustning innan du går in.' }
      ],
      fraser: [
        { f: 'Hej, jag heter … och jag arbetar här idag.', n: 'När du möter en brukare första gången' },
        { f: 'Är det okej om jag hjälper dig med detta?', n: 'Innan du börjar hjälpa någon' },
        { f: 'Kan du säga till om det gör ont?', n: 'Vid förflyttning eller omvårdnad' },
        { f: 'Jag förstår inte riktigt, kan du förklara en gång till?', n: 'När du är osäker på en instruktion' },
        { f: 'Jag behöver fråga min kollega om det här.', n: 'När något ligger utanför din delegering' },
        { f: 'Jag skriver en avvikelse så att det blir dokumenterat.', n: 'När något gått fel' },
        { f: 'Vill du ha hjälp nu eller om en liten stund?', n: 'För att ge brukaren inflytande' },
        { f: 'Jag kommer tillbaka om tjugo minuter.', n: 'När du lämnar ett rum' }
      ],
      texter: [
        {
          titel: 'Ett arbetspass på morgonen',
          text: 'Passet börjar klockan sju. Först läser jag rapporten från natten. Där står det vad som hänt och om någon mått dåligt. Sedan går jag till den första brukaren. Jag knackar på dörren och säger mitt namn innan jag går in. Vi gör morgonomvårdnaden tillsammans, i den takt hon orkar. Innan jag går frågar jag om hon vill ha något mer. I slutet av passet dokumenterar jag vad jag gjort.',
          fragor: [
            { q: 'Vad gör personen allra först på passet?', alt: ['Läser rapporten från natten', 'Ringer anhöriga', 'Skriver dokumentation'], ratt: 0 },
            { q: 'Vad gör hon innan hon går in i rummet?', alt: ['Tar på sig skyddsutrustning', 'Knackar och säger sitt namn', 'Ringer sjuksköterskan'], ratt: 1 },
            { q: 'När sker dokumentationen?', alt: ['Direkt på morgonen', 'Mitt i passet', 'I slutet av passet'], ratt: 2 }
          ]
        }
      ]
    },

    lager: {
      namn: 'Lager & logistik',
      ikon: '📦',
      ord: [
        { o: 'plocklista', b: 'Lista över varor du ska hämta', e: 'Plocklistan finns i handdatorn.' },
        { o: 'pall', b: 'Träunderlag som varor staplas på', e: 'Ställ pallen vid port tre.' },
        { o: 'truck', b: 'Fordon som lyfter och flyttar gods', e: 'Du behöver truckkort för att köra truck.' },
        { o: 'godsmottagning', b: 'Där varor kommer in till lagret', e: 'Leveransen står kvar i godsmottagningen.' },
        { o: 'inventering', b: 'Att räkna vad som finns i lager', e: 'Inventeringen görs en gång i månaden.' },
        { o: 'orderplock', b: 'Att plocka ihop en kunds beställning', e: 'Jag jobbar med orderplock på eftermiddagen.' },
        { o: 'streckkod', b: 'Randig kod som skannas', e: 'Skanna streckkoden innan du packar.' },
        { o: 'emballage', b: 'Material som skyddar varan', e: 'Vi återvinner allt emballage.' },
        { o: 'skyddssko', b: 'Sko med stålhätta', e: 'Skyddsskor är obligatoriska på lagret.' },
        { o: 'lastkaj', b: 'Plats där lastbilar lastar av', e: 'Bilen backar in mot lastkajen.' },
        { o: 'reklamation', b: 'Klagomål på en vara som är fel', e: 'Kunden har gjort en reklamation.' },
        { o: 'saldo', b: 'Antal som finns kvar i systemet', e: 'Saldot stämmer inte med hyllan.' },
        { o: 'skiftgång', b: 'Att arbeta olika tider i turer', e: 'Vi har skiftgång morgon och kväll.' },
        { o: 'ergonomi', b: 'Att arbeta så kroppen inte tar skada', e: 'Tänk på ergonomin när du lyfter.' }
      ],
      fraser: [
        { f: 'Var ska den här pallen stå?', n: 'När du är osäker på placering' },
        { f: 'Jag hittar inte artikeln på plocklistan.', n: 'När en vara saknas' },
        { f: 'Kan du visa mig hur handdatorn fungerar?', n: 'När du är ny' },
        { f: 'Saldot stämmer inte, ska jag rapportera det?', n: 'Vid fel i lagersystemet' },
        { f: 'Jag behöver hjälp med ett tungt lyft.', n: 'För att undvika skada' },
        { f: 'Är det okej att jag tar rast nu?', n: 'Innan du går på rast' },
        { f: 'Vilken tid börjar mitt skift imorgon?', n: 'För att dubbelkolla schemat' },
        { f: 'Den här varan är skadad, vad gör jag med den?', n: 'Vid trasigt gods' }
      ],
      texter: [
        {
          titel: 'Säkerhet på lagret',
          text: 'På ett lager finns det regler som alla måste följa. Du ska alltid ha skyddsskor. När en truck kör i närheten ska du stanna och vänta — föraren ser dig inte alltid. Tunga lyft gör du med rak rygg och böjda knän, och behöver du hjälp ber du en kollega. Om något går sönder eller någon skadar sig ska det rapporteras samma dag. Det är inte för att någon ska få skulden, utan för att det inte ska hända igen.',
          fragor: [
            { q: 'Vad gör du när en truck kör nära?', alt: ['Går snabbt förbi', 'Stannar och väntar', 'Ropar till föraren'], ratt: 1 },
            { q: 'Hur lyfter du tungt?', alt: ['Rak rygg och böjda knän', 'Böjd rygg och raka ben', 'Så snabbt som möjligt'], ratt: 0 },
            { q: 'Varför rapporteras olyckor?', alt: ['För att någon ska få skulden', 'För att det inte ska hända igen', 'För statistiken'], ratt: 1 }
          ]
        }
      ]
    },

    service: {
      namn: 'Service & handel',
      ikon: '🛒',
      ord: [
        { o: 'kundbemötande', b: 'Hur du tar emot och talar med kunder', e: 'Bra kundbemötande gör att folk kommer tillbaka.' },
        { o: 'kassa', b: 'Där kunden betalar', e: 'Kan du ta över i kassan?' },
        { o: 'växel', b: 'Pengar tillbaka vid kontant betalning', e: 'Här är din växel.' },
        { o: 'kvitto', b: 'Papper som visar vad du köpt', e: 'Vill du ha kvittot?' },
        { o: 'öppettider', b: 'När butiken är öppen', e: 'Våra öppettider står på dörren.' },
        { o: 'lagersaldo', b: 'Hur många varor som finns kvar', e: 'Jag kollar lagersaldot åt dig.' },
        { o: 'exponering', b: 'Hur varor ställs fram för att synas', e: 'Exponeringen byts varje vecka.' },
        { o: 'påfyllning', b: 'Att fylla på tomma hyllor', e: 'Påfyllningen görs på morgonen.' },
        { o: 'returer', b: 'Varor kunden lämnar tillbaka', e: 'Returer tar vi emot inom 30 dagar.' },
        { o: 'bytesrätt', b: 'Rätt att byta en vara', e: 'Du har bytesrätt med kvitto.' },
        { o: 'allergen', b: 'Ämne som kan ge allergi', e: 'Allergener står i innehållsförteckningen.' },
        { o: 'svinn', b: 'Varor som slängs eller försvinner', e: 'Vi arbetar för att minska svinnet.' },
        { o: 'inventering', b: 'Att räkna varulagret', e: 'Inventering sker i januari.' },
        { o: 'schemaläggning', b: 'Planering av arbetstider', e: 'Schemaläggningen kommer två veckor i förväg.' }
      ],
      fraser: [
        { f: 'Hej, kan jag hjälpa dig med något?', n: 'När en kund ser ut att leta' },
        { f: 'Ett ögonblick, jag kollar om vi har den.', n: 'När kunden frågar efter en vara' },
        { f: 'Tyvärr är den slut just nu, men den kommer på torsdag.', n: 'När en vara saknas' },
        { f: 'Jag förstår att det är tråkigt. Jag ska se vad jag kan göra.', n: 'Vid ett klagomål' },
        { f: 'Vill du betala med kort eller kontant?', n: 'I kassan' },
        { f: 'Jag frågar min chef och återkommer.', n: 'När du inte får besluta själv' },
        { f: 'Tack och välkommen åter!', n: 'När kunden går' },
        { f: 'Kan du upprepa det? Jag hörde inte riktigt.', n: 'När du inte uppfattar kunden' }
      ],
      texter: [
        {
          titel: 'Att möta en missnöjd kund',
          text: 'Ibland är en kund arg eller besviken. Det handlar nästan aldrig om dig personligen. Det första du gör är att lyssna färdigt utan att avbryta. Sedan säger du att du förstår, och frågar vad kunden vill ska hända. Om du kan lösa det gör du det direkt. Kan du inte det säger du ärligt att du behöver fråga någon annan, och du säger när du kommer tillbaka. De flesta blir lugnare bara av att någon lyssnar ordentligt.',
          fragor: [
            { q: 'Vad gör du först när en kund är arg?', alt: ['Förklarar reglerna', 'Lyssnar färdigt', 'Hämtar chefen'], ratt: 1 },
            { q: 'Vad gör du om du inte kan lösa problemet?', alt: ['Säger att det inte går', 'Säger ärligt att du frågar någon annan', 'Ber kunden ringa senare'], ratt: 1 },
            { q: 'Vad lugnar de flesta kunder?', alt: ['Att få pengarna tillbaka', 'Att någon lyssnar ordentligt', 'Att få tala med chefen'], ratt: 1 }
          ]
        }
      ]
    },

    bygg: {
      namn: 'Bygg & anläggning',
      ikon: '🔨',
      ord: [
        { o: 'ställning', b: 'Konstruktion att stå på vid arbete på höjd', e: 'Ställningen ska kontrolleras varje vecka.' },
        { o: 'skyddsräcke', b: 'Räcke som hindrar fall', e: 'Sätt upp skyddsräcke innan ni börjar.' },
        { o: 'arbetsmiljö', b: 'Hur säkert och bra arbetsplatsen är', e: 'Arbetsmiljön är allas ansvar.' },
        { o: 'skyddsrond', b: 'Genomgång av säkerheten på bygget', e: 'Vi har skyddsrond på fredag.' },
        { o: 'ritning', b: 'Teckning som visar hur något ska byggas', e: 'Det står på ritningen.' },
        { o: 'måttband', b: 'Verktyg för att mäta längd', e: 'Har du ett måttband?' },
        { o: 'vattenpass', b: 'Verktyg som visar om något är rakt', e: 'Kolla med vattenpasset.' },
        { o: 'gjutning', b: 'Att hälla betong i en form', e: 'Gjutningen sker på tisdag.' },
        { o: 'armering', b: 'Järn som förstärker betong', e: 'Armeringen läggs före gjutningen.' },
        { o: 'bärlager', b: 'Lager som bär upp en yta', e: 'Bärlagret ska packas ordentligt.' },
        { o: 'fallskydd', b: 'Utrustning som skyddar vid fall', e: 'Fallskydd krävs över två meter.' },
        { o: 'hjälm', b: 'Skydd för huvudet', e: 'Hjälm gäller på hela området.' },
        { o: 'byggarbetsplats', b: 'Platsen där bygget sker', e: 'Obehöriga får inte vistas på byggarbetsplatsen.' },
        { o: 'egenkontroll', b: 'Att själv kontrollera sitt arbete', e: 'Fyll i egenkontrollen när du är klar.' }
      ],
      fraser: [
        { f: 'Var ska jag börja idag?', n: 'I början av arbetsdagen' },
        { f: 'Jag har inte gjort det här förut, kan du visa?', n: 'Vid en ny arbetsuppgift' },
        { f: 'Vilken skyddsutrustning behöver jag här?', n: 'Innan du går in på ett område' },
        { f: 'Det här känns inte säkert, kan vi titta på det?', n: 'När du ser en risk' },
        { f: 'Vilket mått ska det vara?', n: 'När du är osäker på ritningen' },
        { f: 'Kan du hjälpa mig bära?', n: 'Vid tunga lyft' },
        { f: 'När är rasten?', n: 'Vanlig fråga första dagen' },
        { f: 'Jag är klar, vad gör jag nu?', n: 'När en uppgift är färdig' }
      ],
      texter: [
        {
          titel: 'Första dagen på bygget',
          text: 'När du kommer till en ny byggarbetsplats får du en genomgång. Du får veta var du ska vara, vem som är arbetsledare och vilka regler som gäller. Hjälm och skyddsskor är alltid obligatoriskt. Över två meters höjd krävs fallskydd. Om du ser något som känns farligt ska du säga till direkt — det är bättre att fråga en gång för mycket än att någon skadar sig. Ingen förväntar sig att du kan allt första dagen, men alla förväntar sig att du frågar.',
          fragor: [
            { q: 'Vad är alltid obligatoriskt på bygget?', alt: ['Hjälm och skyddsskor', 'Fallskydd', 'Måttband'], ratt: 0 },
            { q: 'Från vilken höjd krävs fallskydd?', alt: ['En meter', 'Två meter', 'Fem meter'], ratt: 1 },
            { q: 'Vad förväntas av dig första dagen?', alt: ['Att du kan allt', 'Att du arbetar snabbt', 'Att du frågar'], ratt: 2 }
          ]
        }
      ]
    }
  };

  // ── Tillstånd ───────────────────────────────────────────────
  var state = { branch: null, mode: null, items: [], idx: 0, correct: 0, answered: false, finished: false };
  var PKEY = 'cvm_sprak_v1';

  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(PKEY) || '{}'); } catch (e) { return {}; }
  }
  function saveProgress(p) {
    try { localStorage.setItem(PKEY, JSON.stringify(p)); } catch (e) {}
    // Serverpersistens — krävs för att handläggaren ska se progress.
    try {
      if (window.authUserId && window.authAccessToken) {
        fetch('/api/supabase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'save_table', table: 'sprak_progress',
            accessToken: window.authAccessToken, userId: window.authUserId, data: p
          })
        }).catch(function () {});
      }
    } catch (e) {}
  }
  function recordResult(branch, mode, correct, total, aktivSek) {
    var p = loadProgress();
    if (!p[branch]) p[branch] = {};
    var prev = p[branch][mode] || { pass: 0, ratt: 0, totalt: 0, tidSek: 0 };
    p[branch][mode] = {
      pass: prev.pass + 1,
      ratt: prev.ratt + correct,
      totalt: prev.totalt + total,
      tidSek: (prev.tidSek || 0) + (aktivSek || 0),
      senast: new Date().toISOString()
    };
    p._uppdaterad = new Date().toISOString();
    saveProgress(p);
  }

  /* ── Tidloggning ────────────────────────────────────────────
     Mäter AKTIV tid, inte hur länge fliken varit öppen. Tiden
     pausas när fliken döljs och när deltagaren varit stilla en
     stund. Det är skillnaden mellan en logg en kommun kan lita
     på och en som bara visar att webbläsaren stod på.
     ──────────────────────────────────────────────────────────── */
  var IDLE_MS = 90000;             // 90 s utan interaktion → räknas inte
  var timer = {
    aktivMs: 0,
    sedan: null,                   // tidpunkt då pågående intervall började
    senasteAktivitet: 0,
    idleKoll: null,

    start: function () {
      this.aktivMs = 0;
      this.senasteAktivitet = Date.now();
      this.sedan = Date.now();
      var self = this;
      clearInterval(this.idleKoll);
      this.idleKoll = setInterval(function () {
        if (self.sedan && Date.now() - self.senasteAktivitet > IDLE_MS) self.paus();
      }, 5000);
    },

    // Räknar in tiden fram till nu och stoppar klockan
    paus: function () {
      if (this.sedan) {
        this.aktivMs += Date.now() - this.sedan;
        this.sedan = null;
      }
    },

    // Startar om klockan efter paus — bara om ett pass pågår
    ater: function () {
      if (!this.sedan && this.idleKoll) {
        this.sedan = Date.now();
        this.senasteAktivitet = Date.now();
      }
    },

    puls: function () {
      this.senasteAktivitet = Date.now();
      this.ater();
    },

    stopp: function () {
      this.paus();
      clearInterval(this.idleKoll);
      this.idleKoll = null;
      return Math.round(this.aktivMs / 1000);
    }
  };

  // Fliken döljs → pausa. Syns igen → fortsätt.
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) timer.paus(); else timer.puls();
  });

  function formatTid(sek) {
    sek = Math.max(0, Math.round(sek || 0));
    if (sek < 60) return sek + ' sek';
    var min = Math.round(sek / 60);
    if (min < 60) return min + ' min';
    var h = Math.floor(min / 60);
    var m = min % 60;
    return h + ' h' + (m ? ' ' + m + ' min' : '');
  }

  // ── Uppläsning (Web Speech API) ─────────────────────────────
  // Samma röstprioritering och Chrome-workaround som intervju.js:
  // Chrome tystnar efter ~15 s utan pause/resume-puls.
  var tts = {
    voice: null,
    ready: false,
    init: function () {
      if (!('speechSynthesis' in window)) return;
      var self = this;
      function pick() {
        var vs = window.speechSynthesis.getVoices() || [];
        var sv = vs.filter(function (v) { return /^sv/i.test(v.lang || ''); });
        if (!sv.length) return;
        var prio = ['Sofie Online (Natural)', 'Hillevi Online (Natural)', 'Sofie',
                    'Alva (Förbättrad)', 'Alva (Enhanced)', 'Google svenska', 'Alva', 'Klara', 'Hedvig', 'Bengt'];
        for (var i = 0; i < prio.length; i++) {
          var hit = sv.find(function (v) { return v.name === prio[i]; });
          if (hit) { self.voice = hit; self.ready = true; return; }
        }
        var nat = sv.find(function (v) { return /natural|online|neural/i.test(v.name); });
        self.voice = nat || sv[0];
        self.ready = true;
      }
      pick();
      if (!this.ready) window.speechSynthesis.onvoiceschanged = pick;
    },
    speak: function (text, btn) {
      if (!('speechSynthesis' in window) || !text) return;
      this.cancel();
      var u = new SpeechSynthesisUtterance(String(text));
      u.lang = 'sv-SE';
      u.rate = 0.9;            // något långsammare — modulen är för svaga läsare
      if (this.voice) u.voice = this.voice;
      var keep = setInterval(function () {
        try { window.speechSynthesis.pause(); window.speechSynthesis.resume(); } catch (e) {}
      }, 10000);
      function done() {
        clearInterval(keep);
        if (btn) btn.classList.remove('spr-speaking');
      }
      u.onend = done;
      u.onerror = done;
      if (btn) btn.classList.add('spr-speaking');
      try { window.speechSynthesis.speak(u); } catch (e) { done(); }
    },
    cancel: function () {
      try { window.speechSynthesis.cancel(); } catch (e) {}
      var b = document.querySelector('.spr-speaking');
      if (b) b.classList.remove('spr-speaking');
    }
  };

  // Uppläsningsknapp — används överallt där text visas
  function hoerKnapp(text, label) {
    return '<button type="button" class="spr-hear" data-say="' + esc(text) + '" ' +
           'aria-label="' + esc(label || 'Lyssna på texten') + '" title="Lyssna">🔊</button>';
  }

  // ── UI ──────────────────────────────────────────────────────
  function getRoot() { return $('#trainView-sprak'); }

  function buildUI() {
    var root = getRoot();
    if (!root) return false;
    if (root.dataset.sprBuilt === '1') return true;

    var back = root.querySelector('.train-back');
    root.innerHTML = '';
    if (back) root.appendChild(back);

    var box = document.createElement('div');
    box.className = 'spr-root';
    box.innerHTML = [
      '<div id="sprScreenSetup" class="spr-screen">',
      '  <h2 class="spr-h">🗣️ Språkträning</h2>',
      '  <p class="spr-sub">Yrkessvenska för jobbet. Välj det område du vill träna på — allt går att lyssna på.</p>',
      '  <div class="spr-branches" id="sprBranches"></div>',
      '</div>',

      '<div id="sprScreenMenu" class="spr-screen">',
      '  <button type="button" class="spr-back" id="sprBackSetup">← Byt område</button>',
      '  <h2 class="spr-h" id="sprMenuTitle"></h2>',
      '  <div class="spr-modes">',
      '    <button type="button" class="spr-mode" data-mode="ord">',
      '      <span class="spr-mode-i">📖</span><span class="spr-mode-n">Ord & begrepp</span>',
      '      <span class="spr-mode-d">Lär dig orden som används på jobbet</span>',
      '      <span class="spr-mode-p" data-p="ord"></span></button>',
      '    <button type="button" class="spr-mode" data-mode="fraser">',
      '      <span class="spr-mode-i">💬</span><span class="spr-mode-n">Fraser på jobbet</span>',
      '      <span class="spr-mode-d">Vad du säger — och när du säger det</span>',
      '      <span class="spr-mode-p" data-p="fraser"></span></button>',
      '    <button type="button" class="spr-mode" data-mode="lasa">',
      '      <span class="spr-mode-i">📄</span><span class="spr-mode-n">Läs och förstå</span>',
      '      <span class="spr-mode-d">Korta texter med frågor — lyssna medan du läser</span>',
      '      <span class="spr-mode-p" data-p="lasa"></span></button>',
      '    <button type="button" class="spr-mode" data-mode="lyssna">',
      '      <span class="spr-mode-i">👂</span><span class="spr-mode-n">Lyssna</span>',
      '      <span class="spr-mode-d">Hör ordet och välj rätt betydelse</span>',
      '      <span class="spr-mode-p" data-p="lyssna"></span></button>',
      '  </div>',
      '</div>',

      '<div id="sprScreenOvning" class="spr-screen">',
      '  <div class="spr-top">',
      '    <button type="button" class="spr-back" id="sprBackMenu">← Avsluta</button>',
      '    <div class="spr-progress"><div class="spr-progress-bar" id="sprBar"></div></div>',
      '    <span class="spr-count" id="sprCount"></span>',
      '  </div>',
      '  <div id="sprCard"></div>',
      '</div>',

      '<div id="sprScreenKlar" class="spr-screen">',
      '  <div class="spr-done" id="sprDone"></div>',
      '</div>'
    ].join('');
    root.appendChild(box);
    root.dataset.sprBuilt = '1';
    return true;
  }

  function showScreen(name) {
    ['Setup', 'Menu', 'Ovning', 'Klar'].forEach(function (s) {
      var el = $('#sprScreen' + s);
      if (el) el.classList.toggle('spr-screen--active', s.toLowerCase() === name);
    });
  }

  function renderBranches() {
    var wrap = $('#sprBranches');
    if (!wrap) return;
    var p = loadProgress();
    wrap.innerHTML = Object.keys(CONTENT).map(function (k) {
      var b = CONTENT[k];
      var bp = p[k] || {};
      var pass = Object.keys(bp).reduce(function (n, m) { return n + (bp[m].pass || 0); }, 0);
      return '<button type="button" class="spr-branch" data-branch="' + k + '">' +
             '<span class="spr-branch-i">' + b.ikon + '</span>' +
             '<span class="spr-branch-n">' + esc(b.namn) + '</span>' +
             '<span class="spr-branch-m">' + (pass ? pass + ' pass klara' : 'Inte påbörjat') + '</span>' +
             '</button>';
    }).join('');
  }

  function renderMenu() {
    var b = CONTENT[state.branch];
    if (!b) return;
    var t = $('#sprMenuTitle');
    if (t) t.textContent = b.ikon + ' ' + b.namn;
    var p = loadProgress()[state.branch] || {};
    ['ord', 'fraser', 'lasa', 'lyssna'].forEach(function (m) {
      var el = document.querySelector('#sprScreenMenu [data-p="' + m + '"]');
      if (!el) return;
      var d = p[m];
      el.textContent = d && d.totalt
        ? Math.round((d.ratt / d.totalt) * 100) + '% rätt · ' + d.pass + ' pass' +
          (d.tidSek ? ' · ' + formatTid(d.tidSek) : '')
        : '';
    });
  }

  // ── Övningsgenerering ───────────────────────────────────────
  function buildItems(branch, mode) {
    var b = CONTENT[branch];
    if (!b) return [];

    if (mode === 'ord' || mode === 'lyssna') {
      return shuffle(b.ord).slice(0, 10).map(function (w) {
        var fel = shuffle(b.ord.filter(function (x) { return x.o !== w.o; })).slice(0, 2);
        var alt = shuffle([w.b].concat(fel.map(function (x) { return x.b; })));
        return {
          typ: mode === 'lyssna' ? 'lyssna' : 'ord',
          fraga: w.o, exempel: w.e,
          alt: alt, ratt: alt.indexOf(w.b)
        };
      });
    }

    if (mode === 'fraser') {
      return shuffle(b.fraser).slice(0, 8).map(function (f) {
        var fel = shuffle(b.fraser.filter(function (x) { return x.f !== f.f; })).slice(0, 2);
        var alt = shuffle([f.n].concat(fel.map(function (x) { return x.n; })));
        return { typ: 'fraser', fraga: f.f, alt: alt, ratt: alt.indexOf(f.n) };
      });
    }

    if (mode === 'lasa') {
      var out = [];
      b.texter.forEach(function (t) {
        t.fragor.forEach(function (f, i) {
          out.push({
            typ: 'lasa',
            text: i === 0 ? t.text : null,   // texten visas vid första frågan
            titel: i === 0 ? t.titel : null,
            fraga: f.q, alt: f.alt, ratt: f.ratt, kvarText: t.text
          });
        });
      });
      return out;
    }
    return [];
  }

  function renderCard() {
    var it = state.items[state.idx];
    var card = $('#sprCard');
    if (!it || !card) return;
    state.answered = false;

    var bar = $('#sprBar');
    if (bar) bar.style.width = Math.round((state.idx / state.items.length) * 100) + '%';
    var cnt = $('#sprCount');
    if (cnt) cnt.textContent = (state.idx + 1) + '/' + state.items.length;

    var head = '';
    if (it.typ === 'ord') {
      head = '<div class="spr-q-label">Vad betyder ordet?</div>' +
             '<div class="spr-word">' + esc(it.fraga) + ' ' + hoerKnapp(it.fraga, 'Lyssna på ordet') + '</div>';
    } else if (it.typ === 'lyssna') {
      head = '<div class="spr-q-label">Tryck på högtalaren och lyssna</div>' +
             '<div class="spr-listen">' + hoerKnapp(it.fraga, 'Lyssna på ordet') + '</div>' +
             '<div class="spr-hint">Vilket av alternativen betyder det du hörde?</div>';
    } else if (it.typ === 'fraser') {
      head = '<div class="spr-q-label">När säger du det här?</div>' +
             '<div class="spr-phrase">”' + esc(it.fraga) + '” ' + hoerKnapp(it.fraga, 'Lyssna på frasen') + '</div>';
    } else if (it.typ === 'lasa') {
      if (it.text) {
        head += '<div class="spr-text"><div class="spr-text-h">' + esc(it.titel) + ' ' +
                hoerKnapp(it.text, 'Lyssna på hela texten') + '</div>' +
                '<p>' + esc(it.text) + '</p></div>';
      } else {
        head += '<div class="spr-text spr-text--mini">' + hoerKnapp(it.kvarText, 'Lyssna på texten igen') +
                ' <span>Lyssna på texten igen</span></div>';
      }
      head += '<div class="spr-q-label">' + esc(it.fraga) + ' ' + hoerKnapp(it.fraga, 'Lyssna på frågan') + '</div>';
    }

    var alts = it.alt.map(function (a, i) {
      return '<button type="button" class="spr-alt" data-i="' + i + '">' +
             '<span class="spr-alt-t">' + esc(a) + '</span>' + hoerKnapp(a, 'Lyssna på svaret') + '</button>';
    }).join('');

    card.innerHTML = head + '<div class="spr-alts">' + alts + '</div>' +
                     '<div class="spr-feedback" id="sprFb"></div>' +
                     '<button type="button" class="spr-next" id="sprNext" style="display:none">Nästa →</button>';
  }

  function answer(i) {
    if (state.answered) return;
    state.answered = true;
    var it = state.items[state.idx];
    var ratt = i === it.ratt;
    if (ratt) state.correct++;

    var btns = document.querySelectorAll('#sprCard .spr-alt');
    Array.prototype.forEach.call(btns, function (b, bi) {
      if (bi === it.ratt) b.classList.add('spr-alt--right');
      else if (bi === i) b.classList.add('spr-alt--wrong');
      b.classList.add('spr-alt--locked');
    });

    var fb = $('#sprFb');
    if (fb) {
      fb.className = 'spr-feedback spr-feedback--' + (ratt ? 'ok' : 'no');
      var txt = ratt ? '✓ Rätt!' : '✗ Inte riktigt — rätt svar är markerat.';
      if (it.exempel) txt += ' <em>' + esc(it.exempel) + '</em> ' + hoerKnapp(it.exempel, 'Lyssna på exempelmeningen');
      fb.innerHTML = txt;
    }
    var nx = $('#sprNext');
    if (nx) nx.style.display = 'block';
  }

  function next() {
    if (state.finished) return;
    state.idx++;
    if (state.idx >= state.items.length) return finish();
    renderCard();
  }

  function finish() {
    if (state.finished) return;
    state.finished = true;
    var aktivSek = timer.stopp();
    recordResult(state.branch, state.mode, state.correct, state.items.length, aktivSek);
    var pct = Math.round((state.correct / state.items.length) * 100);
    var omdome = pct >= 80 ? 'Mycket bra jobbat!' : pct >= 50 ? 'Bra — fortsätt träna!' : 'Kör en gång till, det sitter snart.';
    var d = $('#sprDone');
    if (d) {
      d.innerHTML =
        '<div class="spr-done-i">' + (pct >= 80 ? '🎉' : '💪') + '</div>' +
        '<h2 class="spr-h">' + state.correct + ' av ' + state.items.length + ' rätt</h2>' +
        '<p class="spr-sub">' + omdome + '<br><span class="spr-tid">⏱ ' + formatTid(aktivSek) + ' aktiv träning</span></p>' +
        '<div class="spr-done-btns">' +
        '  <button type="button" class="spr-primary" id="sprAgain">Träna igen</button>' +
        '  <button type="button" class="spr-secondary" id="sprToMenu">Tillbaka</button>' +
        '</div>';
    }
    showScreen('klar');
  }

  function startOvning(mode) {
    state.mode = mode;
    state.items = buildItems(state.branch, mode);
    state.idx = 0;
    state.correct = 0;
    state.finished = false;
    if (!state.items.length) return;
    timer.start();
    showScreen('ovning');
    renderCard();
  }

  // ── Händelser (delegerade — UI:t byggs om hela tiden) ───────
  function bindEvents() {
    var root = getRoot();
    if (!root || root.dataset.sprBound === '1') return;

    root.addEventListener('click', function (e) {
      timer.puls();
      var hear = e.target.closest('.spr-hear');
      if (hear) { e.preventDefault(); e.stopPropagation(); tts.speak(hear.dataset.say, hear); return; }

      var br = e.target.closest('.spr-branch');
      if (br) { state.branch = br.dataset.branch; renderMenu(); showScreen('menu'); return; }

      var md = e.target.closest('.spr-mode');
      if (md) { startOvning(md.dataset.mode); return; }

      var alt = e.target.closest('.spr-alt');
      if (alt && !alt.classList.contains('spr-alt--locked')) { answer(Number(alt.dataset.i)); return; }

      if (e.target.closest('#sprNext')) { next(); return; }
      if (e.target.closest('#sprAgain')) { startOvning(state.mode); return; }
      if (e.target.closest('#sprToMenu')) { tts.cancel(); renderMenu(); showScreen('menu'); return; }
      if (e.target.closest('#sprBackMenu')) { timer.stopp(); tts.cancel(); renderMenu(); showScreen('menu'); return; }
      if (e.target.closest('#sprBackSetup')) { tts.cancel(); renderBranches(); showScreen('setup'); return; }
    });

    root.dataset.sprBound = '1';
  }

  // ── Publikt API ─────────────────────────────────────────────
  window.sprInit = function () {
    if (!buildUI()) {
      console.warn('[Språk] #trainView-sprak hittades inte');
      return;
    }
    bindEvents();
    tts.init();
    renderBranches();
    showScreen('setup');
  };

  window.sprCleanup = function () { tts.cancel(); };

  // Hur många pass deltagaren gjort totalt — används av Träna-hubben
  window.sprSummary = function () {
    var p = loadProgress(), pass = 0, ratt = 0, tot = 0, tid = 0;
    Object.keys(p).forEach(function (b) {
      if (b.charAt(0) === '_') return;
      Object.keys(p[b]).forEach(function (m) {
        pass += p[b][m].pass || 0; ratt += p[b][m].ratt || 0;
        tot += p[b][m].totalt || 0; tid += p[b][m].tidSek || 0;
      });
    });
    return {
      pass: pass, ratt: ratt, totalt: tot, tidSek: tid,
      tidText: formatTid(tid),
      andel: tot ? Math.round((ratt / tot) * 100) : null
    };
  };
})();
