/* ============================================================
   CVmatchen — Språkträning (yrkessvenska)
   ------------------------------------------------------------
   Fristående modul, samma mönster som intervju.js:
   bygger sitt eget UI i #trainView-sprak, exponerar bara
   window.sprInit() och window.sprCleanup().

   FAS 1 — medvetet INGA nivåpåståenden (GERS/CEFR).
   Nivåbedömning kräver validerade testuppgifter och jämförelse
   mot deltagarnas faktiska sfi-betyg. Den byggs när det finns
   deltagare att validera mot, inte före.
   ============================================================ */
(function () {
  'use strict';

  function $(sel, root) { return (root || document).querySelector(sel); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function shuffle(a) {
    var r = a.slice();
    for (var i = r.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = r[i]; r[i] = r[j]; r[j] = t;
    }
    return r;
  }

  // ── Innehåll ────────────────────────────────────────────────
  // Yrkessvenska för de branscher programmet riktar sig mot.
  // Ord: { o: ordet, b: betydelse, e: exempelmening }
  // Fraser: { f: frasen, n: när man säger den }
  var CONTENT = {
    // Grunden för alla jobb. Här finns de språkliga hindren som inte är
    // branschord: tider (halv åtta = 07.30) och regelord (får inte /
    // behöver inte) — små ord där ett missförstånd kostar en arbetsdag
    // eller blir en säkerhetsrisk.
    allmant: {
      namn: 'Allmänt på jobbet',
      ikon: '🧭',
      grund: true,
      ord: [
        { o: 'arbetstid', b: 'De tider då du ska arbeta', e: 'Min arbetstid är sju till fyra.' },
        { o: 'rast', b: 'En paus under arbetsdagen', e: 'Vi har rast klockan tio.' },
        { o: 'sjukanmäla sig', b: 'Säga till jobbet att man är sjuk', e: 'Du ska sjukanmäla dig innan passet börjar.' },
        { o: 'stämpla in', b: 'Registrera att man har börjat arbeta', e: 'Glöm inte att stämpla in när du kommer.' },
        { o: 'schema', b: 'En plan över när du ska arbeta', e: 'Schemat för nästa vecka finns i appen.' },
        { o: 'ledig', b: 'När man inte arbetar den dagen', e: 'Jag är ledig på onsdag.' },
        { o: 'lönebesked', b: 'Ett papper som visar hur mycket lön du får', e: 'Lönebeskedet kommer den 25:e.' },
        { o: 'semester', b: 'Ledighet då du ändå får lön', e: 'Jag har semester i juli.' },
        { o: 'övertid', b: 'Arbete utöver din vanliga arbetstid', e: 'Kan du jobba övertid i kväll?' },
        { o: 'provanställning', b: 'En första anställning där båda prövar om det passar', e: 'Provanställningen är sex månader.' },
        { o: 'introduktion', b: 'Tiden när du lär dig jobbet i början', e: 'Första veckan har du introduktion.' },
        { o: 'skyddsombud', b: 'En person som bevakar säkerheten på jobbet', e: 'Prata med skyddsombudet om du ser en risk.' },
        { o: 'kollega', b: 'Någon som du arbetar tillsammans med', e: 'Min kollega visar mig hur maskinen fungerar.' },
        { o: 'läkarintyg', b: 'Ett papper från läkare om att du är sjuk', e: 'Efter sju dagar behöver du ett läkarintyg.' }
      ],
      fraser: [
        { f: 'Jag är sjuk och kan inte komma idag.', n: 'När du sjukanmäler dig' },
        { f: 'Jag blir tio minuter sen, bussen är försenad.', n: 'När du kommer att vara sen' },
        { f: 'Kan du säga det lite långsammare?', n: 'När någon pratar för fort' },
        { f: 'Vad betyder det ordet?', n: 'När du inte förstår ett ord' },
        { f: 'Jag är klar. Vad ska jag göra nu?', n: 'När du är färdig med en uppgift' },
        { f: 'Får jag gå på rast nu?', n: 'Innan du tar rast' },
        { f: 'Kan jag byta pass med någon?', n: 'När du inte kan jobba en dag' },
        { f: 'Tack för hjälpen!', n: 'När någon har hjälpt dig' }
      ],
      texter: [
        {
          titel: 'Att sjukanmäla sig',
          text: 'Om du blir sjuk ska du ringa din chef så tidigt som möjligt, helst innan ditt pass börjar. Säg vem du är, att du är sjuk och hur länge du tror att det blir. Du behöver inte berätta vad du är sjuk i. Är du sjuk i mer än sju dagar behöver du ett läkarintyg.',
          fragor: [
            { q: 'När ska du helst ringa?', alt: ['Innan passet börjar', 'Efter lunch', 'Nästa dag'], ratt: 0 },
            { q: 'Måste du berätta vad du är sjuk i?', alt: ['Ja, alltid', 'Nej, det behöver du inte', 'Bara till kollegorna'], ratt: 1 },
            { q: 'När behöver du ett läkarintyg?', alt: ['Första dagen', 'Aldrig', 'Om du är sjuk i mer än sju dagar'], ratt: 2 }
          ]
        },
        {
          titel: 'Att byta pass',
          text: 'Ditt schema kommer två veckor i förväg. Vill du byta ett pass ska du först fråga en kollega som kan ta det. Sedan måste chefen godkänna bytet. Bytet gäller inte förrän chefen har sagt ja.',
          fragor: [
            { q: 'Hur långt i förväg kommer schemat?', alt: ['En dag', 'Två veckor', 'En månad'], ratt: 1 },
            { q: 'Vem måste godkänna ett byte?', alt: ['Chefen', 'Kollegan', 'Ingen'], ratt: 0 },
            { q: 'När gäller bytet?', alt: ['Direkt när kollegan sagt ja', 'Nästa månad', 'När chefen har sagt ja'], ratt: 2 }
          ]
        }
      ],
      // Tider: s = det som läses upp, alt[0] = rätt svar (blandas vid visning)
      tid: [
        { s: 'klockan åtta', alt: ['08.00', '07.00', '09.00'], f: 'På jobbet säger man ofta bara siffran. Klockan åtta på morgonen skrivs 08.00.' },
        { s: 'halv åtta', alt: ['07.30', '08.30', '08.00'], f: 'Halv åtta betyder en halvtimme KVAR till åtta, alltså 07.30. Många tror 08.30 — då kommer man en timme för sent.' },
        { s: 'kvart över nio', alt: ['09.15', '08.45', '09.45'], f: 'En kvart är 15 minuter. Över betyder efter. Kvart över nio blir 09.15.' },
        { s: 'kvart i tolv', alt: ['11.45', '12.15', '12.45'], f: 'Kvart i betyder 15 minuter innan. Kvart i tolv blir 11.45.' },
        { s: 'tjugo över sju', alt: ['07.20', '06.40', '07.40'], f: 'Tjugo över sju är tjugo minuter efter sju: 07.20.' },
        { s: 'tio i fyra', alt: ['15.50', '16.10', '14.50'], f: 'Tio i fyra är tio minuter innan fyra. På eftermiddagen blir det 15.50.' },
        { s: 'halv tre', alt: ['14.30', '15.30', '13.30'], f: 'Halv tre är en halvtimme kvar till tre: 14.30 på eftermiddagen.' },
        { s: 'fem i halv tre', alt: ['14.25', '14.35', '15.25'], f: 'Halv tre är 14.30. Fem i halv tre är fem minuter innan: 14.25. Den här är svår.' },
        { s: 'tio över halv fyra', alt: ['15.40', '16.10', '15.20'], f: 'Halv fyra är 15.30. Tio minuter efter det blir 15.40.' }
      ],
      // Regelord: m = meningen, alt[0] = rätt svar, f = förklaring
      regler: [
        { m: 'Du måste tvätta händerna.', alt: ['Det är ett krav', 'Det är frivilligt', 'Det är förbjudet'], f: 'Måste betyder att du inte har något val.' },
        { m: 'Du får ta rast klockan tolv.', alt: ['Det är tillåtet', 'Det är förbjudet', 'Det är ett krav'], f: 'Får betyder att det är tillåtet.' },
        { m: 'Du får inte använda mobilen vid maskinen.', alt: ['Det är förbjudet', 'Det är tillåtet', 'Det är ett råd'], f: 'Får inte betyder förbjudet. Här handlar det om säkerhet.' },
        { m: 'Du behöver inte stämpla in på lördagar.', alt: ['Det är inte nödvändigt', 'Det är förbjudet', 'Det är ett krav'], f: 'Behöver inte betyder att du slipper — men du får om du vill. Det är INTE samma sak som får inte.' },
        { m: 'Du ska lämna nyckeln i receptionen.', alt: ['Det är en instruktion', 'Det är ett förslag', 'Det är förbjudet'], f: 'Ska betyder att det är så det ska göras.' },
        { m: 'Du kan gå hem tidigare idag.', alt: ['Du har möjlighet att gå hem', 'Du måste gå hem', 'Du får inte gå hem'], f: 'Kan betyder här att du har möjlighet. Du väljer själv.' },
        { m: 'Du borde prata med din chef om det.', alt: ['Det är ett råd', 'Det är ett krav', 'Det är förbjudet'], f: 'Borde betyder att det är klokt. Det är ett råd, inte ett krav.' },
        { m: 'Det är inte tillåtet att parkera här.', alt: ['Det är förbjudet', 'Det är tillåtet', 'Det är ett råd'], f: 'Inte tillåtet betyder samma sak som förbjudet.' }
      ]
    },

    vard: {
      namn: 'Vård & omsorg',
      ikon: '🩺',
      ord: [
        { o: 'brukare', b: 'Person som får hjälp av omsorgen', e: 'Jag hjälper tre brukare på förmiddagen.' },
        { o: 'förflyttning', b: 'Att hjälpa någon byta plats eller ställning', e: 'Vi gör förflyttningen tillsammans, aldrig ensam.' },
        { o: 'dokumentation', b: 'Att skriva ned vad som gjorts', e: 'Dokumentationen görs i slutet av passet.' },
        { o: 'avvikelse', b: 'När något inte blev som det skulle', e: 'Jag skrev en avvikelse efter fallet.' },
        { o: 'delegering', b: 'Tillåtelse att utföra en uppgift från sjuksköterska', e: 'Jag har delegering för att ge medicin.' },
        { o: 'hygienrutin', b: 'Regler för att hindra smitta', e: 'Hygienrutinen gäller före varje besök.' },
        { o: 'bemötande', b: 'Hur du talar med och behandlar någon', e: 'Ett bra bemötande skapar trygghet.' },
        { o: 'sekretess', b: 'Tystnadsplikt om det du får veta', e: 'Sekretessen gäller även efter arbetspasset.' },
        { o: 'rapportering', b: 'Att lämna över information till nästa pass', e: 'Rapporteringen sker klockan 14.' },
        { o: 'vårdplan', b: 'Skriftlig plan för en persons vård', e: 'Det står i hennes vårdplan.' },
        { o: 'trycksår', b: 'Sår som uppstår av att ligga eller sitta still', e: 'Vi vänder henne för att undvika trycksår.' },
        { o: 'anhörig', b: 'Nära släkting till brukaren', e: 'Anhöriga ringer ofta på eftermiddagen.' },
        { o: 'larm', b: 'Signal när någon behöver hjälp', e: 'Larmet gick klockan tre i natt.' },
        { o: 'skyddsutrustning', b: 'Handskar, förkläde och munskydd', e: 'Ta på skyddsutrustning innan du går in.' }
      ],
      fraser: [
        { f: 'Hej, jag heter … och jag arbetar här idag.', n: 'När du möter en brukare första gången' },
        { f: 'Är det okej om jag hjälper dig med detta?', n: 'Innan du börjar hjälpa någon' },
        { f: 'Kan du säga till om det gör ont?', n: 'Vid förflyttning eller omvårdnad' },
        { f: 'Jag förstår inte riktigt, kan du förklara en gång till?', n: 'När du är osäker på en instruktion' },
        { f: 'Jag behöver fråga min kollega om det här.', n: 'När något ligger utanför din delegering' },
        { f: 'Jag skriver en avvikelse så att det blir dokumenterat.', n: 'När något gått fel' },
        { f: 'Vill du ha hjälp nu eller om en liten stund?', n: 'För att ge brukaren inflytande' },
        { f: 'Jag kommer tillbaka om tjugo minuter.', n: 'När du lämnar ett rum' }
      ],
      texter: [
        {
          titel: 'Ett arbetspass på morgonen',
          text: 'Passet börjar klockan sju. Först läser jag rapporten från natten. Där står det vad som hänt och om någon mått dåligt. Sedan går jag till den första brukaren. Jag knackar på dörren och säger mitt namn innan jag går in. Vi gör morgonomvårdnaden tillsammans, i den takt hon orkar. Innan jag går frågar jag om hon vill ha något mer. I slutet av passet dokumenterar jag vad jag gjort.',
          fragor: [
            { q: 'Vad gör personen allra först på passet?', alt: ['Läser rapporten från natten', 'Ringer anhöriga', 'Skriver dokumentation'], ratt: 0 },
            { q: 'Vad gör hon innan hon går in i rummet?', alt: ['Tar på sig skyddsutrustning', 'Knackar och säger sitt namn', 'Ringer sjuksköterskan'], ratt: 1 },
            { q: 'När sker dokumentationen?', alt: ['Direkt på morgonen', 'Mitt i passet', 'I slutet av passet'], ratt: 2 }
          ]
        }
      ]
    },

    lager: {
      namn: 'Lager & logistik',
      ikon: '📦',
      ord: [
        { o: 'plocklista', b: 'Lista över varor du ska hämta', e: 'Plocklistan finns i handdatorn.' },
        { o: 'pall', b: 'Träunderlag som varor staplas på', e: 'Ställ pallen vid port tre.' },
        { o: 'truck', b: 'Fordon som lyfter och flyttar gods', e: 'Du behöver truckkort för att köra truck.' },
        { o: 'godsmottagning', b: 'Där varor kommer in till lagret', e: 'Leveransen står kvar i godsmottagningen.' },
        { o: 'inventering', b: 'Att räkna vad som finns i lager', e: 'Inventeringen görs en gång i månaden.' },
        { o: 'orderplock', b: 'Att plocka ihop en kunds beställning', e: 'Jag jobbar med orderplock på eftermiddagen.' },
        { o: 'streckkod', b: 'Randig kod som skannas', e: 'Skanna streckkoden innan du packar.' },
        { o: 'emballage', b: 'Material som skyddar varan', e: 'Vi återvinner allt emballage.' },
        { o: 'skyddssko', b: 'Sko med stålhätta', e: 'Skyddsskor är obligatoriska på lagret.' },
        { o: 'lastkaj', b: 'Plats där lastbilar lastar av', e: 'Bilen backar in mot lastkajen.' },
        { o: 'reklamation', b: 'Klagomål på en vara som är fel', e: 'Kunden har gjort en reklamation.' },
        { o: 'saldo', b: 'Antal som finns kvar i systemet', e: 'Saldot stämmer inte med hyllan.' },
        { o: 'skiftgång', b: 'Att arbeta olika tider i turer', e: 'Vi har skiftgång morgon och kväll.' },
        { o: 'ergonomi', b: 'Att arbeta så kroppen inte tar skada', e: 'Tänk på ergonomin när du lyfter.' }
      ],
      fraser: [
        { f: 'Var ska den här pallen stå?', n: 'När du är osäker på placering' },
        { f: 'Jag hittar inte artikeln på plocklistan.', n: 'När en vara saknas' },
        { f: 'Kan du visa mig hur handdatorn fungerar?', n: 'När du är ny' },
        { f: 'Saldot stämmer inte, ska jag rapportera det?', n: 'Vid fel i lagersystemet' },
        { f: 'Jag behöver hjälp med ett tungt lyft.', n: 'För att undvika skada' },
        { f: 'Är det okej att jag tar rast nu?', n: 'Innan du går på rast' },
        { f: 'Vilken tid börjar mitt skift imorgon?', n: 'För att dubbelkolla schemat' },
        { f: 'Den här varan är skadad, vad gör jag med den?', n: 'Vid trasigt gods' }
      ],
      texter: [
        {
          titel: 'Säkerhet på lagret',
          text: 'På ett lager finns det regler som alla måste följa. Du ska alltid ha skyddsskor. När en truck kör i närheten ska du stanna och vänta — föraren ser dig inte alltid. Tunga lyft gör du med rak rygg och böjda knän, och behöver du hjälp ber du en kollega. Om något går sönder eller någon skadar sig ska det rapporteras samma dag. Det är inte för att någon ska få skulden, utan för att det inte ska hända igen.',
          fragor: [
            { q: 'Vad gör du när en truck kör nära?', alt: ['Går snabbt förbi', 'Stannar och väntar', 'Ropar till föraren'], ratt: 1 },
            { q: 'Hur lyfter du tungt?', alt: ['Rak rygg och böjda knän', 'Böjd rygg och raka ben', 'Så snabbt som möjligt'], ratt: 0 },
            { q: 'Varför rapporteras olyckor?', alt: ['För att någon ska få skulden', 'För att det inte ska hända igen', 'För statistiken'], ratt: 1 }
          ]
        }
      ]
    },

    service: {
      namn: 'Service & handel',
      ikon: '🛒',
      ord: [
        { o: 'kundbemötande', b: 'Hur du tar emot och talar med kunder', e: 'Bra kundbemötande gör att folk kommer tillbaka.' },
        { o: 'kassa', b: 'Där kunden betalar', e: 'Kan du ta över i kassan?' },
        { o: 'växel', b: 'Pengar tillbaka vid kontant betalning', e: 'Här är din växel.' },
        { o: 'kvitto', b: 'Papper som visar vad du köpt', e: 'Vill du ha kvittot?' },
        { o: 'öppettider', b: 'När butiken är öppen', e: 'Våra öppettider står på dörren.' },
        { o: 'lagersaldo', b: 'Hur många varor som finns kvar', e: 'Jag kollar lagersaldot åt dig.' },
        { o: 'exponering', b: 'Hur varor ställs fram för att synas', e: 'Exponeringen byts varje vecka.' },
        { o: 'påfyllning', b: 'Att fylla på tomma hyllor', e: 'Påfyllningen görs på morgonen.' },
        { o: 'returer', b: 'Varor kunden lämnar tillbaka', e: 'Returer tar vi emot inom 30 dagar.' },
        { o: 'bytesrätt', b: 'Rätt att byta en vara', e: 'Du har bytesrätt med kvitto.' },
        { o: 'allergen', b: 'Ämne som kan ge allergi', e: 'Allergener står i innehållsförteckningen.' },
        { o: 'svinn', b: 'Varor som slängs eller försvinner', e: 'Vi arbetar för att minska svinnet.' },
        { o: 'inventering', b: 'Att räkna varulagret', e: 'Inventering sker i januari.' },
        { o: 'schemaläggning', b: 'Planering av arbetstider', e: 'Schemaläggningen kommer två veckor i förväg.' }
      ],
      fraser: [
        { f: 'Hej, kan jag hjälpa dig med något?', n: 'När en kund ser ut att leta' },
        { f: 'Ett ögonblick, jag kollar om vi har den.', n: 'När kunden frågar efter en vara' },
        { f: 'Tyvärr är den slut just nu, men den kommer på torsdag.', n: 'När en vara saknas' },
        { f: 'Jag förstår att det är tråkigt. Jag ska se vad jag kan göra.', n: 'Vid ett klagomål' },
        { f: 'Vill du betala med kort eller kontant?', n: 'I kassan' },
        { f: 'Jag frågar min chef och återkommer.', n: 'När du inte får besluta själv' },
        { f: 'Tack och välkommen åter!', n: 'När kunden går' },
        { f: 'Kan du upprepa det? Jag hörde inte riktigt.', n: 'När du inte uppfattar kunden' }
      ],
      texter: [
        {
          titel: 'Att möta en missnöjd kund',
          text: 'Ibland är en kund arg eller besviken. Det handlar nästan aldrig om dig personligen. Det första du gör är att lyssna färdigt utan att avbryta. Sedan säger du att du förstår, och frågar vad kunden vill ska hända. Om du kan lösa det gör du det direkt. Kan du inte det säger du ärligt att du behöver fråga någon annan, och du säger när du kommer tillbaka. De flesta blir lugnare bara av att någon lyssnar ordentligt.',
          fragor: [
            { q: 'Vad gör du först när en kund är arg?', alt: ['Förklarar reglerna', 'Lyssnar färdigt', 'Hämtar chefen'], ratt: 1 },
            { q: 'Vad gör du om du inte kan lösa problemet?', alt: ['Säger att det inte går', 'Säger ärligt att du frågar någon annan', 'Ber kunden ringa senare'], ratt: 1 },
            { q: 'Vad lugnar de flesta kunder?', alt: ['Att få pengarna tillbaka', 'Att någon lyssnar ordentligt', 'Att få tala med chefen'], ratt: 1 }
          ]
        }
      ]
    },

    bygg: {
      namn: 'Bygg & anläggning',
      ikon: '🔨',
      ord: [
        { o: 'ställning', b: 'Konstruktion att stå på vid arbete på höjd', e: 'Ställningen ska kontrolleras varje vecka.' },
        { o: 'skyddsräcke', b: 'Räcke som hindrar fall', e: 'Sätt upp skyddsräcke innan ni börjar.' },
        { o: 'arbetsmiljö', b: 'Hur säkert och bra arbetsplatsen är', e: 'Arbetsmiljön är allas ansvar.' },
        { o: 'skyddsrond', b: 'Genomgång av säkerheten på bygget', e: 'Vi har skyddsrond på fredag.' },
        { o: 'ritning', b: 'Teckning som visar hur något ska byggas', e: 'Det står på ritningen.' },
        { o: 'måttband', b: 'Verktyg för att mäta längd', e: 'Har du ett måttband?' },
        { o: 'vattenpass', b: 'Verktyg som visar om något är rakt', e: 'Kolla med vattenpasset.' },
        { o: 'gjutning', b: 'Att hälla betong i en form', e: 'Gjutningen sker på tisdag.' },
        { o: 'armering', b: 'Järn som förstärker betong', e: 'Armeringen läggs före gjutningen.' },
        { o: 'bärlager', b: 'Lager som bär upp en yta', e: 'Bärlagret ska packas ordentligt.' },
        { o: 'fallskydd', b: 'Utrustning som skyddar vid fall', e: 'Fallskydd krävs över två meter.' },
        { o: 'hjälm', b: 'Skydd för huvudet', e: 'Hjälm gäller på hela området.' },
        { o: 'byggarbetsplats', b: 'Platsen där bygget sker', e: 'Obehöriga får inte vistas på byggarbetsplatsen.' },
        { o: 'egenkontroll', b: 'Att själv kontrollera sitt arbete', e: 'Fyll i egenkontrollen när du är klar.' }
      ],
      fraser: [
        { f: 'Var ska jag börja idag?', n: 'I början av arbetsdagen' },
        { f: 'Jag har inte gjort det här förut, kan du visa?', n: 'Vid en ny arbetsuppgift' },
        { f: 'Vilken skyddsutrustning behöver jag här?', n: 'Innan du går in på ett område' },
        { f: 'Det här känns inte säkert, kan vi titta på det?', n: 'När du ser en risk' },
        { f: 'Vilket mått ska det vara?', n: 'När du är osäker på ritningen' },
        { f: 'Kan du hjälpa mig bära?', n: 'Vid tunga lyft' },
        { f: 'När är rasten?', n: 'Vanlig fråga första dagen' },
        { f: 'Jag är klar, vad gör jag nu?', n: 'När en uppgift är färdig' }
      ],
      texter: [
        {
          titel: 'Första dagen på bygget',
          text: 'När du kommer till en ny byggarbetsplats får du en genomgång. Du får veta var du ska vara, vem som är arbetsledare och vilka regler som gäller. Hjälm och skyddsskor är alltid obligatoriskt. Över två meters höjd krävs fallskydd. Om du ser något som känns farligt ska du säga till direkt — det är bättre att fråga en gång för mycket än att någon skadar sig. Ingen förväntar sig att du kan allt första dagen, men alla förväntar sig att du frågar.',
          fragor: [
            { q: 'Vad är alltid obligatoriskt på bygget?', alt: ['Hjälm och skyddsskor', 'Fallskydd', 'Måttband'], ratt: 0 },
            { q: 'Från vilken höjd krävs fallskydd?', alt: ['En meter', 'Två meter', 'Fem meter'], ratt: 1 },
            { q: 'Vad förväntas av dig första dagen?', alt: ['Att du kan allt', 'Att du arbetar snabbt', 'Att du frågar'], ratt: 2 }
          ]
        }
      ]
    }
  };

  /* ── Språktest — egen skala ────────────────────────────────
     Fyra steg, namngivna efter vad deltagaren klarar på jobbet.
     Svårighetsgraden är kalibrerad med sfi kurs C och D som
     riktmärke, men skalan är vår egen: inga GERS-beteckningar.

     Mätprinciper:
     - Banken är större än testet. Varje test drar 4 av 7 frågor
       per nivå, så att samma deltagare inte lär sig frågorna
       utantill mellan mätningarna. Dragningen är stratifierad per
       område så att delresultaten går att jämföra över tid.
     - Adaptivt stopp: under 50 % rätt på en nivå avslutar testet.
       Ingen ska behöva plåga sig igenom texter långt över sin nivå.
     - Ett steg räknas som nått vid minst 70 % rätt på nivån och
       alla nivåer under.
     - Lyssnafrågor är helt upplästa. Övriga frågor är tysta, annars
       går läsförståelse och hörförståelse inte att skilja åt.
     - "Vet inte" finns, och räknas som fel. Det minskar gissandet.
     - TEST_VERSION sparas med varje resultat. Ändras banken räknas
       resultaten inte ihop över versionsgränsen.
     ──────────────────────────────────────────────────────────── */
  var TEST_VERSION = 1;
  var PER_NIVA = 4, KLARAR = 0.7, AVBRYT = 0.5;

  var STEG = [
    { namn: 'På väg mot steg 1', kan: 'Du har tagit första steget. Börja träna på ord, tider och korta fraser i Allmänt på jobbet.' },
    { namn: 'Komma igång', kan: 'Du förstår enstaka ord på jobbet, hälsningsfraser och enkla instruktioner när någon hjälper dig.' },
    { namn: 'Klara vardagen', kan: 'Du förstår vanliga arbetsord och tider, kan be om hjälp och förstår korta instruktioner.' },
    { namn: 'Delta i arbetet', kan: 'Du följer instruktioner i flera steg, förstår regler på jobbet och läser korta arbetstexter.' },
    { namn: 'Klara sig själv', kan: 'Du förstår längre texter och rutiner, uppfattar vad kollegor menar och hanterar ändringar.' }
  ];

  var OMRADEN = {
    ord:    { namn: 'Ord och uttryck',          ovning: 'ord' },
    lyssna: { namn: 'Hörförståelse',            ovning: 'lyssna' },
    instr:  { namn: 'Instruktioner och regler', ovning: 'regler' },
    las:    { namn: 'Läsförståelse',            ovning: 'lasa' }
  };

  var LEVERANS = 'Från och med nästa månad ändras rutinerna för leveranser. Alla leveranser ska registreras i systemet innan de flyttas till lagret. Den som tar emot leveransen ansvarar för att kontrollera att antalet stämmer. Om något saknas eller är skadat ska det rapporteras samma dag.';

  // n = nivå, om = område, alt[0] = rätt svar (blandas vid dragning)
  var TEST_BANK = [
    // Nivå 1 · Komma igång
    { n: 1, om: 'ord', text: 'chef', q: 'Vad betyder ordet?', alt: ['Den som leder arbetet', 'En arbetskamrat', 'En kund'] },
    { n: 1, om: 'ord', text: 'lön', q: 'Vad betyder ordet?', alt: ['Pengar du får för ditt arbete', 'En ledig dag', 'Din arbetstid'] },
    { n: 1, om: 'ord', text: 'sjuk', q: 'Vad betyder ordet?', alt: ['Inte frisk', 'Hungrig', 'Arg'] },
    { n: 1, om: 'instr', text: 'Vänta här.', q: 'Vad ska du göra?', alt: ['Stanna kvar där du är', 'Gå hem', 'Ringa någon'] },
    { n: 1, om: 'lyssna', say: 'Hej, jag heter Ali och jag är ny här.', q: 'Vad gör personen?', alt: ['Han presenterar sig', 'Han frågar om vägen', 'Han säger hejdå'] },
    { n: 1, om: 'lyssna', say: 'Klockan sju.', q: 'Vilken tid hör du?', alt: ['07.00', '06.00', '08.00'] },
    { n: 1, om: 'lyssna', say: 'Tack för idag, vi ses i morgon!', q: 'När säger man så?', alt: ['När man går hem från jobbet', 'När man kommer till jobbet', 'När man äter lunch'] },

    // Nivå 2 · Klara vardagen
    { n: 2, om: 'ord', text: 'schema', q: 'Vad betyder ordet?', alt: ['En plan för när du ska arbeta', 'En sorts lön', 'Ett verktyg'] },
    { n: 2, om: 'ord', text: 'rast', q: 'Vad betyder ordet?', alt: ['En paus under arbetsdagen', 'En arbetsuppgift', 'En sorts maskin'] },
    { n: 2, om: 'instr', text: 'Du måste ha hjälm här.', q: 'Vad betyder det?', alt: ['Hjälm är ett krav', 'Hjälm är frivilligt', 'Hjälm är förbjudet'] },
    { n: 2, om: 'instr', text: 'Ring om du blir sjuk.', q: 'Vad ska du göra?', alt: ['Ringa när du är sjuk', 'Ringa varje dag', 'Aldrig ringa'] },
    { n: 2, om: 'lyssna', say: 'Halv åtta.', q: 'Vilken tid hör du?', alt: ['07.30', '08.30', '08.00'] },
    { n: 2, om: 'lyssna', say: 'Kvart över tre.', q: 'Vilken tid hör du?', alt: ['15.15', '14.45', '15.45'] },
    { n: 2, om: 'lyssna', say: 'Kan du visa mig hur man gör?', q: 'Vad vill personen?', alt: ['Att någon visar hur man gör', 'Gå hem tidigt', 'Ta en paus'] },

    // Nivå 3 · Delta i arbetet
    { n: 3, om: 'instr', text: 'Du behöver inte komma på fredag.', q: 'Vad betyder det?', alt: ['Det är inte nödvändigt att komma', 'Det är förbjudet att komma', 'Det är viktigt att komma'] },
    { n: 3, om: 'instr', text: 'Du får inte röka här.', q: 'Vad betyder det?', alt: ['Det är förbjudet att röka här', 'Det är tillåtet att röka här', 'Det är bara ett råd'] },
    { n: 3, om: 'instr', text: 'Ta på dig handskarna innan du börjar städa.', q: 'I vilken ordning gör du?', alt: ['Först handskar, sedan städa', 'Först städa, sedan handskar', 'Städa utan handskar'] },
    { n: 3, om: 'las', text: 'Måndag till torsdag börjar passet klockan 07.00. På fredag börjar vi en timme senare.', q: 'När börjar passet på fredag?', alt: ['08.00', '06.00', '07.00'] },
    { n: 3, om: 'las', text: 'Om du är sjuk ska du ringa din chef före klockan 06.30. Skicka inte sms.', q: 'Hur ska du sjukanmäla dig?', alt: ['Ringa chefen före 06.30', 'Skicka sms till chefen', 'Ringa efter lunch'] },
    { n: 3, om: 'lyssna', say: 'Vi ses i fikarummet efter mötet.', q: 'Var ska ni träffas?', alt: ['I fikarummet', 'På mötet', 'Vid entrén'] },
    { n: 3, om: 'lyssna', say: 'Mötet är flyttat från tisdag till torsdag, samma tid.', q: 'När är mötet nu?', alt: ['På torsdag, samma tid som förut', 'På tisdag, men en annan tid', 'Både tisdag och torsdag'] },

    // Nivå 4 · Klara sig själv
    { n: 4, om: 'las', text: LEVERANS, q: 'Vad måste göras innan en leverans flyttas till lagret?', alt: ['Den ska registreras i systemet', 'Den ska rapporteras till chefen', 'Antalet ska räknas nästa dag'] },
    { n: 4, om: 'las', text: LEVERANS, q: 'Vem ansvarar för att antalet stämmer?', alt: ['Den som tar emot leveransen', 'Chefen', 'Personalen på lagret dagen efter'] },
    { n: 4, om: 'instr', text: 'Du borde fråga innan du byter pass.', q: 'Vad betyder det?', alt: ['Det är klokt att fråga först', 'Det är förbjudet att byta pass', 'Det spelar ingen roll'] },
    { n: 4, om: 'instr', text: 'Om larmet går, lämna byggnaden genom närmaste nödutgång och samlas vid parkeringen. Använd inte hissen.', q: 'Vad ska du INTE göra?', alt: ['Ta hissen', 'Gå till parkeringen', 'Använda nödutgången'] },
    { n: 4, om: 'ord', text: 'Han är sjukskriven på halvtid.', q: 'Vad betyder det?', alt: ['Han arbetar halva tiden', 'Han arbetar inte alls', 'Han är helt frisk'] },
    { n: 4, om: 'lyssna', say: 'Det är lugnt, du hinner nog inte med allt idag.', q: 'Vad menar kollegan?', alt: ['Det är okej om du inte blir klar idag', 'Kollegan är arg för att du är långsam', 'Du måste stanna längre idag'] },
    { n: 4, om: 'lyssna', say: 'Från och med måndag gäller nya rutiner, så läs igenom dem innan du börjar ditt pass.', q: 'Vad ska du göra?', alt: ['Läsa de nya rutinerna innan ditt pass', 'Vänta med rutinerna till nästa månad', 'Fråga chefen om rutinerna på måndag'] }
  ];

  // ── Tillstånd ───────────────────────────────────────────────
  var state = { branch: null, mode: null, items: [], idx: 0, correct: 0, answered: false, finished: false };
  var PKEY = 'cvm_sprak_v1';

  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(PKEY) || '{}'); } catch (e) { return {}; }
  }
  function saveProgress(p) {
    try { localStorage.setItem(PKEY, JSON.stringify(p)); } catch (e) {}
    // Serverpersistens — krävs för att handläggaren ska se progress.
    try {
      if (window.authUserId && window.authAccessToken) {
        fetch('/api/supabase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'save_table', table: 'sprak_progress',
            accessToken: window.authAccessToken, userId: window.authUserId, data: p
          })
        }).catch(function () {});
      }
    } catch (e) {}
  }
  function recordResult(branch, mode, correct, total, aktivSek) {
    var p = loadProgress();
    if (!p[branch]) p[branch] = {};
    var prev = p[branch][mode] || { pass: 0, ratt: 0, totalt: 0, tidSek: 0 };
    p[branch][mode] = {
      pass: prev.pass + 1,
      ratt: prev.ratt + correct,
      totalt: prev.totalt + total,
      tidSek: (prev.tidSek || 0) + (aktivSek || 0),
      senast: new Date().toISOString()
    };
    p._uppdaterad = new Date().toISOString();
    saveProgress(p);
  }

  /* ── Tidloggning ────────────────────────────────────────────
     Mäter AKTIV tid, inte hur länge fliken varit öppen. Tiden
     pausas när fliken döljs och när deltagaren varit stilla en
     stund. Det är skillnaden mellan en logg en kommun kan lita
     på och en som bara visar att webbläsaren stod på.
     ──────────────────────────────────────────────────────────── */
  var IDLE_MS = 300000;            // 5 min utan interaktion → räknas inte (kravspec F1.4)
  var timer = {
    aktivMs: 0,
    sedan: null,                   // tidpunkt då pågående intervall började
    senasteAktivitet: 0,
    idleKoll: null,

    start: function () {
      this.aktivMs = 0;
      this.senasteAktivitet = Date.now();
      this.sedan = Date.now();
      var self = this;
      clearInterval(this.idleKoll);
      this.idleKoll = setInterval(function () {
        if (self.sedan && Date.now() - self.senasteAktivitet > IDLE_MS) self.paus();
      }, 5000);
    },

    // Räknar in tiden fram till nu och stoppar klockan
    paus: function () {
      if (this.sedan) {
        this.aktivMs += Date.now() - this.sedan;
        this.sedan = null;
      }
    },

    // Startar om klockan efter paus — bara om ett pass pågår
    ater: function () {
      if (!this.sedan && this.idleKoll) {
        this.sedan = Date.now();
        this.senasteAktivitet = Date.now();
      }
    },

    puls: function () {
      this.senasteAktivitet = Date.now();
      this.ater();
    },

    stopp: function () {
      this.paus();
      clearInterval(this.idleKoll);
      this.idleKoll = null;
      return Math.round(this.aktivMs / 1000);
    }
  };

  // Fliken döljs → pausa. Syns igen → fortsätt.
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) timer.paus(); else timer.puls();
  });

  function formatTid(sek) {
    sek = Math.max(0, Math.round(sek || 0));
    if (sek < 60) return sek + ' sek';
    var min = Math.round(sek / 60);
    if (min < 60) return min + ' min';
    var h = Math.floor(min / 60);
    var m = min % 60;
    return h + ' h' + (m ? ' ' + m + ' min' : '');
  }

  // ── Uppläsning (Web Speech API) ─────────────────────────────
  // Samma röstprioritering och Chrome-workaround som intervju.js:
  // Chrome tystnar efter ~15 s utan pause/resume-puls.
  var tts = {
    voice: null,
    ready: false,
    init: function () {
      if (!window.speechSynthesis) return;
      var self = this;
      function pick() {
        var vs = window.speechSynthesis.getVoices() || [];
        var sv = vs.filter(function (v) { return /^sv/i.test(v.lang || ''); });
        if (!sv.length) return;
        var prio = ['Sofie Online (Natural)', 'Hillevi Online (Natural)', 'Sofie',
                    'Alva (Förbättrad)', 'Alva (Enhanced)', 'Google svenska', 'Alva', 'Klara', 'Hedvig', 'Bengt'];
        for (var i = 0; i < prio.length; i++) {
          var hit = sv.find(function (v) { return v.name === prio[i]; });
          if (hit) { self.voice = hit; self.ready = true; return; }
        }
        var nat = sv.find(function (v) { return /natural|online|neural/i.test(v.name); });
        self.voice = nat || sv[0];
        self.ready = true;
      }
      pick();
      if (!this.ready) window.speechSynthesis.onvoiceschanged = pick;
    },
    speak: function (text, btn) {
      if (!window.speechSynthesis || !text) return;
      this.cancel();
      var u = new SpeechSynthesisUtterance(String(text));
      u.lang = 'sv-SE';
      u.rate = 0.9;            // något långsammare — modulen är för svaga läsare
      if (this.voice) u.voice = this.voice;
      var keep = setInterval(function () {
        try { window.speechSynthesis.pause(); window.speechSynthesis.resume(); } catch (e) {}
      }, 10000);
      function done() {
        clearInterval(keep);
        if (btn) btn.classList.remove('spr-speaking');
      }
      u.onend = done;
      u.onerror = done;
      if (btn) btn.classList.add('spr-speaking');
      try { window.speechSynthesis.speak(u); } catch (e) { done(); }
    },
    cancel: function () {
      try { window.speechSynthesis.cancel(); } catch (e) {}
      var b = document.querySelector('.spr-speaking');
      if (b) b.classList.remove('spr-speaking');
    }
  };

  // Uppläsningsknapp — används överallt där text visas
  function hoerKnapp(text, label) {
    return '<button type="button" class="spr-hear" data-say="' + esc(text) + '" ' +
           'aria-label="' + esc(label || 'Lyssna på texten') + '" title="Lyssna">🔊</button>';
  }

  // ── UI ──────────────────────────────────────────────────────
  function getRoot() { return $('#trainView-sprak'); }

  function buildUI() {
    var root = getRoot();
    if (!root) return false;
    if (root.dataset.sprBuilt === '1') return true;

    var back = root.querySelector('.train-back');
    root.innerHTML = '';
    if (back) root.appendChild(back);

    var box = document.createElement('div');
    box.className = 'spr-root';
    box.innerHTML = [
      '<div id="sprScreenSetup" class="spr-screen">',
      '  <h2 class="spr-h">🗣️ Språkträning</h2>',
      '  <p class="spr-sub">Yrkessvenska för jobbet. Gör testet så vet du var du står — eller välj ett område och träna direkt. Allt i övningarna går att lyssna på.</p>',
      '  <div id="sprTestCard"></div>',
      '  <div class="spr-branches" id="sprBranches"></div>',
      '</div>',

      '<div id="sprScreenMenu" class="spr-screen">',
      '  <button type="button" class="spr-back" id="sprBackSetup">← Byt område</button>',
      '  <h2 class="spr-h" id="sprMenuTitle"></h2>',
      '  <div class="spr-modes">',
      '    <button type="button" class="spr-mode" data-mode="ord">',
      '      <span class="spr-mode-i">📖</span><span class="spr-mode-n">Ord & begrepp</span>',
      '      <span class="spr-mode-d">Lär dig orden som används på jobbet</span>',
      '      <span class="spr-mode-p" data-p="ord"></span></button>',
      '    <button type="button" class="spr-mode" data-mode="fraser">',
      '      <span class="spr-mode-i">💬</span><span class="spr-mode-n">Fraser på jobbet</span>',
      '      <span class="spr-mode-d">Vad du säger — och när du säger det</span>',
      '      <span class="spr-mode-p" data-p="fraser"></span></button>',
      '    <button type="button" class="spr-mode" data-mode="lasa">',
      '      <span class="spr-mode-i">📄</span><span class="spr-mode-n">Läs och förstå</span>',
      '      <span class="spr-mode-d">Korta texter med frågor — lyssna medan du läser</span>',
      '      <span class="spr-mode-p" data-p="lasa"></span></button>',
      '    <button type="button" class="spr-mode" data-mode="lyssna">',
      '      <span class="spr-mode-i">👂</span><span class="spr-mode-n">Lyssna</span>',
      '      <span class="spr-mode-d">Hör ordet och välj rätt betydelse</span>',
      '      <span class="spr-mode-p" data-p="lyssna"></span></button>',
      '    <button type="button" class="spr-mode" data-mode="tid" hidden>',
      '      <span class="spr-mode-i">🕗</span><span class="spr-mode-n">Klockan och tider</span>',
      '      <span class="spr-mode-d">Halv åtta, kvart i tolv — tiderna som styr arbetsdagen</span>',
      '      <span class="spr-mode-p" data-p="tid"></span></button>',
      '    <button type="button" class="spr-mode" data-mode="regler" hidden>',
      '      <span class="spr-mode-i">⚖️</span><span class="spr-mode-n">Måste, får och får inte</span>',
      '      <span class="spr-mode-d">Små ord som avgör vad som är krav, tillåtet eller förbjudet</span>',
      '      <span class="spr-mode-p" data-p="regler"></span></button>',
      '  </div>',
      '</div>',

      '<div id="sprScreenOvning" class="spr-screen">',
      '  <div class="spr-top">',
      '    <button type="button" class="spr-back" id="sprBackMenu">← Avsluta</button>',
      '    <div class="spr-progress"><div class="spr-progress-bar" id="sprBar"></div></div>',
      '    <span class="spr-count" id="sprCount"></span>',
      '  </div>',
      '  <div id="sprCard"></div>',
      '</div>',

      '<div id="sprScreenKlar" class="spr-screen">',
      '  <div class="spr-done" id="sprDone"></div>',
      '</div>',

      '<div id="sprScreenTest" class="spr-screen"><div id="sprTest"></div></div>'
    ].join('');
    root.appendChild(box);
    root.dataset.sprBuilt = '1';
    return true;
  }

  function showScreen(name) {
    ['Setup', 'Menu', 'Ovning', 'Klar', 'Test'].forEach(function (s) {
      var el = $('#sprScreen' + s);
      if (el) el.classList.toggle('spr-screen--active', s.toLowerCase() === name);
    });
  }

  function renderBranches() {
    var wrap = $('#sprBranches');
    if (!wrap) return;
    var p = loadProgress();
    renderTestKort();
    wrap.innerHTML = Object.keys(CONTENT).map(function (k) {
      var b = CONTENT[k];
      var bp = p[k] || {};
      var pass = Object.keys(bp).reduce(function (n, m) { return n + (bp[m].pass || 0); }, 0);
      return '<button type="button" class="spr-branch" data-branch="' + k + '">' +
             '<span class="spr-branch-i">' + b.ikon + '</span>' +
             '<span class="spr-branch-n">' + esc(b.namn) + '</span>' +
             '<span class="spr-branch-m">' + (pass ? pass + ' pass klara' : (b.grund ? 'Grunden för alla jobb — börja här' : 'Inte påbörjat')) + '</span>' +
             '</button>';
    }).join('');
  }

  function renderMenu() {
    var b = CONTENT[state.branch];
    if (!b) return;
    var t = $('#sprMenuTitle');
    if (t) t.textContent = b.ikon + ' ' + b.namn;
    var p = loadProgress()[state.branch] || {};
    ['tid', 'regler'].forEach(function (m) {
      var btn = document.querySelector('#sprScreenMenu .spr-mode[data-mode="' + m + '"]');
      if (btn) btn.hidden = !(b[m] && b[m].length);
    });
    ['ord', 'fraser', 'lasa', 'lyssna', 'tid', 'regler'].forEach(function (m) {
      var el = document.querySelector('#sprScreenMenu [data-p="' + m + '"]');
      if (!el) return;
      var d = p[m];
      el.textContent = d && d.totalt
        ? Math.round((d.ratt / d.totalt) * 100) + '% rätt · ' + d.pass + ' pass' +
          (d.tidSek ? ' · ' + formatTid(d.tidSek) : '')
        : '';
    });
  }

  // ── Övningsgenerering ───────────────────────────────────────
  function buildItems(branch, mode) {
    var b = CONTENT[branch];
    if (!b) return [];

    if (mode === 'ord' || mode === 'lyssna') {
      return shuffle(b.ord).slice(0, 10).map(function (w) {
        var fel = shuffle(b.ord.filter(function (x) { return x.o !== w.o; })).slice(0, 2);
        var alt = shuffle([w.b].concat(fel.map(function (x) { return x.b; })));
        return {
          typ: mode === 'lyssna' ? 'lyssna' : 'ord',
          fraga: w.o, exempel: w.e,
          alt: alt, ratt: alt.indexOf(w.b)
        };
      });
    }

    if (mode === 'fraser') {
      return shuffle(b.fraser).slice(0, 8).map(function (f) {
        var fel = shuffle(b.fraser.filter(function (x) { return x.f !== f.f; })).slice(0, 2);
        var alt = shuffle([f.n].concat(fel.map(function (x) { return x.n; })));
        return { typ: 'fraser', fraga: f.f, alt: alt, ratt: alt.indexOf(f.n) };
      });
    }

    if (mode === 'tid' && b.tid) {
      return shuffle(b.tid).map(function (t) {
        var alt = shuffle(t.alt.slice());
        return { typ: 'tid', say: t.s, alt: alt, ratt: alt.indexOf(t.alt[0]), forklaring: t.f };
      });
    }

    if (mode === 'regler' && b.regler) {
      return shuffle(b.regler).map(function (r) {
        var alt = shuffle(r.alt.slice());
        return { typ: 'regler', fraga: r.m, alt: alt, ratt: alt.indexOf(r.alt[0]), forklaring: r.f };
      });
    }

    if (mode === 'lasa') {
      var out = [];
      b.texter.forEach(function (t) {
        t.fragor.forEach(function (f, i) {
          out.push({
            typ: 'lasa',
            text: i === 0 ? t.text : null,   // texten visas vid första frågan
            titel: i === 0 ? t.titel : null,
            fraga: f.q, alt: f.alt, ratt: f.ratt, kvarText: t.text
          });
        });
      });
      return out;
    }
    return [];
  }

  function renderCard() {
    var it = state.items[state.idx];
    var card = $('#sprCard');
    if (!it || !card) return;
    state.answered = false;

    var bar = $('#sprBar');
    if (bar) bar.style.width = Math.round((state.idx / state.items.length) * 100) + '%';
    var cnt = $('#sprCount');
    if (cnt) cnt.textContent = (state.idx + 1) + '/' + state.items.length;

    var head = '';
    if (it.typ === 'ord') {
      head = '<div class="spr-q-label">Vad betyder ordet?</div>' +
             '<div class="spr-word">' + esc(it.fraga) + ' ' + hoerKnapp(it.fraga, 'Lyssna på ordet') + '</div>';
    } else if (it.typ === 'lyssna') {
      head = '<div class="spr-q-label">Tryck på högtalaren och lyssna</div>' +
             '<div class="spr-listen">' + hoerKnapp(it.fraga, 'Lyssna på ordet') + '</div>' +
             '<div class="spr-hint">Vilket av alternativen betyder det du hörde?</div>';
    } else if (it.typ === 'fraser') {
      head = '<div class="spr-q-label">När säger du det här?</div>' +
             '<div class="spr-phrase">”' + esc(it.fraga) + '” ' + hoerKnapp(it.fraga, 'Lyssna på frasen') + '</div>';
    } else if (it.typ === 'lasa') {
      if (it.text) {
        head += '<div class="spr-text"><div class="spr-text-h">' + esc(it.titel) + ' ' +
                hoerKnapp(it.text, 'Lyssna på hela texten') + '</div>' +
                '<p>' + esc(it.text) + '</p></div>';
      } else {
        head += '<div class="spr-text spr-text--mini">' + hoerKnapp(it.kvarText, 'Lyssna på texten igen') +
                ' <span>Lyssna på texten igen</span></div>';
      }
      head += '<div class="spr-q-label">' + esc(it.fraga) + ' ' + hoerKnapp(it.fraga, 'Lyssna på frågan') + '</div>';
    } else if (it.typ === 'tid') {
      head = '<div class="spr-q-label">Lyssna. Vilken tid hör du?</div>' +
             '<div class="spr-listen">' + hoerKnapp(it.say, 'Lyssna på tiden') + '</div>';
    } else if (it.typ === 'regler') {
      head = '<div class="spr-q-label">Vad betyder meningen?</div>' +
             '<div class="spr-phrase">”' + esc(it.fraga) + '” ' + hoerKnapp(it.fraga, 'Lyssna på meningen') + '</div>';
    }

    var arTid = it.typ === 'tid';
    var alts = it.alt.map(function (a, i) {
      return '<button type="button" class="spr-alt' + (arTid ? ' spr-alt--tid' : '') + '" data-i="' + i + '">' +
             '<span class="spr-alt-t">' + esc(a) + '</span>' + (arTid ? '' : hoerKnapp(a, 'Lyssna på svaret')) + '</button>';
    }).join('');

    card.innerHTML = head + '<div class="spr-alts">' + alts + '</div>' +
                     '<div class="spr-feedback" id="sprFb"></div>' +
                     '<button type="button" class="spr-next" id="sprNext" style="display:none">Nästa →</button>';
  }

  function answer(i) {
    if (state.answered) return;
    state.answered = true;
    var it = state.items[state.idx];
    var ratt = i === it.ratt;
    if (ratt) state.correct++;

    var btns = document.querySelectorAll('#sprCard .spr-alt');
    Array.prototype.forEach.call(btns, function (b, bi) {
      if (bi === it.ratt) b.classList.add('spr-alt--right');
      else if (bi === i) b.classList.add('spr-alt--wrong');
      b.classList.add('spr-alt--locked');
    });

    var fb = $('#sprFb');
    if (fb) {
      fb.className = 'spr-feedback spr-feedback--' + (ratt ? 'ok' : 'no');
      var txt = ratt ? '✓ Rätt!' : '✗ Inte riktigt — rätt svar är markerat.';
      if (it.exempel) txt += ' <em>' + esc(it.exempel) + '</em> ' + hoerKnapp(it.exempel, 'Lyssna på exempelmeningen');
      if (it.typ === 'tid') txt += ' <em>Du hörde: ”' + esc(it.say) + '”</em>';
      if (it.forklaring) txt += '<span class="spr-forklaring">' + esc(it.forklaring) + ' ' + hoerKnapp(it.forklaring, 'Lyssna på förklaringen') + '</span>';
      fb.innerHTML = txt;
    }
    var nx = $('#sprNext');
    if (nx) nx.style.display = 'block';
  }

  function next() {
    if (state.finished) return;
    state.idx++;
    if (state.idx >= state.items.length) return finish();
    renderCard();
  }

  function finish() {
    if (state.finished) return;
    state.finished = true;
    var aktivSek = timer.stopp();
    recordResult(state.branch, state.mode, state.correct, state.items.length, aktivSek);
    var pct = Math.round((state.correct / state.items.length) * 100);
    var omdome = pct >= 80 ? 'Mycket bra jobbat!' : pct >= 50 ? 'Bra — fortsätt träna!' : 'Kör en gång till, det sitter snart.';
    var d = $('#sprDone');
    if (d) {
      d.innerHTML =
        '<div class="spr-done-i">' + (pct >= 80 ? '🎉' : '💪') + '</div>' +
        '<h2 class="spr-h">' + state.correct + ' av ' + state.items.length + ' rätt</h2>' +
        '<p class="spr-sub">' + omdome + '<br><span class="spr-tid">⏱ ' + formatTid(aktivSek) + ' aktiv träning</span></p>' +
        '<div class="spr-done-btns">' +
        '  <button type="button" class="spr-primary" id="sprAgain">Träna igen</button>' +
        '  <button type="button" class="spr-secondary" id="sprToMenu">Tillbaka</button>' +
        '</div>';
    }
    showScreen('klar');
  }

  function startOvning(mode) {
    state.mode = mode;
    state.items = buildItems(state.branch, mode);
    state.idx = 0;
    state.correct = 0;
    state.finished = false;
    if (!state.items.length) return;
    timer.start();
    showScreen('ovning');
    renderCard();
  }

  // ── Språktest ───────────────────────────────────────────────
  var test = null;

  function testHistorik() {
    var p = loadProgress();
    return Array.isArray(p._test) ? p._test : [];
  }
  function senasteTest() {
    var h = testHistorik();
    return h.length ? h[h.length - 1] : null;
  }
  function kortDatum(iso) {
    try { return new Date(iso).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' }).replace(/\.$/, ''); }
    catch (e) { return ''; }
  }
  function dagarSedan(iso) {
    return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  }
  function kanLasaUpp() { return !!window.speechSynthesis; }

  function renderTestKort() {
    var el = $('#sprTestCard');
    if (!el) return;
    var sista = senasteTest();
    var rad = sista
      ? 'Senast: Steg ' + sista.steg + ' · ' + STEG[sista.steg].namn + ' · ' + sista.poang + ' poäng (' + kortDatum(sista.datum) + ')'
      : 'Ta reda på var du är just nu. Ungefär tio minuter.';
    el.innerHTML =
      '<button type="button" class="spr-testcard" id="sprOpenTest">' +
      '<span class="spr-testcard-i">📏</span>' +
      '<span class="spr-testcard-body"><span class="spr-testcard-n">Testa din svenska</span>' +
      '<span class="spr-testcard-d">' + esc(rad) + '</span></span>' +
      '<span class="spr-testcard-cta">' + (sista ? 'Gör igen' : 'Starta') + ' →</span></button>';
  }

  // Drar 4 frågor per nivå, STRATIFIERAT: först en fråga från varje
  // område som finns på nivån, sedan fylls resten slumpvis. Utan det
  // varierar områdesfördelningen mellan testtillfällen — ett test kan
  // sakna läsförståelse helt — och då går delresultaten inte att
  // jämföra över tid. Utan uppläsning utesluts lyssnafrågorna.
  function dragTest() {
    var per = {};
    var lasUpp = kanLasaUpp();
    for (var n = 1; n <= 4; n++) {
      var pool = shuffle(TEST_BANK.filter(function (t) {
        return t.n === n && (lasUpp || t.om !== 'lyssna');
      }));
      var valda = [];
      shuffle(Object.keys(OMRADEN)).forEach(function (om) {
        if (valda.length >= PER_NIVA) return;
        var forsta = pool.filter(function (t) { return t.om === om; })[0];
        if (forsta) valda.push(forsta);
      });
      pool.forEach(function (t) {
        if (valda.length < PER_NIVA && valda.indexOf(t) === -1) valda.push(t);
      });
      per[n] = shuffle(valda).map(function (t) {
        var alt = shuffle(t.alt.slice());
        return { n: t.n, om: t.om, say: t.say, text: t.text, q: t.q, alt: alt, r: alt.indexOf(t.alt[0]) };
      });
    }
    return per;
  }

  var SFI_VAL = [
    ['nej', 'Nej'], ['A', 'Kurs A'], ['B', 'Kurs B'], ['C', 'Kurs C'],
    ['D', 'Kurs D'], ['klar', 'Klar med kurs D'], ['ej_svar', 'Vill inte svara']
  ];

  function renderTestIntro() {
    var p = loadProgress();
    var sista = senasteTest();
    var intro = 'Det här är inget prov. Testet visar var du är just nu, så att du och din coach vet vad du ska träna på. ' +
                'Det tar ungefär tio minuter. Det blir svårare efter hand, och när det blir för svårt slutar testet av sig självt. ' +
                'Det är meningen. Svara hellre vet inte än att gissa.';
    var vanta = '';
    if (sista && dagarSedan(sista.datum) < 28) {
      var nasta = new Date(new Date(sista.datum).getTime() + 28 * 86400000).toISOString();
      vanta = '<div class="spr-test-note">Du gjorde testet för ' + dagarSedan(sista.datum) + ' dagar sedan. ' +
              'Resultatet blir mest rättvist om du väntar till ' + kortDatum(nasta) + '. Du kan ändå göra det nu.</div>';
    }
    var vald = p._sfi || null;
    var sfi = SFI_VAL.map(function (v) {
      var on = vald === v[0];
      return '<button type="button" class="spr-sfi' + (on ? ' spr-sfi--on' : '') + '" data-sfi="' + v[0] +
             '" aria-pressed="' + on + '">' + esc(v[1]) + '</button>';
    }).join('');

    $('#sprTest').innerHTML =
      '<button type="button" class="spr-back" id="sprTestAvbryt">← Tillbaka</button>' +
      '<h2 class="spr-h">Testa din svenska ' + hoerKnapp(intro, 'Lyssna på instruktionen') + '</h2>' +
      '<p class="spr-sub">' + esc(intro) + '</p>' +
      '<ul class="spr-test-fakta">' +
      '<li><b>Fyra delar</b> som blir svårare: ord, att lyssna, instruktioner och att läsa.</li>' +
      '<li><b>Lyssnafrågorna läses upp.</b> De andra läser du själv. Annars går det inte att se skillnad på att läsa och att lyssna.</li>' +
      '<li><b>Du ser inte rätt eller fel</b> under testet. Resultatet kommer i slutet.</li>' +
      '</ul>' + vanta +
      '<div class="spr-sfi-q">' +
      '<div class="spr-q-label">Läser du sfi, eller har du läst sfi? ' +
      hoerKnapp('Läser du sfi, eller har du läst sfi? Du behöver inte svara.', 'Lyssna på frågan') + '</div>' +
      '<div class="spr-sfi-list">' + sfi + '</div>' +
      '<div class="spr-hint">Frivilligt. Svaret hjälper oss att se att testet mäter rätt.</div>' +
      '</div>' +
      '<button type="button" class="spr-next" id="sprStartTest">Starta testet</button>';
    test = { sfi: vald };
    showScreen('test');
  }

  function startTest() {
    test = { sfi: test ? test.sfi : null, per: dragTest(), niva: 1, idx: 0, svar: [], klar: false };
    timer.start();
    renderTestFraga();
  }

  function renderTestFraga() {
    var it = test.per[test.niva][test.idx];
    var lyssna = it.om === 'lyssna';
    var head;
    if (lyssna) {
      head = '<div class="spr-q-label">Lyssna och svara</div>' +
             '<div class="spr-listen">' + hoerKnapp(it.say, 'Lyssna') + '</div>' +
             '<div class="spr-phrase">' + esc(it.q) + ' ' + hoerKnapp(it.q, 'Lyssna på frågan') + '</div>';
    } else if (it.om === 'ord') {
      head = '<div class="spr-q-label">' + esc(it.q) + '</div>' +
             '<div class="spr-word">' + esc(it.text) + '</div>';
    } else if (it.om === 'instr') {
      head = '<div class="spr-quote">' + esc(it.text) + '</div>' +
             '<div class="spr-q-label">' + esc(it.q) + '</div>';
    } else {
      head = '<div class="spr-text"><p>' + esc(it.text) + '</p></div>' +
             '<div class="spr-q-label">' + esc(it.q) + '</div>';
    }
    var alts = it.alt.map(function (a, i) {
      return '<button type="button" class="spr-alt spr-talt" data-i="' + i + '">' +
             '<span class="spr-alt-t">' + esc(a) + '</span>' +
             (lyssna ? hoerKnapp(a, 'Lyssna på svaret') : '') + '</button>';
    }).join('');
    var planerat = 0;
    for (var k = 1; k <= 4; k++) planerat += test.per[k].length;
    var pct = Math.round((test.svar.length / planerat) * 100);

    $('#sprTest').innerHTML =
      '<div class="spr-top">' +
      '<button type="button" class="spr-back" id="sprTestAvbryt">← Avbryt</button>' +
      '<div class="spr-progress"><div class="spr-progress-bar" style="width:' + pct + '%"></div></div>' +
      '<span class="spr-count">Del ' + test.niva + ' av 4</span>' +
      '</div>' +
      head +
      '<div class="spr-alts">' + alts + '</div>' +
      '<button type="button" class="spr-talt spr-vetinte" data-i="-1">Vet inte</button>';
  }

  function testSvar(i) {
    if (!test || test.klar || !test.per) return;
    var it = test.per[test.niva][test.idx];
    test.svar.push({ n: it.n, om: it.om, ratt: i === it.r, vetInte: i === -1 });
    test.idx++;
    if (test.idx >= test.per[test.niva].length) {
      var nivaSvar = test.svar.filter(function (s) { return s.n === test.niva; });
      var andel = nivaSvar.filter(function (s) { return s.ratt; }).length / nivaSvar.length;
      if (andel < AVBRYT || test.niva === 4) return avslutaTest();
      test.niva++;
      test.idx = 0;
    }
    renderTestFraga();
  }

  function avslutaTest() {
    test.klar = true;
    var aktivSek = timer.stopp();
    tts.cancel();

    var nivaer = {}, delar = {}, vikt = 0;
    test.svar.forEach(function (s) {
      nivaer[s.n] = nivaer[s.n] || { ratt: 0, tot: 0 };
      nivaer[s.n].tot++;
      delar[s.om] = delar[s.om] || { ratt: 0, tot: 0 };
      delar[s.om].tot++;
      if (s.ratt) { nivaer[s.n].ratt++; delar[s.om].ratt++; vikt += s.n; }
    });

    // Steg = högsta nivån där den och alla under ligger på minst 70 %
    var steg = 0;
    for (var n = 1; n <= 4; n++) {
      var x = nivaer[n];
      if (x && x.tot && x.ratt / x.tot >= KLARAR) steg = n; else break;
    }
    // Poäng 0–100, viktad efter nivå. Nivåer som aldrig nåddes ger 0.
    var poang = Math.round(100 * vikt / (PER_NIVA * 10));

    var p = loadProgress();
    var hist = Array.isArray(p._test) ? p._test : [];
    var forra = hist.length ? hist[hist.length - 1] : null;
    var res = {
      datum: new Date().toISOString(),
      steg: steg, poang: poang,
      nivaer: nivaer, delar: delar,
      vetInte: test.svar.filter(function (s) { return s.vetInte; }).length,
      sfi: test.sfi || null,
      tidSek: aktivSek,
      version: TEST_VERSION
    };
    hist.push(res);
    p._test = hist;
    if (test.sfi) p._sfi = test.sfi;
    p._uppdaterad = res.datum;
    saveProgress(p);
    renderTestResultat(res, forra && forra.version === res.version ? forra : null);
  }

  function renderTestResultat(r, forra) {
    var s = STEG[r.steg];
    var diff = forra ? r.poang - forra.poang : null;
    var diffTxt = diff === null ? 'Första testet. Nu har du en startpunkt att jämföra med.'
      : diff > 0 ? '↑ ' + diff + ' poäng sedan ' + kortDatum(forra.datum)
      : diff < 0 ? '↓ ' + Math.abs(diff) + ' poäng sedan ' + kortDatum(forra.datum) + '. Det händer — en dålig dag påverkar.'
      : 'Samma som ' + kortDatum(forra.datum) + '.';

    var skala = [1, 2, 3, 4].map(function (n) {
      return '<div class="spr-skala-steg' + (n <= r.steg ? ' spr-skala-steg--nadd' : '') + '">' +
             '<span>' + n + '</span><small>' + esc(STEG[n].namn) + '</small></div>';
    }).join('');

    var delarHtml = Object.keys(OMRADEN).filter(function (k) { return r.delar[k]; }).map(function (k) {
      var d = r.delar[k];
      return '<div class="spr-del"><div class="spr-del-h"><span>' + esc(OMRADEN[k].namn) + '</span>' +
             '<b>' + d.ratt + ' av ' + d.tot + '</b></div>' +
             '<div class="spr-del-bar"><div style="width:' + Math.round((d.ratt / d.tot) * 100) + '%"></div></div></div>';
    }).join('');

    // Svagaste området med minst två frågor blir rekommendationen
    var svag = null;
    Object.keys(r.delar).forEach(function (k) {
      var d = r.delar[k];
      if (d.tot < 2) return;
      var a = d.ratt / d.tot;
      if (!svag || a < svag.a) svag = { k: k, a: a };
    });
    var rek = svag
      ? '<div class="spr-rek"><div><span class="spr-q-label">Träna mest på</span><b>' + esc(OMRADEN[svag.k].namn) + '</b></div>' +
        '<button type="button" class="spr-secondary spr-goto" data-mode="' + OMRADEN[svag.k].ovning + '">Öppna övningen →</button></div>'
      : '';
    var mal = r.steg < 4
      ? '<p class="spr-sub">Nästa mål: <b>Steg ' + (r.steg + 1) + ' · ' + esc(STEG[r.steg + 1].namn) + '</b></p>'
      : '<p class="spr-sub">Du har nått högsta steget. Fortsätt träna på texterna i ditt yrkesområde.</p>';
    var nasta = new Date(new Date(r.datum).getTime() + 28 * 86400000).toISOString();
    var upplast = (r.steg ? 'Du är på steg ' + r.steg + ', ' + s.namn + '. ' : '') + s.kan;

    $('#sprTest').innerHTML =
      '<div class="spr-result">' +
      '<div class="spr-steg-badge">' + (r.steg ? 'Steg ' + r.steg : 'Start') + '</div>' +
      '<h2 class="spr-h">' + esc(s.namn) + ' ' + hoerKnapp(upplast, 'Lyssna på resultatet') + '</h2>' +
      '<p class="spr-sub">' + esc(s.kan) + '</p>' +
      '<div class="spr-skala">' + skala + '</div>' +
      '<div class="spr-poang"><b>' + r.poang + '</b> poäng av 100<span>' + esc(diffTxt) + '</span></div>' +
      mal +
      '<div class="spr-delar">' + delarHtml + '</div>' +
      rek +
      '<p class="spr-hint">Gör testet igen omkring ' + kortDatum(nasta) + ', så ser du hur du har utvecklats.</p>' +
      (r.tidSek >= 60 ? '<p class="spr-hint">⏱ Testtid: ' + formatTid(r.tidSek) + '</p>' : '') +
      '<button type="button" class="spr-next" id="sprTestKlar">Klar</button>' +
      '</div>';
  }

  // ── Händelser (delegerade — UI:t byggs om hela tiden) ───────
  function bindEvents() {
    var root = getRoot();
    if (!root || root.dataset.sprBound === '1') return;

    root.addEventListener('click', function (e) {
      timer.puls();
      var hear = e.target.closest('.spr-hear');
      if (hear) { e.preventDefault(); e.stopPropagation(); tts.speak(hear.dataset.say, hear); return; }

      if (e.target.closest('#sprOpenTest')) { tts.cancel(); renderTestIntro(); return; }
      var sfiBtn = e.target.closest('.spr-sfi');
      if (sfiBtn) {
        if (!test) test = {};
        test.sfi = test.sfi === sfiBtn.dataset.sfi ? null : sfiBtn.dataset.sfi;
        Array.prototype.forEach.call(document.querySelectorAll('#trainView-sprak .spr-sfi'), function (b) {
          var on = b.dataset.sfi === test.sfi;
          b.classList.toggle('spr-sfi--on', on);
          b.setAttribute('aria-pressed', String(on));
        });
        return;
      }
      if (e.target.closest('#sprStartTest')) { tts.cancel(); startTest(); return; }
      var talt = e.target.closest('.spr-talt');
      if (talt) { tts.cancel(); testSvar(Number(talt.dataset.i)); return; }
      if (e.target.closest('#sprTestAvbryt')) { timer.stopp(); tts.cancel(); test = null; renderBranches(); showScreen('setup'); return; }
      if (e.target.closest('#sprTestKlar')) { test = null; renderBranches(); showScreen('setup'); return; }
      var gt = e.target.closest('.spr-goto');
      if (gt) { test = null; state.branch = 'allmant'; renderMenu(); startOvning(gt.dataset.mode); return; }

      var br = e.target.closest('.spr-branch');
      if (br) { state.branch = br.dataset.branch; renderMenu(); showScreen('menu'); return; }

      var md = e.target.closest('.spr-mode');
      if (md) { startOvning(md.dataset.mode); return; }

      var alt = e.target.closest('.spr-alt');
      if (alt && !alt.classList.contains('spr-alt--locked')) { answer(Number(alt.dataset.i)); return; }

      if (e.target.closest('#sprNext')) { next(); return; }
      if (e.target.closest('#sprAgain')) { startOvning(state.mode); return; }
      if (e.target.closest('#sprToMenu')) { tts.cancel(); renderMenu(); showScreen('menu'); return; }
      if (e.target.closest('#sprBackMenu')) { timer.stopp(); tts.cancel(); renderMenu(); showScreen('menu'); return; }
      if (e.target.closest('#sprBackSetup')) { tts.cancel(); renderBranches(); showScreen('setup'); return; }
    });

    root.dataset.sprBound = '1';
  }

  // ── Publikt API ─────────────────────────────────────────────
  window.sprInit = function () {
    if (!buildUI()) {
      console.warn('[Språk] #trainView-sprak hittades inte');
      return;
    }
    bindEvents();
    tts.init();
    renderBranches();
    showScreen('setup');
  };

  window.sprCleanup = function () { tts.cancel(); };

  // Hur många pass deltagaren gjort totalt — används av Träna-hubben
  window.sprSummary = function () {
    var p = loadProgress(), pass = 0, ratt = 0, tot = 0, tid = 0;
    Object.keys(p).forEach(function (b) {
      if (b.charAt(0) === '_') return;
      Object.keys(p[b]).forEach(function (m) {
        pass += p[b][m].pass || 0; ratt += p[b][m].ratt || 0;
        tot += p[b][m].totalt || 0; tid += p[b][m].tidSek || 0;
      });
    });
    (Array.isArray(p._test) ? p._test : []).forEach(function (t) { tid += t.tidSek || 0; });
    var t = senasteTest();
    return {
      pass: pass, ratt: ratt, totalt: tot, tidSek: tid,
      tidText: formatTid(tid),
      andel: tot ? Math.round((ratt / tot) * 100) : null,
      test: t ? { steg: t.steg, namn: STEG[t.steg].namn, poang: t.poang, datum: t.datum } : null
    };
  };
})();
