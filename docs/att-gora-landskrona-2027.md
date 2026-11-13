# Att göra — pilot Landskrona 2027

**CVmatchen · lågtröskelprogram under aktivitetskravet**
Upprättad 2026-11-13 · Pilot: 16 platser, testkörning april 2027, start juni 2027

Den här listan styr vad som byggs. **Avstå-listan längst ned är inte en
önskelista som ratats — den är det som gör tidsplanen möjlig.** Varje punkt
där är något vi aktivt väljer bort, med skäl.

---

## ✅ Finns redan — återanvänds

Grunden är byggd. Det är därför ett halvår räcker.

| Del | Täcker i specen |
|---|---|
| Multi-tenant med radnivå-behörighet (RLS), deny-by-default | B1 |
| Fyra rollnivåer + `user_assignments` med `admin_id` | B2 (delvis) |
| `admin_activity_log` — loggar åtgärder | B3 (delvis) |
| **Microsoft EntraID med MFA för personal** | **D4 — BankID behövs inte** |
| Aktiv tidloggning (pausar vid dold flik och inaktivitet) | F1.4 ✔ klart |
| `ovning_progress` + `sprak_progress` | digital_aktivitet ✔ |
| Uppgifter med status (`pending/active/completed/expired`) | F4-mönstret |
| PDF-motor (`api/pdf.mjs`), verifierad i produktion | F7 |
| Resend för mejlutskick | F7, veckorapport |
| GDPR-radering med kaskad över 14 tabeller | D6 (delvis) |
| PUB- och DPIA-mallar, EU-drift verifierad | D1, D2, D3 |
| CV, jobbmatchning, intervjuträning, 105 moduler, AI-SYV | programinnehåll |
| Språkträning med uppläsning, fyra branscher | F5 (delvis) |

---

## 🔨 Ska byggas

### Januari 2027 — grunden
- [ ] Datamodell: `deltagare` utökas med spår, fas, start/slut, telefon, status
- [~] **Fält för sfi-kurs och betyg vid inskrivning.** Utan det går sambandet
      mellan vår skala och ett externt mått inte att räkna fram i efterhand.
      *Delvis klart 2026-11-13:* deltagaren uppger sfi-kurs frivilligt i
      språktestets intro (sparas med varje testresultat). **Kvar:** ett fält
      där personalen registrerar verifierad kurs och betyg vid inskrivning —
      självrapporterat räcker inte som valideringsunderlag.
- [ ] **Femte rollnivå: KBT/fysio** — ser bara egna bokningar och deltagarnamn
- [ ] **F1 Närvaro** — dagens pass, ett klick per deltagare, frånvarotyp + kommentar
- [ ] F1.6 Närvaro i procent per deltagare och vecka
- [x] Ändra inaktivitetspaus i tidloggningen från 90 sek till 5 min (F1.4) — *klart 2026-11-13*
- [ ] B3: logga även *läsning* av deltagardata, inte bara åtgärder
- [ ] B2: skärp filtreringen från enhet till enskild deltagare

### Februari 2027 — språk
- [x] Nytt grundområde *Allmänt på jobbet* med två nya övningstyper: **tider**
      (halv åtta = 07.30) och **regelord** (måste / får / får inte / behöver inte
      / borde) — *klart 2026-11-13*
- [ ] Innehållsvolym i branschområdena (väntar på besked om digital tid, se nedan)
- [x] **Eget språktest med egen skala** — *klart 2026-11-13* — fyra steg namngivna i vad deltagaren
      klarar på jobbet (Komma igång / Klara vardagen / Delta i arbetet /
      Klara sig själv). Varje uppgift taggas med avsedd nivå; svårighetsgraden
      kalibreras med sfi kurs C och D som riktmärke. Lagra både poäng och steg.
      Aldrig A1–B2 eller GERS — varken i gränssnittet eller i rapporten.

### Mars 2027 — schema och skattning
- [ ] **F2 Mitt schema** — `pass_mall`, `vecka_tema` (8-veckorscykel), `pass_instans`
- [ ] F2.6 Fasbyte Landa → Rusta → Välja och söka, slår igenom nästa vecka
- [ ] **F5 Funktionsskattning mot målyrke** — sju dimensioner, fyra svarsalternativ
- [ ] WHO-5 + självskattad hälsa (en fråga, jämförbar med nationell statistik)
- [ ] Beräkning: arbetsförmåga mot målyrket → matchar / delvis / inte
- [ ] Egen tabell för skattningsdata: striktare behörighet, egen gallringsklocka

### April 2027 — bokning, avstämning, testkörning
- [ ] **F3 Bokning** — bokningsbara tider, snabbokning av alla aktiva, ingen dubbelbokning
- [ ] F3.5 SMS-påminnelse dagen före kl. 16 — EU-leverantör, aldrig insatsens art
- [ ] **F4 Veckoavstämning** — tre fält, kopplad till bokningen, uppdaterar planen
- [ ] **F8 Avbrott** — fast orsakslista + fritext, slår igenom i statistiken
- [ ] F7 Veckorapport till handläggare, automatiskt måndag morgon
- [ ] **Testkörning med 3–5 personer**

