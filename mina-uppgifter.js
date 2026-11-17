/* ============================================================
   CVmatchen — Att göra (deltagarens startsida)
   ------------------------------------------------------------
   muKort(id): uppgifter från handläggaren samlade på startsidan,
   bredvid dagens pass och praktikerbjudanden. Försenade först,
   sedan efter deadline. En stor knapp per uppgift: "Klar".

   Uppgifter som kontrolleras automatiskt (t.ex. "sök 5 jobb") får
   i stället "Gör uppgiften →", som öppnar uppgiftsvyn.
   Syns bara när det finns något att göra.
   ============================================================ */
(function () {
  'use strict';

  var VISA = 4;                 // fler än så fälls ihop
  var cache = { data: null, tid: 0, token: null };
  var visaAlla = false;
  var nyssKlar = null;          // titel på den senast avbockade, för en kort bekräftelse

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function idag() { return new Date().toLocaleDateString('sv-SE'); }
  function dagar(fran, till) {
    return Math.round((new Date(till + 'T12:00:00') - new Date(fran + 'T12:00:00')) / 86400000);
  }
  // Deadline i ord: "Försenad", "Idag", "Imorgon", "Senast fredag", "Senast 3 december"
  function deadline(t) {
    if (!t.deadline) return null;
    var d = new Date(t.deadline).toLocaleDateString('sv-SE');
    var n = dagar(idag(), d);
    if (n < 0) return { text: 'Försenad', k: 'sen' };
    if (n === 0) return { text: 'Senast idag', k: 'snart' };
    if (n === 1) return { text: 'Senast imorgon', k: 'snart' };
    var dt = new Date(d + 'T12:00:00');
    return { text: 'Senast ' + (n < 7
      ? dt.toLocaleDateString('sv-SE', { weekday: 'long' })
      : dt.toLocaleDateString('sv-SE', { day: 'numeric', month: 'long' })), k: '' };
  }

  // ── Data ────────────────────────────────────────────────────
  function anrop(action, data) {
    var token = window.authAccessToken;
    if (!token) return Promise.resolve(null);
    return fetch('/api/supabase', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.assign({ action: action, accessToken: token }, data || {}))
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) { return r.ok ? j : Promise.reject(new Error(j.error || 'Något gick fel')); });
    });
  }
  function hamta(farsk) {
    var token = window.authAccessToken;
    if (!token) return Promise.resolve(null);
    // Knuten till inloggningen: två deltagare på samma telefon ser aldrig varandras uppgifter
    if (!farsk && cache.data && cache.token === token && Date.now() - cache.tid < 30000) return Promise.resolve(cache.data);
    return anrop('my_att_gora').then(function (d) {
      cache = { data: d, tid: Date.now(), token: token };
      return d;
    }).catch(function () { return null; });
  }
  function sortera(lista) {
    return lista.slice().sort(function (a, b) {
      if (!a.deadline && !b.deadline) return 0;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return a.deadline < b.deadline ? -1 : 1;
    });
  }

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
  function upplasning(lista) {
    if (!lista.length) return 'Du har inget att göra just nu.';
    return 'Att göra. ' + lista.map(function (t, i) {
      var d = deadline(t);
      return (i + 1) + '. ' + t.title + '.' + (d ? ' ' + d.text + '.' : '') + (t.description ? ' ' + t.description : '');
    }).join(' ');
  }

  // ── Rendering ───────────────────────────────────────────────
  function rad(t) {
    var d = deadline(t);
    return '<div class="mu-rad' + (d && d.k === 'sen' ? ' mu-sen' : '') + '">' +
      '<div class="mu-text"><div class="mu-titel">' + esc(t.title) + '</div>' +
      (t.description ? '<div class="mu-besk">' + esc(t.description) + '</div>' : '') +
      (d ? '<div class="mu-dl mu-dl-' + d.k + '">' + (d.k === 'sen' ? '⚠️ ' : '⏰ ') + esc(d.text) + '</div>' : '') +
      '<div class="mu-msg" role="status" id="muMsg' + t.id + '"></div></div>' +
      (t.auto
        ? '<button type="button" class="mu-gor" data-mu-oppna="1">Gör den →</button>'
        : '<button type="button" class="mu-klar" data-mu-klar="' + t.id + '" aria-label="Markera ' + esc(t.title) + ' som klar">✓ Klar</button>') +
      '</div>';
  }

  function rita(el, d) {
    var lista = sortera((d && d.uppgifter) || []);
    if (!lista.length && !nyssKlar) { el.hidden = true; el.innerHTML = ''; return; }
    var sena = lista.filter(function (t) { var x = deadline(t); return x && x.k === 'sen'; }).length;
    var synliga = visaAlla ? lista : lista.slice(0, VISA);
    el.hidden = false;
    el.innerHTML = '<div class="mu-kort">' +
      '<div class="mu-h"><span>✅ Att göra' + (lista.length ? ' <span class="mu-antal">' + lista.length + '</span>' : '') + '</span>' +
      (window.speechSynthesis && lista.length ? '<button type="button" class="mu-hor" data-mu-las="1" aria-label="Lyssna på dina uppgifter">🔊</button>' : '') + '</div>' +
      (sena ? '<p class="mu-intro mu-intro-sen">' + (sena === 1 ? 'En uppgift är försenad.' : sena + ' uppgifter är försenade.') + ' Gör den först, eller prata med din handledare.</p>'
        : lista.length ? '<p class="mu-intro">Från din handledare.</p>' : '') +
      (nyssKlar ? '<div class="mu-bra">🎉 Bra jobbat! <b>' + esc(nyssKlar) + '</b> är klar.</div>' : '') +
      synliga.map(rad).join('') +
      (lista.length > VISA ? '<button type="button" class="mu-fler" data-mu-alla="1">' +
        (visaAlla ? 'Visa färre ▲' : 'Visa alla ' + lista.length + ' ▼') + '</button>' : '') +
      (!lista.length ? '<p class="mu-intro">Du har inget mer att göra just nu.</p>' : '') +
      '</div>';
  }

  var aktivt = null;
  function muKort(id, farsk) {
    var el = document.getElementById(id);
    if (!el) return Promise.resolve();
    aktivt = id;
    return hamta(farsk).then(function (d) { rita(el, d); });
  }

  function klar(id, knapp) {
    var t = ((cache.data && cache.data.uppgifter) || []).find(function (x) { return String(x.id) === String(id); });
    if (knapp) { knapp.disabled = true; knapp.textContent = '…'; }
    return anrop('my_att_gora_klar', { taskId: Number(id) }).then(function () {
      nyssKlar = t ? t.title : 'Uppgiften';
      setTimeout(function () { nyssKlar = null; if (aktivt && cache.data) { var el = document.getElementById(aktivt); if (el) rita(el, cache.data); } }, 6000);
      // Håll övriga vyer (Träna, Profil) i takt
      try { if (typeof window.loadAssignedTasks === 'function') window.loadAssignedTasks(); } catch (e) {}
      try { if (typeof window.notifyTasksChanged === 'function') window.notifyTasksChanged(); } catch (e) {}
      try { localStorage.setItem('cvm_tasks_dirty', String(Date.now())); } catch (e) {}
      return muKort(aktivt, true);
    }).catch(function (e) {
      if (knapp) { knapp.disabled = false; knapp.textContent = '✓ Klar'; }
      var m = document.getElementById('muMsg' + id);
      if (m) m.textContent = e.message;
    });
  }

  // ── Händelser ───────────────────────────────────────────────
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-mu-klar],[data-mu-oppna],[data-mu-las],[data-mu-alla]');
    if (!t) return;
    e.preventDefault(); e.stopPropagation();
    if (t.hasAttribute('data-mu-klar')) return klar(t.getAttribute('data-mu-klar'), t);
    if (t.hasAttribute('data-mu-oppna')) {
      if (typeof window.muOppnaUppgifter === 'function') window.muOppnaUppgifter();
      return;
    }
    if (t.hasAttribute('data-mu-alla')) {
      visaAlla = !visaAlla;
      var el = document.getElementById(aktivt);
      if (el && cache.data) rita(el, cache.data);
      return;
    }
    las(upplasning(sortera((cache.data && cache.data.uppgifter) || [])));
  });

  function stil() {
    if (document.getElementById('muStil')) return;
    var s = document.createElement('style');
    s.id = 'muStil';
    s.textContent = [
      '.mu-kort{background:linear-gradient(135deg,rgba(167,139,250,.16),rgba(167,139,250,.04));border:1.5px solid rgba(167,139,250,.45);border-radius:16px;padding:14px 16px;margin:0 0 18px;color:#fff;text-align:left}',
      '.mu-h{display:flex;align-items:center;justify-content:space-between;gap:10px;font-weight:800;font-size:16px}',
      '.mu-antal{display:inline-flex;min-width:22px;height:22px;padding:0 6px;border-radius:11px;background:#a78bfa;color:#1b1340;font-size:12px;align-items:center;justify-content:center;margin-left:4px;vertical-align:2px}',
      '.mu-hor{flex:0 0 auto;width:40px;height:40px;border-radius:50%;border:1px solid rgba(167,139,250,.4);background:rgba(167,139,250,.16);color:#fff;font-size:16px;cursor:pointer}',
      '.mu-intro{font-size:14px;color:rgba(255,255,255,.72);margin:4px 0 6px;line-height:1.45}',
      '.mu-intro-sen{color:#fecaca}',
      '.mu-rad{display:flex;gap:12px;align-items:center;border-top:1px solid rgba(255,255,255,.1);padding:12px 0}',
      '.mu-sen .mu-titel{color:#fecaca}',
      '.mu-text{flex:1;min-width:0}.mu-titel{font-size:16px;font-weight:700;line-height:1.3}',
      '.mu-besk{font-size:14px;color:rgba(255,255,255,.75);margin-top:2px;line-height:1.45}',
      '.mu-dl{font-size:13px;margin-top:4px;color:rgba(255,255,255,.7)}.mu-dl-snart{color:#fcd34d;font-weight:700}.mu-dl-sen{color:#fca5a5;font-weight:700}',
      '.mu-klar,.mu-gor{flex:0 0 auto;min-width:84px;min-height:48px;border-radius:12px;font-size:15px;font-weight:800;cursor:pointer;font-family:inherit;padding:0 14px}',
      '.mu-klar{background:#3eb489;color:#0f241b;border:0}.mu-klar:disabled{opacity:.6}',
      '.mu-gor{background:transparent;color:#fff;border:1.5px solid rgba(255,255,255,.35)}',
      '.mu-fler{background:none;border:0;color:#c4b5fd;font:inherit;font-size:14px;font-weight:700;padding:8px 0 0;cursor:pointer}',
      '.mu-bra{background:rgba(62,180,137,.18);border-radius:10px;padding:10px 12px;font-size:14px;margin:6px 0}',
      '.mu-msg{font-size:13px;color:#fca5a5}'
    ].join('\n');
    document.head.appendChild(s);
  }

  window.muKort = function (id) { stil(); return muKort(id); };
})();
