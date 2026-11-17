/* ============================================================
   CVmatchen — Praktikerbjudanden (deltagarens vy)
   ------------------------------------------------------------
   meKort(id): kort på startsidan med praktikplatser som personalen
   har frågat deltagaren om (status Tillfrågad), deltagarens svar
   och platser hen har fått.

   Syns bara när det finns något att visa. Enkel svenska, uppläsning
   och två tydliga knappar: "Jag är intresserad" och "Inte nu".
   ============================================================ */
(function () {
  'use strict';

  var cache = { data: null, tid: 0, token: null };
  var oppen = {};      // vilka kort som är utfällda
  var nyssNej = {};    // platser deltagaren nyss tackat nej till (kan ångras)

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function datum(d) {
    try {
      return new Date(d + 'T12:00:00').toLocaleDateString('sv-SE', { day: 'numeric', month: 'long' });
    } catch (e) { return d; }
  }
  function timmar(t) { return String(t).replace('.', ','); }

  // ── Uppläsning ──────────────────────────────────────────────
  function las(text) {
    if (!window.speechSynthesis || !text) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = 'sv-SE'; u.rate = 0.9;
      var sv = (window.speechSynthesis.getVoices() || []).filter(function (v) { return /^sv/i.test(v.lang || ''); });
      if (sv[0]) u.voice = sv.find(function (v) { return /natural|online|neural/i.test(v.name); }) || sv[0];
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }
  function upplasning(p) {
    var d = ['Praktikplats. ' + p.titel + ', hos ' + p.arbetsgivare + '.'];
    if (p.ort) d.push('I ' + p.ort + '.');
    if (p.timmar_per_vecka) d.push(timmar(p.timmar_per_vecka) + ' timmar i veckan.');
    if (p.arbetstider) d.push(p.arbetstider + '.');
    if (p.start_datum) d.push('Start ' + datum(p.start_datum) + '.');
    if (p.innehall) d.push('Det här gör du: ' + p.innehall);
    if (p.forvantningar) d.push('Förväntningar: ' + p.forvantningar);
    if (p.krav) d.push('Arbetet: ' + p.krav);
    return d.join(' ');
  }

  // ── Data ────────────────────────────────────────────────────
  function anrop(action, data) {
    var token = window.authAccessToken;
    if (!token) return Promise.resolve(null);
    return fetch('/api/supabase', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.assign({ action: action, accessToken: token }, data || {}))
    }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return r.ok ? j : Promise.reject(new Error(j.error || 'Något gick fel')); }); });
  }
  function hamta(farsk) {
    var token = window.authAccessToken;
    if (!token) return Promise.resolve(null);
    // Knuten till inloggningen: delar två deltagare telefon ser den andra aldrig den förstas erbjudanden.
    if (!farsk && cache.data && cache.token === token && Date.now() - cache.tid < 60000) return Promise.resolve(cache.data);
    return anrop('my_praktik').then(function (d) {
      cache = { data: d, tid: Date.now(), token: token };
      return d;
    }).catch(function () { return null; });
  }

  // ── Rendering ───────────────────────────────────────────────
  function rad(ikon, text) { return text ? '<div class="me-rad"><span aria-hidden="true">' + ikon + '</span><span>' + esc(text) + '</span></div>' : ''; }

  function kort(p) {
    var ut = oppen[p.id];
    var tid = [p.timmar_per_vecka ? timmar(p.timmar_per_vecka) + ' timmar i veckan' : '', p.arbetstider].filter(Boolean).join(' · ');
    var period = p.start_datum ? 'Start ' + datum(p.start_datum) + (p.slut_datum ? ', slut ' + datum(p.slut_datum) : '') : '';
    var plats = [p.adress, p.ort].filter(Boolean).join(', ');
    var h = '<div class="me-plats me-' + p.mittSvar + '">' +
      '<div class="me-topp"><div><div class="me-titel">' + esc(p.titel) + '</div><div class="me-ag">' + esc(p.arbetsgivare) + '</div></div>' +
      (window.speechSynthesis ? '<button type="button" class="me-hor" data-me-las="' + p.id + '" aria-label="Lyssna på erbjudandet">🔊</button>' : '') + '</div>' +
      rad('📍', p.mittSvar === 'placerad' ? plats : p.ort) + rad('🕘', tid) + rad('📅', period);

    if (ut) {
      h += (p.innehall ? '<div class="me-txt"><b>Det här gör du</b><p>' + esc(p.innehall) + '</p></div>' : '') +
        (p.forvantningar ? '<div class="me-txt"><b>Förväntningar</b><p>' + esc(p.forvantningar) + '</p></div>' : '') +
        (p.krav ? '<div class="me-txt"><b>Arbetet</b><p>' + esc(p.krav) + '</p></div>' : '');
    }
    if (p.innehall || p.forvantningar || p.krav) {
      h += '<button type="button" class="me-mer" data-me-mer="' + p.id + '" aria-expanded="' + !!ut + '">' + (ut ? 'Visa mindre ▲' : 'Läs mer ▼') + '</button>';
    }

    if (p.mittSvar === 'tillfragad') {
      h += '<div class="me-knappar">' +
        '<button type="button" class="me-ja" data-me-svar="intresserad" data-me-id="' + p.id + '">👍 Jag är intresserad</button>' +
        '<button type="button" class="me-nej" data-me-svar="nej" data-me-id="' + p.id + '">Inte nu</button></div>';
    } else if (p.mittSvar === 'intresserad') {
      h += '<div class="me-status">✓ Du har sagt att du är intresserad. Din handledare hör av sig.' +
        ' <button type="button" class="me-lank" data-me-svar="tillfragad" data-me-id="' + p.id + '">Ändra mitt svar</button></div>';
    } else if (p.mittSvar === 'placerad') {
      h += '<div class="me-status me-klar">🎉 Du har fått platsen!' + (p.start_datum ? ' Du börjar ' + esc(datum(p.start_datum)) + '.' : '') + '</div>';
    }
    return h + '<div class="me-msg" role="status" id="meMsg' + p.id + '"></div></div>';
  }

  function rita(el, d) {
    var lista = (d && d.erbjudanden) || [];
    var nej = Object.keys(nyssNej).map(function (id) { return nyssNej[id]; });
    if (!lista.length && !nej.length) { el.hidden = true; el.innerHTML = ''; return; }
    var nya = lista.filter(function (p) { return p.mittSvar === 'tillfragad'; }).length;
    var rubrik = lista.some(function (p) { return p.mittSvar === 'placerad'; }) && !nya ? '💼 Din praktik'
      : nya === 1 ? '💼 En praktikplats till dig' : nya > 1 ? '💼 ' + nya + ' praktikplatser till dig' : '💼 Praktik';
    el.hidden = false;
    el.innerHTML = '<div class="me-kort"><div class="me-h">' + rubrik + '</div>' +
      (nya ? '<p class="me-intro">Din handledare tycker att platsen kan passa dig. Läs och svara.</p>' : '') +
      lista.map(kort).join('') +
      nej.map(function (p) {
        return '<div class="me-plats me-nej-rad">Du har tackat nej till <b>' + esc(p.titel) + '</b>. ' +
          '<button type="button" class="me-lank" data-me-svar="tillfragad" data-me-id="' + p.id + '">Ångra</button></div>';
      }).join('') + '</div>';
  }

  var aktivt = null;
  function meKort(id, farsk) {
    var el = document.getElementById(id);
    if (!el) return Promise.resolve();
    aktivt = id;
    return hamta(farsk).then(function (d) { rita(el, d); });
  }

  function svara(id, svar, knapp) {
    var p = ((cache.data && cache.data.erbjudanden) || []).find(function (x) { return String(x.id) === String(id); }) || nyssNej[id];
    var msg = document.getElementById('meMsg' + id);
    if (knapp) knapp.disabled = true;
    return anrop('my_praktik_svar', { praktikId: Number(id), svar: svar }).then(function () {
      if (svar === 'nej' && p) nyssNej[id] = p; else delete nyssNej[id];
      return meKort(aktivt, true);
    }).catch(function (e) {
      if (knapp) knapp.disabled = false;
      if (msg) msg.textContent = e.message;
    });
  }

  // ── Händelser ───────────────────────────────────────────────
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-me-svar],[data-me-mer],[data-me-las]');
    if (!t) return;
    e.preventDefault(); e.stopPropagation();
    if (t.hasAttribute('data-me-svar')) return svara(t.getAttribute('data-me-id'), t.getAttribute('data-me-svar'), t);
    if (t.hasAttribute('data-me-mer')) {
      var id = t.getAttribute('data-me-mer');
      oppen[id] = !oppen[id];
      var el = document.getElementById(aktivt);
      if (el && cache.data) rita(el, cache.data);
      return;
    }
    var p = ((cache.data && cache.data.erbjudanden) || []).find(function (x) { return String(x.id) === t.getAttribute('data-me-las'); });
    if (p) las(upplasning(p));
  });

  function stil() {
    if (document.getElementById('meStil')) return;
    var s = document.createElement('style');
    s.id = 'meStil';
    s.textContent = [
      '.me-kort{background:linear-gradient(135deg,rgba(240,192,64,.16),rgba(240,192,64,.04));border:1.5px solid rgba(240,192,64,.5);border-radius:16px;padding:14px 16px;margin:0 0 18px;color:#fff;text-align:left}',
      '.me-h{font-weight:800;font-size:16px;margin-bottom:4px}',
      '.me-intro{font-size:14px;color:rgba(255,255,255,.75);margin:0 0 10px;line-height:1.45}',
      '.me-plats{border-top:1px solid rgba(255,255,255,.1);padding:12px 0 4px}',
      '.me-topp{display:flex;justify-content:space-between;gap:10px;align-items:flex-start;margin-bottom:6px}',
      '.me-titel{font-size:17px;font-weight:800;line-height:1.3}.me-ag{font-size:14px;color:rgba(255,255,255,.75)}',
      '.me-rad{display:flex;gap:8px;font-size:14px;padding:2px 0;color:rgba(255,255,255,.9)}',
      '.me-txt{margin-top:10px;font-size:14px}.me-txt p{margin:3px 0 0;line-height:1.5;white-space:pre-line;color:rgba(255,255,255,.85)}',
      '.me-mer{background:none;border:0;color:#f0c040;font:inherit;font-size:14px;font-weight:700;padding:8px 0;cursor:pointer}',
      '.me-hor{flex:0 0 auto;width:40px;height:40px;border-radius:50%;border:1px solid rgba(240,192,64,.5);background:rgba(240,192,64,.14);color:#fff;font-size:16px;cursor:pointer}',
      '.me-knappar{display:flex;gap:8px;margin-top:8px;flex-wrap:wrap}',
      '.me-ja,.me-nej{flex:1 1 140px;border-radius:12px;padding:13px;font-size:15px;font-weight:800;cursor:pointer;font-family:inherit}',
      '.me-ja{background:#3eb489;color:#0f241b;border:0}.me-nej{background:transparent;color:#fff;border:1.5px solid rgba(255,255,255,.35)}',
      '.me-ja:disabled,.me-nej:disabled{opacity:.6}',
      '.me-status{margin-top:8px;font-size:14px;line-height:1.5;background:rgba(62,180,137,.15);border-radius:10px;padding:10px 12px}',
      '.me-klar{background:rgba(240,192,64,.18);font-weight:700}',
      '.me-lank{background:none;border:0;color:#f0c040;text-decoration:underline;font:inherit;font-size:14px;cursor:pointer;padding:0}',
      '.me-nej-rad{font-size:14px;color:rgba(255,255,255,.8);padding:10px 0}',
      '.me-msg{font-size:13px;color:#fca5a5;min-height:0}'
    ].join('\n');
    document.head.appendChild(s);
  }

  window.meKort = function (id) { stil(); return meKort(id); };
})();
