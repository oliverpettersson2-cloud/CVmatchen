# Svar på följdfrågor + förslag om avgränsad pilot

Till: Isabella Seiger, Innovationsledare, Arbetsmarknadsförvaltningen Helsingborg
Från: Oliver Pettersson — SYV, grundare PathfinderAI (enskild firma)
Datum: 2026-07-07

---

> **Kort hälsning (för Teams):**
> Hej Isabella! Tack igen för att du tog dig tid och för de ärliga
> frågorna — de fick mig att skärpa både produkten och min egen förståelse
> för vad som återstår. Här kommer svaren du bad om, plus ett bifogat
> underlag om du eller ledningsgruppen vill gå på djupet. Jag har också
> vågat ställa en liten, öppen fråga i slutet — inget krav, bara en tanke
> jag gärna lämnar hos er att göra vad ni vill med. Ha en fin sommar så
> länge!

---

Tack för de tydliga frågorna. Nedan svarar jag kort på var och en. Mer
detaljerat underlag (teknisk specifikation, PUB- och DPIA-utkast,
källredovisning och en verifieringsrapport) finns bifogat.

---

## 1. Vad händer om AI:n skriver fel eller inte hittar alla jobb?

AI:n är **beslutsstöd, aldrig beslutsfattare**. All AI-genererad text
(profiltext, kompetenser, matchningsmotiveringar, intervjufeedback) är
förslag som deltagaren själv redigerar och godkänner — inget registreras
automatiskt, och handläggaren granskar.

Annonserna hämtas i realtid från **Platsbanken via Arbetsförmedlingens
öppna JobTech-API** — riktiga externa annonser. AI:n rangordnar och
motiverar, den uppfinner inga tjänster. Ingen plattform har "alla jobb",
och det lovar vi inte — CVmatchen är ett komplement till deltagarens och
handläggarens egna sökvägar.

Viktigast: **aktivitetsloggen är underlag, inte beslut.** Bedömningen av
aktivitetskravet görs alltid av handläggaren. En miss i systemet kan därför
aldrig ensam påverka någons försörjningsstöd.

## 2. Jäv — anställd + produktägare + eget företag

Situationen är öppet redovisad, och jag vill att den hanteras **formellt av
kommunen — inte av mig.** Bisysslan är byggd på fritiden och är **prövad och
godkänd av HR genom ett undertecknat beslut** (diarieförd enligt kommunens
rutin). Jag deltar inte i något beslut på kommunens sida som rör köp,
prissättning, utvärdering eller budget (förvaltningslagens jävsregler), och
upphandlingsenheten äger processen (LOU). Allt diarieförs. Att frågan tas
upp i ledningsgrupp är rätt ordning — beslutet ligger hos ett organ jag inte
är del av.

## 3. Informationssäkerhet & IT-arkitektur

Arkitekturen är byggd för EU-hostning: **Vercel (Stockholm)**, **Supabase
(Frankfurt, EU)** och **AWS Bedrock (Frankfurt, EU)** för AI. Data lämnar
inte EU/EES. I drift finns bl.a. multi-tenant-isolation med
serverside-verifiering, säkerhets-headers (CSP, HSTS), rate limiting,
PII-maskering i loggar och CSRF-skydd.

En informationsklassning enligt Helsingborgs egen modell har jag **inte**
gjort — den bör göras gemensamt, och jag ställer upp på säkerhetsgranskning
och riskanalys innan persondata hanteras. En bifogad verifieringsrapport
redovisar de kontroller som gått att göra hittills (bl.a. att inga nycklar
är hårdkodade) och — ärligt — vad som återstår för oberoende part (pentest,
WCAG-audit, lasttest).

## 4. GDPR & personuppgiftsbiträdesavtal

