/* ============================================================
   CVmatchen — Närvaro och veckoschema (handläggarvyn)
   ------------------------------------------------------------
   Fristående modul. handlaggare.html anropar window.narvaroRender()
   när fliken Närvaro öppnas; allt annat ligger här.

   Två vyer:
   - Dagens pass: passen en viss dag. Registrera närvaro, ändra
     ett pass, ställ in.
   - Veckoschema: serierna som passen skapas ifrån.

   Ändringar har ett uttryckligt omfång — bara det här passet,
   alla [måndagar] i serien framåt, eller hela serien framåt —
   och "framåt" räknas alltid från och med det valda datumet.
   Pass som redan har registrerad närvaro skrivs aldrig bort.
   ============================================================ */
(function () {
  'use strict';

  var TYPER = {
    L: { namn: 'Lokal', ikon: '🏠' },
    U: { namn: 'Ute', ikon: '🌳' },
    A: { namn: 'Arbetsgivare', ikon: '🏢' },
    D: { namn: 'Digitalt', ikon: '💻' }
  };
  var FASER = { landa: 'Landa', rusta: 'Rusta', valja_soka: 'Välja och söka' };
  var SPAR = { ordinarie: 'Ordinarie', foraldraspar: 'Föräldraspår' };
  var STATUS = [
    ['narvarande', 'Närvarande', 'gn'],
    ['sen', 'Sen', 'or'],
    ['franvarande_giltig', 'Frånvaro, giltig', 'bl'],
    ['franvarande_ogiltig', 'Frånvaro, ogiltig', 'rd']
  ];
  var DAG_KORT = ['', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'];
  var DAGAR_PL = ['', 'måndagar', 'tisdagar', 'onsdagar', 'torsdagar', 'fredagar', 'lördagar', 'söndagar'];
  var SKEY = 'cvm_narvaro_scope';

  var st = {
    scope: null, kommuner: [], enheter: [],
    vy: 'dag', datum: idag(),
    pass: [], aktivt: null, deltagare: [], val: {}, registrerad: false,
    serier: []
  };

  // ── Hjälpare ────────────────────────────────────────────────
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function idag() { return new Date().toLocaleDateString('sv-SE'); }
  function veckodag(d) { var w = new Date(d + 'T12:00:00').getDay(); return w === 0 ? 7 : w; }
  function flytta(d, n) { var t = new Date(d + 'T12:00:00'); t.setDate(t.getDate() + n); return t.toLocaleDateString('sv-SE'); }
  function visaDatum(d, medVeckodag) {
    try {
      return new Date(d + 'T12:00:00').toLocaleDateString('sv-SE',
        medVeckodag ? { weekday: 'short', day: 'numeric', month: 'short' } : { day: 'numeric', month: 'short' })
        .replace(/\.(?=\s|$)/g, '');
    } catch (e) { return d; }
  }
  function root() { return document.getElementById('narvaroContent'); }
  function body() { return document.getElementById('nvBody'); }
  function arSuper() { return typeof admin !== 'undefined' && admin && admin.role === 'superadmin'; }

  // Läser serverns felmeddelande. Den gemensamma post() kastar bara
  // "HTTP 400", och då når förklaringen aldrig personalen.
  function anrop(action, data) {
    var b = Object.assign({ action: action }, data || {});
    if (typeof admin !== 'undefined' && admin && admin.accessToken) b.accessToken = admin.accessToken;
    return fetch(typeof API !== 'undefined' ? API : '/api/supabase', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b)
    }).then(function (r) {
      return r.text().then(function (t) {
        var j = {};
        try { j = JSON.parse(t); } catch (e) {}
        if (!r.ok) throw new Error(j.error || ('Fel ' + r.status));
        return j;
      });
    });
  }
  window.postMedFelmeddelande = anrop;

  function api(action, data) {
    var d = Object.assign({}, data || {});
    if (st.scope) { d.kommunId = st.scope.kommunId; d.enhetId = st.scope.enhetId; }
    return anrop(action, d);
  }

  function tomt(rubrik, text, extra) {
    return '<div class="nv-tomt"><b>' + esc(rubrik) + '</b><p>' + esc(text) + '</p>' + (extra || '') + '</div>';
  }
  function fel(id, e) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = '<div class="ud-body-empty" style="color:var(--rd)">' + esc(e && e.message || 'Något gick fel') + '</div>';
  }
  function malgrupp(f, s) {
    var d = [];
    if (f && f.length) d.push(f.map(function (x) { return FASER[x] || x; }).join(', '));
    if (s && s.length) d.push(s.map(function (x) { return SPAR[x] || x; }).join(', '));
    return d.length ? d.join(' · ') : 'Alla deltagare';
  }
  function namnFor(d) {
    if (d.name) return d.name;
    try {
      if (typeof allUsers !== 'undefined' && typeof displayName === 'function') {
        var u = allUsers.find(function (x) { return (x.user_id || x.id) === d.user_id; });
        if (u) return displayName(u).name;
      }
    } catch (e) {}
    return 'Deltagare ' + String(d.user_id).slice(0, 6);
  }

  // ── Verksamhet (superadmin väljer kommun och enhet) ─────────
  async function laddaEnheter() {
    st.enheter = [];
    if (!st.scope) return;
    try {
      var r = await anrop('admin_get_enheter', { filters: { kommun_id: st.scope.kommunId } });
      st.enheter = r.data || [];
    } catch (e) {}
  }
  async function initScope() {
    if (st.scope) return;
    if (!arSuper()) {
      st.scope = { kommunId: admin.kommun_id, enhetId: admin.enhet_id == null ? null : admin.enhet_id };
      return;
    }
    try { st.kommuner = (await anrop('admin_get_kommuner', {})).data || []; } catch (e) { st.kommuner = []; }
    var sparad = null;
    try { sparad = JSON.parse(localStorage.getItem(SKEY) || 'null'); } catch (e) {}
    if (sparad && st.kommuner.some(function (k) { return String(k.id) === String(sparad.kommunId); })) {
      st.scope = sparad;
      await laddaEnheter();
    }
  }
  function sparaScope() { try { localStorage.setItem(SKEY, JSON.stringify(st.scope)); } catch (e) {} }

  // ── Ram ─────────────────────────────────────────────────────
  function huvud() {
    var h = '<div class="nv-head">';
    if (arSuper()) {
      h += '<div class="nv-scope"><label for="nvKommun">Verksamhet</label>' +
        '<select id="nvKommun" class="prog-in" onchange="nv.valjKommun(this.value)"><option value="">Välj kommun…</option>' +
        st.kommuner.map(function (k) {
          return '<option value="' + k.id + '"' + (st.scope && String(st.scope.kommunId) === String(k.id) ? ' selected' : '') + '>' + esc(k.name) + '</option>';
        }).join('') + '</select>' +
        '<select id="nvEnhet" class="prog-in" aria-label="Enhet" onchange="nv.valjEnhet(this.value)"' + (st.scope ? '' : ' disabled') + '>' +
        '<option value="">Hela kommunen</option>' +
        st.enheter.map(function (e) {
          return '<option value="' + e.id + '"' + (st.scope && String(st.scope.enhetId) === String(e.id) ? ' selected' : '') + '>' + esc(e.name) + '</option>';
        }).join('') + '</select></div>';
    }
    h += '<div class="nv-seg" role="tablist">' + seg('dag', 'Dagens pass') + seg('schema', 'Veckoschema') + '</div></div>';
    return h;
  }
  function seg(id, txt) {
    var on = st.vy === id || (id === 'dag' && st.vy === 'narvaro');
    return '<button type="button" role="tab" aria-selected="' + on + '" class="nv-seg-b' + (on ? ' on' : '') + '" onclick="nv.vy(\'' + id + '\')">' + txt + '</button>';
  }

  function render() {
    var el = root();
    if (!el) return;
    el.classList.remove('loading');
    el.innerHTML = huvud() + '<div id="nvBody"></div>';
    if (!st.scope) {
      body().innerHTML = tomt('Välj verksamhet', 'Välj kommun, och vid behov enhet, för att se schema och närvaro.');
      return;
    }
    if (st.vy === 'schema') renderSchema();
    else if (st.vy === 'narvaro') renderNarvaro();
    else renderDag();
  }

  // ── Dagens pass ─────────────────────────────────────────────
  async function renderDag() {
    var b = body();
    b.innerHTML =
      '<div class="nv-datum">' +
      '<button type="button" class="btn" onclick="nv.dag(-1)" aria-label="Föregående dag">‹</button>' +
      '<input type="date" id="nvDatum" class="prog-in" value="' + st.datum + '" onchange="nv.satDatum(this.value)" aria-label="Datum">' +
      '<button type="button" class="btn" onclick="nv.dag(1)" aria-label="Nästa dag">›</button>' +
      (st.datum !== idag() ? '<button type="button" class="btn" onclick="nv.satDatum(\'' + idag() + '\')">Idag</button>' : '') +
      '<span class="nv-datum-txt">' + esc(visaDatum(st.datum, true)) + '</span></div>' +
      '<div id="nvPassLista"><div class="ud-body-empty">Laddar…</div></div>';
    var datum = st.datum;
    try {
      var r = await api('admin_list_pass_dag', { datum: datum });
      if (st.vy !== 'dag' || st.datum !== datum) return;
      st.pass = r.pass || [];
      var l = document.getElementById('nvPassLista');
      if (!l) return;
      if (!st.pass.length) {
        l.innerHTML = tomt('Inga pass den här dagen',
          'Passen skapas från veckoschemat. Lägg in en serie där, så dyker passen upp här de dagar serien gäller.',
          '<button type="button" class="btn btn-primary" onclick="nv.vy(\'schema\')">Öppna veckoschemat</button>');
        return;
      }
      var allaInstallda = st.pass.every(function (p) { return p.installt; });
      l.innerHTML = st.pass.map(passKort).join('') +
        '<div class="nv-dagfot"><button type="button" class="btn" onclick="nv.installaDag(' + !allaInstallda + ')">' +
        (allaInstallda ? 'Återställ alla pass den här dagen' : 'Ställ in alla pass den här dagen') + '</button></div>';
    } catch (e) { fel('nvPassLista', e); }
  }

  function passKort(p) {
    var t = TYPER[p.typ] || { namn: p.typ, ikon: '' };
    var status;
    if (p.installt) status = '<span class="nv-pill rd">Inställt' + (p.kommentar ? ' · ' + esc(p.kommentar) : '') + '</span>';
    else if (p.registrerade) status = '<span class="nv-pill gn">Registrerad · ' + p.narvarande + ' av ' + p.registrerade + ' närvarande</span>';
    else status = '<span class="nv-pill mu">Ej registrerad · ' + p.forvantade + (p.forvantade === 1 ? ' deltagare' : ' deltagare') + '</span>';
    return '<div class="nv-pass' + (p.installt ? ' nv-pass--inst' : '') + '">' +
      '<div class="nv-pass-tid">' + esc(p.starttid) + '<span>' + esc(p.sluttid) + '</span></div>' +
      '<div class="nv-pass-mitt">' +
      '<div class="nv-pass-titel">' + esc(p.titel) + '</div>' +
      '<div class="nv-pass-meta"><span title="' + esc(t.namn) + '">' + t.ikon + ' ' + esc(t.namn) + '</span> · ' + esc(malgrupp(p.faser, p.spar)) + '</div>' +
      '<div>' + status + '</div></div>' +
      '<div class="nv-pass-knappar">' +
      (p.installt ? '' : '<button type="button" class="btn btn-primary" onclick="nv.oppnaNarvaro(' + p.id + ')">' + (p.registrerade ? 'Ändra närvaro' : 'Registrera närvaro') + '</button>') +
      '<button type="button" class="btn" onclick="nv.andraPass(' + p.id + ')">Ändra pass</button>' +
      '</div></div>';
  }

  // ── Registrera närvaro ──────────────────────────────────────
  async function oppnaNarvaro(id) {
    st.vy = 'narvaro';
    st.aktivt = null;
    render();
    body().innerHTML = '<div class="ud-body-empty">Laddar deltagare…</div>';
    try {
      var r = await api('admin_get_pass_narvaro', { passId: id });
      st.aktivt = r.pass;
      st.deltagare = (r.deltagare || []).sort(function (a, b) { return namnFor(a).localeCompare(namnFor(b), 'sv'); });
      st.registrerad = !!r.registrerad;
      st.val = {};
      // Standard är närvarande (F1.2): personalen ändrar bara undantagen
      st.deltagare.forEach(function (d) {
        st.val[d.user_id] = { status: d.status || 'narvarande', kommentar: d.kommentar || '' };
      });
      renderNarvaro();
    } catch (e) { fel('nvBody', e); }
  }

  function renderNarvaro() {
    var p = st.aktivt, b = body();
    if (!p || !b) return;
    var h = '<button type="button" class="nv-tillbaka" onclick="nv.vy(\'dag\')">← Dagens pass</button>' +
      '<div class="nv-n-head"><div class="nv-pass-titel">' + esc(p.titel) + '</div>' +
      '<div class="nv-pass-meta">' + esc(visaDatum(p.datum, true)) + ' · ' + esc(p.starttid) + '–' + esc(p.sluttid) + ' · ' + esc(malgrupp(p.faser, p.spar)) + '</div></div>';
    if (!st.deltagare.length) {
      b.innerHTML = h + tomt('Inga deltagare på passet',
        'Här visas deltagare med programstatus Aktiv vars fas och spår passar passet. Det anges i fliken Program på varje deltagare.');
      return;
    }
    h += '<p class="nv-hint">' + (st.registrerad
      ? 'Närvaron är registrerad. Ändra och spara igen om något blev fel.'
      : 'Alla är förvalda som närvarande. Ändra bara för den som inte kom eller kom sent.') + '</p>' +
      '<div class="nv-lista">' + st.deltagare.map(rad).join('') + '</div>' +
      '<div class="nv-spara"><span id="nvSparaMsg" role="status"></span>' +
      '<button type="button" class="btn btn-primary" id="nvSpara" onclick="nv.sparaNarvaro()">Spara närvaro (' + st.deltagare.length + ')</button></div>';
    b.innerHTML = h;
  }

  function rad(d) {
    var v = st.val[d.user_id], namn = namnFor(d);
    var chips = STATUS.map(function (s) {
      var on = v.status === s[0];
      return '<button type="button" class="nv-chip ' + s[2] + (on ? ' on' : '') + '" aria-pressed="' + on + '" ' +
        'onclick="nv.satStatus(\'' + d.user_id + '\',\'' + s[0] + '\')">' + s[1] + '</button>';
    }).join('');
    var kommentar = v.status !== 'narvarande'
      ? '<input type="text" class="prog-in nv-kom" maxlength="300" placeholder="Kommentar (valfritt)" value="' + esc(v.kommentar) + '" ' +
        'oninput="nv.satKommentar(\'' + d.user_id + '\',this.value)" aria-label="Kommentar för ' + esc(namn) + '">'
      : '';
    return '<div class="nv-rad" id="nvr-' + d.user_id + '">' +
      '<div class="nv-namn">' + esc(namn) + (d.ejAktiv ? ' <span class="nv-pill mu">Inte längre aktiv</span>' : '') + '</div>' +
      '<div class="nv-chips" role="group" aria-label="Närvaro för ' + esc(namn) + '">' + chips + '</div>' + kommentar + '</div>';
  }

  function satStatus(uid, status) {
    if (!st.val[uid]) return;
    st.val[uid].status = status;
    var d = st.deltagare.find(function (x) { return x.user_id === uid; });
    var el = document.getElementById('nvr-' + uid);
    if (d && el) el.outerHTML = rad(d);
  }
  function satKommentar(uid, text) { if (st.val[uid]) st.val[uid].kommentar = text; }

  async function sparaNarvaro() {
    var knapp = document.getElementById('nvSpara'), m = document.getElementById('nvSparaMsg');
    knapp.disabled = true;
    m.className = '';
    m.textContent = 'Sparar…';
    var rader = st.deltagare.map(function (d) {
      var v = st.val[d.user_id];
      return { user_id: d.user_id, status: v.status, kommentar: v.status === 'narvarande' ? null : v.kommentar };
    });
    try {
      var r = await api('admin_save_narvaro', { passId: st.aktivt.id, rader: rader });
      st.registrerad = true;
      m.className = 'ok';
      m.textContent = 'Sparat för ' + r.sparade + ' deltagare';
      knapp.textContent = 'Spara igen';
    } catch (e) {
      m.className = 'err';
      m.textContent = 'Kunde inte spara: ' + e.message;
    }
    knapp.disabled = false;
  }

  // ── Dialog ──────────────────────────────────────────────────
  function modal(html) {
    stang();
    var o = document.createElement('div');
    o.className = 'nv-ov';
    o.id = 'nvOv';
    o.innerHTML = '<div class="nv-m" role="dialog" aria-modal="true">' + html + '</div>';
    o.addEventListener('click', function (e) { if (e.target === o) stang(); });
    document.body.appendChild(o);
    var f = o.querySelector('input,select');
    if (f) f.focus();
  }
  function stang() { var o = document.getElementById('nvOv'); if (o) o.remove(); }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') stang(); });
  function mmsg(text, klass) {
    var m = document.getElementById('nvmMsg');
    if (m) { m.className = klass || ''; m.textContent = text; }
  }
  function falt(etikett, html, id) {
    return '<div class="prog-f"><label' + (id ? ' for="' + id + '"' : '') + '>' + esc(etikett) + '</label>' + html + '</div>';
  }
  function typSelect(id, valt) {
    return '<select id="' + id + '" class="prog-in">' + Object.keys(TYPER).map(function (k) {
      return '<option value="' + k + '"' + (k === valt ? ' selected' : '') + '>' + TYPER[k].ikon + ' ' + TYPER[k].namn + '</option>';
    }).join('') + '</select>';
  }
  function bockar(namn, alternativ, valda) {
    return '<div class="nv-bockar">' + Object.keys(alternativ).map(function (k) {
      return '<label class="nv-bock"><input type="checkbox" name="' + namn + '" value="' + k + '"' +
        ((valda || []).map(String).indexOf(String(k)) > -1 ? ' checked' : '') + '> ' + esc(alternativ[k]) + '</label>';
    }).join('') + '</div>';
  }
  function lasBockar(namn) {
    return [].slice.call(document.querySelectorAll('input[name="' + namn + '"]:checked')).map(function (x) { return x.value; });
  }
  function radio(namn, varde, text, valt, av) {
    return '<label class="nv-radio' + (av ? ' av' : '') + '"><input type="radio" name="' + namn + '" value="' + varde + '"' +
      (valt ? ' checked' : '') + (av ? ' disabled' : '') + '> ' + esc(text) + '</label>';
  }
  function valtRadio(namn) { var r = document.querySelector('input[name="' + namn + '"]:checked'); return r ? r.value : null; }
  function varde(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; }

  // ── Ändra ett pass (från dagens pass) ───────────────────────
  function andraPass(id) {
    var p = st.pass.find(function (x) { return x.id === id; });
    if (!p) return;
    var vd = veckodag(p.datum), dt = visaDatum(p.datum, true), dtk = visaDatum(p.datum);
    var serie = !!p.pass_mall_id;
    modal(
      '<h3 class="nv-m-h">Ändra pass</h3><p class="nv-m-sub">' + esc(p.titel) + ' · ' + esc(dt) + '</p>' +
      '<div class="prog-grid">' +
      falt('Titel', '<input id="nvmTitel" class="prog-in" maxlength="120" value="' + esc(p.titel) + '">', 'nvmTitel') +
      falt('Typ', typSelect('nvmTyp', p.typ), 'nvmTyp') +
      falt('Starttid', '<input type="time" id="nvmStart" class="prog-in" value="' + esc(p.starttid) + '">', 'nvmStart') +
      falt('Sluttid', '<input type="time" id="nvmSlut" class="prog-in" value="' + esc(p.sluttid) + '">', 'nvmSlut') +
      '</div>' +
      '<fieldset class="nv-omf"><legend>Ändringen gäller</legend>' +
      radio('nvmOmf', 'pass', 'Bara det här passet (' + dt + ')', true) +
      radio('nvmOmf', 'veckodag', 'Alla ' + DAGAR_PL[vd] + ' i serien från och med ' + dtk, false, !serie) +
      radio('nvmOmf', 'serie', 'Hela serien, alla dagar, från och med ' + dtk, false, !serie) +
      (serie ? '' : '<p class="nv-m-sub">Passet ingår inte i någon serie.</p>') +
      '</fieldset>' +
      '<div class="nv-m-act"><span id="nvmMsg" role="status"></span>' +
      '<button type="button" class="btn" onclick="nv.stang()">Avbryt</button>' +
      '<button type="button" class="btn btn-primary" onclick="nv.sparaAndring(' + id + ')">Spara ändring</button></div>' +

      '<div class="nv-m-sek"><div class="nv-m-sek-h">Ställ in</div>' +
      '<input id="nvmInstKom" class="prog-in" maxlength="300" placeholder="Anledning (valfritt), t.ex. helgdag" aria-label="Anledning" value="' + esc(p.kommentar || '') + '">' +
      '<div class="nv-m-rad">' + (p.installt
        ? '<button type="button" class="btn" onclick="nv.installa(' + id + ',\'pass\',false)">Återställ passet</button>'
        : '<button type="button" class="btn" onclick="nv.installa(' + id + ',\'pass\',true)">Ställ in det här passet</button>' +
          '<button type="button" class="btn" onclick="nv.installa(' + id + ',\'dag\',true)">Ställ in alla pass ' + esc(dt) + '</button>') +
      '</div></div>' +

      (serie
        ? '<div class="nv-m-sek"><div class="nv-m-sek-h">Ta bort ur schemat</div>' +
          '<p class="nv-m-sub">Pass med registrerad närvaro ligger kvar. Det är historik.</p><div class="nv-m-rad">' +
          '<button type="button" class="btn nv-farlig" onclick="nv.avsluta(' + id + ',\'veckodag\')">Ta bort ' + DAGAR_PL[vd] + ' från och med ' + esc(dtk) + '</button>' +
          '<button type="button" class="btn nv-farlig" onclick="nv.avsluta(' + id + ',\'serie\')">Avsluta hela serien från och med ' + esc(dtk) + '</button>' +
          '</div></div>'
        : '')
    );
  }

  async function sparaAndring(id) {
    var p = st.pass.find(function (x) { return x.id === id; });
    if (!p) return;
    var andring = {};
    var titel = varde('nvmTitel'), typ = varde('nvmTyp'), start = varde('nvmStart'), slut = varde('nvmSlut');
    if (titel !== p.titel) andring.titel = titel;
    if (typ !== p.typ) andring.typ = typ;
    if (start !== p.starttid) andring.starttid = start;
    if (slut !== p.sluttid) andring.sluttid = slut;
    // Tiderna kontrolleras tillsammans på servern; skicka båda om någon ändrats
    if (andring.starttid || andring.sluttid) { andring.starttid = start; andring.sluttid = slut; }
    if (!Object.keys(andring).length) { mmsg('Inget har ändrats'); return; }
    mmsg('Sparar…');
    try {
      await api('admin_edit_schema', { passId: id, omfang: valtRadio('nvmOmf') || 'pass', andring: andring, fran_datum: p.datum });
      stang();
      renderDag();
    } catch (e) { mmsg(e.message, 'err'); }
  }

  async function installa(id, omfang, installt) {
    mmsg('Sparar…');
    try {
      await api('admin_installa_pass', { passId: id, omfang: omfang, installt: installt, kommentar: varde('nvmInstKom') });
      stang();
      renderDag();
    } catch (e) { mmsg(e.message, 'err'); }
  }

  async function installaDag(installt) {
    if (!st.pass.length) return;
    try {
      await api('admin_installa_pass', { passId: st.pass[0].id, omfang: 'dag', installt: installt });
      renderDag();
    } catch (e) { alert(e.message); }
  }

  async function avsluta(id, omfang) {
    var p = st.pass.find(function (x) { return x.id === id; });
    if (!p) return;
    var vad = omfang === 'serie' ? 'hela serien' : 'alla ' + DAGAR_PL[veckodag(p.datum)] + ' i serien';
    if (!confirm('Ta bort ' + vad + ' från och med ' + visaDatum(p.datum, true) + '?\n\nPass med registrerad närvaro ligger kvar.')) return;
    mmsg('Tar bort…');
    try {
      await api('admin_avsluta_schema', { passId: id, omfang: omfang, fran_datum: p.datum });
      stang();
      renderDag();
    } catch (e) { mmsg(e.message, 'err'); }
  }

  // ── Veckoschema ─────────────────────────────────────────────
  async function renderSchema() {
    var b = body();
    b.innerHTML =
      '<div class="nv-schema-top"><p class="nv-hint">Varje serie skapar pass automatiskt de dagar och veckor den gäller.</p>' +
      '<button type="button" class="btn btn-primary" onclick="nv.nySerie()">+ Ny serie</button></div>' +
      '<div id="nvSerier"><div class="ud-body-empty">Laddar…</div></div>';
    try {
      var r = await api('admin_list_serier', {});
      if (st.vy !== 'schema') return;
      st.serier = r.serier || [];
      var l = document.getElementById('nvSerier');
      if (!l) return;
      if (!st.serier.length) {
        l.innerHTML = tomt('Inget veckoschema än', 'Lägg in den första serien, till exempel Svenska i grupp måndag till torsdag 09.00–11.00.');
        return;
      }
      l.innerHTML = veckoRutnat() + st.serier.map(serieKort).join('');
    } catch (e) { fel('nvSerier', e); }
  }

  // Veckan i överblick. Lördag och söndag visas bara om något ligger där.
  function veckoRutnat() {
    var perDag = {};
    st.serier.forEach(function (s) {
      s.dagar.forEach(function (d) {
        (perDag[d.veckodag] = perDag[d.veckodag] || []).push({ tid: d.starttid, slut: d.sluttid, titel: d.titel, typ: d.typ });
      });
    });
    var dagar = [1, 2, 3, 4, 5].concat(perDag[6] ? [6] : []).concat(perDag[7] ? [7] : []);
    return '<div class="nv-vecka-wrap"><div class="nv-vecka" style="grid-template-columns:repeat(' + dagar.length + ',minmax(120px,1fr))">' +
      dagar.map(function (d) {
        var pass = (perDag[d] || []).sort(function (a, b) { return a.tid < b.tid ? -1 : 1; });
        return '<div class="nv-vecka-dag"><div class="nv-vecka-h">' + DAG_KORT[d] + '</div>' +
          (pass.length ? pass.map(function (p) {
            return '<div class="nv-vecka-p"><span>' + esc(p.tid) + '–' + esc(p.slut) + '</span>' + (TYPER[p.typ] || {}).ikon + ' ' + esc(p.titel) + '</div>';
          }).join('') : '<div class="nv-vecka-tom">—</div>') + '</div>';
      }).join('') + '</div></div>';
  }

  function serieKort(s) {
    var t = TYPER[s.typ] || {};
    var dagar = s.dagar.slice().sort(function (a, b) { return a.veckodag - b.veckodag; });
    var sammaTid = dagar.every(function (d) { return d.starttid === dagar[0].starttid && d.sluttid === dagar[0].sluttid; });
    var dagText = sammaTid
      ? dagar.map(function (d) { return DAG_KORT[d.veckodag]; }).join(', ') + ' · ' + dagar[0].starttid + '–' + dagar[0].sluttid
      : dagar.map(function (d) { return DAG_KORT[d.veckodag] + ' ' + d.starttid + '–' + d.sluttid; }).join(' · ');
    var giltig = 'Från ' + visaDatum(s.giltig_fran) + (s.giltig_till ? ' till ' + visaDatum(s.giltig_till) : ', tills vidare');
    return '<div class="nv-serie">' +
      '<div class="nv-pass-titel">' + (t.ikon || '') + ' ' + esc(s.titel) + '</div>' +
      '<div class="nv-pass-meta">' + esc(dagText) + '</div>' +
      '<div class="nv-pass-meta">' + esc(giltig) + ' · ' + (s.intervall_veckor === 2 ? 'varannan vecka' : 'varje vecka') + ' · ' + esc(malgrupp(s.faser, s.spar)) + '</div>' +
      '<div class="nv-m-rad">' +
      '<button type="button" class="btn" onclick="nv.andraSerie(\'' + s.serie_id + '\')">Ändra serien</button>' +
      '<button type="button" class="btn nv-farlig" onclick="nv.avslutaSerie(\'' + s.serie_id + '\')">Avsluta serien</button>' +
      '</div></div>';
  }

  function nySerie() {
    var dagar = {}; for (var i = 1; i <= 7; i++) dagar[i] = DAG_KORT[i];
    modal(
      '<h3 class="nv-m-h">Ny serie</h3><p class="nv-m-sub">Ett pass som återkommer. Välj alla dagar det gäller.</p>' +
      '<div class="prog-grid">' +
      falt('Titel', '<input id="nvmTitel" class="prog-in" maxlength="120" placeholder="t.ex. Svenska i grupp">', 'nvmTitel') +
      falt('Typ', typSelect('nvmTyp', 'L'), 'nvmTyp') +
      falt('Starttid', '<input type="time" id="nvmStart" class="prog-in" value="09:00">', 'nvmStart') +
      falt('Sluttid', '<input type="time" id="nvmSlut" class="prog-in" value="11:00">', 'nvmSlut') +
      '</div>' +
      '<fieldset class="nv-omf"><legend>Veckodagar</legend>' + bockar('nvmDag', dagar, []) + '</fieldset>' +
      '<fieldset class="nv-omf"><legend>Hur ofta</legend>' +
      radio('nvmInt', '1', 'Varje vecka', true) + radio('nvmInt', '2', 'Varannan vecka', false) + '</fieldset>' +
      '<div class="prog-grid">' +
      falt('Gäller från', '<input type="date" id="nvmFran" class="prog-in" value="' + idag() + '">', 'nvmFran') +
      falt('Gäller till (valfritt)', '<input type="date" id="nvmTill" class="prog-in">', 'nvmTill') +
      '</div>' +
      '<fieldset class="nv-omf"><legend>För vilka faser? Inget val = alla</legend>' + bockar('nvmFas', FASER, []) + '</fieldset>' +
      '<fieldset class="nv-omf"><legend>För vilka spår? Inget val = alla</legend>' + bockar('nvmSpar', SPAR, []) + '</fieldset>' +
      '<div class="nv-m-act"><span id="nvmMsg" role="status"></span>' +
      '<button type="button" class="btn" onclick="nv.stang()">Avbryt</button>' +
      '<button type="button" class="btn btn-primary" onclick="nv.sparaSerie()">Spara serien</button></div>'
    );
  }

  async function sparaSerie() {
    var serie = {
      titel: varde('nvmTitel'), typ: varde('nvmTyp'), starttid: varde('nvmStart'), sluttid: varde('nvmSlut'),
      veckodagar: lasBockar('nvmDag').map(Number), intervall_veckor: Number(valtRadio('nvmInt') || 1),
      giltig_fran: varde('nvmFran'), giltig_till: varde('nvmTill') || null,
      faser: lasBockar('nvmFas'), spar: lasBockar('nvmSpar')
    };
    if (!serie.titel) { mmsg('Skriv en titel', 'err'); return; }
    if (!serie.veckodagar.length) { mmsg('Välj minst en veckodag', 'err'); return; }
    mmsg('Sparar…');
    try {
      await api('admin_create_serie', { serie: serie });
      stang();
      renderSchema();
    } catch (e) { mmsg(e.message, 'err'); }
  }

  function andraSerie(serieId) {
    var s = st.serier.find(function (x) { return x.serie_id === serieId; });
    if (!s) return;
    var d0 = s.dagar[0];
    var sammaTid = s.dagar.every(function (d) { return d.starttid === d0.starttid && d.sluttid === d0.sluttid; });
    modal(
      '<h3 class="nv-m-h">Ändra serien</h3><p class="nv-m-sub">Ändringen gäller alla dagar i serien från och med datumet nedan. ' +
      'Vill du bara ändra en viss dag, gör det från Dagens pass.</p>' +
      '<div class="prog-grid">' +
      falt('Titel', '<input id="nvmTitel" class="prog-in" maxlength="120" value="' + esc(s.titel) + '">', 'nvmTitel') +
      falt('Typ', typSelect('nvmTyp', s.typ), 'nvmTyp') +
      falt('Starttid', '<input type="time" id="nvmStart" class="prog-in" value="' + (sammaTid ? esc(d0.starttid) : '') + '">', 'nvmStart') +
      falt('Sluttid', '<input type="time" id="nvmSlut" class="prog-in" value="' + (sammaTid ? esc(d0.sluttid) : '') + '">', 'nvmSlut') +
      falt('Gäller från och med', '<input type="date" id="nvmFran" class="prog-in" value="' + idag() + '">', 'nvmFran') +
      '</div>' +
      (sammaTid ? '' : '<p class="nv-m-sub">Dagarna har olika tider. Lämna tiderna tomma för att behålla dem.</p>') +
      '<fieldset class="nv-omf"><legend>För vilka faser? Inget val = alla</legend>' + bockar('nvmFas', FASER, s.faser) + '</fieldset>' +
      '<fieldset class="nv-omf"><legend>För vilka spår? Inget val = alla</legend>' + bockar('nvmSpar', SPAR, s.spar) + '</fieldset>' +
      '<div class="nv-m-act"><span id="nvmMsg" role="status"></span>' +
      '<button type="button" class="btn" onclick="nv.stang()">Avbryt</button>' +
      '<button type="button" class="btn btn-primary" onclick="nv.sparaSerieAndring(\'' + serieId + '\')">Spara ändring</button></div>'
    );
  }

  async function sparaSerieAndring(serieId) {
    var s = st.serier.find(function (x) { return x.serie_id === serieId; });
    if (!s) return;
    var andring = {};
    var titel = varde('nvmTitel'), typ = varde('nvmTyp'), start = varde('nvmStart'), slut = varde('nvmSlut');
    if (titel !== s.titel) andring.titel = titel;
    if (typ !== s.typ) andring.typ = typ;
    var d0 = s.dagar[0];
    if (start && slut && (start !== d0.starttid || slut !== d0.sluttid || !s.dagar.every(function (d) { return d.starttid === d0.starttid; }))) {
      andring.starttid = start;
      andring.sluttid = slut;
    } else if ((start && !slut) || (!start && slut)) { mmsg('Fyll i både start- och sluttid', 'err'); return; }
    var faser = lasBockar('nvmFas'), spar = lasBockar('nvmSpar');
    if (JSON.stringify(faser.slice().sort()) !== JSON.stringify((s.faser || []).slice().sort())) andring.faser = faser;
    if (JSON.stringify(spar.slice().sort()) !== JSON.stringify((s.spar || []).slice().sort())) andring.spar = spar;
    if (!Object.keys(andring).length) { mmsg('Inget har ändrats'); return; }
    mmsg('Sparar…');
    try {
      await api('admin_edit_schema', { serieId: serieId, omfang: 'serie', andring: andring, fran_datum: varde('nvmFran') || idag() });
      stang();
      renderSchema();
    } catch (e) { mmsg(e.message, 'err'); }
  }

  function avslutaSerie(serieId) {
    var s = st.serier.find(function (x) { return x.serie_id === serieId; });
    if (!s) return;
    modal(
      '<h3 class="nv-m-h">Avsluta serien</h3><p class="nv-m-sub">' + esc(s.titel) + '. Inga nya pass skapas från och med datumet. ' +
      'Pass med registrerad närvaro ligger kvar.</p>' +
      '<div class="prog-grid">' + falt('Avsluta från och med', '<input type="date" id="nvmFran" class="prog-in" value="' + idag() + '">', 'nvmFran') + '</div>' +
      '<div class="nv-m-act"><span id="nvmMsg" role="status"></span>' +
      '<button type="button" class="btn" onclick="nv.stang()">Avbryt</button>' +
      '<button type="button" class="btn nv-farlig" onclick="nv.bekraftaAvsluta(\'' + serieId + '\')">Avsluta serien</button></div>'
    );
  }

  async function bekraftaAvsluta(serieId) {
    mmsg('Avslutar…');
    try {
      await api('admin_avsluta_schema', { serieId: serieId, omfang: 'serie', fran_datum: varde('nvmFran') || idag() });
      stang();
      renderSchema();
    } catch (e) { mmsg(e.message, 'err'); }
  }

  // ── Stil (injiceras en gång) ────────────────────────────────
  function stil() {
    if (document.getElementById('nvStil')) return;
    var s = document.createElement('style');
    s.id = 'nvStil';
    s.textContent = [
      '.nv-head{display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;margin-bottom:18px}',
      '.nv-scope{display:flex;flex-wrap:wrap;gap:8px;align-items:center}',
      '.nv-scope label{font-size:12.5px;font-weight:600;color:var(--tx2)}',
      '.nv-scope select{width:auto;min-width:170px}',
      '.nv-seg{display:inline-flex;border:1px solid var(--bd);border-radius:999px;padding:3px;background:var(--sf)}',
      '.nv-seg-b{border:0;background:none;padding:7px 16px;border-radius:999px;font:inherit;font-size:13px;font-weight:600;color:var(--tx2);cursor:pointer}',
      '.nv-seg-b.on{background:var(--nv);color:#fff}',
      '.nv-datum{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:16px}',
      '.nv-datum .prog-in{width:auto}',
      '.nv-datum-txt{font-weight:700;font-size:15px;margin-left:4px;text-transform:capitalize}',
      '.nv-pass{display:grid;grid-template-columns:70px 1fr auto;gap:14px;align-items:center;background:var(--sf);border:1px solid var(--bd);border-radius:var(--r);padding:14px 16px;margin-bottom:10px}',
      '.nv-pass--inst{opacity:.7}',
      '.nv-pass-tid{font-size:18px;font-weight:700;font-variant-numeric:tabular-nums;line-height:1.15}',
      '.nv-pass-tid span{display:block;font-size:12.5px;font-weight:500;color:var(--mu)}',
      '.nv-pass-mitt{min-width:0;display:grid;gap:5px}',
      '.nv-pass-titel{font-size:15px;font-weight:700}',
      '.nv-pass-meta{font-size:12.5px;color:var(--tx2)}',
      '.nv-pass-knappar{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end}',
      '@media(max-width:640px){.nv-pass{grid-template-columns:56px 1fr}.nv-pass-knappar{grid-column:1/-1;justify-content:stretch}.nv-pass-knappar .btn{flex:1}}',
      '.nv-pill{display:inline-block;font-size:11.5px;font-weight:700;padding:3px 9px;border-radius:999px}',
      '.nv-pill.gn{background:var(--gnb);color:var(--gn)}.nv-pill.rd{background:var(--rdb);color:var(--rd)}.nv-pill.mu{background:var(--sf2);color:var(--tx2);border:1px solid var(--bd)}',
      '.nv-dagfot{margin-top:6px;text-align:right}',
      '.nv-tomt{border:1px dashed var(--bd);border-radius:var(--r);padding:28px 20px;text-align:center;background:var(--sf)}',
      '.nv-tomt b{display:block;font-size:15px;margin-bottom:6px}.nv-tomt p{color:var(--tx2);font-size:13px;max-width:52ch;margin:0 auto 14px;line-height:1.55}',
      '.nv-tillbaka{border:0;background:none;color:var(--tx2);font:inherit;font-size:13px;cursor:pointer;padding:4px 0;margin-bottom:8px}',
      '.nv-n-head{margin-bottom:10px;display:grid;gap:4px}',
      '.nv-hint{color:var(--tx2);font-size:13px;margin:0 0 12px;line-height:1.5}',
      '.nv-lista{display:grid;gap:8px}',
      '.nv-rad{background:var(--sf);border:1px solid var(--bd);border-radius:var(--r);padding:11px 14px;display:grid;gap:8px}',
      '.nv-namn{font-weight:600;font-size:14px}',
      '.nv-chips{display:flex;flex-wrap:wrap;gap:6px}',
      '@media(max-width:520px){.nv-chips{display:grid;grid-template-columns:1fr 1fr}}',
      '.nv-chip{border:1.5px solid var(--bd);background:var(--sf);color:var(--tx2);border-radius:999px;padding:8px 13px;font:inherit;font-size:13px;font-weight:600;cursor:pointer;min-height:38px}',
      '.nv-chip.on.gn{background:var(--gnb);border-color:var(--gn);color:var(--gn)}',
      '.nv-chip.on.or{background:var(--orb);border-color:var(--or);color:var(--or)}',
      '.nv-chip.on.bl{background:var(--blb);border-color:var(--bl);color:var(--bl)}',
      '.nv-chip.on.rd{background:var(--rdb);border-color:var(--rd);color:var(--rd)}',
      '.nv-chip:focus-visible,.nv-seg-b:focus-visible{outline:2px solid var(--ac);outline-offset:2px}',
      '.nv-spara{position:sticky;bottom:0;display:flex;gap:12px;align-items:center;justify-content:flex-end;flex-wrap:wrap;background:var(--bg);padding:12px 0 calc(12px + env(safe-area-inset-bottom,0px));margin-top:12px;border-top:1px solid var(--bd)}',
      '#nvSparaMsg,#nvmMsg{font-size:13px;color:var(--tx2)}',
      '#nvSparaMsg.ok,#nvmMsg.ok{color:var(--gn);font-weight:600}#nvSparaMsg.err,#nvmMsg.err{color:var(--rd);font-weight:600}',
      '.nv-schema-top{display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap;margin-bottom:14px}',
      '.nv-schema-top .nv-hint{margin:0}',
      '.nv-vecka-wrap{overflow-x:auto;margin-bottom:16px}',
      '.nv-vecka{display:grid;gap:8px;min-width:0}',
      '.nv-vecka-dag{background:var(--sf);border:1px solid var(--bd);border-radius:var(--r);padding:10px;display:grid;gap:6px;align-content:start}',
      '.nv-vecka-h{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--mu)}',
      '.nv-vecka-p{font-size:12.5px;line-height:1.35;background:var(--sf2);border-radius:6px;padding:6px 8px}',
      '.nv-vecka-p span{display:block;font-weight:700;font-variant-numeric:tabular-nums}',
      '.nv-vecka-tom{color:var(--mu);font-size:13px}',
      '.nv-serie{background:var(--sf);border:1px solid var(--bd);border-radius:var(--r);padding:14px 16px;margin-bottom:10px;display:grid;gap:5px}',
      '.nv-ov{position:fixed;inset:0;background:rgba(15,23,41,.45);display:flex;align-items:flex-start;justify-content:center;padding:max(24px,env(safe-area-inset-top,0px)) 16px 24px;overflow-y:auto;z-index:1000}',
      '.nv-m{background:var(--sf);border-radius:14px;padding:22px;width:100%;max-width:560px;box-shadow:0 20px 50px rgba(0,0,0,.25)}',
      '.nv-m-h{font-size:18px;font-weight:700;margin:0 0 4px}.nv-m-sub{color:var(--tx2);font-size:13px;margin:0 0 14px;line-height:1.5}',
      '.nv-omf{border:1px solid var(--bd);border-radius:10px;padding:10px 14px 12px;margin:14px 0 0;display:grid;gap:8px}',
      '.nv-omf legend{font-size:12.5px;font-weight:700;color:var(--tx2);padding:0 4px}',
      '.nv-radio,.nv-bock{display:flex;gap:8px;align-items:flex-start;font-size:13.5px;cursor:pointer;line-height:1.4}',
      '.nv-radio input,.nv-bock input{margin-top:3px;accent-color:var(--nv)}',
      '.nv-radio.av{color:var(--mu);cursor:default}',
      '.nv-bockar{display:flex;flex-wrap:wrap;gap:8px 16px}',
      '.nv-m-act{display:flex;gap:10px;align-items:center;justify-content:flex-end;flex-wrap:wrap;margin-top:16px}',
      '.nv-m-act #nvmMsg{margin-right:auto}',
      '.nv-m-sek{border-top:1px solid var(--bd);margin-top:18px;padding-top:14px;display:grid;gap:10px}',
      '.nv-m-sek-h{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--mu)}',
      '.nv-m-rad{display:flex;flex-wrap:wrap;gap:8px}',
      '.btn.nv-farlig{color:var(--rd);border-color:var(--rdb)}',
      '.btn.nv-farlig:hover{background:var(--rdb)}'
    ].join('\n');
    document.head.appendChild(s);
  }

  // ── Publikt API ─────────────────────────────────────────────
  window.nv = {
    vy: function (v) { st.vy = v; render(); },
    dag: function (n) { st.datum = flytta(st.datum, n); renderDag(); },
    satDatum: function (d) { if (d) { st.datum = d; renderDag(); } },
    valjKommun: async function (id) {
      st.scope = id ? { kommunId: Number(id), enhetId: null } : null;
      sparaScope();
      await laddaEnheter();
      render();
    },
    valjEnhet: function (id) {
      if (!st.scope) return;
      st.scope.enhetId = id ? Number(id) : null;
      sparaScope();
      render();
    },
    oppnaNarvaro: oppnaNarvaro, satStatus: satStatus, satKommentar: satKommentar, sparaNarvaro: sparaNarvaro,
    andraPass: andraPass, sparaAndring: sparaAndring, installa: installa, installaDag: installaDag, avsluta: avsluta,
    nySerie: nySerie, sparaSerie: sparaSerie, andraSerie: andraSerie, sparaSerieAndring: sparaSerieAndring,
    avslutaSerie: avslutaSerie, bekraftaAvsluta: bekraftaAvsluta, stang: stang
  };

  window.narvaroRender = async function () {
    stil();
    var el = root();
    if (el) el.innerHTML = '<div class="ud-body-empty">Laddar…</div>';
    await initScope();
    render();
  };
})();
