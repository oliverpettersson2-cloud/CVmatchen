# Lägesrapport — CVmatchen inför pilot 2027

**2026-11-17** · Pilot enligt kravspec: 16 platser, testkörning april 2027, start juni 2027

---

## Kortversion

**Produkten ligger före tidsplanen.** Närvaro (planerad till januari) och
schema (planerat till mars) är byggda redan i november, liksom språktestet
och deltagarens egen schemavy. Två av kravspecens åtta funktionsområden är
klara och ett tredje är halvklart.

**Det som avgör om piloten blir av är inte koden.** De största riskerna
ligger utanför produkten: anställningen och bisysslan, om kommunen godtar
loggad digital tid som aktivitet, konsekvensbedömningen för hälsodata, och
att det ännu inte finns någon beställare med avtal.

**Ekonomin behöver ett beslut.** Kravspecen räknar med 16 platser.
Kalkylen har sin brytpunkt vid 20–21 platser. Med 16 platser i helpaketet
går verksamheten back cirka 40 000 kr i månaden med nuvarande bemanning.

**Nästa steg är felsökning.** Allt är testat i delar, men ingenting är ännu
testat från början till slut mot den riktiga servern. Det görs med
testguiden.

---

## 1. Vad som är byggt

### Sedan kravspecen (13–17 november)

| Funktion | Vad den gör | Kravspec |
|---|---|---|
| **Språkträning** | Yrkessvenska för vård, lager, service och bygg, samt grundområdet *Allmänt på jobbet* med tider (halv åtta = 07.30) och regelord (får inte / behöver inte). Allt kan läsas upp. | F5 (språk) |
| **Språktest** | Egen skala i fyra steg, inga GERS-nivåer. 28 frågor i banken, stratifierad dragning, adaptivt stopp. Lyssnafrågor upplästa, läsfrågor tysta. | F5.1 |
| **Aktiv tidloggning** | Mäter aktiv tid, pausar vid dold flik och efter 5 minuters inaktivitet. | F1.4 |
| **Programuppgifter** | Programstatus, spår, fas, start och slut, kontrollerad sfi-kurs och betyg. Ändringslogg med vem och när. | Datamodell |
| **Veckoschema i serier** | Ett pass läggs in en gång för flera veckodagar, med giltighetstid och varje eller varannan vecka. Ändringar med valt omfång: bara det här passet, alla [måndagar] framåt, eller hela serien framåt. | F2.1, F2.2, F2.5 |
| **Temacykel** | Åtta veckor med tema, utflykt, ordtema, hälsofokus, modul och testvecka. Räknas fram från en startmåndag. KBT-temat syns bara för personal. | F2.1 |
| **Närvaro** | Närvarande förvalt, fyra statusar, kommentar vid avvikelse. Bara deltagare som hör till passet listas. | F1.1–F1.3 |
| **Närvaro per vecka** | Procent och timmar, räknat på registrerade pass. | F1.6 |
| **Deltagarens schema** | Dagens pass på startsidan, veckan, tema, egen närvaro, uppläsning. Bara för deltagare i program. | F2.3, F1.5 |
| **Fasbyte** | Gäller från nästa måndag. Ny deltagare får första fasen direkt. | F2.6 |
| **Uppföljning i personalens vy** | Kolumn Språk (steg, poäng, riktning). Fliken Program med närvaro och ändringar. | F6 (delvis) |

### Under hösten i övrigt

- **Säljunderlag:** plan för fem småkommuner, plan för Rusta och matcha,
  Perstorp-paket (erbjudande, PUB, DPIA, kontaktmanus), kalkyl för
  Landskrona.
- **Säkerhet:** `.gitignore` tillagd, historiken genomsökt efter nycklar
  (inga hittades), sårbarhetsbacklog och mötesanteckningar tagna ur repot.
- **Drift:** Vercel Analytics, cookiefri, med dataskyddsunderlagen
  uppdaterade.
- **Inloggning:** felet "token expired or is invalid" för befintliga konton
  rättat.

### Fel som hittades och rättades på vägen

