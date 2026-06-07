# Kostnadsanalys CVmatchen — 1000 användare @ 250 000 kr/år

Detaljerad genomgång av drift, marginaler och skalningsgränser. Alla antaganden är synliga så siffrorna kan justeras.

---

## 1. Intäkt

- 1000 användare × 250 kr/år = **250 000 kr/år** (~20 833 kr/mån)
- Vid 20% churn: ~200 000 kr/år

---

## 2. Användarmönster (antaganden)

| Grupp | Andel | Per månad |
|---|---|---|
| Lätt | 60% (600) | 2 inloggn, 1 CV, 1 match, 5 AI-chat |
| Medel | 30% (300) | 8 inloggn, 2 CV, 5 match, 20 chat, 5 intervju |
| Power | 10% (100) | 20 inloggn, 4 CV, 15 match, 60 chat, 20 intervju |

---

## 3. Anthropic API — per anrop

Modeller i koden: `claude-sonnet-4-6` och `claude-haiku-4-5`. 1 USD ≈ 10,5 SEK.

| Anropstyp | Modell | In | Ut | Kr/anrop |
|---|---|---|---|---|
| Profiltext | Sonnet | 3 000 | 600 | 0,19 |
| Arbetsuppgifter | Sonnet/Haiku | 2 500 | 500 | 0,13 |
| Jobbmatchning | Sonnet | 5 000 | 1 800 | 0,44 |
| Kompetensförslag | Sonnet | 1 500 | 300 | 0,09 |
| AI-SYV chat | Haiku | 1 500 | 400 | 0,04 |
| Intervjusvar | Haiku | 2 000 | 800 | 0,06 |
| 30-dagarsplan | Haiku | 1 500 | 800 | 0,06 |
| Övningsfeedback | Haiku | 800 | 500 | 0,03 |

### API-kostnad per användare/år

| Grupp | Antal | Kr/år/st | Total kr/år |
|---|---|---|---|
| Lätt | 600 | 10,7 | 6 420 |
| Medel | 300 | 51 | 15 300 |
| Power | 100 | 154 | 15 400 |
| **Summa** | 1000 | snitt 37 | **~37 000** |

Med 20% buffert: **~45 000 kr/år**.

> 💡 Byter du ALLT till Haiku faller API-kostnaden ~70% → **~14 000 kr/år**.

---

## 4. Hosting & infra

| Tjänst | Plan | Varför | Kr/år |
|---|---|---|---|
| Vercel | Pro $20/mån | längre API timeout, logghistorik | 2 520 |
| Supabase | Pro $25/mån | backup, PITR, support | 3 200 |
| Domän | cvmatchen.com/.se | — | 300 |
| Google Workspace | 1 user | info@-mail | 1 008 |
| Transactional email | Resend/SendGrid | magic-links utan rate limit | 1 200 |
| **Subtotal** | | | **~8 200** |

### Trafik-uppskattning

- 1000 anv × ~8 MB/mån = ~8 GB bandbredd → klart inom Vercel Pro
- Supabase DB: ~100 KB/anv × 1000 = 100 MB (av 8 GB inkluderat)
- Function-anrop: ~480k/år (av 1M/mån inkluderat)

---

## 5. Mjuka kostnader (årligen)

| Post | Kr/år |
|---|---|
| GDPR-konsult, biträdesavtal | 5 000 |
| Bokföring (Fortnox + revisor light) | 6 000 |
| F-skatt/moms-admin | 2 000 |
| Företagsförsäkring | 3 500 |
| Marknadsföring (organic, SEO) | 10 000 |
| Säkerhet (pentest vart 2:a år / 2) | 5 000 |
| **Subtotal** | **31 500** |

---

## 6. Total kostnad — realistic case

| Kategori | Kr/år |
|---|---|
| Vercel Pro | 2 520 |
| Supabase Pro | 3 200 |
| Anthropic API | 45 000 |
| Domän + email | 1 308 |
| Transactional email | 1 200 |
| GDPR + juridik | 5 000 |
| Bokföring + admin | 8 000 |
| Försäkring | 3 500 |
| Marknadsföring | 10 000 |
| Säkerhet | 5 000 |
| Buffert (10%) | 8 500 |
| **TOTAL (utom lön)** | **~93 000** |

---

## 7. Marginal-scenarier

| Scenario | Anthropic | Total | Marginal | % |
|---|---|---|---|---|
| **Best** (allt Haiku, free tiers) | 14 000 | ~55 000 | 195 000 | **78%** |
| **Realistic** (mix Sonnet/Haiku) | 45 000 | ~93 000 | 157 000 | **63%** |
| **Worst** (mest Sonnet, power-tunga) | 120 000 | ~175 000 | 75 000 | **30%** |

**Break-even API:** ~240 kr/anv/år. Skulle kräva ~50 Sonnet-anrop/mån/anv. Långt över nuvarande mix.

---

## 8. Hur många kan du köra GRATIS (utom AI)?

| Tjänst | Free tier | Praktisk gräns |
|---|---|---|
| Vercel Free | 100 GB bandbredd | ~12 000 aktiva/mån |
| Supabase Free | 50k MAU, 500 MB DB, **5 GB bandbredd** | **~4 500 aktiva/mån** (flaskhals) |
| Anthropic | Pay-per-use | 0 gratis |

**Praktisk gräns gratis: ~3 000–4 000 aktiva användare/mån.**
Över det: ~280 kr/mån för Vercel + Supabase Pro + rörlig AI-kostnad.

---

## 9. Skalningsmilstolpar

| Användare | Vad händer |
|---|---|
| 1 – 3 000 | Free tiers räcker (utom AI). ~3 öre/anv/mån i fast kostnad. |
| 3 000 – 5 000 | Vercel Pro + Supabase Pro = ~570 kr/mån. Fortsatt billigt. |
| 5 000 – 10 000 | Dedikerad SMTP, eventuellt Vercel Team plan. ~1 500 kr/mån. |
| 10 000+ | DB-tuning, Postgres-replica, support-kostnader. Marginalen växer mot 75-80% pga skalfördelar. |

---

## 10. Slutsats

- Vid 1000 användare och 250 000 kr intäkt: **~63% marginal, ~157 000 kr kvar före lön/skatt**.
- Största enskilda kostnaden är **Anthropic API** — varje krona där styr lönsamheten.
- Snabbaste hävstången för bättre marginal: flytta Sonnet→Haiku där kvaliteten tål det.
- Du har generös headroom på Vercel/Supabase free tiers tills åtminstone ~3 000 aktiva användare.
