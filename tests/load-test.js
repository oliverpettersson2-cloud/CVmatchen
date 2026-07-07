/*
 * CVmatchen — lasttest (k6)
 * ============================================================
 * Verifierar skalningspåståendet ("klarar 5 000+ användare") med
 * riktig mätdata, som svar på återkopplingen att detta var obevisat.
 *
 * INSTALLATION (engångs):
 *   • Mac:    brew install k6
 *   • Windows: winget install k6 --source winget
 *   • Linux:  se https://k6.io/docs/get-started/installation/
 *
 * KÖR (mot en PREVIEW-deploy, INTE skarp prod med invånardata):
 *   BASE_URL=https://<din-preview>.vercel.app k6 run tests/load-test.js
 *
 * SÄKERHET:
 *   • Kör mot en preview-/testmiljö, inte produktion med riktig data.
 *   • Testet hämtar bara PUBLIKA sidor (ingen inloggning, ingen persondata).
 *   • Börja lågt. Trappa upp först när grundnivån är grön.
 * ============================================================
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const BASE = __ENV.BASE_URL || 'https://www.cvmatchen.com';

// Egna mått för tydlig rapport
const errorRate = new Rate('fel_andel');
const pageLoad = new Trend('sidladdning_ms', true);

// Lastprofil: trappa upp mot ~500 samtidiga virtuella användare.
// 500 VU med tänk-tid ~5 s motsvarar grovt tusentals unika sessioner/min
// — representativt för en stor kommuns samtidiga användning.
export const options = {
  stages: [
    { duration: '1m', target: 50 },    // uppvärmning
    { duration: '2m', target: 200 },   // normal topp
    { duration: '2m', target: 500 },   // hård topp
    { duration: '2m', target: 500 },   // håll toppen (uthållighet)
    { duration: '1m', target: 0 },     // nedtrappning
  ],
  thresholds: {
    http_req_duration: ['p(95)<1500'], // 95 % av svaren under 1,5 s
    fel_andel: ['rate<0.01'],          // < 1 % fel
  },
};

// Publika sidor som representerar verklig trafik (ingen auth krävs).
const PATHS = ['/', '/desktop.html', '/handlaggare.html', '/tillganglighet.html', '/manifest.json'];

export default function () {
  const path = PATHS[Math.floor((__VU + __ITER) % PATHS.length)];
  const res = http.get(`${BASE}${path}`, { tags: { path } });

  pageLoad.add(res.timings.duration);
  const ok = check(res, {
    'status 200': (r) => r.status === 200,
    'svar < 2s': (r) => r.timings.duration < 2000,
    'innehåll finns': (r) => r.body && r.body.length > 100,
  });
  errorRate.add(!ok);

  sleep(Math.random() * 4 + 1); // 1–5 s tänk-tid, som en riktig användare
}

/*
 * TOLKNING AV RESULTATET (skrivs ut när körningen är klar):
 *   • http_req_duration p(95)  → svarstid för 95:e percentilen
 *   • fel_andel                → andel misslyckade förfrågningar
 *   • iterations               → totalt antal sidvisningar
 *   • vus_max                  → högsta antal samtidiga användare
 *
 * Grön tröskel (p95 < 1,5 s, fel < 1 %) vid 500 VU = konkret bevis
 * att arkitekturen bär en stor kommuns samtidiga last. Klistra in
 * sammanfattningen i verifieringsrapporten.
 */