### Maj 2027 — vy och rapport
- [ ] **F6 Handläggarvy** — närvarokurva, senaste avstämningar, progression, plan
- [ ] F7 Månadsrapport som PDF — aggregerad, inga personuppgifter
- [ ] Buggrättning

### Parallellt — juridik och affär
- [ ] PUB omskriven för Landskrona
- [ ] **DPIA omskriven från grunden för artikel 9** — nuvarande mall förutsätter
      att känsliga uppgifter undviks, inte att de systematiskt samlas in
- [ ] SMS-leverantör inom EU vald, biträdesavtal granskat
- [ ] Gallringstid fastställd med kommunens DSO
- [ ] BIP-kopplingen inskriven i specen

---

## 🚫 Avstå från — och varför

### Avstå i pilot 1

**GERS-/CEFR-nivåer på språktestet.** ✔ *Avgjort 2026-11-13*
Ersätts av en egen skala med egna nivånamn, kalibrerad mot sfi kurs C och D
som riktmärke för svårighetsgrad. Progression på egen skala är giltig per
konstruktion. Beteckningarna A1–B2 får inte förekomma någonstans — att
återinföra dem via nivånamnen vore samma påstående bakvägen.
*Kräver ändring av F5.1 i specen.*

**Stegräkning och kopplingar mot Google Fit eller Apple Health.** ✔ *Avgjort 2026-11-13*
Ny tredjepart, nytt samtycke, ny dataöverföring i konsekvensbedömningen —
för 16 deltagare. Självrapporterat *"hur många gånger rörde du på dig den
här veckan?"* ger samma kurva på en kvarts arbete.

**EQ-5D.**
Kräver registrering hos EuroQol och villkoren skiljer sig för kommersiell
användning. WHO-5 plus självskattad hälsa är fria och räcker.

**BankID för personal och handläggare.**
EntraID med MFA uppfyller redan kravet på stark inloggning. Sparar en
integration och en löpande kostnad.

**Kliniska mätvärden i CVmatchen.** ✔ *Avgjort 2026-11-13*
Gångtest och stoluppresningar stannar i fysioterapeutens egen dokumentation.
Appen bär bara *test genomfört* plus riktning. Samma princip som D8 redan
slår fast för KBT.

**Hamburgermeny — helt, i båda vyerna.** ✔ *Avgjort 2026-11-13*
Dold navigering bakom en abstrakt symbol motsäger F2.4 om låg tröskel.
Konsekvens: när menyn växer löses det med **sammanslagning i stället för
gömning** — schema, bokningar, närvaro och plan blir ett enda val, *Mitt
program*, med schemat som startvy. Då växer deltagarens meny med ett steg
och allt förblir synligt.

**Journalföring av KBT i CVmatchen.**
Redan avgjort i D8. Behandling enligt hälso- och sjukvårdslagen journalförs
av behandlaren i separat system.

**QR-incheckning, iCal-export, deltagaren bokar själv, arbetsgivarlogg,
export till kommunens system.**
Din egen "senare"-lista. Bekräftat: inget av det i pilot 1.

### Avstå affärsmässigt

**Treårsavtal.**
30 platser i tre år passerar 8,5 Mkr och tvingar fram annonserad
upphandling, där du konkurrerar öppet mot etablerade aktörer. **Två år med
option** håller sig under gränsen och kan beslutas av verksamheten.

**Att betrakta 15-platserspiloten som en affär.**
Brytpunkten ligger runt 20–21 platser. Femton platser går back cirka
35 000 kr i månaden. Kör den gärna — men budgetera förlusten, korta den till
tre månader, och förhandla in option på utökning till 30.

**Rusta och matcha som huvudspår.**
Krympande marknad, pressad ersättning, kunder som kan förlora sina avtal vid
nästa resultatöversyn. Max en förmiddag i veckan. Värdet ligger i den
externa effektmätningen, inte i intäkten.

### Avstå tills ett besked finns

**Anbud — tills anställningsfrågan är löst.**
Dialog och avsiktsförklaring: ja. Anbud: nej. Ett anbud är ett bindande
erbjudande, bisyssloprövningen mäter *risken* för förtroendeskada och inte
den inträffade skadan, och din anställning kan tvinga kommunen att utesluta
anbudet på likabehandlingsgrund. Fråga HR först.

**Innehållsvolym i språkmodulen — tills en kommun sagt att loggad digital
tid räknas som aktivitet.**
Upp till sexton av fyrtio timmar i programupplägget är självgående
skärmtid. Säger kommunen nej måste hela timfördelningen byggas om, och då
är innehållsproduktionen bortkastad. Ställ frågan först, bygg sedan.

---

## Nästa handling

1. **Fråga HR** om anbud får lämnas under pågående anställning
2. **Ring kommunerna** — digital tid räknas? klassificering enligt LOU? budget per person?
3. Bekräfta om **F5.1 ska skrivas om** till progression i stället för GERS-nivå
4. Hämta Landskronas verkliga tal från **Kolada** och lägg in i kalkylen
