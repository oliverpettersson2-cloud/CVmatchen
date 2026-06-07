// ════════════════════════════════════════════════════════════════
// branding.js — white-label-konfiguration
// ════════════════════════════════════════════════════════════════
// Sätter CSS-variabler och window.BRANDING utifrån vilken tenant
// som är aktiv. Aktiv tenant väljs i prioritetsordning:
//   1) window.BRANDING_OVERRIDE  (sätts av server eller env-injection)
//   2) URL-param ?brand=<id>     (för demo/preview)
//   3) localStorage.cvm_brand    (sticky efter första valet)
//   4) host-baserad mappning (BRAND_BY_HOST nedan)
//   5) 'default' (CVmatchen original)
//
// Lägga till en kommun: lägg till en post i BRANDS + ev. host-rad.
// All färgsättning i appen ska peka mot CSS-variablerna nedan istället
// för hårdkodade hex-värden. Befintliga hårdkodade färger ersätts
// gradvis — variabel-referens fungerar redan idag där den injicerats.
// ════════════════════════════════════════════════════════════════
(function() {
  'use strict';

  const BRANDS = {
    default: {
      name: 'CVmatchen',
      tagline: 'AI-driven jobbsökning för svensk arbetsmarknad',
      logoText: 'CVmatchen',
      logoUrl: '',                     // tom = rendera textlogo
      faviconUrl: '',
      colors: {
        primary:        '#e85d26',     // orange (default-accent)
        primaryHover:   '#d04f1e',
        secondary:      '#d4a436',     // gult komplement
        bg:             '#0a0f1e',
        surface:        '#1e2440',
        ink:            '#ffffff',
        muted:          'rgba(255,255,255,0.72)'
      },
      footerText: 'PathfinderAI AB'
    },

    // Exempel-tenant — kopiera mönstret för riktiga kommuner.
    landskrona: {
      name: 'Landskrona stad — Jobbcoach',
      tagline: 'Vägen tillbaka till arbete',
      logoText: 'Landskrona stad',
      logoUrl: '',
      faviconUrl: '',
      colors: {
        primary:        '#0066b3',     // Landskronas blå
        primaryHover:   '#005599',
        secondary:      '#f5a623',
        bg:             '#0a1428',
        surface:        '#1a2540',
        ink:            '#ffffff',
        muted:          'rgba(255,255,255,0.72)'
      },
      footerText: 'Landskrona stad i samarbete med CVmatchen'
    },

    helsingborg: {
      name: 'Helsingborg — Arbetsmarknadsenheten',
      tagline: 'Snabbare till jobb',
      logoText: 'Helsingborg',
      logoUrl: '',
      faviconUrl: '',
      colors: {
        primary:        '#00966e',     // Helsingborgsgrön
        primaryHover:   '#007a5a',
        secondary:      '#f5a623',
        bg:             '#0a1e18',
        surface:        '#15302a',
        ink:            '#ffffff',
        muted:          'rgba(255,255,255,0.72)'
      },
      footerText: 'Helsingborgs stad i samarbete med CVmatchen'
    }
  };

  // Host → brand-mappning. Sätt produktions-domäner här.
  const BRAND_BY_HOST = {
    'landskrona.cvmatchen.se':  'landskrona',
    'helsingborg.cvmatchen.se': 'helsingborg'
  };

  function pickBrandId() {
    if (typeof window.BRANDING_OVERRIDE === 'string' && BRANDS[window.BRANDING_OVERRIDE]) {
      return window.BRANDING_OVERRIDE;
    }
    try {
      const q = new URLSearchParams(location.search).get('brand');
      if (q && BRANDS[q]) {
        try { localStorage.setItem('cvm_brand', q); } catch(e) {}
        return q;
      }
      const stored = localStorage.getItem('cvm_brand');
      if (stored && BRANDS[stored]) return stored;
    } catch(e) {}
    const host = (location.hostname || '').toLowerCase();
    if (BRAND_BY_HOST[host]) return BRAND_BY_HOST[host];
    return 'default';
  }

  function applyBrand(brand) {
    const root = document.documentElement;
    Object.entries(brand.colors).forEach(([k, v]) => {
      root.style.setProperty('--brand-' + k.replace(/([A-Z])/g, '-$1').toLowerCase(), v);
    });
    // Bakåtkompat-alias för existerande --accent-användning
    root.style.setProperty('--accent', brand.colors.primary);

    if (brand.faviconUrl) {
      let link = document.querySelector('link[rel="icon"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = brand.faviconUrl;
    }
    if (document.title && brand.name && brand.name !== 'CVmatchen') {
      document.title = document.title.replace(/CVmatchen/g, brand.name);
    }
    document.body && document.body.setAttribute('data-brand', brand.id);
  }

  const id = pickBrandId();
  const brand = Object.assign({ id }, BRANDS[id]);
  window.BRANDING = brand;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => applyBrand(brand));
  } else {
    applyBrand(brand);
  }
})();
