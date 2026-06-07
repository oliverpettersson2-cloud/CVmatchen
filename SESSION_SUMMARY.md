# CVmatchen — Session Summary & Architecture Guide

## 1. Project Overview

**CVmatchen** is a Swedish municipal job matching platform for CV optimization and job placement. It matches job seekers (primarily care workers, nurses, administrative staff) with municipal job openings via AI-powered CV analysis and skill matching.

**Technology Stack:**
- Frontend: Vanilla JS (no framework), HTML5, CSS3 with custom properties for theming
- Backend: Vercel serverless (Node.js), no-framework HTTP handlers
- Database: Supabase (PostgreSQL) with RLS policies
- AI: Anthropic Claude API (Haiku for jobbmatch, Sonnet for CV analysis)
- Auth: Microsoft Entra ID OAuth2 + custom HMAC-SHA256 session tokens
- Additional: Web Speech API (CV voice reading), jsPDF (export), Sentry (monitoring)

**Primary Users:**
- Job seekers (CV builders, matchers)
- Handläggare (caseworkers, assigned tasks & monitoring)
- Kommunadmin (gemeente admins, user management)
- Superadmin (platform operators)

---

## 2. Architecture & Key Systems

### 2.1 White-Label Branding System
**File:** `branding.js` (172 lines)

A tenant-aware configuration layer supporting multiple Swedish municipalities with custom colors, logos, and branding.

**How it works:**
1. **BRANDS object** defines 3+ tenant configs:
   - `default`: primary platform branding
   - `landskrona`: blue-accented municipal branding
   - `helsingborg`: green-accented municipal branding

2. **Tenant selection priority** (pickBrandId function):
   - `?brand=landskrona` URL parameter (highest)
   - `localStorage.cvm_brand` (sticky across sessions)
   - Host-based mapping via BRAND_BY_HOST (e.g., domain routing)
   - Default fallback

3. **CSS variables applied via applyBrand()**:
   - `--brand-primary`, `--brand-secondary` (action colors)
   - `--brand-bg`, `--brand-surface` (layout backgrounds)
   - `--brand-ink`, `--brand-muted` (text colors)
   - `data-brand="landskrona"` attribute on `<html>`

4. **Loaded early** in index.html/desktop.html BEFORE all CSS/JS to prevent flash of unstyled content

**Usage in deploy:**
- Add new tenant to BRANDS object
- Add domain mapping to BRAND_BY_HOST
- CSS already wired to use vars (no changes needed)
- Demo/preview: `?brand=landskrona` or set localStorage before load

---

### 2.2 Demo Mode for Pitches
**File:** `demo-mode.js` (310 lines)

Offline-capable demo environment seeding realistic Swedish CV data, matched jobs, training progress, and tasks. Used for sales demos and pitch walkthroughs.

**Activation triggers:**
- URL param: `?demo=1`
- localStorage: `cvm_demo_mode=1` (sticky)
- Manual: `window.startDemo()` from console/button

**Demo data includes:**
- **DEMO_CV:** Anna Andersson (undersköterska, 5 yrs experience)
  - 3 jobs (Hemtjänst Centrum, Attendo, ISS)
  - 2 educations (Vård- och omsorgsutbildning, SFI)
  - 3 languages (Swedish, English, Arabic)
  - 2 certifications (Delegering läkemedel, HLR)
  - 6 skills (Procapita, Läkemedelshantering, etc)

- **DEMO_SAVED_CVS:** 2 CV versions (full + compact)
- **DEMO_MATCHED_CVS:** 3 job matches (87%, 73%, 81% scores)
- **DEMO_TRAINING_PROGRESS:** 7 learning modules with completion status
- **DEMO_TASKS:** 3 handläggare-assigned tasks

**Isolation mechanism:**
1. Overrides `window._sbSync()` → no-op (prevents data writes)
2. Intercepts `global.fetch` for `/api/supabase` → returns mocked 200 with empty data
3. Never touches real Supabase or production stats

