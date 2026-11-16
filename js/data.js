/* ==========================================================================
   DentalCare Studio — dati centralizzati del sito (SITE_DATA)
   --------------------------------------------------------------------------
   Questo file contiene TUTTI i contenuti modificabili: studio, orari,
   servizi, team, FAQ, recensioni, immagini e fasi della prima visita.
   Viene caricato per primo (script defer) in ogni pagina: gli altri file JS
   leggono da window.SITE_DATA.

   IMPORTANTE: progetto dimostrativo per portfolio. Studio, indirizzo,
   recapiti, professionisti e recensioni sono fittizi.
   ========================================================================== */

window.SITE_DATA = {

  /* ------------------------------------------------------------------------
     STUDIO
     >>> Cambia qui il NOME DELLO STUDIO, la descrizione e i RECAPITI.
     I recapiti sono segnaposto: telefono, email e social aprono un avviso
     dimostrativo e non contattano nessuno (vedi js/main.js → demo links).
     ------------------------------------------------------------------------ */
  studio: {
    name: "DentalCare Studio",
    tagline: "Studio odontoiatrico a Milano",
    description:
      "Uno studio odontoiatrico che mette al centro ascolto, spiegazioni chiare e percorsi di cura costruiti insieme al paziente.",

    // >>> Aggiorna qui INDIRIZZO e RECAPITI (attualmente di fantasia)
    address: {
      street: "Via dei Glicini 00",
      cap: "20100",
      city: "Milano",
      note: "Indirizzo di fantasia"
    },
    phoneDisplay: "02 0000 0000",
    phoneNote: "Numero dimostrativo",
    email: "info@dentalcare-studio.example", // dominio .example riservato: non riceve email
    social: ["Instagram", "Facebook"],

    /* >>> WHATSAPP
       Nel prototipo il pulsante "Scrivici" apre una modale dimostrativa.
       Per un uso reale, inserisci qui un link autorizzato dallo studio,
       ad esempio "https://wa.me/39XXXXXXXXXX" (solo numeri verificati).
       Se lasci la stringa vuota, il sito continua a mostrare l'avviso demo. */
    whatsappUrl: ""
  },

  /* ------------------------------------------------------------------------
     ORARI
     >>> Modifica qui gli ORARI: vengono mostrati in footer, home e contatti.
     ------------------------------------------------------------------------ */
  hours: [
    { days: "Lunedì – Venerdì", time: "9:00 – 19:00" },
    { days: "Sabato", time: "9:00 – 13:00" },
    { days: "Domenica e festivi", time: "Chiuso" }
  ],

  /* ------------------------------------------------------------------------
     IMMAGINI
     >>> Sostituisci qui le IMMAGINI. Tutte le illustrazioni attuali sono
     file SVG locali in assets/images/, pensati come segnaposto: per un
     sito reale vanno sostituite con fotografie autorizzate dello studio.
     Mantieni width/height coerenti con le proporzioni della nuova foto.
     ------------------------------------------------------------------------ */
  images: {
    hero:       { src: "assets/images/studio-hero.svg",      alt: "Illustrazione di un ambulatorio luminoso con poltrona odontoiatrica, grande finestra e piante", width: 1200, height: 900, replace: "Foto dell'ambulatorio principale con luce naturale" },
    reception:  { src: "assets/images/reception.svg",        alt: "Illustrazione della reception con bancone in legno chiaro e lampade a sospensione", width: 1200, height: 900, replace: "Foto della reception" },
    attesa:     { src: "assets/images/sala-attesa.svg",      alt: "Illustrazione della sala d'attesa con divano, poltrone e libreria", width: 1200, height: 900, replace: "Foto della sala d'attesa" },
    operativa:  { src: "assets/images/sala-operativa.svg",   alt: "Illustrazione di una sala operativa ordinata con poltrona, lampada e mobile contenitore", width: 1200, height: 900, replace: "Foto di una sala operativa" },
    dettaglio:  { src: "assets/images/dettaglio-ambiente.svg", alt: "Illustrazione di un dettaglio d'arredo con mensole, piante e oggetti in ceramica", width: 1200, height: 900, replace: "Foto di un dettaglio d'arredo" },
    corridoio:  { src: "assets/images/corridoio.svg",        alt: "Illustrazione di un corridoio luminoso con porte in legno e quadri astratti", width: 1200, height: 900, replace: "Foto del corridoio" },
    colloquio:  { src: "assets/images/sala-colloquio.svg",   alt: "Illustrazione di due persone sedute a un tavolo che parlano davanti a un tablet", width: 1200, height: 900, replace: "Foto della sala colloqui (senza volti riconoscibili o con liberatoria)" },
    mappa:      { src: "assets/images/mappa-illustrativa.svg", alt: "Mappa illustrativa di fantasia con strade, un parco e un segnaposto", width: 1200, height: 800, replace: "Mappa reale incorporata solo dopo verifica dell'indirizzo" }
  },

  /* Galleria della pagina "Lo studio" (chiavi di images) */
  gallery: [
    { image: "reception", caption: "Reception" },
    { image: "attesa", caption: "Sala d'attesa" },
    { image: "operativa", caption: "Sala operativa" },
    { image: "colloquio", caption: "Spazio per il colloquio" },
    { image: "corridoio", caption: "Corridoio" },
    { image: "dettaglio", caption: "Dettagli dell'ambiente" }
  ],

  /* ------------------------------------------------------------------------
     CATEGORIE DEI SERVIZI
     ------------------------------------------------------------------------ */
  categories: [
    { id: "prevenzione", label: "Valutazione e prevenzione" },
    { id: "cure", label: "Cura del dente e delle gengive" },
    { id: "ortodonzia-bambini", label: "Ortodonzia e bambini" },
    { id: "riabilitazione", label: "Riabilitazione" },
    { id: "estetica", label: "Estetica" }
  ],

  /* ------------------------------------------------------------------------
     SERVIZI
     >>> Per AGGIUNGERE UN SERVIZIO copia un oggetto qui sotto e modifica:
         - id: univoco, minuscolo, con trattini (usato in servizio.html?id=...)
         - category: uno degli id di "categories"
         - image: percorso dell'illustrazione/foto
         - teamId: id di un membro del team
         - related / faqIds: id di altri servizi / FAQ
         - featured: true per mostrarlo in home (consigliati 6)
     Testi informativi e generali: niente diagnosi, terapie o promesse.
     ------------------------------------------------------------------------ */
  services: [
    {
      id: "prima-visita",
      name: "Prima visita e valutazione",
      category: "prevenzione",
      featured: true,
      image: { src: "assets/images/servizi/prima-visita.svg", alt: "Illustrazione di un dente stilizzato accanto a una cartellina con elenco" },
      summary: "Un primo incontro per conoscersi, ascoltare le tue esigenze e valutare la situazione della bocca.",
      intro: "La prima visita è il momento in cui ci conosciamo. Il professionista ascolta ciò che desideri raccontare, osserva la situazione e ti spiega con calma che cosa ha rilevato.",
      goal: "Avere un quadro iniziale della salute della bocca e capire insieme se e quali percorsi possono essere utili, con tempi e priorità discussi apertamente.",
      evaluation: [
        "Accoglienza e raccolta delle informazioni generali che ritieni utile condividere.",
        "Colloquio sulle tue esigenze, sulle abitudini e su eventuali fastidi.",
        "Osservazione clinica di denti, gengive e tessuti della bocca.",
        "Eventuali approfondimenti solo se il professionista li ritiene necessari.",
        "Spiegazione di quanto emerso e, se utile, delle possibilità di trattamento."
      ],
      discuss: [
        "Che cosa ti ha portato a prenotare e che cosa ti aspetti.",
        "Eventuali esperienze precedenti, positive o negative.",
        "Come preferisci ricevere le informazioni e quanto tempo desideri per decidere.",
        "Priorità, tempi e modalità del percorso eventualmente proposto."
      ],
      keywords: ["controllo", "visita", "valutazione", "check-up", "primo appuntamento"],
      teamId: "giulia-marchesi",
      related: ["igiene-orale", "odontoiatria-conservativa", "odontoiatria-pediatrica"],
      faqIds: ["faq-durata-prima-visita", "faq-cosa-portare", "faq-preventivo"]
    },
    {
      id: "igiene-orale",
      name: "Igiene orale e prevenzione",
      category: "prevenzione",
      featured: true,
      image: { src: "assets/images/servizi/igiene-orale.svg", alt: "Illustrazione di un dente stilizzato con uno spazzolino e piccoli riflessi" },
      summary: "Sedute di igiene professionale e consigli pratici per la cura quotidiana a casa.",
      intro: "L'igiene orale professionale affianca la cura quotidiana che fai a casa. È anche un'occasione per ricevere indicazioni pratiche su spazzolamento e strumenti adatti a te.",
      goal: "Contribuire a mantenere denti e gengive in salute nel tempo, con controlli periodici la cui frequenza viene concordata con il professionista.",
      evaluation: [
        "Breve colloquio su abitudini e strumenti di igiene che usi.",
        "Osservazione di denti e gengive.",
        "Seduta di igiene professionale, se indicata, con spiegazione dei passaggi.",
        "Consigli pratici personalizzati dal professionista per la cura a casa."
      ],
      discuss: [
        "Strumenti che usi ogni giorno e eventuali difficoltà.",
        "Sensibilità o fastidi che noti durante lo spazzolamento.",
        "Frequenza dei controlli più adatta alla tua situazione."
      ],
      keywords: ["pulizia", "detartrasi", "ablazione", "spazzolino", "prevenzione", "igienista"],
      teamId: "sara-colombo",
      related: ["parodontologia", "prima-visita", "odontoiatria-pediatrica"],
      faqIds: ["faq-frequenza-igiene", "faq-igiene-fastidio"]
    },
    {
      id: "odontoiatria-conservativa",
      name: "Odontoiatria conservativa",
      category: "cure",
      featured: true,
      image: { src: "assets/images/servizi/conservativa.svg", alt: "Illustrazione di un dente stilizzato con una piccola area evidenziata" },
      summary: "Cure dedicate ai denti colpiti da carie o piccole fratture, con l'obiettivo di preservarli.",
      intro: "L'odontoiatria conservativa si occupa di trattare i denti interessati da carie, usura o piccole fratture, cercando di preservare il più possibile il dente naturale.",
      goal: "Ripristinare forma e funzione del dente quando possibile, secondo quanto emerso dalla valutazione clinica.",
      evaluation: [
        "Colloquio su eventuali fastidi, sensibilità o cambiamenti notati.",
        "Osservazione clinica del dente e dei denti vicini.",
        "Eventuali approfondimenti, se ritenuti necessari dal professionista.",
        "Spiegazione delle possibilità e dei tempi."
      ],
      discuss: [
        "Che cosa comporta ciascuna possibilità e quali alternative esistono.",
        "Numero indicativo di appuntamenti.",
        "Come gestire eventuali fastidi dopo la seduta."
      ],
      keywords: ["carie", "otturazione", "restauro", "dente rotto", "sensibilità"],
      teamId: "giulia-marchesi",
      related: ["endodonzia", "igiene-orale", "estetica-sorriso"],
      faqIds: ["faq-preventivo", "faq-ansia"]
    },
    {
      id: "endodonzia",
      name: "Endodonzia",
      category: "cure",
      featured: false,
      image: { src: "assets/images/servizi/endodonzia.svg", alt: "Illustrazione di un dente stilizzato con le radici evidenziate da linee sottili" },
      summary: "La cura della parte interna del dente, valutata quando la polpa è coinvolta.",
      intro: "L'endodonzia riguarda la parte interna del dente. Il professionista valuta se e quando può essere indicata, spiegando con chiarezza le ragioni e le alternative.",
      goal: "Valutare la possibilità di conservare il dente quando la parte interna è coinvolta, secondo le indicazioni emerse dalla visita.",
      evaluation: [
        "Ascolto dei sintomi che desideri descrivere.",
        "Osservazione clinica e, se ritenuti necessari, approfondimenti.",
        "Spiegazione di cosa è emerso e delle possibilità disponibili."
      ],
      discuss: [
        "Motivi per cui il trattamento viene o non viene proposto.",
        "Alternative possibili e loro implicazioni.",
        "Durata indicativa e numero di sedute."
      ],
      keywords: ["devitalizzazione", "canale", "radice", "polpa", "mal di denti"],
      teamId: "giulia-marchesi",
      related: ["odontoiatria-conservativa", "protesi-dentale", "prima-visita"],
      faqIds: ["faq-ansia", "faq-preventivo"]
    },
    {
      id: "parodontologia",
      name: "Parodontologia",
      category: "cure",
      featured: false,
      image: { src: "assets/images/servizi/parodontologia.svg", alt: "Illustrazione di denti stilizzati con la linea delle gengive evidenziata" },
      summary: "Attenzione alla salute delle gengive e dei tessuti che sostengono i denti.",
      intro: "La parodontologia si occupa delle gengive e dei tessuti di sostegno dei denti. Sanguinamento o gengive arrossate sono segnali di cui parlare con il professionista.",
      goal: "Valutare lo stato dei tessuti gengivali e definire, se necessario, un percorso di cura e di mantenimento.",
      evaluation: [
        "Colloquio su abitudini e segnali notati, come sanguinamento.",
        "Osservazione delle gengive e dei tessuti di sostegno.",
        "Eventuali approfondimenti se ritenuti necessari.",
        "Spiegazione di quanto emerso e delle possibili tappe."
      ],
      discuss: [
        "Ruolo dell'igiene quotidiana e dei controlli periodici.",
        "Frequenza del mantenimento concordata con il professionista.",
        "Abitudini che possono influire sulla salute delle gengive."
      ],
      keywords: ["gengive", "sanguinamento", "piorrea", "parodontite", "tasche"],
      teamId: "sara-colombo",
      related: ["igiene-orale", "implantologia", "prima-visita"],
      faqIds: ["faq-frequenza-igiene", "faq-igiene-fastidio"]
    },
    {
      id: "ortodonzia",
      name: "Ortodonzia",
      category: "ortodonzia-bambini",
      featured: true,
      image: { src: "assets/images/servizi/ortodonzia.svg", alt: "Illustrazione di una fila di denti stilizzati collegati da un filo sottile" },
      summary: "Valutazione dell'allineamento dei denti per bambini, ragazzi e adulti.",
      intro: "L'ortodonzia si occupa della posizione dei denti e del rapporto tra le arcate. Una prima valutazione aiuta a capire se un percorso è indicato e quale approccio può essere considerato.",
      goal: "Valutare l'allineamento e la funzione, discutendo se e quando un percorso ortodontico può essere utile.",
      evaluation: [
        "Colloquio su aspettative, abitudini e storia dentale.",
        "Osservazione di denti, arcate e masticazione.",
        "Eventuali approfondimenti se ritenuti necessari dal professionista.",
        "Spiegazione delle opzioni, dei tempi indicativi e degli impegni richiesti."
      ],
      discuss: [
        "Differenze tra gli apparecchi che il professionista ritiene adatti.",
        "Impegno richiesto nella vita quotidiana e controlli periodici.",
        "Tempi indicativi, che dipendono dalla situazione individuale."
      ],
      keywords: ["apparecchio", "allineatori", "denti storti", "bite", "malocclusione"],
      teamId: "luca-bernardi",
      related: ["odontoiatria-pediatrica", "estetica-sorriso", "prima-visita"],
      faqIds: ["faq-ortodonzia-eta", "faq-ortodonzia-adulti", "faq-bambini-eta"]
    },
    {
      id: "implantologia",
      name: "Implantologia",
      category: "riabilitazione",
      featured: false,
      image: { src: "assets/images/servizi/implantologia.svg", alt: "Illustrazione schematica di una corona dentale stilizzata sopra un supporto" },
      summary: "Valutazione delle possibilità di sostituzione di uno o più denti mancanti.",
      intro: "Quando mancano uno o più denti, l'implantologia è una delle possibilità che il professionista può valutare insieme ad altre soluzioni.",
      goal: "Capire, dopo la valutazione clinica, se l'implantologia è una strada percorribile e come si confronta con le alternative.",
      evaluation: [
        "Colloquio su esigenze, storia dentale e aspettative.",
        "Osservazione clinica della zona interessata.",
        "Approfondimenti, se ritenuti necessari per valutare la fattibilità.",
        "Presentazione delle alternative, con tempi e fasi indicative."
      ],
      discuss: [
        "Vantaggi e limiti delle diverse soluzioni possibili.",
        "Fasi del percorso e tempi indicativi.",
        "Cura e controlli necessari nel tempo."
      ],
      keywords: ["impianto", "dente mancante", "vite", "carico"],
      teamId: "giulia-marchesi",
      related: ["protesi-dentale", "parodontologia", "prima-visita"],
      faqIds: ["faq-preventivo", "faq-durata-prima-visita"]
    },
    {
      id: "protesi-dentale",
      name: "Protesi dentale",
      category: "riabilitazione",
      featured: true,
      image: { src: "assets/images/servizi/protesi.svg", alt: "Illustrazione di due denti stilizzati collegati come un piccolo ponte" },
      summary: "Soluzioni fisse o rimovibili per ripristinare la funzione masticatoria.",
      intro: "La protesi dentale comprende diverse soluzioni, fisse o rimovibili, per sostituire denti compromessi o mancanti. La scelta dipende dalla valutazione clinica e dalle tue esigenze.",
      goal: "Valutare con te la soluzione più adatta per funzione, comfort e manutenzione, tra quelle indicate dal professionista.",
      evaluation: [
        "Colloquio su esigenze quotidiane, comfort ed estetica.",
        "Osservazione clinica e, se necessario, approfondimenti.",
        "Presentazione delle soluzioni possibili e delle fasi."
      ],
      discuss: [
        "Differenze tra soluzioni fisse e rimovibili.",
        "Abitudini di pulizia e manutenzione.",
        "Numero di appuntamenti e tempi indicativi."
      ],
      keywords: ["corona", "ponte", "dentiera", "capsula", "protesi mobile"],
      teamId: "giulia-marchesi",
      related: ["implantologia", "odontoiatria-conservativa", "estetica-sorriso"],
      faqIds: ["faq-preventivo"]
    },
    {
      id: "odontoiatria-pediatrica",
      name: "Odontoiatria pediatrica",
      category: "ortodonzia-bambini",
      featured: true,
      image: { src: "assets/images/servizi/pediatrica.svg", alt: "Illustrazione di un piccolo dente stilizzato sorridente con una stella" },
      summary: "Visite pensate per i più piccoli, con tempi calmi e il coinvolgimento dei genitori.",
      intro: "Con i bambini procediamo con calma, spiegando ogni passaggio con parole semplici e coinvolgendo i genitori. L'obiettivo è costruire un rapporto sereno con la cura dei denti.",
      goal: "Accompagnare la crescita della bocca del bambino con controlli adeguati all'età e buone abitudini quotidiane.",
      evaluation: [
        "Momento di conoscenza con il bambino e il genitore.",
        "Osservazione delicata di denti e gengive, rispettando i tempi del bambino.",
        "Consigli pratici per l'igiene a casa e l'alimentazione.",
        "Spiegazione di quanto emerso al genitore."
      ],
      discuss: [
        "Abitudini quotidiane: spazzolamento, merende, ciuccio.",
        "Come preparare il bambino alla visita.",
        "Frequenza dei controlli consigliata dal professionista."
      ],
      keywords: ["bambini", "pedodonzia", "denti da latte", "sigillature", "famiglia"],
      teamId: "luca-bernardi",
      related: ["ortodonzia", "igiene-orale", "prima-visita"],
      faqIds: ["faq-bambini-eta", "faq-bambini-preparare"]
    },
    {
      id: "estetica-sorriso",
      name: "Estetica del sorriso",
      category: "estetica",
      featured: false,
      image: { src: "assets/images/servizi/estetica.svg", alt: "Illustrazione di un dente stilizzato con alcune piccole stelle decorative" },
      summary: "Valutazione di colore, forma e armonia dei denti, sempre partendo dalla salute.",
      intro: "Gli interventi estetici partono sempre dalla salute della bocca. Il professionista ascolta i tuoi desideri e spiega in modo realistico che cosa è possibile valutare.",
      goal: "Discutere aspettative e possibilità in modo trasparente, dopo aver verificato lo stato di salute di denti e gengive.",
      evaluation: [
        "Colloquio sui tuoi desideri e su ciò che vorresti cambiare.",
        "Valutazione della salute di denti e gengive.",
        "Spiegazione realistica delle possibilità e dei loro limiti."
      ],
      discuss: [
        "Aspettative e risultati realisticamente valutabili.",
        "Eventuali trattamenti preliminari per la salute della bocca.",
        "Manutenzione nel tempo."
      ],
      keywords: ["sbiancamento", "faccette", "colore", "sorriso", "estetica"],
      teamId: "giulia-marchesi",
      related: ["odontoiatria-conservativa", "ortodonzia", "igiene-orale"],
      faqIds: ["faq-preventivo", "faq-durata-prima-visita"]
    }
  ],

  /* ------------------------------------------------------------------------
     TEAM (profili dimostrativi, nomi fittizi, avatar illustrati)
     >>> Per AGGIUNGERE UN PROFESSIONISTA copia un oggetto e modifica i campi.
     Non inserire titoli, università o iscrizioni non verificati.
     Non associare nomi fittizi a fotografie di persone reali.
     ------------------------------------------------------------------------ */
  team: [
    {
      id: "giulia-marchesi",
      name: "Giulia Marchesi",
      role: "Odontoiatra",
      avatar: "assets/images/team/avatar-1.svg",
      areas: ["Prima visita", "Conservativa", "Protesi", "Coordinamento dei piani di cura"],
      languages: ["Italiano", "Inglese"],
      bio: "Segue le prime visite e coordina i piani di cura, con particolare attenzione alla chiarezza delle spiegazioni.",
      longBio: "Giulia accoglie i pazienti alla prima visita e si occupa di costruire con loro un piano di cura comprensibile. Ama prendersi il tempo per rispondere alle domande e per mostrare, con immagini e schemi, ciò che sta spiegando.",
      services: ["prima-visita", "odontoiatria-conservativa", "protesi-dentale", "implantologia"]
    },
    {
      id: "luca-bernardi",
      name: "Luca Bernardi",
      role: "Odontoiatra dedicato all'ortodonzia",
      avatar: "assets/images/team/avatar-2.svg",
      areas: ["Ortodonzia", "Odontoiatria pediatrica"],
      languages: ["Italiano", "Spagnolo"],
      bio: "Si occupa di ortodonzia per bambini, ragazzi e adulti, coinvolgendo le famiglie in ogni fase.",
      longBio: "Luca segue i percorsi ortodontici e le visite dei più piccoli. Dedica tempo a spiegare a genitori e ragazzi come funziona il percorso proposto e quali impegni comporta nella vita di tutti i giorni.",
      services: ["ortodonzia", "odontoiatria-pediatrica"]
    },
    {
      id: "sara-colombo",
      name: "Sara Colombo",
      role: "Igienista dentale",
      avatar: "assets/images/team/avatar-3.svg",
      areas: ["Igiene orale professionale", "Prevenzione", "Educazione all'igiene domiciliare"],
      languages: ["Italiano", "Inglese", "Francese"],
      bio: "Si occupa di igiene professionale e prevenzione, con consigli pratici per la cura quotidiana.",
      longBio: "Sara aiuta i pazienti a trovare una routine di igiene sostenibile. Durante le sedute spiega ogni passaggio e lascia sempre spazio a pause e domande.",
      services: ["igiene-orale", "parodontologia"]
    },
    {
      id: "marta-rinaldi",
      name: "Marta Rinaldi",
      role: "Assistente di studio",
      avatar: "assets/images/team/avatar-4.svg",
      areas: ["Accoglienza", "Organizzazione degli appuntamenti", "Supporto in poltrona"],
      languages: ["Italiano", "Inglese"],
      bio: "Accoglie i pazienti, organizza gli appuntamenti e affianca i professionisti durante le sedute.",
      longBio: "Marta è il primo volto che incontri in studio. Si occupa dell'organizzazione degli appuntamenti, risponde alle domande pratiche e affianca i professionisti perché ogni seduta si svolga con ordine e calma.",
      services: ["prima-visita"]
    }
  ],

  /* ------------------------------------------------------------------------
     FASI DELLA PRIMA VISITA
     ------------------------------------------------------------------------ */
  firstVisitSteps: [
    { title: "Accoglienza", text: "Ti accogliamo in reception, senza fretta. Ti chiediamo le informazioni generali necessarie e rispondiamo alle domande pratiche." },
    { title: "Colloquio con il professionista", text: "Ci racconti che cosa ti ha portato da noi, le tue esigenze ed eventuali timori. Ascoltare viene prima di tutto." },
    { title: "Valutazione clinica", text: "Il professionista osserva denti, gengive e tessuti della bocca, spiegando che cosa sta facendo." },
    { title: "Eventuali approfondimenti", text: "Solo se ritenuti necessari dal professionista, possono essere proposti approfondimenti. Non sono previsti per tutti." },
    { title: "Spiegazione delle possibilità", text: "Ti illustriamo che cosa è emerso e le possibilità di trattamento, con vantaggi, limiti e alternative." },
    { title: "Piano e preventivo", text: "Se utile, ti presentiamo un piano di cura con un preventivo personalizzato. Puoi prenderti il tempo che ti serve per decidere." }
  ],

  /* ------------------------------------------------------------------------
     FAQ (categorie e domande). Le risposte sono generali e non sostituiscono
     un consulto.
     ------------------------------------------------------------------------ */
  faqCategories: [
    { id: "prima-visita", label: "Prima visita" },
    { id: "appuntamenti", label: "Appuntamenti" },
    { id: "preventivo", label: "Preventivo" },
    { id: "bambini", label: "Bambini" },
    { id: "ansia", label: "Ansia" },
    { id: "igiene", label: "Igiene" },
    { id: "ortodonzia", label: "Ortodonzia" },
    { id: "studio", label: "Accessibilità, orari e arrivo" }
  ],
  faqs: [
    { id: "faq-durata-prima-visita", category: "prima-visita", q: "Quanto dura la prima visita?", a: "In genere prevediamo un tempo sufficiente per conoscerci, ascoltare le tue esigenze e svolgere la valutazione senza fretta. La durata può variare in base alla situazione e alle domande che desideri fare." },
    { id: "faq-cosa-portare", category: "prima-visita", q: "Che cosa devo portare alla prima visita?", a: "Un documento d'identità e la tessera sanitaria. Se hai già documentazione dentale recente che ritieni utile, puoi portarla e sarà il professionista a valutare se consultarla. Non è necessario procurarsi esami prima della visita." },
    { id: "faq-prenotare", category: "appuntamenti", q: "Come posso richiedere un appuntamento?", a: "Puoi usare il modulo di richiesta indicando giorno e fascia oraria preferiti. In questa demo il modulo non invia dati: in uno studio reale verresti ricontattato per confermare la disponibilità." },
    { id: "faq-disdire", category: "appuntamenti", q: "Posso spostare o disdire un appuntamento?", a: "Sì. Ti chiediamo di avvisarci con un po' di anticipo, così da poter offrire l'orario ad altri pazienti. Le modalità di contatto sono indicate nella pagina Contatti." },
    { id: "faq-preventivo", category: "preventivo", q: "Posso avere un preventivo senza visita?", a: "Un preventivo personalizzato richiede una valutazione clinica: senza visita non è possibile sapere quali cure siano indicate. Dopo la valutazione, se utile, ti presentiamo un piano con il relativo preventivo." },
    { id: "faq-preventivo-tempo", category: "preventivo", q: "Devo decidere subito se accettare il piano di cura?", a: "No. Puoi prenderti il tempo che ti serve, fare domande e chiedere chiarimenti prima di decidere." },
    { id: "faq-bambini-eta", category: "bambini", q: "A che età portare un bambino dal dentista?", a: "Ne parlate volentieri con il professionista: spesso è utile una prima visita di conoscenza già nei primi anni, anche per abituare il bambino all'ambiente. Il momento più adatto dipende dal singolo caso." },
    { id: "faq-bambini-preparare", category: "bambini", q: "Come posso preparare mio figlio alla visita?", a: "Parlarne con naturalezza, senza promesse né minacce, aiuta molto. Puoi raccontare che il dentista conterà i denti e controllerà che siano in salute. In studio procediamo con calma e rispettando i suoi tempi." },
    { id: "faq-ansia", category: "ansia", q: "Ho paura del dentista: come posso affrontare la visita?", a: "Dircelo è già un primo passo. Possiamo spiegarti ogni passaggio prima di farlo, concordare un segnale per fare una pausa e procedere con tempi più distesi. Ogni persona è diversa: ne parliamo insieme." },
    { id: "faq-ansia-accompagnatore", category: "ansia", q: "Posso venire accompagnato?", a: "Sì, puoi venire con una persona di fiducia. Valuteremo insieme se e in quali momenti può restare con te." },
    { id: "faq-frequenza-igiene", category: "igiene", q: "Ogni quanto è utile fare l'igiene professionale?", a: "Non esiste una frequenza uguale per tutti: dipende dalla situazione individuale e viene concordata con il professionista dopo la valutazione." },
    { id: "faq-igiene-fastidio", category: "igiene", q: "La seduta di igiene è fastidiosa?", a: "La percezione varia da persona a persona. Puoi segnalare in qualsiasi momento un fastidio: l'igienista adatterà il ritmo della seduta e ti spiegherà ciò che sta facendo." },
    { id: "faq-ortodonzia-eta", category: "ortodonzia", q: "C'è un'età giusta per una valutazione ortodontica?", a: "Una valutazione può essere utile a diverse età. Il professionista indicherà se e quando è opportuno intervenire, in base alla crescita e alla situazione." },
    { id: "faq-ortodonzia-adulti", category: "ortodonzia", q: "L'ortodonzia è possibile anche da adulti?", a: "Una valutazione ortodontica è possibile a qualsiasi età. La fattibilità e l'approccio dipendono dalla situazione individuale e dalla salute di denti e gengive." },
    { id: "faq-accessibilita", category: "studio", q: "Lo studio è accessibile?", a: "Questa è una descrizione dimostrativa: in uno studio reale qui verrebbero indicati con precisione ingresso, ascensore e servizi. Ti consigliamo sempre di segnalare in anticipo le tue esigenze." },
    { id: "faq-orari", category: "studio", q: "Quali sono gli orari dello studio?", a: "Gli orari sono riportati nella pagina Contatti e nel piè di pagina. Nei giorni festivi lo studio resta chiuso." },
    { id: "faq-arrivo", category: "studio", q: "Come si raggiunge lo studio?", a: "Nella pagina Contatti trovi indicazioni illustrative su mezzi pubblici e parcheggi. Trattandosi di un progetto dimostrativo, indirizzo e indicazioni sono di fantasia." }
  ],

  /* FAQ mostrate in home (id) */
  homeFaqIds: ["faq-durata-prima-visita", "faq-preventivo", "faq-ansia", "faq-bambini-eta"],

  /* ------------------------------------------------------------------------
     RECENSIONI DIMOSTRATIVE (testi di fantasia, non attribuiti a piattaforme)
     ------------------------------------------------------------------------ */
  reviews: [
    { name: "Laura M.", text: "Mi hanno spiegato ogni passaggio con calma e senza fretta. Sono uscita sapendo esattamente quali erano le mie possibilità." },
    { name: "Davide R.", text: "Accoglienza gentile e ambiente luminoso. Ho apprezzato la puntualità e la chiarezza nell'organizzare gli appuntamenti." },
    { name: "Chiara e Paolo", text: "Nostra figlia era un po' timorosa: le hanno lasciato il tempo di ambientarsi e ci hanno coinvolto in tutto." },
    { name: "Marco T.", text: "Ho sempre avuto un po' di ansia dal dentista. Concordare un segnale per fare una pausa mi ha fatto sentire più tranquillo." },
    { name: "Elena S.", text: "Preventivo spiegato voce per voce, con il tempo di pensarci. Nessuna pressione, solo informazioni chiare." }
  ]
};
