# Pilot-backlog — CVmatchen

Master-lista innan pilot går live. Skapad 2026-06-09 efter heltäckande
säkerhets- + pilot-readiness-granskning.

Komplexitet: trivial / liten / medel / större / krångligt.

---

## 📌 STRATEGISKT — affär & finansiering

| # | Vad | När | Status |
|---|---|---|---|
| **S1** | **Visionsfonden — Helsingborg.** Sök upp till 100 000 kr för att utveckla CVmatchen för helsingborgare. Krav: 18+, projekt i/för Helsingborg, kopplat till Helsingborg 2035-visionen. Sökbart 2 ggr/år (vår + höst). **Nästa öppning: september 2026.** Förstärks om AMF-piloten är igång då. https://helsingborg.se/kommun-och-politik/helsingborg-2035/visionsfonden/ | Sept 2026 | ⏳ |
| **S2** | **Vinnova Innovativa Startups.** Steg 1: upp till 500 000 kr, Steg 2: upp till 900 000 kr. Kräver svenskt AB (max 10 år, max 10 anställda, ≤10 MSEK omsättning) + internationell potential. Konkurrensutsatt. https://www.vinnova.se/e/innovativa-startups/innovativa-startups-2026 | Snart | ⏳ |
| **S3** | **Wrappa CVmatchen som app med Capacitor.** Återanvänder befintlig kod 100%, publicerbar i App Store + Google Play. Tidsåtgång: ~1 veckas jobb + 1–3 dagar app store-granskning. Kostnad: Apple Developer 99 USD/år + Google Play 25 USD engångskostnad. Möjliggör push-notiser (påminna deltagare om uppgifter — stort värde för kommunen). | Efter pilot-start | ⏳ |
| **S4** | **AI-SYV-chatten som kort-baserade pratbubblor.** Idag returnerar AI:n långa textsvar med "Fråga 1, Fråga 2, Fråga 3" i samma bubbla. Bygg om till strukturerad output: en fråga åt gången som eget kort med klickbara svarsalternativ (Grundskola/Gymnasie/Högskola etc). Mindre brödtext, tydligare labels, mobil-vänligt. Kräver: ny system-prompt som ger JSON, ny rendering, svarsmatchning. Komplexitet: medel. | Efter pilot-start | ⏳ |

---

## 🔴 BLOCKERS — gå INTE live utan dessa

| # | Vad | Var | Komplexitet | Status |
|---|---|---|---|---|
| 1 | DEMO_MODE=true i prod — demo blandas med riktig data | handlaggare.html:1223 | Trivial | ✅ |
| 2 | `userId` från body utan JWT-verifiering (save_cv/save_table/save_progress/check_onboarding/ensure_participant) | api/supabase.js | Medel | ✅ |
| 3 | DOM-XSS i admin-vyn — namn + enhetsnamn renderas utan escape | handlaggare.html:1875, 1877 | Liten | ✅ |
| 4 | DOM-XSS via URL-parameter (`ms_info`) | index.html:7331 | Trivial | ✅ (input-sanering) |
| 5 | Host-header-injection i OAuth-callback | api/v1/auth/microsoft/callback.js:70 | Liten | ✅ |
| 6 | `save_ai_consent` kan tilldela godtycklig kommun via manipulerat token | api/supabase.js:312 | Liten | ✅ |
| 7 | GDPR-radering av deltagare — `admin_delete_user` + `user_delete_self` finns, kaskaderar 12 tabeller + auth + invites. **Klart.** `admin_activity_log` nu inkluderad i kaskaden; `ai_consent` är kolumner på user_assignments (redan täckt). Radering är vattentät. | api/supabase.js:787,807 | Liten | ✅ (finslip ⏳) |
| 8 | Mejl-leverans EJ verifierad — testa i prod att Supabase→Resend skickar | (manuell) | Liten | ⏳ |
| 9 | Accept-invite-token-flöde — token är dekorativ idag | api/v1/auth/microsoft/callback.js | Medel | ⏳ |
| 10 | End-to-end-test av hela invite-kedjan | (manuell) | Liten | ⏳ |

## 🟠 BÖR FIXAS — pinsamt utan, men inte livshotande

