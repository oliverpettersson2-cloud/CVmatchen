# Testguide — pilotfunktionerna

**CVmatchen** · 2026-11-17 · Tid: cirka 45 minuter

Testa i den här ordningen. Varje steg bygger på det förra. Skriv ner
avvikelser enligt mallen längst ned — de blir underlaget för felsökningen.

---

## Förberedelser (5 min)

Du behöver två skärmar:

| | Adress | Inloggning |
|---|---|---|
| **Dator** — personalens vy | `www.cvmatchen.com/admin` | Microsoft, ditt superadmin-konto |
| **Telefon** — deltagarens vy | `www.cvmatchen.com` | Mejlkod till `oliver.pettersson2@gmail.com` |

Använd **cvmatchen.com**, aldrig en `.vercel.app`-adress — de kräver
Vercel-inloggning.

Ladda om båda sidorna med tömd cache innan du börjar (dator: Ctrl+Shift+R,
telefon: stäng fliken och öppna igen), så att du får senaste versionen.

**Testverksamhet:** kommunen *Övrigt*, enheten *Allmänna användare*. Där
ligger ditt testkonto.

---

## Test 1 — Programuppgifter (dator)

1. Deltagare → öppna **ditt testkonto** → fliken **Program**.
2. Sätt: Programstatus **Aktiv**, Spår **Ordinarie**, Fas **Landa**,
   Startdatum **idag**.
3. Sätt Sfi-kurs **Kurs C**, Betyg **Kursen pågår**. Tryck **Spara**.

**Förväntat:** "Sparat (6 ändringar)". Under *Ändringar* syns sex rader med
ditt namn. Under sfi står *Kontrollerad [datum]*.

> Står det *"Programuppgifter kan bara anges för registrerade deltagare"*
> visas testkontot som en demo-post i stället för den riktiga. Notera det
> och gå vidare — det är en känd misstänkt felkälla.

---

## Test 2 — Temacykel (dator)

1. Vänstermenyn → **Närvaro**.
2. Verksamhet: **Övrigt**, enhet **Allmänna användare**.
3. **Veckoschema** → ange **förra måndagens datum** som start → **Spara start**.
4. Klicka på kortet för **vecka 2** → fyll i Tema *Kommunikation*, Utflykt
   *Biblioteket*, Intern anteckning *Testanteckning*, kryssa **Testvecka** → Spara.

**Förväntat:** *"Nu: vecka 2"*, vecka 2-kortet är grönt och visar temat och
*Testvecka*.

**Prova också:** ange en tisdag som start → meddelande *"Cykeln måste börja
på en måndag."*

---

## Test 3 — Veckoschema i serier (dator)

1. **+ Ny serie**: *Svenska i grupp*, typ Lokal, **mån–fre**, 09:00–11:00,
   från idag, varje vecka, fas **Landa**. Spara.
2. **+ Ny serie**: *Promenad*, typ Ute, **bara tisdag**, 13:00–14:00.

**Förväntat:** veckorutnätet visar Svenska i grupp alla vardagar och
Promenad på tisdag.

**Prova också:** en serie med sluttid före starttid → tydligt felmeddelande,
inte "HTTP 400".

---

## Test 4 — Registrera närvaro (dator eller surfplatta)

1. **Dagens pass**. Överst syns cykelveckan och temat.
2. **Registrera närvaro** på *Svenska i grupp*.
3. Alla är förvalda som *Närvarande*. Ändra ditt testkonto till **Sen**
   och skriv kommentaren *Bussen*. **Spara närvaro**.

**Förväntat:** *"Sparat för 1 deltagare"*. Tillbaka i Dagens pass:
*"Registrerad · 1 av 1 närvarande"* (sen räknas som närvaro).

**Ta tid** om du registrerar för flera deltagare — målet i specen är en
hel grupp (nu 20 deltagare) på under 2 minuter.

---

## Test 5 — Ändra med omfång (dator)

Gör på ett **kommande** datum, inte idag.

| Gör | Förväntat |
|---|---|
| *Svenska i grupp* på en måndag → Ändra pass → 10:00–12:00 → **Bara det här passet** | Bara den måndagen ändras |
| Samma pass → 08:30–10:30 → **Alla måndagar i serien från och med** | Den måndagen och alla efter ändras; tisdag–fredag oförändrade |
| *Promenad* → **Ställ in det här passet**, anledning *Regn* | Passet markeras Inställt · Regn |
| Valfri dag → **Ställ in alla pass den här dagen** | Alla pass den dagen inställda |
| *Promenad* → **Ta bort tisdagar från och med** | Promenaden försvinner från det datumet; tidigare finns kvar |

**Kontrollera också:** gå tillbaka till **idag**. Passet du registrerade
närvaro på i test 4 ska vara oförändrat — registrerade pass skrivs aldrig om.

---

## Test 6 — Deltagarens vy (telefon)

1. Öppna appen → startsidan **Hej**.
2. Överst: **dagens pass**. Tryck 🔊 — dagens schema läses upp.
3. **Se hela veckan →**

**Förväntat:**
- *"Du är i fasen Landa."*
- Rutan **Den här veckan** med tema och utflykt (är det cykelvecka 2) och
  påminnelse om testvecka. **Den interna anteckningen ska INTE synas.**
- Dagens pass har grön ram; passet från test 4 visar *⏱ Du kom sent*.
- Inställda pass överstrukna med anledning.
- ‹ › byter vecka.

---

## Test 7 — Fasbyte (dator → telefon)

1. Dator → Program → Fas **Rusta** → Spara.
2. **Förväntat:** *"Byter till Rusta från [nästa måndag]."* Fältet visar Rusta.
3. Spara något annat i fliken (t.ex. ändra sfi-betyg). **Det planerade
   bytet ska ligga kvar med samma datum.**
4. Telefon → Mitt schema → *"Från måndag … går du vidare till Rusta."*
5. Dator → välj **Landa** igen → Spara → bytet ska vara avbrutet.

---

## Test 8 — Språkträning och språktest (telefon)

1. **Träna → Språkträning** → *Allmänt på jobbet* → **Klockan och tider**.
   Svara fel på *halv åtta* med flit.
   **Förväntat:** förklaring om att halv åtta är 07.30.
2. **Testa din svenska** → välj sfi-kurs → gör testet.
   **Förväntat:** lyssnafrågor läses upp, övriga är tysta; resultat med
   steg, poäng och *Träna mest på*.

---

## Test 9 — Uppföljning i personalens vy (dator)

1. Deltagare-listan → kolumnen **Språk**: *Steg X · NN p*.
2. Testkontot → **Program** → *Närvaro per vecka*: procent och timmar.

---

## Test 10 — Det som INTE ska synas

| Kontroll | Förväntat |
|---|---|
| Logga in på telefonen med ett **annat** konto som inte är Aktiv i program | Inget schemakort på Hej, appen ser ut som förut |
| Två konton på samma telefon efter varandra | Det andra kontot ser aldrig det förstas schema |
| Deltagarens veckovy | Ingen intern anteckning, ingen "måndag eftermiddag" |

---

## Rapportera fel — mall

För varje avvikelse:

```
Test nr och steg:
Skärm: dator / telefon (modell + webbläsare)
Vad jag gjorde:
Vad jag förväntade mig:
Vad som hände (exakt text i ev. felmeddelande):
Klockslag:
Skärmdump: ja/nej
```

Klockslaget gör att felet kan hittas i serverloggen.

---

## Efter testet

Testdata ligger i verksamheten *Övrigt*. Avsluta serierna i Veckoschema och
sätt testkontots programstatus till *Inte i program* — eller be om att
testdatan rensas.
