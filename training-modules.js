/* ============================================================
   CVmatchen — Träningsmoduler (delad data)
   ============================================================
   Den här filen innehåller all modul-data (lektioner, quiz,
   övningar) som används av både mobilen (index.html) och
   desktopversionen (desktop.html + desktop-app.js).

   Datan exponeras globalt via `window.TRAINING_DATA` så att
   både filer kan läsa samma källa. Ändringar görs HÄR — sen
   slipper man synka mellan mobil och desktop.

   Struktur:
     INTRO    — 1 modul   (Regler & Rättigheter)
     ARBETE   — 5 moduler (jobb-relaterat)
     HALSA    — 8 moduler (hälsa & välmående)
     EKONOMI  — 8 moduler (privatekonomi)
     DIGITAL  — 4 moduler (digitala verktyg)
     STUDIER  — 6 moduler (utbildning)

   Ladda denna fil FÖRE desktop-app.js (eller motsvarande
   skript som använder TRAINING_DATA).
   ============================================================ */

(function() {
  'use strict';

var INTRO=[
{id:'m1',icon:'📋',title:'Regler & Rättigheter',sub:'Närvaro, frånvaro & skyldigheter',color:'#3eb489',bc:'rgba(62,180,137,.3)',bg:'rgba(62,180,137,.07)',video:'/videos/m1-regler.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🎯',h:'Vad är syftet?',t:'Förstå vad ekonomiskt bistånd är, vilka rättigheter och skyldigheter du har, och hur kravet på aktivitet fungerar.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Vad ekonomiskt bistånd är och vem som beslutar, vad kravet på aktivitet innebär, hur du äger din egen planering, samt närvaro, frånvaro och dina rättigheter.'},
{icon:'✅',h:'När du är klar ska du...',t:'känna dig trygg i hur systemet fungerar, veta vilka krav som ställs — och framför allt hur du själv kan påverka din väg mot jobb och självförsörjning.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 4 minuter för film och lektionerna, plus en kort skrivövning där du formulerar ett frånvaromeddelande.'}
],
a:'Den här modulen är grunden i plattformen och ska ge en tydlig förståelse för det svenska biståndssystemet. Efter modulen ska du kunna besvara: "Vad förväntas av mig?" och "Hur tar jag kontroll över min situation?"'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom vad ekonomiskt bistånd är, vad kravet på aktivitet innebär, och vilka rättigheter och skyldigheter du har. Se den först, så blir lektionerna lättare att följa.'},
{t:'Ekonomiskt bistånd & försörjningsstöd',
cards:[
{icon:'🛟',h:'Sista skyddsnätet',t:'Ekonomiskt bistånd är samhällets sista skyddsnät när du inte kan försörja dig själv.'},
{icon:'🏷️',h:'Flera namn — samma sak',t:'Det kallas också försörjningsstöd eller socialbidrag.'},
{icon:'🎬',h:'Se filmen ovan',t:'Attention förklarar hur ekonomiskt bistånd fungerar i Sverige. Nästa lektion går in på kravet på aktivitet.'}
],a:'Ekonomiskt bistånd regleras i Socialtjänstlagen (SoL). Rätten prövas individuellt av kommunens socialtjänst. Biståndet består av två delar: riksnorm (mat, kläder, hygien, fritid) + skäliga kostnader (hyra, el, hemförsäkring, arbetsresor). För att få bistånd måste du först ha uttömt andra möjligheter — a-kassa, sjukpenning, föräldrapenning, bostadsbidrag m.m.',yt:'https://www.youtube.com/embed/PieoOiL4Lug'},
{t:'Vad är aktivitetskrav?',
cards:[
{icon:'✅',h:'Vad räknas som aktivitet?',t:'Delta i möten, söka jobb aktivt, delta i praktik eller utbildning, och stå till arbetsmarknadens förfogande.'},
{icon:'💡',h:'Du äger din planering',t:'Kom förberedd, föreslå egna idéer, säg ifrån. Handläggaren är din partner — ni gör planen tillsammans.'},
{icon:'📝',h:'Visa vad du gjort',t:'Dokumentera varje vecka: sökta jobb, möten och aktiviteter. Handläggaren kan fråga när som helst.'},
{icon:'🛡️',h:'Giltiga skäl finns',t:'Sjukdom, VAB, begravning eller en arbetsintervju är giltiga skäl. Meddela alltid.'},
{icon:'⚠️',h:'Om du inte gör din del',t:'Tackar du nej till rimligt jobb utan skäl: först varning, sedan kan ersättningen sänkas. Du får alltid en chans att förklara.'}
],
a:'Aktivitetskravet är lagstadgat i Socialtjänstlagen (SoL 4 kap. 4§). Kommunen får ställa krav på att den biståndsberättigade deltar i praktik eller kompetenshöjande åtgärd.\n\nKravet ska vara individanpassat — hänsyn tas till ålder, hälsa, familjesituation och språk. Vid giltig frånvaro (sjukdom, VAB) påverkas inte biståndet. Vid ogiltig frånvaro eller vägran kan handläggaren sänka eller avslå bistånd.\n\nForskning visar att individer som är delaktiga i sin planering och känner ägarskap över målen har betydligt högre chans att nå självförsörjning. Delaktighet är inte bara en rättighet — det är en framgångsfaktor.\n\nDu har alltid rätt att:\n- Få skriftligt beslut\n- Få motivering till beslutet\n- Överklaga till Förvaltningsrätten inom 3 veckor\n- Få hjälp med överklagan från socialtjänsten\n\nVanliga missförstånd:\n- "Jag måste söka 20 jobb i veckan" → Antalet bestäms individuellt.\n- "Aktivitetskrav = jag måste ta VILKET jobb som helst" → Nej, det ska vara rimligt utifrån din bakgrund.\n- "Om jag pluggar slipper jag kravet" → Studier måste vara godkända av handläggaren.'},
{t:'Närvaro & frånvaro',
cards:[
{icon:'📞',h:'Meddela samma dag',t:'Helst innan aktiviteten börjar — ring, mejla eller sms:a din handläggare.'},
{icon:'📄',h:'Läkarintyg',t:'Lämnas om det krävs, vanligtvis från dag 8.'},
{icon:'⚠️',h:'Ogiltig frånvaro',t:'Kan påverka din ersättning — så meddela alltid.'}
],a:'Frånvaro ska alltid meddelas samma dag, helst innan aktiviteten börjar. Vid upprepad frånvaro kan handläggaren begära intyg eller uppdaterad planering. Förstadagsintyg kan krävas vid frekvent korttidsfrånvaro.'},
{t:'Rättigheter & skyldigheter',
cards:[
{icon:'🛡️',h:'Dina rättigheter',t:'En individuell plan, tydlig information om beslut, skälig handläggningstid, och att bli bemött med respekt.'},
{icon:'⚖️',h:'Rätt att överklaga',t:'Du kan överklaga beslut du inte håller med om.'},
{icon:'🤝',h:'Dina skyldigheter',t:'Delta aktivt, lämna korrekta uppgifter, och följa planen.'},
{icon:'🔔',h:'Meddela ändringar',t:'Säg till om jobb, inkomst eller boende ändras.'}
],a:'Du har rätt till en individuell plan, tydlig kommunikation och skälig handläggningstid. Beslut kan överklagas till förvaltningsrätten. Du har skyldighet att medverka aktivt, lämna korrekta uppgifter och följa beslutade aktiviteter. Felaktiga uppgifter kan leda till återkrav eller polisanmälan vid bidragsbrott.'}
],
ex:{type:'write',title:'Skriv ett frånvaromeddelande',desc:'Du är sjuk och kan inte delta i dagens aktivitet. Skriv ett korrekt och professionellt meddelande till din handläggare.',tips:'Inkludera: vem du är, vilken aktivitet du missar, varför du är frånvarande och när du förväntar dig att vara tillbaka.',ph:'Hej [handläggarens namn],\n\nJag heter... och deltar i...\n\nJag kan idag inte delta på grund av...\n\nJag förväntar mig att vara tillbaka...',min:80},
quiz:[{q:'Vad är ekonomiskt bistånd?',o:['Samhällets sista skyddsnät när du inte kan försörja dig','En förmån alla får','En pension'],c:0},{q:'Vad kallas ekonomiskt bistånd också?',o:['Aktivitetsstöd','Studiemedel','Försörjningsstöd eller socialbidrag'],c:2},{q:'Vem bedömer rätten till bistånd?',o:['Arbetsförmedlingen','Kommunens socialtjänst','Försäkringskassan'],c:1},{q:'Vad betyder "stå till arbetsmarknadens förfogande"?',o:['Att vara arbetslös','Att ha jobb','Att vara redo att ta ett jobb direkt'],c:2},{q:'Vem äger din planering?',o:['Du själv — tillsammans med handläggaren','Handläggaren','Socialtjänsten'],c:0},{q:'Vad ökar chansen att nå självförsörjning?',o:['Att vänta passivt','Att vara delaktig och äga sin planering','Att tacka ja till allt'],c:1},{q:'Vad betyder aktivitetskrav?',o:['Du behöver inte meddela frånvaro','Du ska delta i planerade aktiviteter','Du kan göra vad du vill'],c:1},{q:'När ska du meddela frånvaro?',o:['Samma dag','Dagen efter','Nästa vecka'],c:0},{q:'Vad händer om du tackar nej till ett rimligt jobb?',o:['Du får mer bistånd','Ingenting','Ersättningen kan sänkas eller dras in'],c:2},{q:'Vad är en rättighet?',o:['Något du har rätt till','Något du är tvungen att göra','En aktivitet'],c:0}],
pr:['Förklara mina skyldigheter på enkel svenska.','Skriv ett korrekt meddelande om sjukfrånvaro.','Sammanfatta aktivitetskrav i tre meningar.']},
{id:'m2',icon:'💻',title:'SKills-systemet',sub:'Introduktion till SKills & din plan',color:'#f0c040',bc:'rgba(240,192,64,.3)',bg:'rgba(240,192,64,.07)',video:'/videos/m2-skills.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🎯',h:'Vad är syftet?',t:'Förstå vad SKills är och hur du använder verktyget för att hålla koll på din plan och dina aktiviteter.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Vad SKills är, hur du använder det i praktiken, och hur det hänger ihop med CVmatchen.'},
{icon:'✅',h:'När du är klar ska du...',t:'kunna logga in i SKills, se och följa din plan, och veta hur SKills och CVmatchen kompletterar varandra.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 3 minuter för film och de tre lektionerna, plus en kort sorteringsövning.'}
],
a:'SKills är ditt digitala planeringsverktyg. Den här modulen ger dig snabbstarten.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen visar vad SKills är, hur du använder det, och hur det hänger ihop med CVmatchen. Se den först, så blir lektionerna lättare att följa.'},
{t:'Vad är SKills?',
cards:[
{icon:'💻',h:'Ditt planeringsverktyg',t:'SKills är ett digitalt verktyg där du ser din plan, dina aktiviteter och vad du ska göra.'},
{icon:'🤝',h:'Du och handläggaren',t:'Det används för planering, uppföljning och kommunikation mellan dig och din handläggare.'}
],
a:'SKills är ett digitalt verktyg för planering, uppföljning och kommunikation mellan dig och din handläggare.'},
{t:'Så använder du SKills',
cards:[
{icon:'🔑',h:'Logga in',t:'Du loggar in och kommer åt din plan.'},
{icon:'📋',h:'Se din plan',t:'Du ser dina aktiviteter och deadlines.'},
{icon:'✅',h:'Markera vad du gjort',t:'Du bockar av aktiviteter och följer din utveckling.'}
],
a:'Du kan följa din utveckling, se deadlines och kommunicera med handläggare direkt i systemet.'},
{t:'SKills + CVmatchen',
cards:[
{icon:'🗺️',h:'SKills visar VAD',t:'SKills berättar vad du ska göra och när.'},
{icon:'🚀',h:'CVmatchen hjälper dig GÖRA',t:'CVmatchen bygger CV, profiltext och matchningar du använder i din SKills-plan.'}
],
a:'CVmatchen genererar CV, profiltext och matchningar som du sedan kan använda när du söker jobb i din SKills-plan.'}
],
ex:{type:'sort',title:'SKills eller CVmatchen?',desc:'Sortera funktionerna i rätt verktyg.',catA:'SKills',catB:'CVmatchen',items:[{l:'Se din plan',c:'A'},{l:'Skapa CV',c:'B'},{l:'Markera aktiviteter',c:'A'},{l:'Matcha mot jobb',c:'B'},{l:'Kommunicera med handläggare',c:'A'},{l:'Exportera PDF',c:'B'}]},
quiz:[{q:'Vad är SKills?',o:['Ett planeringsverktyg','En jobbsökarsida','En CV-mall'],c:0},{q:'Vad kan du göra i SKills?',o:['Söka utbildning','Skriva CV','Följa din plan och kommunicera'],c:2},{q:'Hur hänger de ihop?',o:['Ingen koppling','SKills planerar, CVmatchen levererar','De är samma sak'],c:1}],
pr:['Förklara SKills som om jag vore ny i Sverige.','Hjälp mig skapa en veckoplan.','Vad tänker jag på när jag loggar in i SKills?']},

{id:'ai_gen',icon:'🧠',title:'AI som verktyg',sub:'Vad AI är, vilka modeller som finns & hur du använder dem klokt',color:'#38bdf8',bc:'rgba(56,189,248,.3)',bg:'rgba(56,189,248,.07)',video:'/videos/ai-som-verktyg.mp4',videoAfter:3,
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🎯',h:'Vad är syftet?',t:'Förstå AI som verktyg INNAN du börjar använda CVmatchen eller andra AI-tjänster. Du blir betydligt mer effektiv när du vet vad AI är bra på, vad det är dåligt på, och varför det ibland hittar på saker som låter trovärdiga men inte stämmer.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Vad AI tekniskt är (mönster, inte magi), de stora språkmodellerna (ChatGPT, Claude, Gemini), när AI hjälper och när du måste tänka själv, samt prompt-formeln Roll+Uppgift+Kontext och de viktigaste integritetsreglerna.'},
{icon:'✅',h:'När du är klar ska du...',t:'veta när AI hjälper, när du ska tänka själv, och vad du aldrig ska dela. Du har grunden för att skriva bra prompts och kan välja rätt verktyg för rätt uppgift — utan att riskera dina personuppgifter.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 8 minuter för kort, video och reflektion. Lägg till 5 minuter för quizet — 7 frågor som befäster det viktigaste innan du går vidare.'}
],
a:'Denna modul ger dig grunden för att förstå AI som teknik och verktyg. Det är förkunskap inför CVmatchen-modulen — där du tillämpar allt praktiskt i jobbsöket.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'En kort introduktion till vad AI egentligen är — mönster, inte magi — och till de stora språkmodellerna du kommer att stöta på. Filmen ger dig helhetsbilden innan lektionerna går in på detaljerna.'},

{t:'Vad är AI egentligen?',
cards:[
{icon:'🧠',h:'Mönster, inte magi',t:'AI förutsäger nästa ord baserat på miljarder texter den läst. Inget mer mystiskt än så.'},
{icon:'📚',h:'Tränad på internet',t:'Wikipedia, böcker, kod, webbsidor — fram till en viss datum (s.k. kunskapsstopp).'},
{icon:'🤖',h:'Inte människa',t:'AI förstår inte som du. Den ser mönster, men har inga känslor, inga åsikter, ingen vilja.'},
{icon:'⚡',h:'Superpraktikant',t:'Tänk på AI som en jättesnabb praktikant som läst allt — men behöver tydliga instruktioner.'}
],
a:'AI (artificiell intelligens) handlar i praktiken om stora språkmodeller (LLM:er) som tränats på enorma textmängder. De räknar fram statistiskt mest sannolika nästa ord. Det är inte "tänkande" i mänsklig mening — men det är otroligt användbart när du vet vad det är bra på.'},

{t:'De stora modellerna — vem är vem?',
cards:[
{icon:'💬',h:'ChatGPT (OpenAI)',t:'Mest känd. Bred kompetens. Används i CVmatchen för chatten.'},
{icon:'🧠',h:'Claude (Anthropic)',t:'Lång minne, försiktig & ärlig. Stark på resonemang och långa texter.'},
{icon:'🌐',h:'Gemini (Google)',t:'Multimodal — ser bilder, video, ljud. Bra för visuella uppgifter.'},
{icon:'🔓',h:'Llama / Mistral (öppna)',t:'Du kan köra själv lokalt. Mindre kraftfulla men gratis och privata.'}
],
a:'Modellerna utvecklas snabbt — Claude 4.x och GPT-5 är aktuella i 2026. Skillnaderna jämnas ut, men de har olika "personligheter": Claude är mer försiktig, ChatGPT mer kreativ, Gemini mer datadriven. För svenska jobbsökare räcker ChatGPT eller Claude utmärkt.'},

{t:'Vad AI är bra på — och dåligt på',
cards:[
{icon:'✅',h:'Bra: Skriva',t:'Sammanfatta, översätta, formulera utkast, korrekturläsa, koda.'},
{icon:'✅',h:'Bra: Förklara',t:'Förenkla komplexa texter, förklara begrepp på olika nivåer.'},
{icon:'❌',h:'Dåligt: Räkna & fakta',t:'Matte, exakta siffror, färska nyheter, lokala detaljer — kontrollera alltid.'},
{icon:'❌',h:'Dåligt: Döma & välja',t:'AI ska inte ta beslut åt dig. Du är fortfarande chefen — AI är assistenten.'}
],
a:'Generellt: AI är fantastisk på språk och struktur, svagare på exakthet och dom. När du jobbar med jobbansökningar är det perfekt — text och struktur. När du ska räkna lön eller välja yrke — använd AI som bollplank, inte orakel.'},

{t:'Bra prompts = bättre resultat',
cards:[
{icon:'❌',h:'Vag prompt',t:'"Hjälp mig" — AI gissar och du får generiska svar.'},
{icon:'✅',h:'Specifik prompt',t:'"Skriv en pitch som butikssäljare med 3 års erfarenhet."'},
{icon:'🧠',h:'Tre delar i en bra prompt',t:'Roll (vem är du), Uppgift (vad ska AI göra), Kontext (din situation).'},
{icon:'🔄',h:'Iterera',t:'Inte nöjd? Be om revidering: "Gör den kortare", "mer formell". AI lyssnar.'}
],
a:'En bra prompt liknar en bra arbetsorder: tydlig, specifik, med rätt bakgrund. Ju mer relevant info du ger — desto bättre svar. Och var inte rädd för att be om ändringar. AI blir aldrig sur.'},

{t:'Begränsningar & integritet — vad du måste veta',
cards:[
{icon:'🔒',h:'Dela ALDRIG',t:'Personnummer, lösenord, bankuppgifter, känslig sjukinfo, andras personuppgifter.'},
{icon:'📋',h:'Testa själv',t:'"Skulle jag visa detta för en främling?" Är svaret nej — dela inte med AI.'},
{icon:'🤯',h:'Hallucinationer',t:'AI kan hitta på fakta som låter trovärdiga. Kontrollera alltid viktiga uppgifter.'},
{icon:'⚖️',h:'Du är ansvarig',t:'AI skriver — du läser, granskar och tar ansvar för det du skickar in.'}
],
a:'AI-tjänster sparar oftast dina meddelanden för att förbättra modellerna. Det betyder att allt du skriver kan teoretiskt läsas av människor på företaget bakom AI:n. CVmatchen är byggd med integritet i fokus — men generella regeln är: dela inte mer än nödvändigt.'},

{t:'Hur gick det? — sammanfattning',
cards:[
{icon:'🧐',h:'Vad var nytt?',t:'Vilken modell hade du inte hört talas om innan?'},
{icon:'🚀',h:'Nästa steg',t:'Nu går vi vidare till CVmatchen — där tillämpar vi allt detta praktiskt.'},
{icon:'❓',h:'Frågor?',t:'Du kan alltid fråga AI:n i CVmatchen om något känns oklart.'},
{icon:'🏆',h:'Klar!',t:'Du har grunden. Nu kör vi quizet för att befästa kunskapen.'}
],
a:'Att förstå verktyget INNAN man använder det är skillnaden mellan att låta sig kastas runt — eller styra själv. Du har nu förkunskapen för att använda AI klokt i jobbsöket.'}
],
ex:{type:'write',title:'Skriv din första AI-prompt',desc:'Skriv en prompt med alla tre delar: Roll, Uppgift, Kontext. Använd din egen bakgrund.',tips:'Exempel: "Jag är (roll) en undersköterska med 5 års erfarenhet. (Uppgift) Skriv en kort profiltext för en jobbansökan. (Kontext) Jag söker tjänst på äldreboende i Helsingborg och vill betona min lugna och tydliga kommunikation."',ph:'Jag är...\n\nSkriv...\n\nJag söker...',min:60},
quiz:[
{q:'Hur fungerar AI tekniskt sett?',o:['Det tänker som en människa','Det förutsäger nästa ord baserat på mönster','Det söker svar på Google'],c:1},
{q:'Vilken modell är från Anthropic?',o:['ChatGPT','Claude','Gemini'],c:1},
{q:'Vad är AI INTE bra på?',o:['Sammanfatta texter','Översätta','Exakt matematik och färska fakta'],c:2},
{q:'Vad är de tre delarna i en bra prompt?',o:['Roll, Uppgift, Kontext','Hej, fråga, tack','Namn, ålder, mål'],c:0},
{q:'Vad ska du ALDRIG dela med AI?',o:['Din yrkesbakgrund','Personnummer och lösenord','Vad du söker för jobb'],c:1},
{q:'Vad är en "hallucination" hos AI?',o:['En bild AI genererat','När AI hittar på fakta som låter trovärdiga','När AI vägrar svara'],c:1},
{q:'Vem ansvarar för det AI skriver åt dig?',o:['AI-företaget','OpenAI/Anthropic','Du själv'],c:2}
],
pr:['Förklara skillnaden mellan ChatGPT och Claude på enkel svenska.','Skriv en pitch baserat på min bakgrund.','Vad ska jag tänka på när jag delar information med AI?']},

{id:'m3',icon:'🤖',title:'AI & CVmatchen',sub:'Förstå CVmatchen — verktyget som matchar dig mot riktiga jobb',color:'#a78bfa',bc:'rgba(167,139,250,.3)',bg:'rgba(167,139,250,.07)',video:'/videos/m3-cvmatchen.mp4',videoAfter:3,
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🎯',h:'Vad är syftet?',t:'Förstå CVmatchen specifikt — vad plattformen gör, hur den funkar, och vad som är unikt jämfört med LinkedIn eller Arbetsförmedlingens egen söktjänst. Översikten du behöver innan du dyker djupare in i matchnings-tekniken i nästa modul.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Vad CVmatchen är som plattform, det 4-stegs flöde du går igenom (CV → jobb → matchning → export), match/partial/missing-logiken som färgkodar dina träffar, och vad du faktiskt får ut konkret per ansökan.'},
{icon:'✅',h:'När du är klar ska du...',t:'kunna använda CVmatchen självständigt för att söka jobb anpassat efter dig. Du förstår färgkodningen, vet när en match är sök-värd (>70%), och har en realistisk känsla för hur lång tid en ansökan tar när du är van.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 6 minuter för kort, video och reflektion. Quiz och övning lägger till 5–8 minuter om du vill befästa kunskapen direkt innan du provar plattformen skarpt.'}
],
a:'Du har redan grunden om AI från förra modulen ("AI som verktyg"). Den här modulen tillämpar AI:n i ett konkret verktyg — CVmatchen — som är byggt för svenska jobbsökare och används av kommuner runt om i Sverige.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen ger dig översikten av CVmatchen — vad plattformen gör och hur det fyrstegsflöde du ska jobba i hänger ihop. Efter den vet du vad du har framför dig innan lektionerna går in på djupet.'},

{t:'Vad är CVmatchen?',
cards:[
{icon:'🇸🇪',h:'Svensk plattform',t:'Byggd för svenska jobbsökare. Stöd för svenska, lätt svenska, samt andra språk.'},
{icon:'🔗',h:'Kopplad till Platsbanken',t:'Hämtar färska annonser direkt från Arbetsförmedlingens databas.'},
{icon:'🤖',h:'AI-driven matchning',t:'Jämför din profil mot annonsens krav — ord för ord, kompetens för kompetens.'},
{icon:'🎓',h:'Pedagogiskt fokus',t:'Inte bara ett verktyg — också en träningsplattform med moduler som denna.'}
],
a:'CVmatchen är utvecklad av PathfinderAI AB och säljs till svenska kommuner som en del av deras arbetsmarknadsinsatser. Skillnaden mot LinkedIn eller Arbetsförmedlingens egen söktjänst: AI-anpassning av CV och profiltext per annons — automatiskt.'},

{t:'Hur CVmatchen fungerar — 4 steg',
cards:[
{icon:'1️⃣',h:'Bygg ditt CV',t:'Fyll i din erfarenhet — eller låt AI dra den från LinkedIn. Du startar med din historia.'},
{icon:'2️⃣',h:'Hitta riktiga jobb',t:'CVmatchen hämtar tusentals färska annonser från Platsbanken.'},
{icon:'3️⃣',h:'AI matchar & anpassar',t:'Din profil skräddarsys mot varje annons — automatiskt, på sekunder.'},
{icon:'4️⃣',h:'Exportera & skicka',t:'PDF-CV redo att skicka — anpassad till just det jobbet du söker.'}
],
a:'Hela flödet — från tom profil till skickad ansökan — tar i regel under 10 minuter när du blivit van. Du kan när som helst pausa och fortsätta senare. All data lagras säkert i din profil.'},

{t:'Vad får du ut? — match-resultaten',
cards:[
{icon:'🚦',h:'Färgkodat resultat',t:'AI:n färgmarkerar varje koppling: grönt, gult, rött. Du ser direkt var du står.'},
{icon:'📊',h:'En procent-siffra',t:'Sammanvägd match — över 70% = sök! Under 40% = leta vidare.'},
{icon:'💡',h:'Tre profiltext-utkast',t:'AI skriver tre olika versioner att välja mellan eller mixa.'},
{icon:'🎓',h:'Djupare i nästa modul',t:'I "Matcha med AI" tränar du hur du tolkar färgerna och flyttar dem.'}
],
a:'Match-resultaten är CVmatchens huvudleverans. Den här modulen ger dig översikten — exakt hur match/partial/missing fungerar och hur du styr resultatet får du i nästa modul "Matcha med AI".'},

{t:'Hur gick det? — sammanfattning',
cards:[
{icon:'🧐',h:'Vad var nytt?',t:'Att CVmatchen är kopplad till Platsbanken? Eller att flödet tar under 10 minuter när du är van?'},
{icon:'🚀',h:'Nästa steg',t:'Gå vidare till "Matcha med AI" — där du djupdyker i matchnings-logiken.'},
{icon:'❓',h:'Fastnat?',t:'Ställ frågor direkt till AI-coachen i CVmatchen-appen.'},
{icon:'🏆',h:'Klar!',t:'Du förstår vad CVmatchen är och hur flödet ser ut. Nu testar vi det i quizet.'}
],
a:'Den här modulen är översikten. När du förstår vad CVmatchen är och hur flödet fungerar går nästa modul djupare in i matchnings-logiken — där tränar du hur du läser färgerna och flyttar resultaten.'}
],
ex:{type:'build',title:'Förbered en jobbsökning',desc:'Tänk dig en jobbannons du vill söka — fyll i dessa fält.',fields:[{l:'Vilket jobb söker du?',ph:'t.ex. lagerarbetare, kock, säljare...',hint:'Var specifik.'},{l:'3 styrkor du har som matchar',ph:'t.ex. erfarenhet av truck, lugn, lagspelare...'},{l:'1 lucka du behöver adressera',ph:'t.ex. saknar B-körkort men kan ta det...',hint:'Var ärlig — det imponerar mer än att överdriva.'}]},
quiz:[
{q:'Vad är CVmatchen kopplad till?',o:['LinkedIn','Platsbanken (Arbetsförmedlingen)','Indeed'],c:1},
{q:'Vilka är de 4 stegen i CVmatchen?',o:['Sök / klicka / skicka / vänta','Bygg CV / Hitta jobb / AI matchar / Exportera','Logga in / surf / mejla / klar'],c:1},
{q:'Vad är CVmatchens styrka jämfört med andra jobbsajter?',o:['Flest annonser','AI-anpassning av CV och profiltext per annons','Lägst pris'],c:1},
{q:'När är match-procenten sök-värd?',o:['Under 30%','Över 70%','Spelar ingen roll'],c:1},
{q:'Hur många profiltext-utkast genererar AI per matchning?',o:['Ett','Tre','Tio'],c:1},
{q:'Vart djupdyker du i match-logiken (färger, ATS, nyckelord)?',o:['I CVmatchen-modulen','I modulen "Matcha med AI"','I modulen "CV-byggaren"'],c:1},
{q:'Hur lång tid tar hela flödet — från tom profil till skickad ansökan, när du är van?',o:['Under 10 minuter','En timme','En arbetsdag'],c:0}
],
pr:['Förklara skillnaden mellan Match, Partial och Missing.','Hjälp mig formulera en partial-match till en starkare formulering.','Vad ska jag skriva när jag saknar en kompetens?']}
];

var ARBETE=[
{id:'a0',icon:'📊',title:'Arbetsmarknaden',sub:'Sverige, Skåne & Öresundsregionen',color:'#f87171',bc:'rgba(248,113,113,.3)',bg:'rgba(248,113,113,.07)',video:'/videos/arbetsmarknaden.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🎯',h:'Vad är syftet?',t:'Förstå hur arbetsmarknaden faktiskt ser ut — i Sverige, i Skåne och i Öresundsregionen. När du vet var jobben finns och vilka sektorer som växer kan du rikta ditt jobbsökande dit chanserna är störst.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Den svenska arbetsmarknaden 2026 med färska siffror, Skåne i förhållande till resten av landet och till Danmark, samt vilka sektorer som faktiskt anställer i Helsingborg — och hur Öresundsbron öppnar en hel andra arbetsmarknad.'},
{icon:'✅',h:'När du är klar ska du...',t:'kunna läsa arbetsmarknaden bortom rubrikerna — veta var bristen på personal är störst, förstå pendlingen över Öresund, och kunna peka ut vilka sektorer i din region som anställer just nu.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 6 minuter för film och de tre lektionerna. Lägg till några minuter för kart-övningen där du själv utforskar arbetslösheten stad för stad i Skåne.'}
],
a:'Den här modulen ger dig faktabilden av arbetsmarknaden — grunden du behöver innan du börjar söka jobb på riktigt. Siffrorna bygger på SCB och Eurostat.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen ger dig en överblick av läget på arbetsmarknaden — Sverige, Skåne och Öresundsregionen. Den sätter ramen för lektionerna som sedan går in på siffrorna och möjligheterna.'},
{t:'Den svenska arbetsmarknaden',
cards:[
{icon:'👥',h:'5,2 miljoner i arbete',t:'Sverige har cirka 5,2 miljoner sysselsatta — av 10,6 miljoner invånare.'},
{icon:'📊',h:'Arbetslöshet 2026',t:'Sverige 9,7% — bland EU:s högsta. Skåne ~10%, Helsingborg ~9,8%. Bland unga 15–24 år: 30,1%.'},
{icon:'💡',h:'Paradoxen',t:'Samtidigt saknar Sverige 30 000+ specialister inom IT & cyber — medan lågutbildade har svårt att hitta jobb. Den mismatchen är dagens största strukturproblem.'},
{icon:'🏥',h:'Största sektorer',t:'Vård & omsorg störst. Bygg pressat av höga räntor. Lager & logistik växer snabbt. IT & digitalt har lägst arbetslöshet.'}
],
a:'Arbetsmarknaden mäts av SCB via AKU (Arbetskraftsundersökning) och rapporteras till Eurostat enligt ILO-standard. Ungdomsarbetslöshet 15–24 år är ca dubbelt det totala. Strukturproblemet 2026: en mismatch mellan tillgänglig arbetskraft och faktiskt behov — 30 000+ specialister saknas inom IT/cybersäkerhet.'},
{t:'Skåne och Öresundsregionen',
cards:[
{icon:'📍',h:'Skåne',t:'1,4 miljoner invånare — Sveriges tredje största exportlän.'},
{icon:'📊',h:'Två länder, två siffror',t:'Sverige 9,7% arbetslöshet. Danmark 2,7% officiellt (Statistics Denmark) — en helt annan arbetsmarknad granne med dig.'},
{icon:'💱',h:'Valutan gör skillnad',t:'1 dansk krona = 1,45 svenska kronor (2026). Samma jobb kan ge 30–50% mer hem efter växling.'},
{icon:'👥',h:'20 000 pendlar dagligen',t:'Cirka 20 000 svenskar pendlar varje dag över Öresund till danska jobb. EU:s fria rörlighet gör regionen till en gemensam arbetsmarknad.'}
],
a:'Öresundsbron öppnade 2000 och integrerade arbetsmarknaden. EU-medborgarskap ger fri rörlighet. Den danska "officiella" siffran (2,7%) är registerbaserad (Statistics Denmark) — Eurostats LFS-mätning ligger på ~6,5% (jämförbar med Sveriges 9,7%). Båda är korrekta — olika metoder. Valutaeffekten har förstärkts 2024–2026 i takt med att SEK försvagats. Skatt betalas i arbetslandet, deklaration krävs i båda länder.'},
{t:'Helsingborgs arbetsmarknad',
cards:[
{icon:'🏙️',h:'Sveriges 8:e största stad',t:'Helsingborg har cirka 115 000 invånare.'},
{icon:'🏭',h:'Starka sektorer lokalt',t:'Industri & livsmedel (Findus, IKEA, Perstorp), logistik & hamn (en av Sveriges 5 största), vård via Region Skåne, samt handel & service.'},
{icon:'⛴️',h:'Danmark 20 minuter bort',t:'Färjan till Helsingör tar 20 minuter — Region Hovedstaden ligger granne.'},
{icon:'💼',h:'H+ skapar nya jobb',t:'Stadsomvandlingsprojektet H+ skapar tusentals nya jobb i Helsingborg framöver.'}
],
a:'H+ stadsomvandlingsprojektet skapar tusentals nya jobb i Helsingborg. Arbetsförmedlingen Helsingborg: Järnvägsgatan 14. Jobbtorg Helsingborg erbjuder kostnadsfri matchning och coachning för invånare. Helsingborgs hamn är en av Sveriges fem största — drar lager, truck och logistik-jobb. Vården (Region Skåne) har konstant rekryteringsbehov, särskilt undersköterskor och sjuksköterskor.'}
],
ex:{type:'arb-map',title:'Utforska arbetslösheten i Skåne',desc:'Interaktiv karta nedan — klicka på en stad för att se arbetslöshet, sektorer och insikter. Data från SCB och Arbetsförmedlingen.'},
quiz:[
{q:'Vad är Sveriges arbetslöshet 2026 enligt Eurostat?',o:['5,2%','9,7%','15,3%'],c:1},
{q:'Hur många pendlar dagligen över Öresund?',o:['2 000','200 000','20 000'],c:2},
{q:'Vilken sektor har generellt lägst arbetslöshet i Sverige?',o:['IT & digitalt','Bygg','Handel'],c:0},
{q:'Hur lång är färjan Helsingborg–Helsingör?',o:['20 min','45 min','5 min'],c:0},
{q:'Vad är Danmarks officiella arbetslöshet 2026?',o:['2,7%','6,5%','9,7%'],c:0},
{q:'Hur mycket är 1 DKK i SEK idag?',o:['0,75 SEK','1,45 SEK','3,20 SEK'],c:1},
{q:'Vad är ungdomsarbetslösheten 15–24 år i Sverige?',o:['8,5%','15%','30,1%'],c:2},
{q:'Hur många specialister saknas inom IT/cyber i Sverige?',o:['1 000+','30 000+','500 000+'],c:1},
{q:'Vilken är Sveriges tredje största exportregion?',o:['Stockholm','Skåne','Norrbotten'],c:1},
{q:'Vilken är Helsingborgs största arbetsgivare?',o:['IKEA','Region Skåne','Findus'],c:1},
{q:'Vad krävs för att jobba i Danmark som bor i Sverige?',o:['Svenskt medborgarskap','Pass + visum','EU-medborgarskap räcker'],c:2},
{q:'Vilken metod använder Eurostat för att mäta arbetslöshet?',o:['Register-baserad','Labour Force Survey (ILO-standard)','Valundersökning'],c:1}
],
pr:['Vilka jobb finns just nu i Helsingborg?','Hur söker jag jobb i Danmark som bor i Sverige?','Vilka branscher rekryterar mest i Skåne nu?','Räkna ut min faktiska timlön i Danmark efter växling.','Vilka utbildningar leder snabbast till jobb inom vård i Helsingborg?']},

{id:'a_match',icon:'🎯',title:'Matcha med AI',sub:'Förstå matchningslogiken innan du kör skarpt',color:'#f87171',bc:'rgba(248,113,113,.3)',bg:'rgba(248,113,113,.07)',video:'/videos/matcha.mp4',videoAfter:3,
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🎯',h:'Vad är syftet?',t:'Bemästra CVmatchens matchnings-logik så du kan STYRA resultatet — inte bara konsumera det. När du förstår VARFÖR färgerna ser ut som de gör kan du flytta dem uppåt och få fler träffar på de jobb du verkligen vill ha.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'AI-matchning på djupet (NLP & semantisk likhet), nyckelord & ATS-systemen som filtrerar CV automatiskt, samt de tre profiltexterna och när du väljer vilken. Allt med konkreta exempel från svenska arbetsmarknaden.'},
{icon:'✅',h:'När du är klar ska du...',t:'veta hur du maximerar MATCH (gröna), omformulerar PARTIAL (gula) till starkare formuleringar, och hanterar MISSING (röda) ärligt utan att skrämma rekryteraren. Du kan tolka procent-resultatet och vet när det är värt att söka.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 7 minuter för kort, video och reflektion. Räkna med ytterligare 5–10 minuter om du vill göra quizet och övningen direkt efter — då sitter logiken på riktigt.'}
],
a:'Förkunskap: du har gjort modulen "AI & CVmatchen" (m3) som introducerade match/partial/missing. Här går vi djupare — så du kan tävla på samma villkor som rekryterare och deras ATS-system.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen förklarar grunderna i hur CVmatchens matchning fungerar och varför träffarna färgkodas som de gör. Den lägger grunden så att lektionerna sedan kan visa hur du styr resultatet.'},

{t:'Vad är AI-matchning — på djupet?',
cards:[
{icon:'🧠',h:'NLP-driven',t:'Bygger på Natural Language Processing. AI jämför betydelse, inte bara exakta ord.'},
{icon:'🔗',h:'Semantisk likhet',t:'"Truckkörning" matchar "truck A+B". Du behöver inte ha exakt samma ord som annonsen.'},
{icon:'🟡',h:'Partial = guld',t:'Visar var du är nära. Här ligger din chans att lyfta fram överförbar kompetens.'},
{icon:'⚙️',h:'Inte felfri',t:'AI kan missa kontext. Granska alltid — du vet bäst vad du faktiskt kan.'}
],
a:'Matchning bygger på vektorisering av text — meningar blir koordinater i ett semantiskt rum. Närbesläktade begrepp hamnar nära varandra geometriskt. Det är så AI kan se att "kundbemötande" och "service" är samma kompetens — utan att orden är identiska.'},

{t:'Nyckelord & ATS — det dolda spelet',
cards:[
{icon:'🤖',h:'ATS rangordnar',t:'Applicant Tracking Systems läser CV automatiskt och rangordnar — saknas nyckelord hamnar du längre ned i högen.'},
{icon:'📊',h:'Stora bolag använder dem',t:'Vanligast hos stora arbetsgivare och rekryteringsbyråer. Småföretag granskar oftare manuellt.'},
{icon:'⏱️',h:'Få sekunder per CV',t:'Rekryterare lägger i regel under 10 sekunder på första genomläsningen (Ladders-studie 2018: 7,4 sek).'},
{icon:'🎯',h:'Maximera MATCH',t:'Lyft de gröna orden överst i CV. Omformulera gula så kopplingen blir tydlig.'}
],
a:'Nyckelord ska finnas i tre lager: profiltext, kompetenslista och i konkreta arbetsuppgifter. Inte bara listas — visas i kontext. AI-matchningen i CVmatchen hjälper dig hitta vilka ord som behövs för en specifik annons.'},

{t:'De tre profiltexterna — vinklar att välja mellan',
cards:[
{icon:'📌',h:'Erfarenhetsfokus',t:'"5 år inom lager, van vid WMS." Passar stora bolag, traditionella rekryterare.'},
{icon:'💡',h:'Motivationsfokus',t:'"Driven av att effektivisera flöden." Passar startups, kulturfokuserade bolag.'},
{icon:'🏆',h:'Kompetens & resultat',t:'"Reducerade plocktid med 23%." Passar datadrivna roller och chefsjobb.'},
{icon:'🧩',h:'Blanda gärna',t:'Inget tvång att välja en. Mixa delar för perfekt match mot just den annonsen.'}
],
a:'Tre profiltexter är inte godtyckligt — varje vinkel löser ett specifikt rekryteringsproblem. Vid karriärskifte → Motivation (du har inte rätt erfarenhet). Vid intern karriär → Resultat (du behöver visa progression). Vid första jobbet → Erfarenhet (utbildning + småjobb + praktik).'},

{t:'Hur gick det? — sammanfattning',
cards:[
{icon:'🧐',h:'Vad var nytt?',t:'NLP, semantisk likhet — eller hur de tre profiltext-vinklarna fungerar?'},
{icon:'🚀',h:'Nästa steg',t:'Testa skarpt — kör din egen profil genom CVmatchen och se färgerna live.'},
{icon:'❓',h:'Frågor?',t:'AI-coachen i CVmatchen kan analysera en specifik annons åt dig.'},
{icon:'🏆',h:'Klar!',t:'Du är beredd. Quiz visar att kunskapen sitter.'}
],
a:'Matchningslogiken är CVmatchens kärna — när du förstår den styr du resultatet. När du inte förstår den blir du frustrerad av "varför fick jag bara 42%". Nu vet du varför färgerna ser ut som de gör — och hur du kan flytta dem uppåt.'}
],
ex:{type:'match-trainer',title:'Träna matchningslogiken',desc:'Info → Quiz → Miniövning — förstå allt innan du kör skarpt.'},
quiz:[
{q:'Vad innebär "partial match"?',o:['Du saknar kompetensen helt','Du har liknande erfarenhet — kan formuleras om','Du har exakt kompetensen'],c:1},
{q:'Vad bygger AI-matchningen tekniskt på?',o:['Slumpgenerator','NLP — semantisk likhet, betydelse','Manuell granskning'],c:1},
{q:'Varför är nyckelord kritiska i CV?',o:['Rekryterare läser dem sist','Ser proffsigare ut','ATS-system filtrerar bort CV utan rätt nyckelord'],c:2},
{q:'Hur lång tid lägger en rekryterare i regel på första genomläsningen?',o:['30 sekunder','2 minuter','Under 10 sekunder'],c:2},
{q:'Vad gör ATS-system i praktiken?',o:['Skickar autosvar till alla sökanden','Rangordnar CV automatiskt — saknas nyckelord hamnar du längre ned','Bokar intervjuer åt rekryteraren'],c:1},
{q:'Vilken profiltext-vinkel passar bäst vid karriärskifte?',o:['Motivationsfokus','Kompetens & resultat','Erfarenhetsfokus'],c:0},
{q:'Vilken vinkel passar bäst för datadrivna chefsroller?',o:['Erfarenhetsfokus','Motivationsfokus','Kompetens & resultat'],c:2},
{q:'Vad betyder MISSING-flaggan?',o:['Sök inte jobbet','Visa viljan att lära','Ljug om kompetensen'],c:1},
{q:'Måste man välja EN av de tre profiltext-varianterna?',o:['Ja, bara en','Nej, kan blanda delar','Bara om man inte har erfarenhet'],c:1}
],
pr:['Analysera min matchning mot denna annons: [klistra in]','Vilken profiltext-vinkel passar bäst för mitt fall?','Skriv om detta CV-avsnitt för bättre nyckelordsmatch.','Hitta de viktigaste nyckelorden i denna annons: [klistra in]','Föreslå hur jag kan formulera om "MISSING"-områden positivt.']},

{id:'a_cv',icon:'📄',title:'CV-byggaren',sub:'Förstå varje del INNAN du fyller i ditt riktiga CV',color:'#f87171',bc:'rgba(248,113,113,.3)',bg:'rgba(248,113,113,.07)',video:'/videos/cv-byggaren.mp4',videoAfter:3,
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🎯',h:'Vad är syftet?',t:'Bygg ett CV som FUNGERAR — anpassat per ansökan, läsbart för både rekryterare och ATS-system, och ärligt om både styrkor och luckor. Tänk på CV:t som din marknadsföring, inte din biografi.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Vad som faktiskt gör ett CV bra (under 10 sekunder vid första urval), profiltext-formeln Vem+Kan+Söker, hur man skriver arbetsuppgifter som säljer (Handling+Skala/Resultat), samt de vanligaste flosklerna att undvika.'},
{icon:'✅',h:'När du är klar ska du...',t:'kunna skriva varje CV-del medvetet — inte bara fylla i fält i blindo. Du vet vilka ord rekryterare reagerar på, hur du kvantifierar utan att överdriva, och varför du behöver flera versioner av ditt CV.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 7 minuter för kort, video och reflektion. Sedan är du redo att fylla i CVmatchens CV-byggare med struktur — räkna med 15–20 minuter för ett första utkast.'}
],
a:'Innan du börjar fylla i CVmatchens CV-byggare — förstå varje del. Då blir resultatet starkare. Den här modulen ger dig formlerna och vinklarna som rekryterare faktiskt reagerar på.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen visar vad som faktiskt gör ett CV starkt — och varför de första sekunderna avgör. Se den först, så blir formlerna i lektionerna lättare att ta till sig.'},

{t:'Vad gör ett CV BRA?',
cards:[
{icon:'🎯',h:'Marknadsföring',t:'CV är din marknadsföring — inte din biografi. Vad du sålde till köparen, inte allt du gjort.'},
{icon:'🔄',h:'Anpassat',t:'Justera per ansökan. Olika tjänster behöver olika versioner av dig.'},
{icon:'👀',h:'Skumbart',t:'Rekryteraren skummar — sätt det viktigaste högst upp och först i varje rad.'},
{icon:'✅',h:'Ärligt & konkret',t:'Aldrig ljug. Använd siffror där det går — det är trovärdigare än adjektiv.'}
],
a:'Ett CV läses i regel under 10 sekunder vid första urvalet. Tydlig struktur, rätt nyckelord och konkreta resultat avgör om du går vidare. Floskler som "driven team-spelare" säger ingenting — siffror och specifika exempel säger allt.'},

{t:'Profiltext — sälj dig på 4 rader',
cards:[
{icon:'❌',h:'Floskel',t:'"Jag är driven och söker ett stimulerande jobb." — Säger inget.'},
{icon:'✅',h:'Konkret',t:'"Lagerarbetare med 4 år på PostNord. Truck A+B, WMS-erfarenhet. Söker nästa steg inom logistik i Helsingborg."'},
{icon:'🧩',h:'Formeln',t:'Vem är du + Vad du kan + Vad du söker = stark profiltext.'},
{icon:'📏',h:'Längd',t:'3–5 meningar. Längre = den läses inte. Kortare = säger för lite.'}
],
a:'CVmatchen genererar profiltext-utkast åt dig — välj en, blanda eller skriv eget. Granska alltid AI:n: den vet inte vilka av dina meriter som är mest relevanta för just det här jobbet. (Strategi för olika vinklar lär du dig i modulen "Matcha med AI".)'},

{t:'Arbetsuppgifter som faktiskt säljer',
cards:[
{icon:'❌',h:'Vagt',t:'"Jobbade i kassan och hjälpte kunder." — Säger ingenting unikt.'},
{icon:'✅',h:'Skarpt',t:'"Hanterade 200+ kundtransaktioner/dag. Ansvarade för kassaavstämning och reklamationer."'},
{icon:'🧮',h:'Formeln',t:'HANDLING + SKALA/RESULTAT = stark beskrivning. Använd siffror där du kan.'},
{icon:'📝',h:'Uppskatta',t:'Minns du inte exakt? Ange ett rimligt intervall ("ca 150-200/dag") — bättre än vagt.'}
],
a:'CVmatchen genererar bullet points baserat på titel + företag. AI gissar baserat på vad rollen vanligtvis innebär — DU har de unika detaljerna. Granska och förfina. Mätbara resultat (%, antal, kronor, tid) lyfter en bullet rejält.'},

{t:'Hur gick det? — sammanfattning',
cards:[
{icon:'🧐',h:'Vad var nytt?',t:'Vilken formel sätter sig — Vem+Kan+Söker eller Handling+Skala?'},
{icon:'🚀',h:'Nästa steg',t:'Öppna CV-byggaren i CVmatchen och börja med din profiltext.'},
{icon:'❓',h:'Frågor?',t:'AI-coachen kan kvantifiera dina arbetsuppgifter åt dig.'},
{icon:'🏆',h:'Klar!',t:'Du har verktygen. Quizet säkrar att kunskapen sitter.'}
],
a:'Formlerna är skelettet — dina specifika fakta är köttet. När du fyller i CVmatchen efter denna modul: tänk på formeln, var ärlig, var konkret. Då blir CV:t starkt.'}
],
ex:{type:'cv-trainer',title:'Träna CV-byggaren',desc:'4 infoskärmar · 6 quizfrågor · Mini-bygge — sedan är du redo för ditt riktiga CV!'},
quiz:[
{q:'Hur lång tid lägger en rekryterare i regel på första genomläsningen?',o:['2 minuter','5 minuter','Under 10 sekunder','30 sekunder'],c:2},
{q:'Vad ska profiltexten besvara?',o:['Vem du är, vad du kan, vad du söker','Ålder, adress och lön','Dina hobbies','Alla jobb du haft'],c:0},
{q:'Hur lång ska profiltexten vara?',o:['1 mening','3–5 meningar','En hel sida'],c:1},
{q:'Vilken formel gäller för starka arbetsuppgifter?',o:['Lång och detaljerad','Handling + Skala/Resultat','Känsla + Personlighet','Kopia från annonsen'],c:1},
{q:'Vad gör en bullet stark?',o:['Många adjektiv','Mätbara resultat — siffror, %, antal','Personliga åsikter'],c:1},
{q:'Minns du inte siffrorna exakt — vad gör du?',o:['Hittar på','Anger ett rimligt intervall ("ca 150–200/dag")','Hoppar över'],c:1},
{q:'Vad är värst för ett CV?',o:['Nyckelord','Floskler som "driven team-spelare"','Konkreta siffror'],c:1},
{q:'CV är din _____ — inte din biografi.',o:['Dagbok','Marknadsföring','Loggbok'],c:1},
{q:'Behöver du anpassa CV per ansökan?',o:['Nej, ett räcker','Ja — olika tjänster kräver olika versioner av dig','Bara om du söker chefsjobb'],c:1},
{q:'Vad gör CVmatchens AI för dina arbetsuppgifter?',o:['Inget','Föreslår bullet points baserat på titel + företag — du granskar och förfinar','Ringer dina referenser'],c:1}
],
pr:['Skriv en profiltext för: [yrkestitel, erfarenhet, stad]','Gör dessa arbetsuppgifter starkare: [klistra in]','Föreslå 8 kompetenser för en [yrkestitel].','Kvantifiera dessa arbetsuppgifter — uppskatta siffror om jag inte minns exakt.','Gör mitt CV ATS-vänligt utan att förlora läsbarhet.']},

{id:'a1',icon:'🧠',title:'Mina kompetenser',sub:'Hårda, mjuka & överförbara',color:'#f87171',bc:'rgba(248,113,113,.3)',bg:'rgba(248,113,113,.07)',video:'/videos/a1-kompetenser.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🧠',h:'Vad är syftet?',t:'Lära dig se vad du faktiskt kan — och hur du beskriver det i CV och intervju.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Vad en kompetens är, skillnaden hårda vs mjuka, och vad överförbara kompetenser betyder.'},
{icon:'✅',h:'När du är klar ska du...',t:'kunna lista dina egna hårda, mjuka och överförbara kompetenser.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 3 minuter för film och lektioner, plus en sorteringsövning.'}
],
a:'Kompetenser är förmågor du använder för att utföra arbetsuppgifter.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom vad kompetenser är, skillnaden mellan hårda och mjuka, och vad överförbara kompetenser betyder. Se den först, så blir lektionerna lättare att följa.'},
{t:'Vad är kompetenser?',
cards:[
{icon:'📚',h:'Lärt i skolan',t:'Det du har läst eller utbildat dig till.'},
{icon:'💼',h:'Lärt på jobbet',t:'Det du har gjort i tidigare roller.'},
{icon:'🌍',h:'Lärt i livet',t:'Hobbyer, ideellt arbete och vardagsförmågor räknas också.'}
],
a:'En kompetens är något du kan — och kan visa. Den kan vara lärt på många olika sätt.'},
{t:'Hårda och mjuka',
cards:[
{icon:'🔧',h:'Hårda — mätbara',t:'Truckkort, Excel, körkort, kassahantering. Kan testas eller styrkas med intyg.'},
{icon:'🤝',h:'Mjuka — sociala',t:'Kommunikation, samarbete, tålamod, empati. Hur du är med andra människor.'}
],
a:'Hårda kompetenser kan certifieras. Mjuka kompetenser handlar om beteenden — minst lika viktiga i många jobb.'},
{t:'Överförbara kompetenser',
cards:[
{icon:'🛎️',h:'Service',t:'Bemötande och kundkontakt.'},
{icon:'🗂️',h:'Planering',t:'Att strukturera och hålla deadlines.'},
{icon:'🎯',h:'Ansvar',t:'Att ta initiativ och se till att saker blir gjorda.'}
],
a:'Överförbara kompetenser fungerar i många yrken — extra viktiga när du byter bransch.'}
],
ex:{type:'sort',title:'Hård eller mjuk kompetens?',desc:'Sortera kompetenserna i rätt kategori.',catA:'🔧 Hård kompetens',catB:'🤝 Mjuk kompetens',items:[{l:'Excel',c:'A'},{l:'Tålamod',c:'B'},{l:'Truckkort',c:'A'},{l:'Samarbete',c:'B'},{l:'Körkort B',c:'A'},{l:'Kommunikation',c:'B'},{l:'Kassahantering',c:'A'},{l:'Empati',c:'B'}]},
quiz:[{q:'Vad är en kompetens?',o:['En utbildning','En förmåga att utföra arbetsuppgifter','Ett certifikat'],c:1},{q:'Vad är en hård kompetens?',o:['Att vara tålmodig','Excel eller truckkort','Att lyssna'],c:1},{q:'Vad är en mjuk kompetens?',o:['Körkort','Samarbete och kommunikation','Programmering'],c:1}],
pr:['Sammanfatta mina kompetenser baserat på: …','Vilka kompetenser passar denna annons?','Förklara hårda vs mjuka kompetenser.']},
{id:'a2',icon:'💪',title:'Styrkor & drivkrafter',sub:'Vad motiverar dig?',color:'#f87171',bc:'rgba(248,113,113,.3)',bg:'rgba(248,113,113,.07)',video:'/videos/a2-styrkor.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'💪',h:'Vad är syftet?',t:'Lära dig se dina styrkor och drivkrafter — och koppla dem till rätt jobb.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Vad en styrka är, vanliga drivkrafter, och hur du parar ihop dem med yrken som passar.'},
{icon:'✅',h:'När du är klar ska du...',t:'kunna lista 3 styrkor och 3 drivkrafter — med konkreta exempel.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 3 minuter för film och lektioner, plus en övning där du fyller i dina egna.'}
],
a:'Att känna sina styrkor är grunden för att argumentera för sig själv i CV och intervju.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom vad styrkor och drivkrafter är, ger konkreta exempel, och visar hur du kopplar dem till yrken. Se den först, så blir lektionerna lättare att följa.'},
{t:'Vad är styrkor?',
cards:[
{icon:'🔁',h:'Återkommande beteende',t:'Något du gör utan att tänka.'},
{icon:'⭐',h:'Du presterar bra',t:'Och andra märker det också.'},
{icon:'💡',h:'Exempel',t:'Lyssna, hjälpa andra, jobba snabbt, lösa problem.'}
],
a:'Styrkor är förmågor du fått beröm för — i vardagen, på jobbet eller i skolan.'},
{t:'Drivkrafter',
cards:[
{icon:'❤️',h:'Hjälpa andra',t:'Du mår bra av att stötta människor.'},
{icon:'📚',h:'Lära nytt',t:'Du tycker om att utvecklas.'},
{icon:'💰',h:'Tjäna pengar',t:'Ekonomisk trygghet driver dig.'},
{icon:'🎯',h:'Påverka',t:'Du vill göra skillnad — för någon eller något.'}
],
a:'Drivkrafter är inre motivationsfaktorer. De påverkar hur du trivs och presterar i ett jobb.'},
{t:'Koppla till jobb',
cards:[
{icon:'🛎️',h:'Service',t:'Du är bra med människor → restaurang, butik, reception.'},
{icon:'🏥',h:'Vård',t:'Du tycker om att hjälpa → undersköterska, vårdbiträde.'},
{icon:'🎓',h:'Utbildning',t:'Du gillar att förklara → lärare, handledare, coach.'}
],
a:'Att koppla styrkor till arbetsuppgifter gör det lättare att argumentera för din kompetens.'}
],
ex:{type:'build',title:'Identifiera dina styrkor',desc:'Beskriv dina starkaste egenskaper med konkreta exempel.',fields:[{l:'Min starkaste styrka',ph:'T.ex. Jag är lösningsorienterad...',hint:'Egenskap du fått beröm för.'},{l:'Konkret exempel',ph:'T.ex. På mitt förra jobb hanterade jag...',ta:true},{l:'Vad motiverar dig mest?',ph:'T.ex. Hjälpa andra, lösa problem...',ta:true,hint:'Din drivkraft hjälper dig hitta rätt jobb.'}]},
quiz:[{q:'Vad är en styrka?',o:['En examen','Beteende där du presterar bra','En arbetsuppgift'],c:1},{q:'Vad är en drivkraft?',o:['En skyldighet','Inre motivation','Ett mål'],c:1},{q:'Varför är styrkor viktiga?',o:['De är inte viktiga','Hjälper dig argumentera för kompetens','Arbetsgivare bryr sig inte'],c:1}],
pr:['Sammanfatta mina styrkor: …','Vilka styrkor passar denna annons?','Beskriv min starkaste egenskap för CV.']},
{id:'a3',icon:'🎯',title:'SMARTA mål',sub:'Sätt tydliga mål',color:'#f87171',bc:'rgba(248,113,113,.3)',bg:'rgba(248,113,113,.07)',video:'/videos/a3-smart.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🎯',h:'Vad är syftet?',t:'Lära dig sätta mål som är tydliga, möjliga att följa upp — och som faktiskt går att nå.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Vad SMARTA mål är, en genomgång av de fem bokstäverna, och exempel på svaga mål jämfört med starka.'},
{icon:'✅',h:'När du är klar ska du...',t:'kunna formulera ett eget SMART mål och veta hur du följer upp det.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 3 minuter för film och lektionerna, plus en övning där du skriver ditt eget mål.'}
],
a:'SMART är en metod för tydliga, mätbara och realistiska mål. Den här modulen ger dig mallen.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom vad SMARTA mål är, de fem bokstäverna, och hur ett otydligt mål blir skarpt. Se den först, så blir lektionerna lättare att följa.'},
{t:'Vad är SMARTA mål?',
cards:[
{icon:'🎯',h:'Tydliga mål',t:'SMARTA mål hjälper dig veta exakt vad du ska göra.'},
{icon:'📈',h:'Går att följa upp',t:'Du kan se om du är på rätt väg — inte bara hoppas.'}
],
a:'SMART är en metod för tydliga, mätbara och realistiska mål.'},
{t:'Genomgång av SMART',
cards:[
{icon:'🔍',h:'S — Specifikt',t:'Målet är tydligt och konkret.'},
{icon:'📏',h:'M — Mätbart',t:'Du kan se framstegen.'},
{icon:'👍',h:'A — Accepterat',t:'Du står själv bakom målet.'},
{icon:'⚖️',h:'R — Realistiskt',t:'Det är möjligt att nå.'},
{icon:'📅',h:'T — Tidsbundet',t:'Det har en deadline.'}
],
a:'Saknas ett av kraven är målet otydligt och svårt att följa upp.'},
{t:'Exempel',
cards:[
{icon:'❌',h:'Inte SMART',t:'"Jag ska söka jobb." — för otydligt, går inte att följa upp.'},
{icon:'✅',h:'SMART',t:'"Jag ska söka 3 jobb per vecka via CVmatchen under april." — specifikt, mätbart och tidsbundet.'}
],
a:'Det smarta målet är specifikt, mätbart, accepterat, realistiskt och tidsbundet.'}
],
ex:{type:'build',title:'Skriv ditt SMARTA mål',desc:'Fyll i varje del av SMART-mallen.',fields:[{l:'S — Specifikt',ph:'T.ex. Söka som lagerarbetare via CVmatchen'},{l:'M — Mätbart',ph:'T.ex. Minst 3 ansökningar/vecka',hint:'Sätt ett konkret antal.'},{l:'A — Accepterat',ph:'T.ex. Ja, jag har 2 timmar varje förmiddag'},{l:'R — Realistiskt',ph:'T.ex. Ja, jag har dator och CV klart'},{l:'T — Tidsbundet',ph:'T.ex. Senast 31 maj 2026',hint:'Sätt ett datum.'},{l:'Ditt kompletta mål',ph:'Skriv ihop hela målet här...',ta:true}]},
quiz:[{q:'Vad betyder S i SMART?',o:['Snabbt','Specifikt','Socialt'],c:1},{q:'Vad betyder T i SMART?',o:['Tydligt','Tidsbundet','Tillgängligt'],c:1},{q:'Vilket är ett SMART mål?',o:['"Söka jobb"','"3 jobb/vecka under april via CVmatchen"','"Jobb snart"'],c:1}],
pr:['Hjälp mig skriva ett SMART mål.','Gör detta mål SMART: "Bli bättre på att söka jobb."','Kontrollera om mitt mål är SMART.']},
{id:'a4',icon:'🎤',title:'Min pitch',sub:'30 sekunder om dig',color:'#f87171',bc:'rgba(248,113,113,.3)',bg:'rgba(248,113,113,.07)',video:'/videos/a4-pitch.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🎤',h:'Vad är syftet?',t:'Lära dig bygga en kort, tydlig presentation av dig själv som fastnar hos den som lyssnar.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Vad en pitch är, en enkel modell i tre steg, och exempel på en svag pitch jämfört med en stark.'},
{icon:'✅',h:'När du är klar ska du...',t:'kunna säga din egen pitch på under 30 sekunder.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 3 minuter för film och lektioner, plus en övning där du skriver din egen pitch.'}
],
a:'En pitch är en kort presentation av vem du är, vad du kan och vad du söker.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom vad en pitch är, modellen i tre steg, och hur en svag pitch blir stark. Se den först, så blir lektionerna lättare att följa.'},
{t:'Vad är en pitch?',
cards:[
{icon:'🎤',h:'Kort presentation',t:'En pitch presenterar vem du är, vad du kan och vad du söker — på kort tid.'},
{icon:'⏱️',h:'30 sekunder',t:'Tänk dig att du har en hissresa på dig. Vad säger du?'}
],
a:'Strukturerad, kortfattad presentation för intervjuer, nätverksevent och ansökan.'},
{t:'3-stegsmodellen',
cards:[
{icon:'1️⃣',h:'Vem jag är',t:'Ditt namn och din bakgrund — kort.'},
{icon:'2️⃣',h:'Vad jag kan',t:'Dina styrkor och din erfarenhet.'},
{icon:'3️⃣',h:'Vad jag söker',t:'Vilken typ av jobb du är ute efter.'}
],
a:'Tre delar som bygger upp en tydlig bild. Håll det under 30 sekunder.'},
{t:'Exempel',
cards:[
{icon:'❌',h:'För tunt',t:'"Jag heter Sara. Jag är bra på service. Jag söker jobb i butik." — säger för lite.'},
{icon:'✅',h:'Starkt',t:'"Jag heter Sara — fyra år inom kundservice. Stark på problemlösning. Söker butik eller reception."'}
],
a:'Den starka pitchen är konkret: en siffra, en styrka och ett tydligt mål.'}
],
ex:{type:'build',title:'Bygg din pitch',desc:'Fyll i 3-stegsmodellen.',fields:[{l:'1. VEM ÄR DU?',ph:'T.ex. Jag heter Maria och har 5 år i kundservice...',ta:true,hint:'Max 2 meningar.'},{l:'2. VAD KAN DU?',ph:'T.ex. Mina sidor är kundkontakt, kassahantering...',ta:true},{l:'3. VAD SÖKER DU?',ph:'T.ex. Jag söker en ny tjänst inom butik...',ta:true},{l:'Din kompletta pitch',ph:'Skriv ihop alla tre delar...',ta:true,hint:'Läs högt — ca 25-30 sekunder.'}]},
quiz:[{q:'Vad är en pitch?',o:['Ett CV','Kort presentation av vem du är','En jobbannons'],c:1},{q:'Tre delar som ska ingå?',o:['Namn, ålder, adress','Vem jag är, vad jag kan, vad jag söker','Skola, jobb, hobby'],c:1},{q:'Hur lång?',o:['5 minuter','Under 30 sekunder','2 meningar max'],c:1}],
pr:['Skapa en pitch baserat på mina styrkor.','Förbättra min pitch.','Gör min pitch kortare.']},
{id:'a5',icon:'📋',title:'Förstå jobbannonser',sub:'Krav och dolda signaler',color:'#f87171',bc:'rgba(248,113,113,.3)',bg:'rgba(248,113,113,.07)',video:'/videos/a5-annonser.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'📋',h:'Vad är syftet?',t:'Lära dig läsa en jobbannons på riktigt — och hitta vad arbetsgivaren egentligen söker.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Hur en annons är uppbyggd, skillnaden krav vs önskemål, och vad dolda signaler i texten betyder.'},
{icon:'✅',h:'När du är klar ska du...',t:'kunna sortera krav, önskemål och kulturella signaler i en annons.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 3 minuter för film och lektioner, plus en sorteringsövning.'}
],
a:'Att läsa en annons rätt är skillnaden mellan en ansökan som träffar — och en som missar.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom hur en annons är uppbyggd, vad som är krav respektive önskemål, och hur du läser de dolda signalerna. Se den först, så blir lektionerna lättare att följa.'},
{t:'Hur en annons är uppbyggd',
cards:[
{icon:'💼',h:'Rollbeskrivning',t:'Vad jobbet är.'},
{icon:'📝',h:'Arbetsuppgifter',t:'Vad du ska göra.'},
{icon:'🎯',h:'Krav',t:'Vad arbetsgivaren måste ha.'},
{icon:'⭐',h:'Meriterande',t:'Bra att ha — ger fördel.'}
],
a:'En annons säger både vad arbetsgivaren behöver och vilken person de söker.'},
{t:'Krav vs önskemål',
cards:[
{icon:'✅',h:'Krav',t:'Måste ha för att komma till intervju.'},
{icon:'💫',h:'Önskemål',t:'Bra att ha — ger dig en fördel.'}
],
a:'Saknar du ett krav — sök ändå, men var medveten om att andra som har det går först.'},
{t:'Dolda signaler',
cards:[
{icon:'💨',h:'Flexibel',t:'Hög-tempo, växlande uppgifter.'},
{icon:'🎯',h:'Självständig',t:'Förväntas ta egna initiativ.'},
{icon:'🤝',h:'Strukturerad',t:'Ordning, planering, system.'}
],
a:'Kulturella signaler säger vilket tempo, vilken ansvarsnivå och vilken arbetsmiljö du kan vänta dig.'}
],
ex:{type:'sort',title:'Krav eller önskemål?',desc:'Sortera varje punkt.',catA:'Krav (måste ha)',catB:'Önskemål (meriterande)',items:[{l:'Truckkort A+B',c:'A'},{l:'Erfarenhet av WMS',c:'B'},{l:'Körkort B',c:'A'},{l:'Engelska i tal',c:'B'},{l:'Kan arbeta skift',c:'A'},{l:'Erfarenhet av LEAN',c:'B'}]},
quiz:[{q:'Vad är ett krav?',o:['Bra att ha','Måste ha för jobbet','Önskad egenskap'],c:1},{q:'Vad är ett önskemål?',o:['Obligatorisk kompetens','Extra kompetens som ger fördel','Personlighet'],c:1},{q:'Vad är en dold signal?',o:['Felstavning','Kulturella signaler om tempo','Lönen'],c:1}],
pr:['Förklara denna annons: [klistra in]','Viktigaste kompetenserna?','Sammanfatta kravprofilen i 3 punkter.']},
{id:'a6',icon:'🔍',title:'Matchning & analys',sub:'Dina styrkor vs jobbet',color:'#f87171',bc:'rgba(248,113,113,.3)',bg:'rgba(248,113,113,.07)',video:'/videos/a6-matchning.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🔍',h:'Vad är syftet?',t:'Lära dig jämföra dig själv med ett jobb — och se var du står starkt eller har luckor.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Vad matchning är, skillnaden styrkor vs luckor, och hur CVmatchen-verktyget hjälper dig.'},
{icon:'✅',h:'När du är klar ska du...',t:'kunna göra en egen matchningsanalys mot en jobbannons.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 3 minuter för film och lektioner, plus en övning där du analyserar en riktig annons.'}
],
a:'Matchning ger riktning — och visar exakt vilka kompetenser du behöver lyfta eller lära dig.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom vad matchning är, hur CVmatchens AI tänker med färgerna grönt-gult-rött, och varför luckor är möjligheter. Se den först, så blir lektionerna lättare att följa.'},
{t:'Vad är matchning?',
cards:[
{icon:'📋',h:'Vad kräver annonsen?',t:'Krav, önskemål och de dolda signalerna.'},
{icon:'💼',h:'Vad har du i bagaget?',t:'Erfarenhet, utbildning och styrkor.'},
{icon:'🔍',h:'Var matchar det?',t:'Där du är stark — och var luckorna finns.'}
],
a:'Matchning är jämförelsen mellan dig och jobbet — bortom magkänsla, med struktur.'},
{t:'Styrkor vs luckor',
cards:[
{icon:'✅',h:'Styrkor',t:'Det du redan kan — lyft fram tydligt.'},
{icon:'📚',h:'Luckor',t:'Det du behöver lära — ofta räcker en kort kurs.'},
{icon:'💡',h:'Tänk om',t:'Luckor är möjligheter — inte hinder.'}
],
a:'Båda sidor är lika viktiga. En lucka som syns kan fyllas — en lucka som du gömmer blir ett problem.'},
{t:'CVmatchen som verktyg',
cards:[
{icon:'1️⃣',h:'Bygg CV',t:'I appen — eller importera från LinkedIn.'},
{icon:'2️⃣',h:'Sök annonser',t:'Färska jobb från Platsbanken.'},
{icon:'3️⃣',h:'AI matchar',t:'Grönt = perfekt match, gult = något liknande, rött = luckan finns.'},
{icon:'4️⃣',h:'Exportera CV',t:'PDF anpassat efter just den annonsen.'}
],
a:'CVmatchen analyserar annonsens krav mot din profil och hjälper dig formulera om — på sekunder.'}
],
ex:{type:'build',title:'Din matchningsanalys',desc:'Välj en annons och gör matchningsanalysen.',fields:[{l:'Vilket jobb?',ph:'T.ex. Lagerarbetare hos PostNord'},{l:'3 viktigaste krav',ph:'1. \n2. \n3. ',ta:true,hint:'Vad nämns först?'},{l:'Dina styrkor som matchar',ph:'T.ex. Truckkort och 2 år lager...',ta:true},{l:'Dina luckor',ph:'T.ex. Saknar WMS-erfarenhet...',ta:true},{l:'Plan för att täppa till luckorna',ph:'T.ex. Kurs via Komvux...',ta:true,hint:'Luckor är möjligheter!'}]},
quiz:[{q:'Vad är matchning?',o:['Söka många jobb','Jämföra kompetenser med kravprofilen','Skriva CV'],c:1},{q:'Vad är en lucka?',o:['Paus i jobbsök','En kompetens du saknar','Fel i CV'],c:1},{q:'Hur hjälper CVmatchen?',o:['Söker jobb åt dig','Anpassar CV mot annons med AI','Skickar ansökan'],c:1}],
pr:['Analysera annons — styrkor och luckor?','Hur förbättrar jag matchningen?','Vilka kompetenser behöver jag?']},
{id:'a7',icon:'🗓️',title:'Jobbsökstrategi',sub:'Plan och uppföljning',color:'#f87171',bc:'rgba(248,113,113,.3)',bg:'rgba(248,113,113,.07)',video:'/videos/a7-strategi.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🗓️',h:'Vad är syftet?',t:'Bygga en strategi för jobbsöket — så det blir struktur istället för stress.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Varför en strategi behövs, de tre delarna (mål, aktiviteter, uppföljning), och en konkret veckoplan.'},
{icon:'✅',h:'När du är klar ska du...',t:'ha en egen veckoplan med konkreta dagsaktiviteter.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 4 minuter för film och lektioner, plus en övning där du bygger din veckoplan.'}
],
a:'En strategi minskar stress, ökar träffsäkerhet och strukturerar jobbsökandet.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom varför du behöver en strategi, de tre delarna mål–aktiviteter–uppföljning, och en konkret veckoplan. Se den först, så blir lektionerna lättare att följa.'},
{t:'Varför strategi?',
cards:[
{icon:'😌',h:'Mindre stress',t:'Du vet vad du ska göra — varje dag.'},
{icon:'🎯',h:'Högre träffsäkerhet',t:'Du söker rätt jobb — inte allt.'},
{icon:'📐',h:'Struktur',t:'Veckan får en form du kan följa.'}
],
a:'Utan strategi blir jobbsöket lätt slumpmässigt — och det märks i resultaten.'},
{t:'3 delar',
cards:[
{icon:'1️⃣',h:'Mål',t:'Vart du är på väg — vilket yrke, var, när.'},
{icon:'2️⃣',h:'Aktiviteter',t:'Vad du gör varje vecka för att nå målet.'},
{icon:'3️⃣',h:'Uppföljning',t:'Vad som funkade — och inte. Justera löpande.'}
],
a:'Mål ger riktning, aktiviteter ger struktur, uppföljning håller dig på rätt spår.'},
{t:'Veckoplanering',
cards:[
{icon:'💪',h:'Måndag',t:'Sök 3 nya jobb.'},
{icon:'📝',h:'Tisdag',t:'Anpassa CV och brev.'},
{icon:'🤝',h:'Onsdag',t:'Nätverka — kontakta någon.'},
{icon:'🎓',h:'Torsdag',t:'Lär dig något nytt.'},
{icon:'📊',h:'Fredag',t:'Följ upp veckan.'}
],
a:'Varva intensiva uppgifter med enklare — det håller motivationen uppe.'}
],
ex:{type:'build',title:'Bygg din strategi',desc:'Skapa en konkret jobbsökstrategi.',fields:[{l:'Ditt mål',ph:'T.ex. Lagerarbetare senast 1 juni',ta:true},{l:'Kanaler du använder',ph:'T.ex. CVmatchen, Platsbanken, LinkedIn...',hint:'Minst 2-3.'},{l:'Din veckoplan',ph:'Måndag: \nTisdag: \nOnsdag: \nTorsdag: \nFredag: ',ta:true},{l:'Hur följer du upp?',ph:'T.ex. Räknar ansökningar per vecka...',ta:true}]},
quiz:[{q:'Varför strategi?',o:['Behövs inte','Minskar stress och ökar träffsäkerhet','Krav'],c:1},{q:'Tre delar?',o:['CV, ansökan, intervju','Mål, aktiviteter, uppföljning','LinkedIn, e-post, telefon'],c:1},{q:'Vad är en veckoplan?',o:['Lista med jobb','Planering av dagliga aktiviteter','Kalender'],c:1}],
pr:['Skapa strategi baserat på mina mål.','Gör min veckoplan mer realistisk.','Hjälp mig prioritera aktiviteter.']},
{id:'a8',icon:'🤝',title:'Intervju-grunder',sub:'Förberedelse & trygghet',color:'#f87171',bc:'rgba(248,113,113,.3)',bg:'rgba(248,113,113,.07)',video:'/videos/a8-intervju.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🎯',h:'Vad är syftet?',t:'Förbereda dig inför jobbintervjun — så att du känner dig trygg och kan visa vad du går för.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Vad en intervju är, vanliga frågor, kroppsspråk, och hur du avslutar starkt.'},
{icon:'✅',h:'När du är klar ska du...',t:'veta vad som händer i en intervju, ha förberett dina svar, och känna dig lugnare inför mötet.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 4 minuter för film och lektionerna, plus en övning där du skriver dina intervjusvar.'}
],
a:'Intervjun är en strukturerad bedömning av kompetens, beteende och motivation — och ditt tillfälle att bedöma jobbet. Den här modulen gör dig redo.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen förbereder dig inför intervjun — vad som händer, vanliga frågor och hur du känner dig trygg. Se den först, så blir lektionerna lättare att följa.'},
{t:'Vad är en intervju?',
cards:[
{icon:'💬',h:'Ett samtal',t:'Arbetsgivaren vill lära känna dig — din kompetens och motivation.'},
{icon:'🔄',h:'Det går åt två håll',t:'Det är också din chans att bedöma om jobbet passar dig.'}
],
a:'Strukturerad bedömning av kompetens, beteende och motivation — och ditt tillfälle att bedöma jobbet.'},
{t:'Vanliga frågor',
cards:[
{icon:'🙋',h:'Berätta om dig själv',t:'Använd din pitch som start.'},
{icon:'🎯',h:'Varför söker du jobbet?',t:'Visa att du vet något om företaget.'},
{icon:'💪',h:'Dina styrkor?',t:'Ge ett konkret exempel.'},
{icon:'🌱',h:'Dina svagheter?',t:'En äkta svaghet — och hur du jobbar på den.'}
],
a:'Förbered konkreta svar. Använd din pitch för "berätta om dig själv".'},
{t:'Kroppsspråk',
cards:[
{icon:'🪑',h:'Sitt rakt',t:'En öppen, rak hållning.'},
{icon:'😊',h:'Le och ha ögonkontakt',t:'Titta in i kameran eller på den du pratar med.'},
{icon:'🗣️',h:'Lugn röst, ta pauser',t:'Pauser är okej — de visar att du tänker.'}
],
a:'Lugn röst, tydlig struktur. Pauser är okej — visar att du tänker.'}
],
ex:{type:'build',title:'Förbered dina intervjusvar',desc:'Skriv svar på de vanligaste frågorna.',fields:[{l:'"Berätta om dig själv"',ph:'Jag heter... och har...',ta:true,hint:'Max 60 sek.'},{l:'"Varför söker du jobbet?"',ph:'Jag söker för att...',ta:true},{l:'"Din styrka?"',ph:'Min starkaste egenskap är... t.ex...',ta:true,hint:'Ge konkret exempel!'},{l:'"Din svaghet?"',ph:'Jag kan ibland vara... men jobbar på det...',ta:true,hint:'Äkta svaghet + hur du jobbar på den.'}]},
quiz:[{q:'Syftet med intervjun?',o:['Testa kunskaper','Arbetsgivaren lär känna dig','Skriva kontrakt'],c:1},{q:'Vanlig intervjufråga?',o:['"Favoritfilm?"','"Berätta om dig själv"','"Vad tjänar du?"'],c:1},{q:'Bra kroppsspråk?',o:['Kryssa armarna','Sitta rakt, le, ögonkontakt','Titta ner'],c:1}],
pr:['Hjälp mig svara: Berätta om dig själv.','Förbättra mina intervjusvar.','Frågor att förbereda inför lagerintervju?']},
{id:'a9',icon:'⭐',title:'STAR-metoden',sub:'Konkreta exempel i intervjun',color:'#f87171',bc:'rgba(248,113,113,.3)',bg:'rgba(248,113,113,.07)',video:'/videos/a9-star.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'⭐',h:'Vad är syftet?',t:'Lära dig svara på beteendefrågor i intervjun med struktur — konkret och övertygande.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Vad STAR är, en genomgång av varje bokstav, och vanliga frågor som passar metoden.'},
{icon:'✅',h:'När du är klar ska du...',t:'kunna bygga ett komplett STAR-svar utifrån en egen situation.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 3 minuter för film och lektioner, plus en övning där du skriver ditt eget STAR-svar.'}
],
a:'STAR är beprövad metod för strukturerade, övertygande svar på beteendefrågor.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom varje bokstav i STAR — Situation, Task, Action, Result — och vilka intervjufrågor som passar metoden. Se den först, så blir lektionerna lättare att följa.'},
{t:'Vad är STAR?',
cards:[
{icon:'🅂',h:'S — Situation',t:'Var och när hände det?'},
{icon:'🅃',h:'T — Task',t:'Vad var din uppgift?'},
{icon:'🄰',h:'A — Action',t:'Vad gjorde DU? Inte teamet — du.'},
{icon:'🅁',h:'R — Result',t:'Vad blev resultatet? Siffror om du har dem.'}
],
a:'Fyra delar — tillsammans gör de ditt svar tydligt och övertygande.'},
{t:'I praktiken',
cards:[
{icon:'😡',h:'S — Situation',t:'En kund blev upprörd över en felleverans.'},
{icon:'🎯',h:'T — Task',t:'Min uppgift var att lösa det snabbt utan att förlora kunden.'},
{icon:'👂',h:'A — Action',t:'Jag lyssnade, bad om ursäkt och ersatte produkten samma dag.'},
{icon:'🎉',h:'R — Result',t:'Kunden blev nöjd och kom tillbaka. Min chef berömde hanteringen.'}
],
a:'Fokusera på VAD DU gjorde — inte vad teamet gjorde.'},
{t:'Vanliga STAR-frågor',
cards:[
{icon:'💪',h:'Utmaning',t:'"Berätta om en utmaning du löst."'},
{icon:'🤝',h:'Samarbete',t:'"Ge ett exempel på bra samarbete."'},
{icon:'😤',h:'Konflikt',t:'"Hur hanterade du en svår kund eller kollega?"'}
],
a:'Alla frågor som börjar med "berätta om", "ge ett exempel" eller "hur hanterade du" passar STAR.'}
],
ex:{type:'build',title:'Bygg ditt STAR-svar',desc:'Välj en situation och bygg ett fullständigt svar.',fields:[{l:'S — Situation',ph:'T.ex. Jobbade på ICA en fredagskväll...',ta:true,hint:'Beskriv kort.'},{l:'T — Din uppgift',ph:'T.ex. Hålla flödet igång...',ta:true},{l:'A — Vad DU gjorde',ph:'T.ex. Öppnade extra kassa, kommunicerade...',ta:true,hint:'DU — inte teamet.'},{l:'R — Resultatet',ph:'T.ex. Kö minskade, chef berömde mig...',ta:true,hint:'Mätbart = starkt.'},{l:'Komplett STAR-svar',ph:'Skriv hela svaret naturligt...',ta:true}]},
quiz:[{q:'S i STAR?',o:['Styrka','Situation','Strategi'],c:1},{q:'R i STAR?',o:['Roll','Resultat','Relation'],c:1},{q:'Vilken fråga passar STAR?',o:['"Heter du?"','"Utmaning du löst?"','"Lönen?"'],c:1}],
pr:['STAR-svar baserat på: …','Förbättra mitt STAR-svar.','Hitta ett STAR-exempel från mitt liv.']},
{id:'a10',icon:'🧘',title:'Kommunikation & trygghet',sub:'Hantera nervositet',color:'#f87171',bc:'rgba(248,113,113,.3)',bg:'rgba(248,113,113,.07)',video:'/videos/a10-trygghet.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🧘',h:'Vad är syftet?',t:'Lära dig kommunicera tydligt, hantera nervositet och avsluta intervjun starkt.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Tydlig kommunikation, andningstekniker, förberedelse — och hur du avslutar mötet.'},
{icon:'✅',h:'När du är klar ska du...',t:'ha en konkret trygghetsplan inför nästa intervju.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 3 minuter för film och lektioner, plus en övning där du bygger din egen plan.'}
],
a:'Nervositet är normalt. Förberedelse är bästa motgiftet.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom tydlig kommunikation, pausens kraft, andning för att hantera nerver, och hur du avslutar intervjun. Se den först, så blir lektionerna lättare att följa.'},
{t:'Tydlig kommunikation',
cards:[
{icon:'✂️',h:'Korta meningar',t:'Lättare att följa — för båda.'},
{icon:'🧱',h:'Tydlig struktur',t:'Säg ett, två, tre — eller använd STAR.'},
{icon:'🐌',h:'Tala lugnt',t:'Lugnet smittar av sig på den som lyssnar.'},
{icon:'🤐',h:'Pausen är din vän',t:'Du behöver inte fylla varje tystnad.'}
],
a:'Anpassa språket till den du pratar med. Undvik för långa svar — håll dig till poängen.'},
{t:'Hantera nervositet',
cards:[
{icon:'🌬️',h:'Andas djupt',t:'Tre djupa andetag innan du svarar.'},
{icon:'📖',h:'Förbered dig',t:'Skriv 3 styrkor och 3 STAR-historier i förväg.'},
{icon:'🌙',h:'Kvällen innan',t:'Lägg fram kläderna, repetera pitchen, sov i tid.'}
],
a:'Det är okej att ta paus — och okej att vara nervös. Allt det går att hantera med förberedelse.'},
{t:'Avslutning',
cards:[
{icon:'❓',h:'Ställ minst en fråga',t:'"Hur ser första halvåret ut?" eller "Vad är viktigast för att lyckas?"'},
{icon:'🙏',h:'Tacka för mötet',t:'Visar respekt — och artighet.'},
{icon:'➡️',h:'Fråga om nästa steg',t:'Då vet du när du kan vänta dig svar.'}
],
a:'Genomtänkta frågor visar engagemang — och ger dig ofta värdefull information om jobbet.'}
],
ex:{type:'build',title:'Din trygghetsplan',desc:'Plan för att känna dig trygg i intervjun.',fields:[{l:'3 frågor till arbetsgivaren',ph:'1. Hur ser intro ut?\n2. Vad är viktigast för att lyckas?\n3. Hur ser teamet ut?',ta:true,hint:'Visar engagemang.'},{l:'Min nervositetsplan',ph:'T.ex. 3 djupa andetag, påminn om mina styrkor...',ta:true},{l:'Kvällen innan',ph:'T.ex. Lägger fram kläder, repeterar pitch...',ta:true},{l:'Mina 3 styrkor att lyfta',ph:'1. \n2. \n3. ',ta:true}]},
quiz:[{q:'Tydlig kommunikation?',o:['Prata länge','Korta strukturerade meningar','Aldrig pausa'],c:1},{q:'Minska nervositet?',o:['Undvika förberedelse','Djupandning och förberedelse','Prata snabbt'],c:1},{q:'Sist i intervjun?',o:['Bara gå','Frågor, tack och nästa steg?','Fråga om du fick jobbet'],c:1}],
pr:['Formulera lugna intervjusvar.','Trygghetsplan inför imorgon.','3 bra frågor att ställa i slutet.']},

{id:'a_akassa',icon:'🛡️',title:'A-kassa & Facket',sub:'Ditt ekonomiska skyddsnät',color:'#f87171',bc:'rgba(248,113,113,.3)',bg:'rgba(248,113,113,.07)',video:'/videos/aakassa-skyddsnat.mp4',lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🛡️',h:'Vad är syftet?',t:'Förstå skillnaden mellan a-kassa och fack — och välja rätt skydd för dig.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Vad a-kassa är, vilka villkor som gäller, hur du väljer kassa, och vad facket gör för dig.'},
{icon:'✅',h:'När du är klar ska du...',t:'veta vilken a-kassa och vilket fack som passar din bransch — och vad det kostar.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 3 minuter för film och lektioner, plus en planeringsövning.'}
],
a:'A-kassan är arbetslöshetsersättning, facket förhandlar villkor — två olika saker, båda värda att förstå.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom vad a-kassan är, grundvillkoren, hur du väljer rätt kassa, och vad facket gör. Se den först, så blir lektionerna lättare att följa.'},
{t:'Vad är A-kassa?',
cards:[
{icon:'💰',h:'Upp till 80 % av lönen',t:'De första 200 dagarna.'},
{icon:'📅',h:'Upp till 300 dagar',t:'Hela ersättningsperioden.'},
{icon:'🔍',h:'Kräver aktiv jobbsökning',t:'Du måste söka jobb varje vecka.'},
{icon:'🏢',h:'Söks via din a-kassa',t:'Inte via Arbetsförmedlingen.'}
],
a:'Grundvillkor: arbetat minst 80 timmar/mån i 12 månader. Inkomstrelaterad ersättning kan ge upp till 1 200 kr/dag de första 200 dagarna.'},
{t:'Välj rätt a-kassa',
cards:[
{icon:'🏥',h:'Kommunal',t:'Vård och omsorg.'},
{icon:'🏗️',h:'Byggnads',t:'Bygg och anläggning.'},
{icon:'💼',h:'Unionen',t:'Tjänstemän.'},
{icon:'🌐',h:'Alfa-kassan',t:'Passar alla branscher — tryggt val om du är osäker.'}
],
a:'Alfakassan är öppen för alla som inte tillhör en specifik branschkassa. Ny på arbetsmarknaden eller byter bransch? Alfa är ett tryggt val.'},
{t:'Facket — vad och varför?',
cards:[
{icon:'📜',h:'Kollektivavtal',t:'Säkrar schyssta branschvillkor.'},
{icon:'⚖️',h:'Juridisk hjälp',t:'Vid tvist med arbetsgivaren.'},
{icon:'💬',h:'Löneförhandlingsstöd',t:'Du står inte ensam.'}
],
a:'De tre stora: LO (blå krage), TCO (tjänstemän), SACO (akademiker). Kollektivavtal täcker ca 90 % av arbetstagare — men juridisk hjälp kräver medlemskap.'},
{t:'Vad det kostar',
cards:[
{icon:'🛡️',h:'A-kassan',t:'80–130 kr/mån — en billig försäkring.'},
{icon:'🤝',h:'Facket',t:'200–400 kr/mån — inkluderar oftast a-kassan.'}
],
a:'Inte med ännu? alfakassan.se fungerar för alla — skaffa skyddet idag.'}
],ex:{type:'build',title:'Planera ditt skyddsnät',desc:'Sätt upp din A-kassa och fackplan.',fields:[{l:'Vilken bransch jobbar du i/siktar på?',ph:'T.ex. Lager, vård, bygg...'},{l:'Vilken a-kassa passar?',ph:'T.ex. Alfa-kassan — passar alla',hint:'alfakassan.se'},{l:'Vilket fackförbund?',ph:'T.ex. Kommunal, Transport, Unionen...'},{l:'Är du med? Om nej — nästa steg?',ph:'T.ex. Ansöker till Alfa-kassan den här veckan...'}]},quiz:[{q:'Vad krävs för A-kassa?',o:['Bara AF-inskriven','Arbetat 80 tim/mån i 12 mån + aktivt söka','Vara med i facket','Fast anst.'],c:1},{q:'Vad kostar A-kassan?',o:['Gratis','80-130 kr/mån','500 kr/mån','1000 kr/mån'],c:1},{q:'Vad ger kollektivavtal?',o:['Bara löneökning','Schyssta branschvillkor','Obligatorisk fackansl.','Gratis juridik alla'],c:1},{q:'Vilken a-kassa passar alla?',o:['Kommunal','Alfa-kassan','Unionen','Byggnads'],c:1}],pr:['Vilken a-kassa för [yrke]?','Skillnad facket vs a-kassan?','A-kassan om jag jobbar extra?']},

{id:'a_brev',icon:'✉️',title:'Personligt brev',sub:'Skrivet rätt öppnar det dörren',color:'#f87171',bc:'rgba(248,113,113,.3)',bg:'rgba(248,113,113,.07)',video:'/videos/abrev-brev.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🎯',h:'Vad är syftet?',t:'Förstå vad ett personligt brev ska göra — och hur du skriver ett som faktiskt öppnar dörren.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Vad brevet är till för, dess fyra delar, hur du skriver en stark öppningsmening och en proaktiv avslutning.'},
{icon:'✅',h:'När du är klar ska du...',t:'kunna bygga ett personligt brev med rätt struktur, skriva en öppning som fångar, och avsluta proaktivt.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 4 minuter för film och de tre lektionerna, plus en skrivövning där du formulerar din egen öppningsmening.'}
],
a:'Det personliga brevet visar vem du är och varför just det här jobbet. Den här modulen ger dig formeln.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen visar vad ett personligt brev är, hur det är uppbyggt, och hur du får det att nå fram. Se den först, så blir lektionerna lättare att följa.'},
{t:'Vad är ett personligt brev?',cards:[
{icon:'🆚',h:'CV vs. brev',t:'CV:t visar VAD du gjort. Brevet visar VEM du är och VARFÖR just det här jobbet.'},
{icon:'🪝',h:'1 — Fånga intresset',t:'En stark inledande mening.'},
{icon:'🏢',h:'2 — Varför jobbet?',t:'Varför just det här jobbet och företaget.'},
{icon:'💪',h:'3 — Dina styrkor',t:'De styrkor som matchar tjänsten.'},
{icon:'📣',h:'4 — Avslutning',t:'En tydlig uppmaning. Håll hela brevet till max en sida — runt 300 ord.'}
],a:'Rekryterare läser brevet för att bedöma personlighet och motivation. Generiska brev sorteras bort. Anpassa varje brev — 20-30 min per ansökan.'},{t:'Öppningsmening — gör den oemotståndlig',cards:[
{icon:'❌',h:'Undvik det generiska',t:'"Jag söker härmed tjänsten som..." — det säger ingenting och läses inte vidare.'},
{icon:'✅',h:'Börja med något konkret',t:'"Tre år på PostNords lager lärde mig att logistik handlar om mer än orderrader — det handlar om att hela kedjan håller."'},
{icon:'🎯',h:'Fånga — rapportera inte',t:'Inled med en situation, ett resultat eller en insikt. Inte ditt namn — det vet rekryteraren redan.'}
],a:'Öppningar som fastnar: en situation, ett resultat eller en insikt. Undvik: "Jag heter X och söker tjänsten som Y" — det vet rekryteraren redan.'},{t:'Avslutning med call to action',cards:[
{icon:'❌',h:'Undvik det passiva',t:'"Hoppas att jag får höra från er" — för svagt.'},
{icon:'✅',h:'Var proaktiv',t:'"Jag ser fram emot att berätta mer i en intervju." Eller: "Jag hör av mig på fredag om ni inte hört av er."'},
{icon:'💪',h:'Det visar självförtroende',t:'En proaktiv avslutning ökar chansen att bli kontaktad. Tacka för läsningen — be inte om ursäkt.'}
],a:'Proaktiv avslutning ökar callback-frekvensen. Tacka för läsningen. Undvik att be om ursäkter för bristande kompetens.'}],ex:{type:'write',title:'Skriv din öppningsmening',desc:'Skriv de 2-3 starkaste inledningsmeningarna för ett personligt brev till ett jobb du söker.',tips:'Börja med en situation, ett resultat eller en insikt — inte "Jag söker härmed...". Visa VEM du är.',ph:'T.ex. "Tre år i lager lärde mig att logistik handlar om mer än orderrader..."',min:80},quiz:[{q:'Vad visar brevet som CV inte visar?',o:['Löneönskemål','Vem du är och varför just detta jobb','Alla utbildningar','Adress'],c:1},{q:'Vilken öppning är starkast?',o:['"Jag söker härmed tjänsten"','"Jag heter Anna och är intresserad"','"300 orderrader/dag lärde mig att tempo och precision inte utesluter varandra."','Alla lika bra'],c:2},{q:'Hur långt bör brevet vara?',o:['1-2 meningar','Ca 300 ord / 1 sida','2-3 sidor','Så långt som möjligt'],c:1},{q:'Vad visar proaktiv avslutning?',o:['Desperation','Självförtroende och genuint intresse','Stress','Dålig etikett'],c:1}],pr:['Skriv personligt brev: [annons + styrkor]','Förbättra min öppningsmening: [klistra in]','Gör detta brev mer specifikt: [klistra in]']},

{id:'a_natverk',icon:'🤝',title:'Nätverkande & dolda jobbet',sub:'40-50% av jobben annonseras aldrig',color:'#f87171',bc:'rgba(248,113,113,.3)',bg:'rgba(248,113,113,.07)',video:'/videos/anatverk-natverk.mp4',lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🤝',h:'Vad är syftet?',t:'Lära dig hitta de jobb som aldrig annonseras — och ta dig in i dem.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Den dolda arbetsmarknaden, kanaler för nätverkande och hur du gör en spontanansökan.'},
{icon:'✅',h:'När du är klar ska du...',t:'kunna skriva en egen spontanansökan och ha en nätverksstrategi för veckan.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 3 minuter för film och lektioner, plus en övning där du planerar dina kontakter.'}
],
a:'40–50 % av tjänstetillsättningar sker via nätverk — det är den dolda arbetsmarknaden.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom den dolda arbetsmarknaden, hur du nätverkar praktiskt och hur du bygger en spontanansökan. Se den först, så blir lektionerna lättare att följa.'},
{t:'Den dolda arbetsmarknaden',
cards:[
{icon:'🕵️',h:'Upp till 50 %',t:'Av alla jobb tillsätts utan att annonsera.'},
{icon:'🤐',h:'Intern rekrytering',t:'Tjänster fylls innan de når annonsen.'},
{icon:'🗣️',h:'Tips från nätverk',t:'Någon känner någon — det är ofta så det funkar.'},
{icon:'📨',h:'Spontanansökningar',t:'Företag rekryterar gärna när rätt person dyker upp.'}
],
a:'Söker du bara annonser missar du hälften av jobben. Ju mer senior tjänsten är, desto vanligare med nätverksrekrytering.'},
{t:'Hur nätverkar du praktiskt?',
cards:[
{icon:'💼',h:'LinkedIn',t:'Kontaktförfrågan + kort meddelande.'},
{icon:'☕',h:'Kaffemöten',t:'"Kan vi ta en kaffe?" — fråga om råd, inte jobb.'},
{icon:'🏛️',h:'AF-evenemang & mässor',t:'Möt arbetsgivare ansikte mot ansikte.'},
{icon:'👥',h:'Gamla kontakter',t:'Ex-kollegor och klasskompisar.'},
{icon:'🎓',h:'Branschföreningar',t:'Samlar både folk och möjligheter.'}
],
a:'"Kan du berätta om hur det är att jobba på X?" öppnar fler dörrar än "Har ni lediga tjänster?". Ge innan du tar.'},
{t:'Spontanansökan — så gör du',
cards:[
{icon:'1️⃣',h:'Adressera rätt person',t:'Hitta en faktisk chef eller rekryterande person.'},
{icon:'2️⃣',h:'Visa att du känner företaget',t:'Nämn något konkret — en produkt, en nyhet, ett värde.'},
{icon:'3️⃣',h:'Förklara värdet du tillför',t:'Vad du kan ge — inte vad du vill ha.'},
{icon:'4️⃣',h:'Be om 20 min möte',t:'Inte om ett jobb — bara om ett samtal.'}
],
a:'Spontanansökningar har högre callback-frekvens — lägre konkurrens. Bäst timing: efter expansion-nyheter. LinkedIn är bästa kanalen.'}
],ex:{type:'build',title:'Din nätverksstrategi',desc:'Konkret plan för nätverkande i jobbsöket.',fields:[{l:'3 personer att kontakta den här veckan',ph:'T.ex. Ex-kollega på ICA, kompis på Peab...',ta:true,hint:'Tänk brett!'},{l:'Företag för spontanansökan',ph:'T.ex. IKEA Helsingborg, Region Skåne...'},{l:'Öppningsmeningen till spontanansökan',ph:'Hej [namn], jag har följt [företag] och tror min bakgrund i...',ta:true},{l:'LinkedIn-mål den här veckan',ph:'T.ex. Kontaktförfrågan till 3 + kommentera 2 inlägg',hint:'Regelbundenhet > kvantitet'}]},quiz:[{q:'Andel jobb utan annons?',o:['10-15%','40-50%','5%','80%'],c:1},{q:'Bästa sättet att börja nätverka?',o:['"Har ni lediga tjänster?"','Fråga om råd — visa intresse','Skicka CV till alla','Vänta passivt'],c:1},{q:'Vad är spontanansökan?',o:['En sen ansökan','Kontakt utan utlyst tjänst','Ansökan utan brev','Via telefon'],c:1},{q:'Varför hög callback för spontanansökningar?',o:['Ser bättre ut','Lägre konkurrens','Obligatoriskt','Företag föredrar det'],c:1}],pr:['LinkedIn-meddelande för informellt möte.','Spontanansökan till [företag] för [roll].','Hitta rätt kontaktperson på LinkedIn?']},

{id:'a_lon',icon:'💰',title:'Löneförhandling',sub:'Vet du vad du är värd?',color:'#f87171',bc:'rgba(248,113,113,.3)',bg:'rgba(248,113,113,.07)',video:'/videos/alon-lon.mp4',lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'💰',h:'Vad är syftet?',t:'Lära dig förhandla lön och förmåner — utan att skämmas eller skämma ut dig.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Hur du tar reda på marknadslön, timing och formulering, och hur du förhandlar hela paketet.'},
{icon:'✅',h:'När du är klar ska du...',t:'ha en konkret förhandlingsplan med öppningsbud och argument.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 4 minuter för film och lektioner, plus en övning där du bygger din egen plan.'}
],
a:'Att inte förhandla kostar i snitt 100 000+ kr/år — år efter år.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom marknadsdata, timing, formulering och hur du förhandlar hela paketet — inte bara lönen. Se den först, så blir lektionerna lättare att följa.'},
{t:'Ta reda på rätt lönenivå',
cards:[
{icon:'🌐',h:'lonestatistik.se',t:'Gratis och pålitlig — börja här.'},
{icon:'🏛️',h:'SCB',t:'Branschdata och löneutveckling.'},
{icon:'🛡️',h:'Facket',t:'Ditt förbund har egna siffror.'},
{icon:'📍',h:'Skåne',t:'Räkna med 5–10 % under Stockholm.'}
],
a:'Kom med ett specifikt tal, inte ett spann — spann tolkas alltid mot den lägre siffran. Öppna 5–10 % över ditt minimum.'},
{t:'Timing och formulering',
cards:[
{icon:'⏰',h:'När',t:'Lyft lönen när erbjudandet är på bordet — inte i första intervjun.'},
{icon:'✅',h:'Bra',t:'"Baserat på erfarenhet och marknadsdata tänkte jag mig runt X kronor."'},
{icon:'❌',h:'Undvik',t:'"Jag behöver minst X" — ultimatum. Eller "Vad brukar ni betala?" — svagt.'},
{icon:'🤐',h:'Pausen',t:'Är din vän. Säg ditt tal, vänta — låt motparten bryta tystnaden.'}
],
a:'Förhandling förväntas. Förbered 3 argument: marknadsdata, erfarenhet, mervärde.'},
{t:'Hela paketet — inte bara lönen',
cards:[
{icon:'📅',h:'Extra semesterdagar',t:'1 dag ≈ 5 000 kr/år i värde.'},
{icon:'💻',h:'Flex eller distans',t:'Ofta enkelt att få — stort värde för dig.'},
{icon:'📚',h:'Utbildningsbudget',t:'Pengar för kurser och certifikat.'},
{icon:'🏋️',h:'Friskvårdsbidrag',t:'Skattefritt — upp till 5 000 kr/år.'}
],
a:'Förmånsförhandling är ofta enklare än lön. Prioritera: värdefullt för dig men billigt för arbetsgivaren.'}
],ex:{type:'build',title:'Din förhandlingsplan',desc:'Förbered löneförhandlingen konkret.',fields:[{l:'Vilket jobb?',ph:'T.ex. Lagerarbetare på PostNord...'},{l:'Vad säger marknadsdata?',ph:'T.ex. Medianlön lagerarbetare Skåne: 28 000 kr',hint:'lonestatistik.se — gratis'},{l:'Ditt öppningsbud',ph:'T.ex. 31 000 kr — 10% över minimum',hint:'Lite över ditt minimum'},{l:'Dina 3 argument',ph:'1. X år erfarenhet WMS\n2. Marknadsdata visar Y\n3. Jag tillför Z...',ta:true}]},quiz:[{q:'När lyfter du lön?',o:['I första intervjun','När erbjudandet är på bordet','I CV:et','Aldrig'],c:1},{q:'Smartaste öppningsbudet?',o:['Exakt vad du vill ha','5-10% över ditt minimum','Så högt som möjligt','Ett spann'],c:1},{q:'Lönen är låst — vad gör du?',o:['Tacka nej direkt','Förhandla förmåner','Acceptera tyst','Be om skriftlig bekräftelse'],c:1},{q:'Vad kostar det att inte förhandla?',o:['Ingenting','100 000+ kr/år','5 000 kr','Bara prestige'],c:1}],pr:['Löneförhandling för [roll] Helsingborg.','Marknadslön [yrke] Skåne?','Tacka nej till för lågt erbjudande.']},

{id:'a_uppf',icon:'📬',title:'Uppföljning efter ansökan',sub:'De som följer upp får fler intervjuer',color:'#f87171',bc:'rgba(248,113,113,.3)',bg:'rgba(248,113,113,.07)',video:'/videos/auppf-uppfoljning.mp4',lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'📬',h:'Vad är syftet?',t:'Lära dig följa upp ansökningar och intervjuer rätt — för att bli ihågkommen.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Varför uppföljning fungerar, när du gör det, hur du formulerar dig, och hur du hanterar tystnad.'},
{icon:'✅',h:'När du är klar ska du...',t:'kunna skriva ett professionellt uppföljningsmejl direkt.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 3 minuter för film och lektioner, plus en skrivövning.'}
],
a:'20–30 % högre chans till intervju — bara genom att följa upp.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom varför uppföljning fungerar, när du följer upp, hur du formulerar dig och hur du hanterar tystnad. Se den först, så blir lektionerna lättare att följa.'},
{t:'Varför följa upp?',
cards:[
{icon:'💡',h:'Visar genuint intresse',t:'Du skiljer dig från mängden.'},
{icon:'👀',h:'Top-of-mind',t:'Rekryteraren minns dig när beslut fattas.'},
{icon:'📊',h:'Info om processen',t:'Du vet vad som händer härnäst.'}
],
a:'Uppföljning uppfattas som professionellt i Sverige om det görs rätt. Rätt ton: nyfiken och positiv — inte påträngande.'},
{t:'När och hur?',
cards:[
{icon:'📩',h:'5–7 dagar efter ansökan',t:'Bekräfta intresset.'},
{icon:'⚡',h:'Inom 24h efter intervju',t:'Skicka ett kort tackmejl.'},
{icon:'📧',h:'E-post är bäst',t:'Bättre än telefon i de flesta fall.'},
{icon:'📝',h:'3–5 meningar',t:'Referera till ansökan, bekräfta intresset.'}
],
a:'Max 2 uppföljningar totalt. Tackmejl inom 24h. Undvik att ringa om inte kontaktinfo anger det.'},
{t:'Hantera tystnad',
cards:[
{icon:'⏳',h:'Tystnad är inte nej',t:'Processer tar 2–6 veckor. Semestrar och interna beslut tar tid.'},
{icon:'📨',h:'En artig uppföljning',t:'Sedan släpper du den.'},
{icon:'🚀',h:'Sök parallellt',t:'Lägg aldrig alla ägg i en korg.'}
],
a:'Om du fått ett annat erbjudande — meddela omgående och tacka för processen. Aldrig vredgade meddelanden.'}
],ex:{type:'write',title:'Skriv ditt uppföljningsmejl',desc:'Skriv ett professionellt uppföljningsmejl för en ansökan du skickat.',tips:'Kort: Referera till ansökan, bekräfta intresse, fråga om status. Max 4-5 meningar.',ph:'Hej [namn],\n\nJag skickade ansökan till [tjänst] förra veckan och ville höra om ni hunnit titta igenom den.\n\nJag är fortsatt genuint intresserad och ser fram emot att höra om er process.\n\nMed vänliga hälsningar\n[Ditt namn]',min:60},quiz:[{q:'Timing för uppföljning?',o:['2 timmar','5-7 dagar','1 månad','Aldrig'],c:1},{q:'Bäst kanal?',o:['Ring alltid','E-post i de flesta fall','Brev','Besök'],c:1},{q:'Vad vid tystnad?',o:['Avbryt processen','Max 2 artiga uppföljningar + söka parallellt','Ring varje dag','Klagomål'],c:1},{q:'Tackmejl efter intervju?',o:['Nästa vecka','Inom 24 timmar','Behövs inte','Bara om du vill ha jobbet'],c:1}],pr:['Uppföljningsmejl: [tjänst, företag, datum].','Formulera att jag fått annat erbjudande.','Tackmejl efter intervju som [roll] på [företag].']},

{id:'a_ref',icon:'⭐',title:'Referenshantering',sub:'Dina referenser kan avgöra erbjudandet',color:'#f87171',bc:'rgba(248,113,113,.3)',bg:'rgba(248,113,113,.07)',video:'/videos/aref-referenser.mp4',lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'⭐',h:'Vad är syftet?',t:'Lära dig välja, fråga och förbereda referenser så de stärker din ansökan.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Vem som är en bra referens, vem du undviker, hur du förbereder, och alternativ om du saknar formella.'},
{icon:'✅',h:'När du är klar ska du...',t:'ha en lista med 2–3 förberedda referenser klara att skicka.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 3 minuter för film och lektioner, plus en övning där du planerar dina referenser.'}
],
a:'Rekryterare kontaktar referenserna i slutskedet. En dålig referens kan stoppa hela erbjudandet.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom vem du ska välja, vem du ska undvika, hur du förbereder din referens och vad du gör om du saknar formella referenser. Se den först, så blir lektionerna lättare att följa.'},
{t:'Vem väljer du?',
cards:[
{icon:'👔',h:'Tidigare chef',t:'Har sett dig leverera under ansvar.'},
{icon:'🤝',h:'Kollega',t:'Har sett dig prestera i vardagen.'},
{icon:'🎓',h:'Lärare eller handledare',t:'Vet hur du fungerar i en grupp.'}
],
a:'Välj någon som har sett dig prestera — och som du litar på säger något positivt om dig.'},
{t:'Vem undviker du?',
cards:[
{icon:'👪',h:'Familj och nära vänner',t:'Saknar trovärdighet för rekryterare.'},
{icon:'😤',h:'Konfliktrelationer',t:'Risk för negativa kommentarer.'},
{icon:'🕰️',h:'Ingen kontakt på 5+ år',t:'Kommer inte ihåg dig tillräckligt väl.'}
],
a:'Fråga alltid om lov INNAN du anger någon som referens. En referens du inte förvarnat kan kosta dig jobbet.'},
{t:'Förbered dina referenser',
cards:[
{icon:'📞',h:'Ring eller mejla innan',t:'Innan rekryteraren gör det.'},
{icon:'💼',h:'Berätta om jobbet',t:'Företag, roll och vad de söker.'},
{icon:'📄',h:'Skicka ditt CV',t:'Så de har faktauppgifterna rätt.'},
{icon:'💡',h:'Lyft 2–3 styrkor',t:'Som du vill att de särskilt nämner.'}
],
a:'Oförberedda referenser svarar generellt. Förberedda berättar specifika historier. Tacka alltid din referens efteråt.'},
{t:'Saknar du formella referenser?',
cards:[
{icon:'🤲',h:'Volontärarbete',t:'Ny referens snabbt — och meriterande.'},
{icon:'📋',h:'Praktik via AF',t:'Handledaren blir din referens.'},
{icon:'👩‍🏫',h:'SFI-lärare eller handläggare',t:'Räknas som professionell referens.'},
{icon:'📄',h:'Kompetensintyg',t:'Skriftliga intyg från tidigare arbete.'}
],
a:'Var ärlig: "mina referenser är från hemlandet" är helt OK. Att ljuga om referenser är den vanligaste orsaken till indragna erbjudanden.'}
],ex:{type:'build',title:'Din referensplan',desc:'Förbered dina 3 bästa referenser.',fields:[{l:'Referens 1 — namn, relation, kontakt',ph:'T.ex. Maria Svensson, f.d. chef ICA, maria@... 070-XXX',hint:'Fråga om lov INNAN!'},{l:'Referens 2 — namn, relation, kontakt',ph:'T.ex. Ahmed Karim, kollega PostNord, ahmed@...'},{l:'Referens 3 — namn, relation, kontakt',ph:'T.ex. Anna Berg, handledare YH, anna@...'},{l:'Vad ska de lyfta? (2-3 styrkor)',ph:'T.ex. Pålitlighet, truckvana, samarbete...',ta:true,hint:'Skicka detta till dina referenser!'}]},quiz:[{q:'Bäst som referens?',o:['Bästa vännen','Mamma','Tidigare chef','Bekant som tycker om dig'],c:2},{q:'När förbereder du?',o:['När rekryteraren frågar','INNAN du anger dem','Behövs inte','Sista dagen'],c:1},{q:'Saknar formella? Vad gör du?',o:['Uppfinn kontakter','Neka','Volontärarbeta/praktik/fråga lärare','Ge familjens kontakt'],c:2},{q:'Efter att referens hjälpt dig?',o:['Ingenting','Tacka — oavsett utfall','Pengar','Undvik kontakt'],c:1}],pr:['Mejl för att förbereda referens inför [intervju].','Formulera att jag saknar referens från Sverige.','Referensbrev för min f.d. kollega.']},

{id:'a_plan',icon:'🗓️',title:'Din 30-dagarsplan',sub:'Från övningar till riktigt jobb',color:'#f87171',bc:'rgba(248,113,113,.3)',bg:'rgba(248,113,113,.07)',video:'/videos/aplan-30dagar.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🗓️',h:'Vad är syftet?',t:'Få en konkret vecka-för-vecka-plan från övningar till riktigt jobb.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Verktygen du har, vecka 1–4-prioritering, vanliga misstag och hur du håller motivationen.'},
{icon:'✅',h:'När du är klar ska du...',t:'ha en egen 30-dagarsplan med konkreta aktiviteter per vecka.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 4 minuter för film och lektioner, plus en AI-genererad personlig plan.'}
],
a:'Strukturerade jobbsökare hittar jobb 40% snabbare än de som söker slumpmässigt.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen sammanfattar alla verktyg du har lärt dig, ger en konkret veckoplan, och visar hur du håller motivationen uppe. Se den först, så blir lektionerna lättare att följa.'},
{t:'Hela jobbsöket på en rad',
cards:[
{icon:'📊',h:'Marknad',t:'Du vet var jobben finns.'},
{icon:'📄',h:'CV',t:'Byggt och matchat per annons.'},
{icon:'✉️',h:'Brev',t:'Fångar intresset på fyra rader.'},
{icon:'🎤',h:'Pitch',t:'30 sekunder som säljer dig.'},
{icon:'🤝',h:'Nätverk',t:'Når det dolda jobbet — 40-50%.'},
{icon:'💬',h:'Intervju',t:'STAR-metoden och trygghet.'},
{icon:'📬',h:'Uppföljning',t:'Håller dig top-of-mind.'},
{icon:'💰',h:'Förhandling',t:'Du vet ditt värde.'}
],
a:'Kombinationen CV + brev + nätverk + uppföljning är kraftfullare än enbart ansökningar.'},
{t:'Prioritera rätt — i rätt ordning',
cards:[
{icon:'1️⃣',h:'Vecka 1 — Grunden',t:'CV klart i CVmatchen. A-kassa + facket ansökt. LinkedIn uppdaterad.'},
{icon:'2️⃣',h:'Vecka 2–3 — Kanalerna',t:'3 ansökningar/v. 1 spontanansökan/v. Nätverk 2 kontakter/v.'},
{icon:'3️⃣',h:'Vecka 4+ — Följa upp',t:'Uppföljning på alla ansökningar. Justera CV efter feedback.'}
],
a:'En riktad ansökan med anpassat CV + brev slår alltid 10 generiska ansökningar.'},
{t:'Hålla motivationen uppe',
cards:[
{icon:'🕘',h:'Fasta tider',t:'Behandla jobbsöket som ett jobb.'},
{icon:'🎉',h:'Fira smårörelser',t:'Varje svar och intervjukallelse är ett framsteg.'},
{icon:'🔀',h:'Blanda aktiviteter',t:'Söka + nätverka + lära nytt.'},
{icon:'💆',h:'En dag ledigt/vecka',t:'Återhämtning är produktivt.'}
],
a:'Snittid att hitta jobb: 3–6 månader. Varje avslag är information — inte ett misslyckande.'}
],
ex:{type:'job-plan-ai',title:'Generera din personliga 30-dagarsplan',desc:'Berätta om din situation och få en konkret vecka-för-vecka-plan anpassad till just dig.'},
quiz:[
{q:'Vad är smartaste ordningen att börja jobbsöket?',o:['Skicka 20 ansökningar dag 1','Grunden först — CV, A-kassa, LinkedIn — sedan ansökningar','Vänta på rätt annons','Ringa AF varje dag'],c:1},
{q:'Hur många riktade ansökningar slår 10 generiska?',o:['Ingen — kvantitet vinner','1 riktad ansökan med anpassat CV + brev','5 generiska','Det beror på bransch'],c:1},
{q:'Vad gör du när motivationen sviktar?',o:['Ge upp och vänta','Fast rutin + blanda aktiviteter + fira smårörelser','Söka ännu fler jobb','Söka vilka jobb som helst'],c:1},
{q:'Hur lång är snittiden att hitta jobb?',o:['1-2 veckor','3-6 månader','1 år','Omedelbart'],c:1}
],
pr:['Bygg min 30-dagarsplan baserat på: [situation, yrke, mål]','Hur prioriterar jag om jag har begränsat med tid?','Motiverande veckoplan för jobbsöket.']},
{id:'a_denmark',icon:'🇩🇰',title:'Jobba i Danmark',sub:'Öresund — din närmaste arbetsmarknad',color:'#f87171',bc:'rgba(248,113,113,.3)',bg:'rgba(248,113,113,.07)',video:'/videos/adenmark-danmark.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🇩🇰',h:'Vad är syftet?',t:'Förstå hur du tar dig in på den danska arbetsmarknaden — och vad du behöver praktiskt.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Varför Danmark är aktuellt, vad som krävs som EU-medborgare, Öresunddirekt, och hur skatten fungerar.'},
{icon:'✅',h:'När du är klar ska du...',t:'veta vilka 4 steg du behöver ta — och vart du ringer för gratis rådgivning.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 3 minuter för film och lektioner, plus en planeringsövning.'}
],
a:'20 minuters färja till en av Europas starkaste arbetsmarknader — Öresund är inte en gräns, det är din arbetsmarknad.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom varför Danmark är aktuellt, vad som krävs som EU-medborgare, Öresunddirekt och hur skatten fungerar. Se den först, så blir lektionerna lättare att följa.'},
{t:'Varför Danmark?',
cards:[
{icon:'🇩🇰',h:'Arbetslöshet 2,6 %',t:'Sverige ligger på 8,8 %. Skillnaden är enorm.'},
{icon:'⛴️',h:'20 min med färja',t:'En av Europas starkaste arbetsmarknader — nära.'},
{icon:'🚇',h:'20 000 pendlare/dag',t:'Du är inte ensam — det finns ett helt system.'},
{icon:'💰',h:'20–40 % högre lön',t:'Danska löner ligger ofta över svenska för samma yrke.'}
],
a:'Danmark är ett av världens rikaste länder med stark arbetsmarknad. Helsingborg är en hub för dansk rekrytering — mässan "Tura till jobbet" hålls varje år.'},
{t:'Vad krävs som EU-medborgare?',
cards:[
{icon:'🇪🇺',h:'Fri rörlighet',t:'Inget arbetstillstånd behövs — du är EU-medborgare.'},
{icon:'1️⃣',h:'CPR-nummer',t:'Danskt personnummer — söks på Borgerservice i Helsingör.'},
{icon:'2️⃣',h:'NemKonto',t:'Danskt bankkonto för löneutbetalning.'},
{icon:'3️⃣',h:'Skattekort hos SKAT',t:'Utan skattekort dras 55 % i skatt tills det är ordnat.'},
{icon:'4️⃣',h:'Dansk A-kasse',t:'Frivilligt — om du vill ha dansk a-ersättning.'}
],
a:'Boka tid online för CPR. Nordea och Handelsbanken har kontor på båda sidor. Danska A-kassor som ASE eller 3F — välj branschrelevant.'},
{t:'Öresunddirekt & skatt',
cards:[
{icon:'🌐',h:'oresunddirekt.se',t:'Gratis rådgivning — svenska och danska handläggare.'},
{icon:'💸',h:'Skattefrågan',t:'Bor i Sverige + jobbar i Danmark = dansk skatt på danska inkomster.'},
{icon:'📋',h:'Deklarera i BÅDA',t:'Öresund-avtalet undviker dubbelbeskattning.'},
{icon:'⚠️',h:'Ring INNAN du börjar',t:'Det undviker dyra misstag.'}
],
a:'Gränsarbetare beskattas i arbetslandet. Sverige är bosättningsland. Pension: dansk ATP parallellt med svensk. Barnbidrag: betalas av landet där barnet bor (Sverige).'},
{t:'Inte EU-medborgare?',
cards:[
{icon:'✅',h:'PUT i 5 år',t:'Permanent uppehållstillstånd i 5+ år = EG-uppehållstillstånd. Kan ge rätt till rörlighet.'},
{icon:'❌',h:'TUT räcker inte',t:'Tidsbegränsat tillstånd ger inte rätt att jobba i Danmark.'},
{icon:'📞',h:'Ring Öresunddirekt först',t:'De utreder din specifika situation gratis.'}
],
a:'Regler för icke-EU styrs av EU-direktiv 2003/109. Danmark tillämpar reglerna strikt — kontakta alltid Öresunddirekt eller en rådgivare före jobbansökan.'}
],
ex:{type:'build',title:'Din danska jobbplan',desc:'Planera dina första steg mot ett jobb i Danmark.',fields:[{l:'Vilket yrke söker du i Danmark?',ph:'T.ex. truckförare, undersköterska, kock, lagerarbetare...',hint:'Samma yrke som i Sverige — men danska löner!'},{l:'Har du sökt på jobnet.dk eller EURES?',ph:'T.ex. Ja, hittade 3 annonser för truckförare nära Helsingör / Nej — gör det nu',hint:'jobnet.dk = Platsbanken i Danmark. Gratis.'},{l:'Vad är ditt första praktiska steg?',ph:'T.ex. Ringa Öresunddirekt, boka tid för CPR-nummer på Borgerservice...',ta:true,hint:'oresunddirekt.se — gratis rådgivning'},{l:'Har du koll på skattefrågan?',ph:'T.ex. Nej — ringer Öresunddirekt / Ja, förstår att jag betalar dansk skatt',hint:'Ring INNAN du börjar — undviker dyra misstag!'}]},
quiz:[{q:'Vad är Danmarks arbetslöshet 2025?',o:['~8%','~5%','~2,6%','~12%'],c:2},{q:'Vad behöver EU-medborgare för att jobba i Danmark?',o:['Arbetstillstånd','Ingenting — fri rörlighet gäller','Danskt pass','Visum'],c:1},{q:'Kan du jobba i Danmark med bara svenskt uppehållstillstånd?',o:['Å ja, uppehållstillstånd räcker','Öresunddirekt utreder — beror på om du haft PUT i 5+ år','Ja alltid om du bor i Sverige','Nej aldrig'],c:1},{q:'Vad är ett CPR-nummer?',o:['Danskt körkort','Danskt personnummer — krävs för lön och skatt','En a-kasse','Danskt ID-kort'],c:1},{q:'Vad gör Öresunddirekt?',o:['Söker jobb åt dig','Gratis rådgivning om gränsarbete Sverige-Danmark','Danskt BankID','Taxiservice över sundet'],c:1},{q:'Var betalar du skatt om du bor i Sverige och jobbar i Danmark?',o:['Bara i Sverige','Bara i Danmark — men deklarerar i båda','Ingen skatt alls','Bara i EU'],c:1},{q:'Vad är dansk A-kasse?',o:['Danskt personnummer','Dansk a-kassa — ger ersättning om du blir arbetslös i Danmark','En bank','Danskt Skatteverk'],c:1}],
pr:['Vilka jobb finns i Danmark för [yrke] nära Helsingör?','Förklara steg för steg hur jag börjar jobba i Danmark som svensk.','Vad tjänar en [yrke] i Danmark jämfört med Sverige?']}
];

var HALSA=[
{id:'h1',icon:'🧠',title:'Mental hälsa & stress',sub:'Hantera press och mående',color:'#fb923c',bc:'rgba(251,146,60,.3)',bg:'rgba(251,146,60,.07)',video:'/videos/h1-stress.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🎯',h:'Vad är syftet?',t:'Förstå hur stress fungerar, känna igen varningssignaler — och veta vad som faktiskt hjälper.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Stress som vän och fiende, kroppens varningssignaler, vad som hjälper, och var du hittar hjälp.'},
{icon:'✅',h:'När du är klar ska du...',t:'kunna känna igen din egen stress, ha verktyg som hjälper dig, och veta vart du vänder dig vid behov.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 4 minuter för film och lektionerna, plus en lugn övning där du gör din egen stressanalys.'}
],
a:'Mental hälsa är grunden för allt annat. Den här modulen ger dig en lugn genomgång — ta den i din egen takt.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går lugnt igenom stress, varningssignaler och vad som hjälper. Se den först, så blir lektionerna lättare att följa.'},
{t:'Stress — vän eller fiende?',
cards:[
{icon:'🎯',h:'Lite stress är bra',t:'Det skärper fokus och hjälper dig prestera.'},
{icon:'⏳',h:'För mycket, för länge',t:'Långvarig stress blir skadlig för kroppen.'},
{icon:'😴',h:'Varningssignaler',t:'Sömnsvårigheter, oro och irritation, koncentrationssvårigheter.'},
{icon:'🤕',h:'Kroppen säger ifrån',t:'Trötthet som inte går över, värk i nacke, huvud eller mage.'}
],a:'Kronisk stress påverkar immunsystemet, minnet och hjärtfunktionen. Kortisol (stresshormonet) är nödvändigt akut men skadligt långsiktigt. Ca 30% av sjukskrivningar i Sverige beror på psykisk ohälsa.'},
{t:'Vad hjälper faktiskt?',
cards:[
{icon:'🏃',h:'Rörelse',t:'30 minuter om dagen räcker.'},
{icon:'😴',h:'Sömn',t:'7–9 timmar — grunden för allt.'},
{icon:'🤝',h:'Socialt stöd',t:'Prata med någon — bär inte ensam.'},
{icon:'🌳',h:'Naturen',t:'Tid utomhus sänker stresshormonet.'},
{icon:'⚠️',h:'Undvik',t:'Alkohol förvärrar. Skärm sent stör sömnen.'}
],a:'Forskning visar att 30 min promenad om dagen är lika effektivt som antidepressiva vid mild till måttlig depression. Mindfulness 10 min/dag sänker kortisolnivåer mätbart efter 8 veckor.'},
{t:'Hjälp finns — ta den!',
cards:[
{icon:'📞',h:'1177 Vårdguiden',t:'Råd om hälsa — dygnet runt.'},
{icon:'💬',h:'Mind — 90101',t:'Självmordslinjen, när det är tungt.'},
{icon:'🏥',h:'Vårdcentralen',t:'Be om remiss till kurator. 1177.se har självhjälp online.'},
{icon:'💪',h:'Styrka — inte svaghet',t:'Att söka hjälp är modigt. Tidigt stöd förhindrar att det blir värre.'}
],a:'Tidigt stöd förhindrar allvarligare ohälsa. Kurator på vårdcentral kostar samma som läkarbesök (200-300 kr). Psykologisk behandling via KBT-online är gratis via 1177 i många regioner.'}
],
ex:{type:'build',title:'Din stressanalys',desc:'Kartlägg din stress och planera motståndet.',
fields:[
{l:'Vad stressar dig mest just nu?',ph:'T.ex. Ekonomin, jobbsök, familjesituation...',ta:true},
{l:'Vilka varningssignaler känner du igen?',ph:'T.ex. Sömnsvårigheter, oroliga tankar...'},
{l:'Vad hjälper DIG? (minst 2 saker)',ph:'T.ex. Promenader, prata med vän, musik...',hint:'Vad vet du redan fungerar för dig?'},
{l:'En konkret sak du gör IDAG för att ta hand om dig',ph:'T.ex. Ringer en vän, går en promenad, lägger telefonen åt sidan 21.00',hint:'Litet steg — stor skillnad.'}
]},
quiz:[
{q:'Hur lång daglig rörelse räcker för positiv hälsoeffekt?',o:['2 timmar','30 minuter','1 timme','10 minuter'],c:1},
{q:'Vilket nummer ringer du för råd om hälsa dygnet runt?',o:['112','1177','90101','114 14'],c:1},
{q:'Vad är en varningssignal för för hög stress?',o:['Lite ökad puls','Sömn som fungerar bra','Sömnsvårigheter och ihållande trötthet','Att du är fokuserad'],c:2},
{q:'Att söka hjälp för sin psykiska hälsa är...',o:['Svaghet','Styrka','Onödigt','Dyrt'],c:1}
],
pr:['Ge mig en konkret stresshanteringsplan för en jobbsökare.','Vad är KBT och hur fungerar det?','Enkla andningsövningar mot ångest?']},

{id:'h2',icon:'😴',title:'Sömn & återhämtning',sub:'Grunden för allt annat',color:'#fb923c',bc:'rgba(251,146,60,.3)',bg:'rgba(251,146,60,.07)',video:'/videos/h2-somn.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'😴',h:'Vad är syftet?',t:'Förstå varför sömn är grunden för allt annat — och få konkreta verktyg för att sova bättre.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Varför sömn är så viktigt, sex regler för sömnhygien, och vad du gör när du inte kan sova.'},
{icon:'✅',h:'När du är klar ska du...',t:'kunna bygga en sömnrutin som faktiskt fungerar för dig.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 4 minuter för film och lektioner, plus en övning där du gör din egen sömnplan.'}
],
a:'Sömnen är inte lyx — den är biologi. Den här modulen ger dig grunderna.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom varför sömnen är så viktig, sex regler för sömnhygien, och vad du gör om du inte kan sova. Se den först, så blir lektionerna lättare att följa.'},
{t:'Varför sömn är #1',
cards:[
{icon:'🧠',h:'Hjärnan',t:'Bearbetar dagens intryck medan du sover.'},
{icon:'💪',h:'Kroppen',t:'Repareras och byggs upp under natten.'},
{icon:'🛡️',h:'Immunförsvaret',t:'Stärks medan du sover.'},
{icon:'🛏️',h:'7–9 timmar',t:'Det de flesta vuxna behöver. Kronisk sömnbrist ger sämre minne, humör och beslut.'}
],
a:'Sömnbrist ger ett liknande kognitivt nedsatt tillstånd som alkoholpåverkan. Sömnen är inte lyx — den är biologi.'},
{t:'Sömnhygien — 6 regler',
cards:[
{icon:'⏰',h:'Samma tider',t:'Lägg dig och vakna lika dags — varje dag.'},
{icon:'🌡️',h:'Svalt & mörkt',t:'18–20°C, tyst och mörkt rum.'},
{icon:'📵',h:'Skärmfri timme',t:'Inga skärmar sista timmen innan du sover.'},
{icon:'☕',h:'Ingen koffein',t:'Stoppa kaffe och te efter kl 14.'},
{icon:'🛁',h:'Lugn rutin',t:'Bok, stretching eller en dusch.'},
{icon:'🛌',h:'Sängen = sömn',t:'Använd sängen bara till sömn — inte till skärmtid.'}
],
a:'Blåljus från skärmar hämmar melatoninproduktionen med upp till 50%. Regelbunden läggtid är viktigare än exakt sovtid.'},
{t:'Om du inte kan sova',
cards:[
{icon:'🚶',h:'Gå upp 20 min',t:'Ligg inte vaken och kämpa — gör något lugnt och kom tillbaka.'},
{icon:'✏️',h:'Skriv ner oron',t:'Töm huvudet på oroliga tankar genom att skriva på ett papper.'},
{icon:'🌬️',h:'4-7-8-andning',t:'Andas in på fyra, håll i sju, andas ut på åtta.'},
{icon:'🚫',h:'Undvik',t:'Titta inte på klockan, ta inte melatonin på egen hand, sov inte ikapp på helger.'}
],
a:'Vid långvariga sömnproblem — kontakta 1177 för råd, eller be om en remiss via vårdcentralen.'}
],
ex:{type:'build',title:'Din sömnplan',desc:'Bygg en sömnrutin som faktiskt fungerar.',
fields:[
{l:'Hur många timmar sover du nu i snitt?',ph:'T.ex. 5-6 timmar — ofta svårt att somna...'},
{l:'Vad stör din sömn mest?',ph:'T.ex. Oroliga tankar, telefon i sängen, oregelbundna tider...'},
{l:'Din ideala läggtid och uppvagningstid',ph:'T.ex. Sova 23:00, vakna 07:00 — 8 timmar',hint:'Håll tider — även helger!'},
{l:'En sömnregel du börjar med IKVÄLL',ph:'T.ex. Telefonen utanför sovrummet från och med ikväll',hint:'Börja med en — gör den till vana.'}
]},
quiz:[
{q:'Hur många timmar sömn behöver de flesta vuxna?',o:['5-6 timmar','7-9 timmar','4-5 timmar','10+ timmar'],c:1},
{q:'När bör du sluta dricka kaffe/te med koffein?',o:['Kl 18','Kl 14','Kl 20','Det spelar ingen roll'],c:1},
{q:'Vad gör du om du inte kan sova efter 20 min?',o:['Kämpa vidare i sängen','Gå upp och gör något lugnt','Ta en sömnpille','Titta på Netflix'],c:1},
{q:'Vilken rumstemperatur är bäst för sömn?',o:['22-24°C','18-20°C','25°C','Under 16°C'],c:1}
],
pr:['Kvällsrutin för bättre sömn under jobbsökperiod.','Vad är 4-7-8-andning?','Hur påverkar dålig sömn jobbsöket?']},

{id:'h3',icon:'🏃',title:'Rörelse & energi',sub:'Gratis medicin som fungerar',color:'#fb923c',bc:'rgba(251,146,60,.3)',bg:'rgba(251,146,60,.07)',video:'/videos/h3-rorelse.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🏃',h:'Vad är syftet?',t:'Komma igång med rörelse — utan att behöva gymkort, dyr utrustning eller massor av tid.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Rörelse utan gym, koppling till mental hälsa, och hur du bygger en vana som håller.'},
{icon:'✅',h:'När du är klar ska du...',t:'ha valt en konkret aktivitet och tidpunkt att börja idag.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 3 minuter för film och lektioner, plus en övning där du gör din rörelseplan.'}
],
a:'Träning minskar risk för depression med 26 % — och under jobbsöket motverkar det uppgivenhet.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom rörelse utan gym, hur träning frigör må-bra-hormoner, och hur du kommer igång — utan att tappa motivationen efter en vecka. Se den först, så blir lektionerna lättare att följa.'},
{t:'Rörelse utan gym',
cards:[
{icon:'🚶',h:'Promenader',t:'Effektivast och enklast — börja här.'},
{icon:'🚴',h:'Cykling',t:'Transport + rörelse i ett.'},
{icon:'🪜',h:'Trappor istället för hiss',t:'Liten ändring, stor effekt över tid.'},
{icon:'📺',h:'YouTube-träning hemma',t:'Gratis och flexibelt.'},
{icon:'⏱️',h:'Målet',t:'150 min lätt rörelse/vecka — eller 75 min intensiv.'}
],
a:'Stillasittande > 8 tim/dag ökar risken för depression och hjärtsjukdom — oavsett om du tränar.'},
{t:'Rörelse och mental hälsa',
cards:[
{icon:'🧠',h:'Endorfiner',t:'Naturlig smärtlindring.'},
{icon:'😊',h:'Dopamin',t:'Motivation och belöning.'},
{icon:'😌',h:'Serotonin',t:'Lugn och välmående.'},
{icon:'💪',h:'30 min promenad',t:'Märkbar stämningsförbättring direkt.'}
],
a:'Utomhusrörelse ger extra effekt via dagsljus (reglerar dygnsrytm) och naturkontakt (sänker kortisol).'},
{t:'Kom igång — och håll igång',
cards:[
{icon:'🌱',h:'Börja med 10 min/dag',t:'Vanligaste misstaget: börja för hårt.'},
{icon:'☕',h:'Koppla till en rutin',t:'Morgonkaffe → morgonpromenad.'},
{icon:'👥',h:'Hitta en kompis',t:'Tillsammans är roligare — och håller längre.'},
{icon:'📅',h:'Logga i kalender',t:'Bygg stolthet — och en vana som sätter sig.'}
],
a:'Nya vanor tar i snitt 66 dagar att befästa — inte 21 dagar som myten säger. Var tålmodig.'}
],
ex:{type:'build',title:'Din rörelseplan',desc:'En realistisk plan för mer rörelse i vardagen.',
fields:[
{l:'Hur aktiv är du idag?',ph:'T.ex. Sitter mest, promenerar ibland, cyklar till AF...'},
{l:'Vilken typ av rörelse passar dig?',ph:'T.ex. Promenader utomhus, hemmaträning, simning...',hint:'Välj något du faktiskt tycker om!'},
{l:'När på dagen passar det bäst?',ph:'T.ex. Morgonpromenad kl 8 innan jobbsöket börjar'},
{l:'Ditt rörelsemål denna vecka (konkret)',ph:'T.ex. 3 promenader à 30 min: måndag, onsdag, fredag',hint:'Skriv i kalendern nu!'}
]},
quiz:[
{q:'Hur mycket rörelse rekommenderar WHO per vecka?',o:['30 min totalt','150 min lätt rörelse','600 min','1 timme intensiv'],c:1},
{q:'Vilka ämnen frigörs vid träning?',o:['Kortisol och adrenalin','Endorfiner, dopamin och serotonin','Melatonin','Insulin'],c:1},
{q:'Bästa strategin för att komma igång?',o:['Börja hårt för att se snabba resultat','Börja med 10 min och koppla till befintlig rutin','Vänta tills du känner för det','Köp gymkort'],c:1},
{q:'Hur länge tar det ungefär att bygga en ny vana?',o:['21 dagar','66 dagar','7 dagar','1 år'],c:1}
],
pr:['Ge mig en 30-dagars rörelseplan för nybörjare.','Gratis träningsprogram utan utrustning?','Hur kopplar jag rörelse till mitt jobbsök?']},

{id:'h4',icon:'🥦',title:'Mat & energi',sub:'Ät rätt utan att det kostar skjortan',color:'#fb923c',bc:'rgba(251,146,60,.3)',bg:'rgba(251,146,60,.07)',video:'/videos/h4-mat.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🥦',h:'Vad är syftet?',t:'Lära dig äta för fokus och energi — utan att det kostar skjortan.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Hjärnmat, hur du undviker socker-toppar, billig och bra mat, samt vattnets roll.'},
{icon:'✅',h:'När du är klar ska du...',t:'kunna byta en ovana mot en bra vana redan idag.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 3 minuter för film och lektioner, plus en matplan-övning.'}
],
a:'Hjärnan tar 20 % av kroppens totala energi — det du äter påverkar fokus direkt.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom hjärnmat för jobbsökare, sex matgrupper som ger energi, och hur du äter bra på liten budget. Se den först, så blir lektionerna lättare att följa.'},
{t:'Hjärnmat för jobbsökare',
cards:[
{icon:'🐟',h:'Fet fisk',t:'Omega-3 — 2 gånger i veckan.'},
{icon:'🥚',h:'Ägg',t:'Protein och B-vitaminer.'},
{icon:'🫐',h:'Bär',t:'Antioxidanter — frysta funkar lika bra.'},
{icon:'🥜',h:'Nötter',t:'Snabb energi och bra fetter.'},
{icon:'🌾',h:'Fullkorn',t:'Stabilt blodsocker hela dagen.'},
{icon:'🥦',h:'Grönsaker',t:'Allt!'}
],
a:'Frukost med protein och fibrer ger stabil energi 4–5 timmar. Undvik socker-toppar — du kraschar och orkar inte söka jobb.'},
{t:'Billig och bra mat',
cards:[
{icon:'🫘',h:'Bönor & linser',t:'Protein för få kronor — 15 kr/kg torkade.'},
{icon:'🥕',h:'Rotfrukter i säsong',t:'Kål, morötter, lök — alltid billigt.'},
{icon:'❄️',h:'Frysta grönsaker',t:'Lika nyttigt som färska — ofta billigare.'},
{icon:'🐟',h:'Fryst fisk',t:'Halva priset — full nutrition.'},
{icon:'🍳',h:'Laga stort',t:'Ät flera dagar — sparar tid och pengar.'}
],
a:'Mathjälp finns i Helsingborg via Stadsmissionen och kommunens socialtjänst — be om hjälp om det behövs.'},
{t:'Vatten och rörelsepauser',
cards:[
{icon:'💧',h:'1,5–2 liter vatten/dag',t:'Vid uttorkning sjunker koncentrationen direkt.'},
{icon:'🚶',h:'Rörelsepaus vid lunch',t:'Promenad på 10 min — laddar om hjärnan.'},
{icon:'📵',h:'Ät inte framför skärmen',t:'Mätthetskänslan kommer inte fram — du äter mer.'}
],
a:'Att hoppa över mat för att spara pengar är kontraproduktivt — kontakta socialtjänsten eller AF om ekonomin är pressad.'}
],
ex:{type:'build',title:'Din matplan',desc:'Enkel veckoplan för bra mat på budget.',
fields:[
{l:'Vad äter du typiskt till frukost, lunch och middag?',ph:'T.ex. Hoppar frukost, smörgås till lunch, pasta till middag...',ta:true},
{l:'Vad är din ungefärliga matbudget per vecka?',ph:'T.ex. 300-400 kr för mig själv'},
{l:'Vilken är din svagaste måltid? (den du hoppar eller äter dåligt)',ph:'T.ex. Frukost — hinner aldrig, lunch — köper dyrt ute...'},
{l:'En konkret förbättring du gör denna vecka',ph:'T.ex. Handlar linser och lagar linsgryta på söndag',hint:'Liten förändring — stor skillnad'}
]},
quiz:[
{q:'Hur stor andel av kroppens energi använder hjärnan?',o:['5%','20%','50%','10%'],c:1},
{q:'Vilken mat ger stabil energi utan kraschlandning?',o:['Socker och vitt bröd','Fullkorn, protein och grönsaker','Energidrycker','Fruktjuice'],c:1},
{q:'Är fryst grönsaker sämre än färsk nutritionsmässigt?',o:['Ja, mycket sämre','Nej — ofta lika bra eller bättre','Bara hälften så nyttigt','Beror på grönsaken'],c:1},
{q:'Vad kostar en hälsosam dag mat ungefär på budget?',o:['200 kr','40-50 kr','100 kr','10 kr'],c:1}
],
pr:['Veckomeny för 300 kr för 1 person.','Snabba nyttiga recept på 20 minuter?','Vad kan jag äta för bättre fokus och koncentration?']},

{id:'h5',icon:'🏥',title:'Sjukvård i Sverige',sub:'Dina rättigheter och hur systemet funkar',color:'#fb923c',bc:'rgba(251,146,60,.3)',bg:'rgba(251,146,60,.07)',video:'/videos/h5-sjukvard.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🏥',h:'Vad är syftet?',t:'Förstå hur svenska sjukvården fungerar — och dina rättigheter i den.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Tre nivåer i systemet, viktiga nummer, frikort, och vård utan personnummer.'},
{icon:'✅',h:'När du är klar ska du...',t:'veta var du börjar, vad det kostar, och hur du får hjälp.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 3 minuter för film och lektioner, plus en kontakt-checklista.'}
],
a:'Sverige har en av världens bästa sjukvård — och den är nästan gratis. Du behöver veta hur du använder den.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom hur sjukvården är uppbyggd, viktiga nummer, frikort och vad du har rätt till. Se den först, så blir lektionerna lättare att följa.'},
{t:'Hur sjukvården är uppbyggd',
cards:[
{icon:'1️⃣',h:'Vårdcentralen',t:'Din husläkare — börja alltid här.'},
{icon:'2️⃣',h:'Specialistvård',t:'Med remiss från vårdcentralen.'},
{icon:'3️⃣',h:'Sjukhus',t:'Akut eller via remiss.'},
{icon:'📞',h:'1177',t:'Råd och hjälp dygnet runt.'},
{icon:'🚨',h:'112',t:'Vid akuta livshotande tillstånd.'}
],
a:'Regionerna ansvarar för sjukvård. Helsingborg tillhör Region Skåne.'},
{t:'Kostnader och frikort',
cards:[
{icon:'💳',h:'Besöksavgift',t:'Cirka 200–350 kr per besök hos vårdcentral.'},
{icon:'🎫',h:'Frikort: 1 150 kr/år',t:'Sedan gratis öppenvård resten av perioden.'},
{icon:'👶',h:'Barn under 18',t:'Helt avgiftsfria.'},
{icon:'💊',h:'Läkemedel',t:'Eget högkostnadsskydd: max 1 300 kr/år.'}
],
a:'Frikortet hanteras automatiskt av Region Skåne via 1177.se. Spara kvittona på besök.'},
{t:'Vård utan personnummer',
cards:[
{icon:'🆘',h:'Akutvård',t:'Alltid rätt till — oavsett status.'},
{icon:'👶',h:'Barn under 18',t:'Full sjukvård — alltid.'},
{icon:'🤰',h:'Gravida',t:'Mödravård garanteras.'},
{icon:'🌍',h:'EU-medborgare',t:'Rätt med europeiskt sjukförsäkringskort (EHIC).'},
{icon:'📞',h:'Vid frågor',t:'Ring 1177 eller kontakta närmaste vårdcentral.'}
],
a:'Asylsökande med LMA-kort har rätt till vård via Region Skåne. Papperslösa har rätt till "vård som inte kan anstå" via Röda Korset.'}
],
ex:{type:'build',title:'Din vårdkontakt',desc:'Se till att du har rätt kontakter och vet hur systemet funkar.',
fields:[
{l:'Har du en fast vårdcentral i Helsingborg?',ph:'T.ex. Ja — Söderslätts VC / Nej — behöver lista mig'},
{l:'Vet du var närmaste akutmottagning är?',ph:'T.ex. Helsingborgs lasarett, Södra Storgatan 15'},
{l:'Har du frikort eller vet hur du ansöker?',ph:'T.ex. Nej — ska kolla 1177.se',hint:'1177.se → Region Skåne → Frikort'},
{l:'Finns det något hälsoproblem du skjutit upp att ta hand om?',ph:'T.ex. Ont i ryggen sedan 3 mån — ska boka tid denna vecka',hint:'Boka nu — lång väntetid!'}
]},
quiz:[
{q:'Vilket nummer ringer du vid frågor om hälsa och sjukvård?',o:['112','1177','114 14','118 118'],c:1},
{q:'Hur mycket betalar du max för öppenvård per år (frikort)?',o:['500 kr','1 150 kr','5 000 kr','Det varierar'],c:1},
{q:'Vad har barn under 18 rätt till?',o:['Bara akutvård','Full sjukvård utan avgift','Hälften av vuxenavgiften','Bara hos barnläkare'],c:1},
{q:'Vad har asylsökande rätt till i Sverige?',o:['Ingen vård alls','Akutvård och vård som inte kan anstå','Bara privatvård','Samma som medborgare'],c:1}
],
pr:['Hur listar jag mig på en vårdcentral i Helsingborg?','Vad täcker frikortet?','Tandvård på låg budget i Sverige?']},

{id:'h6',icon:'🤝',title:'Socialt stöd & ensamhet',sub:'Du behöver inte klara allt själv',color:'#fb923c',bc:'rgba(251,146,60,.3)',bg:'rgba(251,146,60,.07)',video:'/videos/h6-stod.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🤝',h:'Vad är syftet?',t:'Förstå varför socialt stöd är så viktigt — och vart du hittar det.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Riskerna med ensamhet, gemenskap i Helsingborg, volontärarbete, och hur du börjar prata om hur du mår.'},
{icon:'✅',h:'När du är klar ska du...',t:'ha minst en konkret kontakt eller plats att gå till denna vecka.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 3 minuter för film och lektioner, plus en checklista.'}
],
a:'Att be om hjälp är styrka — inte svaghet.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom riskerna med ensamhet, var du hittar gemenskap, kraften i volontärarbete, och hur du tar steget att prata om hur du mår. Se den först.'},
{t:'Ensamhet — en folksjukdom',
cards:[
{icon:'❤️',h:'Hjärt-kärlsjukdom',t:'+29 % ökad risk vid kronisk ensamhet.'},
{icon:'🧠',h:'Demens',t:'+50 % ökad risk.'},
{icon:'😔',h:'Depression',t:'Förstärks av isolering.'},
{icon:'🌀',h:'Jobbsöket förvärrar',t:'Du tappar rutiner och social kontakt.'}
],
a:'WHO klassar ensamhet som en global hälsokris. Kvalitet är viktigare än kvantitet — 1–2 nära relationer skyddar mer än 20 ytliga.'},
{t:'Hitta gemenskap i Helsingborg',
cards:[
{icon:'📚',h:'Biblioteket',t:'Öppet hus och evenemang.'},
{icon:'⛪',h:'Kyrkor & moskéer',t:'Öppna för alla.'},
{icon:'🎭',h:'Föreningsliv',t:'Idrott, kultur, språk.'},
{icon:'🏃',h:'Parkrun',t:'Gratis löpning lördag 9.00.'},
{icon:'🤝',h:'Volontärnätverk',t:'Stadsmissionen och andra.'}
],
a:'Volontärarbete ger struktur, syfte och kontakter — tre saker jobbsöket ofta tar ifrån en.'},
{t:'Prata om hur du mår',
cards:[
{icon:'👨‍👩‍👧',h:'Familj och vänner',t:'De vill veta — de testar dig inte.'},
{icon:'💼',h:'Handläggare på AF',t:'De är där för dig.'},
{icon:'🏥',h:'Kurator på vårdcentral',t:'Gratis — fråga om remiss.'},
{icon:'📞',h:'Mind: 90101',t:'Stödlinje dygnet runt.'},
{icon:'📞',h:'Bris: 116 111',t:'Om du är ung.'}
],
a:'Att verbalisera känslor sänker aktiviteten i hjärnans larmsystem mätbart — det är direkt terapeutiskt, inte bara symboliskt.'}
],
ex:{type:'build',title:'Ditt sociala stödnät',desc:'Kartlägg och stärk ditt sociala nätverk.',
fields:[
{l:'Tre personer du kan ringa om du har det tufft',ph:'T.ex. Systern, f.d. kollegan, grannen...',ta:true,hint:'Skriv ner dem — det är viktigt!'},
{l:'En aktivitet du kan göra med andra denna vecka',ph:'T.ex. Promenad med granne, möte i föreningen, volontärpass'},
{l:'Finns det en gemenskap du vill hitta?',ph:'T.ex. Löpgrupp, språkklubb, bouleklubb...',hint:'Googla föreningar i Helsingborg'},
{l:'Hur mår du just nu — ärligt?',ph:'T.ex. Ganska bra / Lite nere / Ganska tufft just nu...',hint:'Inga rätta svar — bara ärlighet.'}
]},
quiz:[
{q:'Hur stor är risken för hjärt-kärlsjukdom vid kronisk ensamhet?',o:['Ingen extra risk','+29%','+5%','+10%'],c:1},
{q:'Vad ger volontärarbete utöver att hjälpa andra?',o:['Lön','Struktur, syfte och socialt nätverk','Bara dåligt samvete om man slutar','Ingenting extra'],c:1},
{q:'Vilket nummer ringer du Mind Stödlinje på?',o:['1177','90101','112','116 111'],c:1},
{q:'Vad är effektivare — många ytliga kontakter eller få nära?',o:['Många ytliga','Få nära relationer','Det är exakt likvärdigt','Beror på personlighet'],c:1}
],
pr:['Föreningar och aktiviteter för nyanlända i Helsingborg?','Hur hanterar jag ensamhet under jobbsöket?','Tips för att bygga vänskap som vuxen?']},

{id:'h7',icon:'🚭',title:'Alkohol, rökning & vanor',sub:'Ärliga fakta utan pekpinnar',color:'#fb923c',bc:'rgba(251,146,60,.3)',bg:'rgba(251,146,60,.07)',video:'/videos/h7-vanor.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🚭',h:'Vad är syftet?',t:'Förstå dina vanor — utan pekpinnar. Och få verktyg för att förändra dem.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Alkoholgränser, rökningens kostnad, sluta-resurser, och hur du bryter en vana.'},
{icon:'✅',h:'När du är klar ska du...',t:'kunna identifiera en vana att jobba med — och hur du kan byta rutin.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 3 minuter för film och lektioner, plus en vana-övning.'}
],
a:'Varje försök räknas. Att misslyckas ökar bara chansen att lyckas nästa gång.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom alkoholgränser, rökningens kostnader, sluta-resurser och vanans psykologi. Se den först.'},
{t:'Alkohol — risker och gränser',
cards:[
{icon:'🚹',h:'Män',t:'Riskdrickning: mer än 14 glas/vecka.'},
{icon:'🚺',h:'Kvinnor',t:'Riskdrickning: mer än 9 glas/vecka.'},
{icon:'😰',h:'Akut',t:'Olyckor, dåliga beslut, ångest dagen efter.'},
{icon:'⚠️',h:'Alkohol och stress',t:'Löser inte stress — förstärker den på lång sikt.'}
],
a:'Alkohol är klassad som klass 1-karcinogen av WHO. Det finns ingen "säker" mängd för cancer.'},
{t:'Rökning — kostnad och alternativ',
cards:[
{icon:'💸',h:'En ask om dagen',t:'≈ 4 000 kr/månad — 48 000 kr/år.'},
{icon:'📞',h:'Sluta-röka-linjen',t:'020-84 00 00 — gratis.'},
{icon:'💊',h:'Nikotinläkemedel',t:'Receptfritt på apotek.'},
{icon:'📱',h:'Appen "Smoke Free"',t:'Stödjer steg för steg.'}
],
a:'Kombinationen beteendestöd + nikotinläkemedel har 3–4 gånger högre framgångsrate än att sluta utan stöd.'},
{t:'Bryta dåliga vanor',
cards:[
{icon:'⚡',h:'Trigger',t:'Vad sätter igång vanan?'},
{icon:'🔄',h:'Rutin',t:'Vad du gör.'},
{icon:'🎁',h:'Belöning',t:'Vad du får ut av det.'},
{icon:'🔁',h:'Byt rutinen',t:'Behåll belöningen. T.ex. stress → andas djupt → samma avslappning.'}
],
a:'Miljödesign är kraftfullare än viljestyrka. Gör den nya vanan enklare än den gamla.'}
],
ex:{type:'build',title:'Din vanekartläggning',desc:'Ärlig analys av en vana du vill förändra.',
fields:[
{l:'Finns det en vana du vill ändra?',ph:'T.ex. Röka mindre, dricka mer vatten, minska skärmtid...'},
{l:'Vad är triggern? (vad startar vanor)',ph:'T.ex. Stress, tristess, sällskap, efter mat...'},
{l:'Vilken belöning ger vanor? (äkta behov bakom)',ph:'T.ex. Avslappning, socialt, paus, hantera ångest...'},
{l:'En alternativ rutin som ger samma belöning',ph:'T.ex. 5 min promenad vid stress istället för cigarrett',hint:'Håll belöningen — byt bara rutinen!'}
]},
quiz:[
{q:'Vad är riskdrickning för en man per vecka?',o:['Mer än 20 glas','Mer än 14 glas','Mer än 7 glas','Mer än 5 glas'],c:1},
{q:'Hur mycket kostar en ask cigarretter om dagen på ett år?',o:['10 000 kr','48 000 kr','5 000 kr','25 000 kr'],c:1},
{q:'Vilket nummer ringer du Sluta-röka-linjen?',o:['112','020-84 00 00','1177','90101'],c:1},
{q:'Vad är kraftfullare än viljestyrka vid vanebrytning?',o:['Belöningar','Miljödesign — ta bort triggern','Straff','Att tänka mer'],c:1}
],
pr:['Plan för att röka mindre utan att sluta direkt.','Hur minskar jag alkohol under stressiga perioder?','Atomic Habits-metoden på svenska?']},

{id:'h8',icon:'💊',title:'Läkemedel & egenvård',sub:'Rätt info om vanliga medel',color:'#fb923c',bc:'rgba(251,146,60,.3)',bg:'rgba(251,146,60,.07)',video:'/videos/h8-lakemedel.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'💊',h:'Vad är syftet?',t:'Förstå vanliga receptfria medel — och när du ska fråga om hjälp.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Receptfritt sortiment, säkerhet kring paracetamol, kroniska sjukdomar, och hur 1177 hjälper.'},
{icon:'✅',h:'När du är klar ska du...',t:'veta vilka medel som finns och vart du vänder dig vid tvekan.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 3 minuter för film och lektioner.'}
],
a:'Apotekspersonalen är utbildade farmaceuter — använd dem. Det är gratis rådgivning.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom vanliga receptfria läkemedel, säkerhet, kroniska sjukdomar och hur 1177 hjälper dig dygnet runt. Se den först.'},
{t:'Receptfria läkemedel',
cards:[
{icon:'💊',h:'Paracetamol (Alvedon)',t:'Smärta och feber.'},
{icon:'💊',h:'Ibuprofen (Ipren)',t:'Inflammation och smärta.'},
{icon:'💊',h:'Antihistamin',t:'Allergi och snuva.'},
{icon:'🩹',h:'Sår- och hudprodukter',t:'Plåster, salvor, krämer.'}
],
a:'Paracetamol är säkert vid normala doser men FARLIGT vid överdos (levertoxiskt). Ibuprofen — undvik vid magsår, njurproblem och graviditet.'},
{t:'Kroniska sjukdomar',
cards:[
{icon:'💰',h:'Högkostnadsskydd',t:'Max 1 300 kr/år för receptbelagda — sedan gratis.'},
{icon:'🏥',h:'Hjälpmedel',t:'Gratis via Region Skåne vid behov.'},
{icon:'🏠',h:'Hemsjukvård',t:'Om du inte kan ta dig till vårdcentralen.'},
{icon:'📋',h:'Berätta alltid',t:'Om alla mediciner för varje läkare.'}
],
a:'Kroniska sjukdomar kan ge rätt till sjukersättning via FK om arbetskapaciteten är nedsatt — anmäl till Försäkringskassan.'},
{t:'1177 — din digitala vårdguide',
cards:[
{icon:'🔍',h:'Symtom-sök',t:'Vad kan det vara?'},
{icon:'📞',h:'Sjuksköterskestöd',t:'Per telefon — dygnet runt.'},
{icon:'📅',h:'Boka tid',t:'På vårdcentralen direkt.'},
{icon:'💊',h:'Läkemedelsinfo',t:'Och dina egna journaler.'}
],
a:'Vid tvekan — ring 1177 innan du tar ett läkemedel. Rätt vård i rätt tid — och gratis.'}
],
ex:{type:'build',title:'Din hälsöversikt',desc:'Koll på dina mediciner och vårdbehov.',
fields:[
{l:'Tar du några regelbundna mediciner?',ph:'T.ex. Ja — blodtrycksmedicin, astmapump / Nej',hint:'Om ja: har du tillräckligt? Recept förnyat?'},
{l:'Har du ett aktuellt hälsoproblem du bör söka vård för?',ph:'T.ex. Ryggsmärta sedan 6 mån, stress-symtom...'},
{l:'Vet du var närmaste apotek är?',ph:'T.ex. Apoteket på Kullagatan / Kronans apotek Väla'},
{l:'Vad är din plan om du plötsligt blir sjuk?',ph:'T.ex. Ring 1177 och följ deras råd',hint:'Ha numret sparat: 1177'}
]},
quiz:[
{q:'Vad heter Sveriges vårdtelefon?',o:['112','1177','90101','114 14'],c:1},
{q:'Hur mycket betalar du max för receptläkemedel per år?',o:['500 kr','1 300 kr','5 000 kr','Inga max-belopp'],c:1},
{q:'Vad bör du alltid fråga apotekspersonalen?',o:['Priset','Råd om rätt medicin och dosering — gratis!','Dina journaler','Om du kan sluta med medicinen'],c:1},
{q:'Vad kan du göra på 1177.se?',o:['Bara ringa sjuksköterska','Symtomkoll, boka tid, journaler och läkemedelsinformation','Bara boka tid','Köpa receptfria läkemedel'],c:1}
],
pr:['Vad gör 1177 och hur använder jag det bäst?','Vad är skillnaden Alvedon och Ipren?','Hur ansöker jag om sjukersättning via FK?']},

{id:'h9',icon:'🦷',title:'Tandvård & kroppen',sub:'Glöm inte resten av kroppen',color:'#fb923c',bc:'rgba(251,146,60,.3)',bg:'rgba(251,146,60,.07)',video:'/videos/h9-tandvard.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🦷',h:'Vad är syftet?',t:'Lära dig vad som finns för tandvård, syn, hörsel och förebyggande hälsa.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Tandvårdsstöd, gratis tandvård för unga, syn- och hörselvård, samt screeningprogram.'},
{icon:'✅',h:'När du är klar ska du...',t:'veta vad du har rätt till och hur du tar emot kallelser.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 3 minuter för film och lektioner.'}
],
a:'Sverige har ett av världens mest effektiva screeningprogram — ta emot kallelserna.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom tandvård, syn och hörsel, samt de gratis screeningprogrammen som räddar liv. Se den först.'},
{t:'Tandvård — dyrt men viktigt',
cards:[
{icon:'💰',h:'Tandvårdsstöd',t:'600 kr/år i bidrag.'},
{icon:'📊',h:'Referenstaxan',t:'Reglerar max-priser — jämför på 1177.se.'},
{icon:'🏥',h:'Folktandvården',t:'Ofta billigast.'},
{icon:'🎓',h:'Gratis upp till 23 år',t:'För barn och unga.'},
{icon:'❤️',h:'Munhälsa = hela kroppen',t:'Kopplas till hjärtsjukdom och diabetes.'}
],
a:'Förebyggande vård (putsning + fluorid 2 ggr/år) är alltid billigare än lagning.'},
{t:'Syn & hörsel',
cards:[
{icon:'👁️',h:'Synundersökning',t:'200–400 kr.'},
{icon:'👓',h:'Glasögon',t:'500–3 000 kr. Socialbidrag kan täcka.'},
{icon:'👂',h:'Hörseltest',t:'Gratis via hörcentralen.'},
{icon:'🦻',h:'Hörapparat',t:'Subventioneras kraftigt — ≈ 100 kr.'}
],
a:'Synproblem är vanlig orsak till huvudvärk och koncentrationssvårigheter. Försumma inte syn och hörsel — det påverkar arbetsförmåga.'},
{t:'Förebyggande hälsa',
cards:[
{icon:'🎗️',h:'Mammografi',t:'40–74 år — du kallas automatiskt.'},
{icon:'🔬',h:'Cellprov',t:'23–64 år — du kallas automatiskt.'},
{icon:'🫁',h:'KOL-screening',t:'Rökare 40+.'},
{icon:'💉',h:'HPV-vaccin',t:'Gratis upp till 26 år.'}
],
a:'Bröstcancer hittad via mammografi har 95 % 5-årsöverlevnad. Cervixcancer kan helt förebyggas — ta emot kallelserna.'}
],
ex:{type:'build',title:'Din kropp-checklista',desc:'Säkra att du tar hand om hela dig.',
fields:[
{l:'När var du senast hos tandläkaren?',ph:'T.ex. För 2 år sedan — ska boka Folktandvården',hint:'Folktandvården Helsingborg: 0770-17 70 00'},
{l:'Behöver du glasögon eller hörselhjälp?',ph:'T.ex. Nej / Ja — misstänker att synen försämrats'},
{l:'Finns det en hälsokallelse du missat?',ph:'T.ex. Fått brev om mammografi men inte bokat tid...'},
{l:'En hälsoåtgärd du tar tag i denna vecka',ph:'T.ex. Bokar tandläkartid på Folktandvården',hint:'Gör det nu!'}
]},
quiz:[
{q:'Hur mycket är tandvårdsstödet för vuxna per år?',o:['Gratis','600 kr','2 000 kr','5 000 kr'],c:1},
{q:'Hur mycket kostar en hörapparat för patienten med subvention?',o:['3 000 kr','Ca 100 kr','Gratis','1 000 kr'],c:1},
{q:'Vid vilken ålder kallas du automatiskt till mammografi?',o:['30-60 år','40-74 år','50-80 år','Alla vuxna'],c:1},
{q:'Vad är Folktandvårdens fördel?',o:['Bäst utrustning','Ofta billigast','Öppet dygnet runt','Inga väntetider'],c:1}
],
pr:['Hitta billig tandläkare i Helsingborg.','Hur ansöker jag om glasögonbidrag?','Vilka gratis hälsokontroller har jag rätt till?']},

{id:'h10',icon:'🌱',title:'Välmående under jobbsök',sub:'Ta hand om dig MEDAN du söker jobb',color:'#fb923c',bc:'rgba(251,146,60,.3)',bg:'rgba(251,146,60,.07)',video:'/videos/h10-valmaende.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🌱',h:'Vad är syftet?',t:'Ta hand om dig medan du söker jobb — inte trots det.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Jobbsökets psykologi, en hållbar rutin, och hur du minns att du är mer än ditt jobb.'},
{icon:'✅',h:'När du är klar ska du...',t:'ha en daglig välmående-rutin som håller över tid.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 3 minuter för film och lektioner, plus en personlig rutin-övning.'}
],
a:'Det är normalt att ha det tufft under jobbsök. Det är inte normalt att inte ta hand om sig.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom varför jobbsök är psykiskt påfrestande, vad som hjälper i vardagen, och hur du skyddar dig själv. Se den först, så blir lektionerna lättare att följa.'},
{t:'Jobbsökets psykologi',
cards:[
{icon:'💔',h:'Avvisning gör ont',t:'Hjärnan reagerar som på fysisk smärta — det är inte i ditt huvud.'},
{icon:'🌀',h:'Identitet kopplad till jobb',t:'Det är vanligt i Sverige — och gör jobbsöket extra tungt.'},
{icon:'👤',h:'Ensamhet förstärker allt',t:'Sök mänsklig kontakt — varje vecka.'},
{icon:'✋',h:'Det är NORMALT',t:'Du är inte ensam — och det är inget fel på dig.'}
],
a:'Hjärnskanningar visar att socialt avvisande aktiverar samma smärtcentra som fysisk smärta — det är därför varje nej känns.'},
{t:'Den hållbara jobbsökar-rutinen',
cards:[
{icon:'🕗',h:'Fast starttid',t:'Stig upp samma tid varje dag — och klä dig.'},
{icon:'📋',h:'Förmiddag = jobbsök',t:'08–12: söka, skriva, nätverka.'},
{icon:'🍽️',h:'Lunch — lämna hemmet',t:'En promenad eller café gör skillnad.'},
{icon:'🎓',h:'Eftermiddag = lära',t:'13–14: ny kompetens. 14–15: rörelse.'},
{icon:'🔒',h:'Fast sluttid',t:'15:00 — SLUTA. Lika viktigt som start.'}
],
a:'Struktur är frihet — utan rutin smetas jobbsöket ut över hela dygnet och skapar skuld dygnet runt.'},
{t:'Du är mer än ditt jobb',
cards:[
{icon:'📓',h:'Tacksamhetsdagbok',t:'Skriv 3 saker du är tacksam för — varje dag.'},
{icon:'💪',h:'Vad du är bra på',t:'Lista det UTÖVER jobbet — hobbyer, vänskap, omsorg.'},
{icon:'❤️',h:'Vem bryr sig om dig',t:'Människor som ser hela dig — inte din jobbstatus.'},
{icon:'🌅',h:'Jobbsöket är tillfälligt',t:'Du är permanent — glöm inte det.'}
],
a:'Gratitude journaling sänker depressions-symtom och ökar välmående i kliniska studier — det tar 2 minuter om dagen.'}
],
ex:{type:'build',title:'Min välmående-rutin under jobbsöket',desc:'En hållbar plan för att ta hand om dig MEDAN du söker.',
fields:[
{l:'Din startrutin imorgon bitti (konkret)',ph:'T.ex. Upp 07:30, duscha, klä på mig, frukost kl 08:00',hint:'Klä på dig — det gör skillnad psykologiskt!'},
{l:'Din sluttid för jobbsöket varje dag',ph:'T.ex. Avslutar kl 15:00 — sedan är det fritid',hint:'En sluttid är lika viktig som en starttid'},
{l:'Tre saker du är tacksam för just nu',ph:'1. \\n2. \\n3. ',ta:true,hint:'Inga rätta svar — bara äkta.'},
{l:'En sak du INTE ska göra under jobbsöket för att skona dig själv',ph:'T.ex. Läsa nyheter mer än 15 min/dag, jämföra mig med andra på LinkedIn...'}
]},
quiz:[
{q:'Vad aktiverar avvisning (t.ex. ett avslagsbrev) i hjärnan?',o:['Ingenting speciellt','Samma smärtcentra som fysisk smärta','Bara lätt irritation','Glädje (signal att försöka igen)'],c:1},
{q:'Varför är det viktigt att klä på sig när man jobbar hemifrån?',o:['Det är inte viktigt','Det påverkar psykologisk beredskap och fokus','Bara av social hänsyn','Bara om man har videomöte'],c:1},
{q:'Vad visar forskning om daglig tacksamhets-notering?',o:['Ingen effekt','Sänker depressionssymtom signifikant','Bara bra för optimister','Fungerar bara kortsiktigt'],c:1},
{q:'En hållbar jobbsökardag har...',o:['8 timmar ren jobbsökning','Tydlig start, pauser, rörelse och SLUTTID','Inga pauser — maximal effektivitet','Jobbsökning hela kvällen också'],c:1}
],
pr:['Bygg min personliga välmående-rutin under jobbsöket.','Hur hanterar jag avslagsbrev psykologiskt?','Tacksamhetsdagbok — hur gör jag det?']},

{id:'h11',icon:'🏥',title:'1177 & digital vård',sub:'Rätt vård på rätt ställe',color:'#fb923c',bc:'rgba(251,146,60,.3)',bg:'rgba(251,146,60,.07)',
lessons:[
{t:'Vad är 1177?',s:'1177 är Sveriges nationella vårdguide.\n\n📞 Ring 1177 — sjuksköterska svarar dygnet runt\n💻 1177.se — boka tid, läsa om symtom, se recept\n📱 Appen 1177 — se journalanteckningar & prover\n\nDet är alltid gratis att ringa 1177.',
a:'1177 hjälper dig avgöra om du behöver söka vård, och var. Ca 40% av de som ringer behöver inte söka vård alls — de får råd per telefon. Appen kräver BankID-inloggning.'},
{t:'Vårdens nivåer — var söker du?',s:'1. 🏠 Egenvård — vila, Alvedon, näsdroppar\n2. 📞 Ring 1177 — osäker? Fråga sjuksköterska\n3. 🏥 Vårdcentral — de flesta sjukdomar\n4. 🚑 Akutmottagning — livshotande\n5. 📞 112 — nödläge\n\nFel nivå = lång väntetid och sämre vård.',
a:'Ca 30% av akutbesöken i Sverige är onödiga och kunde hanterats på vårdcentral eller av 1177. Akuten är för livshotande tillstånd. Närakut (om det finns lokalt) är för akuta men icke-livshotande besvär.'},
{t:'Digital vård — Kry, Min Doktor, Doktor24',s:'Digitala vårdtjänster:\n✅ Tillgängliga 7 dagar/vecka\n✅ Vanligtvis ingen väntetid\n✅ Kostar samma patientavgift\n✅ Bra för: förkylning, urinvägsinfektion, recept\n\n❌ Passar inte: allvarliga symtom, undersökning krävs',
a:'Kry, Min Doktor, Doktor24 och Helsa ingår i Region Skånes vårdval. Du betalar samma patientavgift (ca 200-350 kr) som på en fysisk vårdcentral. Recept skickas direkt till valfritt apotek.'}
],
ex:{type:'build',title:'Din vårdplan',desc:'Vet hur du söker rätt vård vid rätt tillfälle.',
fields:[
{l:'Var är din närmaste vårdcentral?',ph:'T.ex. Drottninghög Vårdcentral, Helsingborg',hint:'Lista inbyggd i 1177.se → Hitta vård'},
{l:'Har du 1177-appen installerad?',ph:'Ja/Nej — om nej, ladda ner och logga in med BankID'},
{l:'Vad söker du digital vård för och vad inte?',ph:'T.ex. Förkylning → digital vård. Bröstsmärta → 112',ta:true},
{l:'Lista 3 situationer och rätt åtgärd',ph:'1. Halsont → Ring 1177\n2. Benfraktur → Akuten\n3. Recept → Digital vård',ta:true}
]},
quiz:[
{q:'Vad kostar det att ringa 1177?',o:['50 kr','100 kr','Gratis','Samma som akuten'],c:2},
{q:'Vad är 1177 bäst för?',o:['Livshotande nödlägen','Råd om symtom + boka vård','Endast recept','Tandvård'],c:1},
{q:'Vilket nummer ringer du vid livshotande nödläge?',o:['1177','113 13','112','116 000'],c:2},
{q:'Vad passar digital vård (Kry etc) för?',o:['Benfraktur','Förkylning och recept','Hjärtinfarkt','Psykossjukdom'],c:1}
],
pr:['Vilken vård behöver jag för symtom X?','Hur bokar jag tid på vårdcentral i Helsingborg?','Vad gäller för utländska medborgare och sjukvård i Sverige?']},

{id:'h12',icon:'🛡️',title:'Försäkringskassan & sjukpenning',sub:'Ekonomin när du inte kan jobba',color:'#fb923c',bc:'rgba(251,146,60,.3)',bg:'rgba(251,146,60,.07)',
lessons:[
{t:'Vad gör Försäkringskassan?',s:'Försäkringskassan (FK) betalar ut:\n\n🤒 Sjukpenning — om du inte kan jobba\n👶 Föräldrapenning — barnledighet\n💊 Aktivitetsersättning — ung med funktionsnedsättning\n🦯 Handikappersättning\n🏠 Bostadsbidrag\n\nAllt söks via forsakringskassan.se',
a:'Försäkringskassan hanterar över 40 förmåner och stöd. Sjukpenning kräver ett läkarintyg från dag 8 (arbetsgivaren betalar dag 1-7). För egenföretagare gäller andra regler.'},
{t:'Sjukskrivning steg för steg',s:'Dag 1: Sjukanmäl dig till arbetsgivaren\nDag 1-7: Arbetsgivaren betalar (sjuklön 80%)\nDag 8: Läkarintyg krävs\nDag 8+: Ansök om sjukpenning hos FK\n\n⚠️ Karensdag = dag 1 dras 20% av dagslön',
a:'Sjukpenning är ca 80% av lönen upp till ett tak (ca 43 900 kr/mån 2026). Utan kollektivavtal kan du förlora mycket. Facket kan hjälpa vid tvist. FK:s beslut kan överklagas.'},
{t:'Föräldrapenning & VAB',s:'Föräldrapenning:\n✅ 480 dagar per barn\n✅ Ca 80% av lönen\n✅ Båda föräldrar har rätt\n\nVAB (Vård av barn):\n✅ Om barnet är sjukt\n✅ Anmäl till FK samma dag\n✅ Ca 80% av lönen',
a:'Föräldrapenning är en av världens mest generösa — 480 dagar. 90 dagar är "pappamånader" och kan ej överlåtas. Anmäl på Mina sidor på forsakringskassan.se eller appen.'}
],
ex:{type:'build',title:'Din FK-plan',desc:'Koll på rättigheter om du inte kan jobba.',
fields:[
{l:'Har du installerat Försäkringskassans app?',ph:'Ja/Nej — ladda ner och logga in med BankID'},
{l:'Vad händer om du blir sjuk dag 1?',ph:'T.ex. Ring arbetsgivaren, anmäl sjukdom, dag 1-7 = sjuklön...',ta:true},
{l:'Vilken ersättning är aktuell för dig just nu?',ph:'T.ex. Föräldrapenning, bostadsbidrag, aktivitetsersättning...'},
{l:'Har du frågor om din situation? (kolla forsakringskassan.se)',ph:'T.ex. Vad gäller vid deltidssjukskrivning?',hint:'forsakringskassan.se → Mina sidor'}
]},
quiz:[
{q:'Vad är en karensdag?',o:['En ledig dag','Dag 1 av sjukdom — 20% av dagslön dras','En sjukintygsdag','FK:s handläggningstid'],c:1},
{q:'Från vilken dag krävs läkarintyg?',o:['Dag 1','Dag 3','Dag 8','Dag 14'],c:2},
{q:'Hur många dagar föräldrapenning finns per barn?',o:['180','365','480','720'],c:2},
{q:'Vad heter FK:s app?',o:['Mina sidor','Min FK','Försäkringskassan','1177'],c:2}
],
pr:['Hur ansöker jag om sjukpenning?','Vad gäller föräldrapenning om jag inte haft jobb?','Hur överklagar jag ett FK-beslut?']},

{id:'h13',icon:'🧬',title:'Kropp & fysisk hälsa',sub:'Förstå din kropp — ta hand om den',color:'#fb923c',bc:'rgba(251,146,60,.3)',bg:'rgba(251,146,60,.07)',
lessons:[
{t:'Förebyggande hälsa — screening & kontroller',s:'Gratis hälsokontroller du har rätt till:\n\n🔬 Cellprov (cervix) — var 3-7 år\n🫀 Blodtrycks­kontroll — vart 5:e år\n🩸 Blodsocker (diabetes) — vid riskfaktorer\n🏥 Mammografi — från 40 år\n\nBokas via din vårdcentral eller 1177.',
a:'Screening räddar liv — framför allt för cancer och hjärt-kärlsjukdom. Boka proaktivt även om du mår bra. Kostnadsfritt inom ramen för patientavgiften.'},
{t:'Värk, smärta & muskuloskelettala besvär',s:'Vanligaste orsaker till sjukskrivning:\n🦴 Ryggvärk\n🦷 Nackspänningar\n🦵 Knäproblem\n\nHjälper:\n✅ Rörelse (inte vila)\n✅ Ergonomi — rätt stol & skärm\n✅ Fysioterapeut — remiss via vårdcentral\n✅ Värme eller kyla\n\n❌ Sängliggande förvärrar ryggvärk',
a:'Ca 30% av alla sjukskrivningar beror på muskel- och ledbesvär. Fysioterapeut kan bokas direkt utan läkarremiss på de flesta vårdcentraler. Naprapater och kiropraktorer kostar ca 400-700 kr.'},
{t:'Könsspecifik hälsa & sexuell hälsa',s:'Kostnadsfritt i Sverige:\n✅ STI-testning (klamydia, HIV etc)\n✅ Preventivmedelsrådgivning\n✅ Gynekologisk hälsokontroll\n✅ Prostatakontroll\n\nSöks via:\n• Ungdomsmottagning (upp till 25 år)\n• Din vårdcentral\n• 1177.se → Hitta vård',
a:'STI-testning är gratis och konfidentiell. Klamydia är den vanligaste STI i Sverige. Ungdomsmottagningar är kostnadsfria upp till 25 år och erbjuder preventivmedel, samtal och tester.'}
],
ex:{type:'build',title:'Din hälsokontrollplan',desc:'Planera förebyggande hälsokontroller.',
fields:[
{l:'Senaste gången du var på hälsokontroll?',ph:'T.ex. Aldrig / Förra året / Vet inte'},
{l:'Vilka kontroller är aktuella för dig?',ph:'T.ex. Blodtryck, cellprov, blodsocker...',ta:true,hint:'Fråga din vårdcentral om du är osäker'},
{l:'Har du kroniska besvär att hantera?',ph:'T.ex. Ryggvärk — ska boka fysioterapeut'},
{l:'Ditt nästa steg',ph:'T.ex. Ringa 1177 och boka hälsokontroll',hint:'Gör det nu!'}
]},
quiz:[
{q:'Hur ofta rekommenderas cellprov?',o:['Varje år','Var 3-7 år','Var 10 år','En gång i livet'],c:1},
{q:'Vad hjälper mot ryggvärk?',o:['Ligga still','Rörelse och rätt ergonomi','Starka smärtstillande','Ingenting'],c:1},
{q:'Var testar du dig gratis för STI?',o:['Apoteket','Akuten','Ungdomsmottagningen eller vårdcentralen','Privat klinik'],c:2},
{q:'Kan du boka fysioterapeut utan läkarremiss?',o:['Nej','Ja, ofta direkt via vårdcentral','Bara via akuten','Bara privatpraktiker'],c:1}
],
pr:['Hur bokar jag hälsokontroll i Helsingborg?','Vad ingår i STI-testning?','Hur hittar jag en fysioterapeut via 1177?']},

{id:'h14',icon:'🆘',title:'Kris & psykisk ohälsa',sub:'Veta när och var du söker hjälp',color:'#fb923c',bc:'rgba(251,146,60,.3)',bg:'rgba(251,146,60,.07)',
lessons:[
{t:'Skillnad ångest, depression och kris',s:'Ångest = oro och rädsla — framtidsfokus\nDepression = nedstämdhet, hopplöshet — nutidsfokus\nKris = reaktion på ett svårt livsevent\n\nAlla tre är vanliga och behandlingsbara.\n\nEtt vanligt år i Sverige:\n• 25-30% upplever ångest\n• 10-15% drabbas av depression',
a:'Psykisk ohälsa är en av de vanligaste folksjukdomarna. Stigmat minskar men är fortfarande en barriär. Tidigt stöd är dramatiskt mer effektivt än sen behandling.'},
{t:'Var söker du hjälp?',s:'Akut kris just nu:\n📞 112 — livshotande\n📞 116 123 — Mind självmordslinjen (dygnet runt)\n📞 1177 — råd om psykisk hälsa\n\nVanlig psykisk ohälsa:\n🏥 Din vårdcentral — remiss till psykolog\n💻 Stödlinjen.se — chatt & telefon\n🧠 BUP (under 18) / Psykiatri (vuxen)',
a:'Mind självmordslinjen (116 123) är gratis och anonym. Stödlinjen.se erbjuder kostnadsfri chatt. Vårdcentralen kan remittera till psykolog (psykologprogrammet, begränsat antal sessioner). Privat psykolog kostar ca 900-1 500 kr/session.'},
{t:'Hur stödjer du någon annan?',s:'Om någon nära dig mår dåligt:\n\n✅ Fråga direkt: "Hur mår du egentligen?"\n✅ Lyssna — utan att fixa\n✅ Normalisera att söka hjälp\n✅ Följ med till vårdcentralen om de vill\n✅ Håll kontakten efteråt\n\n❌ Säg inte: "Det är inte så farligt" eller "Tänk positivt"',
a:'Att fråga direkt om självmordstankar minskar NOT risken — det öppnar en dörr. Att lyssna utan att ge råd är ofta mer hjälpsamt än att lösa problemet. Närstående till psykisk sjuka har rätt till eget stöd via socialtjänsten.'}
],
ex:{type:'build',title:'Din krishjälpsplan',desc:'Veta exakt vad du gör om du eller någon nära mår dåligt.',
fields:[
{l:'Spara dessa nummer i telefonen nu',ph:'116 123 (Mind), 1177, 112',hint:'Gör det nu — det tar 30 sekunder'},
{l:'Vad är ditt första steg om du mår dåligt?',ph:'T.ex. Ringa 1177, prata med min vän X, boka tid på vårdcentralen...'},
{l:'Finns det någon du litar på att kontakta?',ph:'T.ex. Ja — min syster. Eller: Min handläggare på AF.'},
{l:'Känner du igen någon i din omgivning som kan behöva stöd?',ph:'T.ex. Ja — ska höra av mig till X den här veckan.',ta:true}
]},
quiz:[
{q:'Vilket nummer ringer du vid psykisk kris, dygnet runt, gratis?',o:['112','1177','116 123 — Minds självmordslinje','116 000'],c:2},
{q:'Vad ska du INTE säga till någon som mår dåligt?',o:['"Hur mår du egentligen?"','"Det är inte så farligt — tänk positivt"','"Vill du att jag följer med?"','"Jag är här för dig"'],c:1},
{q:'Kan du fråga direkt om självmordstankar?',o:['Nej — det ökar risken','Ja — det öppnar en dörr och minskar inte risken','Bara läkare får fråga','Bara i nödläge'],c:1},
{q:'Vad erbjuder Stödlinjen.se?',o:['Medicinska diagnoser','Gratis chatt & telefonstöd','Boka psykolog','Sjukintyg'],c:1}
],
pr:['Hur söker jag psykologhjälp i Helsingborg?','Vad gäller om jag behöver psykiatrin akut?','Hur pratar jag med någon som mår dåligt?']},

{id:'h15',icon:'💊',title:'Beroende & riskbruk',sub:'Tidiga signaler och var du får hjälp',color:'#fb923c',bc:'rgba(251,146,60,.3)',bg:'rgba(251,146,60,.07)',
lessons:[
{t:'Vad är ett riskbruk?',s:'Riskbruk = en konsumtionsnivå som ökar risken för hälsoskador — utan att vara ett beroende.\n\nAlkohol riskbruk:\n🚹 Män: >14 standardglas/vecka ELLER >4/tillfälle\n🚺 Kvinnor: >9 standardglas/vecka ELLER >3/tillfälle\n\nEtt standardglas = 33cl öl, 15cl vin, 4cl sprit',
a:'Ca 800 000 svenskar har ett riskbruk av alkohol. Riskbruk är inte beroende — men ökar risken för lever-, hjärt- och cancersjukdomar, samt psykisk ohälsa och olyckor.'},
{t:'Andra beroenden',s:'Beroende kan gälla:\n🎰 Spelberoende — vanligare än tros\n📱 Skärmberoende (underhållning, social media)\n☕ Koffein (mildare — men påverkar sömn)\n💊 Receptbelagda läkemedel\n🚬 Nikotin\n\nGemensamt: svårt att sluta trots vilja och negativa konsekvenser.',
a:'Spelberoende drabbar ca 2% av befolkningen, fler bland unga. Stödlinjen för spel: 020-81 91 00. Alla beroenden är behandlingsbara — tidig hjälp ger bäst resultat.'},
{t:'Var får du hjälp?',s:'Gratis hjälp i Sverige:\n🏥 Beroendecentrum — kostnadsfritt\n📞 Alkohollinjen: 020-84 44 48\n📞 Sluta-röka-linjen: 020-84 00 00\n📞 Spelberoende: 020-81 91 00\n💻 Stödlinjen.se\n\nAnonym och kostnadsfri hjälp finns alltid.',
a:'Beroendevård är en del av hälso- och sjukvården i Region Skåne. Remiss via vårdcentral eller direkt kontakt med Beroendecentrum. AA och NA (självhjälpsgrupper) finns i de flesta städer.'}
],
ex:{type:'build',title:'Min hälsovana-analys',desc:'Ärlig reflektion över egna vanor.',
fields:[
{l:'Hur ser ditt alkohol/tobaksbruk ut just nu?',ph:'T.ex. Röker 10 cig/dag / dricker varje helg / inget alls'},
{l:'Finns det en vana du vill förändra?',ph:'T.ex. Minska skärmtid på kvällen, röka mindre...'},
{l:'Vilket stöd finns tillgängligt?',ph:'T.ex. Sluta-röka-linjen 020-84 00 00, Beroendecentrum Helsingborg'},
{l:'Ditt mål och en konkret förändring',ph:'T.ex. Röker max 5/dag nästa vecka — ringer Sluta-röka-linjen imorgon',hint:'Litet steg > inget steg'}
]},
quiz:[
{q:'Vad är riskbruk?',o:['Beroende','Konsumtionsnivå som ökar risken för skador','Att dricka en gång','Spritdrickande'],c:1},
{q:'Hur många standardglas är riskgränsen per vecka för kvinnor?',o:['Fler än 5','Fler än 9','Fler än 14','Fler än 20'],c:1},
{q:'Vilket nummer ringer du för hjälp med spelberoende?',o:['112','020-84 44 48','020-81 91 00','1177'],c:2},
{q:'Är beroendevård gratis i Sverige?',o:['Nej','Ja — via Beroendecentrum och hälso- och sjukvård','Bara för alkohol','Bara med remiss'],c:1}
],
pr:['Var finns Beroendecentrum i Helsingborg?','Hur hjälper jag en närstående med alkoholproblem?','Tips för att minska skärmtid?']},

{id:'h16',icon:'🤰',title:'Graviditet, förlossning & barnhälsa',sub:'Vård för hela familjen',color:'#fb923c',bc:'rgba(251,146,60,.3)',bg:'rgba(251,146,60,.07)',
lessons:[
{t:'Mödravård & förlossning i Sverige',s:'Mödravård (MVC) är gratis och inkluderar:\n✅ Regelbundna kontroller\n✅ Ultraljud\n✅ Förlossningsförberedande kurs\n✅ Stöd från barnmorska\n\nBokas via din vårdcentral eller 1177.\nFörlossning är kostnadsfri.',
a:'Sverige har en av världens lägsta mödradödligheter. Barnmorskemottagningar finns i alla kommuner. Förlossningsvård ingår i det allmänna hälso- och sjukvårdssystemet utan kostnad för patienten.'},
{t:'Barnavårdscentral (BVC)',s:'BVC erbjuder GRATIS till alla barn 0-6 år:\n✅ Regelbundna hälsokontroller\n✅ Vaccinationsprogram\n✅ Stöd vid amning\n✅ Barnhälsokontroller\n✅ Föräldrastöd\n\nRegistrera ditt barn hos din lokala BVC via 1177.',
a:'BVC-programmet innehåller ca 20 besök under de första 6 åren. Vaccinationsprogrammet är gratis och rekommenderat. BVC-sköterskan är ofta den bästa kontaktpersonen för frågor om barnets hälsa och utveckling.'},
{t:'Föräldrapenning & föräldrasupport',s:'Som ny förälder har du rätt till:\n\n📋 Föräldrapenning (FK) — 480 dagar/barn\n🏠 Bostadsbidrag kan öka med barn\n👨‍👩‍👧 Barnbidrag — 1 250 kr/mån/barn\n🎓 Öppen förskola — gratis aktiviteter\n\nAllt samordnas via FK och kommunen.',
a:'Barnbidrag betalas ut automatiskt från FK månaden efter födseln. Flerbarnstillägg tillkommer från barn nr 2. Öppen förskola är en kostnadsfri verksamhet som erbjuder aktiviteter för föräldrar och barn 0-5 år.'}
],
ex:{type:'build',title:'Familjens hälsoplan',desc:'Koll på vård och stöd för din familj.',
fields:[
{l:'Har du eller väntar du barn? Beskriv situationen',ph:'T.ex. Gravid v. 20, har barn 2 år, planerar barn...'},
{l:'Vilka kontakter har du etablerat?',ph:'T.ex. BVC i Drottninghög, barnmorska på MVC Helsingborg'},
{l:'Vilka förmåner är aktuella för dig?',ph:'T.ex. Barnbidrag, föräldrapenning, bostadsbidrag...'},
{l:'Ditt nästa steg',ph:'T.ex. Boka BVC-tid, ansöka om barnbidrag på FK'}
]},
quiz:[
{q:'Vad kostar förlossningsvård i Sverige?',o:['Ca 5 000 kr','Ca 20 000 kr','Ingenting — gratis','Patientavgift per dag'],c:2},
{q:'Till vilken ålder erbjuder BVC gratis kontroller?',o:['1 år','3 år','6 år','18 år'],c:2},
{q:'Hur mycket är barnbidraget per barn och månad?',o:['500 kr','1 000 kr','1 250 kr','2 000 kr'],c:2},
{q:'Hur länge pågår föräldrapenningen?',o:['90 dagar','180 dagar','365 dagar','480 dagar per barn'],c:3}
],
pr:['Var anmäler jag till MVC i Helsingborg?','Vad ingår i BVC-programmet?','Hur ansöker jag om barnbidrag?']},

{id:'h17',icon:'♿',title:'Funktionsnedsättning & stöd',sub:'Rättigheter och hjälpmedel',color:'#fb923c',bc:'rgba(251,146,60,.3)',bg:'rgba(251,146,60,.07)',
lessons:[
{t:'LSS — Lagen om stöd och service',s:'LSS ger rätt till insatser för personer med varaktiga funktionsnedsättningar:\n\n✅ Personlig assistans\n✅ Ledsagarservice\n✅ Daglig verksamhet\n✅ Boende med stöd\n✅ Kontaktperson\n\nAnsöks via kommunens socialförvaltning — kostnadsfritt.',
a:'LSS gäller personer med autism, intellektuell funktionsnedsättning, förvärvad hjärnskada och andra stora funktionsnedsättningar. Bedömning sker av kommunen. Insatserna är kostnadsfria för den enskilde.'},
{t:'Hjälpmedel & rehabilitering',s:'Region Skåne erbjuder hjälpmedel:\n🦽 Rullstol & rullator\n👂 Hörapparat\n👁️ Synhjälpmedel\n🖥️ Tekniska hjälpmedel\n\nFysioterapi & arbetsterapi:\nVia remiss från vårdcentral, kostnadsfritt eller låg kostnad.',
a:'Hjälpmedel förskrivs av arbetsterapeut eller fysioterapeut. Kostnaden varierar — vissa är gratis, andra kostar en egenavgift. Arbetsterapeuten kan också hjälpa med bostadsanpassning.'},
{t:'Arbete med funktionsnedsättning',s:'Stöd vid arbete:\n✅ Lönebidrag (AF betalar del av lön)\n✅ SIUS-konsulent (stöd på arbetsplatsen)\n✅ Anpassad utrustning\n✅ Trygghetsanställning\n\nAF har specialister för arbetslivsinriktad rehabilitering.',
a:'Lönebidrag ger arbetsgivare ekonomiskt stöd för att anställa person med nedsatt arbetsförmåga. Trygghetsanställning är en subventionerad anställningsform för de som har svårt att etablera sig. SIUS = Supported Employment.'}
],
ex:{type:'build',title:'Mitt stödbehov',desc:'Kartlägg vilket stöd du har rätt till.',
fields:[
{l:'Har du en diagnosticerad funktionsnedsättning?',ph:'T.ex. ADHD, autism, hörselnedsättning, rörelsehinder...'},
{l:'Vilket stöd har du idag?',ph:'T.ex. Inga hjälpmedel, personlig assistent, anpassad arbetsplats...'},
{l:'Vad saknar du?',ph:'T.ex. Hörapparat, arbetsanpassning, SIUS-konsulent...'},
{l:'Vem kontaktar du för mer info?',ph:'T.ex. Min handläggare på AF, kommunens LSS-handläggare, 1177',hint:'Börja med din nuvarande kontakt'}
]},
quiz:[
{q:'Vad är LSS?',o:['En bidragsform','Lagen om stöd och service — rätt till insatser','En medicin','En försäkring'],c:1},
{q:'Vem förskriver hjälpmedel?',o:['Apoteket','Läkaren alltid','Arbetsterapeut eller fysioterapeut','FK'],c:2},
{q:'Vad är lönebidrag?',o:['Stöd till arbetstagare','Ekonomiskt stöd till arbetsgivare som anställer person med nedsatt arbetsförmåga','En bidragsform från FK','Sommarjobbs-bidrag'],c:1},
{q:'Vad är SIUS?',o:['En diagnos','Stöd och vägledning på arbetsplatsen','En försäkring','En myndighet'],c:1}
],
pr:['Vad har jag rätt till med diagnosen [X]?','Hur ansöker jag om LSS-insatser?','Hur söker jag lönebidrag via AF?']},

{id:'h18',icon:'🏃',title:'Friskvård & förmåner',sub:'Rörelse som kostar lite men ger mycket',color:'#fb923c',bc:'rgba(251,146,60,.3)',bg:'rgba(251,146,60,.07)',
lessons:[
{t:'Friskvårdsbidrag — vad är det?',s:'Friskvårdsbidraget är en skattefri förmån från arbetsgivaren.\n\nVanligtvis:\n💰 500-5 000 kr/år\n✅ Gym, simhall, yoga, massage\n✅ Skogsmulle, dans, kampsport\n\nFör arbetslösa:\n• Ingen arbetsgivare = inget bidrag\n• Men kommunen kan ha billiga aktiviteter!',
a:'Friskvårdsbidragets maxbelopp är reglerat av Skatteverket. Arbetsgivaren bestämmer nivån. Vid anställning — fråga alltid om friskvårdsbidragets storlek. Det kan vara värt 1 000-5 000 kr/år.'},
{t:'Gratis & billiga sätt att röra sig',s:'Utan bidrag:\n🌲 Friluftsliv — helt gratis\n🚴 Cykel — transport + träning\n💪 Kroppsvikt-träning hemma\n🏊 Kommunens simhallar — billigare än gym\n📺 YouTube-träning — gratis\n🤝 Spontanidrott i parker\n\nHelsingborg: Padelbanor, utegym, Stadsbiblioteket = gratis!',
a:'WHO rekommenderar 150 min måttlig aktivitet per vecka. En promenad 30 min 5 dagar/vecka uppfyller detta. Outdoorträning och hemmaträning är jämförbara med gymträning för de flesta hälsomål.'},
{t:'Rörelse och jobbsök',s:'Jobbsök utan rörelse = svårare.\n\n🧠 30 min promenad ökar fokus 2-3 timmar\n😴 Rörelse förbättrar sömn\n😊 Endorfiner motverkar jobbsökets stress\n⚡ Energinivån ökar\n\nTips: Lägg in promenaden i schemat — inte som "om jag hinner".',
a:'Fysisk aktivitet är ett av de mest evidensbaserade sätten att hantera stress och depression. Att sätta en bestämd tid (ex: 9-9:30 varje dag) ökar följsamheten dramatiskt. Grupp-aktiviteter ger dessutom social kontakt.'}
],
ex:{type:'build',title:'Din rörelseplan',desc:'Konkret och realistisk rörelserutin.',
fields:[
{l:'Vilken rörelse gillar du?',ph:'T.ex. Promenader, cykling, simning, yoga, fotboll...'},
{l:'Hur många minuter/dag är realistiskt?',ph:'T.ex. 30 min promenad vardag — 5 min stretch kvällstid',hint:'150 min/vecka är WHO:s rekommendation'},
{l:'Gratis aktiviteter i Helsingborg du kan använda',ph:'T.ex. Stadsparken, utegym vid Pålsjöbaden, cykel till AF...'},
{l:'Din rörelserutin — tid och dag',ph:'T.ex. Måndag-fredag 9:00-9:30: promenad via Stadsparken',ta:true}
]},
quiz:[
{q:'Vad är friskvårdsbidraget?',o:['Ett bidrag från FK','Skattefri förmån från arbetsgivare för hälsofrämjande aktiviteter','Rabatt på gym','Subventionerat sjukkort'],c:1},
{q:'Hur mycket rörelse rekommenderar WHO per vecka?',o:['30 min','60 min','150 min','300 min'],c:2},
{q:'Hur länge ökar fokus efter en 30 min promenad?',o:['15 min','30 min','2-3 timmar','Ingen effekt'],c:2},
{q:'Vilken träning är GRATIS?',o:['Gym','Gympa med instruktör','Friluftsliv och hemmaträning','Simhall alltid'],c:2}
],
pr:['Vad finns det för gratis aktiviteter i Helsingborg?','Bygg ett träningsprogram för 15 min hemma.','Hur motiverar jag mig att röra mer under jobbsök?']},

{id:'h19',icon:'🌍',title:'Hälsa för nyanlända',sub:'Vård och rättigheter i Sverige',color:'#fb923c',bc:'rgba(251,146,60,.3)',bg:'rgba(251,146,60,.07)',
lessons:[
{t:'Rätten till vård i Sverige',s:'I Sverige har du rätt till sjukvård oavsett bakgrund.\n\n✅ Asylsökande: akut vård + vård som inte kan vänta\n✅ EU-medborgare: sjukvård med EU-kort\n✅ Permanent uppehållstillstånd: full sjukvård\n✅ Papperslösa: akut vård och vård för barn\n\nVård söks via vårdcentralen eller 1177.',
a:'Asylsökande vuxna har rätt till omedelbart nödvändig vård, mödravård, abort och preventivmedel. Barn har rätt till samma vård som folkbokförda barn. Region Skåne följer nationella riktlinjer.'},
{t:'Tolkhjälp & kulturell kompetens',s:'Du har rätt att begära tolk vid vårddbesök — gratis!\n\n📞 Ring vårdcentralen i förväg och begär tolk\n📱 Telefontolk om ingen finns på plats\n💻 Digitala tolkars — via skärm\n\nDu behöver ALDRIG ta med familjen som tolk vid medicinska samtal.',
a:'Tolkhjälp är en lagstadgad rättighet i svensk sjukvård. Att använda familjemedlemmar som tolkar är olämpligt — det äventyrar sekretesskyddet och kan leda till felaktig information.'},
{t:'Hälsoundersökning för nyanlända',s:'Nyanlända erbjuds en kostnadsfri hälsoundersökning:\n\n✅ Allmän hälsostatus\n✅ Smittskyddsprover (tuberkulos, hepatit)\n✅ Vaccinationskontroll\n✅ Psykisk hälsa (traumascreen)\n✅ Tandvårdsremiss\n\nBokas via din kommun eller 1177.',
a:'Hälsoundersökning för nyanlända är frivillig men starkt rekommenderad. Den ger en samlad bild och kan fånga upp hälsoproblem som behöver behandlas. Speciellt viktig för dem som kommit från länder med bristfällig sjukvård.'}
],
ex:{type:'build',title:'Min hälsostatus i Sverige',desc:'Kartlägg din sjukvårdssituation.',
fields:[
{l:'Vilken rätt till vård har du i Sverige?',ph:'T.ex. Permanent uppehållstillstånd = full sjukvård',hint:'Osäker? Ring 1177'},
{l:'Har du genomfört hälsoundersökning?',ph:'Ja/Nej — om nej, kontakta din kommun eller 1177'},
{l:'Har du en namngiven läkare på en vårdcentral?',ph:'T.ex. Ja — Dr Svensson på Drottninghög VC'},
{l:'Finns det hälsofrågor du vill ta upp?',ph:'T.ex. Kronisk smärta, psykiskt mående, vaccin...',ta:true}
]},
quiz:[
{q:'Har asylsökande rätt till vård i Sverige?',o:['Nej','Ja — akut vård och vård som inte kan vänta','Bara om de betalar','Bara barn'],c:1},
{q:'Vem har rätt till gratis tolk vid sjukvård?',o:['Bara flyktingar','Alla som behöver — tolkhjälp är lagstadgad','Bara vid akutbesök','Ingen — det kostar'],c:1},
{q:'Vad inkluderar hälsoundersökning för nyanlända?',o:['Bara blodprov','Hälsostatus, smittskydd, vaccin, psykisk hälsa och tandvård','Bara psykisk hälsa','Bara fysisk hälsa'],c:1},
{q:'Vad bör du INTE göra vid medicinska samtal?',o:['Begära tolk','Ange alla symtom','Använda familjen som tolk','Ställa frågor'],c:2}
],
pr:['Vad har jag rätt till i sjukvården med [uppehållsstatus]?','Hur begär jag tolk vid mitt läkarbesök?','Var genomgår jag hälsoundersökning för nyanlända i Helsingborg?']},

{id:'h20',icon:'🧭',title:'Din hälsokompass',sub:'Sammanfattning & personlig hälsoplan',color:'#fb923c',bc:'rgba(251,146,60,.3)',bg:'rgba(251,146,60,.07)',
lessons:[
{t:'Hälsa är mer än att inte vara sjuk',s:'WHO:s definition:\n"Hälsa är ett tillstånd av fullständigt fysiskt, psykiskt och socialt välbefinnande."\n\nDina 4 pelare:\n🏃 Rörelse\n🧠 Mental hälsa\n🥗 Mat & sömn\n🤝 Socialt\n\nSvagaste pelaren påverkar alla andra.',
a:'Forskning visar att de fyra pelarna (rörelse, kost, sömn, socialt) är mer prediktiva för hälsa och livslängd än genetik. Beteendeförändringar tar i snitt 66 dagar att bli vanor.'},
{t:'Hälsa under ekonomisk stress',s:'Jobbsök, ekonomisk stress och ohälsa hänger ihop.\n\n💡 Prioritera:\n✅ Sömn — kostar inget\n✅ Promenader — kostar inget\n✅ Socialt stöd — kostar inget\n✅ Röka/dricka MINDRE — sparar pengar\n✅ Natur — kostar inget\n\nMindre pengarna du spenderar — desto mer du vilar.',
a:'Ekonomisk stress aktiverar samma stressrespons som fysisk fara. Kronisk ekonomisk stress ökar risken för hjärt-kärlsjukdom, depression och sömnstörningar. Gratis hälsoinsatser har starkt evidensbaserat stöd.'},
{t:'Nästa steg — dina prioriteringar',s:'Välj en sak från varje pelare:\n\n🏃 Rörelse: 20 min promenad/dag\n🧠 Mental: Ring en vän i veckan\n🥗 Mat: Laga mat hemma 5 dagar/vecka\n💤 Sömn: Sova & vakna samma tid\n🤝 Socialt: Ett socialt event/vecka\n\nSmå steg konsekvent > stora steg sporadiskt.',
a:'Beteendevetenskap: Att välja ett konkret beteende (tid, plats, vad) ökar genomförandet med 300%. "Jag ska röra mer" = svagt. "Jag promenerar 20 min kl 9 varje vardag i Stadsparken" = starkt.'}
],
ex:{type:'ai-chat',title:'Din personliga hälsoplan'},
quiz:[
{q:'Hur många dagar tar det att bygga en ny vana?',o:['7 dagar','21 dagar','66 dagar i snitt','365 dagar'],c:2},
{q:'Vad är WHO:s hälsodefinition?',o:['Att inte ha sjukdom','Fysiskt, psykiskt och socialt välbefinnande','Att träna regelbundet','Att äta hälsosamt'],c:1},
{q:'Vilken hälsopelare kostar absolut inget?',o:['Gym','Privatvård','Promenader och sömn','Kosttillskott'],c:2},
{q:'Vad ökar genomförandet av ett hälsobeteende mest?',o:['Stark motivation','Konkret plan med tid och plats','Dyrt gym-medlemskap','Att berätta för alla'],c:1}
],
pr:['Bygg en personlig hälsoplan för min situation.','Hur förbättrar jag sömnen med enkla medel?','Gratis hälsoaktiviteter i Helsingborg?']}
];

var EKONOMI=[
{id:'e1',icon:'💳',title:'Budget & vardagsekonomi',sub:'Koll på pengarna — varje månad',color:'#a78bfa',bc:'rgba(167,139,250,.3)',bg:'rgba(167,139,250,.07)',video:'/videos/e1-budget.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🎯',h:'Vad är syftet?',t:'Få kontroll över pengarna — så att du bestämmer vart de går, varje månad.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Varför en budget behövs, 50/30/20-metoden, fasta jämfört med rörliga kostnader, och hur du kommer igång.'},
{icon:'✅',h:'När du är klar ska du...',t:'kunna göra en enkel budget, veta vilka kostnader du kan påverka, och ha en plan för att följa upp.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 4 minuter för film och lektionerna, plus en övning där du gör din egen månadsbudget.'}
],
a:'En budget behöver inte vara komplicerad. Den här modulen ger dig grunderna och en metod att börja med.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom varför du behöver en budget, 50/30/20-metoden, och hur du kommer igång på tio minuter. Se den först, så blir lektionerna lättare att följa.'},
{t:'Varför budget?',
cards:[
{icon:'🧭',h:'Du bestämmer',t:'Med en budget styr du vart pengarna går. Utan budget bestämmer pengarna själva.'},
{icon:'5️⃣',h:'50 % — Behov',t:'Hyra, mat, räkningar.'},
{icon:'3️⃣',h:'30 % — Vill ha',t:'Nöje, kläder, kaffe.'},
{icon:'2️⃣',h:'20 % — Spara & skulder',t:'Anpassa siffrorna efter din situation.'}
],a:'En budget behöver inte vara komplicerad. Grundprincipen: vet vad som kommer in, vet vad som går ut, ta beslut om resten. Digitala verktyg: Saldokollen (gratis app), bankens budget-funktion, enkelt Excel-ark.'},
{t:'Fasta vs rörliga kostnader',
cards:[
{icon:'🏠',h:'Fasta kostnader',t:'Samma varje månad — hyra, telefon, el och försäkringar.'},
{icon:'🛒',h:'Rörliga kostnader',t:'Varierar — mat, transport och nöje.'},
{icon:'🔒',h:'Fasta — svåra att påverka',t:'De ligger ofta bundna i avtal.'},
{icon:'🎚️',h:'Rörliga — du styr direkt',t:'Här ger en förändring effekt redan denna månad.'}
],a:'Genomsnittlig hushållsekonomi i Sverige: hyra ca 30-40% av inkomst, mat 15-20%, transport 10-15%. Rörliga kostnader är där beteendeförändringar ger direkt effekt. En kaffemaskin hemma = 1 500-3 000 kr/år sparat vs köpkaffe.'},
{t:'Kom igång på 10 minuter',
cards:[
{icon:'1',h:'Räkna inkomsten',t:'Vad kommer in varje månad?'},
{icon:'2',h:'Lista fasta kostnader',t:'Allt som dras automatiskt.'},
{icon:'3',h:'Kolla kontoutdraget',t:'Vart gick pengarna egentligen?'},
{icon:'4',h:'Sätt gränser & följ upp',t:'En gräns per kategori, och 5 minuters koll i veckan.'}
],a:'Saldoappen hämtar transaktioner automatiskt och kategoriserar dem. De flesta banker har inbyggd budgetfunktion. En pappersbudget med penna fungerar lika bra — det viktiga är att göra det, inte vilken teknik du använder.'}
],
ex:{type:'build',title:'Din månadsbudget',desc:'Räkna ut vad du har kvar när räkningarna är betalda.',
fields:[
{l:'Total inkomst per månad (efter skatt)',ph:'T.ex. Försörjningsstöd 8 000 kr, A-kassa 12 000 kr...'},
{l:'Fasta kostnader (hyra, el, telefon, försäkring...)',ph:'T.ex. Hyra 5 500 + El 600 + Telefon 350 = 6 450 kr'},
{l:'Rörliga kostnader (mat, transport, nöje...)',ph:'T.ex. Mat 2 500 + SL 650 + Övrigt 800 = 3 950 kr'},
{l:'Vad har du kvar? Vad vill du göra med det?',ph:'T.ex. 600 kr kvar — sparar 300 till buffert, 300 till nöje',hint:'Även liten buffert är guld!'}
]},
quiz:[
{q:'Vad betyder 50/30/20-regeln?',o:['50% spara, 30% nöje, 20% mat','50% behov, 30% vill ha, 20% spara','50% mat, 30% hyra, 20% nöje','50% nöje, 30% spara, 20% behov'],c:1},
{q:'Vilka kostnader är lättast att påverka direkt?',o:['Hyra och el','Rörliga — mat, nöje, transport','Försäkringar','Telefon-abonnemang'],c:1},
{q:'Hur ofta bör du följa upp din budget?',o:['En gång per år','En gång per vecka (5 min)','Aldrig — sätts en gång','Varje dag'],c:1},
{q:'Vad sparar du ungefär per år om du tar kaffemaskin hemma?',o:['100 kr','1 500-3 000 kr','10 000 kr','500 kr'],c:1}
],
pr:['Bygg en månadsbudget för mig med: inkomst X, hyra Y.','Vad kan jag skära ner på med 500 kr/mån?','Hur bygger jag en nödfond på låg inkomst?']},

{id:'e2',icon:'🏠',title:'Hyra & bostad',sub:'Dina rättigheter som hyresgäst',color:'#a78bfa',bc:'rgba(167,139,250,.3)',bg:'rgba(167,139,250,.07)',video:'/videos/e2-bostad.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🏠',h:'Vad är syftet?',t:'Lära dig dina rättigheter som hyresgäst — och hur du söker bostadsbidrag.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Vad ett kontrakt ska innehålla, deposition, bostadsbidrag, och vad du gör om värden krånglar.'},
{icon:'✅',h:'När du är klar ska du...',t:'veta vad du har rätt till — och var du får hjälp.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 4 minuter för film och lektioner, plus en checklista för din egen situation.'}
],
a:'Hyreslagen skyddar hyresgäster i Sverige. Du har lagen på din sida — använd den.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom kontraktet, deposition, bostadsbidrag, och hur du hanterar problem med hyresvärden. Se den först, så blir lektionerna lättare att följa.'},
{t:'Hyreskontrakt — vad gäller?',
cards:[
{icon:'💰',h:'Hyresbeloppet',t:'Står rätt summa? Vad ingår — el, vatten, internet?'},
{icon:'📅',h:'Uppsägningstid',t:'Vanligt: 3 månader. Står det i kontraktet?'},
{icon:'🛡️',h:'Deposition',t:'Max 3 månadshyror. Spara kvitto på inbetalningen.'},
{icon:'📝',h:'Ditt ansvar',t:'Vad ska du underhålla själv?'}
],
a:'Deposition ska återbetalas inom 1–2 månader med specificerade avdrag. Spara alltid kvitto.'},
{t:'Bostadsbidrag',
cards:[
{icon:'👪',h:'Barnfamiljer',t:'Vanligaste mottagarna — söks av hushållet.'},
{icon:'🧑',h:'Ungdomar 18–29',t:'Egen kategori — sök även med låg inkomst.'},
{icon:'👤',h:'Ensamstående med barn',t:'Söks separat.'},
{icon:'🏛️',h:'Försäkringskassan',t:'fk.se → Bostadsbidrag. Retroaktivt 2 månader.'}
],
a:'Bostadsbidrag är ett av de mest underutnyttjade bidragen — många som har rätt söker inte.'},
{t:'Problem med hyresvärden',
cards:[
{icon:'🔧',h:'Underhåll',t:'Anmäl skriftligt → vänta 14 dagar → Hyresnämnden.'},
{icon:'💰',h:'Omotiverat hög hyra',t:'Prövning via Hyresnämnden — gratis.'},
{icon:'🚪',h:'Olaglig vräkning',t:'Ring polis + Hyresgästföreningen direkt.'},
{icon:'📞',h:'Hyresgästföreningen',t:'Helsingborg: 042-13 17 00 — hjälper alla.'}
],
a:'Vräkning kräver alltid domstolsbeslut. Hyresvärden kan ALDRIG själv vräka.'}
],
ex:{type:'build',title:'Din bostadssituation',desc:'Koll på din bostad och rättigheter.',
fields:[
{l:'Hur bor du idag?',ph:'T.ex. Hyresrätt förstahand, andrahand, hos familj, kompisar...'},
{l:'Vad betalar du i hyra? Vad ingår?',ph:'T.ex. 5 500 kr/mån, el separat, internet ingår'},
{l:'Har du koll på din uppsägningstid?',ph:'T.ex. Ja — 3 månader / Nej — behöver kolla kontraktet'},
{l:'Kan du ha rätt till bostadsbidrag? (kolla fk.se)',ph:'T.ex. Ska kolla — är 23 år och har låg inkomst',hint:'FK.se → Bostadsbidrag → Beräkna'}
]},
quiz:[
{q:'Hur stor deposition får hyresvärden maximalt ta?',o:['1 månads hyra','3 månaders hyra','6 månaders hyra','Inga regler'],c:1},
{q:'Var söker du bostadsbidrag?',o:['Kommunen','Försäkringskassan (fk.se)','AF','Hyresnämnden'],c:1},
{q:'Vad gör du om hyresvärden inte fixar fel i lägenheten?',o:['Acceptera det','Anmäl skriftligt → vänta 14 dagar → kontakta Hyresnämnden','Sluta betala hyra','Ring polisen direkt'],c:1},
{q:'Hur lång uppsägningstid är vanligast för hyresrätt?',o:['1 månad','3 månader','6 månader','12 månader'],c:1}
],
pr:['Har jag rätt till bostadsbidrag med inkomst X och hyra Y?','Vad gör jag om hyresvärden vill höja hyran?','Hur hittar jag lägenhet i Helsingborg utan kö?']},

{id:'e3',icon:'🆘',title:'Ekonomiskt bistånd & bidrag',sub:'Hjälp finns — ta reda på vad du har rätt till',color:'#a78bfa',bc:'rgba(167,139,250,.3)',bg:'rgba(167,139,250,.07)',video:'/videos/e3-bistand.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🎯',h:'Vad är syftet?',t:'Veta vilket ekonomiskt stöd som finns — och våga ta reda på vad just du har rätt till.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Vad ekonomiskt bistånd är, bidrag många missar, och hur du tar dig ur en skuldsituation.'},
{icon:'✅',h:'När du är klar ska du...',t:'veta var du ansöker om bistånd, känna till flera bidrag du kan ha rätt till, och veta att det finns gratis skuldrådgivning.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 4 minuter för film och de tre lektionerna, plus en övning där du kartlägger din egen bidragssituation.'}
],
a:'Ekonomiskt bistånd och bidrag är till för att hjälpa dig — men du måste ofta själv ta reda på vad du har rätt till. Den här modulen ger dig överblicken.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen ger dig hela bilden — vad ekonomiskt bistånd är, vilka bidrag som finns, och hur du hanterar skulder. Se den först, så blir lektionerna lättare att följa.'},
{t:'Ekonomiskt bistånd (försörjningsstöd)',
cards:[
{icon:'🆘',h:'Stöd när du inte klarar dig',t:'Kan du inte försörja dig själv har du rätt till ekonomiskt bistånd från kommunen.'},
{icon:'🧺',h:'Vad täcks?',t:'Det mest grundläggande — mat, hyra, el, kläder och hemförsäkring.'},
{icon:'🏛️',h:'Var ansöker du?',t:'Hos kommunens socialkontor. Stödet är behovsprövat och individuellt.'},
{icon:'📞',h:'Ett krav',t:'Du ska stå till arbetsmarknadens förfogande och söka jobb aktivt.'}
],
a:'Ekonomiskt bistånd är behovsprövat och individbaserat. Du måste söka alla andra bidrag du har rätt till. Krav: aktivt jobbsök, delta i insatser, inga omotiverade tillgångar.'},
{t:'Bidrag du kanske inte vet om',
cards:[
{icon:'👶',h:'Barnbidrag',t:'1 250 kr per barn och månad — betalas ut automatiskt.'},
{icon:'🏠',h:'Bostadsbidrag',t:'Inkomstbaserat — söks via Försäkringskassan.'},
{icon:'📚',h:'Studiestöd (CSN)',t:'Bidrag och lån om du studerar.'},
{icon:'📋',h:'Aktivitetsstöd',t:'Vid program hos Arbetsförmedlingen. Kolla även fk.se och kommunen.'}
],
a:'Sverige har ca 50 olika bidragsformer. Många undersöker inte vad de har rätt till. Kollas via: fk.se (Försäkringskassan), af.se, kommunens socialtjänst, och 1177.se. Ekonomirådgivning gratis via kommunen.'},
{t:'Skulder & skuldsanering',
cards:[
{icon:'📊',h:'1 — Gör en budget',t:'Vad har du råd att betala?'},
{icon:'🤝',h:'2 — Kontakta borgenären',t:'Ofta går det att komma överens om en avbetalningsplan.'},
{icon:'⚖️',h:'3 — Kronofogden',t:'Bestrid felaktiga krav.'},
{icon:'🆓',h:'4 — Skuldsanering',t:'Vid skulder du inte kan betala — skuldfri efter 5 år. Kommunens budgetrådgivning är gratis.'}
],
a:'Skuldsanering ger skuldfrihet efter 5 år (3 år vid allvarliga omständigheter). Ansökan via Kronofogdemyndigheten. Konsumentverkets Hallå Konsument: 0771-42 33 00.'}
],
ex:{type:'build',title:'Din bidragsöversikt',desc:'Koll på vilka bidrag du kan ha rätt till.',
fields:[
{l:'Vilka bidrag får du idag?',ph:'T.ex. A-kassa 12 000 kr/mån, barnbidrag 1 250 kr...'},
{l:'Vilka bidrag tror du att du KAN ha rätt till? (kolla fk.se)',ph:'T.ex. Kanske bostadsbidrag — ska kolla'},
{l:'Har du skulder som stressar dig?',ph:'T.ex. Ja — kreditkort 15 000 kr / Nej'},
{l:'Ditt nästa steg kring ekonomin',ph:'T.ex. Bokar möte med budget-rådgivaren på kommunen',hint:'Kommunal budget-rådgivning är gratis!'}
]},
quiz:[
{q:'Vem ansöker du ekonomiskt bistånd hos?',o:['AF','FK','Kommunens socialkontor','Skattemyndigheten'],c:2},
{q:'Hur mycket är barnbidrag per barn och månad?',o:['500 kr','1 250 kr','2 000 kr','750 kr'],c:1},
{q:'Vad kostar kommunal budget-rådgivning?',o:['500 kr/timme','Gratis','1 000 kr','Beror på kommunen'],c:1},
{q:'Hur länge tar skuldsanering?',o:['1 år','5 år (3 vid allvarliga omständigheter)','10 år','Livstid'],c:1}
],
pr:['Vilka bidrag har ensamstående med 1 barn i Helsingborg rätt till?','Hur ansöker jag om skuldsanering?','Vad är riksnormen för försörjningsstöd 2026?']},

{id:'e4',icon:'📱',title:'Smarta abonnemang & avtal',sub:'Sluta betala för mycket',color:'#a78bfa',bc:'rgba(167,139,250,.3)',bg:'rgba(167,139,250,.07)',video:'/videos/e4-abonnemang.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'📱',h:'Vad är syftet?',t:'Sluta överbetala — utan att försämra din vardag.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Mobilavtal, streaming, el, försäkringar och varför bindningstid är farligt.'},
{icon:'✅',h:'När du är klar ska du...',t:'veta exakt var du kan spara — och hur du byter.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 4 minuter för film och lektioner, plus en sorteringsövning.'}
],
a:'En till två timmars genomgång idag sparar tusenlappar varje år.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom mobilavtal, streaming, el, försäkringar och hur du undviker bindningstid. Se den först, så blir lektionerna lättare att följa.'},
{t:'Mobilavtal — sluta överbetala',
cards:[
{icon:'💸',h:'Snitt: 250–450 kr/mån',t:'Det är för mycket. Det går mycket billigare.'},
{icon:'📞',h:'Comviq, Vimla, Hallon',t:'Samma nät — från 49–99 kr/mån.'},
{icon:'👨‍👩‍👧',h:'Dela mobildata',t:'Familjeabonnemang kan halvera kostnaden.'},
{icon:'🔄',h:'Numret följer med',t:'Att byta operatör är gratis — och tar 1 dag.'}
],
a:'Mobilbranschen har mest prisvariation — samma 4G/5G-nät men 5x prisskillnad. Undvik bindningstid.'},
{t:'Streaming & prenumerationer',
cards:[
{icon:'📺',h:'Snitt 4–5 tjänster',t:'400–700 kr/mån — det adderar upp snabbt.'},
{icon:'🔄',h:'Rotera istället',t:'1 tjänst i taget — säg upp resten.'},
{icon:'📚',h:'Biblioteket är gratis',t:'Libby (e-böcker), PressReader (tidningar), Filmarkivet.'},
{icon:'🎓',h:'Studentrabatt',t:'Spotify halva priset. Familjepaket sparar mer.'}
],
a:'Räkna ihop alla abonnemang via kontoutdrag — många glömmer hälften.'},
{t:'El & försäkringar — jämför!',
cards:[
{icon:'⚡',h:'Rörligt elpris',t:'Oftast billigare i längden — jämför på elpriskollen.se.'},
{icon:'🛡️',h:'Hemförsäkring obligatorisk',t:'Om du hyr — täcker brand, inbrott, vatten och ansvar.'},
{icon:'📈',h:'Höj självrisken',t:'Lägre premie — om du sällan skadar saker.'},
{icon:'🚫',h:'Akta bindningstid',t:'24 mån = du kan inte byta. 1 mån uppsägning är standard.'}
],
a:'Lojalitet straffas — inte belönas. Jämför försäkringar vartannat år.'}
],
ex:{type:'sort',title:'Behov eller lyx?',desc:'Sortera dina kostnader — vad kan du minska?',
catA:'✅ Behov (svårt att ta bort)',catB:'✂️ Kan minska eller ta bort',
items:[{l:'Hyra',c:'A'},{l:'Netflix + HBO + Disney+',c:'B'},{l:'Mat och el',c:'A'},{l:'3 streaming-tjänster parallellt',c:'B'},{l:'Mobiltelefon (bas)',c:'A'},{l:'Köpkaffe varje dag',c:'B'},{l:'Hemförsäkring',c:'A'},{l:'Gym-kort du inte använder',c:'B'}]},
quiz:[
{q:'Vad kostar billigaste mobilabonnemang ungefär?',o:['200 kr/mån','49-99 kr/mån','150 kr/mån','Minst 300 kr/mån'],c:1},
{q:'Var jämför du el-priser?',o:['Hos elleverantören','elpriskollen.se (gratis & oberoende)','Prisjakt','Google'],c:1},
{q:'Vad erbjuder biblioteket gratis?',o:['Ingenting digitalt','E-böcker, tidningar och film via apper','Bara fysiska böcker','Spotify'],c:1},
{q:'Vad täcker hemförsäkringen?',o:['Bara brand','Brand, inbrott, vattenskada och ansvar','Bara stöld','Bara din bil'],c:1}
],
pr:['Hitta billigaste mobilabonnemang för mitt behov.','Vad kan jag skära i min budget med 500 kr/mån?','Jämför hemförsäkringar för hyresrätt.']},

{id:'e5',icon:'🐷',title:'Spara & buffert',sub:'Trygghet börjar med 1000 kr',color:'#a78bfa',bc:'rgba(167,139,250,.3)',bg:'rgba(167,139,250,.07)',video:'/videos/e5-buffert.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🐷',h:'Vad är syftet?',t:'Förstå varför en buffert ger trygghet — och få konkreta sätt att bygga den, även på låg inkomst.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Varför en buffert behövs, delmål att sikta på, sparande på låg inkomst, och ränta på ränta.'},
{icon:'✅',h:'När du är klar ska du...',t:'kunna sätta ett eget sparmål och veta hur du når det.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 4 minuter för film och lektioner, plus en övning där du gör din egen sparplan.'}
],
a:'Trygghet börjar med 1 000 kr. Den här modulen visar hur du tar dig dit — steg för steg.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom varför en buffert behövs, delmål att sikta på, sparande på låg inkomst, och kraften i ränta på ränta. Se den först, så blir lektionerna lättare att följa.'},
{t:'Varför buffert?',
cards:[
{icon:'🛡️',h:'Pengar för det oväntade',t:'En buffert räddar dig från bilreparationen, tandläkaren eller mobilen som går sönder.'},
{icon:'🎯',h:'Sätt delmål',t:'Mål 1: 1 000 kr. Mål 2: 10 000 kr. Mål 3: tre månaders levnadskostnader.'},
{icon:'😌',h:'Kris blir problem',t:'Med en buffert blir det oväntade ett problem du löser — inte en kris.'}
],
a:'Ett hushåll med 10 000 kr i buffert har dramatiskt lägre risk att hamna i skuldfällan vid oförutsedda händelser.'},
{t:'Spara på låg inkomst',
cards:[
{icon:'🔁',h:'Automatisk överföring',t:'Lägg en överföring på lönedagen — då händer sparandet av sig självt.'},
{icon:'🪙',h:'Spara småpengarna',t:'Avrunda och spara småmynten — litet och regelbundet ger resultat.'},
{icon:'📦',h:'Sälj det du inte behöver',t:'Sälj saker via Blocket och lägg pengarna i bufferten.'}
],
a:'Automatiska sparöverföringar — "pay yourself first" — är den mest effektiva sparmetoden. Spara innan du konsumerar.'},
{t:'Ränta på ränta',
cards:[
{icon:'⏳',h:'Tidens kraft',t:'500 kr/mån i 30 år blir ungefär 416 000 kr — det mesta är ränta.'},
{icon:'🏦',h:'Sparkonto',t:'Låg ränta, men pengarna är alltid tillgängliga — perfekt för bufferten.'},
{icon:'📈',h:'ISK',t:'Investeringssparkonto — för fonder och aktier på lång sikt.'}
],
a:'Ränta på ränta gör att tiden blir din viktigaste faktor. ISK är skattemässigt fördelaktigt för långsiktigt fondsparande.'}
],
ex:{type:'build',title:'Din sparplan',desc:'Starta din buffert — oavsett hur liten.',
fields:[
{l:'Har du en buffert idag? Hur stor?',ph:'T.ex. Nej, 0 kr / Ja, ca 2 000 kr'},
{l:'Hur mycket kan du spara per månad? (var ärlig)',ph:'T.ex. 200 kr — det är vad jag kan just nu',hint:'100 kr är bättre än 0!'},
{l:'Var ska du sätta buffert-pengarna?',ph:'T.ex. Separat sparkonto på Klarna eller Avanza',hint:'Avanza och Klarna har höga räntor på sparkonton'},
{l:'Ditt sparande-startdatum',ph:'T.ex. Sätter upp automatisk överföring på måndag',hint:'Gör det nu — framtida du tackar dig!'}
]},
quiz:[
{q:'Vad är syftet med en buffert?',o:['Investera och tjäna pengar','Ha pengar för oförutsedda utgifter','Unna sig något','Låna ut till andra'],c:1},
{q:'Vilket är det effektivaste sättet att spara?',o:['Spara det som blir över','Automatisk överföring på lönedagen','Spara kontanter hemma','Investera i aktier direkt'],c:1},
{q:'Vad händer med 500 kr/mån i 30 år med 5% avkastning?',o:['Ca 180 000 kr (inbetalat)','Ca 416 000 kr (ränta på ränta!)','Ca 250 000 kr','Ca 600 000 kr'],c:1},
{q:'Vad är en ISK (investeringssparkonto)?',o:['Ett vanligt sparkonto','Konto med schablonbeskattning — bra för fonder','Ett låneprodukt','Ett konto utan ränta'],c:1}
],
pr:['Hur startar jag ett ISK-konto?','Beräkna ränta-på-ränta för mig: X kr/mån, Y år, Z%.','Bästa sparkonton med hög ränta 2026?']},

{id:'e6',icon:'📊',title:'Skatt & deklaration',sub:'Förstå vad du betalar och vad du kan få tillbaka',color:'#a78bfa',bc:'rgba(167,139,250,.3)',bg:'rgba(167,139,250,.07)',video:'/videos/e6-skatt.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'📊',h:'Vad är syftet?',t:'Förstå hur skatten fungerar — och få ut det mesta av deklarationen.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Hur skatten beräknas, deklarationen steg-för-steg, vanliga avdrag, och vad du gör med återbäringen.'},
{icon:'✅',h:'När du är klar ska du...',t:'kunna deklarera själv på 5 minuter — och inte missa avdrag.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 4 minuter för film och lektioner, plus en deklarationsplan.'}
],
a:'7 av 10 hushåll får tillbaka 6 000–8 000 kr — varje år. Missa inte avdragen.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom skatten i Helsingborg, PAYE-systemet, deklarationen och de viktigaste avdragen. Se den först, så blir lektionerna lättare att följa.'},
{t:'Hur skatten fungerar',
cards:[
{icon:'🏛️',h:'Kommunalskatt',t:'30,84 % i Helsingborg.'},
{icon:'📈',h:'Statlig skatt',t:'+20 % över 598 500 kr/år.'},
{icon:'💼',h:'PAYE-systemet',t:'Arbetsgivaren drar skatten direkt från lönen.'},
{icon:'📅',h:'Deklarationen',t:'En gång om året — april/maj. Mycket är förifyllt.'}
],
a:'Skatteverket fyller i deklarationen åt dig. De flesta godkänner bara via BankID på 5 minuter.'},
{t:'Deklarationen — steg för steg',
cards:[
{icon:'1️⃣',h:'Logga in',t:'skatteverket.se med BankID.'},
{icon:'2️⃣',h:'Kontrollera',t:'Förifyllda uppgifter från arbetsgivare och bank.'},
{icon:'3️⃣',h:'Lägg till avdrag',t:'ROT, RUT, resor, dubbelt boende.'},
{icon:'4️⃣',h:'Godkänn',t:'Klart!'},
{icon:'5️⃣',h:'Skatteåterbäring',t:'Juni–augusti om du betalat för mycket.'}
],
a:'Skatteverket har gratis skatteupplysning: 0771-567 567. Ring vid minsta osäkerhet.'},
{t:'Skatteåterbäring — vad gör du med den?',
cards:[
{icon:'🛡️',h:'Bygg buffert',t:'Om du inte har en — börja här.'},
{icon:'💳',h:'Amortera dyr skuld',t:'SMS-lån och kreditkort först.'},
{icon:'🐷',h:'Spara till nödfond',t:'Ger trygghet vid oväntade utgifter.'},
{icon:'⚠️',h:'Undvik',t:'Att spendera allt på en gång — det är dina egna pengar.'}
],
a:'Att sätta återbäringen till buffert eller skuld är ett av de bästa finansiella besluten ett hushåll kan ta.'}
],
ex:{type:'build',title:'Din deklarationsplan',desc:'Förbered dig inför nästa deklaration.',
fields:[
{l:'Har du deklarerat i Sverige? Hur gick det?',ph:'T.ex. Nej — ny i Sverige / Ja, enkelt med BankID'},
{l:'Fick du skatteåterbäring eller restskatt förra året?',ph:'T.ex. Fick 3 200 kr tillbaka / Fick restskatt på 800 kr'},
{l:'Har du avdrag du kanske missar?',ph:'T.ex. Pendlar långt, fackmedlem, hemresor...',hint:'Skatteverket.se → Avdrag och förmåner'},
{l:'Vad gör du med eventuell skatteåterbäring?',ph:'T.ex. Direkt till buffert-kontot',hint:'Bestäm nu — annars spenderas det!'}
]},
quiz:[
{q:'Hur hög är kommunalskatten i Helsingborg ungefär?',o:['20%','30,84%','40%','25%'],c:1},
{q:'När ska du deklarera?',o:['Januari','April-maj','Oktober','Varje månad'],c:1},
{q:'Vad är ett bra sätt att använda skatteåterbäringen?',o:['Unna sig direkt','Buffert eller amortera skuld','Investera i aktier','Spendera på semester'],c:1},
{q:'Vad är ROT-avdrag?',o:['Rabatt på mat','30% avdrag på hushållsnära tjänster (bygg & renovering)','Avdrag för cykel','Gratis sjukvård'],c:1}
],
pr:['Förklara den svenska skattedeklarationen för mig.','Vilka avdrag kan jag göra som jobbsökare?','Hur ändrar jag min skattejämkning?']},

{id:'e7',icon:'🚌',title:'Transport & kollektivtrafik',sub:'Ta dig dit du behöver — billigt',color:'#a78bfa',bc:'rgba(167,139,250,.3)',bg:'rgba(167,139,250,.07)',video:'/videos/e7-transport.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🚌',h:'Vad är syftet?',t:'Ta dig dit du behöver — billigt. Och förstå vad transport faktiskt kostar.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Skånetrafikens biljetter, alternativ till bil, och kostnaden för en egen bil.'},
{icon:'✅',h:'När du är klar ska du...',t:'kunna jämföra dina transportkostnader och välja smart.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 3 minuter för film och lektioner.'}
],
a:'Bil är ofta den dyraste löpande kostnaden efter hyra.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom Skånetrafikens biljetter, cykel, samåkning och vad en egen bil egentligen kostar. Se den först.'},
{t:'Skånetrafiken — kort och rabatter',
cards:[
{icon:'🎫',h:'Periodbiljett',t:'Billigast om du reser dagligen.'},
{icon:'📱',h:'Digital biljett i app',t:'10 % billigare än papper.'},
{icon:'👶',h:'Barn under 7',t:'Gratis.'},
{icon:'🎓',h:'Ungdomsrabatt',t:'Upp till 20 år.'},
{icon:'🧓',h:'65+',t:'Rabatterat.'}
],
a:'Skånetrafikens månadskort: 940–1 100 kr beroende på zon. Jämfört med bil (4 000–6 000 kr/mån) — dramatiskt billigare.'},
{t:'Gratis och billiga alternativ',
cards:[
{icon:'🚲',h:'Cykel',t:'Begagnad: 500 kr. Hälsobonus.'},
{icon:'🚶',h:'Promenera om möjligt',t:'Gratis och stärkande.'},
{icon:'🤝',h:'Samåkning',t:'Skjuts.se, BlaBlaCar.'},
{icon:'🚗',h:'Hyrbil enstaka behov',t:'Sunfleet och liknande.'},
{icon:'🛴',h:'Elsparkcyklar',t:'Tier, Voi — per resa.'}
],
a:'Pendelbåten Helsingborg–Helsingör kostar ca 60 kr tur/retur och tar 20 min.'},
{t:'Bil — äga, leasa eller avstå?',
cards:[
{icon:'💸',h:'Lån/leasing',t:'Månadskostnad — låst i lång tid.'},
{icon:'🛡️',h:'Försäkring',t:'1 500–3 000 kr/mån.'},
{icon:'⛽',h:'Drivmedel',t:'Bensin eller el.'},
{icon:'🔧',h:'Service & reparationer',t:'Räknas in i totalen.'},
{icon:'🅿️',h:'Parkering',t:'Ofta glömd — men dyr.'}
],
a:'Är bilen NÖDVÄNDIG eller bara bekväm? Prova en månad utan — och räkna vad du sparar.'}
],
ex:{type:'build',title:'Din resplan',desc:'Optimera din transport och spara pengar.',
fields:[
{l:'Hur tar du dig runt idag?',ph:'T.ex. Buss + cykel, bil, promenad...'},
{l:'Vad betalar du för transport per månad?',ph:'T.ex. Månadskort Skånetrafiken 940 kr + cykelreparation 50 kr'},
{l:'Kan du minska transportkostnaden? Hur?',ph:'T.ex. Cykla till stationen istället för ta taxi',hint:'Varje 100 kr sparad är 1200 kr/år'},
{l:'Behöver du bil? Varför / varför inte?',ph:'T.ex. Nej — bussen räcker / Ja — jobbet är inte kollektivt'}
]},
quiz:[
{q:'Hur mycket billigare är digital biljett i Skånetrafikens app?',o:['5%','10%','20%','Ingen rabatt'],c:1},
{q:'Vad kostar Helsingborg–Helsingör med pendelbåten ungefär?',o:['20 kr','60 kr tur/retur','200 kr','100 kr'],c:1},
{q:'Vad kostar en genomsnittlig bil per månad totalt?',o:['1 000-2 000 kr','4 000-8 000 kr','500-1 000 kr','10 000+ kr'],c:1},
{q:'Var hittar du samåknings-möjligheter?',o:['Platsbanken','Skjuts.se och BlaBlaCar','LinkedIn','AF'],c:1}
],
pr:['Billigaste sättet att pendla Helsingborg-Malmö?','Kan jag ta bil till Danmark med färjan?','Hur ansöker jag om färdtjänst i Helsingborg?']},

{id:'e8',icon:'🔐',title:'Digital ekonomi & säkerhet',sub:'Skydda dina pengar online',color:'#a78bfa',bc:'rgba(167,139,250,.3)',bg:'rgba(167,139,250,.07)',video:'/videos/e8-sakerhet.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🔐',h:'Vad är syftet?',t:'Skydda dina pengar online — och känna igen bluffarna innan de når dig.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Vanliga bedrägerier, Postnord- och BankID-bluff, och fem snabba åtgärder för skydd.'},
{icon:'✅',h:'När du är klar ska du...',t:'känna igen mönstren — och veta vad du gör om något händer.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 3 minuter för film och lektioner, plus en säkerhetsövning.'}
],
a:'Bedrägerier kostar svenska hushåll 1 miljard kr/år. Lär dig mönstren — du minskar risken kraftigt.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom de vanligaste bedrägerierna mot privatpersoner, hur Postnord- och BankID-bluffarna fungerar, och fem konkreta skyddsåtgärder. Se den först, så blir lektionerna lättare att följa.'},
{t:'Vanligaste bedrägerierna',
cards:[
{icon:'📱',h:'SMS-bluffar',t:'"Paket väntar — betala tull"'},
{icon:'📧',h:'Phishing-mejl',t:'Falsk bank eller myndighet.'},
{icon:'📞',h:'Vishing — telefonbluff',t:'"Banken ringer" — ber dig signera.'},
{icon:'💼',h:'Falska jobbannonser',t:'Betala för utbildning eller utrustning.'},
{icon:'❤️',h:'Romansbedrägeri',t:'Datingsajt → behov av pengar.'}
],
a:'Grundregel: ingen myndighet ber dig betala via presentkort. Aldrig.'},
{t:'BankID-bluff & Klarna',
cards:[
{icon:'🚫',h:'Banker ringer ALDRIG',t:'Och ber dig signera med BankID — aldrig.'},
{icon:'📞',h:'Lägg på direkt',t:'Ring banken på det officiella numret.'},
{icon:'💳',h:'Köp nu betala sen',t:'Är ett lån — inte gratis. Glömmer du → skuld.'},
{icon:'💰',h:'Klarna-fakturor',t:'40 % högre köpbelopp i snitt — håll koll.'}
],
a:'BankID-kapning är vanligaste attackvektorn. Avvisar du spontant kontakt är det alltid rätt.'},
{t:'Fem snabba skyddsåtgärder',
cards:[
{icon:'🔐',h:'Aktivera 2FA',t:'På bank, mejl och LinkedIn — gratis.'},
{icon:'👀',h:'Kolla kontoutdrag',t:'Varje vecka — fånga okända transaktioner direkt.'},
{icon:'🚫',h:'Inga länkar i SMS',t:'Från okänd avsändare — klicka aldrig.'},
{icon:'📞',h:'Vid tvekan — pausa',t:'Lägg på, ring själv på officiellt nummer.'},
{icon:'🚨',h:'Anmäl till polisen.se',t:'Vid bedrägeri — gör det direkt.'}
],
a:'Brådska är bluffmakarens viktigaste vapen. Tveka — och pausa. Det kostar inget att ringa banken själv.'}
],
ex:{type:'sort',title:'Säkert eller osäkert?',desc:'Sortera beteendena — vad är okej och vad är farligt?',
catA:'✅ Säkert',catB:'🚨 Osäkert — undvik!',
items:[{l:'Godkänna BankID du inte initierat',c:'B'},{l:'Betala räkning via bankens egna app',c:'A'},{l:'Klicka på SMS-länk om paket',c:'B'},{l:'Swisha bara till folk du känner',c:'A'},{l:'Ge bort BankID-koden per telefon',c:'B'},{l:'Kontrollera avsändarens e-postadress',c:'A'},{l:'"Köp nu betala sen" utan koll på fakturor',c:'B'},{l:'Tvåfaktorautentisering på alla konton',c:'A'}]},
quiz:[
{q:'Vad skickar ALDRIG en myndighet via SMS?',o:['Information','Betalningslänkar (det är alltid bedrägeri)','Kallelser','Bekräftelser'],c:1},
{q:'Vad gör du om BankID-appen poppar upp utan att du initierat?',o:['Godkänn — säkert','Avvisa alltid — ring din bank','Vänta och se','Godkänn om det ser officiellt ut'],c:1},
{q:'Varför är "köp nu betala sen" riskabelt?',o:['Det är det inte — helt säkert','Det är ett lån som kan leda till skuld om du glömmer','Bara för under 18','Tekniska problem'],c:1},
{q:'Om du misstänker bedrägeri — vad gör du?',o:['Vänta och se','Ring din bank OMEDELBART','Anmäl till polisen nästa vecka','Ignorera det'],c:1}
],
pr:['Hur skyddar jag mig mot bedrägerier?','Vad gör jag om jag blivit av med pengar via bedrägeri?','Är detta SMS på riktigt eller bluff?']},

{id:'e9',icon:'🎓',title:'Ekonomi för unga vuxna',sub:'Det de inte lärde dig i skolan',color:'#a78bfa',bc:'rgba(167,139,250,.3)',bg:'rgba(167,139,250,.07)',video:'/videos/e9-unga.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🎓',h:'Vad är syftet?',t:'Lära dig ekonomi-grunderna som faktiskt spelar roll — det de inte lärde dig i skolan.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Betalningsanmärkningar, räntor och lån, samt hur du börjar tänka pension redan idag.'},
{icon:'✅',h:'När du är klar ska du...',t:'veta hur du undviker fällorna — och vad du gör om du redan står i dem.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 4 minuter för film och lektioner, plus en grund-checklista.'}
],
a:'400 000 svenskar har betalningsanmärkning — och 80 % kunde ha undvikits med kontakt innan förfallodatum.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom betalningsanmärkningar, räntor och pension för unga vuxna. Se den först, så blir lektionerna lättare att följa.'},
{t:'Betalningsanmärkningar — undvik!',
cards:[
{icon:'🏠',h:'Svårt att hyra',t:'Värdar gör kreditkoll — anmärkning stänger dörrar.'},
{icon:'📱',h:'Svårt med abonnemang',t:'Mobil, el, streaming — alla kollar UC.'},
{icon:'📈',h:'Sämre räntor',t:'Du betalar mer för alla lån.'},
{icon:'📅',h:'Stannar i 3 år',t:'Privatperson — efter senaste skulden är betald.'}
],
a:'Kronofogden registrerar anmärkningar. De syns i UC och Bisnode — men 80 % förhindras med kontakt innan KFM.'},
{t:'Räntor & lån — förstå avtalet',
cards:[
{icon:'📊',h:'Nominell ränta',t:'Procentpåslag per år.'},
{icon:'📈',h:'Effektiv ränta',t:'Inkl. alla avgifter — det är DEN du jämför.'},
{icon:'💰',h:'Amortering',t:'Du betalar ner skulden — inte bara räntan.'},
{icon:'⚠️',h:'SMS-lån = 30–600 % ränta',t:'Absolut sista utväg. Sök hjälp först.'}
],
a:'Konsumentkreditlagen kräver att effektiv ränta anges. Vid behov: budget- och skuldrådgivning hos kommunen — gratis.'},
{t:'Pension — börjar nu',
cards:[
{icon:'🔵',h:'Allmän pension',t:'Automatiskt via skatten — alla får.'},
{icon:'🟢',h:'Tjänstepension',t:'Via arbetsgivare — ofta 4–5 % extra. Kolla att du har den.'},
{icon:'🟡',h:'Privat pension',t:'Frivillig — PPM. Välj fonder aktivt på minpension.se.'},
{icon:'⏳',h:'Tidigt = enormt',t:'Ränta-på-ränta är obarmhärtig — på rätt sätt.'}
],
a:'Jobbsökperioder påverkar pensionen — fyll på om möjligt. Kolla pensionsmyndigheten.se → Mina sidor.'}
],
ex:{type:'build',title:'Din ekonomiska grund',desc:'Säkra att du har koll på grunderna.',
fields:[
{l:'Har du några obetalda räkningar just nu?',ph:'T.ex. Nej / Ja — el-räkning från oktober...',hint:'Om ja — kontakta borgenären IDAG!'},
{l:'Vet du din kreditstatus? (kolla creditsafe.se gratis)',ph:'T.ex. Nej — ska kolla / Ja, inga anmärkningar'},
{l:'Har du koll på din tjänstepension?',ph:'T.ex. Nej — ska kolla pensionsmyndigheten.se',hint:'pensionsmyndigheten.se → Mina Sidor'},
{l:'En ekonomisk sak du ska fixa denna vecka',ph:'T.ex. Betalar den försenade räkningen idag',hint:'Gör det nu — det kostar att vänta!'}
]},
quiz:[
{q:'Hur länge sitter en betalningsanmärkning kvar?',o:['1 år','3 år','5 år','Alltid'],c:1},
{q:'Vilken ränta ska du ALLTID jämföra vid lån?',o:['Nominell ränta','Effektiv ränta (inkl. avgifter)','Månadsränta','Räntefri period'],c:1},
{q:'Vad är tjänstepension?',o:['Statlig pension','Extra pension via arbetsgivaren','Privat sparande','FK-ersättning'],c:1},
{q:'Hur hög kan effektiv ränta på SMS-lån vara?',o:['10%','30-600%','5%','20%'],c:1}
],
pr:['Förklara hur den svenska pensionen fungerar.','Hur kontrollerar jag om jag har betalningsanmärkningar?','Vad händer om jag inte kan betala mina räkningar?']},

{id:'e10',icon:'🌟',title:'Din ekonomiska framtidsplan',sub:'Från idag till ekonomisk stabilitet',color:'#a78bfa',bc:'rgba(167,139,250,.3)',bg:'rgba(167,139,250,.07)',
lessons:[
{t:'Ekonomisk återhämtning — det tar tid',s:'Ekonomisk stabilitet byggs steg för steg:\n\nFas 1: Täck grundbehov\n→ Mat, hyra, el, telefon\n\nFas 2: Stoppa blödningen\n→ Inga nya skulder, betala i tid\n\nFas 3: Buffert\n→ 1 000 kr → 10 000 kr\n\nFas 4: Frihet\n→ Spara, investera, välja',a:'Finansiell psykologi: pengar ger oss säkerhet, frihet och val — inte lycka i sig. Ekonomisk stress är en av de starkaste stressfaktorerna och påverkar hälsa och relationer. Att ha en plan — oavsett hur liten — sänker stressnivåerna mätbart.'},
{t:'Gratis ekonomistöd i Helsingborg',s:'Du behöver inte klara det själv!\n\n🏛️ Kommunal budget-rådgivare: gratis\n📞 Kronofogdens budget-rådgivning: gratis\n💻 Konsumentverket Hallå Konsument: 0771-42 33 00\n🏦 FK:s ekonomirådgivning\n📱 Zmarta, Compricer — jämförelsesajter\n\nAll rådgivning är konfidentiell.',a:'Budget- och skuldrådgivning är lagreglerat i Sverige — alla kommuner måste erbjuda det gratis. Helsingborgs stad: ring kommunens kontaktcenter 042-10 50 00. Kronofogdens budgetrådgivning är gratis och utan krav på att du ska göra skuldsanering.'},
{t:'Från bistånd till självförsörjning',s:'Vägen till ekonomisk självständighet:\n\n1. Stabil inkomst (jobb, studier, A-kassa)\n2. Budget som går ihop\n3. Skulder under kontroll\n4. Buffert 10 000 kr\n5. Spara regelbundet\n6. Förstå din pension\n\nVarje steg räknas.\nDu är redan på väg — du lär dig!',a:'Rörlighet på arbetsmarknaden och i ekonomin hänger ihop. Utbildning ökar inkomst med i snitt 15-20% per utbildningsnivå. Att ta sig från försörjningsstöd till arbete är en av de viktigaste livsförändringarna — och möjliggör allt annat.'}
],
ex:{type:'build',title:'Din ekonomiska 90-dagarsplan',desc:'Konkret plan för ekonomisk stabilitet — steg för steg.',
fields:[
{l:'Var är du nu? (ärlig nulägesbedömning)',ph:'T.ex. A-kassa 11 000 kr/mån, skulder 8 000 kr, ingen buffert...',ta:true},
{l:'Fas 1 — Vad måste du fixa DENNA MÅNAD?',ph:'T.ex. Betala hyra, el, ringa om skulden...',ta:true},
{l:'Fas 2 — Ditt 90-dagarsmål',ph:'T.ex. Budget i balans, buffert 2 000 kr, inga nya skulder',hint:'Realistiskt men ambitiöst.'},
{l:'Vem kan hjälpa dig? (rådgivare, nätverk, myndighet)',ph:'T.ex. Bokar möte med budget-rådgivaren + ringer FK',hint:'Gratis hjälp finns — ta den!'}
]},
quiz:[
{q:'Vad är Fas 1 i ekonomisk återhämtning?',o:['Investera i aktier','Täcka grundbehov — mat, hyra, el','Spara 10 000 kr','Amortera lån'],c:1},
{q:'Hur mycket kostar kommunal budget-rådgivning?',o:['500 kr/timme','Gratis','1 000 kr','Beror på inkomst'],c:1},
{q:'Vilket av dessa ökar snittinkomsten mest?',o:['Byta stad','Utbildning (ca +15-20% per nivå)','Byta bank','Förhandla lönen en gång'],c:1},
{q:'Vad är det viktigaste att göra om du har skulder?',o:['Ignorera dem','Kontakta borgenären aktivt — hellre tidigt','Vänta på kronofogden','Ta nytt lån'],c:1}
],
pr:['Gör en 90-dagars ekonomiplan för mig med: inkomst X, skulder Y.','Hur ansöker jag om kommunal budget-rådgivning i Helsingborg?','Vägen från försörjningsstöd till ekonomisk stabilitet?']},

{id:'e11',icon:'🏦',title:'Lån & krediter',sub:'Förstå kostnaden innan du skriver på',color:'#a78bfa',bc:'rgba(167,139,250,.3)',bg:'rgba(167,139,250,.07)',
lessons:[
{t:'Ränta — vad kostar ett lån egentligen?',s:'Ränta = priset för att låna pengar.\n\nEffektiv ränta = den verkliga kostnaden.\n\nExempel — 10 000 kr snabblån:\n📅 12 månader\n💰 24% effektiv ränta = betalar tillbaka 12 400 kr\n\nKreditkort 20% ränta på 5 000 kr i 6 mån = ca 500 kr extra.',
a:'Effektiv ränta inkluderar avgifter och är det enda jämförbara måttet. Snabblån har ofta 200-500% effektiv ränta. Konsumentverket kräver att effektiv ränta redovisas tydligt. Jämför alltid effektiv ränta — inte nominell.'},
{t:'Typer av lån',s:'Bolån: låg ränta (2-4%) — kräver kontantinsats 15%\nBlancolån: 5-15% — utan säkerhet\nKreditkort: 15-25% — rörlig skuld\nSnabblån: 100-500%+ — undvik!\nCSN: ca 1% — förmånligast\n\n🔑 Regel: Lån med lägst ränta ALLTID BÄST.',
a:'Blancolån kräver kreditprövning. Utan fast inkomst är det svårt att beviljas. Skuldsaldo på kreditkort är en av de dyraste skuldformerna. Bolån kräver 15% kontantinsats samt en buffert för driftskostnader.'},
{t:'Undvik skuldfällan',s:'Skuldfällan:\n1. Tar snabblån för att klara månaden\n2. Betalar ej i tid → inkasso\n3. Betalningsanmärkning → svårt låna\n4. Tar nytt lån för att betala gamla\n\nBryt mönstret:\n✅ Ring din bank om du inte kan betala\n✅ Skuldrådgivning via kommunen (gratis)\n✅ Kronofogden har en budget-tjänst',
a:'Kommunerna erbjuder gratis budget- och skuldrådgivning. Konsumentkredit­ombudsmannen (KKO) hanterar klagomål. Kronofogden erbjuder Skuldsanering för den som är skuldsatt bortom förmåga att betala.'}
],
ex:{type:'build',title:'Din lånsituation',desc:'Koll på dina lån och vad de kostar.',
fields:[
{l:'Vilka lån eller krediter har du?',ph:'T.ex. Studielån CSN, kreditkort 15 000 kr, blancolån...',ta:true},
{l:'Vad betalar du i månadsränta totalt (ungefär)?',ph:'T.ex. CSN 300 kr/mån, kreditkort 150 kr/mån...'},
{l:'Finns det ett lån du vill lösa eller refinansiera?',ph:'T.ex. Vill betala av kreditkortskulden först'},
{l:'Nästa steg',ph:'T.ex. Ring min bank om refinansiering, boka skuldrådgivning',hint:'Kommunal skuldrådgivning är gratis'}
]},
quiz:[
{q:'Vad är effektiv ränta?',o:['Räntan på lönedagen','Den verkliga totalkostnaden inklusive avgifter','Bankens interna ränta','Månatlig ränta'],c:1},
{q:'Vilken låneform är DYRAST?',o:['CSN-lån','Bolån','Snabblån 100-500%+','Blancolån'],c:2},
{q:'Vad gör du om du inte kan betala en skuld?',o:['Ignorera den','Ringa banken och kommunens skuldrådgivning','Ta ett nytt lån','Vänta och hoppas'],c:1},
{q:'Vad är kommunal skuldrådgivning?',o:['Betaltjänst 500 kr/tim','Gratis hjälp med skulder och budget','Kronofogdens tjänst','Bankens service'],c:1}
],
pr:['Hur räknar jag ut vad mitt lån kostar totalt?','Vilka lån bör jag betala av först?','Hur bokar jag skuldrådgivning i Helsingborg?']},

{id:'e12',icon:'⚖️',title:'Skulder & Kronofogden',sub:'Om du hamnar i skuldfällan',color:'#a78bfa',bc:'rgba(167,139,250,.3)',bg:'rgba(167,139,250,.07)',
lessons:[
{t:'Vad händer om du inte betalar?',s:'Processen:\n1. Påminnelse (15-60 kr avgift)\n2. Inkasso (250-750 kr avgift)\n3. Kronofogden ansöker om betalningsföreläggande\n4. Utmätning — lön, tillgångar\n5. Betalningsanmärkning 3 år\n\nVarje steg kostar mer och skadar mer.',
a:'Kronofogdemyndighetens databas är offentlig. Betalningsanmärkning gör det svårt att hyra bostad, teckna abonnemang och ibland få anställning. Det kan ta 3 år att bli skuldfri efter sanering.'},
{t:'Skuldsanering — sista utvägen',s:'Skuldsanering = juridisk process för att få skulder borttagna.\n\nKriterier:\n• Skuldsatt bortom alla möjligheter\n• Prövas av Kronofogden\n• Tar 3-5 år\n• Sparar bara ett existensminimum\n\nAnsöks via kronofogden.se — kostnadsfritt.',
a:'Skuldsanering beviljas inte alla — det kräver att du är skuldsatt utan realistisk möjlighet att betala. Under sanerings­perioden lever du på existensminimum (ca 5 500-6 500 kr/mån). Efter avslutad sanering är du skuldfri.'},
{t:'Förebygg — budget och dialog',s:'De flesta skuldsituationer kan förebyggas:\n\n✅ Budget som håller koll\n✅ Ring fordringsägaren TIDIGT\n✅ Kommunal skuldrådgivning\n✅ Dela upp skuld i avbetalningsplan\n\nDe flesta fordringsägare föredrar avbetalning över inkasso.',
a:'Tidigt kontakt med fordringsägare kan stoppa inkassoprocessen. Kommunens budget- och skuldrådgivare kan förhandla med fordringsägare på dina vägnar. Det är gratis och konfidentiellt.'}
],
ex:{type:'build',title:'Hantera skuldsituationen',desc:'Konkret plan om du har skulder.',
fields:[
{l:'Har du obetalda räkningar eller inkassokrav?',ph:'Ja/Nej — Beskriv kortfattat'},
{l:'Har du kontaktat fordringsägaren?',ph:'T.ex. Nej — ska ringa Telia imorgon och be om avbetalning'},
{l:'Vill du ha hjälp av kommunens skuldrådgivare?',ph:'T.ex. Ja — ska ringa kommunen för att boka tid',hint:'Helsingborg: ring kommunen och fråga efter budget- och skuldrådgivning'},
{l:'Ditt nästa steg idag',ph:'T.ex. Ringa Kronofogden för info, eller kommunens skuldrådgivning',ta:true}
]},
quiz:[
{q:'Hur länge sitter en betalningsanmärkning kvar?',o:['1 år','3 år','5 år','10 år'],c:1},
{q:'Vad är skuldsanering?',o:['En betalningsplan','Juridisk process för att ta bort skulder man inte kan betala','En inkassobyrå','Kronofogdens avgift'],c:1},
{q:'Vad bör du göra TIDIGT om du inte kan betala?',o:['Ignorera det','Kontakta fordringsägaren direkt och föreslå avbetalning','Ansök om skuldsanering direkt','Flytta'],c:1},
{q:'Vad kostar kommunal skuldrådgivning?',o:['500 kr','1 000 kr','Gratis','Beror på skuldens storlek'],c:2}
],
pr:['Hur ansöker jag om skuldsanering?','Hur pratar jag med en inkassobyrå?','Vad är existensminimum vid skuldsanering?']},

{id:'e13',icon:'🏠',title:'Försäkringar',sub:'Rätt skydd — inte för mycket, inte för lite',color:'#a78bfa',bc:'rgba(167,139,250,.3)',bg:'rgba(167,139,250,.07)',
lessons:[
{t:'Hemförsäkring — ett måste',s:'Hemförsäkring skyddar:\n\n🏠 Ditt hem vid brand, inbrott, vattenläcka\n💼 Dina saker (stöld, skada)\n🦺 Ansvarsskydd (om du råkar skada någon)\n⚖️ Rättsskydd (juridisk hjälp)\n\nKostnad: ca 100-250 kr/mån\nBOR DU UTAN = stor ekonomisk risk!',
a:'Hemförsäkringen är den viktigaste privatförsäkringen. Vid brand kan en enda incident kosta hundratusentals kronor. Rättsskyddet täcker vanligtvis 80% av advokatkostnader upp till ca 150 000 kr.'},
{t:'Olycksfalls & livförsäkring',s:'Olycksfallsförsäkring:\n• Skyddar vid olyckor utanför jobbet\n• Ca 50-150 kr/mån\n\nLivförsäkring:\n• Engångssumma till familjen om du dör\n• Viktigt med barn/skulder\n• Ca 100-300 kr/mån\n\nVia facket — ofta billigare!',
a:'Kollektivavtalet ger ofta Tjänstegrupplivförsäkring (TGL) automatiskt som anställd. Kolla med facket om du omfattas. Olycksfallsförsäkring via arbetsgivaren gäller bara arbetstid.'},
{t:'Jämför & spara',s:'Tjäna pengar på försäkringar:\n\n✅ Samla hos ett bolag — rabatt\n✅ Jämför på insplanet.com eller compricer.se\n✅ Ring och begär lojalitetsrabatt\n✅ Höj självrisken → lägre premie\n✅ Betala årsvis → billigare\n\nGenomsnittlig besparing vid jämförelse: 500-2 000 kr/år',
a:'Insplanet och Compricer jämför priser från många bolag. Lojalitetsrabatter ges sällan automatiskt — du måste begära dem. En hög självrisken (ex 5 000 kr istället för 1 500 kr) kan sänka premien 15-25%.'}
],
ex:{type:'build',title:'Din försäkringsöversikt',desc:'Koll på vad du har och vad du behöver.',
fields:[
{l:'Har du hemförsäkring? Vilket bolag och kostnad?',ph:'T.ex. Ja — Folksam, 150 kr/mån. Nej — ska kolla compricer.se'},
{l:'Har du olycksfalls- eller livförsäkring?',ph:'T.ex. Ja via facket. Nej — har inga anhöriga just nu...'},
{l:'Vad betalar du totalt för försäkringar/mån?',ph:'T.ex. 350 kr/mån — hemförsäkring + bil'},
{l:'Vad ska du kolla eller ändra?',ph:'T.ex. Jämföra hemförsäkring på compricer.se, fråga facket om TGL',hint:'compricer.se — enkelt att jämföra'}
]},
quiz:[
{q:'Vad täcker hemförsäkringen?',o:['Bara brand','Brand, stöld, ansvar och rättsskydd','Bara dina saker','Bara om du äger bostaden'],c:1},
{q:'Vad är TGL?',o:['En typ av bolån','Tjänstegrupplivförsäkring via kollektivavtal','En bankprodukt','En skatteförmån'],c:1},
{q:'Var jämför du försäkringspriser?',o:['Ringer runt manuellt','compricer.se eller insplanet.com','Bara via banken','Skatteverket'],c:1},
{q:'Hur sänker du försäkringspremien?',o:['Minska skyddet','Höj självrisken och betala årsvis','Byt bolag varje år','Ingenting hjälper'],c:1}
],
pr:['Vilka försäkringar behöver en ensamstående person?','Hur jämför jag hemförsäkringar?','Vad täcker rättsskyddet i hemförsäkringen?']},

{id:'e14',icon:'👴',title:'Pension & tjänstepension',sub:'Framtiden börjar nu',color:'#a78bfa',bc:'rgba(167,139,250,.3)',bg:'rgba(167,139,250,.07)',
lessons:[
{t:'Hur fungerar pension i Sverige?',s:'Svensk pension = tre delar:\n\n1. Allmän pension (staten) — 18,5% av lönen avsätts\n2. Tjänstepension (arbetsgivaren) — 4,5% extra\n3. Privat sparande (frivilligt)\n\nKolla din pension på minpension.se — gratis!',
a:'Allmän pension beräknas på livsinkomst — varje år och krona räknas. Utan inkomst (t.ex. vid långtidsarbetslöshet) minskar den framtida pensionen. SGI (sjukpenninggrundande inkomst) påverkas av inkomst.'},
{t:'Tjänstepension — arbetsgivarens del',s:'Om du har kollektivavtal:\n\n✅ Arbetsgivaren betalar 4,5-30% av lönen\n✅ Placeras i fonder\n✅ Du väljer fonder via valcentral\n\nUtan kollektivavtal:\n❌ Ingen garanti på tjänstepension\n\nKolla på minpension.se vad du har!',
a:'Tjänstepension är värdefull — för en normallöntagare kan den utgöra 25-35% av totalpensioen. Fondval spelar roll: historiskt ger aktietunga fonder bäst avkastning på lång sikt. Glöm inte att logga in och välja fonder!'},
{t:'Pension och jobbsök — vad händer?',s:'Under perioder utan arbete:\n\n⚠️ Allmän pension tjänas inte in (ingen lön)\n⚠️ Tjänstepension pausas\n✅ A-kassa ger viss pensionsgrundande inkomst\n✅ Föräldrapenning ger pensionsrätt\n✅ Studiemedel ger viss pensionsrätt\n\nDärför är snabbt tillbaka i arbete viktigt!',
a:'Varje år utan inkomst kostar ca 1 500-2 500 kr/mån i framtida pension beroende på din ålder och lönenivå. Premiepension (PPM) fortsätter växa med fondavkastning även utan inbetalning. Logga in på minpension.se för fullständig bild.'}
],
ex:{type:'build',title:'Din pensionsöversikt',desc:'Koll på din framtida ekonomi.',
fields:[
{l:'Har du loggat in på minpension.se?',ph:'Ja/Nej — logga in nu med BankID för full översikt',hint:'minpension.se — gratis och tar 5 min'},
{l:'Har du tjänstepension via din arbetsgivare?',ph:'T.ex. Ja — ITP via Collectum. Nej — saknar kollektivavtal.'},
{l:'Har du valt fonder för din tjänstepension?',ph:'T.ex. Nej — ska logga in på valcentralen och välja globala aktier'},
{l:'Vad gör du för att stärka din pension?',ph:'T.ex. Hitta jobb snabbare, spara 500 kr/mån extra',ta:true}
]},
quiz:[
{q:'Hur stor andel av lönen avsätts till allmän pension?',o:['10%','18,5%','25%','30%'],c:1},
{q:'Var kollar du din pension?',o:['Skatteverket','minpension.se med BankID','Din bank','FK'],c:1},
{q:'Vad händer med tjänstepensionen om du är arbetslös?',o:['Den fortsätter växa','Den pausas — ingen inbetalning','Den försvinner','FK betalar in istället'],c:1},
{q:'Varför är fondval viktigt för tjänstepension?',o:['Det är det inte','Aktietunga fonder ger historiskt bättre avkastning långsiktigt','Du måste välja statsobligationer','Fonderna är alltid samma'],c:1}
],
pr:['Hur ökar jag min pension?','Vad innebär det att jag saknar tjänstepension?','Förklara PPM och premiepension enkelt.']},

{id:'e15',icon:'🏧',title:'Bankkonto & BankID',sub:'Det digitala basverktyget i Sverige',color:'#a78bfa',bc:'rgba(167,139,250,.3)',bg:'rgba(167,139,250,.07)',
lessons:[
{t:'Bankkonto i Sverige — hur öppnar du?',s:'Du behöver ett bankkonto för att:\n• Få lön utbetald\n• Betala hyra\n• Söka bidrag\n• Ha BankID\n\nVad krävs:\n✅ ID-handling (pass, SIS-kort)\n✅ Personnummer\n✅ Personligen eller digitalt\n\nSverige har en s.k. kontorätt — alla har rätt till konto!',
a:'Kontorätten är inskriven i lag. Om en bank nekar konto kan du klaga till Finansinspektionen. Digitalbanker (Revolut, Wise) fungerar för internationella transfers men erkänns inte alltid av myndigheter.'},
{t:'BankID — Sveriges digitala legitimation',s:'BankID används för att:\n✅ Logga in på myndigheter (FK, AF, Skatteverket)\n✅ Signera avtal digitalt\n✅ Identifiera dig på 1177, bankerna\n✅ Deklarera\n✅ Söka bidrag\n\nFår du inte BankID = svårt att delta digitalt i Sverige.',
a:'BankID finns i mobil- och kortläsarversion. Mobilt BankID kräver ett aktivt bankförhållande. Utan personnummer är det svårare men inte omöjligt — kontakta din bank. BankID är gratis att använda.'},
{t:'Swish, Autogiro & betalningar',s:'Swish:\n📱 Snabba betalningar → kräver BankID + mobilnummer\n✅ Gratis att ta emot, ibland kostnad att skicka\n\nAutogiro:\n🔄 Automatisk månadsbetalning\n✅ Inga sena avgifter\n✅ Bra för hyra, abonnemang\n\nFaktura:\n📄 30 dagars betaltid standard',
a:'Sverige är ett av världens mest kontantfria samhällen — ca 90% av transaktioner är digitala. Utan Swish och BankID är vardagen svårare. Butiker har rätt att neka kontanter men det är ovanligt.'}
],
ex:{type:'build',title:'Din digitala bankplan',desc:'Se till att ha alla digitala verktyg på plats.',
fields:[
{l:'Har du ett svenskt bankkonto?',ph:'Ja — Handelsbanken. Nej — ska gå till banken med mitt pass.',hint:'Ta med pass + personnummer'},
{l:'Har du BankID installerat?',ph:'Ja. Nej — kontaktar min bank om BankID-aktivering.'},
{l:'Har du Swish installerat?',ph:'Ja. Nej — installerar via min bank efter BankID.',hint:'Swish kräver BankID och mobilnummer'},
{l:'Vilken bank har du och är du nöjd?',ph:'T.ex. Swedbank, ska jämföra med Nordea och Handelsbanken...'}
]},
quiz:[
{q:'Vad är kontorätten?',o:['Rätt att handla på kredit','Rätt att öppna bankkonto — alla har den','Rätt att låna pengar','Rätt till räntefritt konto'],c:1},
{q:'Vad används BankID till?',o:['Bara bankärenden','Digital legitimation för myndigheter, avtal och bank','Bara betala räkningar','Skattedeklaration'],c:1},
{q:'Vad krävs för att öppna bankkonto?',o:['Inkomst','ID-handling och personnummer','Fast adress','Körkort'],c:1},
{q:'Vad är autogiro?',o:['En typ av kredit','Automatisk månadsbetalning från kontot','En sparform','Swish för företag'],c:1}
],
pr:['Hur öppnar jag bankkonto utan personnummer?','Vilken bank är bäst för nyanlända i Sverige?','Hur aktiverar jag BankID?']},

{id:'e16',icon:'🛍️',title:'Konsumenträtt & reklamation',sub:'Dina rättigheter som köpare',color:'#a78bfa',bc:'rgba(167,139,250,.3)',bg:'rgba(167,139,250,.07)',
lessons:[
{t:'Konsumentköplagen — dina rättigheter',s:'När du köper en vara har du rätt till:\n\n✅ 3 års reklamationsrätt på fel\n✅ Reparation, omsyte eller prisavdrag\n✅ Pengarna tillbaka om felet inte åtgärdas\n\n⚠️ Garanti = säljarens eget löfte (kan vara kortare)\n✅ Reklamationsrätt > garanti alltid',
a:'Konsumentköplagen gäller köp från en näringsidkare (butik, nätbutik). Privatköp (Blocket etc) har svagare skydd. Felet måste finnas vid köptillfället. Bevisbördan är köparens efter 6 månader.'},
{t:'Ångerrätt & öppet köp',s:'Ångerrätt (14 dagar) gäller:\n✅ Köp på nätet\n✅ Telefonköp\n✅ Hemförsäljning\n\n❌ Gäller EJ i butik (bara om butiken erbjuder)\n❌ Personliga varor (underkläder, hygien)\n\nÖppet köp = butikens eget erbjudande.',
a:'Ångerrätten är EU-lagstiftning (14 dagar utan att ange skäl). Du betalar returfrakten om inte annat avtalats. Kontakta säljaren skriftligt inom 14 dagar — spara all kommunikation.'},
{t:'Om du inte är nöjd — steg för steg',s:'1. Kontakta säljaren — begär reklamation\n2. Spara kvitto/orderbekräftelse\n3. Dokumentera felet med foto\n4. Eskalera till Allmänna reklamationsnämnden (ARN)\n5. Konsumentverket — ytterligare stöd\n\nARN är gratis och tar 3-6 månader.',
a:'ARN (Allmänna reklamationsnämnden) löser tvister kostnadsfritt. De flesta företag följer ARN:s beslut. Konsumentguiden på konsumentverket.se ger gratis rådgivning via chatt och telefon.'}
],
ex:{type:'build',title:'Din konsumenträtt i praktiken',desc:'Vet hur du reklamerar och tar tillvara dina rättigheter.',
fields:[
{l:'Har du köpt något nyligen som inte fungerar?',ph:'T.ex. Telefon som krånglar efter 18 mån, jacka med trasig dragkedja...'},
{l:'Hur länge sedan köpte du det?',ph:'T.ex. 14 månader sedan — inom 3 år = reklamationsrätt'},
{l:'Vad vill du ha ut av reklamationen?',ph:'T.ex. Reparation, pengarna tillbaka, omsyte'},
{l:'Ditt nästa steg',ph:'T.ex. Ring butiken, skicka mejl med foto av felet',hint:'Spara alltid kvitto och kommunikation!'}
]},
quiz:[
{q:'Hur lång är reklamationsrätten i Sverige?',o:['1 år','2 år','3 år','6 månader'],c:2},
{q:'Vad gäller ångerrätten?',o:['Alla köp i butik','Köp på nätet och via telefon','Bara dyra varor','Bara elektronik'],c:1},
{q:'Vad är ARN?',o:['En konsumentbutik','Allmänna reklamationsnämnden — gratis tvistelösning','En myndighet som säljer varor','En inkassobyrå'],c:1},
{q:'Vad gäller om du köper av en privatperson på Blocket?',o:['Samma som butik','Svagare skydd — konsumentköplagen gäller ej','Bättre skydd','Inga regler alls'],c:1}
],
pr:['Hur skriver jag ett reklamationsbrev?','Vad gör jag om butiken nekar reklamation?','Hur anmäler jag ett företag till ARN?']},

{id:'e17',icon:'⚡',title:'El, energi & hushållskostnader',sub:'Sänk räkningarna med enkla åtgärder',color:'#a78bfa',bc:'rgba(167,139,250,.3)',bg:'rgba(167,139,250,.07)',
lessons:[
{t:'Förstå din elräkning',s:'Elräkning = tre delar:\n\n⚡ Elförbrukning (kWh) — ca 50-60% av kostnaden\n🔌 Nätavgift — fast avgift för kablar\n💰 Skatt — ca 30% av totalen\n\nGenomsnitt ensamhushåll: 2 000-4 500 kWh/år\nKostnad: ca 8 000-14 000 kr/år',
a:'Priset per kWh varierar kraftigt med elhandelsavtal. Timpris (spot) är billigast lågtrafik men dyrare högtrafik. Fast pris ger förutsägbarhet. Jämför på elpriskollen.se (Energimarknadsinspektionen).'},
{t:'Sänk din elanvändning',s:'Enkla åtgärder:\n🌡️ Sänk temperaturen 1 grad = 5% lägre elräkning\n💡 LED-lampor — 80% lägre än glödlampor\n🚿 Kortare duschar\n❄️ Full disk- och tvättmaskin\n🔌 Stäng av standby\n\nPotential: spara 1 000-3 000 kr/år',
a:'Uppvärmning är ofta 50-60% av hushållets energianvändning. Varje grad lägre inomhustemperatur minskar energianvändningen ca 5%. Standby-apparater kan kosta 500-1 000 kr/år om de aldrig stängs av.'},
{t:'Bostadsbidrag för energi & stöd',s:'Energistöd vid höga elkostnader:\n• Bostadsbidrag (FK) täcker del av hyran\n• Kommunen kan ge ekonomiskt bistånd för höga räkningar\n\nJämför elpriser:\n🌐 elpriskollen.se — gratis\n🌐 compricer.se\n\nByt elleverantör — spara 1 000-4 000 kr/år!',
a:'Elpriskollen.se drivs av Energimarknadsinspektionen och är den mest opartiska jämförelsetjänsten. Att byta elleverantör tar ca 15 min och kostar ingenting. Bindningstid varierar — kolla det noga.'}
],
ex:{type:'build',title:'Din energibesparing',desc:'Konkreta åtgärder för lägre räkningar.',
fields:[
{l:'Vad betalar du i el ungefär per månad?',ph:'T.ex. Ca 800 kr/mån (lägenhet), 1 500 kr/mån (villa)'},
{l:'Har du jämfört ditt elavtal?',ph:'T.ex. Nej — ska kolla elpriskollen.se idag',hint:'elpriskollen.se — tar 5 min'},
{l:'3 åtgärder du kan göra direkt',ph:'T.ex. Sänka temperaturen 1 grad, slå av standby-apparater, byta till LED',ta:true},
{l:'Potentiell besparing per år?',ph:'T.ex. ~1 500 kr om jag sänker tempen + byter elleverantör'}
]},
quiz:[
{q:'Vad innebär det att sänka inomhustemperaturen med 1 grad?',o:['Ingen märkbar skillnad','Ca 5% lägre energianvändning','Ca 20% lägre','Bara komfort'],c:1},
{q:'Var jämför du elpriser opartiskt?',o:['elhandelsbolagets hemsida','elpriskollen.se (Energimyndigheten)','compricer.se (bättre)','Din bank'],c:1},
{q:'Hur mycket kan standby-apparater kosta per år?',o:['Ingenting','Ca 50 kr','500-1 000 kr','10 000 kr'],c:2},
{q:'Vad är nätavgiften?',o:['Avgift för elen du förbrukar','Fast avgift för elnätet — kan ej byta','En skatt','Avgift för elmätaren'],c:1}
],
pr:['Hur sänker jag min elräkning i en hyresrätt?','Vilket elavtal är bäst just nu?','Hur söker jag bostadsbidrag för mina boendekostnader?']},

{id:'e18',icon:'📊',title:'Spara & investera smart',sub:'Från buffert till fonder',color:'#a78bfa',bc:'rgba(167,139,250,.3)',bg:'rgba(167,139,250,.07)',
lessons:[
{t:'ISK — Investeringssparkonto',s:'ISK är Sveriges smidigaste sparform:\n\n✅ Ingen skatt på vinst när du säljer\n✅ Låg schablonskatt (ca 0,88%/år)\n✅ Kan äga aktier, fonder, ETF:er\n✅ Öppnas kostnadsfritt hos Avanza/Nordnet/banken\n\nBäst för: långsiktigt sparande 3+ år',
a:'ISK beskkattas med schablonskatt baserat på kontovärdet, oavsett om du säljer eller inte. Vid positiv avkastning är ISK skattemässigt överlägset vanligt konto. Avanza Zero är en gratis indexfond utan avgift.'},
{t:'Fonder — för nybörjaren',s:'Typer av fonder:\n📈 Indexfond — följer börsen, låg avgift\n📊 Aktiefond — aktiv förvaltning, högre avgift\n🛡️ Räntefond — lägre risk, lägre avkastning\n🌍 Blandfond — mix\n\nRegel: Välj indexfond med lägst avgift (TER <0,5%).',
a:'Historisk avkastning: Globalindex ca 10%/år (nominellt) över 30 år. Aktiva fonder slår sällan index efter avgifter. Avanza Global och Länsförsäkringar Global Indexnära är populära zero-avgiftsfonder.'},
{t:'Spara trots liten plånbok',s:'Börja litet — det spelar roll!\n\n💰 100 kr/mån i 30 år @ 7% = ca 113 000 kr\n💰 500 kr/mån i 30 år @ 7% = ca 567 000 kr\n\nAutomatiskt sparande:\n✅ Autogiro direkt vid lönedagen\n✅ Runt-upp-sparande (Klarna, Doktor Savings)\n\nTid i marknaden > tajming av marknaden.',
a:'Ränta-på-ränta-effekten är kraftfull. Den som börjar spara 100 kr/mån vid 25 har mer vid 65 än den som börjar spara 500 kr/mån vid 45. Automatisering tar bort beslutsfattning och ökar följsamheten.'}
],
ex:{type:'build',title:'Din sparplan',desc:'Kom igång med smart sparande.',
fields:[
{l:'Har du en buffert (3 månaders kostnader)?',ph:'T.ex. Delvis — 10 000 kr, behöver 30 000 kr',hint:'Buffert är alltid prioritet 1'},
{l:'Har du ett ISK-konto?',ph:'Ja — Avanza. Nej — ska öppna ett när bufferten är klar.'},
{l:'Hur mycket kan du spara per månad?',ph:'T.ex. 200 kr/mån — börjar litet med automatiskt sparande'},
{l:'Din sparplan',ph:'T.ex. Autogiro 200 kr/mån till Avanza Global indexfond',ta:true}
]},
quiz:[
{q:'Vad är fördelen med ISK?',o:['Ingen skatt alls','Schablonskatt — ingen skatt på försäljningsvinst','Statlig garanti','Bättre ränta'],c:1},
{q:'Vilken fondtyp rekommenderas nybörjare?',o:['Aktiv aktiefond','Indexfond med låg avgift','Hedgefond','Räntefond'],c:1},
{q:'Hur mycket ger 100 kr/mån i 30 år med 7% ränta?',o:['Ca 36 000 kr','Ca 113 000 kr','Ca 500 000 kr','Ca 10 000 kr'],c:1},
{q:'Vad är bäst tidpunkt att börja spara?',o:['När du har råd','Så tidigt som möjligt — ränta på ränta','Vid 40 år','Vid löneförhöjning'],c:1}
],
pr:['Hur öppnar jag ett ISK-konto?','Vilken indexfond ska jag välja?','Hur sparar jag smart med 200 kr/mån?']},

{id:'e19',icon:'👨‍👩‍👧',title:'Ekonomi & familj',sub:'Separation, barn och gemensam ekonomi',color:'#a78bfa',bc:'rgba(167,139,250,.3)',bg:'rgba(167,139,250,.07)',
lessons:[
{t:'Gemensam ekonomi i par',s:'Tips vid gemensam ekonomi:\n\n✅ Gemensamt hushållskonto + egna konton\n✅ Öppen dialog om utgifter\n✅ Skriftliga avtal vid samboende\n\nSambolagen: Om ni separerar delar ni lägenheten och bohag 50/50 — men inte sparkonton!\n\n⚠️ Utan äktenskapsförord delar ni allt vid äktenskapsskillnad.',
a:'Sambolagen gäller automatiskt vid samboende — men skyddar inte separat sparande. Ett samboavtal kan undanta egendom. Äktenskapsförord skrivs hos notarius publicus. Ca 40-50% av svenska äktenskap slutar i skilsmässa.'},
{t:'Underhållsbidrag & barnbidrag',s:'Vid separation med barn:\n\n📋 Underhållsbidrag: den som inte bor med barnet betalar\n• Fastställs av FK\n• Ca 1 500-2 500 kr/mån/barn (schablonbelopp)\n\n👶 Barnbidrag: 1 250 kr/mån/barn\n• Delas lika vid växelvis boende\n• FK betalar ut automatiskt',
a:'Underhållsbidraget beräknas baserat på barnets behov och föräldrarnas ekonomi. Om den betalningsskyldige inte betalar kan FK betala ut underhållsstöd istället och kräva föräldern. FK hanterar alla ansökningar.'},
{t:'Ensamstående ekonomi',s:'Som ensamstående har du rätt till:\n\n✅ Bostadsbidrag (högre vid barn)\n✅ Barnbidrag 1 250 kr/mån\n✅ Underhållsstöd (om ex ej betalar)\n✅ Flerbarnstillägg (från barn nr 2)\n✅ Försörjningsstöd vid behov\n\nKolla alla rättigheter på FK:s räkneverktyg.',
a:'Ensamstående föräldrar har rätt till flerbarnstillägg (400-2 400 kr/mån) från barn nr 2. Bostadsbidragets takbelopp är högre vid barn. Försörjningsstöd är kommunens sista skyddsnät.'}
],
ex:{type:'build',title:'Familjens ekonomiska plan',desc:'Koll på rättigheter och avtal.',
fields:[
{l:'Familjesituation (sambo, gift, ensamstående, barn)?',ph:'T.ex. Sambo sedan 2 år, ett barn 3 år'},
{l:'Har ni ett samboavtal eller äktenskapsförord?',ph:'Ja/Nej — om nej: ska vi diskutera detta?',hint:'Viktigt vid separation!'},
{l:'Vilka familjeförmåner har du rätt till?',ph:'T.ex. Barnbidrag, underhållsstöd, bostadsbidrag...'},
{l:'Finns en ekonomisk fråga du behöver lösa?',ph:'T.ex. Underhållsbidrag ej betalt — ska kontakta FK',ta:true}
]},
quiz:[
{q:'Vad gäller sambolagen vid separation?',o:['Ni delar allt 50/50','Ni delar gemensam lägenhet och bohag 50/50 — inte sparkonton','Bara gifta omfattes','Den som tjänar mer får mer'],c:1},
{q:'Hur stort är barnbidraget per barn och månad?',o:['800 kr','1 000 kr','1 250 kr','2 000 kr'],c:2},
{q:'Vad är underhållsstöd?',o:['Bidrag till alla barn','FK betalar ut om en förälder inte betalar underhåll','Bostadsbidrag för barn','Extra barnbidrag'],c:1},
{q:'Var ansöker du om underhållsbidrag?',o:['Tingsrätten','FK — Försäkringskassan','Kommunen','Socialtjänsten'],c:1}
],
pr:['Hur beräknas underhållsbidraget?','Vilka bidrag har jag rätt till som ensamstående förälder?','Ska vi skriva ett samboavtal?']},

{id:'e20',icon:'🎯',title:'Din finansiella frihet',sub:'Sätt upp mål och bygg ekonomin steg för steg',color:'#a78bfa',bc:'rgba(167,139,250,.3)',bg:'rgba(167,139,250,.07)',
lessons:[
{t:'Ekonomisk stabilitet — en trappa',s:'Bygg ekonomin i rätt ordning:\n\n🔴 Steg 1: Täck grundbehov (hyra, mat, el)\n🟠 Steg 2: Betala skulder med hög ränta\n🟡 Steg 3: Buffert — 3 månaders kostnader\n🟢 Steg 4: Pensionssparande\n🔵 Steg 5: Frivilligt investeringssparande\n\nHoppa aldrig över ett steg!',
a:'Att börja investera innan skulder är betalda ger sällan positiv avkastning — skuldräntan är oftast högre. Bufferten är skyddet som hindrar dig från att ta lån vid oväntade händelser.'},
{t:'Ekonomiska mål — SMARTA',s:'❌ "Jag vill spara mer"\n✅ "Jag ska spara 500 kr/mån från 1 juni i ISK på Avanza, automatiskt"\n\nDina mål:\n🎯 Kortfristigt: 0-12 mån (buffert)\n🎯 Medelfristigt: 1-5 år (bil, bostad)\n🎯 Långfristigt: 5+ år (pension, frihet)\n\nEtt mål per kategori — fokus är allt.',
a:'SMARTA finansiella mål ökar uppnåandegraden med 40-50% jämfört med vaga mål. Automatisering är nyckeln — det som sker utan beslut sker alltid. Sätt autogiro direkt vid lönedagen.'},
{t:'Din ekonomiska resa framåt',s:'Grattis — du har gått igenom hela Ekonomin!\n\nDu vet nu:\n✅ Budgetera och spåra kostnader\n✅ Förstå skulder och räntor\n✅ Skydda dig med försäkringar\n✅ Pension och tjänstepension\n✅ Konsumenträtt och reklamation\n✅ Spara och investera smart\n\nNästa steg: Gör det på riktigt!',
a:'Ekonomisk kunskap är en av de viktigaste färdigheterna — men den hjälper bara om du agerar. Ta ett steg per dag, inte allt på en gång. Kommunens budget- och skuldrådgivare, FK och Konsumentverket är alltid tillgängliga och gratis.'}
],
ex:{type:'ai-chat',title:'Chatta om din ekonomi'},
quiz:[
{q:'Vilket steg kommer ALLTID före investeringssparande?',o:['Pensionstänk','Buffert på 3 månaders kostnader','Bolån','ISK-konto'],c:1},
{q:'Vad är ett SMARTA ekonomiskt mål?',o:['"Spara mer"','"500 kr/mån från 1 juni till ISK automatiskt"','"Bli rik"','Alla är lika bra'],c:1},
{q:'Vilken skuld betalar du av FÖRST?',o:['Den äldsta','Den med högst ränta','Den med lägst belopp','Spelar ingen roll'],c:1},
{q:'Var finns gratis ekonomirådgivning?',o:['Banken (ej gratis)','Kommunens budget- och skuldrådgivning och Konsumentverket','Privatekonomisk rådgivare','Ingen gratis finns'],c:1}
],
pr:['Bygg min ekonomiska trappa baserat på min situation.','Hur sätter jag upp ett SMART sparmål?','Vilket är mitt nästa ekonomiska steg?']}
];

var DIGITAL=[
{id:'d1',icon:'🌐',title:'Digital närvaro',sub:'Ditt Google-fotavtryck',color:'#34d399',bc:'rgba(52,211,153,.3)',bg:'rgba(52,211,153,.07)',video:'/videos/d1-narvaro.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🌐',h:'Vad är syftet?',t:'Förstå ditt Google-fotavtryck — och hur du formar det.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Vad digital närvaro är, vad arbetsgivare ser, och hur du städar.'},
{icon:'✅',h:'När du är klar ska du...',t:'ha gjort en analys av ditt fotavtryck och en plan för förbättring.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 3 minuter för film och lektioner, plus en analys.'}
],
a:'70 % av rekryterare i Sverige googlar kandidater. Ditt namn på Google ska leda till LinkedIn.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom vad digital närvaro är, vad arbetsgivare faktiskt ser, och hur du städar ditt fotavtryck. Se den först.'},
{t:'Vad är digital närvaro?',
cards:[
{icon:'🪞',h:'Allt om dig online',t:'Bilder, texter, profiler och kommentarer.'},
{icon:'🕰️',h:'Digitalt fotavtryck lever länge',t:'Det du gjorde för 10 år sedan kan fortfarande synas.'},
{icon:'🔎',h:'Testa själv',t:'Googla ditt namn — just nu.'}
],
a:'Du kan inte ta bort Google-träffar — men du kan kontrollera vad de hittar.'},
{t:'Vad ser arbetsgivare?',
cards:[
{icon:'❌',h:'Skadar dig',t:'Fest-bilder, stötande kommentarer, klagomål på ex-arbetsgivare.'},
{icon:'✅',h:'Hjälper dig',t:'Professionell LinkedIn, branschrelaterade inlägg, rekommendationer.'},
{icon:'📊',h:'57 % har påverkats',t:'Av innehåll de hittat — i negativ riktning.'}
],
a:'LinkedIn är det enda sociala mediet som alltid hjälper.'},
{t:'Städa ditt fotavtryck',
cards:[
{icon:'1️⃣',h:'Privatisera',t:'Instagram och Facebook — sätt till privat.'},
{icon:'2️⃣',h:'Ta bort',t:'Gamla stötande bilder och inlägg.'},
{icon:'3️⃣',h:'Uppdatera',t:'LinkedIn med professionellt foto och pitch.'},
{icon:'4️⃣',h:'Begär borttagning',t:'Via Googles formulär (GDPR) vid behov.'}
],
a:'Ditt mål: när någon googlar ditt namn ska LinkedIn vara första träffen.'}
],
ex:{type:'build',title:'Analysera ditt fotavtryck',desc:'Snabb analys + förbättringsplan.',fields:[{l:'Googla ditt namn — vad hittar du?',ph:'T.ex. Instagram, gammal blogg...',ta:true,hint:'Sök på ditt namn nu.'},{l:'Vad bör tas bort?',ph:'T.ex. Gamla partybilder...',ta:true},{l:'Vad bör läggas till?',ph:'T.ex. Uppdatera LinkedIn-bild...',ta:true},{l:'Ditt nästa steg',ph:'T.ex. Byt profilbild idag.',hint:'Gör det nu!'}]},
quiz:[{q:'Vad är digital närvaro?',o:['Att ha dator','Allt om dig på internet','En e-postadress'],c:1},{q:'Varför googlar arbetsgivare?',o:['Nyfikenhet','Professionell bakgrundskoll','Lag'],c:1},{q:'Vad ta bort?',o:['Yrkeshistorik','Stötande bilder och kommentarer','Profilbild'],c:1}],
pr:['Sammanfatta mitt fotavtryck: …','5 förbättringar för min närvaro.','Vad tittar arbetsgivare på?']},
{id:'d2',icon:'🔵',title:'LinkedIn-grunder',sub:'Din profil online',color:'#34d399',bc:'rgba(52,211,153,.3)',bg:'rgba(52,211,153,.07)',video:'/videos/d2-linkedin.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🎯',h:'Vad är syftet?',t:'Förstå varför LinkedIn är viktigt — och hur du bygger en profil som rekryterare hittar.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Varför LinkedIn, de fem delar som räknas, och hur du skriver din rubrik och din om mig-text.'},
{icon:'✅',h:'När du är klar ska du...',t:'kunna bygga en komplett LinkedIn-profil med rubrik, om mig-text och rätt nyckelord.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 3 minuter för film och lektionerna, plus en övning där du skriver din egen profiltext.'}
],
a:'LinkedIn är världens största professionella nätverk. Den här modulen ger dig grunden.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen visar varför LinkedIn är viktigt, vilka delar som räknas, och hur du bygger en profil som syns. Se den först, så blir lektionerna lättare att följa.'},
{t:'Varför LinkedIn?',
cards:[
{icon:'🔍',h:'Rekryterare söker där',t:'LinkedIn är en jobbsida där arbetsgivare aktivt hittar dig.'},
{icon:'🌐',h:'Världens största yrkesnätverk',t:'Det är också där rekryterare verifierar kandidater.'}
],
a:'Världens största professionella nätverk. Rekryterare söker och verifierar kandidater där.'},
{t:'5 viktigaste delar',
cards:[
{icon:'📷',h:'Profilbild',t:'Skapar förtroende.'},
{icon:'🏷️',h:'Rubrik',t:'Vad du gör — på en rad.'},
{icon:'📝',h:'Om mig',t:'Vem du är.'},
{icon:'💼',h:'Erfarenhet',t:'Dina tidigare roller.'},
{icon:'🛠️',h:'Kompetenser',t:'Det du kan.'}
],
a:'Dessa påverkar hur ofta du visas i sökningar.'},
{t:'Rubrik & Om mig',
cards:[
{icon:'🏷️',h:'Rubriken',t:'Vad du gör — yrkesroll, styrkor och bransch.'},
{icon:'📝',h:'Om mig',t:'Vem du är — 3–5 meningar med pitch, erfarenhet och mål.'}
],
a:'Rubrik: yrkesroll + styrkor + bransch. Om mig: 3-5 meningar med pitch, erfarenhet och mål.'}
],
ex:{type:'build',title:'Bygg din LinkedIn-profil',desc:'Skriv delarna — kopiera sedan direkt till LinkedIn.',fields:[{l:'Rubrik',ph:'T.ex. Lagerarbetare med truck-erfarenhet',hint:'Max 120 tecken.'},{l:'Om mig — pitch',ph:'T.ex. Engagerad med 4 år i logistik.',ta:true},{l:'Om mig — styrkor',ph:'T.ex. Struktur, effektivitet och teamarbete.',ta:true},{l:'Om mig — mål',ph:'T.ex. Söker utmaning i Helsingborg.',ta:true}]},
quiz:[{q:'Varför är LinkedIn viktigt?',o:['Nöjessida','Rekryterare söker där','Obligatoriskt'],c:1},{q:'Vad ska rubriken ha?',o:['Favoritfilm','Yrkesroll + styrkor + bransch','Alla utbildningar'],c:1},{q:'Vad ska Om mig ha?',o:['Familjebakgrund','Pitch, erfarenhet och mål','Lista med jobb'],c:1}],
pr:['LinkedIn-rubrik baserat på min erfarenhet.','Om mig i 3 meningar.','Förbättra min profil: …']},
{id:'d3',icon:'👤',title:'Bygg digital profil',sub:'Professionellt online',color:'#34d399',bc:'rgba(52,211,153,.3)',bg:'rgba(52,211,153,.07)',video:'/videos/d3-profil.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'👤',h:'Vad är syftet?',t:'Bygga en stark digital profil — professionellt och på 30 minuter.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'5-stegsmetoden, profilbild, presentation, kompetenser och pitchen.'},
{icon:'✅',h:'När du är klar ska du...',t:'ha en komplett profil med alla 5 delar ifyllda.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 3 minuter för film och lektioner, plus en bygg-övning.'}
],
a:'En komplett profil syns mer i sökresultaten.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom 5-stegsmetoden för en stark digital profil, från profilbild till pitch. Se den först.'},
{t:'Vad är en digital profil?',
cards:[
{icon:'🪪',h:'Din yrkesidentitet',t:'Samlad på ett ställe — vem du är, vad du kan, vad du söker.'},
{icon:'⚡',h:'Snabbt och professionellt',t:'Rekryteraren hittar dig direkt.'}
],
a:'Konsekvent pitch i CV, LinkedIn och profil skapar ett starkt varumärke.'},
{t:'5 steg till en stark profil',
cards:[
{icon:'📸',h:'1. Profilbild',t:'Skapar förtroende.'},
{icon:'✏️',h:'2. Kort presentation',t:'Vem du är på 3–5 meningar.'},
{icon:'💪',h:'3. Styrkor',t:'5 viktigaste — mixa hårda och mjuka.'},
{icon:'💼',h:'4. Erfarenhet',t:'Var du varit och vad du gjort.'},
{icon:'📞',h:'5. Kontakt',t:'Hur du nås — uppdaterat nummer och e-post.'}
],
a:'Varje del fyller en funktion. Bilden skapar förtroende, presentationen berättar vem du är.'},
{t:'Profilbild och pitch',
cards:[
{icon:'🪟',h:'Neutral bakgrund',t:'Vit vägg eller suddig miljö.'},
{icon:'😊',h:'Tydligt ansikte',t:'Vänlig min — du behöver inte le.'},
{icon:'💡',h:'Bra ljus',t:'Naturligt fönsterljus fungerar perfekt.'},
{icon:'🎤',h:'Använd din pitch',t:'Vem du är + vad du kan + vad du söker.'}
],
a:'Samma pitch i CV, LinkedIn och digital profil = ett starkt varumärke som rekryterare känner igen.'}
],
ex:{type:'build',title:'Bygg din profil i 5 steg',desc:'Komplett digital profil med pitch och styrkor.',fields:[{l:'Profilbild — vad behöver förbättras?',ph:'T.ex. Selfie → professionell bild neutral bakgrund.',hint:'Neutral bakgrund, tydligt ansikte.'},{l:'Kort presentation',ph:'Skriv din pitch-text...',ta:true},{l:'5 viktigaste kompetenser',ph:'1. \n2. \n3. \n4. \n5. ',ta:true,hint:'Mixa hårda och mjuka.'},{l:'Erfarenhetssammanfattning',ph:'T.ex. 3 år lager hos X, 2 år butik hos Y...',ta:true},{l:'Vilka branscher?',ph:'T.ex. Lager, Handel, Transport...',hint:'Välj 2-4.'}]},
quiz:[{q:'Vad är en digital profil?',o:['Spelkonto','Professionell presentation online','E-post'],c:1},{q:'Varför pitch och profil ihop?',o:['Krav','Enhetligt professionellt intryck','Sparar tid'],c:1},{q:'Viktigaste delarna?',o:['Hobbies','Bild, presentation, styrkor, erfarenhet, kontakt','Vänner'],c:1}],
pr:['Digital profil baserat på min pitch.','Förbättra min presentation.','Vad saknas i min profil: …']}
,{id:'d4',icon:'📧',title:'E-post & professionell kommunikation',sub:'Skriv rätt från dag ett',color:'#34d399',bc:'rgba(52,211,153,.3)',bg:'rgba(52,211,153,.07)',video:'/videos/d4-epost.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'📧',h:'Vad är syftet?',t:'Skriva professionella e-postmeddelanden som faktiskt blir lästa — och besvarade.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'En professionell adress, strukturen för jobbsökar-mejl, ämnesraden, och inkorgshantering.'},
{icon:'✅',h:'När du är klar ska du...',t:'ha en professionell e-postadress och en mall för dina ansökningsmejl.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 3 minuter för film och lektioner, plus en övning där du sätter upp din mejl.'}
],
a:'Rekryteraren bedömer din kommunikationsförmåga i varje mejl — det är ditt visitkort.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom vad som gör en e-post professionell — adressen, ämnesraden, strukturen och signaturen. Se den först, så blir lektionerna lättare att följa.'},
{t:'Din professionella e-postadress',
cards:[
{icon:'❌',h:'Undvik',t:'partyking88@hotmail.com eller coolboy_hbg@yahoo.com — säger fel saker om dig.'},
{icon:'✅',h:'Använd',t:'fornamn.efternamn@gmail.com — eller f.efternamn@gmail.com.'},
{icon:'🆓',h:'Skapa via Gmail',t:'Gratis, professionellt och standard i Sverige.'}
],
a:'En oprofessionell adress ger dåligt första intryck direkt — innan rekryteraren ens öppnat ditt CV.'},
{t:'Skriv ett professionellt mejl',
cards:[
{icon:'📌',h:'1. Ämnesrad',t:'Tydlig och specifik: "Ansökan — Lagerarbetare ref 2024-456".'},
{icon:'👋',h:'2. Hälsning',t:'"Hej [Namn],"'},
{icon:'✏️',h:'3. Kärnan',t:'Kort och konkret — 3–5 meningar räcker.'},
{icon:'🙏',h:'4. Avslutning',t:'"Med vänliga hälsningar"'},
{icon:'✍️',h:'5. Signatur',t:'Namn + telefon — gärna LinkedIn.'}
],
a:'Rekryterare läser mejl snabbt — max 30 sekunder. Ämnesraden avgör om det ens öppnas. Undvik slang, utropstecken och VERSALER.'},
{t:'Hantera inkorgen professionellt',
cards:[
{icon:'⏰',h:'Svara inom 24 timmar',t:'Visar att du tar processen seriöst.'},
{icon:'🔠',h:'Kontrollera stavning',t:'Slarvfel ger dåligt första intryck.'},
{icon:'✍️',h:'Professionell signatur',t:'Med telefonnummer — rekryterare ringer.'},
{icon:'🚫',h:'Skriv aldrig i affekt',t:'Sov på det innan du skickar laddade mejl.'}
],
a:'E-postkompetens är undervärderat. Rekryteraren bedömer din kommunikation i varje mejl du skickar.'}
],
ex:{type:'build',title:'Din professionella mejl-setup',desc:'Skapa och testa din professionella kommunikation.',fields:[{l:'Din professionella e-postadress',ph:'T.ex. anna.karlsson@gmail.com',hint:'Skapa ny om din nuvarande ser oprofessionell ut'},{l:'Skriv en professionell ämnesrad',ph:'T.ex. Ansökan — Undersköterska, Region Skåne, ref 2024-123'},{l:'Din mejl-signatur',ph:'Namn, telefon, LinkedIn (valfritt)'}]},
quiz:[{q:'Vilken e-postadress är mest professionell?',o:['partygirl99@hotmail.com','anna.karlsson@gmail.com','coolguy@yahoo.se','anonymous123@mail.com'],c:1},{q:'Hur snabbt bör du svara på rekryterares mejl?',o:['Inom en vecka','Inom 24 timmar','Spelar ingen roll','Bara om du är intresserad'],c:1},{q:'Vad är viktigast i ämnesraden?',o:['Att den är lång','Tydlig och specifik — tjänst och ref-nr','Att den är kreativ','Börja med Hej'],c:1},{q:'Vad ska en professionell signatur ha?',o:['Bara namn','Namn och telefonnummer','Favoritcitat','Namn, telefon och gärna LinkedIn'],c:3}],
pr:['Skriv ansökningsmejl för [tjänst] till [företag].','Förbättra detta mejl: [klistra in]','Vad ska min mejl-signatur innehålla?']},
{id:'d5',icon:'🔑',title:'BankID & svenska e-tjänster',sub:'Det digitala nyckelsystemet i Sverige',color:'#34d399',bc:'rgba(52,211,153,.3)',bg:'rgba(52,211,153,.07)',video:'/videos/d5-bankid.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🔑',h:'Vad är syftet?',t:'Förstå BankID — och hur du använder Sveriges digitala e-tjänster säkert.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Vad BankID är, var du använder det, viktiga myndighetstjänster och hur du skyddar dig mot bedrägerier.'},
{icon:'✅',h:'När du är klar ska du...',t:'ha aktiverat digital brevlåda och veta hur du undviker BankID-bedrägerier.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 3 minuter för film och lektioner, plus en säkerhetscheck.'}
],
a:'Utan BankID är många myndighetsärenden omöjliga att göra digitalt. Det är navet i den svenska digitala vardagen.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom vad BankID är, viktiga e-tjänster du når med det, och hur du undviker de vanligaste BankID-bedrägerierna. Se den först, så blir lektionerna lättare att följa.'},
{t:'Vad är BankID?',
cards:[
{icon:'🆔',h:'Digital legitimation',t:'Din identitet på nätet — och vid signering.'},
{icon:'🏦',h:'Utfärdas av din bank',t:'Helt gratis — kräver svenskt personnummer.'},
{icon:'📱',h:'Som app eller på dator',t:'Mobilt BankID är vanligast.'}
],
a:'Utan BankID är många myndighetsärenden omöjliga att göra digitalt.'},
{t:'Viktiga svenska e-tjänster',
cards:[
{icon:'🏛️',h:'Mina sidor (FK)',t:'Sjukpenning, bidrag, ärenden.'},
{icon:'📚',h:'CSN',t:'Studiestöd och återbetalning.'},
{icon:'🏥',h:'1177',t:'Sjukvård och vårdärenden.'},
{icon:'📊',h:'Skatteverket',t:'Deklaration och skattekontot.'},
{icon:'💼',h:'Arbetsförmedlingen',t:'Aktivitetsrapport och ärenden.'},
{icon:'📨',h:'minmeddelanden.se',t:'Digital brevlåda — aktivera den nu.'}
],
a:'Sverige är ett av världens mest digitaliserade länder. Aktivera digital brevlåda — annars missar du myndighetspost.'},
{t:'Digital säkerhet med BankID',
cards:[
{icon:'🚫',h:'ALDRIG',t:'Använd BankID om någon RINGER och ber dig.'},
{icon:'🔍',h:'Kontrollera',t:'Vad du signerar — varje gång.'},
{icon:'✅',h:'Du initierar själv',t:'Inloggningen ska alltid starta från dig.'},
{icon:'📞',h:'Vid misstanke',t:'Lägg på direkt — ring banken på officiellt nummer.'}
],
a:'Vanligaste BankID-bedrägeri: telefonbluff där "banken" ber dig signera. Banker ringer ALDRIG och ber dig använda BankID.'}
],
ex:{type:'build',title:'Din BankID-checklista',desc:'Säkerställ att du har BankID och vet hur du använder det.',fields:[{l:'Har du BankID? Vilken bank?',ph:'T.ex. Ja, Mobilt BankID via Swedbank / Nej, behöver ordna'},{l:'Vilka e-tjänster behöver du nu?',ph:'T.ex. FK Mina sidor, 1177, AF digitalt...',hint:'Logga in och testa var och en'},{l:'Har du aktiverat digital brevlåda?',ph:'T.ex. Ja via minmeddelanden.se / Nej — gör det nu',hint:'minmeddelanden.se — gratis'},{l:'Vad gör du om du kontaktas om BankID?',ph:'T.ex. Lägger på och ringer banken på officiellt nummer...',ta:true}]},
quiz:[{q:'Vad är BankID?',o:['Ett bankkort','Digital legitimation och signering i Sverige','En bank-app','Ett kreditkort'],c:1},{q:'Vad gör du om någon ringer och ber dig använda BankID?',o:['Gör som de säger om det låter trovärdigt','Lägg på och ring din bank direkt','Signera om det verkar okej','Fråga vad de vill'],c:1},{q:'Var ansöker du om BankID?',o:['Skatteverket','Din svenska bank','Polisen','Posten'],c:1},{q:'Vad är Mina meddelanden?',o:['E-post från vänner','Digital brevlåda för myndighetspost','SMS-tjänst','En app'],c:1}],
pr:['Vilka e-tjänster behöver jag som jobbsökare?','Förklara BankID för någon som aldrig hört talas om det.','Vad gör jag om jag inte har BankID ännu?']},
{id:'d6',icon:'🔍',title:'Söka jobb digitalt',sub:'Platsbanken, AF och jobboarderna',color:'#34d399',bc:'rgba(52,211,153,.3)',bg:'rgba(52,211,153,.07)',video:'/videos/d6-digitalt.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🔍',h:'Vad är syftet?',t:'Sätta upp en komplett digital jobbsökning så att nya jobb hittar dig — automatiskt.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'De viktigaste jobboarderna, hur jobbagenter fungerar, och hur du filtrerar smart på Platsbanken.'},
{icon:'✅',h:'När du är klar ska du...',t:'ha minst tre jobbagenter uppsatta och veta hur du filtrerar rätt.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 4 minuter för film och lektioner, plus en övning där du sätter upp din egen jobbsökning.'}
],
a:'En digital jobbsökning tar fem minuter att sätta upp — och sparar dig timmar varje vecka.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom de viktigaste jobboarderna, hur du sätter upp jobbagenter, och hur du filtrerar smart. Se den först, så blir lektionerna lättare att följa.'},
{t:'De viktigaste jobboarderna',
cards:[
{icon:'🏛️',h:'Platsbanken',t:'Störst och gratis — kopplad till Arbetsförmedlingen.'},
{icon:'💼',h:'LinkedIn Jobs',t:'Nätverk och jobb i ett.'},
{icon:'🔵',h:'Blocket Jobb',t:'Lokala jobb nära dig.'},
{icon:'⭐',h:'Indeed.se',t:'Aggregerar annonser från alla sajter.'}
],
a:'Alla arbetsgivare med lönestöd måste annonsera på Platsbanken. Filtrera alltid på ort — Helsingborg och Skåne.'},
{t:'Jobbagenter',
cards:[
{icon:'🔁',h:'En sparad sökning',t:'En jobbagent är en sökning som körs automatiskt åt dig.'},
{icon:'📧',h:'Nya jobb i inkorgen',t:'Du får färska annonser varje dag — helt gratis.'},
{icon:'3️⃣',h:'Så sätter du upp en',t:'Sök på Platsbanken, klicka "Spara sökning", välj daglig e-post — upprepa på LinkedIn och Indeed.'}
],
a:'Jobbagenter är ett av de mest underutnyttjade verktygen. Sätt upp minst tre — idag.'},
{t:'Hitta rätt med sökfilter',
cards:[
{icon:'📍',h:'Ort',t:'Filtrera på Helsingborg och Skåne.'},
{icon:'⏰',h:'Omfattning',t:'Välj heltid eller deltid.'},
{icon:'📅',h:'Senaste 7 dagarna',t:'Se de färska annonserna först.'},
{icon:'⚡',h:'Sök tidigt',t:'Många jobb fylls inom 3 dagar — ansök direkt vid en match.'}
],
a:'Sök på kompetensord, inte bara titlar. "Truck" hittar alla jobb som nämner truckkompetens — oavsett jobbtitel.'}
],
ex:{type:'build',title:'Din digitala jobbsök-setup',desc:'Sätt upp en komplett digital jobbsökning idag.',fields:[{l:'Vilket yrke söker du? Skriv din sökterm',ph:'T.ex. lagerarbetare, undersköterska, kundtjänst...'},{l:'Har du satt upp jobbagenter? Var?',ph:'T.ex. Ja på Platsbanken och LinkedIn / Nej — gör det nu',hint:'Gör det nu — tar 5 min!'},{l:'Vilka 3 jobboarder ska du använda?',ph:'T.ex. Platsbanken, LinkedIn, Blocket Jobb'},{l:'Söktaktik — hur ofta och när?',ph:'T.ex. Kolla inkorgen varje morgon, ansök direkt vid match'}]},
quiz:[{q:'Vilken jobboard är störst och gratis i Sverige?',o:['LinkedIn','Platsbanken (AF)','Indeed','Monster'],c:1},{q:'Vad är en jobbagent?',o:['En person som söker jobb åt dig','Automatisk sökning som mailar nya jobb','En rekryterare','En app'],c:1},{q:'Hur snabbt bör du söka ett jobb du hittar?',o:['Vänta och tänk','Inom 3 dagar — många fylls snabbt','Samla och sök på fredag','Spelar ingen roll'],c:1},{q:'Vilket filter är viktigast på Platsbanken?',o:['Lön','Ort — annars drunknar du i annonser','Arbetsgivare','Publikationsdatum'],c:1}],
pr:['Hitta 5 bästa jobben för [yrke] i Helsingborg.','Hur sätter jag upp jobbagent på Platsbanken?','Vilken sökterm ger bäst träffar för [yrke]?']},
{id:'d7',icon:'🎥',title:'Digitala möten & videointervjuer',sub:'Se professionell ut på skärm',color:'#34d399',bc:'rgba(52,211,153,.3)',bg:'rgba(52,211,153,.07)',video:'/videos/d7-moten.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🎥',h:'Vad är syftet?',t:'Se professionell ut på Teams, Zoom och Google Meet — utan att stressa.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'De tre vanligaste programmen, bakgrund, ljus, kamera och teknisk förberedelse.'},
{icon:'✅',h:'När du är klar ska du...',t:'ha en bra setup som funkar inför varje digital intervju.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 3 minuter för film och lektioner, plus en teknisk checklista.'}
],
a:'Tekniska problem är vanligaste orsaken till stress i digitala intervjuer. Förberedelse är skillnaden.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom de tre vanligaste mötesprogrammen, hur du ser professionell ut, och hur du förbereder tekniken. Se den först, så blir lektionerna lättare att följa.'},
{t:'Teams, Zoom och Google Meet',
cards:[
{icon:'🔵',h:'Microsoft Teams',t:'Standard i myndigheter och stora bolag.'},
{icon:'🟢',h:'Zoom',t:'Dominerar inom rekrytering.'},
{icon:'🔴',h:'Google Meet',t:'Gratis — via Gmail.'},
{icon:'📥',h:'Ladda ner i förväg',t:'Du behöver inget konto för att delta — länken räcker.'}
],
a:'Alla tre fungerar likadant — klicka på länken, testa mikrofon och kamera, delta.'},
{t:'Se professionell ut på skärm',
cards:[
{icon:'🧱',h:'Bakgrund',t:'Neutral, ren vägg — eller virtuell bakgrund.'},
{icon:'💡',h:'Ljus FRAMFÖR dig',t:'Lampa eller fönster — aldrig fönster bakom.'},
{icon:'👁️',h:'Kamera i ögonhöjd',t:'Laptop på böcker funkar perfekt.'},
{icon:'👔',h:'Klä överkroppen',t:'Som till en vanlig intervju.'}
],
a:'En lampa framför ansiktet kostar 150–300 kr och gör enorm skillnad — testa setupen 10 min innan.'},
{t:'Tekniska förberedelser',
cards:[
{icon:'🔗',h:'Testa länken',t:'Dagen innan — inte fem minuter innan.'},
{icon:'🔋',h:'Ladda enheten',t:'Eller koppla in den under mötet.'},
{icon:'🔕',h:'Stäng notiser',t:'Tysta telefon, mejl och chattar.'},
{icon:'💧',h:'Ha vatten nära',t:'Munnen blir torr när du är nervös.'},
{icon:'⏰',h:'Ring in 3–5 min tidigt',t:'Visar respekt — och du hinner lösa problem.'}
],
a:'Ha alltid rekryterarens telefonnummer redo — om tekniken fallerar ringer du in direkt och räddar mötet.'}
],
ex:{type:'build',title:'Din digitala intervju-setup',desc:'Förbered din tekniska setup för digitala möten.',fields:[{l:'Vilken enhet använder du?',ph:'T.ex. Laptop, telefon, surfplatta...'},{l:'Hur ser bakgrunden bakom dig ut?',ph:'T.ex. Neutral vägg / rörig — behöver rensas / virtuell bakgrund',hint:'Testa via kameran nu!'},{l:'Hur är belysningen framför dig?',ph:'T.ex. Fönster framför / lampa / mörkt — behöver fixas',hint:'Ljus framför = professionellt'},{l:'Din checklista — 3 saker att göra innan nästa möte',ph:'1. Testa länken\n2. Ladda enheten\n3. Stäng notiser',ta:true}]},
quiz:[{q:'Vilket program är vanligast i svenska myndigheter?',o:['Zoom','Skype','Microsoft Teams','Google Meet'],c:2},{q:'Var ska ljuskällan vara?',o:['Bakom dig','Vid sidan','Framför dig','Under dig'],c:2},{q:'Hur tidigt bör du ansluta till digital intervju?',o:['Precis i tid','3-5 min tidigt','10 min tidigt','Spelar ingen roll'],c:1},{q:'Tekniken fallerar under intervjun — vad gör du?',o:['Hoppas det löser sig','Ring rekryteraren direkt','Avbryt och mejla','Vänta tålmodigt'],c:1}],
pr:['Checklista för digitala intervjuer.','Hur installerar jag Teams/Zoom?','Tips för att se professionell ut på videomöte.']},
{id:'d8',icon:'💻',title:'Office & produktivitetsverktyg',sub:'Word, Excel och Google — gratis alternativ',color:'#34d399',bc:'rgba(52,211,153,.3)',bg:'rgba(52,211,153,.07)',video:'/videos/d8-office.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'💻',h:'Vad är syftet?',t:'Lära dig de gratis verktygen du faktiskt behöver — Word, Excel och Google.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Microsoft Office vs Google Workspace, Word för CV, Excel-grunder, och var du gör allt gratis.'},
{icon:'✅',h:'När du är klar ska du...',t:'kunna välja rätt verktyg och spara CV som PDF.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 3 minuter för film och lektioner, plus en sorteringsövning.'}
],
a:'Verktygen är gratis — använd dem. Biblioteket ger fri tillgång till Office.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom Microsoft Office vs Google, Word för CV, PDF-export, och Excel-grunder. Se den först.'},
{t:'Microsoft Office vs Google',
cards:[
{icon:'🪟',h:'Word, Excel, PowerPoint',t:'Standard på arbetsplatser. Gratis på office.com.'},
{icon:'🌐',h:'Google Docs, Sheets, Slides',t:'100 % gratis med Gmail. Sparas i molnet.'},
{icon:'📚',h:'Biblioteket',t:'Gratis tillgång till Office i Helsingborg.'},
{icon:'🔄',h:'Kompatibilitet',t:'Google Docs exporterar till .docx utan problem.'}
],
a:'Office Online är identiskt med skrivbordsversionen för de flesta uppgifter.'},
{t:'Word för CV och brev',
cards:[
{icon:'📏',h:'Marginaler 2,5 cm',t:'Standard.'},
{icon:'🔤',h:'Arial eller Calibri',t:'Storlek 11–12.'},
{icon:'📄',h:'Spara som PDF',t:'Ser likadan ut på alla enheter.'},
{icon:'🎨',h:'Gratis CV-mallar',t:'canva.com, Microsoft mallbibliotek, CVmatchen.'}
],
a:'Filnamn på CV: CV_Förnamn_Efternamn.pdf. PDF är standard att skicka i.'},
{t:'Excel — grunderna',
cards:[
{icon:'💰',h:'Budgetera',t:'Ekonomin — hyra, mat, sparande.'},
{icon:'📋',h:'Spåra ansökningar',t:'Vilka jobb du sökt och status.'},
{icon:'➕',h:'=SUM(A1:A10)',t:'Summerar A1 till A10 — formel-grund.'},
{icon:'🎬',h:'YouTube',t:'"Excel nybörjare" — allt på 20 min.'}
],
a:'Excel-grundkunskaper nämns i ca 30 % av kontorsjobb. Google Sheets fungerar identiskt och är gratis.'}
],
ex:{type:'sort',title:'Microsoft Office eller Google?',desc:'Sortera rätt!',catA:'Microsoft Office',catB:'Google Workspace (gratis)',items:[{l:'Word — ordbehandling',c:'A'},{l:'Google Docs',c:'B'},{l:'Excel',c:'A'},{l:'Google Sheets',c:'B'},{l:'Kräver licens',c:'A'},{l:'Sparas automatiskt i molnet',c:'B'},{l:'Standard på arbetsplatser',c:'A'},{l:'Fungerar direkt i webbläsaren',c:'B'}]},
quiz:[{q:'Vilket format skickar du CV i?',o:['Word (.docx)','PDF','Excel','Bild (.jpg)'],c:1},{q:'Var kan du använda Office gratis?',o:['Kan inte','office.com och biblioteket','Bara med studentlicens','Aldrig gratis'],c:1},{q:'Vilken Excel-formel summerar A1 till A10?',o:['=ADD(A1,A10)','=SUM(A1:A10)','=TOTAL(A1-A10)','=COUNT(A1:A10)'],c:1},{q:'Googles gratis alternativ till Word?',o:['Google Word','Google Write','Google Docs','Google Text'],c:2}],
pr:['Hur skapar jag CV i Google Docs?','Grundläggande Excel-formler jag bör kunna.','Hur exporterar jag Google Docs till PDF?']},
{id:'d9',icon:'🔐',title:'Integritet & lösenordssäkerhet',sub:'Skydda dig själv online',color:'#34d399',bc:'rgba(52,211,153,.3)',bg:'rgba(52,211,153,.07)',video:'/videos/d9-losenord.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🔐',h:'Vad är syftet?',t:'Skydda dig själv online — på fem minuter.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Starka lösenord, lösenordshanterare, 2FA och hur du känner igen phishing.'},
{icon:'✅',h:'När du är klar ska du...',t:'ha 2FA aktiverat på dina viktigaste konton.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 3 minuter för film och lektioner, plus en säkerhets-checklista.'}
],
a:'81 % av dataintrång beror på svaga eller återanvända lösenord. Det är där du börjar.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom starka lösenord, lösenordshanterare, tvåstegsverifiering och hur du känner igen phishing. Se den först, så blir lektionerna lättare att följa.'},
{t:'Starka lösenord',
cards:[
{icon:'🚫',h:'Undvik',t:'password123, katt, förnamn + födelseår.'},
{icon:'📏',h:'Minst 12 tecken',t:'Längre lösenord är exponentiellt svårare att knäcka.'},
{icon:'🔣',h:'Blanda',t:'Bokstäver, siffror och symboler.'},
{icon:'🆔',h:'Unikt per sajt',t:'Aldrig återanvänt — inte ens varianter.'}
],
a:'Lösenordsåteranvändning är den vanligaste orsaken till konto-intrång.'},
{t:'Lösenordshanterare & 2FA',
cards:[
{icon:'🛡️',h:'Bitwarden',t:'Gratis och säker lösenordshanterare.'},
{icon:'🔑',h:'Google Password Manager',t:'Inbyggt i Chrome — funkar bra.'},
{icon:'🔐',h:'Tvåstegsverifiering',t:'Aktivera på Gmail, LinkedIn, bank, AF — gratis, tar 5 min.'},
{icon:'📱',h:'SMS eller app',t:'Google Authenticator är säkrare än SMS.'}
],
a:'2FA gör att även ett läckt lösenord inte räcker för att komma in — det är ditt viktigaste skydd.'},
{t:'Phishing & bedrägerier',
cards:[
{icon:'⏰',h:'Brådska',t:'"Agera inom 24 timmar" — varningssignal.'},
{icon:'📛',h:'Felstavad avsändare',t:'Kolla mejladressen noga — inte bara namnet.'},
{icon:'🔓',h:'Begär lösenord eller BankID',t:'Myndigheter ber ALDRIG om det via mejl.'},
{icon:'📎',h:'Konstiga bilagor',t:'Öppna aldrig — radera direkt.'}
],
a:'Vanligaste bluffar: falska Postnord-SMS, Skatteverket-mejl, Klarna-bluffar. Rapportera misstänkta mejl till cert.se.'}
],
ex:{type:'build',title:'Din digitala säkerhets-checklista',desc:'Säkra dina viktigaste konton.',fields:[{l:'Har du 2FA på Gmail/e-post?',ph:'T.ex. Ja / Nej — aktiverar nu',hint:'Gör det nu — tar 5 min!'},{l:'Använder du samma lösenord på flera sajter?',ph:'T.ex. Ja / Nej / Använder Bitwarden'},{l:'Hur känner du igen phishing-mejl?',ph:'T.ex. Kontrollerar avsändarens adress, hovrar över länken...',ta:true},{l:'Vilka 3 konton är viktigast att säkra?',ph:'T.ex. Gmail, LinkedIn, AF-profilen',hint:'Sätt 2FA på alla tre!'}]},
quiz:[{q:'Bästa sättet att hantera lösenord?',o:['Samma lösenord överallt','Lösenordshanterare med unika per sajt','Skriva upp på lapp','Använda födelsedag'],c:1},{q:'Vad är 2FA?',o:['Lösenord med 2 ord','Tvåstegsverifiering — extra säkerhetskod','Två separata konton','En typ av BankID'],c:1},{q:'Vad gör du med ett misstänkt mejl?',o:['Klickar på länken för att kolla','Svarar och frågar','Kontrollerar avsändarmejlen och raderar vid tvekan','Ignorerar'],c:2},{q:'Vilka myndigheter ber om lösenord via mejl?',o:['Skatteverket ibland','FK alltid','Inga — myndigheter ber ALDRIG om det','Bara AF'],c:2}],
pr:['Hur sätter jag upp 2FA på Gmail?','Rekommendera gratis lösenordshanterare.','Hur känner jag igen phishing-bluffar?']},
{id:'d10',icon:'📱',title:'Smartphone & appar för jobbet',sub:'Ditt mobilkontor i fickan',color:'#34d399',bc:'rgba(52,211,153,.3)',bg:'rgba(52,211,153,.07)',video:'/videos/d10-smartphone.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'📱',h:'Vad är syftet?',t:'Göra mobilen till ett professionellt jobbsökar-verktyg.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Måste-appar, professionell röstbrevlåda, notiser, och gratis Wi-Fi.'},
{icon:'✅',h:'När du är klar ska du...',t:'ha rätt appar installerade och en professionell setup.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 3 minuter för film och lektioner, plus en mobil-setup.'}
],
a:'Installera apparna proaktivt — inte i en kris.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom måste-appar, röstbrevlåda, notiser och gratis Wi-Fi i Helsingborg. Se den först.'},
{t:'Måste-appar för jobbsökare',
cards:[
{icon:'💼',h:'Jobbsök',t:'Arbetsförmedlingen, LinkedIn, Indeed.'},
{icon:'🏛️',h:'Myndigheter',t:'Mitt FK, 1177, Skatteverket.'},
{icon:'📧',h:'Kommunikation',t:'Gmail, Teams eller Zoom.'},
{icon:'💰',h:'Ekonomi',t:'Din banks app och Swish.'}
],
a:'AF-appen låter dig svara på aktiviteter direkt. Alla myndighets-appar är gratis.'},
{t:'Håll mobilen jobbredo',
cards:[
{icon:'🎙️',h:'Professionell röstbrevlåda',t:'"Hej, du har nått [Namn]. Lämna ett meddelande."'},
{icon:'🔔',h:'Notiser på',t:'E-post: direkt. LinkedIn: viktiga meddelanden. AF: aktiviteter.'},
{icon:'📞',h:'Stämmer telefonnumret?',t:'På CV och LinkedIn — rekryterare ringer.'}
],
a:'Röstbrevlåda är underskattat. Svara alltid inom 2 timmar om möjligt.'},
{t:'Gratis Wi-Fi och säkerhet',
cards:[
{icon:'📚',h:'Stadsbiblioteket',t:'Dator + Wi-Fi + skrivare för CV — gratis.'},
{icon:'🏢',h:'Arbetsförmedlingen',t:'Wi-Fi och support.'},
{icon:'☕',h:'Caféer',t:"McDonald's, Espresso House."},
{icon:'🚫',h:'Aldrig BankID',t:'På öppet Wi-Fi utan VPN.'}
],
a:'Biblioteket i Helsingborg är en av de bästa resurserna för jobbsökare. Öppet vardagar.'}
],
ex:{type:'build',title:'Din mobilsetup för jobbet',desc:'Gör telefonen till ett professionellt verktyg.',fields:[{l:'Vilka jobbsökar-appar har du?',ph:'T.ex. LinkedIn, AF-appen — saknar: Mitt FK',hint:'Installera de du saknar nu!'},{l:'Har du professionell röstbrevlåda?',ph:'T.ex. Ja / Nej — spelar in en nu',hint:'Testa: ring ditt eget nummer'},{l:'Var hittar du gratis Wi-Fi nära dig?',ph:'T.ex. Stadsbiblioteket, AF-kontoret, McDonald\'s centralen'},{l:'Stämmer ditt telefonnummer på LinkedIn och CV?',ph:'T.ex. Ja +46 70-XXX / Nej — uppdaterar nu',hint:'Rekryterare ringer — de måste nå dig!'}]},
quiz:[{q:'Vilken app ger info om AF-aktiviteter?',o:['LinkedIn','Arbetsförmedlingen-appen','Skatteverket','Gmail'],c:1},{q:'Var hittar du gratis dator och Wi-Fi i Helsingborg?',o:['AF-kontoret','Stadsbiblioteket','McDonald\'s','Alla stämmer'],c:1},{q:'Varför är professionell röstbrevlåda viktigt?',o:['Det är det inte','Rekryterare lämnar meddelanden om du inte svarar','Lagstadgat','Syns på CV'],c:1},{q:'Vad ska du undvika på öppet Wi-Fi?',o:['Streama video','Bank- och känsliga inloggningar utan VPN','Använda LinkedIn','Ladda ner appar'],c:1}],
pr:['Vilka appar behöver jag som jobbsökare i Sverige?','Hur sätter jag upp röstbrevlåda?','Var hittar jag gratis resurser för jobbsök i Helsingborg?']},
{id:'d11',icon:'🤖',title:'AI-verktyg i jobbet',sub:'Använd AI som en superkraft',color:'#34d399',bc:'rgba(52,211,153,.3)',bg:'rgba(52,211,153,.07)',video:'/videos/d11-ai.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🤖',h:'Vad är syftet?',t:'Använda AI som en superkraft i ditt jobbsök — utan att tappa din egen röst.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Vad AI kan göra, hur du skriver bra prompts, och hur du behåller äktheten.'},
{icon:'✅',h:'När du är klar ska du...',t:'kunna skriva en bra prompt med formeln Vem + Vad + Mål.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 3 minuter för film och lektioner, plus en prompt-övning.'}
],
a:'AI ersätter inte din personlighet — det förstärker din förmåga att kommunicera.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom vad AI kan göra, hur du skriver bra prompts, och varför din personlighet ska synas. Se den först, så blir lektionerna lättare att följa.'},
{t:'Vad kan AI göra för dig?',
cards:[
{icon:'📄',h:'Förbättra CV och brev',t:'Klistra in — be om förbättringar.'},
{icon:'🔍',h:'Förklara annonser',t:'AI hjälper dig se vad de söker.'},
{icon:'💬',h:'Träna intervjusvar',t:'Be AI ställa vanliga frågor — öva högt.'},
{icon:'📧',h:'Skriva professionella mejl',t:'Få ett utkast på sekunder.'},
{icon:'🌍',h:'Översätta',t:'Mellan språk — eller från krångligt svenska till enkelt.'}
],
a:'Gratis verktyg: claude.ai och chatgpt.com — börja med dem.'},
{t:'Bra prompts = bra resultat',
cards:[
{icon:'❌',h:'Dålig prompt',t:'"Hjälp mig med CV" — ger generiskt svar.'},
{icon:'✅',h:'Bra prompt',t:'"Lagerarbetare i Helsingborg, 3 år PostNord, truck A+B. Förbättra min profiltext, max 4 meningar."'},
{icon:'🧮',h:'Formeln',t:'Vem du är + Vad du kan + Vad du vill ha.'},
{icon:'🔁',h:'Iterera',t:'Be om varianter — välj den du gillar bäst.'}
],
a:'Specifika prompts med kontext ger alltid bättre svar. Berätta yrke, stad, erfarenhet och önskat resultat.'},
{t:'AI och äkthet',
cards:[
{icon:'1️⃣',h:'Skriv ditt utkast',t:'Få ner din egen tanke först.'},
{icon:'2️⃣',h:'Be AI förbättra',t:'Skicka utkastet — be om feedback eller förslag.'},
{icon:'3️⃣',h:'Justera till din stil',t:'Lägg tillbaka din röst — och kontrollera fakta.'},
{icon:'⚠️',h:'Kopiera aldrig blint',t:'Granska — AI hittar på ibland.'}
],
a:'AI-text är ofta överdrivet formell och saknar specifika detaljer. Din personlighet ska alltid synas.'}
],
ex:{type:'build',title:'Din AI-verktygslåda',desc:'Träna på att använda AI för ditt jobbsök.',fields:[{l:'Vilket jobb söker du?',ph:'T.ex. Lagerarbetare Helsingborg, 3 år PostNord, truck A+B',hint:'Skriv detta — det är din AI-prompt!'},{l:'Skriv en prompt för din profiltext',ph:'T.ex. Förbättra min profiltext för lagerarbetare med...',ta:true,hint:'Specifik = bättre svar'},{l:'Vilka 3 AI-verktyg testar du?',ph:'T.ex. claude.ai, chatgpt.com, Google Translate',hint:'Alla gratis'}]},
quiz:[{q:'Vad är AI bäst på?',o:['Ersätta erfarenheter','Förbättra text du skrivit','Söka jobb åt dig','Skapa falskt CV'],c:1},{q:'Vad gör en bra prompt?',o:['Kort och vag','Specifik med yrke, stad, erfarenhet och mål','Så lång som möjligt','Börjar med Hej AI'],c:1},{q:'Vad ska du alltid göra med AI-text?',o:['Skicka direkt','Läsa och justera till din stil','Ta bort AI-ord','Fråga arbetsgivaren'],c:1},{q:'Var hittar du gratis AI?',o:['Måste köpa','claude.ai och chatgpt.com','Bara via arbetsgivaren','Biblioteket'],c:1}],
pr:['Förbättra min profiltext: [klistra in + yrke + stad]','Hjälp mig träna: Berätta om dig själv.','Förklara denna annons: [klistra in]']},
{id:'d12',icon:'📸',title:'Sociala medier & arbetsgivarbilden',sub:'Vad ser de när de googlar dig?',color:'#34d399',bc:'rgba(52,211,153,.3)',bg:'rgba(52,211,153,.07)',
lessons:[{t:'Arbetsgivare googlar dig — alltid',s:'70% av rekryterare i Sverige googlar kandidater.\n\nDe ser:\n📸 Instagram (om publikt)\n🔵 Facebook\n🐦 X/Twitter\n📹 TikTok\n\nDu kan inte ta bort Google-träffar — men du kan kontrollera vad de hittar.',a:'Digitalt fotavtryck lever länge. Bilder du lade upp för 10 år sedan kan synas. Googla ditt namn nu — det är samma bild rekryteraren ser.'},{t:'Vad skadar och hjälper?',s:'Skadar:\n❌ Fest-bilder\n❌ Stötande kommentarer\n❌ Klagomål på ex-arbetsgivare\n\nHjälper:\n✅ Professionell LinkedIn\n✅ Branschrelaterade inlägg\n✅ Rekommendationer',a:'57% av rekryterare har hittat innehåll som påverkat beslutet negativt. LinkedIn är det enda sociala mediet som alltid hjälper.'},{t:'Hantera din profil proaktivt',s:'Gör nu:\n1. Googla ditt namn\n2. Privatisera Instagram och Facebook\n3. Ta bort gamla stötande bilder\n4. Uppdatera LinkedIn\n5. Lägg upp professionellt foto\n\n💡 Ditt namn på Google ska leda till LinkedIn!',a:'Du kan begära borttagning av Google-resultat via deras formulär (GDPR). LinkedIn är det enda sociala mediet rekryterare aktivt söker på.'}],
ex:{type:'build',title:'Din digitala ryktesanalys',desc:'Kontrollera vad arbetsgivare ser.',fields:[{l:'Googla ditt namn — vad hittar du?',ph:'T.ex. LinkedIn, gammal blogg...',ta:true,hint:'Gör det nu!'},{l:'Vad behöver privatas eller tas bort?',ph:'T.ex. Instagram: göra privat / Facebook: ta bort gamla bilder',ta:true},{l:'Vad lägger du till?',ph:'T.ex. Uppdatera LinkedIn-bild, dela ett branschinlägg'},{l:'Ditt mål: Vad ska Google visa?',ph:'T.ex. LinkedIn som första träff'}]},
quiz:[{q:'Hur många rekryterare googlar?',o:['10%','30%','70%','5%'],c:2},{q:'Vad hjälper mest digitalt?',o:['Många Instagram-följare','Professionell LinkedIn','Aktiv Twitter','Stor Facebook-vänkrets'],c:1},{q:'Vad gör du med stötande gamla bilder?',o:['Låta vara','Ta bort dem nu','Hoppas ingen ser','Lägga upp fler nya'],c:1},{q:'Ditt namn på Google ska leda till?',o:['Ingenting','LinkedIn-profilen som första träff','Facebook','TikTok'],c:1}],
pr:['Städa min digitala profil steg för steg.','Vad delar jag på LinkedIn för [bransch]?','Hur privatiserar jag Instagram?']},
{id:'d13',icon:'🌐',title:'Digitalt CV & portfolio',sub:'Synas online utöver LinkedIn',color:'#34d399',bc:'rgba(52,211,153,.3)',bg:'rgba(52,211,153,.07)',
lessons:[{t:'Varför ett digitalt CV?',s:'Fördelar:\n✅ Alltid tillgängligt — dela en länk\n✅ Kan ha video och projekt\n✅ Visar digital kompetens\n✅ Sticker ut bland papper-CV\n\nEnklast:\n• LinkedIn (du har redan!)\n• Canva.com — gratis mallar\n• Google Sites — gratis hemsida',a:'Digitalt CV är standard i IT och kreativa yrken. Inom lager och vård är det ovanligt men positivt. En QR-kod på papper-CV som leder till LinkedIn är ett enkelt mellansteg.'},{t:'Bygg CV med Canva',s:'canva.com — gratis:\n1. Skapa konto med Gmail\n2. Sök CV i mallar\n3. Välj professionell mall\n4. Fyll i uppgifter\n5. Ladda ner som PDF\n\n✅ Neutral färg\n✅ Max 1 sida\n✅ Tydliga rubriker',a:'Canva är enklast för proffssiga CV utan grafikkompetens. Exportera alltid som PDF. Undvik: för färgglada templates och konstiga typsnitt.'},{t:'QR-kod till LinkedIn',s:'Lägg QR-kod på papper-CV:\n1. Gå till qr-code-generator.com\n2. Klistra in din LinkedIn-URL\n3. Ladda ner QR-koden\n4. Lägg längst ner på CV\n\nRekryteraren skannar → direkt till din LinkedIn.\nGratis, tar 5 minuter!',a:'QR-koder på CV ökar i Sverige. Alternativ: skriv LinkedIn-URL tydligt under kontaktuppgifterna — lika effektivt.'}],
ex:{type:'build',title:'Bygg ditt digitala CV',desc:'Skapa ett professionellt digitalt CV.',fields:[{l:'Har du Canva-konto?',ph:'T.ex. Ja / Nej — skapar ett nu med Gmail',hint:'Gratis med Gmail'},{l:'Vilken CV-mall väljer du?',ph:'T.ex. Minimalistisk marinblå med tydliga rubriker',hint:'Neutral och professionell'},{l:'Är din LinkedIn-URL anpassad?',ph:'T.ex. linkedin.com/in/anna-karlsson',hint:'Ändra: Inställningar > Offentlig profil'},{l:'Vad lägger du till som sticker ut?',ph:'T.ex. QR-kod till LinkedIn'}]},
quiz:[{q:'Vad är fördelen med digitalt CV?',o:['Snyggare','Alltid tillgängligt och visar digital kompetens','Arbetsgivare kräver det','Snabbare'],c:1},{q:'Enklaste verktyget för CV?',o:['Adobe InDesign','Publisher','Canva.com — gratis','Photoshop'],c:2},{q:'Vilket format skickar du CV i?',o:['Word','PDF','Excel','Bild'],c:1},{q:'Vad gör QR-koden på CV?',o:['Ser tekniskt ut','Länkar till LinkedIn direkt vid skanning','Obligatorisk trend','Tar för mycket plats'],c:1}],
pr:['Granska mitt CV: [klistra in] — ge 5 förslag.','Canva-mall för [yrke]?','Hur skriver jag LinkedIn-URL på CV?']},
{id:'d14',icon:'📚',title:'Onlinekurser & kompetensutveckling',sub:'Lär dig nytt — gratis och på distans',color:'#34d399',bc:'rgba(52,211,153,.3)',bg:'rgba(52,211,153,.07)',
lessons:[{t:'Gratis plattformar med certifikat',s:'Bästa gratis:\n\n🟢 Google Career Certificates — jobbrelevanta\n🔵 Coursera — välj "audit" för gratis\n🟡 LinkedIn Learning — 1 mån gratis\n🔴 YouTube — allt finns här\n🇸🇪 UR.se — svenska kurser\n🌐 GCFGlobal.org — Office och matte',a:'Google Career Certificates är designade för att leda direkt till anställning. Google samarbetar med tusentals arbetsgivare. Kurser: IT-support, Dataanalys, Projektledning. Slutförs på 3-6 månader deltid.'},{t:'Vad ska du lära dig?',s:'Mest efterfrågat 2024:\n\n💻 IT-support\n📊 Excel & dataanalys\n🔐 Cybersäkerhet\n📱 Sociala medier\n🤖 AI-verktyg\n\nTips: Kolla 5 jobbannonser du vill ha → Vad nämns mest?',a:'Branschen avgör vad du bör lära dig. Lager: WMS, SAP. Vård: journalsystem. IT: Python, SQL. Identifiera luckan och fyll den med en kurs.'},{t:'Planera lärandet',s:'30 min/dag = 3,5 tim/vecka.\n1 certifikat per månad är möjligt!\n\n✅ Anteckna och testa direkt\n✅ Lägg certifikat på LinkedIn\n\n💡 Kvällarna är bäst!\n\nKombinera kurs + praktik + CV = maxeffekt!',a:'30-minuters sessioner med aktivt testande är effektivare än 3-timmarsmaraton. Sätt ett mål: Klart certifikat till [datum].'}],
ex:{type:'build',title:'Din kompetensplan',desc:'Identifiera luckan och planera kursen.',fields:[{l:'Vilken kompetens saknar du?',ph:'T.ex. Excel, SAP, IT-support...',hint:'Kolla 5 jobbannonser!'},{l:'Vilken kurs börjar du med?',ph:'T.ex. Google IT-support via Coursera'},{l:'Hur många timmar/vecka?',ph:'T.ex. 30 min varje kväll = 3,5 tim/vecka',hint:'30 min/dag räcker!'},{l:'Ditt deadline',ph:'T.ex. Klart 1 juni — lägger på LinkedIn direkt',hint:'Sätt datum nu!'}]},
quiz:[{q:'Vilket certifikat är mest arbetsmarknadsnära?',o:['Harvard Online','Google Career Certificates','Khan Academy','YouTube-kurs'],c:1},{q:'Hur lång studiesession?',o:['3 timmar','30 minuter med aktivt lärande','Hela dagen','Spelar ingen roll'],c:1},{q:'Var lägger du certifikatet?',o:['I en mapp','LinkedIn — Licenser och certifikat','Skriver ut','Berättar i intervjun'],c:1},{q:'Hur hittar du vilken kompetens du saknar?',o:['Gissar','Kollar 5 jobbannonser du vill ha','Frågar vänner','Tar billigaste kursen'],c:1}],
pr:['Rekommendera kurs för [yrke].','Studieplan för IT-support 3 månader?','Hur lägger jag till certifikat på LinkedIn?']},
{id:'d15',icon:'✍️',title:'Digitala kontrakt & e-signering',sub:'Förstå och signera digitalt',color:'#34d399',bc:'rgba(52,211,153,.3)',bg:'rgba(52,211,153,.07)',
lessons:[{t:'Vad är ett digitalt kontrakt?',s:'Digitala kontrakt är juridiskt bindande i Sverige.\n\nDu signerar med:\n✅ BankID — vanligast\n✅ Scrive eller DocuSign\n\nAnställningskontrakt innehåller:\n• Arbetstid och lön\n• Prövotid (6 mån vanligt)\n• Uppsägningstid\n• Arbetsuppgifter',a:'Anställningsavtal ska vara skriftliga — be alltid om ett. Muntliga avtal gäller men är svåra att bevisa. BankID-signering är lika juridiskt bindande som penna på papper.'},{t:'Läs INNAN du signerar',s:'Kontrollera:\n\n💰 Lön: stämmer det vi kom överens om?\n⏰ Arbetstid: heltid/deltid?\n📅 Prövotid: hur lång?\n📢 Uppsägning: hur många månader?\n🏖️ Semester: 25 dagar = lag\n\nFråga om allt du inte förstår!',a:'Prövotid: arbetsgivaren kan avsluta utan skäl. 6 månader är standard. Sverige har ingen minimilön — kollektivavtal styr. Kolla ob-tillägg, övertid och friskvård.'},{t:'BankID-signering i praktiken',s:'1. Du får länk via e-post\n2. Öppnar dokumentet\n3. Läser noggrant\n4. Klickar Signera\n5. BankID öppnas\n6. Du godkänner i appen\n7. Kopia till din e-post\n\nSpara alltid en kopia!',a:'Signerat = bindande. Du kan inte ångra utan att bryta avtalet. Om något verkar fel — fråga innan du signerar. Du har rätt att be om betänketid.'}],
ex:{type:'build',title:'Din kontraktschecklista',desc:'Granska anställningskontrakt steg för steg.',fields:[{l:'Lön och arbetstid i kontraktet?',ph:'T.ex. 28 500 kr/mån, heltid 40 tim/vecka',hint:'Stämmer det ni kom överens om?'},{l:'Hur lång är prövotiden?',ph:'T.ex. 6 månader — standard',hint:'6 månader är standard'},{l:'Uppsägningstid?',ph:'T.ex. 1 månad från vardera sidan',hint:'Minst 1 månad = lag'},{l:'Vad frågar du om?',ph:'T.ex. Ob-tillägg? Friskvård? Övertid?',ta:true,hint:'Din rätt att fråga!'}]},
quiz:[{q:'Är digitala kontrakt bindande?',o:['Nej','Ja — BankID-signering gäller i lag','Bara stora summor','Beror på arbetsgivaren'],c:1},{q:'Vad gör du INNAN signering?',o:['Signerar snabbt','Läser noggrant och frågar om allt','Skannar','Frågar vänner'],c:1},{q:'Normal prövotid i Sverige?',o:['3 månader','6 månader','1 år','12 månader'],c:1},{q:'Vad om du inte förstår ett villkor?',o:['Signerar ändå','Frågar arbetsgivaren — du har rätt till betänketid','Googlar','Struntar i det'],c:1}],
pr:['Förklara detta villkor: [klistra in]','Vad kollar jag i anställningskontrakt?','Är denna prövotid rimlig?']},
{id:'d16',icon:'💸',title:'Digitala betalningar & fällorna',sub:'Swish, Klarna och köp nu betala sen',color:'#34d399',bc:'rgba(52,211,153,.3)',bg:'rgba(52,211,153,.07)',
lessons:[{t:'Swish — Sveriges betalningsapp',s:'Swish är standard i Sverige.\n\nAnvänds för:\n✅ Betala privatpersoner\n✅ Marknader och småbutiker\n\n⚠️ Bedrägerier:\n❌ Swisha aldrig för att bekräfta konto\n❌ Acceptera inte betalning du inte begärt\n\nSwish = omedelbart och oåterkalleligt!',a:'Swish-bedrägerier ökar kraftigt. Vanligaste: okänd person "felswistar" och ber om tillbaka. Pengarna de skickade är stulna. Kontakta bank omedelbart vid misstanke.'},{t:'Klarna och köp nu betala sen',s:'Klarna:\n✅ Smidigt att dela betalning\n⚠️ Men:\n❌ Ränta vid utebliven betalning\n❌ Påverkar kreditvärdighet\n❌ Lätt att köpa mer än du har råd\n\nRegeln: Har du inte råd nu? Ha inte råd sen heller!\n\nAnvänd bara Klarna om du kan betala direkt.',a:'Kronofogden tar emot fler ansökningar kopplat till BNPL. Om du missat betalning — kontakta Klarna direkt innan inkasso.'},{t:'Trygg näthandel',s:'✅ Köp hos kända sajter\n✅ Kontrollera https://\n✅ Läs Trustpilot-omdömen\n✅ Betala med kort (ångersrätt)\n✅ Spara kvitton\n\n❌ Obekanta sajter\n❌ För bra för att vara sant\n❌ Betala med presentkort',a:'Konsumentköplagen: 14 dagars ångerrätt vid distansköp. Kortbetalning ger chargeback-möjlighet vid bedrägerier. PayPal ger liknande skydd.'}],
ex:{type:'sort',title:'Säkert eller riskabelt?',desc:'Sortera situationerna rätt.',catA:'Säkert',catB:'Riskabelt',items:[{l:'Swisha ett belopp ni kommit överens om',c:'A'},{l:'Acceptera swish från okänd som säger sig felswistat',c:'B'},{l:'Klarna om du kan betala direkt ändå',c:'A'},{l:'Klarna för att ha råd med något du inte har råd med',c:'B'},{l:'Handla på välkänd sajt med https://',c:'A'},{l:'Betala med presentkort till okänd säljare',c:'B'},{l:'Läsa Trustpilot innan köp',c:'A'},{l:'Klicka "du har vunnit ett pris"-länk',c:'B'}]},
quiz:[{q:'Vad är unikt med Swish-betalningar?',o:['Kan ångras 24h','Omedelbart och oåterkalleligt','Tar 3 dagar','Säkrare än kort'],c:1},{q:'Klarnas största risk?',o:['Dyrt','Lätt köpa mer än du har råd + ränta vid miss','Dålig app','Bara iPhone'],c:1},{q:'Ångerrätt vid nätköp?',o:['3 dagar','14 dagar','30 dagar','7 dagar'],c:1},{q:'Swish-bedrägeri — vad gör du?',o:['Swishar tillbaka','Kontaktar banken omedelbart','Ignorerar','Polisanmäler nästa dag'],c:1}],
pr:['Skydda mig mot Swish-bedrägerier.','Missad Klarna-betalning — vad händer?','Konsumenträttigheter vid näthandel i Sverige?']},
{id:'d17',icon:'🏛️',title:'Myndigheternas digitala tjänster',sub:'Allt du kan göra hemifrån',color:'#34d399',bc:'rgba(52,211,153,.3)',bg:'rgba(52,211,153,.07)',
lessons:[{t:'Arbetsförmedlingen digitalt',s:'På af.se och AF-appen:\n\n✅ Se din aktivitetsplan\n✅ Rapportera jobbsök\n✅ Boka möten\n✅ Se handläggarens meddelanden\n\nLogga in med BankID.\nUppdatera regelbundet — handläggaren ser allt!',a:'AF:s digitala system heter Mina sidor. Aktivitetsrapportering krävs för ersättning. Appen fungerar bra på mobil — sätt på notiser.'},{t:'Försäkringskassan digitalt',s:'På fk.se och Mitt FK-appen:\n\n✅ Sjukanmälan dag 1\n✅ Se utbetalningar\n✅ Ansök om bidrag\n✅ Ladda upp intyg\n✅ Chatta med handläggare\n\n⚠️ Sjukanmälan SAMMA dag — annars riskerar du ersättning!',a:'FK hanterar ca 50 förmåner. De flesta ansökningar görs digitalt. Sjukanmälan dag 1 är krav.'},{t:'Skatteverket & deklaration',s:'skatteverket.se:\n\n✅ Deklarera — deadline 2 maj\n✅ Se skattsedel\n✅ Ändra skattejämkning\n✅ Ansök om ID-kort\n\nDeklaration med BankID:\n→ Öppna appen\n→ Godkänn\n→ Klart på 30 sekunder!',a:'Deklarationen är ifylld automatiskt för anställda. Kontrollera att alla inkomster stämmer. Deklarerar du inte = skattetillägg.'}],
ex:{type:'build',title:'Din myndighetsdigitala checklista',desc:'Kolla att du är inloggad rätt.',fields:[{l:'Inloggad på AF Mina sidor?',ph:'T.ex. Ja / Nej — loggar in nu',hint:'af.se → BankID'},{l:'Har du Mitt FK-appen?',ph:'T.ex. Ja / Nej — laddar ner nu',hint:'Gratis i App Store och Google Play'},{l:'Vet du hur du rapporterar jobbsök?',ph:'T.ex. Ja, via Mina sidor / Nej — frågar handläggaren'},{l:'Deklarationens deadline?',ph:'T.ex. 2 maj varje år',hint:'2 maj — missa inte!'}]},
quiz:[{q:'Vad gör du på AF Mina sidor?',o:['Söker jobb där','Rapporterar aktiviteter och jobbsök regelbundet','Bara tittar','Betalar avgift'],c:1},{q:'Sjukanmälan till FK — när?',o:['Nästa dag','Samma dag du är sjuk','Inom 3 dagar','Spelar ingen roll'],c:1},{q:'Deklarationsdeadline?',o:['1 april','2 maj','30 juni','31 december'],c:1},{q:'Vad behöver du för att logga in på myndighetssajter?',o:['Personnummer','BankID','E-post','Lösenord'],c:1}],
pr:['Hur rapporterar jag jobbsök på AF?','Vad ansöker jag om på FK om jag förlorar jobbet?','Hur ändrar jag skattejämkning?']},
{id:'d18',icon:'💬',title:'Digital kommunikation i arbetslivet',sub:'Slack, Teams och arbetslivets spelregler',color:'#34d399',bc:'rgba(52,211,153,.3)',bg:'rgba(52,211,153,.07)',
lessons:[{t:'Verktyg du möter på jobbet',s:'Vanligaste:\n\n🔵 Microsoft Teams — möten, chatt, filer\n🟢 Slack — tech och startups\n📧 E-post — formella ärenden\n📱 WhatsApp — många mindre arbetsplatser\n\nDe flesta arbetsplatser har ett huvudverktyg — fråga i onboardingen!',a:'Teams har 300+ miljoner aktiva användare. Slack dominerar i tech. Grundprincipen är densamma: snabb chatt, möten och fildelning på ett ställe. Kan du Teams lär du dig Slack på en dag.'},{t:'Ton och etik i digital kommunikation',s:'✅ Svara inom 2-4 timmar\n✅ Skriv kortfattat och tydligt\n✅ Rätt kanal: chatt vs e-post\n\n❌ Skriv inte i affekt\n❌ VERSALER = skrika\n❌ Dela inte känslig info okrypterat',a:'Digital kommunikation missförstås lättare — emojis och ton är avgörande. En "bra." med punkt kan uppfattas som sarkasm. När tveksam: ring istället.'},{t:'Dela filer professionellt',s:'✅ Använd OneDrive/SharePoint\n✅ Google Drive\n✅ Dropbox\n\n❌ Skicka ALDRIG:\n• Lösenord i chatt\n• Personnummer okrypterat\n• Stora bilagor\n\nDela länk > Bilaga alltid!',a:'GDPR gäller på jobbet. Skicka aldrig personnummer eller hälsoinfo i okrypterade kanaler. IT-avdelningen bestämmer vilka verktyg som är godkända.'}],
ex:{type:'build',title:'Din kommunikationsprofil på jobbet',desc:'Förbered dig för digital kommunikation.',fields:[{l:'Vilka verktyg används i din bransch?',ph:'T.ex. Vård: TakeCare / IT: Slack / Lager: Teams',hint:'Googla [bransch] kommunikationsverktyg'},{l:'Hur svarar du inom rimlig tid?',ph:'T.ex. Kolla Teams morgon och eftermiddag'},{l:'Vad undviker du i jobbrelaterade chattar?',ph:'T.ex. Privata diskussioner, känslig info',ta:true},{l:'Hur delar du en stor fil?',ph:'T.ex. Laddar upp till OneDrive och delar länk',hint:'Länk > Bilaga alltid'}]},
quiz:[{q:'Standard i svenska myndigheter?',o:['Slack','Microsoft Teams','WhatsApp','E-post'],c:1},{q:'Vad betyder VERSALER i chatt?',o:['Viktigt meddelande','Att skrika/vara arg','Man är deaf','Inget'],c:1},{q:'Bäst sätt att dela stor fil?',o:['E-postbilaga','Länk via OneDrive/Drive','USB-minne','Skriva ut'],c:1},{q:'Hur snabbt svarar du på jobbchatt?',o:['Direkt alltid','Inom 2-4 arbetstimmar','Nästa dag','Bara om viktigt'],c:1}],
pr:['Hur lär jag mig Slack snabbt?','Skillnad Teams och Slack?','Dela filer säkert på jobbet?']},
{id:'d19',icon:'🛡️',title:'Digital hälsa & skärmbalans',sub:'Ta hand om dig i det digitala livet',color:'#34d399',bc:'rgba(52,211,153,.3)',bg:'rgba(52,211,153,.07)',
lessons:[{t:'Skärmtid och produktivitet',s:'Snitt i Sverige: 6-8 timmar/dag.\n\nHantera det:\n✅ Pomodoro: 25 min fokus + 5 min paus\n✅ Telefonfri tid på kvällar och måltider\n✅ Stäng notiser under jobbsöket\n\nKolla din skärmtid:\n📱 iPhone: Skärm & Användningstid\n📱 Android: Digitalt välmående',a:'Mer än 4 tim social media/dag korrelerar med ökad ångest. Notiser fragmenterar koncentrationen — 23 minuter för att återfå fokus efter avbrott. Stäng notiser under jobbsöket.'},{t:'Negativa digitala miljöer',s:'Tecken:\n⚠️ Mår sämre efter scrolling\n⚠️ Jämför dig med andra\n⚠️ Sömnproblem pga skärm\n\nVad du gör:\n✅ Avfölj negativa konton\n✅ Använd tysta-funktionen\n✅ Rapportera trakasserier\n✅ Ta digitala pauser',a:'Nätmobbning anmäls till polisen om det är brottsligt. Plattformar har rapporteringsfunktioner. Kontakta Friends (friends.se) eller Brottsoffermyndigheten för stöd.'},{t:'Ergonomi och ögonhälsa',s:'20-20-20-regeln:\nVarje 20 min → titta 6 m bort i 20 sekunder\n\nSittställning:\n• Skärm i ögonhöjd\n• Rygg stödd\n• Fötter i golvet\n\n🌙 Natteläge efter kl 20!',a:'Digitalt ögonstress drabbar 65% av skärmanvändare. 20-20-20-regeln rekommenderas av ögonläkare. Skärmljus sent stör melatonin och sömnkvalitet.'}],
ex:{type:'build',title:'Din digitala hälsoplan',desc:'Ta kontroll över din skärmanvändning.',fields:[{l:'Din genomsnittliga skärmtid?',ph:'T.ex. 7 timmar — kolla i inställningarna',hint:'Inställningar > Skärm & Användningstid'},{l:'Vilket konto ger negativa känslor?',ph:'T.ex. Vissa Instagram-konton — avföljer nu',hint:'Avfölj utan dåligt samvete'},{l:'Telefon-rutin under jobbsöket?',ph:'T.ex. Stänger notiser, telefon upp-och-ned på bordet'},{l:'Din digitala paus-rutin?',ph:'T.ex. Inga skärmar efter kl 21'}]},
quiz:[{q:'Hur länge för att återfå fokus efter notis?',o:['1 minut','5 minuter','23 minuter','Omedelbart'],c:2},{q:'20-20-20-regeln?',o:['20 min träning','Varje 20 min: titta 6m bort i 20 sek','20 sek skärm','20 min paus'],c:1},{q:'Vad gör natteläge?',o:['Gör mörkare','Minskar blått ljus som stör sömnhormonet','Stänger notiser','Sparar batteri'],c:1},{q:'Nätmobbning — vad gör du?',o:['Svarar tillbaka','Rapporterar till plattform och vid brott till polisen','Ignorerar','Tar paus'],c:1}],
pr:['Minska skärmtid effektivt.','Rapportera nätmobbning på Instagram.','Ergonomi-tips för jobbsöket hemifrån?']},
{id:'d20',icon:'🚀',title:'Din digitala karriärplan',sub:'Sammanfattning och nästa steg',color:'#34d399',bc:'rgba(52,211,153,.3)',bg:'rgba(52,211,153,.07)',
lessons:[{t:'Vad du nu kan digitalt',s:'Du har gått igenom hela Digitalt!\n\nDu kan:\n✅ Bygga digital profil och LinkedIn\n✅ Söka jobb på alla plattformar\n✅ Kommunicera professionellt digitalt\n✅ Använda Office, AI och verktyg\n✅ Skydda dig online och hantera BankID\n✅ Förstå digitala avtal och betalningar\n\nDu är digitalt redo!',a:'Digital kompetens är en av de mest efterfrågade egenskaperna 2024-2030. Det är inte längre en bonus utan ett krav. Du har nu verktygen.'},{t:'Håll dig uppdaterad',s:'Tekniken förändras:\n\n📰 Följ: Di Digital, Computer Sweden\n🎓 En ny kurs per kvartal\n🔗 LinkedIn varje vecka\n🤖 Testa nya AI-verktyg\n\nMålet: Alltid bekväm med verktygen i din bransch.',a:'Branscher digitaliseras i olika takt — lager och vård är på väg in i digital transformation nu. Att ligga steget före märks på CV och i intervjun.'},{t:'Bygg ditt digitala varumärke',s:'1. LinkedIn: aktiv 2-3 ggr/vecka\n2. Dela branschrelevant innehåll\n3. Kommentera andras inlägg\n4. Lägg upp certifikat\n5. Be om rekommendationer\n\n→ Rekryterare hittar dig — inte tvärtom!\n\n"Ditt rykte online = ditt CV 24/7"',a:'40% av LinkedIn-rekryteringar sker utan att kandidaten sökt jobbet — de hittades. Personal branding online är inte bara för influencers.'}],
ex:{type:'ai-chat',title:'Chatta med AI-SYV om dina digitala nästa steg'},
quiz:[{q:'Vilka digitala kompetenser saknar du för drömjobbet?',o:['Vet inte','Googla + fråga rekryterare + kolla annonserna','Kolla LinkedIn','Alla alternativ'],c:1},{q:'Hur bygger du digitalt rykte?',o:['Posta privata saker','Aktiv LinkedIn med branschinnehåll och certifikat','Bara ha ett konto','Köpa följare'],c:1},{q:'Hur håller du dig uppdaterad?',o:['Behöver inte','En kurs per kvartal + följa branschnyheter','Lita på arbetsgivaren','Vänta på utbildning'],c:1},{q:'Digitalt redo jobbsökare?',o:['Kan bara sociala medier','Söker jobb, kommunicerar professionellt och använder arbetslivsverktyg','Bara IT-folk','Har iPhone'],c:2}],
pr:['Vilka digitala kompetenser saknar jag för [yrke]?','Bygg min digitala karriärplan för [bransch].','Hur syns jag bättre digitalt för rekryterare inom [bransch]?']}


];

var STUDIER=[
{id:'s0',icon:'🗺️',title:'Utbildningskartan',sub:'Vad finns i Studier-kategorin?',color:'#60a5fa',bc:'rgba(96,165,250,.3)',bg:'rgba(96,165,250,.07)',video:'/videos/s0-karta.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🎯',h:'Vad är syftet?',t:'Få överblick över hela det svenska utbildningssystemet — och hjälp att hitta var just du ska börja.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Alla utbildningsformer på en blick, snabba vägar jämfört med längre satsningar, och hur du hittar din egen startpunkt.'},
{icon:'✅',h:'När du är klar ska du...',t:'känna till de viktigaste utbildningsformerna och kunna peka ut var du ska börja — eller veta att en SYV kan hjälpa dig.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 5 minuter för film och de tre lektionerna, plus AI-övningen som kartlägger din startpunkt.'}
],
a:'Det svenska utbildningssystemet har fler ingångar för vuxna än de flesta länder. Den här modulen ger dig kartan.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen ger dig hela kartan över det svenska utbildningssystemet — utbildningsformerna, snabba vägar och längre satsningar. Se den först, så blir lektionerna lättare att följa.'},
{t:'Alla utbildningsformer på en blick',
cards:[
{icon:'🇸🇪',h:'SFI',t:'Lär dig svenska gratis.'},
{icon:'📚',h:'Komvux',t:'Komplettera betyg som vuxen.'},
{icon:'🏡',h:'Folkhögskola',t:'Studera i gemenskap.'},
{icon:'🎓',h:'YH',t:'Kortaste vägen till yrke — 1–2 år.'},
{icon:'📝',h:'Högskoleprovet',t:'Förbättrar din antagning till högskola.'},
{icon:'🌍',h:'Validering',t:'Erkänn en utbildning från utlandet.'}
],
a:'Det svenska utbildningssystemet erbjuder fler ingångar för vuxna än de flesta länder. Fri rörlighet, avgiftsfria alternativ och generöst CSN-stöd gör det möjligt att byta bana i alla åldrar. Ca 15% av vuxna saknar gymnasieexamen — Komvux och folkhögskola är inkörsportarna.'},
{t:'Snabba vägar vs. längre satsningar',
cards:[
{icon:'⚡',h:'Korta certifieringskurser',t:'1–8 veckor — direkt anställningsbar.'},
{icon:'🏗️',h:'Arbetsmarknadsutbildning',t:'Gratis via AF — du kan behålla ersättning.'},
{icon:'🎓',h:'YH — bästa kompromissen',t:'1–2 år, praktisk, med LIA inbyggd.'},
{icon:'📈',h:'Längre satsningar',t:'Komvux → universitet, eller folkhögskola för att hitta din riktning.'}
],
a:'Kortare praktiska utbildningar leder snabbare till arbete men ger lägre startlön. Akademiska utbildningar tar längre men ger bättre löneutveckling. YH är ofta den bästa kompromissen — praktisk, kort och direkt arbetsmarknadsanpassad.'},
{t:'Hitta din startpunkt',
cards:[
{icon:'💬',h:'Kan du svenska?',t:'Nej → börja med SFI.'},
{icon:'🎓',h:'Har du gymnasieexamen?',t:'Nej → Komvux.'},
{icon:'⚡',h:'Vill du jobba snabbt?',t:'→ Arbetsmarknadsutbildning eller korta kurser.'},
{icon:'🧭',h:'Vet du inte?',t:'Prata med en SYV — gratis. Det är den effektivaste investeringen du kan göra.'}
],
a:'SYV (Studie- och yrkesvägledare) finns gratis hos kommunen, Komvux och AF. Ett möte tar 30-60 min och är den effektivaste investeringen du kan göra. Boka via helsingborg.se eller studera.nu.'}
],
ex:{type:'ai-survey',title:'Kartlägg din startpunkt',desc:'Berätta om din situation och AI-SYV ger dig en personlig rekommendation om vilka moduler du ska börja med.'},
quiz:[{q:'Vad är YH-utbildning?',o:['4-årig universitetsutbildning','1-2 år arbetsmarknadsanpassad utbildning med praktik','En gymnasiekurs'],c:1},{q:'Vad är AMU?',o:['Gratis arbetsmarknadsutbildning via AF','En universitetsexamen','En avgiftsbelagd kurs'],c:0},{q:'Vilka utbildningar är gratis för vuxna?',o:['Komvux, SFI, YH och folkhögskola','Inga är gratis','Bara SFI'],c:0},{q:'Vad hjälper SYV med?',o:['Bara CV-skrivning','Bara för gymnasieelever','Utbildnings- och karriärplanering — gratis'],c:2},{q:'Vad är CSN?',o:['En utbildningsplattform','Myndigheten för studiestöd — bidrag och lån','En skola'],c:1}],
pr:['Vilken utbildning passar mig baserat på min bakgrund?','Hur snabbt kan jag nå arbete via utbildning?','Förklara skillnaden YH och Komvux på enkel svenska.']},

{id:'s1',icon:'🎓',title:'Vad är YH-utbildning?',sub:'Yrkeshögskola — snabbaste vägen till jobb',color:'#60a5fa',bc:'rgba(96,165,250,.3)',bg:'rgba(96,165,250,.07)',video:'/videos/yh-utbildning.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🎯',h:'Vad är syftet?',t:'Förstå vad en YH-utbildning är och varför den ofta är den snabbaste vägen till jobb. Du ska kunna avgöra om YH passar dig — och veta hur du tar nästa steg.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Vad yrkeshögskola är och hur den skiljer sig från universitet, vilka fördelar den ger, och hur du hittar och söker en utbildning som matchar ditt yrkesmål.'},
{icon:'✅',h:'När du är klar ska du...',t:'veta vad YH innebär, känna till LIA och studiemedel, och kunna hitta en konkret YH-utbildning på yrkeshogskolan.se som passar dig.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 5 minuter för film och de tre lektionerna. Lägg till några minuter för övningen där du själv letar fram en utbildning.'}
],
a:'YH — yrkeshögskola — är en eftergymnasial utbildningsform som styrs av arbetslivets behov. Den här modulen ger dig grunden för att förstå och välja en YH-utbildning.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen ger dig hela bilden av YH-utbildningar — vad de är, hur de är uppbyggda, vilka yrken som har starkast efterfrågan, och vanliga fallgropar att undvika. Se den först, så blir lektionerna lättare att följa.'},
{t:'Vad är en YH-utbildning?',
cards:[
{icon:'🎓',h:'Yrkeshögskola',t:'YH betyder yrkeshögskola — en eftergymnasial utbildning som är skapad direkt för arbetsmarknaden.'},
{icon:'⏱️',h:'Kort och fokuserad',t:'Oftast 1–2 år — betydligt kortare än ett universitet.'},
{icon:'🎯',h:'Riktad mot ett yrke',t:'Du läser exakt det du behöver för ett specifikt yrke — inget överflödigt.'}
],
a:'Yrkeshögskolan (YH) är en eftergymnasial utbildningsform som styrs av arbetslivets behov. Utbildningarna är arbetsmarknadsanpassade, ofta med hög andel LIA (Lärande i Arbete) och leder direkt till kvalificerade yrkesroller.'},
{t:'Fördelar med YH',
cards:[
{icon:'⏱️',h:'Kortare studietid',t:'Kortare än universitetet — du kommer ut i arbete snabbare.'},
{icon:'🤝',h:'Praktik ingår',t:'LIA — lärande i arbete — är praktik ute på ett företag, ofta din väg in till jobb.'},
{icon:'💼',h:'Bra jobbchanser',t:'En hög andel av de examinerade är i arbete kort efter examen.'},
{icon:'💰',h:'CSN och gratis',t:'Du kan få studiemedel från CSN, och det är gratis att söka och studera.'}
],
a:'YH-utbildningar har hög arbetsmarknadsrelevans. Ca 85% av examinerade studenter är i arbete inom 6 månader. LIA (Lärande i Arbete) ger praktisk erfarenhet och ofta direktkontakt med framtida arbetsgivare.'},
{t:'Hitta en YH-utbildning',
cards:[
{icon:'🔎',h:'yrkeshogskolan.se',t:'På Myndigheten för yrkeshögskolans sajt hittar du alla godkända YH-utbildningar.'},
{icon:'🧭',h:'Sök smart',t:'Filtrera på ort (t.ex. Helsingborg), yrke (t.ex. lagerlogistik) och starttid.'},
{icon:'📝',h:'Ansök via antagning.se',t:'Själva ansökan görs på antagning.se — kolla behörighetskraven för varje utbildning.'}
],
a:'På Myh.se (Myndigheten för yrkeshögskolan) hittar du alla godkända YH-utbildningar. Filtrera på ort, inriktning och distans/plats. Ansökan sker via antagning.se.'}
],
ex:{type:'build',title:'Hitta din YH-utbildning',desc:'Utforska YH och identifiera en utbildning som passar dig.',
fields:[
{l:'Vilket yrke är du intresserad av?',ph:'T.ex. logistiker, undersköterska, IT-tekniker...',hint:'Sök sedan på yrkeshogskolan.se'},
{l:'Hittade du en utbildning? Vilket namn?',ph:'T.ex. Logistik och Supply Chain Management'},
{l:'Hur lång är utbildningen och var?',ph:'T.ex. 2 år, Helsingborg, med LIA-perioder'},
{l:'Vad krävs för att söka?',ph:'T.ex. Gymnasieexamen och arbetslivserfarenhet...'}
],
links:[
{t:'Gå en yrkesutbildning',u:'https://helsingborg.se/forskola-och-utbildning/vuxenutbildning/',d:'Vuxenutbildning i Helsingborg — översikt och ansökan'},
{t:'Så här samarbetar vi med arbetsgivare i Helsingborg, service och vård',u:'https://helsingborg.se/forskola-och-utbildning/vuxenutbildning/utbildningar/yrkesutbildningar-pa-gymnasial-niva/',d:'Yrkesutbildningar på gymnasial nivå — Familjen Helsingborg'}
]},
quiz:[{q:'Vad är en YH-utbildning?',o:['En arbetsmarknadsanpassad yrkesutbildning','En universitetsutbildning','En gymnasieutbildning'],c:0},{q:'Hur lång är en typisk YH-utbildning?',o:['1-2 år','4-5 år','6 månader'],c:0},{q:'Vad är LIA?',o:['En typ av lärare','En ansökningssida','Lärande i Arbete — praktik'],c:2},{q:'Var hittar du YH-utbildningar?',o:['arbetsformedlingen.se','yrkeshogskolan.se','csn.se'],c:1},{q:'Kan du få CSN under YH?',o:['Bara om du arbetar parallellt','Ja, studiemedel betalas ut','Nej'],c:1}],
pr:['Vilka YH-utbildningar finns inom logistik i Skåne?','Vad krävs för att söka till en YH inom IT?','Förklara skillnaden mellan YH och universitet.']},

{id:'s2',icon:'📚',title:'Komvux',sub:'Läsa in gymnasiebetyg som vuxen',color:'#60a5fa',bc:'rgba(96,165,250,.3)',bg:'rgba(96,165,250,.07)',video:'/videos/s2-komvux.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🎯',h:'Vad är syftet?',t:'Förstå vad Komvux är och hur du kan använda det för att komplettera din utbildning som vuxen — på dina villkor.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Vad Komvux är och vad du kan läsa där, varför man läser på Komvux, och hur du ansöker steg för steg.'},
{icon:'✅',h:'När du är klar ska du...',t:'veta att Komvux är gratis och löpande, vad du kan läsa, och kunna göra en konkret ansökan till din kommun.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 4 minuter för film och de tre lektionerna, plus några minuter för övningen där du skissar din egen Komvux-plan.'}
],
a:'Komvux — kommunal vuxenutbildning — är en del av det offentliga skolväsendet och är avgiftsfritt. Den här modulen visar hur du kan använda det.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen ger dig hela bilden av Komvux — vad du kan läsa, varför, och hur du ansöker. Se den först, så blir lektionerna lättare att följa.'},
{t:'Vad är Komvux?',
cards:[
{icon:'🏛️',h:'Kommunal vuxenutbildning',t:'Komvux är en del av det offentliga skolväsendet — utbildning för dig som är vuxen.'},
{icon:'📚',h:'Tre saker du kan läsa',t:'Grundläggande kurser (motsvarar grundskolan), gymnasiekurser, och yrkesutbildningar.'},
{icon:'💛',h:'Gratis & flexibelt',t:'Det är avgiftsfritt, du kan börja när som helst, och du studerar i din egen takt.'}
],
a:'Komvux är en del av det offentliga skolväsendet. Det ger vuxna möjlighet att komplettera sin utbildning på grundläggande eller gymnasial nivå, eller läsa yrkesutbildningar. Utbildningen är avgiftsfri och du kan studera i din egen takt.'},
{t:'Varför läsa på Komvux?',
cards:[
{icon:'🎓',h:'Saknar gymnasieexamen',t:'Läs in det som fattas — i din egen takt.'},
{icon:'📈',h:'Behöver bättre betyg',t:'Höj ett betyg för att bli behörig till en utbildning eller ett jobb.'},
{icon:'🔄',h:'Vill byta yrke',t:'Komvux är ofta första steget mot en ny bana.'},
{icon:'🚪',h:'Öppnar dörrar',t:'Behörighet till YH, universitet och många jobb kräver godkänd gymnasieutbildning.'}
],
a:'Behörighet till YH, universitet och många arbeten kräver godkänd gymnasieutbildning. Komvux är det snabbaste sättet att komplettera betyg som vuxen och är anpassat för dem som jobbar eller har familj.'},
{t:'Hur ansöker du?',
cards:[
{icon:'🌐',h:'1 — Kommunens hemsida',t:'Gå till din kommuns hemsida och sök på "Komvux ansökan".'},
{icon:'📝',h:'2 — Fyll i & välj kurser',t:'Fyll i formuläret och välj de kurser du vill läsa.'},
{icon:'📅',h:'3 — Löpande ansökan',t:'Ansökan är löpande — du kan börja vid nästa terminsstart.'},
{icon:'📍',h:'I Skåne',t:'Skånevux samordnar vuxenutbildningen i regionen — sök på Skånevux.'}
],
a:'Ansökan görs direkt till kommunen. I Skåne kan du också titta på Skanevux.se som samordnar vuxenutbildning i regionen. Ansökan är löpande — du kan börja vid nästa terminsstart.'}
],
ex:{type:'komvux-ai',title:'Din Komvux-plan',desc:'Berätta om din situation och få förslag på kurser.',
fields:[
{l:'Vilken utbildning har du sedan tidigare?',ph:'T.ex. Gymnasieexamen delvis, SFI C-klar, ingen gymnasieexamen...'},
{l:'Vad vill du uppnå med Komvux?',ph:'T.ex. Söka YH inom IT, förbättra betyg i matte, läsa klart gymnasiet...'},
{l:'Kan du studera heltid eller deltid?',ph:'T.ex. Deltid 50% — jag jobbar parallellt'},
{l:'När vill du börja?',ph:'T.ex. Höstterminen 2026',hint:'Kolla ansökningsdatum på din kommuns sida.'}
]},
quiz:[{q:'Vad betyder Komvux?',o:['Kommunalt Vuxencenter','Kommunal Vuxenutbildning','Kompetens och Utbildning'],c:1},{q:'Är Komvux gratis?',o:['Ja, det är avgiftsfritt','Nej, det kostar','Bara om du är arbetslös'],c:0},{q:'Vad kan du läsa på Komvux?',o:['Grundläggande, gymnasiekurser och yrkesutbildning','Bara matematik','Bara universitetsförberedande'],c:0},{q:'Var hittar du Komvux i Helsingborg?',o:['komvux.se','skanevux.se','helsingborg.se/komvux'],c:2}],
pr:['Vilka Komvux-kurser behöver jag för att söka YH?','Hur snabbt kan jag läsa klart gymnasiet via Komvux?','Vad är skillnaden mellan Komvux och SFI?']},

{id:'s3',icon:'🇸🇪',title:'SFI — Svenska för invandrare',sub:'Lär dig svenska kostnadsfritt',color:'#60a5fa',bc:'rgba(96,165,250,.3)',bg:'rgba(96,165,250,.07)',video:'/videos/s3-sfi.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🎯',h:'Vad är syftet?',t:'Förstå vad SFI är, vilka nivåer som finns, och hur du lär dig svenska så snabbt som möjligt.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Vad SFI är och vad du lär dig, de tre studievägarna och kurserna A–D, samt konkreta tips för att lära dig svenska snabbare.'},
{icon:'✅',h:'När du är klar ska du...',t:'veta hur SFI är upplagt, vilken studieväg som passar dig, och ha en plan för att öva svenska även utanför klassrummet.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 4 minuter för film och de tre lektionerna, plus några minuter för övningen där du gör din egen svenska-plan.'}
],
a:'SFI — svenska för invandrare — är en kommunal, kostnadsfri utbildning i svenska. Den här modulen ger dig överblicken.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen ger dig hela bilden av SFI — vad det är, vilka nivåer som finns, och hur du lär dig snabbare. Se den först, så blir lektionerna lättare att följa.'},
{t:'Vad är SFI?',
cards:[
{icon:'🇸🇪',h:'Svenska för invandrare',t:'En gratis kurs för dig som är ny i Sverige och vill lära dig svenska.'},
{icon:'📖',h:'Läsa & skriva',t:'Du lär dig att läsa och skriva svenska.'},
{icon:'💬',h:'Prata & förstå',t:'Du lär dig att prata och att förstå.'},
{icon:'🏡',h:'Svenska i vardagen',t:'Du lär dig använda svenska i affären, hos läkaren och på jobbet.'}
],
a:'SFI är en kommunal utbildning som ger grundläggande kunskaper i svenska. Det finns tre studievägar (1-3) och kurserna A-D beroende på din bakgrund och tidigare utbildning.'},
{t:'Nivåer och studievägar',
cards:[
{icon:'1️⃣',h:'Studieväg 1',t:'För dig med lite skolbakgrund.'},
{icon:'2️⃣',h:'Studieväg 2',t:'För dig med ungefär gymnasienivå.'},
{icon:'3️⃣',h:'Studieväg 3',t:'För dig med högskoleutbildning.'},
{icon:'📊',h:'Kurser A–D',t:'Du testas och placeras på rätt nivå, och arbetar dig uppåt mot kurs D.'}
],
a:'SFI är indelad i kurserna A, B, C och D. Kurs D är den avancerade nivån. Avklarad SFI öppnar dörrar till Komvux Svenska som andraspråk och vidare studier på svenska.'},
{t:'Tips för att lära sig snabbare',
cards:[
{icon:'💬',h:'Prata varje dag',t:'Använd svenska lite varje dag — det är det som verkligen fungerar.'},
{icon:'📺',h:'TV & film',t:'Titta på svensk TV och film, gärna med undertexter.'},
{icon:'📰',h:'Läs enkelt',t:'Läs enkla nyheter, till exempel på sajten 8 sidor.'},
{icon:'📱',h:'Öva i mobilen',t:'Använd en språkapp som komplement till lektionerna.'}
],
a:'Forskning visar att kombinationen av formell undervisning och aktiv användning i vardagen ger snabbast resultat. SVT Play med undertexter och enkla nyhetssajter är utmärkta gratis resurser.'}
],
ex:{type:'build',title:'Din svenska-plan',desc:'Skapa en plan för att förbättra din svenska utanför klassrummet.',
fields:[
{l:'Vilken nivå är du på nu?',ph:'T.ex. SFI B, eller jag kan prata men inte skriva bra...'},
{l:'Hur många timmar per vecka kan du öva?',ph:'T.ex. 30 min varje dag — totalt 3.5 timmar/vecka'},
{l:'Vilka resurser ska du använda?',ph:'T.ex. Duolingo, SVT Play, prata med grannar...',hint:'Välj minst 2 metoder.'},
{l:'Ditt mål med svenska',ph:'T.ex. Klara SFI D, kommunicera på jobbet, hjälpa mina barn med läxor...'}
]},
quiz:[{q:'Vad är SFI?',o:['En yrkesutbildning','En avgiftsbelagd privatskola','Gratis svenska för invandrare'],c:2},{q:'Hur många studievägar finns det?',o:['3','2','5'],c:0},{q:'Vilket är bra för att öva svenska hemma?',o:['Undvika svenska','SVT Play, Duolingo och 8sidor.se','Bara läsa böcker på arabiska'],c:1},{q:'Vad händer när du klarar SFI D?',o:['Du kan läsa vidare på Komvux','Du måste sluta studera','Du måste ta ett nytt test'],c:0}],
pr:['Hur snabbt kan jag lära mig svenska med SFI?','Vilka appar hjälper mig lära mig svenska snabbast?','Skriv ett enkelt brev på svenska åt mig som övning.']},

{id:'s4',icon:'🏡',title:'Folkhögskola',sub:'Lärande i gemenskap',color:'#60a5fa',bc:'rgba(96,165,250,.3)',bg:'rgba(96,165,250,.07)',video:'/videos/s4-folkhogskola.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🏡',h:'Vad är syftet?',t:'Förstå om folkhögskolan passar dig — och hur den fungerar i det svenska systemet.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Vad folkhögskolan är, vilka kurser som finns, för vem den passar — och CSN-frågan.'},
{icon:'✅',h:'När du är klar ska du...',t:'kunna avgöra om folkhögskolan kan vara en väg framåt för dig.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 3 minuter för film och lektioner, plus en övning där du letar din skola.'}
],
a:'Folkhögskolan är en unik svensk skolform — fri, frivillig, ofta utan betyg, känd för sin inkluderande miljö.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom vad folkhögskolan är, vilka kurser som finns, för vem den passar och hur CSN fungerar. Se den först, så blir lektionerna lättare att följa.'},
{t:'Vad är folkhögskola?',
cards:[
{icon:'👥',h:'Studier i grupp',t:'Ofta utan betyg — fokus på lärande, inte konkurrens.'},
{icon:'🏡',h:'Internat eller pendling',t:'Du kan bo på skolan — eller åka dit.'},
{icon:'📚',h:'Allmän kurs',t:'Komplettera grundskola eller gymnasium.'},
{icon:'🎨',h:'Kreativt',t:'Musik, konst, foto, media, skrivande.'},
{icon:'🛠️',h:'Yrkesinriktat',t:'T.ex. socialpedagog eller behandlingsassistent.'}
],
a:'Det finns ca 150 folkhögskolor i Sverige. Pedagogiken är fri och frivillig — ofta driven av en folkrörelse.'},
{t:'För vem passar folkhögskola?',
cards:[
{icon:'🌿',h:'Lugn miljö',t:'Mindre stress, mer gemenskap.'},
{icon:'📖',h:'Komplettera betyg',t:'Du kan börja oavsett tidigare betyg.'},
{icon:'💭',h:'Haft svårt i vanlig skola',t:'Folkhögskolan har annorlunda pedagogik.'},
{icon:'🧭',h:'Söker din riktning',t:'Folkhögskolan är ett bra ställe att hitta vägen.'}
],
a:'Folkhögskolan är särskilt värdefull för dem som behöver struktur och gemenskap — eller söker en ny riktning.'},
{t:'CSN och folkhögskola',
cards:[
{icon:'💰',h:'Studiemedel gäller',t:'Bidrag + lån — precis som på Komvux eller universitet.'},
{icon:'📝',h:'Studieomdöme',t:'Istället för betyg — används vid vidare studier.'},
{icon:'🎓',h:'Ger behörighet',t:'Både till högskola och till YH-utbildning.'},
{icon:'🌐',h:'folkhogskola.nu',t:'Här hittar du alla folkhögskolor i Sverige.'}
],
a:'CSN-stöd ges från första månaden om utbildningen är minst 15 veckor och 50 % studietakt.'}
],
ex:{type:'build',title:'Hitta din folkhögskola',desc:'Utforska om folkhögskola passar dig.',
fields:[
{l:'Vilket ämne eller inriktning intresserar dig?',ph:'T.ex. Musik, media, allmän kurs, IT...'},
{l:'Vill du bo på skolan (internat) eller pendla?',ph:'T.ex. Pendla — jag bor i Helsingborg'},
{l:'Hittade du en folkhögskola? Vilket namn?',ph:'T.ex. Hvilan folkhögskola i Malmö'},
{l:'Vad vill du uppnå med folkhögskolestudier?',ph:'T.ex. Komplettera betyg och hitta min riktning...'}
]},
quiz:[
{q:'Vad är unikt med folkhögskola?',o:['Dyrt och exklusivt','Fri skolform, ofta utan traditionella betyg','Bara för unga under 20'],c:1},
{q:'Vad används istället för betyg?',o:['Poäng','Studieomdöme','Intyg'],c:1},
{q:'Kan du bo på folkhögskola?',o:['Aldrig','Ja, många har internat','Bara utländska studenter'],c:1},
{q:'Kan du få CSN på folkhögskola?',o:['Nej','Ja, studiemedel går att söka','Bara studiebidrag, inget lån'],c:1}
],
pr:['Vilka folkhögskolor finns nära Helsingborg?','Hur ansöker jag till folkhögskola?','Vad är skillnaden mellan folkhögskola och Komvux?']},

{id:'s5',icon:'💰',title:'CSN & studiebidrag',sub:'Finansiera dina studier',color:'#60a5fa',bc:'rgba(96,165,250,.3)',bg:'rgba(96,165,250,.07)',video:'/videos/s5-csn.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🎯',h:'Vad är syftet?',t:'Förstå hur du kan finansiera dina studier med CSN — så att ekonomin inte stoppar dig.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Vad CSN är och hur bidrag och lån fungerar, ungefär hur mycket du kan få, och hur du ansöker steg för steg.'},
{icon:'✅',h:'När du är klar ska du...',t:'veta skillnaden mellan bidrag och lån, ha en känsla för beloppen, och kunna göra en ansökan på csn.se.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 4 minuter för film och de tre lektionerna, plus några minuter för övningen där du räknar på din egen CSN.'}
],
a:'CSN — Centrala studiestödsnämnden — administrerar det svenska studiestödssystemet. Den här modulen ger dig grunden för att planera din studieekonomi.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen ger dig hela bilden av CSN — bidrag och lån, beloppen, och hur du ansöker. Se den först, så blir lektionerna lättare att följa.'},
{t:'Vad är CSN?',
cards:[
{icon:'🏛️',h:'Centrala studiestödsnämnden',t:'CSN betalar ut pengar till dig när du studerar.'},
{icon:'🎁',h:'Bidrag',t:'Pengar du inte behöver betala tillbaka — ungefär en tredjedel av studiemedlet.'},
{icon:'🏦',h:'Lån',t:'Pengar du lånar och betalar tillbaka senare, med låg ränta under lång tid.'}
],
a:'CSN administrerar det svenska studiestödssystemet. Studiemedel består av bidragsdelen (ca 1/3) och lånedelen (ca 2/3). Lånet betalas tillbaka med låg ränta under lång tid.'},
{t:'Vad kan du få?',
cards:[
{icon:'🎁',h:'Bidrag',t:'Cirka 3 400 kr per månad vid heltidsstudier (2026, ungefärligt).'},
{icon:'🏦',h:'Lån',t:'Cirka 7 900 kr per månad — du väljer själv om du vill ta det.'},
{icon:'💰',h:'Totalt',t:'Tillsammans runt 11 300 kr per månad vid heltid.'},
{icon:'⚖️',h:'Beror på',t:'Beloppet påverkas av ålder, studietakt och om du har barn.'}
],
a:'Beloppet beror på ålder, studietakt och om du har barn. Du kan ta ut 1/4, 1/2, 3/4 eller heltid. Bidragsdelen kräver ingen återbetalning. Lånedelen återbetalas från det år du tjänar över gränsen.'},
{t:'Hur ansöker du?',
cards:[
{icon:'🌐',h:'1 — csn.se',t:'Gå till csn.se och logga in med BankID.'},
{icon:'📝',h:'2 — Studiemedel',t:'Välj Studiemedel och fyll i uppgifter om din utbildning.'},
{icon:'📅',h:'3 — Per termin',t:'Du ansöker en gång per termin — ansökan öppnar oftast två månader innan start.'},
{icon:'🎯',h:'Studera i rätt takt',t:'Du måste studera i den takt du ansökt om — annars kan CSN kräva tillbaka pengar.'}
],
a:'Ansökan öppnar normalt 2 månader innan terminsstart. Du behöver intyg från skolan. Pengarna betalas ut månadsvis. Viktigt: du måste studera i den takt du ansökt om — annars kan CSN kräva tillbaka pengar.'}
],
ex:{type:'build',title:'Räkna på din CSN',desc:'Beräkna vad du kan få och planera din ekonomi.',
fields:[
{l:'Vilken utbildning planerar du?',ph:'T.ex. YH-utbildning 2 år heltid i Helsingborg'},
{l:'Heltid eller deltid?',ph:'T.ex. Heltid 100% — jag kan inte jobba parallellt'},
{l:'Har du andra inkomster under studietiden?',ph:'T.ex. Nej / Ja, jobbar extra ca 2000 kr/mån',hint:'För mycket inkomst påverkar CSN!'},
{l:'Hur stor del av lånet vill du ta?',ph:'T.ex. Hela lånet, eller bara bidragsdelen...',hint:'Lånet återbetalas — tänk noga!'}
]},
quiz:[
{q:'Vad betyder CSN?',o:['Central Skolnämnd','Centrala studiestödsnämnden','Centrum för Studienätverk'],c:1},
{q:'Vilket måste du betala tillbaka?',o:['Bidraget','Lånet','Båda'],c:1},
{q:'Hur ansöker du om CSN?',o:['På kommunens kontor','Via csn.se med BankID','Via din skola'],c:1},
{q:'Vad händer om du inte studerar i rätt takt?',o:['Ingenting','CSN kan kräva tillbaka pengar','Du får mer bidrag'],c:1},
{q:'Kan du välja att bara ta bidraget?',o:['Nej, du måste ta båda','Ja, lånet är frivilligt','Bara om du är under 25'],c:1}
],
pr:['Hur mycket CSN kan jag få för en YH-utbildning heltid?','Vad händer med CSN om jag jobbar extra?','Förklara hur CSN-lånet återbetalas.']},

{id:'s6',icon:'📝',title:'Söka utbildning',sub:'Steg-för-steg ansökan',color:'#60a5fa',bc:'rgba(96,165,250,.3)',bg:'rgba(96,165,250,.07)',video:'/videos/s6-utbildning.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'📝',h:'Vad är syftet?',t:'Lära dig söka till en utbildning — steg för steg, hela vägen till en plats.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Antagning.se, ansökningsprocessens sex steg, och hur meritvärde och urval fungerar.'},
{icon:'✅',h:'När du är klar ska du...',t:'kunna göra en konkret ansökningsplan med rätt datum.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 4 minuter för film och lektioner, plus en övning där du gör din egen ansökningsplan.'}
],
a:'Antagning.se hanteras av Universitets- och högskolerådet. Den här modulen tar dig genom hela ansökan.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom Antagning.se, ansökningsprocessen steg för steg, och hur meritvärde och urval fungerar. Se den först, så blir lektionerna lättare att följa.'},
{t:'Antagning.se',
cards:[
{icon:'🎓',h:'Universitet & högskola',t:'Här söker du till högskoleutbildningar i hela Sverige.'},
{icon:'🛠️',h:'YH-utbildningar',t:'Många yrkeshögskoleutbildningar söks också via Antagning.se.'},
{icon:'💸',h:'Gratis att söka',t:'Du kan söka upp till 20 utbildningar per antagningsomgång.'}
],
a:'Antagning.se hanteras av Universitets- och högskolerådet (UHR). Urval sker via meritvärde — betyg eller högskoleprov.'},
{t:'Ansökningsprocessen',
cards:[
{icon:'1️⃣',h:'Skapa konto & sök',t:'Skapa konto på antagning.se och sök de utbildningar du vill ha.'},
{icon:'2️⃣',h:'Bifoga & skicka in',t:'Bifoga betyg och dokument — skicka in i tid.'},
{icon:'3️⃣',h:'Besked & svar',t:'Vänta på besked, och svara sedan ja eller nej till din plats.'}
],
a:'Viktiga datum: vårens antagning — sista ansökan 15 april. Höstens antagning — sista ansökan 15 oktober. Kontrollera alltid datumet för just din utbildning.'},
{t:'Meritvärde och urval',
cards:[
{icon:'🅰️',h:'A = 20 poäng',t:'Högsta betyget. E ger 10 poäng — godkänt. B, C och D ligger däremellan.'},
{icon:'✏️',h:'Högskoleprovet',t:'Kan ge extra poäng om dina betyg inte räcker hela vägen.'},
{icon:'💼',h:'Arbetslivserfarenhet',t:'Kan ge meritpoäng — upp till 2,5 extra poäng på betyget.'}
],
a:'Urvalsgrupper: betygsurval (BG) och högskoleprovurval (HP). Du tävlar i den grupp där du står starkast.'}
],
ex:{type:'build',title:'Din ansökningsplan',desc:'Planera din utbildningsansökan steg för steg.',
fields:[
{l:'Vilken/vilka utbildningar söker du?',ph:'T.ex. YH Logistik i Helsingborg, Komvux Matte 1a...',ta:true},
{l:'Vad är sista ansökningsdatum?',ph:'T.ex. 15 april 2026',hint:'Kolla alltid datumet för just din utbildning!'},
{l:'Vilka dokument behöver du?',ph:'T.ex. Gymnasiebetyg, ID-handling, arbetsintygAnmälan...',ta:true},
{l:'Vad är din plan B om du inte kommer in?',ph:'T.ex. Söka till Komvux och förbättra betygen...'}
]},
quiz:[
{q:'Vad är antagning.se?',o:['En jobbsajt','Sveriges officiella ansökningssajt för utbildning','En betygssajt'],c:1},
{q:'Vad är sista ansökningsdag på våren?',o:['1 mars','15 april','30 maj'],c:1},
{q:'Vad ger betyget A i meritvärde?',o:['15 poäng','20 poäng','25 poäng'],c:1},
{q:'Hur många utbildningar kan du söka?',o:['5','20','Obegränsat'],c:1}
],
pr:['Hur räknar jag ut mitt meritvärde?','Vad krävs för att komma in på YH-utbildning i logistik?','Hjälp mig skriva ett personligt brev för min ansökan.']},

{id:'s7',icon:'🌍',title:'Validering av utbildning',sub:'Erkänn din utbildning från utlandet',color:'#60a5fa',bc:'rgba(96,165,250,.3)',bg:'rgba(96,165,250,.07)',video:'/videos/s7-validering.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🌍',h:'Vad är syftet?',t:'Få din utländska utbildning erkänd i Sverige — och visa vad du kan.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Vad validering är, UHR-processen steg för steg, och reglerade yrken.'},
{icon:'✅',h:'När du är klar ska du...',t:'veta exakt var du börjar — och hur lång tid det tar.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 3 minuter för film och lektioner, plus en planeringsövning.'}
],
a:'Tjänsten är gratis. Din utbildning är värd något — få den erkänd så öppnas dörrarna.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom vad validering är, UHR:s process steg för steg, och vad som gäller för reglerade yrken som vård och utbildning. Se den först, så blir lektionerna lättare att följa.'},
{t:'Vad är validering?',
cards:[
{icon:'📜',h:'Officiell bedömning',t:'Examen, kurser och betyg granskas.'},
{icon:'🇸🇪',h:'Jämförs med svenskt',t:'Du får veta vad det motsvarar.'},
{icon:'✅',h:'Du får ett utlåtande',t:'Att visa upp vid jobb och studier.'},
{icon:'🆓',h:'Tjänsten är gratis',t:'Du betalar inget för bedömningen.'}
],
a:'UHR (Universitets- och högskolerådet) hanterar erkännande av utländsk utbildning i Sverige.'},
{t:'Processen steg för steg',
cards:[
{icon:'1️⃣',h:'Samla dokument',t:'Examensbevis, betyg, kursplaner.'},
{icon:'2️⃣',h:'Översätt vid behov',t:'Till svenska eller engelska.'},
{icon:'3️⃣',h:'Ansök på uhr.se',t:'Eller hos rätt myndighet.'},
{icon:'4️⃣',h:'Vänta 2–6 månader',t:'Vanlig handläggningstid.'},
{icon:'5️⃣',h:'Använd utlåtandet',t:'I CV och vid jobbansökan.'}
],
a:'Börja samla dokument tidigt — det är den del du själv kan påverka.'},
{t:'Reglerade yrken',
cards:[
{icon:'👨‍⚕️',h:'Vård',t:'Socialstyrelsen utfärdar legitimation.'},
{icon:'👨‍🏫',h:'Lärare',t:'Skolverket prövar behörighet.'},
{icon:'⚖️',h:'Andra reglerade yrken',t:'Jurist, ingenjör, m.fl. — egna myndigheter.'},
{icon:'⏳',h:'Räkna med 6–12 mån',t:'Reglerade yrken tar längre — börja tidigt.'}
],
a:'Reglerade yrken kräver ofta kompletteringskurser eller praktik. Kolla på respektive myndighets webbplats.'}
],
ex:{type:'build',title:'Din valideringsplan',desc:'Kartlägg din utländska utbildning och planera nästa steg.',
fields:[
{l:'Vilken utbildning har du från ditt hemland?',ph:'T.ex. Kandidatexamen i ekonomi, 3 år, Syrien 2015'},
{l:'Vilket yrke vill du ha i Sverige?',ph:'T.ex. Ekonom, lärare, IT-tekniker...'},
{l:'Är ditt yrke reglerat i Sverige?',ph:'T.ex. Nej — inte lagerarbetare / Ja — sjuksköterska kräver legitimation',hint:'Kolla på uhr.se'},
{l:'Vad är ditt nästa steg?',ph:'T.ex. Ansöka om utlåtande från UHR, kontakta Socialstyrelsen...'}
]},
quiz:[
{q:'Vad är validering?',o:['Att lära sig svenska','Erkänna utländsk utbildning i Sverige','En typ av körkort'],c:1},
{q:'Vilken myndighet hanterar erkännande?',o:['Arbetsförmedlingen','UHR — Universitets- och högskolerådet','CSN'],c:1},
{q:'Vad är ett reglerat yrke?',o:['Ett välbetalt yrke','Yrke som kräver godkänd legitimation','Yrke utan utbildningskrav'],c:1},
{q:'Var hittar du mer info?',o:['csn.se','uhr.se','komvux.se'],c:1}
],
pr:['Hur erkänner jag min läkarexamen från Syrien i Sverige?','Vilka yrken är reglerade i Sverige?','Hjälp mig skriva till UHR om min utbildning.']},

{id:'s8',icon:'💻',title:'Distans & online-kurser',sub:'Studera var du vill och när du vill',color:'#60a5fa',bc:'rgba(96,165,250,.3)',bg:'rgba(96,165,250,.07)',video:'/videos/s8-distans.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'💻',h:'Vad är syftet?',t:'Förstå distansutbildning — och om den passar dig.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Vad distans är, för vem den passar, plattformarna, och tips för att lyckas.'},
{icon:'✅',h:'När du är klar ska du...',t:'kunna bedöma om distans är rätt väg för dig.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 3 minuter för film och lektioner.'}
],
a:'Distansutbildning har likvärdig kvalitet med campusutbildning — samma examen.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen går igenom vad distansutbildning är, friheten den ger, plattformarna och tips för att lyckas. Se den först.'},
{t:'Vad är distansutbildning?',
cards:[
{icon:'🌐',h:'Studier på nätet',t:'Inte i klassrum — du loggar in.'},
{icon:'📍',h:'Du väljer var',t:'Hemma, café eller bibliotek.'},
{icon:'⏰',h:'Du väljer när',t:'Schemat är flexibelt i de flesta fall.'},
{icon:'👨‍👩‍👧',h:'Passar familj eller jobb',t:'Du anpassar studierna till livet.'}
],
a:'Plattformar du möter: Studium, Canvas, Ping Pong. De flesta svenska lärosäten erbjuder distansvarianter.'},
{t:'För vem passar distans?',
cards:[
{icon:'👨‍👩‍👧',h:'Föräldrar',t:'Studera när barnen sover.'},
{icon:'💼',h:'Deltidsarbetare',t:'Plugga vid sidan av jobbet.'},
{icon:'🌾',h:'Bor på liten ort',t:'Långt från campus.'},
{icon:'🆓',h:'Vill ha flexibilitet',t:'Anpassa till resor eller annat.'}
],
a:'CSN och studiemedel fungerar likadant för distansutbildningar — bidrag och lån finns att söka.'},
{t:'Tips för att lyckas',
cards:[
{icon:'🕐',h:'Fasta studietider',t:'Annars rinner det ut.'},
{icon:'👥',h:'Hitta studiekompisar',t:'På nätet — du behöver kontakt.'},
{icon:'💬',h:'Lärarens kontorstid',t:'Vanligen lika öppen som på campus — använd den.'},
{icon:'🏠',h:'En egen studieplats',t:'Hjälper hjärnan att fokusera.'}
],
a:'Sök på antagning.se för utbildningar på distans — filtrera "distansutbildning" och välj din kurs.'}
],
ex:{type:'build',title:'Din online-studieplan',desc:'Planera hur du lär dig nytt på distans.',
fields:[
{l:'Vad vill du lära dig online?',ph:'T.ex. Python-programmering, Excel, engelska, bokföring...'},
{l:'Vilken plattform ska du använda?',ph:'T.ex. YouTube + Coursera',hint:'Välj max 2 plattformar.'},
{l:'Hur många timmar per vecka?',ph:'T.ex. 5 timmar — 1 timme varje vardagskväll'},
{l:'Vilket är ditt mål och deadline?',ph:'T.ex. Klart certifikat inom 3 månader',hint:'Sätt ett konkret datum!'}
]},
quiz:[
{q:'Vad är distansutbildning?',o:['Utbildning utomlands','Studera online utan att vara på plats','Kvällsskola'],c:1},
{q:'Vilken är en gratis utbildningsplattform?',o:['LinkedIn','Khan Academy','Glassdoor'],c:1},
{q:'Vad är MOOC?',o:['En studieapp','Massive Open Online Courses','En typ av examen'],c:1},
{q:'Vad är viktigast för att lyckas med distans?',o:['Snabb dator','Disciplin och tydlig studieplan','Tyst miljö'],c:1}
],
pr:['Vilka gratis kurser rekommenderar du för [ämne]?','Skapa en 3-månaders studieplan för att lära mig Python.','Vad ger bäst chans till jobb — certifikat från Coursera eller Komvux?']},

{id:'s9',icon:'🏭',title:'Praktik & APL',sub:'Lär dig på jobbet',color:'#60a5fa',bc:'rgba(96,165,250,.3)',bg:'rgba(96,165,250,.07)',
lessons:[
{t:'Vad är praktik och APL?',
s:'Praktik = du jobbar på ett riktigt företag för att lära dig.\n\nAPL = Arbetsplatsförlagt Lärande.\nDet är praktik som ingår i en utbildning.\n\nDu lär dig:\n• Hur det fungerar på riktiga jobb\n• Kontakter i branschen\n• Vad du verkligen gillar',
a:'APL är en obligatorisk del av många YH- och gymnasieutbildningar (kallas LIA i YH-sammanhang). Praktikperioder varierar från veckor till månader. De är ett utmärkt sätt att visa sin kompetens och ofta leder till anställning.',
yt:'https://www.youtube.com/embed/dQw4w9WgXcQ'},
{t:'Hitta praktikplats',
s:'Sätt att hitta praktik:\n\n1. Fråga ditt nätverk\n2. Ring företag direkt\n3. LinkedIn — "praktik" eller "LIA"\n4. Platsbanken\n5. Via din skola/utbildare\n\nVara proaktiv — vänta inte!',
a:'Nätverket är den effektivaste kanalen. Spontanansökningar fungerar bra eftersom få söker LIA via traditionella kanaler. Ett välformulerat brev som visar din motivation har stor chans att lyckas.'},
{t:'Maximera din praktik',
s:'Under praktiken:\n\n✅ Kom i tid — alltid\n✅ Ställ frågor\n✅ Ta initiativ\n✅ Bygg relationer\n✅ Be om feedback\n✅ Be om referens i slutet',
a:'Praktiken är en förlängd jobbintervju. Studier visar att 40-60% av LIA-studenter erbjuds anställning av praktikföretaget. Att skriva dagbok eller portfolio under praktiken stärker din profil.'}
],
ex:{type:'build',title:'Din praktikansökan',desc:'Förbered dig för att hitta en praktikplats.',
fields:[
{l:'Vilket företag eller bransch vill du ha praktik i?',ph:'T.ex. Lagerföretag i Helsingborg, restaurang, IT-företag...'},
{l:'Skriv en kort motivering (varför just dem?)',ph:'T.ex. Jag är intresserad av er verksamhet och vill lära mig mer om logistik...',ta:true,hint:'Var specifik — nämn företaget!'},
{l:'Vad vill du lära dig under praktiken?',ph:'T.ex. Truckkörning, kundkontakt, programmeringsprojekt...'},
{l:'Vem i ditt nätverk kan hjälpa dig?',ph:'T.ex. Min granne jobbar på IKEA, min handläggare känner X...',hint:'Nätverket är guld!'}
]},
quiz:[
{q:'Vad är APL?',o:['En app','Arbetsplatsförlagt Lärande','Avancerad Praktisk Lektion'],c:1},
{q:'Vad heter APL i YH-utbildningar?',o:['LIA','APU','OPL'],c:1},
{q:'Hur hittar du praktik effektivt?',o:['Vänta på skolan','Nätverka och ta kontakt direkt','Bara Platsbanken'],c:1},
{q:'Vad bör du göra sist på praktiken?',o:['Ingenting','Be om referens och tacka','Skicka CV'],c:1}
],
pr:['Skriv ett spontanbrev för praktikansökan inom logistik.','Hur nätverkar jag för att hitta LIA-plats?','Vad ska jag säga när jag ringer ett företag för praktik?']},

{id:'s10',icon:'🗺️',title:'Din studieväg',sub:'Planera din utbildning smart',color:'#60a5fa',bc:'rgba(96,165,250,.3)',bg:'rgba(96,165,250,.07)',
lessons:[
{t:'Varför planera sin studieväg?',
s:'En plan hjälper dig att:\n• Välja rätt utbildning\n• Spara tid och pengar\n• Nå ditt mål snabbare\n• Undvika att börja om från början\n\nIngen plan = slumpen bestämmer.',
a:'Karriärplanering kombinerat med utbildningsplanering ökar sannolikheten att nå sitt mål med 3-4x. Tydliga mål, kartlagd bakgrund och konkret handlingsplan är grundelementen.',
yt:'https://www.youtube.com/embed/dQw4w9WgXcQ'},
{t:'Kartl\u00e4gg din startpunkt',
s:'Ställ dig dessa frågor:\n\n1. Vilken utbildning har jag?\n2. Vad saknar jag?\n3. Vad vill jag jobba med?\n4. Hur lång tid har jag?\n5. Hur ser min ekonomi ut?',
a:'En kompetenskartläggning är grunden för all utbildningsplanering. Validering, CVmatchen och Arbetsförmedlingens verktyg kan hjälpa dig identifiera gap mellan din nuläge och önskad position.'},
{t:'Skapa din plan',
s:'Din studieväg kan se ut så:\n\nSteg 1: SFI (om nödvändigt)\nSteg 2: Komvux — komplettera betyg\nSteg 3: YH-utbildning 1-2 år\nSteg 4: Jobb + vidareutbildning\n\nAlla steg behövs inte — hoppa in där du passar!',
a:'Studievägen ska vara realistisk och anpassad till din livssituation. CSN, bostadsbidrag och kommunala stöd kan finansiera hela resan. Kontakta Studie- och yrkesvägledare (SYV) på din kommun — det är gratis!'}
],
ex:{type:'build',title:'Bygg din personliga studieväg',desc:'Skapa en konkret plan från idag till ditt drömjobb.',
fields:[
{l:'Var är du nu? (utbildning + situation)',ph:'T.ex. SFI C klar, söker jobb, vill bli undersköterska...',ta:true},
{l:'Var vill du vara om 3 år?',ph:'T.ex. Fast jobb som logistiker med YH-examen',hint:'Var konkret — titeln och branschen.'},
{l:'Vilka steg behöver du ta?',ph:'Steg 1: \nSteg 2: \nSteg 3: ',ta:true,hint:'Max 3-4 tydliga steg.'},
{l:'Vad är ditt första steg — den här veckan?',ph:'T.ex. Söka till Komvux Matte 1a och boka möte med SYV',hint:'Börja nu — ett litet steg!'}
]},
quiz:[
{q:'Varför planera sin studieväg?',o:['Det behövs inte','Sparar tid, pengar och ökar chansen att nå målet','Handläggaren kräver det'],c:1},
{q:'Vad är SYV?',o:['En studieapp','Studie- och yrkesvägledare','En YH-utbildning'],c:1},
{q:'Hur kan du finansiera din studieväg?',o:['Omöjligt som vuxen','CSN, bidrag och kommunalt stöd','Bara med eget sparande'],c:1},
{q:'Vad är en kompetenskartläggning?',o:['Ett betyg','Analys av vad du kan och vad du saknar','En ansökan'],c:1}
],
pr:['Skapa en 3-årig studieplan för att bli [yrke].','Vilken utbildningsväg är snabbast till undersköterska?','Vad erbjuder Arbetsförmedlingen för utbildningsstöd?']},
{id:'s11',icon:'HP',title:'Hogskoleprovet',sub:'Forbattra chanserna till hogskola',color:'#60a5fa',bc:'rgba(96,165,250,.3)',bg:'rgba(96,165,250,.07)',
lessons:[
{t:'Vad ar Hogskoleprovet?',
s:'Hogskoleprovet (HP) ar ett prov du kan gora for att forbattra dina chanser till universitetet.\n\n- Kostar 450 kr\n- Ges 2 ganger/ar (var + host)\n- Gor hur manga ganger du vill\n- Basta resultatet raknas alltid\n\nAnmal dig pa: studera.nu',
a:'HP ar ett nationellt urvalsprov (UHR). Provbetyg 0.00-2.00. Ca 30 procent av platser ga via HP-urval. Parallellt med betygsurval.',
yt:'https://www.youtube.com/embed/dQw4w9WgXcQ'},
{t:'Vad testas?',
s:'VERBAL (sprak):\n- ORD: ordfOrstaelse\n- LAS: lasforstaelse\n- SVT: svensk text\n- ELF: engelsk text\n\nKVANTITATIV (matte+logik):\n- KVA: jamforelser\n- XYZ: problemlosning\n- DTK: diagram/tabeller\n- NOG: logik\n\nMax: 2.00 poang',
a:'Mater allman studieformaga. Verbal och kvantitativ vager lika. Traning kan forbattra resultatet med 0.2-0.4 poang i snitt.'},
{t:'Forberedelse',
s:'Gratis:\n- hp.studera.nu (officiell ovningssida)\n- Gamla prov online\n- YouTube: sok HP-tips\n- Biblioteket har bocker\n\nBetalt:\n- Kurser, Hermods, appar\n\nBorja minst 3 manader i forvag!',
a:'Effektivaste: gamla prov under tidspress, analysera felsvar, ova svaga delar. Tidsstrategi avgOrande - hoppa svara fragor och aterkom.'}
],
ex:{type:'build',title:'Din HP-plan',desc:'Planera forberedelsen for Hogskoleprovet.',
fields:[
{l:'Nar gor du provet?',ph:'T.ex. Hostprovet oktober 2026',hint:'Anmal pa studera.nu - stanger ca 3 veckor innan!'},
{l:'Nulage och mal',ph:'T.ex. Vet inte nulage - vill na 1.2 for YH'},
{l:'Svagaste delmoment',ph:'T.ex. NOG och LAS',hint:'Lagg mest tid har!'},
{l:'Traningsplan',ph:'T.ex. 5 tim/vecka: 30 min varje kväll + gammalt prov pa lordag',ta:true},
{l:'Resurser',ph:'T.ex. hp.studera.nu, gamla prov, YouTube-forklaringar',hint:'Val 2-3 och hall dig till dem.'}
]},
quiz:[
{q:'Vad kostar HP-anmalan?',o:['Gratis','450 kr','1000 kr'],c:1},
{q:'Hur manga ganger kan du gora HP?',o:['Max 3','Max 5','Obegransat'],c:1},
{q:'Vilket resultat raknas?',o:['Sista','Snittet','Basta'],c:1},
{q:'Hur ofta ges HP?',o:['1 gang/ar','2 ganger/ar','Varje kvartal'],c:1},
{q:'Var anmaler du dig?',o:['antagning.se','studera.nu','csn.se'],c:1},
{q:'Max-poang pa HP?',o:['1.00','2.00','5.00'],c:1}
],
pr:['Ge mig ett 3-manadersschema for HP.','Forklara NOG pa enkel svenska med exempel.','Vilket HP-betyg kravs for [utbildning]?']},
{id:'s12',icon:'🏗️',title:'Arbetsmarknadsutbildning',sub:'Gratis utbildning via AF — direkt till jobb',color:'#60a5fa',bc:'rgba(96,165,250,.3)',bg:'rgba(96,165,250,.07)',
lessons:[
{t:'Vad är AMU?',
s:'AMU = Arbetsmarknadsutbildning.\n\nDet är en gratis utbildning som du söker via Arbetsförmedlingen.\n\nViktigt:\n✅ Helt gratis\n✅ Du behåller din ersättning under utbildningen\n✅ Leder direkt till jobb inom branschen\n✅ Kortare än YH — ofta 4-24 veckor',
a:'AMU är upphandlade utbildningar som AF köper av privata utbildningsföretag. De styrs av arbetsmarknadens behov. Du måste vara inskriven på AF och ha en handläggare som bedömer att utbildningen är rätt för dig. Ersättning: aktivitetsstöd, etableringsersättning eller utvecklingsersättning utgår.'},
{t:'Vad kan du utbilda dig till?',
s:'Vanliga AMU-utbildningar:\n\n🚛 Truck A+B (3-6 veckor)\n🏥 Undersköterska/vårdbiträde\n🏗️ Bygg & anläggning\n💻 IT-support & nätverk\n🔒 Väktare & säkerhet\n🍳 Kök & livsmedelshygien\n🚗 Yrkestrafik/taxi\n\nTillgång beror på var du bor och vad AF bedömer.',
a:'Utbudet varierar per region och period. AF upphandlar utbildningar baserat på lokalt arbetsmarknadsbehov. Vissa utbildningar har krav på förkunskaper (t.ex. B-körkort för truck). Fråga din handläggare om vad som är tillgängligt i ditt område just nu.'},
{t:'Hur söker du AMU?',
s:'1. Prata med din handläggare på AF\n2. Be om en AMU-utbildning inom ditt mål-yrke\n3. Handläggaren bedömer och godkänner\n4. Du anvisas till utbildningen\n\n→ Du kan inte söka direkt själv — det går via AF.\n\nLänk: arbetsformedlingen.se',
a:'AMU är ett myndighetsbeslut, inte en vanlig ansökan. Handläggaren avgör om du är aktuell baserat på din situation, arbetsmarknadens behov och tillgängliga platser. Var proaktiv — fråga specifikt om AMU och nämn vilket yrke du siktar mot.'}
],
ex:{type:'build',title:'Förbered din AMU-ansökan',desc:'Planera vad du ska säga till din handläggare.',
fields:[
{l:'Vilket yrke/bransch vill du jobba inom?',ph:'T.ex. lager/truck, vård, bygg, IT...'},
{l:'Varför passar du för det yrket?',ph:'T.ex. Jag har tidigare jobbat med... och är intresserad av...',ta:true,hint:'Handläggaren behöver höra din motivation!'},
{l:'Har du några förkunskaper som hjälper?',ph:'T.ex. Körkort B, erfarenhet av tunga lyft, vana av kundkontakt...'},
{l:'Vad ska du säga på mötet med AF?',ph:'T.ex. Jag vill söka AMU inom truck eftersom...',ta:true,hint:'Öva meningen högt — var konkret och bestämd.'}
]},
quiz:[
{q:'Vad kostar en AMU-utbildning?',o:['Samma som YH','Gratis','Ca 5000 kr'],c:1},
{q:'Hur söker du AMU?',o:['Direkt på arbetsformedlingen.se','Via din handläggare på AF','Via antagning.se'],c:1},
{q:'Behåller du ersättningen under AMU?',o:['Nej, ingen ersättning','Ja, ersättningen fortsätter','Bara halv ersättning'],c:1},
{q:'Hur lång är en typisk AMU?',o:['3-5 år','4-24 veckor','2 dagar'],c:1},
{q:'Vad styr utbudet av AMU?',o:['Vad du vill','Arbetsmarknadens behov lokalt','Skolverket'],c:1}
],
pr:['Hjälp mig argumentera för AMU inom truck hos min handläggare.','Vilka AMU-utbildningar finns inom vård i Skåne?','Hur förbereder jag mig inför mötet med AF om AMU?']},

{id:'s13',icon:'🎓',title:'Universitet & Högskola',sub:'Kandidat, master och akademisk frihet',color:'#60a5fa',bc:'rgba(96,165,250,.3)',bg:'rgba(96,165,250,.07)',
lessons:[
{t:'Vad är ett universitet?',
s:'Ett universitet är den högsta utbildningsnivån i Sverige.\n\nDu väljer själv:\n• Vilka kurser du läser\n• I vilken ordning\n• Hur snabbt du studerar\n\nDetta kallas "fri rörlighet" — du sätter ihop din egen utbildning.',
a:'Universitet och högskolor är statliga lärosäten. Skillnaden: universitet har rätt att utfärda doktorsexamen, högskolor vanligtvis inte. Fri rörlighet innebär att du kan byta program, pausa, återuppta och kombinera kurser från olika lärosäten.'},
{t:'Kandidat, magister och master',
s:'📘 Kandidatexamen = 3 år (180 hp)\nGrundnivå. Ditt första universitetsbevis.\n\n📗 Magisterexamen = 1 år på kandidat (60 hp)\nFördjupning i ett ämne.\n\n📙 Masterexamen = 2 år på kandidat (120 hp)\nDjupare forskning och analys.\n\n🔬 Doktorsexamen = 4-5 år forskning',
a:'HP = högskolepoäng. Heltidsstudier = 60 hp/år. Examenskrav: kandidat kräver minst 90 hp i huvudämnet, masterexamen kräver 60 hp fördjupningskurser. Många arbetsgivare kräver kandidat som lägsta nivå för kvalificerade tjänster.'},
{t:'Campus vs distans',
s:'🏫 Campus:\n• Du är på plats på universitetet\n• Föreläsningar & gruparbeten\n• Kräver att du bor nära\n\n💻 Distans:\n• Studerar hemifrån\n• Flexibelt, passar familjeliv\n• Kräver disciplin\n\nMånga program erbjuder BÅDE.',
a:'Hybridprogram kombinerar campus-träffar (1-3 ggr/termin) med distansstudier. Söks via antagning.se precis som campus. CSN gäller för båda. Distansprogram har ofta något lägre antagningspoäng.'}
],
ex:{type:'build',title:'Utforska din universitetsväg',desc:'Hitta ett program som matchar dina mål.',
fields:[
{l:'Vilket yrke eller ämne intresserar dig?',ph:'T.ex. socionom, ekonom, lärare, IT, psykolog...'},
{l:'Vilken examensnivå siktar du på?',ph:'T.ex. Kandidat 3 år — vill sedan jobba direkt'},
{l:'Campus eller distans?',ph:'T.ex. Distans — har barn och jobb',hint:'Kolla antagning.se och filtrera på "distans".'},
{l:'Hittade du ett program? Vilket?',ph:'T.ex. Socionomprogrammet, Malmö universitet, 3.5 år'},
{l:'Vad krävs för antagning?',ph:'T.ex. Gymnasieexamen med Sv3, Eng5 och SH1b...',hint:'Kolla behörighetskraven noga!'}
]},
quiz:[
{q:'Hur många år är en kandidatexamen?',o:['2 år','3 år','5 år'],c:1},
{q:'Vad är "fri rörlighet" på universitetet?',o:['Gratis buss till campus','Du väljer kurser och takt själv','Du kan flytta mellan städer'],c:1},
{q:'Vad är skillnaden uni vs högskola?',o:['Priset','Uni får utfärda doktorsexamen','Ingen skillnad'],c:1},
{q:'Vad är 60 hp?',o:['En termin deltid','Ett år heltidsstudier','En kurs'],c:1},
{q:'Var söker du universitetsutbildningar?',o:['csn.se','antagning.se','uhr.se'],c:1}
],
pr:['Vilket program passar mig om jag vill bli socionom?','Förklara skillnaden kandidat och master enkelt.','Vilka behörighetskrav finns för ekonomprogrammet?']},

{id:'s14',icon:'🏫',title:'Gymnasiekomplettering',sub:'Det är aldrig för sent att läsa klart',color:'#60a5fa',bc:'rgba(96,165,250,.3)',bg:'rgba(96,165,250,.07)',
lessons:[
{t:'Varför gymnasiekomplettering?',
s:'Utan gymnasieexamen stängs många dörrar:\n\n❌ Kan inte söka YH\n❌ Kan inte söka universitetet\n❌ Sämre chans på många jobb\n\n✅ Men det är ALDRIG för sent!\nDu kan läsa klart gymnasiet som vuxen — i din takt.',
a:'Ca 15-20% av den vuxna befolkningen saknar fullständig gymnasieexamen. Som vuxen kan du läsa via Komvux gymnasial nivå. Det räknas exakt likadant som ett vanligt gymnasiebetyg vid ansökan till YH och uni.'},
{t:'GY-vux via Komvux',
s:'GY-vux = gymnasieutbildning för vuxna.\n\nDu kan:\n• Läsa enstaka kurser du saknar\n• Läsa ett helt program om du vill\n• Kombinera gamla betyg med nya\n• Förbättra ett dåligt betyg\n\nDet är gratis och du kan börja nästa termin.',
a:'Komvux gymnasial nivå ger behörighet precis som vanlig gymnasieutbildning. Viktigt: dina gamla betyg från ungdomen kombineras med nya betyg — du behöver inte läsa om allt. En meritpoängsberäkning görs på de bästa betygen.'},
{t:'Vad behöver du för YH och uni?',
s:'För YH:\n• Gymnasieexamen (oftast)\n• Specifika kurser varierar per program\n\nFör universitetet (grundbehörighet):\n• Svenska 2 eller 3\n• Engelska 5 eller 6\n• Matte 1a/1b\n\nMer info: antagning.se/behörighet',
a:'Grundbehörighet till högskola: Sv3/SVA3, En6, Ma1 + 9 av 12 specifika poäng. Specialbehörighet varierar per program. Socionom kräver t.ex. SH1b. Ingenjör kräver Fy1, Ke1, Ma3c. Kolla alltid exakt behörighet på antagning.se för just ditt program.'}
],
ex:{type:'build',title:'Din gymnasieplan',desc:'Ta reda på vad du saknar och hur du kompletterar.',
fields:[
{l:'Har du gymnasieexamen? Vad saknas?',ph:'T.ex. Saknar svenska 3 och matte 2 / Ingen examen alls'},
{l:'Vilket är ditt slutmål?',ph:'T.ex. Söka YH-utbildning till undersköterska',hint:'Målet avgör vilka kurser du behöver.'},
{l:'Vilka kurser behöver du läsa?',ph:'T.ex. Svenska som andraspråk 3, Matematik 1a...',hint:'Kolla behörighetskrav på antagning.se'},
{l:'Kontakta Komvux — när börjar du?',ph:'T.ex. Ansöker till höstterminen, sista dag 30 april',hint:'helsingborg.se/komvux för ansökan'}
]},
quiz:[
{q:'Kan vuxna läsa gymnasiekurser?',o:['Nej, bara ungdomar','Ja, via Komvux GY-vux','Bara på folkhögskola'],c:1},
{q:'Räknas GY-vux betyg lika som vanliga?',o:['Nej, lägre värde','Ja, exakt likadant','Beror på utbildningen'],c:1},
{q:'Vad krävs för grundbehörighet till uni?',o:['Bara gymnasieexamen','Sv3, En6, Ma1 + poäng','Högskoleprovet'],c:1},
{q:'Kan du förbättra ett gammalt dåligt betyg?',o:['Nej','Ja, via Komvux','Bara om du är under 30'],c:1}
],
pr:['Vilka kurser behöver jag för att söka socionomprogrammet?','Hur räknar jag ut om jag har grundbehörighet?','Hjälp mig planera att läsa klart gymnasiet på 1 år.']},

{id:'s15',icon:'⚡',title:'Korta certifieringskurser',sub:'1–8 veckor och direkt anställningsbar',color:'#60a5fa',bc:'rgba(96,165,250,.3)',bg:'rgba(96,165,250,.07)',
lessons:[
{t:'Vad är kortare certifieringskurser?',
s:'Det finns massor av korta kurser som:\n• Tar 1-8 veckor\n• Ger ett certifikat eller körkort\n• Direkt ökar din chans till jobb\n\nExempel:\n🚛 Truckkort A+B\n🔒 Väktarutbildning\n🏥 Vård- och omsorgsintroduktion\n❤️ HLR-certifikat\n🍳 Livsmedelshygien\n🔧 Heta arbeten',
a:'Korta certifieringskurser är inte del av det offentliga skolsystemet. De erbjuds av privata aktörer, branschorganisationer och ibland AF. Många arbetsgivare kräver dessa som minimikrav. De kan kombineras med andra utbildningar.'},
{t:'Truckkort — ett exempel',
s:'Truckkort A+B är ett av de vanligaste:\n\n• A = motviktstruck\n• B = skjutstativtruck\n\n⏱️ Ca 3-6 veckor\n💰 Kostar ca 8 000-15 000 kr (privat)\n🆓 Gratis via AMU (om AF anvisar)\n\nMed truckkort ökar din lön direkt.',
a:'Truckkort utfärdas av ATEX-godkända utbildare. Giltighetstid: 5 år (kräver förnyelse). Kursen innehåller teori, praktik och körprov. Söks via privata aktörer (t.ex. Lager och Terminal Akademin) eller via AF som AMU.'},
{t:'Var hittar du dessa kurser?',
s:'🔵 Via Arbetsförmedlingen (AF)\n→ Fråga om AMU — kan vara gratis!\n\n🟢 Kommunen / Komvux\n→ Vissa kommuner erbjuder kortare yrkes-kurser\n\n🔴 Privata aktörer\n→ Dyrt men snabbt\n\n🟡 Branschorganisationer\n→ T.ex. Bevakningsbranschen för väktare\n→ Sveriges Åkeriföretag för yrkestrafik',
a:'Väktarutbildning: söks via Bevakningsbranschen (bevakningsbranschen.se), kräver godkänt av polisen. HLR: Svenska Hjärt-Lungräddningsrådet (hlr.nu). Heta arbeten: Svetskommissionen. Livsmedelshygien: Livsmedelsverket godkända aktörer.'}
],
ex:{type:'sort',title:'Var söker du kursen?',desc:'Sortera kurserna till rätt kanal.',catA:'Via AF / Gratis',catB:'Privat aktör / Bransch',
items:[{l:'Truckkort via AMU',c:'A'},{l:'Väktarutbildning',c:'B'},{l:'HLR-certifikat',c:'B'},{l:'Truck via AF-anvisning',c:'A'},{l:'Heta arbeten',c:'B'},{l:'Livsmedelshygien via Komvux',c:'A'}]},
quiz:[
{q:'Hur lång är en typisk certifieringskurs?',o:['1-2 år','1-8 veckor','6 månader'],c:1},
{q:'Truckkort A — vad kör du?',o:['Skjutstativtruck','Motviktstruck','Bandtruck'],c:1},
{q:'Hur får du truckkort gratis?',o:['Går inte','Via AMU hos Arbetsförmedlingen','Via kommunen alltid'],c:1},
{q:'Hur länge gäller ett truckkort?',o:['Livstid','5 år','1 år'],c:1},
{q:'Var söker du väktarutbildning?',o:['Komvux','bevakningsbranschen.se','antagning.se'],c:1}
],
pr:['Vilka certifieringskurser ökar chansen till lagerjobb?','Hur söker jag AMU för truckkort i Helsingborg?','Vad kostar en väktarutbildning och hur lång är den?']},

{id:'s16',icon:'🔨',title:'Lärlingsprogram & YA',sub:'Jobba och utbilda dig samtidigt',color:'#60a5fa',bc:'rgba(96,165,250,.3)',bg:'rgba(96,165,250,.07)',
lessons:[
{t:'Vad är lärlingsprogram?',
s:'Lärling = du lär dig yrket på ett riktigt jobb.\n\nArbetsgivaren:\n• Lär dig yrket i praktiken\n• Betalar din utbildning\n• Betalar dig lön\n\nDu:\n• Jobbar och studerar parallellt\n• Får branschkompetens direkt\n• Har ett avtal som skyddar dig',
a:'Lärlingsprogrammet är en del av gymnasiala yrkesutbildningar men kan också ske som vuxen. Stor på bygg, el, VVS, industri och hantverk. Mer vanligt i Europa men växande i Sverige.'},
{t:'YA — Yrkesintroduktionsavtal',
s:'YA är speciellt för dig som:\n• Är under 25 år\n• Saknar erfarenhet inom branschen\n\nSå fungerar det:\n1. Du anställs av ett företag\n2. Företaget får lönestöd av AF\n3. Du får utbildning + handledning\n4. Avtalet gäller 6-24 månader\n\nFinns inom: bygg, el, handel, transport, vård',
a:'YA-avtal är kollektivavtalade och hanteras av branschorganisationer. Lönestödet gör det billigare för arbetsgivaren att ta in oerfarna. Arbetsgivaren förbinder sig att ge handledning och kompetenshöjning. Bra ingång för unga utan erfarenhet.'},
{t:'Hur hittar du en lärlingstjänst?',
s:'1. Platsbanken — sök "lärling" eller "trainee"\n2. LinkedIn — "lärling" + bransch\n3. Direkt till företag — fråga om YA\n4. Via AF — fråga om lönestödstjänster\n5. Branschorganisationer\n   → Byggnads, Elektrikerna, Handels\n\nVara proaktiv — de flesta annonseras inte!',
a:'Spontanansökan fungerar bra för YA-tjänster. Skriv till HR-avdelningen och nämn YA-avtal och AF:s lönestöd — många arbetsgivare vet inte att de kan få stödet. LinkedIn är effektivt för att hitta kontakter inom branschen.'}
],
ex:{type:'build',title:'Din lärlingsstrategi',desc:'Planera hur du hittar ett lärlingsprogram eller YA.',
fields:[
{l:'Vilken bransch intresserar dig?',ph:'T.ex. Bygg, el, VVS, handel, transport...'},
{l:'Är du under 25 år? (relevant för YA)',ph:'T.ex. Ja, 23 år — passar YA-avtal'},
{l:'Vilket företag vill du kontakta?',ph:'T.ex. Skanska, Eltel, lokalt byggföretag...',hint:'Tänk lokalt — var finns de i ditt område?'},
{l:'Vad ska du skriva i ditt brev?',ph:'T.ex. Jag vet att ni kan få lönestöd via YA-avtal och jag...',ta:true,hint:'Nämn YA och AF — det är säljargument!'}
]},
quiz:[
{q:'Vad är YA?',o:['Yrkesanalys','Yrkesintroduktionsavtal','Yrkesakademi'],c:1},
{q:'För vem gäller YA?',o:['Alla åldrar','Under 25 år utan branscherfarenhet','Bara gymnasieelever'],c:1},
{q:'Vem betalar utbildningen i lärlingsprogram?',o:['Du själv','CSN','Arbetsgivaren'],c:1},
{q:'Hur hittar du YA-tjänster effektivt?',o:['Bara Platsbanken','Spontanansökan + nämna YA','Via antagning.se'],c:1}
],
pr:['Skriv ett brev för att söka YA-anställning inom bygg.','Vilka branscher har flest YA-avtal i Skåne?','Hur presenterar jag YA-fördelar för en arbetsgivare?']},

{id:'s17',icon:'🌍',title:'Etableringsinsatser via AF',sub:'För dig med etableringsplan',color:'#60a5fa',bc:'rgba(96,165,250,.3)',bg:'rgba(96,165,250,.07)',
lessons:[
{t:'Vad är etableringsplanen?',
s:'Om du är nyanländ i Sverige kan du ha rätt till en etableringsplan.\n\nPlanen innehåller:\n• SFI (svenska)\n• Samhällsorientering\n• Aktiviteter mot jobb eller studier\n\nDu får etableringsersättning istället för försörjningsstöd.\n\nPlanen gäller max 24 månader.',
a:'Etableringsplanen handläggs av Arbetsförmedlingen. Rätt till plan: skyddsbehövande, kvotflyktingar och deras anhöriga i åldern 20-64. Etableringsersättning: ca 308 kr/dag heltid. Aktivitetsnivån påverkar ersättningens storlek.'},
{t:'Insatser du kan få',
s:'Under etableringstiden kan du:\n\n📚 Läsa SFI på heltid\n🏗️ Praktisera på ett riktigt företag\n📋 Göra yrkesvalidering\n🎓 Söka AMU-utbildning\n💼 Delta i matchningsinsatser\n\nAllt samtidigt som du får ersättning.',
a:'Viktiga insatser: Snabbspåret (validering + komplettering för akademiker), yrkesintroduktion, kommunens bosättningsstöd, BAS-utbildning (yrkesvägledning). Samordning sker ofta mellan AF, kommunen och CSN.'},
{t:'Snabbspåret',
s:'Om du har yrkesutbildning från ditt hemland:\n\n→ Snabbspåret kan hjälpa dig att validera och komplettera direkt i ditt yrke\n\nFinns inom:\n• Vård & omsorg\n• Bygg\n• IT\n• Lärare\n• Ingenjör\n• Kock\n\nKontakta AF direkt och fråga om snabbspåret!',
a:'Snabbspåret är en samverkan mellan AF, branschorganisationer och utbildningsanordnare. Tidslinje: 1-2 år inklusive validering, komplettering och handledning på arbetsplats. Resulterar ofta i legitimation eller anställning direkt.'}
],
ex:{type:'build',title:'Kolla din etableringssituation',desc:'Ta reda på vad du har rätt till.',
fields:[
{l:'Har du en etableringsplan via AF?',ph:'T.ex. Ja, startade jan 2024, slutar jan 2026'},
{l:'Vilken bakgrund/utbildning har du?',ph:'T.ex. Sjuksköterska 4 år från Syrien / Ingen formell utbildning'},
{l:'Är du intresserad av Snabbspåret?',ph:'T.ex. Ja, jag har jobbat som kock i 10 år',hint:'Fråga din handläggare om Snabbspåret finns för ditt yrke!'},
{l:'Vad är ditt nästa steg?',ph:'T.ex. Boka möte med AF och fråga om yrkesvalidering och AMU'}
]},
quiz:[
{q:'Hur länge gäller en etableringsplan?',o:['6 månader','Max 24 månader','5 år'],c:1},
{q:'Vad är etableringsersättning?',o:['Bostadsbidrag','Ersättning under etableringstiden','Lön från arbetsgivaren'],c:1},
{q:'Vad är Snabbspåret?',o:['Snabb SFI-kurs','Validering och komplettering i ditt yrke','En kurs på AF'],c:1},
{q:'Vem handlägger etableringsplanen?',o:['Kommunen','Arbetsförmedlingen','Migrationsverket'],c:1}
],
pr:['Vad kan jag göra under min etableringstid?','Finns Snabbspåret för sjuksköterskor?','Hur kombinerar jag SFI med AMU under etableringsplanen?']},

{id:'s18',icon:'🧭',title:'SYV — Studie- och yrkesvägledning',sub:'Gratis professionell vägledning',color:'#60a5fa',bc:'rgba(96,165,250,.3)',bg:'rgba(96,165,250,.07)',video:'/videos/s18-syv.mp4',
lessons:[
{t:'Översikt',intro:'overview',
cards:[
{icon:'🎯',h:'Vad är syftet?',t:'Förstå vad en studie- och yrkesvägledare kan hjälpa dig med — och att det är gratis hjälp du har rätt till.'},
{icon:'📚',h:'Vad innehåller modulen?',t:'Vad en SYV är och vad de hjälper dig med, var du hittar en, och vad du kan ta upp på ett möte.'},
{icon:'✅',h:'När du är klar ska du...',t:'veta att SYV-vägledning är gratis och oberoende, var du bokar ett möte, och hur du förbereder dig.'},
{icon:'⏱️',h:'Hur lång tid tar det?',t:'Cirka 4 minuter för film och de tre lektionerna, plus några minuter för övningen där du förbereder ditt eget SYV-möte.'}
],
a:'SYV — studie- och yrkesvägledare — är legitimerade vägledare med specialistkompetens i utbildnings- och arbetsmarknadsfrågor. Den här modulen visar hur du använder den gratis hjälpen.'},
{t:'Introduktionsfilm',intro:'video',vdesc:'Filmen ger dig hela bilden av vad en SYV gör — i en samtalsform. Se den först, så blir lektionerna lättare att följa.'},
{t:'Vad är SYV?',
cards:[
{icon:'🧭',h:'Studie- och yrkesvägledare',t:'En legitimerad expert på utbildning och arbetsmarknad.'},
{icon:'🗺️',h:'Hjälper dig att',t:'Hitta rätt utbildning, förstå arbetsmarknaden, sätta en realistisk plan, och välja mellan YH, universitet och Komvux.'},
{icon:'🔒',h:'Gratis & oberoende',t:'SYV-vägledning är helt gratis. Vägledaren har tystnadsplikt och säljer ingenting.'}
],
a:'SYV är legitimerade vägledare med specialistkompetens i utbildnings- och arbetsmarknadsfrågor. De är anställda på kommuner, skolor och Arbetsförmedlingen. De har tystnadsplikt och är oberoende — de säljer inget.'},
{t:'Var hittar du en SYV?',
cards:[
{icon:'🏢',h:'Komvux',t:'Kommunens vuxenutbildning — kontakta dem direkt och boka en tid.'},
{icon:'🏛️',h:'Arbetsförmedlingen',t:'Be din handläggare om ett SYV-möte.'},
{icon:'🏫',h:'Folkhögskola',t:'Folkhögskolor har egna vägledare.'},
{icon:'📱',h:'Studera.nu',t:'Digital vägledning via chatt och telefon — gratis.'}
],
a:'I Helsingborg: kontakta Vuxenutbildningen via helsingborg.se. Studera.nu erbjuder kostnadsfri vägledning på distans via telefon, chatt eller video. UHR driver också vägledning för akademiska frågor via antagning.se.'},
{t:'Vad kan du ta upp på mötet?',
cards:[
{icon:'🤔',h:'Vilket yrke passar mig?',t:'Vägledaren hjälper dig koppla intressen och styrkor till yrken.'},
{icon:'🎓',h:'Vilken utbildning behöver jag?',t:'Och hur lång tid tar vägen dit?'},
{icon:'💰',h:'Hur försörjer jag mig?',t:'Hur du kan klara ekonomin under studietiden.'},
{icon:'👉',h:'Vad är mitt nästa steg?',t:'Ingen fråga är för liten — fråga på.'}
],
a:'Förbered dig inför mötet: lista dina intressen, din utbildningsbakgrund och dina mål. Ju mer du berättar, desto bättre hjälp får du. Be om en skriftlig sammanfattning av planen efter mötet.'}
],
ex:{type:'build',title:'Förbered ditt SYV-möte',desc:'Formulera dina frågor och mål inför mötet.',
fields:[
{l:'Vad är ditt huvudmål? (jobb eller utbildning)',ph:'T.ex. Bli undersköterska inom 2 år'},
{l:'Vad vet du inte och behöver hjälp med?',ph:'T.ex. Vilka kurser jag saknar, om mina betyg räcker...',ta:true},
{l:'Dina 3 viktigaste frågor till SYV',ph:'1. Hur snabbt kan jag nå mitt mål?\n2. Vilket är enklaste vägen?\n3. Kan jag läsa deltid och jobba?',ta:true},
{l:'Var bokar du din SYV-tid?',ph:'T.ex. Ringer Komvux Helsingborg: 042-10 50 00',hint:'Gör det nu — det är gratis!'}
]},
quiz:[
{q:'Vad kostar SYV-vägledning?',o:['500 kr/timme','Gratis','100 kr via kommunen'],c:1},
{q:'Var hittar du SYV?',o:['Bara på gymnasiet','Komvux, AF, folkhögskola och studera.nu','Bara online'],c:1},
{q:'Vad hjälper SYV med?',o:['Bara CV-skrivning','Utbildnings- och karriärplanering','Bara universitetsansökan'],c:1},
{q:'Har SYV tystnadsplikt?',o:['Nej','Ja','Bara för känsliga ärenden'],c:1}
],
pr:['Hjälp mig formulera frågor till mitt SYV-möte.','Vilken utbildningsväg är snabbast till [yrke]?','Sammanfatta min situation och rekommendera nästa steg.']},,
{id:'s20',icon:'🤖',title:'Din AI-SYV',sub:'Chatta med en AI-vägledare',color:'#38bdf8',bc:'rgba(56,189,248,.3)',bg:'rgba(56,189,248,.07)',
lessons:[
{t:'Vad är AI-SYV?',
s:'AI-SYV är din personliga studiestöd-robot — tillgänglig dygnet runt, helt gratis.\n\nDu kan fråga om:\n💬 Vilka utbildningar som passar dig\n💬 Vad olika utbildningar leder till för jobb\n💬 Löner och arbetsmarknad\n💬 Behörighet och antagningspoäng\n💬 Utbildningar i Familjen Helsingborg\n💬 Hur du kombinerar CSN med jobb\n\nAI-SYV kompletterar — men ersätter inte — en riktig SYV.',
a:'AI-SYV är byggd på Claude (Anthropic) och har specialiserad kunskap om det svenska utbildningssystemet med fokus på Helsingborg och Skåne. Den ger snabb grundinfo men för komplexa beslut är ett möte med en riktig SYV alltid värt det.'},
{t:'Konsten att ställa bra frågor',
s:'Ju mer du berättar, desto bättre svar.\n\n❌ Dålig fråga:\n"Vad ska jag studera?"\n\n✅ Bra fråga:\n"Jag har arbetat som chaufför i 5 år, har SFI C-klart och vill byta till vård. Vilka utbildningar passar mig i Helsingborg?"\n\n❌ Dålig fråga:\n"Är YH bra?"\n\n✅ Bra fråga:\n"Vilka YH-utbildningar finns inom IT i Helsingborg och vad leder de till för startlön?"',
a:'Specifika frågor med kontext (bakgrund, ort, mål, tidsperspektiv, ekonomi) ger alltid mer relevanta svar. Berätta vad du redan vet — AI-SYV bygger vidare på det och undviker att upprepa saker.'}
],
ex:{type:'ai-chat',title:'Chatta med AI-SYV'},
quiz:[
{q:'Vad kan du fråga AI-SYV om?',o:['Bara YH-utbildningar','Utbildningar, löner, behörighet och arbetsmarknad','Bara Helsingborg'],c:1},
{q:'Vad ger bäst svar från AI-SYV?',o:['Korta enkla frågor','Specifika frågor med bakgrund och mål','Ja/nej-frågor'],c:1},
{q:'Ersätter AI-SYV en riktig SYV?',o:['Ja, helt','Nej — kompletterar och ger snabb grundinfo','Bara för enklare frågor'],c:1},
{q:'Var hittar du en riktig SYV gratis?',o:['Bara på universitetet','Komvux, AF, folkhögskola och studera.nu','Det kostar alltid pengar'],c:1}
],
pr:['Vilken utbildning passar mig baserat på [din bakgrund]?','Hitta YH-utbildningar inom vård i Helsingborg.','Hur ansöker jag till Komvux och vilka kurser behöver jag?']}
];

  // ============================================================
  // EXPORT — gör datan tillgänglig globalt
  // ============================================================
  window.TRAINING_DATA = {
    INTRO: INTRO,
    ARBETE: ARBETE,
    HALSA: HALSA,
    EKONOMI: EKONOMI,
    DIGITAL: DIGITAL,
    STUDIER: STUDIER
  };
})();
