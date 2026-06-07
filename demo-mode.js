// ════════════════════════════════════════════════════════════════
// demo-mode.js — pitch/sälj-demo utan riktig inloggning
// ════════════════════════════════════════════════════════════════
// Triggar:
//   1) URL-param ?demo=1
//   2) localStorage.cvm_demo_mode === '1' (sticky efter första gången)
//   3) window.startDemo() från konsol eller knapp
//
// När demo är aktivt:
//   - Auth-overlay hoppas över, användaren landar direkt i appen
//   - cvData seedas med realistiskt svenskt CV
//   - 2 sparade CV-versioner + 3 matchade jobb finns redan
//   - Träningsprogress 40-60% i flera kategorier
//   - 3 uppgifter från "demo-handläggare"
//   - Alla backend-syncs (_sbSync, /api/supabase POSTs) noops:as
//   - is_demo-flagga sätts så data ALDRIG läcker in i prod-statistik
//
// Stäng av: window.exitDemo() eller localStorage.removeItem('cvm_demo_mode')
// ════════════════════════════════════════════════════════════════
(function() {
  'use strict';

  const FLAG_KEY = 'cvm_demo_mode';

  function shouldStartDemo() {
    try {
      const q = new URLSearchParams(location.search).get('demo');
      if (q === '1' || q === 'true') {
        localStorage.setItem(FLAG_KEY, '1');
        return true;
      }
      return localStorage.getItem(FLAG_KEY) === '1';
    } catch(e) { return false; }
  }

  const DEMO_CV = {
    name: 'Anna Andersson',
    title: 'Undersköterska med 5 års erfarenhet',
    email: 'anna.andersson@demo.local',
    phone: '070-123 45 67',
    city: 'Helsingborg',
    summary: 'Erfaren undersköterska med fem års arbete inom äldreomsorg och hemtjänst. Lugn, lyhörd och van att arbeta i team. Talar svenska och engelska flytande, grundläggande arabiska. Söker tjänst där jag kan göra skillnad i vardagen för äldre eller funktionsnedsatta.',
    jobs: [
      {
        title: 'Undersköterska',
        company: 'Helsingborgs stad — Hemtjänst Centrum',
        startYear: '2022', startMonth: '03',
        endYear: '', endMonth: '', current: true,
        description: 'Daglig omvårdnad av 12-15 brukare. Läkemedelsdelegering. Dokumentation i Procapita. Handledare för ny personal sedan 2024.'
      },
      {
        title: 'Vårdbiträde',
        company: 'Attendo Äldreboende Tågaborg',
        startYear: '2020', startMonth: '08',
        endYear: '2022', endMonth: '02',
        description: 'Hjälp med påklädning, måltider, hygien. Förflyttningsteknik. Aktivering och social kontakt med boende.'
      },
      {
        title: 'Lokalvårdare',
        company: 'ISS Facility Services',
        startYear: '2019', startMonth: '01',
        endYear: '2020', endMonth: '07',
        description: 'Städning av kontorslokaler. Egen ansvarsrunda på 1800 kvm.'
      }
    ],
    education: [
      {
        program: 'Vård- och omsorgsutbildning',
        school: 'Komvux Helsingborg',
        startYear: '2019', startMonth: '08',
        endYear: '2020', endMonth: '06',
        description: 'Yrkespaket undersköterska, 1500 poäng. Inklusive läkemedelshantering och demens.'
      },
      {
        program: 'SFI D + Svenska som andraspråk grund',
        school: 'Helsingborgs Komvux',
        startYear: '2017', startMonth: '09',
        endYear: '2019', endMonth: '05',
        description: ''
      }
    ],
    languages: [
      { name: 'Svenska', level: 'Flytande' },
      { name: 'Engelska', level: 'Flytande' },
      { name: 'Arabiska', level: 'Grundläggande' }
    ],
    certifications: [
      { name: 'Delegering läkemedel', year: '2023' },
      { name: 'HLR + första hjälpen', year: '2024' }
    ],
    licenses: [{ name: 'B-körkort', year: '2020' }],
    references: [
      { name: 'Maria Lindgren', role: 'Enhetschef Hemtjänst Centrum', phone: '042-10 50 00' }
    ],
    skills: ['Procapita', 'Läkemedelshantering', 'Förflyttningsteknik', 'Demensvård', 'Team-arbete', 'Konflikthantering'],
    template: 'modern',
    isDemo: true
  };

  const DEMO_SAVED_CVS = [
    { id: 'cv_demo_1', title: 'Undersköterska med 5 års erfarenhet',
      savedAt: Date.now() - 3 * 86400000, data: DEMO_CV },
    { id: 'cv_demo_2', title: 'Vårdbiträde — kortversion',
      savedAt: Date.now() - 7 * 86400000,
      data: Object.assign({}, DEMO_CV, { title: 'Vårdbiträde', summary: 'Kortare CV anpassat för vårdbiträdesroller.' }) }
  ];

  const DEMO_MATCHED_CVS = [
    { id: 'm_demo_1', title: 'Undersköterska — Vårdcentralen Råå',
      savedAt: Date.now() - 86400000, matchScore: 87,
      adText: 'Söker erfaren undersköterska till hemsjukvården i Råå...',
      data: DEMO_CV },
    { id: 'm_demo_2', title: 'Stödassistent — LSS-boende Gåsebäck',
      savedAt: Date.now() - 2 * 86400000, matchScore: 73,
      adText: 'Vi söker stödassistent till LSS-boende...',
      data: DEMO_CV },
    { id: 'm_demo_3', title: 'Hemtjänstpersonal — natt, Eslöv',
      savedAt: Date.now() - 4 * 86400000, matchScore: 81,
      adText: 'Nattjänst inom hemtjänst i Eslöv. 75%.',
      data: DEMO_CV }
  ];

  const DEMO_TRAINING_PROGRESS = {
    m1:  { done: true,  lessonsRead: 4, quizCorrect: 3, completedAt: Date.now() - 5 * 86400000 },
    m2:  { done: true,  lessonsRead: 3, quizCorrect: 4, completedAt: Date.now() - 4 * 86400000 },
    a_cv:{ done: true,  lessonsRead: 5, quizCorrect: 4, completedAt: Date.now() - 3 * 86400000 },
    a_match:{ done: false, lessonsRead: 2, quizCorrect: 1 },
    a_brev: { done: false, lessonsRead: 1, quizCorrect: 0 },
    h1:  { done: true,  lessonsRead: 3, quizCorrect: 3, completedAt: Date.now() - 6 * 86400000 },
    e1:  { done: false, lessonsRead: 2, quizCorrect: 1 }
  };

  const DEMO_TASKS = [
    { id: 'demo_t1', title: 'Färdigställ ditt CV', desc: 'Lägg till en sammanfattning högst upp.',
      tag: 'CV', tc: '#f0c040', done: true },
    { id: 'demo_t2', title: 'Sök 3 jobb denna vecka', desc: 'Använd jobbmatchningen och spara matchade CV.',
      tag: 'JOBB', tc: '#3eb489', done: false },
    { id: 'demo_t3', title: 'Öva intervjufråga: "Berätta om dig själv"',
      desc: 'Använd Intervjuträning. Spela in 2-3 svar tills du är nöjd.',
      tag: 'INTERVJU', tc: '#a78bfa', done: false }
  ];

  function seedStorage() {
    const w = (k, v) => { try { localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v)); } catch(e) {} };
    // Fake auth — backend kommer aldrig att acceptera denna token, men UI:t agerar inloggat
    w('pathfinder_auth', { email: DEMO_CV.email, loggedIn: true,
       userId: 'demo-user-anna', accessToken: 'demo-fake-token', createdAt: Date.now() });
    w('cvData', DEMO_CV);
    // user-scoped storage: använder demo-user-anna som prefix
    const prefix = 'demo-user-anna:';
    w(prefix + 'pathfinder_saved_cvs',   DEMO_SAVED_CVS);
    w(prefix + 'pathfinder_matched_cvs', DEMO_MATCHED_CVS);
    w('cvmovn4', DEMO_TRAINING_PROGRESS);
    w('cvmtasks4', DEMO_TASKS);
    w('cvmtasks4_legacy_cleared', '1');
    w(FLAG_KEY, '1');
    // Markera att vi inte ska visa intro/onboarding
    w('pathfinder_onboarded', '1');
  }

  function disableBackendSync() {
    // Override _sbSync så ingen demo-data träffar Supabase
    window._sbSync = function() {
      // no-op i demo. Returnera resolved promise för API-kompatibilitet.
      return Promise.resolve();
    };
    // Stoppa fetch-anrop till /api/supabase som skulle returnera 401 och förvirra UI
    const origFetch = window.fetch.bind(window);
    window.fetch = function(url, opts) {
      const u = typeof url === 'string' ? url : (url && url.url) || '';
      if (u.indexOf('/api/supabase') !== -1) {
        // Returnera tomma "framgångsrika" svar för demo
        return Promise.resolve(new Response(JSON.stringify({ data: [], demo: true }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }));
      }
      return origFetch(url, opts);
    };
  }

  window.startDemo = function() {
    seedStorage();
    location.href = location.pathname + '?demo=1';
  };
  window.exitDemo = function() {
    try {
      localStorage.removeItem(FLAG_KEY);
      // Rensa demo-data men behåll branding
      ['pathfinder_auth','cvData','cvmovn4','cvmtasks4','cvmtasks4_legacy_cleared','pathfinder_onboarded',
       'demo-user-anna:pathfinder_saved_cvs','demo-user-anna:pathfinder_matched_cvs']
        .forEach(k => localStorage.removeItem(k));
    } catch(e) {}
    location.href = location.pathname;
  };

  if (shouldStartDemo()) {
    seedStorage();
    disableBackendSync();
    window.IS_DEMO_MODE = true;

    // Visa diskret demo-badge så det är tydligt att det INTE är riktig data
    document.addEventListener('DOMContentLoaded', function() {
      const badge = document.createElement('div');
      badge.id = 'cvmDemoBadge';
      badge.style.cssText = 'position:fixed;top:8px;left:50%;transform:translateX(-50%);z-index:99999;'
        + 'background:rgba(240,192,64,0.95);color:#1a1917;font-size:11px;font-weight:800;'
        + 'letter-spacing:1px;padding:5px 14px;border-radius:14px;box-shadow:0 2px 8px rgba(0,0,0,0.3);'
        + 'cursor:pointer;font-family:-apple-system,sans-serif;text-transform:uppercase;';
      badge.textContent = '★ Demo-läge — klicka för att avsluta';
      badge.title = 'Klicka för att rensa demo-data och återgå till riktigt läge';
      badge.onclick = function() {
        if (confirm('Avsluta demo-läget? All demo-data raderas.')) window.exitDemo();
      };
      document.body.appendChild(badge);
    });
  }
})();
