# CVmatchen

**AI-driven jobbsökarplattform för den svenska arbetsmarknaden** — riktad mot kommuners arbetsmarknadsenheter, försörjningsstödshandläggare och arbetssökande.

## Vad är det?

CVmatchen kombinerar **CV-byggare**, **AI-jobbmatchning mot riktiga annonser**, **AI-intervjuträning med röst**, **30+ träningsmoduler om svenskt arbetsliv** (a-kassa, CSN, BankID, 1177, SFI, Komvux, Försäkringskassan, Öresundspendling m.m.) och en **handläggarvy** för kommuners arbetsmarknadsenheter med deltagarlistor, uppgiftsutdelning, statistik och kursprogression.

## För vem?

- **Arbetssökande** som vill bygga CV, träna intervju och hitta jobb som matchar deras profil
- **Kommunala handläggare** på arbetsmarknadsenheter, försörjningsstöd och Ungdomsteam
- **Kommuner & regioner** som upphandlar SaaS-tjänster för jobbcoachning (alternativ till t.ex. Candeno)

## Tech-stack

| Lager | Teknik |
|---|---|
| **Frontend** | Vanilla JS, ren HTML/CSS (`index.html` mobil, `desktop.html`/`desktop-app.js` desktop, `handlaggare.html` admin) |
| **Backend** | Vercel serverless functions (region `arn1`, Stockholm) |
| **Databas/auth** | Supabase (Postgres + magic-link auth + RLS) |
| **LLM** | Anthropic Claude — Haiku 4.5 (snabba svar) + Sonnet 4.6 (CV-analys, jobbmatch) |
| **Röst (intervju)** | Webbläsarens Web Speech API (`SpeechRecognition` + `speechSynthesis`) — kräver Chrome/Edge |
| **PDF** | Puppeteer + `@sparticuz/chromium` (server) med jsPDF-fallback (klient) |
| **Handläggar-auth** | Microsoft OAuth via Entra ID (HMAC-signerade sessionstokens) |
| **Monitoring** | Sentry |
| **Säkerhet** | CSP, HSTS, X-Frame-Options SAMEORIGIN, kryptografisk admin-tokenverifiering |

## Köra lokalt

```bash
# 1. Klona och installera
npm install

# 2. Skapa .env.local med:
#    ANTHROPIC_API_KEY=sk-ant-...
#    SUPABASE_URL=...
#    SUPABASE_SERVICE_ROLE_KEY=...
#    MICROSOFT_CLIENT_ID=...
#    MICROSOFT_CLIENT_SECRET=...
#    MICROSOFT_TENANT_ID=...
#    SENTRY_DSN=...

# 3. Kör med Vercel CLI
npx vercel dev
```

## Deploy

Pushas automatiskt till Vercel från `main`. Branch-previews via PR.

URL-rewrites (`vercel.json`):
- `/app` → `index.html` (mobil/PWA)
- `/admin` → `handlaggare.html` (handläggarvy, MS-OAuth-skyddad)

## Projektstruktur

```
/                     Statiska sidor (index.html, desktop.html, handlaggare.html...)
/api                  Vercel serverless functions
  chat.js             Claude-proxy med rate-limit
  supabase.js         Supabase-proxy + verifyAdmin för admin_*-actions
  pdf.js              Puppeteer PDF-generering
  v1/auth/microsoft   Entra ID OAuth-flow
/desktop-app.js       Desktop-app (alla vyer)
/intervju.js          AI-intervjuträning (Web Speech + Claude)
/training-modules.js  Träningsmoduler (Arbete, Studier, Hälsa, Ekonomi, Digitalt)
/videos/              100+ inspelade utbildningsvideos
```

## Säkerhet & GDPR

- Alla data lagras i EU (Supabase EU-region, Vercel `arn1`)
- HMAC-signerade admin-sessioner verifieras backend-side på varje `admin_*`-action
- `crypto.timingSafeEqual` mot timing-attacker
- CSP utan `unsafe-inline` för styles, ingen frame-embedding, inga externa iframes
- Magic-link-login för arbetssökande, Microsoft OAuth + DB-allowlist för handläggare

## Licens

Proprietär — PathfinderAI AB.
