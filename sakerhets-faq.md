# Säkerhets-FAQ — CVmatchen

*Senast uppdaterad: 2026-06-04 · Kontakt: oliver.pettersson2@gmail.com · 0766 07 17 57*

Detta är ett kort svar på de vanligaste frågorna från IT-säkerhet inför pilot. Mer detalj eller PuB-mall finns på begäran.

---

### Var lagras data?

- **Webb/frontend**: Vercel, region `arn1` (Stockholm, AWS eu-north-1).
- **Databas + auth**: Supabase, EU-region (Frankfurt).
- **AI**: Migrering pågår från Anthropic (US) till **AWS Bedrock EU** (Stockholm/Frankfurt) före pilot. Inga personuppgifter skickas idag till US utan föregående anonymisering — fullt EU-flöde är pilot-blocker.
- **Backuper**: Supabase tar dagliga backuper inom EU. Point-in-time recovery 7 dagar.

### Är CVmatchen GDPR-kompatibelt?

Ja. PathfinderAI är personuppgiftsbiträde, kommunen är personuppgiftsansvarig. **PuB-avtal (SKR-mall) skrivs innan pilot startar.** Användaren samtycker till AI-behandling vid första AI-anrop (checkbox + dokumenterat samtycke). Användaren kan när som helst begära radering — implementerat som ett klick i appen (`handleDeleteAccount`).

### Vem äger datan?

Kommunen äger all data som dess invånare och handläggare lägger in. Vid avtalsslut exporteras data i strukturerat format (JSON) och raderas hos PathfinderAI inom 30 dagar.

### Hur autentiseras användare?

- **Invånare**: Supabase OTP (engångskod via e-post). Inga lösenord. Stängd registrering under pilot — endast inbjudna (av handläggare) får OTP-mail.
- **Handläggare/chef**: Microsoft OAuth mot kommunens Entra ID-tenant. HMAC-signerad session-token (`HS256`, secret roterad), validerad på varje admin-request.
- **Multi-faktor**: ärvs från kommunens Entra ID-policy för admin-rollen. Invånar-OTP är i sig en faktor.

### Hur skyddas datan?

- **Transport**: HTTPS överallt, HSTS med preload (`max-age=63072000`).
- **CSP**: strikt `default-src 'self'`, ingen `unsafe-eval`. Tillåtna källor är hårdkodade.
- **Vila**: AES-256 i Supabase (Postgres + storage).
- **Row Level Security (RLS)**: alla användartabeller filtrerar på `auth.uid()`. Token↔userId-bindning kontrolleras dessutom serverside på varje API-anrop.
- **Tenant-isolation**: handläggare ser enbart sin kommun/enhets invånare — verifieras via `verifyAdmin()` med färsk DB-lookup, inte token-claims.

### Hanteras AI-prompten säkert?

- Server-side rate-limit per IP på `/api/chat`.
- AI ser bara CV-data från **inloggad användares egen** session — token-binding kontrolleras innan kontext skickas.
- Inga prompter loggas med personuppgifter — `maskPII()` ersätter e-post och telefonnummer i alla Vercel-loggar (`api/supabase.js:7-13`).
- Migrering till AWS Bedrock EU innebär att inga AI-anrop lämnar EU.

### Loggning och övervakning?

- **Felövervakning**: Sentry, EU-region. PII maskas innan upload.
- **Aktivitetslogg**: `activity_log`-tabell i Supabase. Endast tillåtna event-typer (vit-listade), max 4 kB metadata per event, validerat per request.
- **Admin-audit**: `admin_activity_log` loggar alla nekade cross-tenant-försök för forensik.

### Hur hanteras säkerhetsincidenter?

- Underrättelseplikt till kommunen inom 24 timmar vid misstänkt incident.
- Sårbarheter rapporteras till oliver.pettersson2@gmail.com — bekräftas inom 24 h, åtgärdas efter CVSS-prio.
- Källkoden granskas regelbundet (senast 2026-06-04, omfattande djupgranskning av 7 specialiserade verktyg + manuell genomgång).

### Tillgänglighet?

WCAG 2.1 AA — tillgänglighetsredogörelse publicerad på `cvmatchen.com/tillganglighet`. Skip-länk, synlig fokusram, aria-live för dynamiskt innehåll, korrekta tab-roller, respekterar `prefers-reduced-motion`. Manuellt testat med iOS VoiceOver och Android TalkBack inför pilot.

### Penetrationstest?

Externt pen-test bokas under pilotens första 30 dagar. Resultat delas med kommunen. Sårbarhetsskanning körs kontinuerligt via beroende-audit (npm audit + Sentry release-tracking).

### Behöver kommunens IT-avdelning öppna något?

Nej. CVmatchen körs i webbläsaren. Inga inkommande VPN-tunnlar, inga öppna portar, ingen on-prem-komponent. Microsoft OAuth-callbacken kräver att kommunens tenant tillåter inloggning till PathfinderAI som extern app (samma flöde som Teams/M365-tjänster).

### Var ligger källkoden?

Privat GitHub-repo under `oliverpettersson2-cloud/cvmatchen`. Tillgång på begäran av kommunens IT-säkerhetschef. Förändringar deployas via Vercel med automatiska bygge- och säkerhetskontroller.

---

*Kvarstående pilot-blockers (transparent redovisning): AWS Bedrock-migration, AI-samtycke-checkbox i UI, PuB-avtal undertecknat, organisationsnummer i integritetspolicy (väntar bolagsregistrering).*
