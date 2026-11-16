# DentalCare Studio — sito dimostrativo per portfolio

Sito multipagina per uno studio odontoiatrico **fittizio** di Milano.
HTML5, CSS custom (Grid/Flexbox) e JavaScript vanilla, senza framework né librerie.

> Studio, indirizzo, recapiti, professionisti e recensioni sono inventati.
> I moduli non inviano né salvano dati.

## Struttura

```
dentalcare-studio/
├── index.html            Home
├── studio.html           Lo studio (con galleria e lightbox)
├── servizi.html          Elenco servizi con ricerca e filtri
├── servizio.html         Dettaglio dinamico: servizio.html?id=igiene-orale
├── team.html             Team con modali profilo
├── prima-visita.html     Fasi, preparazione, ansia, FAQ, modulo
├── preventivo.html       Richiesta informazioni / prima visita (demo)
├── faq.html              FAQ con ricerca, categorie e accordion
├── contatti.html         Recapiti demo, mappa illustrativa, modulo
├── privacy.html          Privacy e trasparenza della demo
├── css/  base.css · components.css · pages.css · compat.css (compatibilità dispositivi)
├── js/   data.js · main.js · services.js · team.js · faq.js · gallery.js · forms.js
└── assets/images/        Illustrazioni SVG locali (segnaposto)
```

## Come aprire il sito

**Sul computer:** apri `index.html` con un doppio clic. Il sito funziona anche da file locale, perché i dati sono in `js/data.js` (niente `fetch` né moduli).

**Su smartphone e tablet della stessa rete Wi-Fi:**
1. Dalla cartella del progetto avvia un server locale:
   `python3 -m http.server 8000` (oppure `npx serve .`)
2. Trova l'indirizzo IP del computer (es. `192.168.1.20`).
3. Dal telefono apri `http://192.168.1.20:8000`.

**Online:** il sito è pubblicato su Netlify all'indirizzo https://dentalcare-studio.netlify.app ed è collegato a questo repository: ogni push sul branch `main` lo aggiorna automaticamente. Se cambi indirizzo, aggiorna l'URL dell'anteprima social (`og:image`) nelle pagine.

Il layout è stato controllato a 375, 768, 1024 e 1440 px. Tutte le pagine hanno il meta viewport per i dispositivi mobili.

## Compatibilità con i dispositivi

Il sito è pensato per iPhone, iPad, Android, Mac e Windows (Safari, Chrome, Edge, Firefox recenti):

- `css/compat.css` raccoglie le regole specifiche: aree sicure per iPhone con notch (`viewport-fit=cover` + `env(safe-area-inset-*)`), altezza corretta dello schermo su mobile (`dvh` con alternativa `vh`), campi dei form a 16px (niente zoom automatico su iPhone), aspetto uniforme dei controlli, hover disattivato sui touch screen, schermi da 320px, telefono in orizzontale, modalità a contrasto elevato di Windows, stampa, alternative per browser senza `aspect-ratio`.
- `js/main.js` (sezione "compatibilità dispositivi") aggiunge alternative per browser senza `<dialog>` o senza `:has()` e gestisce il tasto "indietro" di Safari.
- Icone: `favicon.svg`, PNG 32px per Windows, `apple-touch-icon.png` per la schermata Home di iPhone/iPad e `site.webmanifest` per Android.
- Anteprima del link condiviso (WhatsApp, LinkedIn, Telegram…): tag Open Graph con `assets/images/anteprima-social.png`.
- `404.html` per gli indirizzi inesistenti e `netlify.toml` con intestazioni di sicurezza e cache.

## Modificare colori e font

- **Colori:** variabili in `:root` all'inizio di `css/base.css` (`--brand-primary`, `--bg-page`, ecc.).
- **Font:** variabili `--font-heading` (Manrope) e `--font-body` (Inter) in `css/base.css`, più il link a Google Fonts nell'`<head>` di ogni pagina. Se elimini quel link, il sito usa i font di sistema.

## Sostituire immagini e recapiti

