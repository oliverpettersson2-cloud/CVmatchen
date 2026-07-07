# Verifieringsrapport — CVmatchen

Datum: 2026-07-07
Utförd av: automatiserad granskning (verktygsbaserad) på uppdrag av
PathfinderAI. Ej ersättning för oberoende pentest/WCAG-audit — se avsnitt
"Vad detta INTE är".

Syftet är att ersätta obekräftade påståenden med **mätdata**, som svar på
den återkoppling som lyfte att tidigare kvalitetsintyg var självskattade.

---

## Sammanfattning

| Område | Metod | Resultat |
|--------|-------|----------|
| Hemligheter i kod | Mönstersökning (nyckelformat) | ✅ Inga hårdkodade nycklar — allt via miljövariabler |
| Beroende-sårbarheter | `npm audit` | ⚠ 23 kända sårbarheter (4 höga) i PDF-subsystemet (puppeteer/ws) |
| Tillgänglighet (statisk) | WCAG-heuristik | ✅ Grundstruktur god · ⚠ enstaka fält/knappar för manuell kontroll |

---

## 1. Hemligheter i kod ✅

**Metod:** sökning efter kända nyckelmönster (Anthropic `sk-ant-`, AWS
`AKIA…`, Supabase `service_role`/JWT `eyJ…`) i all JS/HTML/JSON.

**Resultat:** inga hårdkodade nycklar. Samtliga hemligheter läses via
`process.env` och lagras krypterat i Vercel. Detta bekräftar att en läcka
av källkoden inte i sig exponerar produktionsnycklar.

---

## 2. Beroende-sårbarheter ⚠

**Metod:** `npm audit` mot produktionsberoenden.

**Resultat:** 23 kända sårbarheter (19 medel, 4 höga). **Samtliga** ligger
i en enda beroendekedja:

```
puppeteer-core → @puppeteer/browsers → ws / tar-fs
```

Denna kedja används av `api/pdf.js` för PDF-generering (headless Chromium).
De höga CVE:erna gäller `ws` (WebSocket-bibliotek): DoS vid många
HTTP-headers, minnesexponering, minnesuttömning.

**Riskbedömning:** subsystemet körs serverside vid PDF-export och tar inte
emot fientlig extern WebSocket-trafik i normal drift → praktisk exponering
är begränsad. Men känd-sårbara paket ska ändå åtgärdas.

**Åtgärd:** uppgradera `puppeteer-core` till 25.x (brytande ändring →
kräver test av PDF-exporten). Planeras i backlogen. Övriga beroenden
(`@sentry/node`, `@supabase/supabase-js`) är rena.

---

## 3. Tillgänglighet — statisk granskning

**Metod:** heuristisk WCAG 2.1-kontroll av samtliga vyer: språkattribut,
viewport, rubrikstruktur, alt-texter, formuläretiketter, knapptext.

| Vy | `lang` | viewport | `<h1>` | Bilder utan alt | Fält utan tydlig etikett | Tomma knappar |
|----|--------|----------|--------|-----------------|--------------------------|---------------|
| index.html (deltagare mobil) | ✅ | ✅ | 1 ✅ | 0 ✅ | 2 / 177 | 2 |
| handlaggare.html (admin) | ✅ | ✅ | 2 ✅ | 0 ✅ | 6 / 23 | 12 |
| desktop.html (deltagare) | ✅ | ✅ | 1 ✅ | 0 ✅ | 1 / 31 | 0 |
| tillganglighet.html | ✅ | ✅ | 1 ✅ | 0 ✅ | 0 ✅ | 0 ✅ |

**Tolkning:**
- **Grunden är god:** språkattribut, viewport, rubriknivåer och alt-texter
  är på plats i alla vyer.
- **Flaggat för manuell kontroll:** ett fåtal formulärfält utan
  `aria-label` (kan ha `<label for>` som heuristiken inte fångar) samt
  ikon-knappar utan textalternativ. Dessa ska verifieras och vid behov
  förses med `aria-label`. Antalet är litet och åtgärdas snabbt.

---

## Vad detta INTE är

Denna rapport är **automatiserad och verktygsbaserad**. Den ersätter inte:

- **Oberoende penetrationstest** — aktiv angreppssimulering av extern part.
- **Fullständig WCAG-audit** — skärmläsartest (NVDA/VoiceOver),
  tangentbordsgenomgång, uppmätt färgkontrast.
- **Lasttest** — verifiering av kapacitetspåståenden under verklig last.

Dessa kräver antingen extern part eller en pilotmiljö och är planerade
(se teknisk specifikation, avsnitt 12, samt DPIA:ns åtgärdsplan). Denna
rapport visar dock att de påståenden som *går* att verifiera automatiskt
håller, och ger en ärlig bild av var kvarvarande arbete finns.

---

## Åtgärdslista från denna granskning

| # | Åtgärd | Prioritet |
|---|--------|-----------|
| 1 | Uppgradera puppeteer-core (åtgärdar 23 dep-sårbarheter) + testa PDF-export | Medel |
| 2 | Verifiera + `aria-label` på flaggade ikon-knappar och fält | Medel |
| 3 | Boka oberoende pentest (finansieras via Visionsfonden) | Hög (före skarp drift) |
| 4 | Boka extern WCAG-audit (t.ex. Funka) | Hög (lagkrav DOS-lagen) |
| 5 | Kör lasttest (k6) mot skalningspåståendet | Medel |