| # | Vad | Var | Komplexitet | Status |
|---|---|---|---|---|
| 11 | Onboarding-guide för handläggare (första-gångs-vy) | handlaggare.html | Medel | ⏳ |
| 12 | Mobil-layout saknas i handläggar-vyn | handlaggare.html | Medel | ⏳ |
| 13 | Pilot-utgångsbanner när < 14 dagar kvar | handlaggare.html:6110 | Liten | ⏳ |
| 14 | "Skicka om invite"-knapp | handlaggare.html | Liten | ⏳ |
| 15 | SQL-injection-risk i `user_id=in.(...)` | api/supabase.js:670 | Liten | ⏳ |
| 16 | DOM-XSS i CV-skill-rendering | index.html:5178, 5703, 5820 | Liten | ⏳ |
| 17 | PII i loggar: supabase.js var redan maskad (maskPII). Åtgärdat 2026-07-11: callback.js loggade hela tokenData (access_token!) + graphData (namn/e-post) + rå admin-check-text → nu endast status/felkod, e-post maskas. | api/v1/auth/microsoft/callback.js | Trivial | ✅ |
| 18 | DB-feltext läckte i felsvar. Åtgärdat 2026-07-11: send_otp JSON.stringify-fallback + 3 st `result.data.message` (Postgres-schema-läcka) → generiska klientsvar + maskad serverloggning. | api/supabase.js | Liten | ✅ |
| 19 | Rate-limiting på admin-endpoints | api/supabase.js | Medel | ⏳ |
| 20 | `admin_list_diary_stats` per-user-validering | api/supabase.js | Liten | ⏳ |
| 21 | Audit-logg fylls inte (admin_audit oanvänd) | api/supabase.js | Medel | ⏳ |
| 22 | Statistik-export som CSV | handlaggare.html | Liten | ⏳ |

## 🟡 KAN VÄNTA

| # | Vad | Var | Komplexitet | Status |
|---|---|---|---|---|
| 23 | Mobil profil-export: text över knappar (väntar screenshot) | index.html | Trivial | ⏳ |
| 24 | Ta bort "Starta session"-knapp i handläggar-tilldelade uppgifter | desktop.html | Trivial | ⏳ |
| 25 | Ersätt browser-`confirm()` med snyggt modal | desktop.html | Liten | ⏳ |
| 26 | Superadmin `filters.kommun_id` ej server-validerad | api/supabase.js | Liten | ⏳ |
| 27 | Träningsmoduler ej synliga i handläggar-vyn | handlaggare.html | Medel | ⏳ |
| 28 | Deltagar-status-övergångar odokumenterade | api/supabase.js | Trivial | ⏳ |
| 29 | Body-size-gräns i chat.js (efficiency) | api/chat.js | Trivial | ⏳ |
| 30 | DEMO_MODE-indikator-banner när på | handlaggare.html | Trivial | ⏳ |
| 31 | "Senast aktiv" visar `cv.updated_at` istället för faktisk inloggning — returnera `last_sign_in_at` från `auth.users` i `admin_list_users` och använd den | api/supabase.js + handlaggare.html:4251 | Liten | ⏳ |
| 32 | `oliver.pettersson@helsingborg.se` syns i deltagar-listan trots att kontot är en handläggare — filtrera bort handläggar-/admin-konton från `admin_list_users` (eller exkludera roller ≠ deltagare i frontend) | api/supabase.js + handlaggare.html | Liten | ⏳ |
| 33 | Döp om `WS_BEARER_TOKEN_BEDROCK` → `AWS_BEARER_TOKEN_BEDROCK` i Vercel (kräver delete + re-add med samma värde), redeploy. Sen ta bort fallback-aliaset i `api/chat.js` så endast `AWS_BEARER_TOKEN_BEDROCK` läses. | Vercel env vars + api/chat.js:70 | Trivial | ⏳ |
| 34 | Rotera `SUPABASE_SERVICE_KEY` (Supabase → Settings → API → Reset) + `ANTHROPIC_API_KEY` (console.anthropic.com → revoke + create). Båda flaggade "Needs Attention" i Vercel = nyckel troligen exponerad. Uppdatera Vercel env + redeploy. | Vercel env vars | Liten | ⏳ |
| 35 | **Beroende-sårbarheter (23 st, 4 höga)** i puppeteer/ws-kedjan (PDF-subsystemet). Åtgärd, testa PDF-export FÖRE merge till prod (annars risk att CV/rapport-export slutar fungera): `npm i puppeteer-core@latest @sparticuz/chromium@latest` (bumpa BÅDA i lås-steg), verifiera `api/pdf.js` (launch + executablePath), kör en riktig CV-export. Serverside-exponering är låg → ej brådskande men bör stängas. | package.json + api/pdf.js | Liten | ⏳ |
| 36 | **A11y — kvarvarande:** dold legacy-knapp `switchDetailTab('uppgifter-legacy')` (display:none) kan tas bort helt. Övriga ikon-knappar/fält aria-labelade 2026-07-07. | handlaggare.html:2952 | Trivial | ⏳ |
