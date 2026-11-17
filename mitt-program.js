/* ============================================================
   CVmatchen — Mitt schema (deltagarens vy, kravspec F2.3 + F1.5)
   ------------------------------------------------------------
   Visas BARA för deltagare med programstatus Aktiv. Övriga ser
   ingen skillnad i appen.

   - mpHejKort(id): dagens pass överst på startsidan.
   - mpOppna(id, tillbaka): hela veckan, egen närvaro per pass och
     närvaro per vecka.

   Ingen ny menyknapp: schemat nås från startsidan. Enkelt språk,
   ikoner för passtyp och uppläsning av varje dag.
   ============================================================ */
(function () {
  'use strict';

  var TYP = {
    L: { ikon: '🏠', namn: 'På plats' },
    U: { ikon: '🌳', namn: 'Ute' },
    A: { ikon: '🏢', namn: 'Hos en arbetsgivare' },
    D: { ikon: '💻', namn: 'Digitalt' }
  };
  var FAS = { landa: 'Landa', rusta: 'Rusta', valja_soka: 'Välja och söka' };
  var NARV = {
    narvarande:          { ikon: '✓', text: 'Du var här', k: 'ok' },
    sen:                 { ikon: '⏱', text: 'Du kom sent', k: 'sen' },
    franvarande_giltig:  { ikon: '–', text: 'Frånvaro, anmäld', k: 'fr' },
    franvarande_ogiltig: { ikon: '✗', text: 'Frånvaro', k: 'fr' }
  };

  var cache = { data: null, fran: null, tid: 0, token: null };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function datumText(d, lang) {
    try {
      return new Date(d + 'T12:00:00').toLocaleDateString('sv-SE',
        lang ? { weekday: 'long', day: 'numeric', month: 'long' } : { weekday: 'short', day: 'numeric', month: 'short' })
        .replace(/\.(?=\s|$)/g, '');
    } catch (e) { return d; }
  }
  function veckonummer(d) {
    var t = new Date(d + 'T12:00:00Z');
    var dag = t.getUTCDay() || 7;
    t.setUTCDate(t.getUTCDate() + 4 - dag);
    var start = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
    return Math.ceil(((t - start) / 86400000 + 1) / 7);
  }
  function flytta(d, n) { var t = new Date(d + 'T12:00:00Z'); t.setUTCDate(t.getUTCDate() + n); return t.toISOString().slice(0, 10); }

  // "09:00" läses som "klockan 9", "09:30" som "klockan 9 och 30"
  function tidTal(t) {
    var p = String(t).split(':'), h = Number(p[0]), m = Number(p[1]);
    return 'klockan ' + h + (m ? ' och ' + m : '');
  }
  function passMening(p) {
    var t = TYP[p.typ] || { namn: '' };
    return (p.installt ? 'Inställt. ' : '') + tidTal(p.starttid) + ' till ' + tidTal(p.sluttid) + ', ' + p.titel + ', ' + t.namn.toLowerCase() + '.';
  }

  // ── Uppläsning ──────────────────────────────────────────────
  var rost = null;
  function valjRost() {
    if (!window.speechSynthesis) return;
    var sv = (window.speechSynthesis.getVoices() || []).filter(function (v) { return /^sv/i.test(v.lang || ''); });
    rost = sv.find(function (v) { return /natural|online|neural/i.test(v.name); }) || sv[0] || null;
  }
  if (window.speechSynthesis) { valjRost(); window.speechSynthesis.onvoiceschanged = valjRost; }
  function las(text) {
    if (!window.speechSynthesis || !text) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = 'sv-SE';
      u.rate = 0.9;
      if (rost) u.voice = rost;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }
  function hor(text, etikett) {
    if (!window.speechSynthesis) return '';
    return '<button type="button" class="mp-hor" data-las="' + esc(text) + '" aria-label="' + esc(etikett || 'Lyssna') + '">🔊</button>';
  }

  // ── Data ────────────────────────────────────────────────────
  function hamta(fran) {
    if (!window.authAccessToken) return Promise.resolve(null);
    // Cachen är knuten till inloggningen: delar två deltagare telefon får
    // den andra aldrig se den förstas schema.
    if (cache.data && cache.token === window.authAccessToken && cache.fran === (fran || 'nu') && Date.now() - cache.tid < 60000) {
      return Promise.resolve(cache.data);
    }
    var token = window.authAccessToken;
    return fetch('/api/supabase', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'my_program', accessToken: token, fran: fran || undefined })
    }).then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d) { cache = { data: d, fran: fran || 'nu', tid: Date.now(), token: token }; } return d; })
      .catch(function () { return null; });
  }

  // ── Kortet på startsidan ────────────────────────────────────
  function hejKort(id) {
    var el = document.getElementById(id);
    if (!el) return Promise.resolve();
    return hamta().then(function (d) {
      if (!d || !d.iProgram) { el.hidden = true; el.innerHTML = ''; return; }
      var idag = (d.dagar || []).find(function (x) { return x.datum === d.idag; }) || { pass: [] };
      var lista = idag.pass.length
        ? idag.pass.map(function (p) {
            var t = TYP[p.typ] || {};
            return '<div class="mp-k-pass' + (p.installt ? ' mp-inst' : '') + '"><span class="mp-k-tid">' + esc(p.starttid) + '</span>' +
              '<span class="mp-k-ikon" aria-hidden="true">' + (t.ikon || '') + '</span><span class="mp-k-titel">' + esc(p.titel) +
              (p.installt ? ' <b>Inställt</b>' : '') + '</span></div>';
          }).join('')
        : '<div class="mp-k-tom">Inga pass idag.</div>';
      var upplast = 'Idag, ' + datumText(d.idag, true) + '. ' +
        (idag.pass.length ? idag.pass.map(passMening).join(' ') : 'Du har inga pass idag.');
      el.hidden = false;
      el.innerHTML =
        '<div class="mp-kort">' +
        '<div class="mp-k-h"><span>📅 Idag · ' + esc(datumText(d.idag)) + '</span>' + hor(upplast, 'Lyssna på dagens schema') + '</div>' +
        lista +
        '<button type="button" class="mp-k-knapp" data-mp-oppna="1">Se hela veckan →</button>' +
        '</div>';
    });
  }

  // ── Hela veckan ─────────────────────────────────────────────
  var aktivVy = null;
  function oppna(id, tillbaka, fran) {
    var el = document.getElementById(id);
    if (!el) return;
    aktivVy = { id: id, tillbaka: tillbaka, fran: fran || null };
    el.innerHTML = '<div class="mp-vy"><div class="mp-laddar">Laddar ditt schema…</div></div>';
    hamta(fran).then(function (d) {
      if (!d) { el.innerHTML = '<div class="mp-vy"><div class="mp-laddar">Kunde inte hämta schemat. Försök igen om en stund.</div></div>'; return; }
      if (!d.iProgram) { el.innerHTML = '<div class="mp-vy"><div class="mp-laddar">Du har inget schema just nu.</div></div>'; return; }
      var fasRad = 'Du är i fasen <b>' + esc(FAS[d.fas] || '—') + '</b>.' +
        (d.fasNy ? ' Från ' + esc(datumText(d.fasNyFran, true)) + ' går du vidare till <b>' + esc(FAS[d.fasNy]) + '</b>.' : '');
      var dagar = d.dagar.filter(function (x, i) { return i < 5 || x.pass.length; });
      var html =
        '<div class="mp-vy">' +
        (tillbaka ? '<button type="button" class="mp-tillbaka" data-mp-tillbaka="1">← Tillbaka</button>' : '') +
        '<h2 class="mp-h">Mitt schema</h2>' +
        '<p class="mp-fas">' + fasRad + '</p>' +
        '<div class="mp-veckonav">' +
        '<button type="button" class="mp-pil" data-mp-vecka="-7" aria-label="Föregående vecka">‹</button>' +
        '<span>Vecka ' + veckonummer(d.fran) + '</span>' +
        '<button type="button" class="mp-pil" data-mp-vecka="7" aria-label="Nästa vecka">›</button>' +
        '</div>' +
        temaRuta(d.tema) +
        dagar.map(function (dag) { return dagKort(dag, d.idag); }).join('') +
        narvaroDel(d.veckor) +
        '<p class="mp-not">' + Object.keys(TYP).map(function (k) { return TYP[k].ikon + ' ' + TYP[k].namn; }).join(' · ') + '</p>' +
        '</div>';
      el.innerHTML = html;
      var idag = el.querySelector('.mp-dag--idag');
      if (idag && idag.scrollIntoView) { try { idag.scrollIntoView({ block: 'nearest' }); } catch (e) {} }
    });
  }

  // Veckans tema. Personalens fält (KBT-tema m.m.) skickas aldrig hit.
  var TEMA_RADER = [
    ['tema', '🎯', 'Veckans tema'], ['utflykt', '🚶', 'Utflykt'], ['ordtema', '🗣️', 'Veckans ord'],
    ['halsofokus', '💚', 'Hälsa'], ['modul', '📚', 'Veckans modul']
  ];
  function temaRuta(t) {
    if (!t) return '';
    var rader = TEMA_RADER.filter(function (r) { return t[r[0]]; });
    if (!rader.length && !t.testvecka) return '';
    var upplast = rader.map(function (r) { return r[2] + ': ' + t[r[0]] + '.'; }).join(' ') +
      (t.testvecka ? ' Den här veckan är det testvecka. Gör språktestet under Träna och språkträning.' : '');
    return '<div class="mp-tema"><div class="mp-dag-h"><span>Den här veckan</span>' + hor(upplast, 'Lyssna på veckans tema') + '</div>' +
      rader.map(function (r) {
        return '<div class="mp-tema-r"><span aria-hidden="true">' + r[1] + '</span><span><b>' + r[2] + ':</b> ' + esc(t[r[0]]) + '</span></div>';
      }).join('') +
      (t.testvecka ? '<div class="mp-tema-test">📏 Testvecka — gör språktestet under <b>Träna → Språkträning</b>.</div>' : '') +
      '</div>';
  }

  function dagKort(dag, idag) {
    var arIdag = dag.datum === idag, passerad = dag.datum < idag;
    var upplast = datumText(dag.datum, true) + '. ' + (dag.pass.length ? dag.pass.map(passMening).join(' ') : 'Inga pass.');
    return '<div class="mp-dag' + (arIdag ? ' mp-dag--idag' : '') + '">' +
      '<div class="mp-dag-h"><span>' + (arIdag ? 'Idag · ' : '') + esc(datumText(dag.datum, true)) + '</span>' + hor(upplast, 'Lyssna på dagen') + '</div>' +
      (dag.pass.length
        ? dag.pass.map(function (p) { return passRad(p, passerad || arIdag); }).join('')
        : '<div class="mp-tom">Inga pass</div>') +
      '</div>';
  }

  function passRad(p, visaNarvaro) {
    var t = TYP[p.typ] || { ikon: '', namn: '' };
    var n = visaNarvaro && p.narvaro ? NARV[p.narvaro] : null;
    return '<div class="mp-pass' + (p.installt ? ' mp-inst' : '') + '">' +
      '<div class="mp-tid">' + esc(p.starttid) + '<span>' + esc(p.sluttid) + '</span></div>' +
      '<div class="mp-ikon" title="' + esc(t.namn) + '" aria-label="' + esc(t.namn) + '">' + t.ikon + '</div>' +
      '<div class="mp-mitt"><div class="mp-titel">' + esc(p.titel) + '</div>' +
      '<div class="mp-typ">' + esc(t.namn) + '</div>' +
      (p.installt ? '<div class="mp-installt">Inställt' + (p.kommentar ? ' · ' + esc(p.kommentar) : '') + '</div>' : '') +
      (n ? '<div class="mp-narv mp-narv--' + n.k + '">' + n.ikon + ' ' + n.text + '</div>' : '') +
      '</div></div>';
  }

  function narvaroDel(veckor) {
    if (!veckor || !veckor.length) return '';
    return '<div class="mp-narvaro"><h3 class="mp-h3">Min närvaro</h3>' +
      veckor.map(function (v) {
        var p = v.procent == null ? 0 : v.procent;
        return '<div class="mp-v"><span class="mp-v-n">Vecka ' + veckonummer(v.mandag) + '</span>' +
          '<span class="mp-v-bar"><span style="width:' + p + '%"></span></span>' +
          '<b>' + (v.procent == null ? '—' : v.procent + ' %') + '</b></div>';
      }).join('') +
      '<p class="mp-not">Räknas på de pass där personalen har registrerat närvaro.</p></div>';
  }

  // ── Händelser ───────────────────────────────────────────────
  document.addEventListener('click', function (e) {
    var h = e.target.closest && e.target.closest('.mp-hor');
    if (h) { e.preventDefault(); e.stopPropagation(); las(h.getAttribute('data-las')); return; }
    if (e.target.closest && e.target.closest('[data-mp-oppna]')) {
      if (typeof window.mpOppnaFranHej === 'function') window.mpOppnaFranHej();
      return;
    }
    if (e.target.closest && e.target.closest('[data-mp-tillbaka]')) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (aktivVy && typeof aktivVy.tillbaka === 'function') aktivVy.tillbaka();
      return;
    }
    var v = e.target.closest && e.target.closest('[data-mp-vecka]');
    if (v && aktivVy && cache.data) {
      var ny = flytta(cache.data.fran, Number(v.getAttribute('data-mp-vecka')));
      oppna(aktivVy.id, aktivVy.tillbaka, ny);
    }
  });

  // ── Stil ────────────────────────────────────────────────────
  function stil() {
    if (document.getElementById('mpStil')) return;
    var s = document.createElement('style');
    s.id = 'mpStil';
    s.textContent = [
      '.mp-kort{background:linear-gradient(135deg,rgba(62,180,137,.16),rgba(62,180,137,.05));border:1.5px solid rgba(62,180,137,.45);border-radius:16px;padding:14px 16px;margin:0 0 18px;color:#fff;text-align:left}',
      '.mp-k-h{display:flex;align-items:center;justify-content:space-between;gap:10px;font-weight:800;font-size:15px;margin-bottom:8px}',
      '.mp-k-pass{display:flex;align-items:center;gap:10px;padding:7px 0;border-top:1px solid rgba(255,255,255,.08);font-size:15px}',
      '.mp-k-tid{font-weight:800;font-variant-numeric:tabular-nums;min-width:46px}',
      '.mp-k-ikon{font-size:18px}.mp-k-titel{flex:1;min-width:0}',
      '.mp-k-tom{color:rgba(255,255,255,.7);font-size:14px;padding:6px 0}',
      '.mp-k-knapp{display:block;width:100%;margin-top:10px;background:#3eb489;color:#0f241b;border:0;border-radius:12px;padding:13px;font-size:15px;font-weight:800;cursor:pointer}',
      '.mp-inst .mp-k-titel,.mp-inst .mp-titel{text-decoration:line-through;opacity:.7}',
      '.mp-inst b{color:#fca5a5;text-decoration:none}',
      '.mp-vy{color:#fff;max-width:640px;margin:0 auto;padding:4px 0 40px}',
      '.mp-laddar{color:rgba(255,255,255,.7);padding:30px 0;text-align:center}',
      '.mp-tillbaka{background:none;border:0;color:rgba(255,255,255,.6);font-size:14px;cursor:pointer;padding:6px 0;margin-bottom:6px}',
      '.mp-h{font-size:24px;font-weight:800;margin:4px 0 6px}',
      '.mp-h3{font-size:17px;font-weight:800;margin:0 0 10px}',
      '.mp-fas{color:rgba(255,255,255,.8);font-size:15px;line-height:1.5;margin:0 0 14px}',
      '.mp-veckonav{display:flex;align-items:center;justify-content:space-between;gap:10px;background:rgba(255,255,255,.05);border-radius:12px;padding:6px;margin-bottom:14px;font-weight:800;font-size:16px}',
      '.mp-pil{width:46px;height:46px;border-radius:10px;border:0;background:rgba(255,255,255,.08);color:#fff;font-size:24px;cursor:pointer}',
      '.mp-dag{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.10);border-radius:14px;padding:12px 14px;margin-bottom:10px}',
      '.mp-dag--idag{border-color:#3eb489;background:rgba(62,180,137,.10)}',
      '.mp-dag-h{display:flex;align-items:center;justify-content:space-between;gap:10px;font-weight:800;font-size:15px;margin-bottom:4px}',
      // Bara första bokstaven versal — svenska månadsnamn skrivs med gemen
      '.mp-dag-h>span{display:inline-block}.mp-dag-h>span::first-letter{text-transform:uppercase}',
      '.mp-tom{color:rgba(255,255,255,.55);font-size:14px;padding:4px 0}',
      '.mp-tema{background:rgba(167,139,250,.10);border:1px solid rgba(167,139,250,.35);border-radius:14px;padding:12px 14px;margin-bottom:12px}',
      '.mp-tema-r{display:flex;gap:10px;align-items:flex-start;font-size:15px;line-height:1.45;padding:4px 0}',
      '.mp-tema-test{margin-top:8px;background:rgba(245,158,11,.14);border-radius:10px;padding:9px 12px;font-size:14px;color:#fde68a}',
      '.mp-pass{display:grid;grid-template-columns:52px 34px 1fr;gap:10px;align-items:start;padding:10px 0;border-top:1px solid rgba(255,255,255,.07)}',
      '.mp-tid{font-weight:800;font-size:16px;font-variant-numeric:tabular-nums;line-height:1.2}',
      '.mp-tid span{display:block;font-size:12.5px;font-weight:500;color:rgba(255,255,255,.55)}',
      '.mp-ikon{font-size:24px;line-height:1}',
      '.mp-mitt{min-width:0}',
      '.mp-titel{font-size:16px;font-weight:700;line-height:1.35}',
      '.mp-typ{font-size:13px;color:rgba(255,255,255,.6)}',
      '.mp-installt{color:#fca5a5;font-size:13.5px;font-weight:700;margin-top:3px}',
      '.mp-narv{display:inline-block;margin-top:5px;font-size:13px;font-weight:700;padding:3px 10px;border-radius:999px}',
      '.mp-narv--ok{background:rgba(62,180,137,.18);color:#a7f3d0}',
      '.mp-narv--sen{background:rgba(245,158,11,.16);color:#fde68a}',
      '.mp-narv--fr{background:rgba(239,68,68,.14);color:#fecaca}',
      '.mp-narvaro{margin-top:22px}',
      '.mp-v{display:grid;grid-template-columns:80px 1fr 52px;gap:10px;align-items:center;font-size:14px;padding:5px 0}',
      '.mp-v b{text-align:right;font-variant-numeric:tabular-nums}',
      '.mp-v-bar{height:10px;background:rgba(255,255,255,.08);border-radius:5px;overflow:hidden}',
      '.mp-v-bar span{display:block;height:100%;background:#3eb489;border-radius:5px}',
      '.mp-not{color:rgba(255,255,255,.5);font-size:12.5px;margin-top:12px;line-height:1.5}',
      '.mp-hor{flex:0 0 auto;width:40px;height:40px;border-radius:50%;border:1px solid rgba(167,139,250,.4);background:rgba(167,139,250,.16);color:#fff;font-size:16px;cursor:pointer}',
      '.mp-pil:focus-visible,.mp-hor:focus-visible,.mp-k-knapp:focus-visible{outline:2px solid #3eb489;outline-offset:2px}'
    ].join('\n');
    document.head.appendChild(s);
  }

  // Startsidans kort laddas när deltagaren är inloggad
  function starta() {
    stil();
    var forsok = 0;
    var t = setInterval(function () {
      forsok++;
      if (window.authAccessToken) {
        clearInterval(t);
        ['mpHejKort', 'mpHejDesk'].forEach(function (id) { if (document.getElementById(id)) hejKort(id); });
      } else if (forsok > 40) clearInterval(t);
    }, 1500);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', starta); else starta();

  window.mpHejKort = function (id) { stil(); return hejKort(id); };
  window.mpOppna = function (id, tillbaka) { stil(); oppna(id, tillbaka); };
  window.mpRensa = function () { cache = { data: null, fran: null, tid: 0, token: null }; };
})();
