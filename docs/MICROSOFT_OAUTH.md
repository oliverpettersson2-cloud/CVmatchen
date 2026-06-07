# Microsoft OAuth — konfiguration & verifiering

Detta dokument beskriver exakt vilka env-vars som krävs i Vercel och vilka redirect URI:er som måste finnas i Entra ID-app-registreringen. Använd som checklista innan pitch.

## Env-vars (Vercel → Project Settings → Environment Variables)

| Variabel | Beskrivning | Exempel |
|---|---|---|
| `MICROSOFT_CLIENT_ID` | Application (client) ID från Entra ID-app | `12345678-abcd-...` |
| `MICROSOFT_CLIENT_SECRET` | Client secret (Värde, INTE secret-ID) | `~Ab.xYz...` |
| `MICROSOFT_TENANT_ID` | Tenant — vanligtvis `common` för multi-tenant | `common` |
| `SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Service role-nyckel (INTE anon-key) | `eyJ...` |

**Måste vara satta i alla environments** (Production, Preview, Development).

## Redirect URI:er som måste finnas i Entra ID

Lägg till alla domäner där appen kan köras:

```
https://cvmatchen.se/api/v1/auth/microsoft/callback
https://www.cvmatchen.se/api/v1/auth/microsoft/callback
https://cvmatchen.vercel.app/api/v1/auth/microsoft/callback
https://*.vercel.app/api/v1/auth/microsoft/callback     ← preview-deploys
```

Plattform: **Web** (inte SPA, inte Mobile).

## Tillstånd (API permissions)

I Entra ID-appen, under "API permissions", lägg till:

| Permission | Type | Admin consent |
|---|---|---|
| `openid` | Delegated | Nej |
| `profile` | Delegated | Nej |
| `email` | Delegated | Nej |
| `offline_access` | Delegated | Nej |
| `User.Read` (Microsoft Graph) | Delegated | Nej |

## Allowlist i Supabase

Endast emails som finns i tabellen `admins` får logga in. Tillåtna kolumner:
- `id` (uuid)
- `email` (text, unique, case-insensitive)
- `name` (text)
- `role` (text, en av: `handlaggare`, `kommunadmin`, `superadmin`)

Innan pitch: kontrollera att DIN egen admin-email finns där.

## Verifiering (steg-för-steg)

1. **Env-vars satta?** Vercel CLI: `vercel env ls`
2. **Redirect URI:er satta?** Logga in på https://portal.azure.com → Entra ID → App registrations → din app → Authentication
3. **Din email i `admins`-tabellen?** Supabase SQL-editor:
   ```sql
   SELECT id, email, role FROM admins WHERE lower(email) = lower('din.email@kommun.se');
   ```
4. **Klick-test:** Öppna `https://cvmatchen.se/admin` → klicka "Logga in med Microsoft" → välj konto → ska landa i handläggar-vyn med deltagarlista
5. **Felfall:** om du loggar in med ett okänt mail-konto ska du få meddelandet *"Emailen X är inte registrerad som handläggare"*

## Automatiserad test

`npm test` kör `tests/oauth.test.mjs` som verifierar:
- ✓ Start-endpoint redirectar till `login.microsoftonline.com` med korrekt `client_id`, `redirect_uri`, `state`-cookie (HttpOnly, Secure, SameSite=Lax)
- ✓ POST → 405
- ✓ Saknad `MICROSOFT_CLIENT_ID` → 500
- ✓ Callback utan code → `ms_error=missing_code`
- ✓ State-mismatch → `ms_error=invalid_state` (CSRF-skydd)
- ✓ Microsoft `access_denied` → `ms_error=cancelled`
- ✓ Happy path: email i allowlist → 302 till `/admin?ms_token=<base64.signature>`
- ✓ Email INTE i allowlist → `ms_error=unauthorized&ms_info=<email>`
- ✓ Token-exchange fail → `ms_error=token_exchange_failed`

Allt testas utan att kontakta riktiga Microsoft eller Supabase (mockad `global.fetch`).

## Sessionstoken-format

`ms_token = base64url(payload).base64url(hmac-sha256(payload, MICROSOFT_CLIENT_SECRET))`

Payload:
```json
{
  "adminId": "uuid",
  "email": "...",
  "name": "...",
  "role": "handlaggare|kommunadmin|superadmin",
  "loginMethod": "microsoft",
  "issuedAt": 1234567890000,
  "expiresAt": 1234567890000
}
```

TTL: 8 timmar. Refresh: `/api/v1/auth/refresh` förlänger med 8h om mindre än 1h kvar.

Verifieras backend-side i `api/supabase.js → verifyAdmin()` på varje `admin_*`-action med `crypto.timingSafeEqual` mot timing-attacker.
