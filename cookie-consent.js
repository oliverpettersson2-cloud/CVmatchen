// ════════════════════════════════════════════════════════════════
// cookie-consent.js — GDPR-banner för svensk publik sektor
// ════════════════════════════════════════════════════════════════
// Visas första besöket tills användaren tagit ställning. Sparar
// valet i localStorage (cvm_cookie_consent) med 12 mån giltighet.
// Strikt nödvändiga cookies (auth/session) körs alltid. Analytics
// och tracking ska kolla window.cookieConsent === 'accepted' innan
// init.
// ════════════════════════════════════════════════════════════════
(function() {
  'use strict';

  const KEY = 'cvm_cookie_consent';
  const TTL_MS = 365 * 24 * 60 * 60 * 1000;

  function readConsent() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const o = JSON.parse(raw);
      if (!o || !o.ts || (Date.now() - o.ts) > TTL_MS) return null;
      return o.value || null;
    } catch(e) { return null; }
  }
  function writeConsent(value) {
    try { localStorage.setItem(KEY, JSON.stringify({ value, ts: Date.now() })); } catch(e) {}
    window.cookieConsent = value;
    document.dispatchEvent(new CustomEvent('cookie-consent', { detail: { value } }));
  }

  const existing = readConsent();
  if (existing) { window.cookieConsent = existing; return; }

  function build() {
    const wrap = document.createElement('div');
    wrap.id = 'cvmCookieBanner';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-live', 'polite');
    wrap.setAttribute('aria-label', 'Information om kakor');
    wrap.style.cssText = [
      'position:fixed','left:16px','right:16px','bottom:16px','z-index:100000',
      'max-width:560px','margin:0 auto',
      'background:rgba(20,28,52,0.97)','backdrop-filter:blur(12px)',
      'border:1px solid rgba(255,255,255,0.12)','border-radius:14px',
      'box-shadow:0 12px 40px rgba(0,0,0,0.4)',
      'padding:18px 20px','color:#fff','font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif'
    ].join(';');
    wrap.innerHTML =
      '<div style="font-size:15px;font-weight:700;margin-bottom:6px;">Vi använder kakor</div>' +
      '<div style="font-size:13px;line-height:1.5;color:rgba(255,255,255,0.78);margin-bottom:14px;">' +
        'Strikt nödvändiga kakor behövs för inloggning och säkerhet och sätts alltid. ' +
        'Övriga kakor (statistik, prestanda) sätts endast om du samtycker. ' +
        'Du kan ändra ditt val senare under <a href="/tillganglighet" style="color:#7ab8ff;">Tillgänglighet & integritet</a>.' +
      '</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
        '<button type="button" id="cvmCookieAccept" style="flex:1;min-width:140px;padding:11px 16px;background:var(--brand-primary,#e85d26);color:#fff;font-size:14px;font-weight:700;border:none;border-radius:10px;cursor:pointer;">Acceptera alla</button>' +
        '<button type="button" id="cvmCookieReject" style="flex:1;min-width:140px;padding:11px 16px;background:rgba(255,255,255,0.08);color:#fff;font-size:14px;font-weight:600;border:1px solid rgba(255,255,255,0.18);border-radius:10px;cursor:pointer;">Endast nödvändiga</button>' +
      '</div>';
    return wrap;
  }

  function mount() {
    if (document.getElementById('cvmCookieBanner')) return;
    const el = build();
    document.body.appendChild(el);
    document.getElementById('cvmCookieAccept').addEventListener('click', () => {
      writeConsent('accepted'); el.remove();
    });
    document.getElementById('cvmCookieReject').addEventListener('click', () => {
      writeConsent('necessary-only'); el.remove();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
