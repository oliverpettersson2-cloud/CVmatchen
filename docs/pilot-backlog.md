# Pilot-backlog — CVmatchen

Master-lista innan pilot går live. Skapad 2026-06-09 efter heltäckande
säkerhets- + pilot-readiness-granskning.

Komplexitet: trivial / liten / medel / större / krångligt.

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
| 7 | Ingen GDPR-radering av deltagare — `delete_user`-endpoint saknas | api/supabase.js | Medel | ⏳ |
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
| 17 | Email-PII loggas i admin_activity_log | api/supabase.js:156 | Trivial | ⏳ |
| 18 | Stack-traces läcker i error-responses | api/supabase.js, api/pdf.js | Liten | ⏳ |
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