**Visual feedback:**
- Yellow "★ Demo-läge" badge fixed at top-center
- Clickable to exit via confirmation
- seedStorage() writes demo auth + CV data to localStorage with demo-user-anna prefix

**Exit function:** `window.exitDemo()` removes FLAG_KEY and clears all demo localStorage entries

---

### 2.3 GDPR Cookie Consent
**File:** `cookie-consent.js` (65 lines)

Bootstrap-style consent banner meeting Swedish/EU GDPR requirements.

**Features:**
- Persisted to localStorage (key: `cvm_cookie_consent`, TTL: 365 days)
- Two consent levels:
  - `accepted` → analytics + non-essential tracking allowed
  - `necessary-only` → minimal functionality only
- Fixed position lower-left, themed with `--brand-primary`
- Dispatches `'cookie-consent'` CustomEvent for analytics listeners
- Auto-hides after selection for 365 days

---

### 2.4 Microsoft OAuth Authentication
**File:** `api/v1/auth/microsoft.js` (start) + `api/v1/auth/microsoft/callback.js` (callback handler)
**Documentation:** `docs/MICROSOFT_OAUTH.md`

Custom OAuth2 flow with Entra ID (Azure AD) for secure multi-tenant authentication.

**Token format:**
```
ms_token = base64url(payload) . base64url(hmac-sha256(payload, MICROSOFT_CLIENT_SECRET))

Payload: {
  "adminId": "uuid",
  "email": "...",
  "name": "...",
  "role": "handlaggare|kommunadmin|superadmin",
  "loginMethod": "microsoft",
  "issuedAt": 1234567890000,
  "expiresAt": 1234567890000
}
```

**Security properties:**
- State-parameter CSRF protection (HttpOnly Secure SameSite=Lax cookie)
- HMAC-SHA256 signature (verified with crypto.timingSafeEqual to prevent timing attacks)
- TTL: 8 hours
- Refresh endpoint at `/api/v1/auth/refresh` (extends if <1h remaining)
- Allowlist in Supabase `admins` table (email-based authorization)

**Environment variables required:**
```
MICROSOFT_CLIENT_ID          # Entra ID app (client) ID
MICROSOFT_CLIENT_SECRET      # Client secret value
MICROSOFT_TENANT_ID          # Usually 'common' for multi-tenant
SUPABASE_URL                 # Supabase project URL
SUPABASE_SERVICE_KEY         # Service role key (not anon)
```

**Redirect URIs to register in Entra ID:**
```
https://cvmatchen.se/api/v1/auth/microsoft/callback
https://www.cvmatchen.se/api/v1/auth/microsoft/callback
https://cvmatchen.vercel.app/api/v1/auth/microsoft/callback
https://*.vercel.app/api/v1/auth/microsoft/callback    (preview deploys)
```

---

## 3. Testing Strategy

**Test files:** `tests/api.test.mjs` (65 lines) + `tests/oauth.test.mjs` (210 lines)

**Run:** `npm test`

### 3.1 API Smoke Tests (5 tests)
1. `api/chat.js` exists and exports handler function
2. POST without body doesn't return 200
3. `api/supabase.js` exists and exports handler
4. POST without action doesn't return 200
5. `admin_list_users` without auth token blocks access (returns non-200)

**Why:** Verify critical endpoints are deployed and basic auth works. Uses minimal mocking.

### 3.2 OAuth Flow Tests (9 tests)
1. **Start endpoint (GET)** → 302 redirect to login.microsoftonline.com with correct params (client_id, redirect_uri, state)
2. **Start state-cookie** → HttpOnly, Secure, SameSite=Lax set correctly
3. **Start (POST)** → 405 Method Not Allowed
4. **Missing MICROSOFT_CLIENT_ID** → 500
5. **Callback without code** → ms_error=missing_code
6. **State mismatch** → ms_error=invalid_state (CSRF protection)
7. **Microsoft access_denied** → ms_error=cancelled
8. **Happy path** → 302 to /admin?ms_token=<base64.signature>
9. **Email not in allowlist** → ms_error=unauthorized&ms_info=<email>
10. **Token exchange failure** → ms_error=token_exchange_failed