| Fel | Följd om det inte rättats |
|---|---|
| Rollen enhetsadmin nekades av databasen | Varje inbjudan av en enhetsadmin misslyckades |
| `post()` kastade bort serverns felmeddelanden | Personalen såg "HTTP 400" i stället för förklaringen |
| Språktestets dragning kunde sakna ett område helt | Delresultat gick inte att jämföra mellan testtillfällen |
| Uppläsningen kraschade i vissa Android-webbvyer | Modulen slutade fungera på enklare telefoner |
| Ett pass kunde registreras flera gånger | Uppblåst statistik (33 pass i stället för 1) |
| Formuläret i Program avbröt planerade fasbyten | Fasbytet försvann när något annat sparades |
| Deltagarvyns cache var inte knuten till inloggningen | Två som delar telefon kunde se varandras schema |
| Detaljvyn ritades om var 20:e sekund | Personalens osparade inmatning hade raderats |

---

## 2. Hur det är testat — och vad som inte är det

**Testat:**

- **Logik var för sig:** datumräkning (sommartid, årsskifte, varannan
  vecka), cykelveckor, fasbyte i fem fall, språktestets poängsättning i fem
  scenarier med kända svar.
- **Databasen:** regler och dubblettskydd i transaktioner som rullades
  tillbaka. Inga testdata ligger kvar.
- **Gränssnitten:** körda i webbläsare utan skärm mot en låtsasbackend som
  spelar in varje anrop, så att det som skickas till servern är kontrollerat.
- **Dataskydd:** att KBT-temat inte når deltagaren, testat direkt på
  backendfunktionen.

**Inte testat:**

- **Hela kedjan mot den riktiga servern.** Miljön jag arbetar i når inte
  cvmatchen.com. Frågorna mot databasen (filter, kopplingar mellan tabeller,
  uppdatera-eller-skapa) körs alltså på riktigt först när du testar. Det är
  den största enskilda risken just nu.
- **Riktiga telefoner:** Safari på iPhone, äldre Android, och vilka svenska
  röster som finns för uppläsning.
- **Specens krav på 16 deltagare på under två minuter** — kräver en riktig
  surfplatta i en riktig lokal.

Testguiden (`docs/testguide-pilot.md`) går igenom allt i tio steg på
ungefär 45 minuter.

---

## 3. Vad som återstår i produkten

Storlek: **S** en dag eller mindre · **M** några dagar · **L** en vecka eller mer.

| Del | Storlek | Kravspec | Beroende |
|---|---|---|---|
| **Avbrott** med orsakslista | S | F8 | — |
| **Veckoavstämning**, tre fält | M | F4 | Enklast efter bokning |
| **Bokning** med lediga tider, snabbokning, ingen dubbelbokning | L | F3 | — |
| **SMS-påminnelse** dagen före | M | F3.5 | SMS-leverantör och biträdesavtal |
| **Roll för KBT och fysioterapeut** | S | Roller | Bokning |
| **Hälsoskattning:** funktion mot målyrke, WHO-5, självskattad hälsa | M | F5.2 | Egen tabell, DPIA |
| **Veckorapport** till handläggare, måndag morgon | M | F7 | Avstämning, avbrott |
| **Handläggarvy** för kommunen + läsbehörig roll | L | F6, B2 | — |
| **Månadsrapport** som PDF, aggregerad | M | F7 | Avbrott, skattning |
| **Logga läsning** av deltagardata | S | B3 | — |
| **Innehållsvolym** i språkträningen | M | — | Besked om digital tid |
| **Tillgänglighetsgranskning** WCAG 2.1 AA, större text | M | Icke-funktionellt | — |
| **Kontroll av driftkostnad** inklusive SMS | S | Max 3 000 kr/mån | — |

Ordningen som ger mest: **avbrott först** (litet och behövs för all
statistik), sedan **bokning och avstämning**, sist **rapporterna** som
bygger på allt det andra.

---

## 4. Vad som krävs för att vara startklar — utanför koden

Det här är den kritiska vägen. Varje punkt kan stoppa piloten oavsett hur
bra produkten är.

### Avgörande, nu

1. **Anställningen.** Fråga HR om anbud får lämnas medan du är anställd i
   kommunal arbetsmarknadsförvaltning. Svaret avgör tidpunkten för allt
   annat. Undersök också tjänstledighet för att bedriva näringsverksamhet.
