/* ============================================================
 * CVmatchen — Praktikplatser (personalens vy)
 *
 * Fliken "Praktikplatser" i Matchningsverktyget:
 *  - registrera platser: arbetsgivare, innehåll, förväntningar,
 *    timmar, arbetstider, plats, period, krav
 *  - matcha en plats mot deltagarnas CV, språktest och körkort
 *  - spara kandidater med status från förslag till placerad
 *
 * Kandidatlistan är grunden för att senare dela platsen med deltagaren.
 * Matchningen skickar inga namn eller kontaktuppgifter till AI:n.
 * ============================================================ */
(function () {
  'use strict';

  var OMRADEN = {
    vard: 'Vård och omsorg', lager: 'Lager och logistik', service: 'Service och städ', bygg: 'Bygg och fastighet',
    kontor: 'Kontor och administration', handel: 'Handel och butik', restaurang: 'Restaurang och kök',
    stad: 'Park, gata och stad', annat: 'Annat'
  };
  var STATUS = { utkast: 'Utkast', oppen: 'Öppen', tillsatt: 'Tillsatt', avslutad: 'Avslutad' };
  var KSTATUS = {
    forslag: 'Förslag', tillfragad: 'Tillfrågad', intresserad: 'Intresserad',
    nej: 'Tackat nej', placerad: 'Placerad', avslutad: 'Avslutad'
  };
  var STEG = ['På väg mot steg 1', 'Steg 1 · Komma igång', 'Steg 2 · Klara vardagen', 'Steg 3 · Delta i arbetet', 'Steg 4 · Klara sig själv'];
  var SKEY = 'cvm_narvaro_scope';   // samma verksamhetsval som Närvaro

  var st = {
    scope: null, kommuner: [], enheter: [], platser: [], filter: 'aktiva',
    vald: null, kandidater: [], forslag: null, baraAktiva: true, laddar: false
  };

  // ── Hjälpare ────────────────────────────────────────────────
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function arSuper() { return typeof admin !== 'undefined' && admin && admin.role === 'superadmin'; }
  function root() { return document.getElementById('pkRoot'); }
  function varde(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; }
  function visaDatum(d) {
    if (!d) return '';
    return new Date(d + 'T12:00:00').toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' }).replace(/\.$/, '');
  }
  function period(p) {
    if (p.start_datum && p.slut_datum) return visaDatum(p.start_datum) + ' – ' + visaDatum(p.slut_datum);
    if (p.start_datum) return 'från ' + visaDatum(p.start_datum);
    if (p.slut_datum) return 'till ' + visaDatum(p.slut_datum);
    return '';
  }

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
  function api(action, data) {
    var d = Object.assign({}, data || {});
    if (st.scope) { d.kommunId = st.scope.kommunId; d.enhetId = st.scope.enhetId; }
    return anrop(action, d);
  }

  // ── Verksamhet ──────────────────────────────────────────────
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
  async function laddaEnheter() {
    st.enheter = [];
    if (!st.scope) return;
    try { st.enheter = (await anrop('admin_get_enheter', { filters: { kommun_id: st.scope.kommunId } })).data || []; } catch (e) {}
  }
  function sparaScope() { try { localStorage.setItem(SKEY, JSON.stringify(st.scope)); } catch (e) {} }

  function scopeHtml() {
    if (!arSuper()) return '';
    return '<div class="pk-scope"><label for="pkKommun">Verksamhet</label>' +
      '<select id="pkKommun" class="prog-in" onchange="pk.valjKommun(this.value)"><option value="">Välj kommun…</option>' +
      st.kommuner.map(function (k) {
        return '<option value="' + k.id + '"' + (st.scope && String(st.scope.kommunId) === String(k.id) ? ' selected' : '') + '>' + esc(k.name) + '</option>';
      }).join('') + '</select>' +
      '<select class="prog-in" aria-label="Enhet" onchange="pk.valjEnhet(this.value)"' + (st.scope ? '' : ' disabled') + '>' +
      '<option value="">Hela kommunen</option>' +
      st.enheter.map(function (e) {
        return '<option value="' + e.id + '"' + (st.scope && String(st.scope.enhetId) === String(e.id) ? ' selected' : '') + '>' + esc(e.name) + '</option>';
      }).join('') + '</select></div>';
  }

  // ── Lista ───────────────────────────────────────────────────
  async function laddaLista() {
    var el = root();
    if (!el) return;
    if (!st.scope) {
      el.innerHTML = scopeHtml() + tomt('Välj verksamhet', 'Välj kommun, och vid behov enhet, för att se och lägga upp praktikplatser.');
      return;
    }
    el.innerHTML = scopeHtml() + '<div class="ud-body-empty">Laddar praktikplatser…</div>';
    try {
      st.platser = (await api('admin_list_praktik', {})).platser || [];
      renderLista();
    } catch (e) {
      el.innerHTML = scopeHtml() + '<div class="ud-body-empty" style="color:var(--rd)">' + esc(e.message) + '</div>';
    }
  }

  function tomt(rubrik, text, extra) {
    return '<div class="pk-tomt"><b>' + esc(rubrik) + '</b><p>' + esc(text) + '</p>' + (extra || '') + '</div>';
  }

  function renderLista() {
    var el = root();
    if (!el) return;
    st.vald = null;
    var lista = st.platser.filter(function (p) {
      return st.filter === 'alla' || p.status === 'oppen' || p.status === 'utkast';
    });
    var h = scopeHtml() +
      '<div class="pk-bar"><div class="pk-seg" role="tablist">' +
      seg('aktiva', 'Öppna och utkast') + seg('alla', 'Alla (' + st.platser.length + ')') + '</div>' +
      '<button type="button" class="btn btn-primary" onclick="pk.ny()">+ Ny praktikplats</button></div>';
    if (!lista.length) {
      h += tomt(st.platser.length ? 'Inga öppna platser' : 'Inga praktikplatser än',
        'Lägg upp en plats med innehåll, timmar och förväntningar. Sedan kan du matcha den mot deltagarnas CV.');
    } else {
      h += '<div class="pk-grid">' + lista.map(kort).join('') + '</div>';
    }
    el.innerHTML = h;
  }
  function seg(id, txt) {
    var on = st.filter === id;
    return '<button type="button" role="tab" aria-selected="' + on + '" class="pk-seg-b' + (on ? ' on' : '') + '" onclick="pk.filter(\'' + id + '\')">' + esc(txt) + '</button>';
  }
  function kort(p) {
    var meta = [p.ort, p.timmar_per_vecka ? p.timmar_per_vecka.toString().replace('.', ',') + ' tim/v' : '', period(p)].filter(Boolean);
    var k = p.kandidater || { totalt: 0, placerade: 0 };
    return '<button type="button" class="pk-kort" onclick="pk.oppna(' + p.id + ')">' +
      '<span class="pk-kort-top"><span class="pk-pill ' + p.status + '">' + esc(STATUS[p.status]) + '</span>' +
      (p.yrkesomrade ? '<span class="pk-omr">' + esc(OMRADEN[p.yrkesomrade]) + '</span>' : '') + '</span>' +
      '<span class="pk-kort-t">' + esc(p.titel) + '</span>' +
      '<span class="pk-kort-a">' + esc(p.arbetsgivare) + '</span>' +
      (meta.length ? '<span class="pk-kort-m">' + esc(meta.join(' · ')) + '</span>' : '') +
      '<span class="pk-kort-k">' + k.placerade + ' av ' + p.antal_platser + ' tillsatta · ' + k.totalt + ' kandidater</span>' +
      '</button>';
  }

  // ── Detalj ──────────────────────────────────────────────────
  async function oppna(id) {
    st.vald = st.platser.find(function (p) { return p.id === id; }) || null;
    st.forslag = null;
    if (!st.vald) return renderLista();
    renderDetalj();
    await laddaKandidater();
  }
  async function laddaKandidater() {
    var box = document.getElementById('pkKand');
    if (box) box.innerHTML = '<div class="ud-body-empty">Laddar kandidater…</div>';
    try {
      st.kandidater = (await api('admin_list_praktik_kandidater', { praktikId: st.vald.id })).kandidater || [];
    } catch (e) {
      st.kandidater = [];
      if (box) box.innerHTML = '<div class="ud-body-empty" style="color:var(--rd)">' + esc(e.message) + '</div>';
      return;
    }
    renderKandidater();
  }

  function rad(etikett, v) {
    return v ? '<div class="pk-rad"><dt>' + esc(etikett) + '</dt><dd>' + esc(v) + '</dd></div>' : '';
  }
  function renderDetalj() {
    var p = st.vald, el = root();
    if (!el || !p) return;
    var tid = [p.timmar_per_vecka ? p.timmar_per_vecka.toString().replace('.', ',') + ' timmar i veckan' : '', p.arbetstider].filter(Boolean).join(' · ');
    var plats = [p.adress, p.ort].filter(Boolean).join(', ');
    var kontakt = [p.kontakt_namn, p.kontakt_telefon, p.kontakt_epost].filter(Boolean).join(' · ');
    var krav = [p.min_sprak_steg != null ? 'Språk: minst ' + STEG[p.min_sprak_steg] : '', p.korkort_krav ? 'B-körkort krävs' : ''].filter(Boolean).join(' · ');
    el.innerHTML =
      '<button type="button" class="pk-tillbaka" onclick="pk.lista()">‹ Alla praktikplatser</button>' +
      '<div class="pk-det">' +
      '<div class="pk-det-h"><div><span class="pk-pill ' + p.status + '">' + esc(STATUS[p.status]) + '</span>' +
      '<h3>' + esc(p.titel) + '</h3><div class="pk-det-a">' + esc(p.arbetsgivare) +
      (p.yrkesomrade ? ' · ' + esc(OMRADEN[p.yrkesomrade]) : '') + '</div></div>' +
      '<button type="button" class="btn" onclick="pk.andra()">Ändra</button></div>' +
      '<dl class="pk-dl">' +
      rad('Arbetstid', tid) + rad('Plats', plats) + rad('Period', period(p)) +
      rad('Antal platser', String(p.antal_platser)) + rad('Kontaktperson', kontakt) + rad('Krav för matchning', krav) +
      '</dl>' +
      (p.innehall ? '<div class="pk-txt"><b>Vad deltagaren gör</b><p>' + esc(p.innehall) + '</p></div>' : '') +
      (p.forvantningar ? '<div class="pk-txt"><b>Förväntningar</b><p>' + esc(p.forvantningar) + '</p></div>' : '') +
      (p.krav ? '<div class="pk-txt"><b>Arbetets krav</b><p>' + esc(p.krav) + '</p></div>' : '') +
      '</div>' +
      '<div class="pk-sek"><div class="pk-sek-h"><b>Kandidater</b></div><div id="pkKand"></div></div>' +
      '<div class="pk-sek"><div class="pk-sek-h"><b>Hitta kandidater</b>' +
      '<label class="pk-bock"><input type="checkbox" id="pkBaraAktiva"' + (st.baraAktiva ? ' checked' : '') +
      ' onchange="pk.baraAktiva(this.checked)"> Bara deltagare som är aktiva i program</label></div>' +
      '<p class="pk-hint">Matchar platsen mot CV, språktest och körkort för deltagarna i verksamheten. ' +
      'AI:n får inga namn eller kontaktuppgifter, och den bedömer bara det som står om arbetet och erfarenheten.</p>' +
      '<button type="button" class="btn btn-primary" onclick="pk.matcha()">Matcha mot deltagarna</button>' +
      '<div id="pkForslag"></div></div>';
    renderForslag();
  }

  function renderKandidater() {
    var box = document.getElementById('pkKand');
    if (!box) return;
    if (!st.kandidater.length) {
      box.innerHTML = '<p class="pk-hint">Inga kandidater än. Matcha nedan och lägg till dem som passar.</p>';
      return;
    }
    box.innerHTML = '<div class="pk-klista">' + st.kandidater.map(function (k) {
      var namn = k.name || namnFor(k.user_id);
      return '<div class="pk-krad">' +
        '<div class="pk-krad-n"><button type="button" class="pk-lank" onclick="pk.visaDeltagare(\'' + k.user_id + '\')">' + esc(namn) + '</button>' +
        (k.poang != null ? ' <span class="pk-poang">' + k.poang + '</span>' : '') +
        (k.motivering ? '<div class="pk-hint">' + esc(k.motivering) + '</div>' : '') + '</div>' +
        '<select class="prog-in pk-ksel" aria-label="Status för ' + esc(namn) + '" onchange="pk.kStatus(\'' + k.user_id + '\',this.value)">' +
        Object.keys(KSTATUS).map(function (s) {
          return '<option value="' + s + '"' + (s === k.status ? ' selected' : '') + '>' + KSTATUS[s] + '</option>';
        }).join('') + '</select>' +
        '<input class="prog-in pk-kkom" maxlength="300" placeholder="Kommentar — inga hälsouppgifter" aria-label="Kommentar för ' + esc(namn) + '" value="' + esc(k.kommentar || '') + '" ' +
        'onchange="pk.kKommentar(\'' + k.user_id + '\',this.value)">' +
        '<button type="button" class="pk-x" title="Ta bort ur listan" aria-label="Ta bort ' + esc(namn) + ' ur listan" onclick="pk.kTaBort(\'' + k.user_id + '\')">✕</button>' +
        '</div>';
    }).join('') + '</div><span id="pkKMsg" class="pk-hint" role="status"></span>';
  }

  function namnFor(uid) {
    try {
      var u = (typeof allUsers !== 'undefined' ? allUsers : []).find(function (x) { return (x.user_id || x.id) === uid; });
      if (u) {
        var cvd = (u.cv && (u.cv.data || u.cv)) || {};
        if (typeof cvName === 'function' && cvName(cvd)) return cvName(cvd);
        if (typeof displayName === 'function') return displayName(u).name;
      }
    } catch (e) {}
    return 'Deltagare ' + String(uid).slice(0, 6);
  }

  async function sparaKandidat(uid, data, tyst) {
    var m = document.getElementById('pkKMsg');
    try {
      await api('admin_save_praktik_kandidat', Object.assign({ praktikId: st.vald.id, userId: uid }, data));
      if (m && !tyst) m.textContent = 'Sparat';
      return true;
    } catch (e) {
      if (m) m.textContent = e.message; else alert(e.message);
      return false;
    }
  }

  // ── Matchning ───────────────────────────────────────────────
  function cvFor(u) { return (u.cv && (u.cv.data || u.cv)) || {}; }
  function harKorkort(cvd) {
    var txt = [].concat(cvd.licenses || [], cvd.certifications || [], cvd.skills || []).map(function (l) {
      return typeof l === 'string' ? l : (l.name || l.type || l.label || '');
    }).join(' ');
    if (/\bB\b|b-körkort|körkort\s*b|körkort/i.test(txt)) return true;
    return (cvd.licenses || []).length ? false : null;   // null = vet inte
  }
  function kandidatPool() {
    var p = st.vald;
    return (typeof allUsers !== 'undefined' ? allUsers : []).filter(function (u) {
      if (u.isDemo || !u.user_id) return false;
      if (String(u.kommun_id) !== String(p.kommun_id)) return false;
      if (p.enhet_id != null && String(u.enhet_id) !== String(p.enhet_id)) return false;
      if (st.baraAktiva && u.programstatus !== 'aktiv') return false;
      return true;
    });
  }
  function flaggor(u) {
    var p = st.vald, ut = [];
    var test = u.sprak && u.sprak.test;
    if (p.min_sprak_steg != null) {
      if (!test) ut.push({ t: 'Inget språktest', k: 'mu' });
      else if (test.steg < p.min_sprak_steg) ut.push({ t: 'Språk under kravet (' + STEG[test.steg].split(' · ')[0] + ')', k: 'rd' });
      else ut.push({ t: 'Språk ✓', k: 'gn' });
    }
    if (p.korkort_krav) {
      var kk = harKorkort(cvFor(u));
      ut.push(kk === true ? { t: 'Körkort ✓', k: 'gn' } : kk === false ? { t: 'Körkort saknas i CV', k: 'rd' } : { t: 'Körkort okänt', k: 'mu' });
    }
    if (p.start_datum && u.program_slut && u.program_slut < p.start_datum) ut.push({ t: 'Programmet slutar före start', k: 'rd' });
    return ut;
  }
  function cvSammandrag(u, nr) {
    var cvd = cvFor(u);
    var exp = (cvd.experience || cvd.workExperience || cvd.work || []).slice(0, 5).map(function (e) {
      return [e.title || e.role || '', e.company || e.employer || '', (e.startDate || e.from || '') + '–' + (e.endDate || e.to || 'nu')].filter(Boolean).join(', ');
    });
    var lista = function (a) { return (a || []).map(function (s) { return typeof s === 'string' ? s : (s.name || s.label || s.title || ''); }).filter(Boolean); };
    var test = u.sprak && u.sprak.test;
    return {
      id: 'k' + nr,
      titel: cvd.title || '',
      sammanfattning: String(cvd.summary || '').slice(0, 400),
      erfarenhet: exp,
      utbildning: (cvd.education || cvd.studies || []).slice(0, 3).map(function (e) { return [e.degree || e.program || '', e.school || e.institution || ''].join(' ').trim(); }).filter(Boolean),
      kompetenser: lista(cvd.skills || cvd.competencies).slice(0, 20),
      korkort: harKorkort(cvd),
      sprak_steg: test ? test.steg : null,
      fas: u.fas || null
    };
  }

  async function matcha() {
    var out = document.getElementById('pkForslag');
    var pool = kandidatPool();
    var harCv = pool.filter(function (u) {
      var c = cvFor(u);
      return c.title || c.summary || (c.experience || c.workExperience || []).length || (c.skills || c.competencies || []).length;
    });
    if (!pool.length) {
      st.forslag = { fel: st.baraAktiva
        ? 'Inga deltagare i verksamheten är aktiva i program. Bocka ur rutan för att matcha mot alla.'
        : 'Inga deltagare i verksamheten.' };
      return renderForslag();
    }
    if (!harCv.length) {
      st.forslag = { fel: 'Ingen av de ' + pool.length + ' deltagarna har fyllt i sitt CV än.' };
      return renderForslag();
    }
    out.innerHTML = '<div class="pk-hint" style="margin-top:12px">Matchar mot ' + harCv.length + ' CV…</div>';
    var p = st.vald, idMap = {};
    var kand = harCv.slice(0, 60).map(function (u, i) { idMap['k' + (i + 1)] = u; return cvSammandrag(u, i + 1); });
    var plats = {
      titel: p.titel, yrkesomrade: OMRADEN[p.yrkesomrade] || '', innehall: p.innehall || '', forvantningar: p.forvantningar || '',
      krav: p.krav || '', timmar_per_vecka: p.timmar_per_vecka, arbetstider: p.arbetstider || '',
      min_sprak_steg: p.min_sprak_steg, korkort_krav: p.korkort_krav
    };
    var system = 'Du hjälper en arbetsmarknadshandläggare att hitta deltagare till en praktikplats.\n' +
      'Du får platsen och en lista med anonyma CV-sammandrag. sprak_steg är deltagarens nivå på ett arbetsplatssvenska-test, 0–4 (null = inte testad). ' +
      'korkort: true = B-körkort i CV, false = inte, null = okänt.\n' +
      'Bedöm bara hur erfarenhet, kompetenser, utbildning, språknivå och körkort passar platsens innehåll och krav. ' +
      'Gissa aldrig hälsa, ålder, kön, ursprung eller religion och låt det aldrig påverka. ' +
      'Praktik är till för att lära: ta med deltagare med överförbar erfarenhet eller tydligt intresse även om de saknar exakt samma yrke.\n' +
      'Svara ENDAST med giltig JSON: {"matches":[{"id":"k1","score":0-100,"motivering":"1–2 meningar på enkel svenska: vad som passar och vad som saknas","tag":"kort etikett"}]}\n' +
      'Max 10 kandidater med score >= 35, högst först.';
    try {
      var r = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001', max_tokens: 2500, system: system,
          messages: [{ role: 'user', content: 'PRAKTIKPLATS:\n' + JSON.stringify(plats, null, 1) + '\n\nKANDIDATER:\n' + JSON.stringify(kand, null, 1) }]
        })
      });
      if (!r.ok) throw new Error('AI-anropet misslyckades (' + r.status + ')');
      var data = await r.json();
      var raw = (data.content || []).map(function (b) { return b.text || ''; }).join('').replace(/```json|```/g, '').trim();
      var parsed = JSON.parse(raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1));
      var finns = {};
      st.kandidater.forEach(function (k) { finns[k.user_id] = true; });
      st.forslag = {
        antal: harCv.length,
        lista: (parsed.matches || []).filter(function (m) { return idMap[m.id]; }).map(function (m) {
          var u = idMap[m.id];
          return {
            user_id: u.user_id, namn: namnFor(u.user_id), score: Math.max(0, Math.min(100, parseInt(m.score, 10) || 0)),
            motivering: String(m.motivering || ''), tag: String(m.tag || ''), flaggor: flaggor(u), tillagd: !!finns[u.user_id]
          };
        })
      };
    } catch (e) {
      st.forslag = { fel: e.message && /JSON|token|Unexpected/.test(e.message) ? 'Kunde inte tolka AI-svaret. Försök igen.' : e.message };
    }
    renderForslag();
  }

  function renderForslag() {
    var out = document.getElementById('pkForslag');
    if (!out) return;
    var f = st.forslag;
    if (!f) { out.innerHTML = ''; return; }
    if (f.fel) { out.innerHTML = '<div class="pk-varn">' + esc(f.fel) + '</div>'; return; }
    if (!f.lista.length) { out.innerHTML = '<div class="pk-varn">Ingen tydlig matchning bland ' + f.antal + ' CV.</div>'; return; }
    out.innerHTML = '<div class="pk-hint" style="margin:12px 0 8px">' + f.lista.length + ' förslag av ' + f.antal + ' CV</div>' +
      '<div class="pk-flista">' + f.lista.map(function (m, i) {
        var farg = m.score >= 75 ? 'gn' : m.score >= 55 ? 'or' : 'mu';
        return '<div class="pk-f">' +
          '<div class="pk-f-p ' + farg + '">' + m.score + '</div>' +
          '<div class="pk-f-b"><div class="pk-f-n"><button type="button" class="pk-lank" onclick="pk.visaDeltagare(\'' + m.user_id + '\')">' + esc(m.namn) + '</button>' +
          (m.tag ? ' <span class="pk-chip ' + farg + '">' + esc(m.tag) + '</span>' : '') +
          m.flaggor.map(function (x) { return ' <span class="pk-chip ' + x.k + '">' + esc(x.t) + '</span>'; }).join('') + '</div>' +
          '<div class="pk-hint">' + esc(m.motivering) + '</div></div>' +
          (m.tillagd ? '<span class="pk-hint">I listan</span>'
            : '<button type="button" class="btn" onclick="pk.laggTill(' + i + ')">Lägg till</button>') +
          '</div>';
      }).join('') + '</div>';
  }

  async function laggTill(i) {
    var m = st.forslag && st.forslag.lista[i];
    if (!m) return;
    var ok = await sparaKandidat(m.user_id, { status: 'forslag', poang: m.score, motivering: m.motivering }, true);
    if (!ok) return;
    m.tillagd = true;
    renderForslag();
    await laddaKandidater();
  }

  // ── Formulär ────────────────────────────────────────────────
  function falt(etikett, html, id, bred) {
    return '<div class="prog-f' + (bred ? ' pk-bred' : '') + '"><label' + (id ? ' for="' + id + '"' : '') + '>' + esc(etikett) + '</label>' + html + '</div>';
  }
  function inp(id, v, extra) { return '<input id="' + id + '" class="prog-in" value="' + esc(v == null ? '' : v) + '" ' + (extra || '') + '>'; }
  function ta(id, v, max, ph) {
    return '<textarea id="' + id + '" class="prog-in pk-ta" maxlength="' + max + '" placeholder="' + esc(ph || '') + '">' + esc(v || '') + '</textarea>';
  }
  function sel(id, alt, valt, tom) {
    return '<select id="' + id + '" class="prog-in">' + (tom ? '<option value="">' + esc(tom) + '</option>' : '') +
      Object.keys(alt).map(function (k) {
        return '<option value="' + k + '"' + (String(k) === String(valt) ? ' selected' : '') + '>' + esc(alt[k]) + '</option>';
      }).join('') + '</select>';
  }

  function formular(p) {
    p = p || { status: 'oppen', antal_platser: 1 };
    var steg = {}; STEG.forEach(function (s, i) { steg[i] = s; });
    modal(
      '<h3 class="pk-m-h">' + (p.id ? 'Ändra praktikplats' : 'Ny praktikplats') + '</h3>' +
      '<p class="pk-hint">Skriv så att deltagaren förstår vad platsen innebär. Fälten med * krävs.</p>' +
      '<div class="pk-fgrid">' +
      falt('Titel *', inp('pkf_titel', p.titel, 'maxlength="120" placeholder="t.ex. Lagerarbete, plock och pack"'), 'pkf_titel', true) +
      falt('Arbetsgivare *', inp('pkf_arbetsgivare', p.arbetsgivare, 'maxlength="120"'), 'pkf_arbetsgivare') +
      falt('Yrkesområde', sel('pkf_yrkesomrade', OMRADEN, p.yrkesomrade, 'Välj…'), 'pkf_yrkesomrade') +
      falt('Vad deltagaren gör', ta('pkf_innehall', p.innehall, 2000, 'Arbetsuppgifter en vanlig dag'), 'pkf_innehall', true) +
      falt('Förväntningar', ta('pkf_forvantningar', p.forvantningar, 2000, 'Vad arbetsgivaren förväntar sig, och vad deltagaren kan förvänta sig: handledare, introduktion, chans till anställning'), 'pkf_forvantningar', true) +
      falt('Arbetets krav', ta('pkf_krav', p.krav, 1000, 'Beskriv arbetet, t.ex. "mycket stående, lyft upp till 15 kg". Inte deltagarens hälsa.'), 'pkf_krav', true) +
      falt('Timmar per vecka', inp('pkf_timmar', p.timmar_per_vecka, 'inputmode="decimal" placeholder="t.ex. 20"'), 'pkf_timmar') +
      falt('Arbetstider', inp('pkf_arbetstider', p.arbetstider, 'maxlength="200" placeholder="t.ex. mån–tor 08–13"'), 'pkf_arbetstider') +
      falt('Startdatum', '<input type="date" id="pkf_start" class="prog-in" value="' + esc(p.start_datum || '') + '">', 'pkf_start') +
      falt('Slutdatum', '<input type="date" id="pkf_slut" class="prog-in" value="' + esc(p.slut_datum || '') + '">', 'pkf_slut') +
      falt('Adress', inp('pkf_adress', p.adress, 'maxlength="200"'), 'pkf_adress') +
      falt('Ort', inp('pkf_ort', p.ort, 'maxlength="80"'), 'pkf_ort') +
      falt('Kontaktperson', inp('pkf_knamn', p.kontakt_namn, 'maxlength="120"'), 'pkf_knamn') +
      falt('Telefon', inp('pkf_ktel', p.kontakt_telefon, 'maxlength="40" inputmode="tel"'), 'pkf_ktel') +
      falt('E-post', inp('pkf_kepost', p.kontakt_epost, 'maxlength="160" type="email"'), 'pkf_kepost') +
      falt('Antal platser', inp('pkf_antal', p.antal_platser, 'type="number" min="1" max="50"'), 'pkf_antal') +
      falt('Lägsta språknivå', sel('pkf_sprak', steg, p.min_sprak_steg, 'Inget krav'), 'pkf_sprak') +
      falt('Status', sel('pkf_status', STATUS, p.status), 'pkf_status') +
      '</div>' +
      '<label class="pk-bock" style="margin-top:12px"><input type="checkbox" id="pkf_korkort"' + (p.korkort_krav ? ' checked' : '') + '> B-körkort krävs</label>' +
      '<div class="pk-m-act"><span id="pkMsg" role="status"></span>' +
      '<button type="button" class="btn" onclick="pk.stang()">Avbryt</button>' +
      '<button type="button" class="btn btn-primary" onclick="pk.spara(' + (p.id || 0) + ')">Spara</button></div>'
    );
  }

  async function spara(id) {
    var m = document.getElementById('pkMsg');
    var p = {
      titel: varde('pkf_titel'), arbetsgivare: varde('pkf_arbetsgivare'), yrkesomrade: varde('pkf_yrkesomrade'),
      innehall: varde('pkf_innehall'), forvantningar: varde('pkf_forvantningar'), krav: varde('pkf_krav'),
      timmar_per_vecka: varde('pkf_timmar'), arbetstider: varde('pkf_arbetstider'),
      start_datum: varde('pkf_start'), slut_datum: varde('pkf_slut'), adress: varde('pkf_adress'), ort: varde('pkf_ort'),
      kontakt_namn: varde('pkf_knamn'), kontakt_telefon: varde('pkf_ktel'), kontakt_epost: varde('pkf_kepost'),
      antal_platser: varde('pkf_antal') || 1, min_sprak_steg: varde('pkf_sprak'), status: varde('pkf_status'),
      korkort_krav: !!(document.getElementById('pkf_korkort') || {}).checked
    };
    if (!p.titel || !p.arbetsgivare) { m.textContent = 'Fyll i titel och arbetsgivare'; m.className = 'err'; return; }
    if (id) p.id = id;
    m.className = ''; m.textContent = 'Sparar…';
    try {
      var r = await api('admin_save_praktik', { praktik: p });
      stang();
      st.platser = (await api('admin_list_praktik', {})).platser || [];
      await oppna(r.id);
    } catch (e) { m.textContent = e.message; m.className = 'err'; }
  }

  // ── Modal ───────────────────────────────────────────────────
  function modal(html) {
    stang();
    var o = document.createElement('div');
    o.className = 'pk-ov'; o.id = 'pkOv';
    o.innerHTML = '<div class="pk-m" role="dialog" aria-modal="true">' + html + '</div>';
    o.addEventListener('click', function (e) { if (e.target === o) stang(); });
    document.body.appendChild(o);
    var f = o.querySelector('input,select,textarea');
    if (f) f.focus();
  }
  function stang() { var o = document.getElementById('pkOv'); if (o) o.remove(); }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') stang(); });

  // ── Stil ────────────────────────────────────────────────────
  function stil() {
    if (document.getElementById('pkStil')) return;
    var s = document.createElement('style');
    s.id = 'pkStil';
    s.textContent = [
      '.pk-scope{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:14px;font-size:12px;font-weight:600}',
      '.pk-scope select{width:auto;min-width:160px}',
      '.pk-bar{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:14px}',
      '.pk-seg{display:inline-flex;border:1px solid var(--bd);border-radius:8px;overflow:hidden}',
      '.pk-seg-b{border:0;background:var(--sf);padding:7px 12px;font:inherit;font-size:12px;font-weight:600;cursor:pointer;color:var(--tx2)}',
      '.pk-seg-b.on{background:var(--tx);color:#fff}',
      '.pk-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}',
      '.pk-kort{text-align:left;font:inherit;background:var(--sf);border:1px solid var(--bd);border-radius:12px;padding:14px;cursor:pointer;display:flex;flex-direction:column;gap:4px;color:var(--tx)}',
      '.pk-kort:hover{border-color:var(--ac)}',
      '.pk-kort-top{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:4px}',
      '.pk-kort-t{font-size:15px;font-weight:700}.pk-kort-a{font-size:13px;color:var(--tx2)}',
      '.pk-kort-m,.pk-kort-k,.pk-omr{font-size:12px;color:var(--mu)}.pk-kort-k{margin-top:6px}',
      '.pk-pill{display:inline-block;font-size:11px;font-weight:700;padding:2px 8px;border-radius:6px;background:var(--bg,#f3f5f8);color:var(--tx2)}',
      '.pk-pill.oppen{background:#dcfce7;color:#166534}.pk-pill.utkast{background:#fef3c7;color:#92400e}.pk-pill.tillsatt{background:#dbeafe;color:#1e40af}',
      '.pk-tomt{border:1px dashed var(--bd);border-radius:12px;padding:28px 20px;text-align:center;background:var(--sf)}',
      '.pk-tomt p{color:var(--tx2);font-size:13px;margin:6px 0 0}',
      '.pk-tillbaka{border:0;background:none;font:inherit;font-size:13px;color:var(--ac);cursor:pointer;padding:0;margin-bottom:12px}',
      '.pk-det,.pk-sek{background:var(--sf);border:1px solid var(--bd);border-radius:12px;padding:18px;margin-bottom:14px}',
      '.pk-det-h{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}',
      '.pk-det-h h3{font-size:18px;margin:6px 0 2px}.pk-det-a{color:var(--tx2);font-size:13px}',
      '.pk-dl{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px 18px;margin:16px 0 4px}',
      '.pk-rad dt{font-size:11px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.03em}.pk-rad dd{margin:2px 0 0;font-size:13px}',
      '.pk-txt{margin-top:14px;font-size:13px}.pk-txt p{margin:4px 0 0;white-space:pre-line;line-height:1.55;color:var(--tx2)}',
      '.pk-sek-h{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:8px}',
      '.pk-hint{font-size:12px;color:var(--mu);line-height:1.5;margin:4px 0 10px}',
      '.pk-bock{display:inline-flex;align-items:center;gap:6px;font-size:12px;cursor:pointer}',
      '.pk-varn{margin-top:12px;padding:12px 14px;border-radius:8px;background:#fffaeb;border:1px solid #f0d78c;font-size:13px;color:#92400e}',
      '.pk-flista,.pk-klista{display:grid;gap:8px}',
      '.pk-f{display:flex;gap:12px;align-items:flex-start;border:1px solid var(--bd);border-radius:10px;padding:12px}',
      '.pk-f-p{flex:0 0 40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;background:#f3f5f8;color:var(--mu)}',
      '.pk-f-p.gn{background:#dcfce7;color:#166534}.pk-f-p.or{background:#fef3c7;color:#92400e}',
      '.pk-f-b{flex:1;min-width:0}.pk-f-n{font-weight:700;font-size:14px;display:flex;flex-wrap:wrap;gap:4px;align-items:center}',
      '.pk-f-b .pk-hint{margin:4px 0 0}',
      '.pk-chip{font-size:11px;font-weight:600;padding:2px 7px;border-radius:6px;background:#f3f5f8;color:var(--tx2)}',
      '.pk-chip.gn{background:#dcfce7;color:#166534}.pk-chip.or{background:#fef3c7;color:#92400e}.pk-chip.rd{background:#fee2e2;color:#991b1b}',
      '.pk-lank{border:0;background:none;padding:0;font:inherit;font-weight:700;color:var(--tx);cursor:pointer;text-decoration:underline;text-underline-offset:2px}',
      '.pk-krad{display:grid;grid-template-columns:1fr 150px 1fr 32px;gap:8px;align-items:start;border-bottom:1px solid var(--bd);padding:8px 0}',
      '.pk-krad .pk-hint{margin:2px 0 0}.pk-poang{font-size:11px;font-weight:700;color:var(--mu)}',
      '.pk-x{border:1px solid var(--bd);background:var(--sf);border-radius:8px;height:34px;cursor:pointer;color:var(--mu)}',
      '.pk-ov{position:fixed;inset:0;background:rgba(15,23,41,.45);display:flex;align-items:flex-start;justify-content:center;padding:24px 16px;overflow-y:auto;z-index:1000}',
      '.pk-m{background:var(--sf);border-radius:14px;padding:22px;width:100%;max-width:680px;box-shadow:0 20px 50px rgba(0,0,0,.25)}',
      '.pk-m-h{font-size:18px;font-weight:700;margin:0 0 4px}',
      '.pk-fgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px 14px}.pk-bred{grid-column:1/-1}',
      '.pk-ta{width:100%;min-height:72px;resize:vertical;font:inherit;font-size:13px;padding:8px 10px;box-sizing:border-box}',
      '.pk-m-act{display:flex;justify-content:flex-end;align-items:center;gap:8px;margin-top:18px;flex-wrap:wrap}',
      '.pk-m-act span{margin-right:auto;font-size:12px}.pk-m-act span.err,#pkMsg.err{color:var(--rd)}',
      '@media (max-width:640px){.pk-fgrid{grid-template-columns:1fr}.pk-krad{grid-template-columns:1fr 32px}.pk-krad .pk-ksel,.pk-krad .pk-kkom{grid-column:1/2}}'
    ].join('\n');
    document.head.appendChild(s);
  }

  // ── Publikt API ─────────────────────────────────────────────
  window.pk = {
    lista: function () { st.vald = null; laddaLista(); },
    filter: function (f) { st.filter = f; renderLista(); },
    ny: function () { formular(null); },
    andra: function () { formular(st.vald); },
    spara: spara, stang: stang, oppna: oppna, matcha: matcha, laggTill: laggTill,
    baraAktiva: function (v) { st.baraAktiva = !!v; },
    visaDeltagare: function (uid) { if (typeof openDetail === 'function') openDetail(uid); },
    kStatus: async function (uid, s) { if (await sparaKandidat(uid, { status: s })) await laddaKandidater(); },
    kKommentar: function (uid, v) { sparaKandidat(uid, { kommentar: v }); },
    kTaBort: async function (uid) {
      if (!confirm('Ta bort deltagaren ur kandidatlistan?')) return;
      if (await sparaKandidat(uid, { ta_bort: true }, true)) {
        if (st.forslag && st.forslag.lista) st.forslag.lista.forEach(function (m) { if (m.user_id === uid) m.tillagd = false; });
        await laddaKandidater(); renderForslag();
      }
    },
    valjKommun: async function (id) {
      st.scope = id ? { kommunId: Number(id), enhetId: null } : null;
      sparaScope(); await laddaEnheter(); laddaLista();
    },
    valjEnhet: function (id) {
      if (!st.scope) return;
      st.scope.enhetId = id ? Number(id) : null;
      sparaScope(); laddaLista();
    }
  };

  window.praktikRender = async function () {
    stil();
    var el = root();
    if (el) el.innerHTML = '<div class="ud-body-empty">Laddar…</div>';
    await initScope();
    if (st.vald) { renderDetalj(); laddaKandidater(); } else laddaLista();
  };
})();