**Why:** All OAuth scenarios tested offline by mocking global.fetch. Zero external dependencies in CI.

**Mocked endpoints:**
- `login.microsoftonline.com/*/oauth2/v2.0/token` (token exchange)
- `graph.microsoft.com/v1.0/me` (user profile)
- `supabase.co/rest/v1/admins` (allowlist lookup)
- `supabase.co/rest/v1/admin_activity_log` (audit trail)

---

## 4. File Structure

```
CVmatchen/
├── index.html                          # Main app (job seeker CV builder)
├── desktop.html                        # Desktop variant
├── handlaggare.html                    # Caseworker admin panel
├── branding.js                         # White-label tenant system
├── demo-mode.js                        # Pitch demo seeding
├── cookie-consent.js                   # GDPR consent banner
├── api/
│   ├── chat.js                         # Claude API integration (CV analysis)
│   ├── supabase.js                     # Supabase RLS wrapper
│   └── v1/auth/
│       ├── microsoft.js                # OAuth start endpoint
│       └── microsoft/callback.js       # OAuth callback handler
├── tests/
│   ├── api.test.mjs                    # API smoke tests
│   └── oauth.test.mjs                  # OAuth flow tests
├── docs/
│   ├── MICROSOFT_OAUTH.md              # OAuth setup checklist
│   └── README.md                       # Project readme
└── package.json                        # npm scripts (test, etc)
```

---

## 5. Current Status (Post-Session)

**Branch:** `claude/focused-clarke-NpNhM` (up-to-date with origin)
**Latest commit:** "feat: demo-läge för pitch + OAuth-flow automatiserad i test"