Tutto si trova in `js/data.js`, nell'oggetto `SITE_DATA`. Le sezioni sono commentate con `>>>`:

- **Nome dello studio, indirizzo, telefono, email:** `SITE_DATA.studio`
- **Orari:** `SITE_DATA.hours`, che aggiorna footer, home e contatti.
- **Immagini degli ambienti:** `SITE_DATA.images`. Per ogni voce c'è un campo `replace` che indica quale fotografia andrebbe messa. Aggiorna `width`/`height` in base alle proporzioni della nuova foto.
- **Immagini dei servizi:** il campo `image` di ciascun servizio.
- **Avatar del team:** il campo `avatar` di ciascun professionista. Non usare fotografie di persone reali con nomi fittizi.
- **WhatsApp:** `SITE_DATA.studio.whatsappUrl`. Se è vuoto, il pulsante mostra un avviso demo. Inserisci solo un link autorizzato dallo studio (es. `https://wa.me/39…`).

I testi fissi delle pagine (titoli e paragrafi) si trovano direttamente nei file HTML.
Il nome dello studio compare anche nel logo dell'header e nei `<title>` delle pagine.

## Aggiungere un servizio

1. In `js/data.js`, copia un oggetto in `services` e cambia l'`id` (minuscolo, con trattini).
2. Imposta `category` (uno degli id in `categories`), `teamId`, `related`, `faqIds`.
3. Metti `featured: true` se vuoi mostrarlo in home (ne vengono mostrati 6).
4. La pagina sarà disponibile su `servizio.html?id=<id>` e comparirà in elenco, filtri e modulo.

## Aggiungere un professionista

Copia un oggetto in `team` (in `js/data.js`) e imposta `id`, `name`, `role`, `areas`, `languages`, `bio`, `longBio`, `avatar`, `services`. Per collegarlo a un servizio, indica il suo `id` nel campo `teamId` del servizio.

## Funzionalità simulate

- **Moduli** (preventivo, prima visita, contatti): validazione, riepilogo e conferma reali; **nessun invio** di rete e **nessun salvataggio** (niente localStorage o cookie). Dopo la conferma i dati vengono cancellati dalla pagina.
- **Telefono, email, social, WhatsApp:** aprono una modale dimostrativa.
- **Mappa:** è un'illustrazione SVG di fantasia, non una mappa reale.
- **Recensioni:** testi di esempio, etichettati come “Recensione dimostrativa”.

## Funzionalità reali

Menu mobile accessibile, voce di menu attiva, ricerca e filtri combinabili sui servizi, pagina di dettaglio dinamica con gestione di ID mancanti o non validi, FAQ con ricerca e filtri, accordion con `aria-expanded`, modali con `<dialog>` (Esc, focus contenuto e ripristinato alla chiusura), lightbox con frecce da tastiera, carousel manuale (pulsanti, puntini, frecce, swipe, nessun autoplay), precompilazione del servizio dai link (`preventivo.html?servizio=…&tipo=…`), reveal leggeri allo scroll che rispettano `prefers-reduced-motion`, fallback per immagini mancanti.

## Risorse esterne

- **Google Fonts** (Manrope, Inter): unica richiesta verso terzi. Ci sono fallback locali.
- Nessun analytics, pixel, embed o CDN di librerie.
- Le immagini sono SVG originali creati per il progetto, quindi non ci sono licenze di terzi da attribuire.

## Prima di un eventuale utilizzo reale

- Sostituire tutti i dati fittizi con informazioni verificate dello studio, inclusi i dati societari e professionali obbligatori.
- Usare fotografie reali con le relative liberatorie.
- Collegare i moduli a un backend sicuro e far redigere a un consulente l'informativa privacy e la gestione del consenso. Valutare l'hosting locale dei font.
- Far rivedere i testi sanitari a un professionista e verificare la conformità alle norme sulla pubblicità sanitaria.
- Rimuovere `noindex` dai meta tag e le diciture demo.
- Fare un test di accessibilità con screen reader reali.