2. **Kommunens besked om digital tid.** Upp till sexton av fyrtio timmar i
   programmet är självgående skärmtid. Säger kommunen nej måste programmet
   göras om.
3. **En beställare.** Avsiktsförklaring från Landskrona eller en annan
   kommun, och besked om hur tjänsten klassas enligt LOU.

### Ekonomi

4. **Pris efter Helsingborgs siffror.** Folkuniversitetet 400 000 kr och
   Granter 300 000 kr per start om 20 deltagare, cirka 6 700 och 5 000 kr
   per deltagare och månad om en start är tre månader. Granters pris är
   sannolikt subventionerat av att de samtidigt fick starta Rusta och
   matcha. Konkurrera inte med det priset; sälj den grupp de inte tar.
5. **Antal platser.** 16 platser enligt specen ger förlust med nuvarande
   bemanning. Välj: fler platser (minst 21), lägre fasta kostnader, eller
   en budgeterad förlust under piloten med option på utökning.
6. **Rörelsekapital** för cirka två till tre månaders drift innan första
   betalningen.

### Juridik och dataskydd

7. **DPIA omskriven för artikel 9.** Nuvarande mall förutsätter att
   känsliga uppgifter undviks. Hälsoskattningen samlar in dem.
8. **PUB för den aktuella kommunen**, signerat av båda parter.
9. **Dataskyddsombudets beslut** om laglig grund enligt artikel 9.2 och
   gallringstid.
10. **SMS-leverantör inom EU** med granskat biträdesavtal.
11. **Om KBT-stödet:** har personen legitimation som psykolog eller
    psykoterapeut? Annars heter det KBT-baserad stresshantering, och
    behandling journalförs aldrig i CVmatchen.

### Organisation och bolag

12. **Aktiebolag.** Helsingborgs ledningsgrupp lyfte enskild firma som skäl
    att avstå. Samma invändning kommer överallt.
13. **Exitplan i avtalstext:** källkodsdeponering, dataexport, vad som
    händer vid sjukdom.
14. **Bemanning:** coach rekryterad, ersättare utsedd om någon blir borta.
15. **Lokal:** avsiktsförklaring med hyresvärd, inget långt hyresavtal än.
16. **Försäkring** för verksamheten.

### Metod och innehåll

17. **Manualer** för kartläggning, hälsa och svenska.
18. **En sfi-lärare granskar språktestet** och bedömer ungefär vilken nivå
    stegen motsvarar. Billigt och ger ett namn att hänvisa till.
19. **BIP-indikatorerna** inskrivna i metoden — samordningsförbunden i
    regionen arbetar redan efter dem.

### Säkerhet och drift

20. **Rotera de två flaggade nycklarna** i Vercel (`SUPABASE_SERVICE_KEY`
    och `ANTHROPIC_API_KEY`).
21. **Bekräfta att GitHub-repot är privat.** Det har varit publikt sedan
    mars och innehåller säljplanerna.
22. **Prova att återställa en säkerhetskopia** av databasen innan det
    finns riktiga deltagare.

---

## 5. Ändringar som behöver göras i kravspecen

| Punkt | Ändring |
|---|---|
| F5.1 | Egen skala i fyra steg i stället för GERS A1–B2 |
| F5.2, F5.4 | Funktionsförmåga mot målyrket; lagra riktning, inte kliniska mätvärden |
| D4 | Microsoft EntraID med MFA för personal i stället för BankID |
| Omfattning | 16 platser är under brytpunkten — antingen fler platser eller budgeterad förlust |
| F2 | Schemat i serier med omfångsval (utökning av specen) |

---

## 6. Rekommenderad ordning till jul

1. **Kör testguiden** och skicka avvikelserna → felsökning.
2. **HR-samtalet.**
3. **Tre samtal till kommuner:** digital tid, klassning enligt LOU, budget.
4. **Rotera nycklarna och bekräfta att repot är privat** — en kvart.
5. **Påbörja AB-registreringen.**

I januari, när felsökningen är klar: **avbrott** och **veckoavstämning**,
sedan **bokning** när SMS-leverantören är vald.