**What's complete:**
- ✅ 4 desktop/mobile parity bugs fixed (PR #5)
- ✅ White-label branding system (3+ tenant support)
- ✅ GDPR cookie-consent banner
- ✅ Demo-mode with realistic Swedish CV + data seeding
- ✅ Microsoft OAuth flow fully tested (9 scenarios, 14 total tests with API tests)
- ✅ Session token implementation with HMAC-SHA256 signing
- ✅ Documentation: README.md + MICROSOFT_OAUTH.md setup guide
- ✅ npm test suite passing locally

**PR status:** Draft PR #5 created with all changes above

---

## 6. Pitch Readiness Checklist (User Responsibility)

### P1 Blockers (Must do before pitch)
- [ ] **Anthropic API credits:** Add to https://console.anthropic.com/settings/billing
- [ ] **Click-test OAuth:** Use docs/MICROSOFT_OAUTH.md checklist on real laptop with valid Entra ID tenant
- [ ] **Env-vars in Vercel:** Set MICROSOFT_CLIENT_ID, _SECRET, _TENANT_ID, SUPABASE_URL, _SERVICE_KEY
- [ ] **Entra ID redirect URIs:** Add all 4 callback URLs to app registration
- [ ] **Supabase admins table:** Verify your email is listed with correct role
- [ ] **Domain live:** cvmatchen.se or preview deploy accessible

### P2 Decisions (For business, not code)
- [ ] Affärsmodell: B2B-licens (300-400k SEK/år per kommune), freemium, per-user, other?
- [ ] Target market: Which municipalities first? How many?
- [ ] Pricing strategy: Fixed annual? Scaling? Based on job matches?

### P3 Nice-to-haves (Deprioritized)
- LMS-Light custom module editor (explicitly skipped: "Avvakta egna moduler")
- LLM cost reduction (Sonnet→Haiku on jobbmatch)
- Rekryteringsmodul (company recruitment dashboard)
- One-pager/pitch-deck
- Pentest/MSB-granskning

---

## 7. How to Continue

### If merging PR #5 to main:
```bash
git checkout main
git pull origin main
git merge --no-ff claude/focused-clarke-NpNhM
git push origin main
```

### If testing demo-mode locally:
```bash
npm install
npm run dev
# Visit http://localhost:3000/?demo=1
# or click "★ Prova demo" button on login screen
```

### If verifying OAuth in staging:
```bash
# Set env-vars in Vercel
vercel env ls

# Run tests
npm test

# Click-test: https://preview-deploy.vercel.app/admin
# Should redirect to Microsoft login, then back to /admin with token
```

### If adding a new tenant:
1. Edit `branding.js`: Add entry to BRANDS object
2. Add domain mapping to BRAND_BY_HOST (if domain-based)
3. CSS vars automatically applied; no CSS changes needed
4. Deploy + test with `?brand=nytenant`

---

## 8. Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| No frontend framework (Vanilla JS) | Minimal bundle, fast load, easy to customize |
| Vercel serverless (no fixed backend) | Scales automatically, free tier for demo, integrates with git |
| Supabase for persistence | RLS policies for security, easy to audit, scales past MVP |
| HMAC-SHA256 tokens vs JWT | Simpler to invalidate/rotate, doesn't expose claims in header |
| Demo-mode isolation via fetch mocking | Offline capable, no risk of demo-data touching prod, testable |
| State-parameter CSRF on OAuth | Prevents attack replay, cookie-based to avoid localStorage risks |
| TimingSafeEqual for token verification | Prevents timing-based attacks on secret comparison |

---

## 9. Known Limitations & Trade-offs

1. **Demo-mode can't test real Supabase:** Mocked responses mean demo doesn't actually persist to DB. OK for pitch; add integration test before production use of admin panel.

2. **OAuth state-cookie expires with browser session:** If user leaves browser open >1 day, redirect may fail. Solution: auto-refresh on callback or store state in DB.

3. **No offline PWA:** App requires online connection for Claude API calls and Supabase sync. Desktop.html is same-origin only (not separate domain).

4. **White-label colors only:** Logos, fonts, translations still centralized. Full white-label would need CDN per tenant + i18n system.

5. **Admin allowlist in Supabase:** No self-service signup. All admins must be added manually. OK for B2B (kommune contracts), needs self-service for B2C.

---

## 10. Dependencies & Versions

**Runtime (package.json):**
- None pinned; uses whatever latest is in npm
- Optional: @sparticuz/chromium (for Puppeteer if needed)

**Dev/Test:**
- node:test (built-in to Node 18+)
- node:assert/strict (built-in)

**Environment:**
- Node 18+ required
- npm 8+

---

## 11. Debugging Tips

**Demo-mode not activating?**
```js
// In console:
localStorage.setItem('cvm_demo_mode', '1');
location.reload();
// Or use window.startDemo()
```

**OAuth redirect failing?**
- Check MICROSOFT_CLIENT_ID is set in Vercel
- Verify redirect_uri matches Entra ID app registration exactly (https, domain, path)
- Check state-cookie is not HttpOnly-blocked by browser (should be visible in DevTools)

**Token verify failing on backend?**
- Ensure MICROSOFT_CLIENT_SECRET matches the one in Entra ID (not secret-ID, the actual value)
- Check token hasn't expired (8 hour TTL)
- Verify HMAC-SHA256 signature in token (base64url.base64url format)

**Tests failing in CI?**
- Check node version (need 18+)
- Ensure npm install ran (all 179 packages)
- OAuth test requires node --test support (no special runner needed)

---

## 12. Contact & Escalation

- **User email:** oliver.pettersson2@gmail.com
- **Live domain:** cvmatchen.se
- **Vercel project:** cvmatchen
- **Supabase org:** (check PROJECT_REF in deploy logs)
- **Entra ID app:** (check MICROSOFT_CLIENT_ID registration)

---

**Last updated:** 2026-06-07
**Session branch:** claude/focused-clarke-NpNhM
**Test coverage:** 14 tests (5 API smoke + 9 OAuth), all passing