Kommunen är personuppgiftsansvarig, PathfinderAI är personuppgiftsbiträde.
Jag har tagit fram **utkast till PUB-avtal (art. 28)** och **DPIA (art. 35)**
som er dataskyddsombud slutför. Laglig grund: kommunens uppgift av allmänt
intresse (art. 6.1.e); grund för eventuella känsliga uppgifter fastställs av
DSO. AI-behandlingen sker via **AWS Bedrock i EU** — CV-data behandlas inom
EU/EES, lagras inte efter anropet och används inte för modellträning. Ingen
invånardata läggs in förrän PUB och DPIA är på plats.

## 5. Ägandeskap, förvaltning och kontinuitet

Källkoden ägs av PathfinderAI; kommunen äger sin egen data. PathfinderAI
drivs i dag som enskild firma — inför ett skarpt avtal avser jag registrera
aktiebolag, bland annat för att stärka ansvars- och kontinuitetsfrågan.
Eftersom detta är en liten leverantör bygger jag in skyddet i avtalet:
källkodsdeponering (escrow) med evig licens vid t.ex. konkurs, SLA,
exit-/kontinuitetsplan och full dataportabilitet i öppet format.

## 6. WCAG 2.1 AA — oberoende eller intern granskning?

Ärligt: WCAG 2.1 AA är implementerat och driftsatt och en
tillgänglighetsredogörelse är publicerad, men granskningen är hittills
**intern/självskattad**. Korrekt status är "delvis förenlig, internt
bedömd". Jag föreslår en **extern tillgänglighetsgranskning** (t.ex. Funka)
inför eller tidigt i en pilot och uppdaterar redogörelsen därefter.

---

## En möjlighet att undersöka — avgränsad pilot i Ungdoms-/Kompetensarena?

Jag vill ställa en öppen fråga, för er att ta ställning till i den ordning
ni finner lämplig:

> **Skulle det finnas en möjlighet att pröva CVmatchen i en avgränsad pilot
> inom Ungdomsarena eller Kompetensarena — så att det utvecklingsarbete som
> redan gjorts i verksamheten kan komma till nytta där?**

Tanken bakom frågan:

- Mycket av innehållet och flödena är byggda utifrån verkliga behov jag
  mött i arbetet med deltagare. En avgränsad arena skulle låta
  organisationen **fånga det värdet** i liten, kontrollerad skala vid sidan
  av det bredare initiativet — inte istället för det.
- En smal pilot gör det enklare att göra rätt: tydlig omfattning, PUB och
  DPIA på plats, och en enkel effektuppföljning som ger er **konkret
  beslutsunderlag** (deltar/slutför/upplevd nytta) inför framtida vägval.
- Ekonomin ska inte vara ett hinder: jag erbjuder det till **självkostnad**
  (enbart drift- och AI-kostnader, utan vinstpålägg) — eller så söker vi
  **finansiering via Visionsfonden** (utveckla CVmatchen för helsingborgare),
  så att arenans egen budget inte belastas.

Och jag vill vara ärlig med varför jag frågar, för det känns rätt att säga
det rakt ut: om en sådan pilot faller väl ut vore det något både
verksamheten — och du i din roll — skulle kunna vara stolta över att ha
vågat pröva. Skulle resultaten utebli har vi ändå förlorat väldigt lite: en
liten, avgränsad insats till självkostnad, med lärdom på köpet. Nedsidan är
liten, uppsidan kan bli fin, och oavsett hur det går har vi gjort något
klokt tillsammans. Det är i den andan jag lämnar frågan hos er.

Jag betonar att detta är just en **fråga**, inte ett erbjudande jag driver.
Om ni ser en möjlighet hanteras form, omfattning, jäv och avtal helt enligt
den ordning ni och jurist/DSO anvisar — jag står utanför beslutet och bidrar
bara med produkten och underlaget.

---

Tack för att du tog dig tid. Jag svarar gärna på följdfrågor och anpassar
underlaget efter vad ledningsgruppen behöver.

Vänliga hälsningar,
Oliver Pettersson
