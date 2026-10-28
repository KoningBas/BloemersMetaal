# DESIGN.md — Website Bloemers Metaal

Dit bestand is de ontwerpopdracht voor de website. Lees het samen met `BRIEF.md` (inhoud, teksten, gegevens), `PRODUCT.md` (merk en doelgroep) en `CLAUDE.md` (werkregels).

- **BRIEF.md bepaalt wat er op de site staat.** DESIGN.md bepaalt hoe het eruitziet.
- Spreken ze elkaar tegen over inhoud, dan geldt BRIEF.md deel A.
- Alles wat hier als `[INVULLEN]` staat, komt in `OPEN-PUNTEN.md`.

---

## 1. Ontwerpidee in één zin

> **"De vakman met de nette vrachtwagen."** Een witte, rustige site met de stevigheid van een bedrijfswagen: antraciet, staal, één signaalkleur voor de belknop. Het telefoonnummer is het belangrijkste beeldelement van de site.

Drie dingen moet de bezoeker binnen vijf seconden zien:

1. **Wie:** Bloemers Metaal, al vanaf 1959.
2. **Wat:** wij halen oud ijzer en metalen bij u op, door heel Nederland.
3. **Wat te doen:** bellen. De belknop is altijd de opvallendste knop op het scherm.

**Herkenbaar detail:** het telefoonnummer staat groot en strak in beeld, in brede letters, als het nummer op de zijkant van een bedrijfswagen. Daarnaast komen kleine labels in hoofdletters terug, als een ingeslagen typeplaatje. Geen andere versiering.

**Sfeer:** professioneel, nuchter, betrouwbaar. Industrieel maar verzorgd. Geen schreeuwerige schrootsite en geen gelikte startup-site.

---

## 2. Kleuren

Wit is de basis (keuze klant). Antraciet zorgt voor stevigheid en is de ondergrond voor het witte logo. Er is precies één accentkleur, en die is alleen voor bel- en actieknoppen.

### 2.1 Tokens

```css
:root {
  /* Basis */
  --color-bg:            #FFFFFF;  /* paginaachtergrond */
  --color-surface:       #F3F4F5;  /* lichtgrijze vlakken, afwisselende secties */
  --color-border:        #D9DDE1;  /* lijnen, kaartranden (decoratief, geen tekst) */

  /* Tekst op licht */
  --color-ink:           #16191D;  /* koppen en broodtekst      17.6:1 op wit */
  --color-ink-muted:     #4A525C;  /* bijtekst, labels           7.9:1 op wit */

  /* Donker (antraciet) */
  --color-dark:          #1E2328;  /* contactbalk, header, footer, belbalk-variant */
  --color-on-dark:       #FFFFFF;  /* tekst op antraciet         15.8:1 */
  --color-on-dark-muted: #B8C0C8;  /* bijtekst op antraciet       8.6:1 */

  /* Accent: ALLEEN voor belknoppen en primaire acties */
  --color-accent:        #C2410C;  /* [INVULLEN] uit logo of vrachtwagen, zie 2.2 */
  --color-accent-hover:  #9A3412;
  --color-on-accent:     #FFFFFF;  /* witte tekst op accent       5.2:1 */

  /* WhatsApp: alleen het icoon */
  --color-whatsapp:      #25D366;

  /* Focus */
  --color-focus:         #C2410C;  /* gelijk aan accent */
}
```

### 2.2 Accentkleur bepalen

De accentkleur is nog niet bekend (BRIEF A9).

1. Haal de kleur uit het logo (`brand_assets/logo/`) of van de vrachtwagen op de foto's. Neem de meest verzadigde, herkenbare kleur.
2. Controleer het contrast met witte knoptekst: **minimaal 4,5:1**.
   - Haalt de kleur dat niet, gebruik dan een donkerdere tint als `--color-accent`.
   - Of gebruik `--color-ink` als knoptekst, als dat wel 4,5:1 haalt.
3. Maak `--color-accent-hover` ongeveer 15% donkerder.
4. Noteer de hexcode in `OPEN-PUNTEN.md` zodat Bram hem kan laten bevestigen.
5. Zit er geen bruikbare kleur in logo of wagen, houd dan het voorstel `#C2410C` aan, een roestoranje dat bij metaal past.

### 2.3 Regels voor kleurgebruik

| Kleur | Wel | Niet |
|---|---|---|
| Accent | Belknoppen, "Bel voor de dagprijs", actieve menu-onderstreping, focusring | Koppen, achtergrondvlakken, iconen in kaarten, decoratie |
| Antraciet | Contactbalk, header, footer, hero-overlay | Grote tekstvlakken met lange teksten |
| Surface-grijs | Om en om achter secties, FAQ-vlak | Achter knoppen |
| WhatsApp-groen | Alleen het WhatsApp-icoon | Als knopkleur of tekstkleur (te weinig contrast) |

- Maximaal **één accentknop per schermhoogte**. De tweede actie (WhatsApp) is altijd een secundaire knop.
- Geen verlopen (gradients), behalve de donkere overlay op de hero-foto (zie 6.3).
- Geen dark mode. De klant wil wit; de site volgt het systeemthema niet.

---

## 3. Typografie

Eén lettertypefamilie (BRIEF A5): **Archivo**. Archivo heeft een breedte-as. Daarmee krijgen koppen een brede, stevige vorm zoals belettering op een bedrijfswagen, en blijft de broodtekst normaal breed en goed leesbaar.

- **Laden:** zelf hosten via `@fontsource-variable/archivo` (of de woff2-bestanden in `public/fonts/`). **Niet via Google Fonts laden.** Dat stuurt IP-adressen van bezoekers naar Google en zou een privacymelding vereisen (BRIEF A8: geen tracking).
- Alleen het Latin-subset, variabel bestand met de assen `wght` 400–800 en `wdth` 100–125.
- `font-display: swap`, en preload alleen het ene woff2-bestand.

```css
:root {
  --font-sans: "Archivo Variable", "Archivo", system-ui, -apple-system, "Segoe UI", sans-serif;
}
body { font-family: var(--font-sans); font-size: 1.0625rem; line-height: 1.6; color: var(--color-ink); }
```

### 3.1 Typeschaal

Mobiel eerst; de schaal groeit met `clamp()` mee.

| Rol | Grootte (mobiel → desktop) | Gewicht | Breedte (`wdth`) | Regelhoogte | Extra |
|---|---|---|---|---|---|
| Display (hero-kop) | `clamp(2rem, 1.2rem + 3.6vw, 3.5rem)` | 800 | 112 | 1.05 | `text-wrap: balance` |
| H1 (paginakop) | `clamp(1.875rem, 1.4rem + 2vw, 2.75rem)` | 800 | 112 | 1.1 | `text-wrap: balance` |
| H2 (sectiekop) | `clamp(1.5rem, 1.2rem + 1.2vw, 2rem)` | 700 | 108 | 1.15 | |
| H3 (kaartkop) | `1.25rem` | 700 | 100 | 1.25 | |
| Lead (intro onder kop) | `clamp(1.125rem, 1rem + 0.5vw, 1.3125rem)` | 400 | 100 | 1.5 | kleur `--color-ink-muted` |
| Body | `1.0625rem` (17 px) | 400 | 100 | 1.6 | max. 68 tekens breed (`max-width: 68ch`) |
| Small | `0.9375rem` (15 px) | 400 | 100 | 1.5 | alleen footer en bijschriften |
| Label (eyebrow) | `0.8125rem` (13 px) | 700 | 112 | 1.2 | HOOFDLETTERS, `letter-spacing: 0.08em` |
| Telefoonnummer groot | `clamp(1.75rem, 1.2rem + 2.4vw, 3rem)` | 800 | 125 | 1 | `font-variant-numeric: tabular-nums`, nooit afbreken (`white-space: nowrap`) |
| Knoptekst | `1.0625rem` | 700 | 104 | 1 | |

Regels:

- Body nooit kleiner dan 16 px (BRIEF A5). Footer-tekst is het kleinst, op 15 px.
- Telefoonnummers schrijf je altijd als `06 53 31 26 07`: groepjes van twee, harde spaties (`&nbsp;`) ertussen, zodat ze niet afbreken.
- Tijden noteer je als `08:00 – 19:00 uur`, met een en-dash met spaties.
- Geen cursief en geen onderstreepte koppen. Vet alleen voor koppen, knoppen en korte nadruk.
- Labels (eyebrows) alleen in de hero, de paginakoppen en bij het "1959"-element. Niet boven elke sectie: een label boven elke H2 is een template-cliché (zie PRODUCT.md, anti-referenties).

---

## 4. Ruimte, raster en vormen

### 4.1 Ruimteschaal (basis 4 px)

```css
:root {
  --space-1: 0.25rem;  /*  4 */
  --space-2: 0.5rem;   /*  8 */
  --space-3: 0.75rem;  /* 12 */
  --space-4: 1rem;     /* 16 */
  --space-5: 1.5rem;   /* 24 */
  --space-6: 2rem;     /* 32 */
  --space-7: 3rem;     /* 48 */
  --space-8: 4rem;     /* 64 */
  --space-9: 6rem;     /* 96 */
  --section-y: clamp(3rem, 2rem + 4vw, 6rem);  /* verticale ruimte per sectie */
}
```

### 4.2 Raster

| | Mobiel `< 640` | Tablet `640–959` | Desktop `≥ 960` |
|---|---|---|---|
| Zijmarge (gutter) | 16 px | 24 px | 32 px |
| Kolommen | 1 | 2 | 12 (container) |
| Containerbreedte | 100% | 100% | max. 1200 px, gecentreerd |
| Tekstkolom | 100% | max. 68ch | max. 68ch |

- Breakpoints: `640px`, `960px`, `1200px`. Schrijf CSS mobiel eerst (`min-width`-queries).
- Geen horizontale scroll, ook niet op 320 px breed.

### 4.3 Vormen

- **Hoeken:** strak en industrieel. Knoppen en kaarten krijgen `border-radius: 4px`, foto's `2px`. Geen pilvormige knoppen en geen grote ronde hoeken.
- **Lijnen:** `1px solid var(--color-border)`. Een accentlijn (bijvoorbeeld onder het actieve menu-item) is `3px solid var(--color-accent)`.
- **Schaduw:** bijna geen. Alleen de vaste mobiele balk krijgt `0 -2px 12px rgba(22,25,29,.12)`. Kaarten hebben een rand, geen schaduw.
- **Stalen lijn:** één dunne horizontale lijn van 48 × 3 px in `--color-ink` onder een H2 mag als vast detail terugkomen. Gebruik niets anders als decoratie.

---

## 5. Iconen

- Inline SVG, lijnstijl, `stroke-width: 1.75`, 24 × 24, `stroke="currentColor"`. Geen icon font en geen externe bibliotheek via een CDN. Lucide-iconen mogen, maar dan gekopieerd als losse SVG's.
- Benodigde iconen:
  - telefoon
  - WhatsApp (officieel logo, als enige in `--color-whatsapp`)
  - mail
  - vrachtwagen
  - container (eenvoudige bak)
  - euro/munt
  - kalender (sinds 1959)
  - kaartpin
  - klok
  - schild met vinkje (NIWO)
  - pijl naar rechts
  - plus/min voor de FAQ
  - menu/sluiten
- Iconen in kaarten staan in `--color-ink` in een vierkant vlak van 48 × 48 met `--color-surface`. Ze zijn nooit in de accentkleur.
- Decoratieve iconen krijgen `aria-hidden="true"`.

---

## 6. Componenten

Alle maten zijn minimaal. De volgorde is die van BRIEF A3.

### 6.1 Knoppen

| Variant | Gebruik | Stijl |
|---|---|---|
| **Primair (bellen)** | "Bel 06 53 31 26 07", "Bel voor de dagprijs", "Bel voor een afspraak" | Achtergrond `--color-accent`, tekst `--color-on-accent`, telefoonicoon links. Hover: `--color-accent-hover`. |
| **Secundair (WhatsApp)** | "WhatsApp ons" | Witte achtergrond, rand `2px solid var(--color-ink)`, tekst `--color-ink`, groen WhatsApp-icoon links. Op donker: transparant, rand en tekst wit. |
| **Tekstlink** | "Bekijk onze diensten →" | `--color-ink`, onderstreept met `text-underline-offset: 0.2em`; hover: de onderstreping wordt accent. |

- Hoogte minimaal **52 px** op mobiel en 48 px op desktop. Padding `0 24px`. Op mobiel zijn knoppen in de hero volle breedte en onder elkaar.
- Het telefoonnummer staat altijd in de knoptekst van de primaire belknop in de hero.
- Links:
  - `tel:+31653312607`
  - `tel:+31611196887`
  - `https://wa.me/31653312607?text=Hallo%2C%20ik%20heb%20oud%20ijzer%20of%20metaal%20en%20wil%20graag%20een%20afspraak%20maken.`
  - `https://wa.me/31611196887`
  - `mailto:info@bloemers-metaal.nl`
- Focus: `outline: 3px solid var(--color-focus); outline-offset: 3px;`, altijd zichtbaar bij toetsenbordgebruik (`:focus-visible`). Op antraciet wordt de focusring wit (`--color-on-dark`); accent op antraciet haalt maar net 3:1.
- Overgangen: alleen `background-color` en `border-color`, 150 ms. Knoppen springen of schalen niet.

### 6.2 Contactbalk (vervallen 27-10-2026)

- Verwijderd op verzoek van de opdrachtgever. Telefoon staat in de header ("Bel ons"), in de belbalk en op mobiel in de vaste balk onderaan. De tekst hieronder is historisch.

- Achtergrond `--color-dark`, tekst `--color-on-dark`, hoogte 40 px, tekst 15 px.
- **Desktop:** links staat "Ma t/m za 08:00 – 19:00 uur", met een klokicoon. Rechts staan beide nummers als `tel:`-links en een WhatsApp-link.
- **Mobiel:** één regel met alleen `06 53 31 26 07` en het WhatsApp-icoon, rechts uitgelijnd. Het tweede nummer staat op mobiel in de vaste balk en op Contact.
- De balk scrolt mee weg. Alleen de header is sticky.

### 6.3 Header

- Achtergrond `--color-dark`, hoogte 72 px desktop en 64 px mobiel. Hij is sticky (`position: sticky; top: 0`).
- **Logo:** links, het originele bestand uit `brand_assets/logo/`. Is het logo wit, dan staat het direct op antraciet. Is het niet wit, zet het dan op een witte header en maak de contactbalk het enige donkere vlak. Hoogte maximaal 44 px.
- **Menu (desktop ≥ 960):** zes items (BRIEF A3), 16 px, gewicht 600, wit. Het actieve item krijgt een accentlijn van 3 px eronder en `aria-current="page"`. Rechts in de header staat een compacte primaire belknop: "Bel ons".
- **Mobiel:** een hamburgerknop van 48 × 48 rechts, met `aria-expanded`. Het menu opent als een volledig scherm in antraciet: de items zijn 24 px groot en onder elkaar, met onderaan een primaire belknop. Bij openen blijft de focus binnen het menu en sluit Esc het menu.

### 6.4 Hero (Home)

- Een **full-bleed foto van de vrachtwagen van voren** (`vrachtwagen-voorkant`).
  - Mobiel: hoogte `min(78svh, 640px)`.
  - Desktop: `min(80vh, 720px)`.
  - `object-fit: cover` en `object-position` op de cabine. Controleer de uitsnede op 360 en 1440 breed.
- **Overlay** voor de leesbaarheid: `linear-gradient(180deg, rgba(22,25,29,.15) 0%, rgba(22,25,29,.75) 100%)` op mobiel. Op desktop van links naar rechts, van `.8` naar `.1`.
- **Inhoud:** links onder (mobiel) of links midden (desktop), max. 640 px breed:
  1. Label: `SINDS 1959 · OSS`
  2. Display-kop: "Al vanaf 1959 uw partner in oud ijzer en metalen"
  3. Lead: "Wij halen oud ijzer en alle soorten metalen bij u op, door heel Nederland. Met onze eigen vrachtwagen en gratis containers."
  4. Knoppen: primair "Bel 06 53 31 26 07" en secundair (op donker) "WhatsApp ons".
- Foto met `fetchpriority="high"`, **niet** lazy. Geef een `srcset` mee: 640, 1024, 1600 en 2000 breed.

### 6.5 Sterke punten (Home)

- Vier blokken: Sinds 1959 (vader en zoon) · Heel Nederland (eigen vrachtwagen) · Gratis containers (plaatsen en ophalen) · Dagprijs (contant of per bank).
- Raster: 1 kolom mobiel, 2 kolommen tablet, 4 kolommen desktop. Elk blok heeft een icoon-tegel, een H3 en één regel tekst.
- Achtergrond van de sectie: `--color-bg`. Tussen de blokken staat op desktop een verticale lijn van 1 px; er zijn geen kaarten met randen.
- Zet "NIWO-gecertificeerd" er als kleine regel onder, met het schild-icoon, in `--color-ink-muted`.

### 6.6 Dienstkaarten (Home en Diensten)

- **Home:** drie kaarten (Metaal ophalen · Containers · Alle soorten metalen) met een foto bovenaan in verhouding 4:3, een H3, één zin en een tekstlink naar `/diensten`.
- **Diensten:** per dienst een rij met foto en tekst naast elkaar. De foto staat om en om links en rechts (desktop); op mobiel staat de foto boven de tekst.
- Kaart: rand `1px var(--color-border)`, radius 4 px, padding 24 px. Bij hover wordt de rand `--color-ink`. Er is geen schaduw en de kaart beweegt niet.

### 6.7 Kort over ons (Home)

- Twee kolommen op desktop: tekst (BRIEF A3, punt 4) en een foto (heftruck of werk). Op mobiel staan ze onder elkaar.
- Groot getal als typografisch element: **1959**, in Display-grootte, `wdth` 125, kleur `--color-ink`, met het label `FAMILIEBEDRIJF` erboven.

### 6.8 Belbalk (onderaan elke inhoudspagina)

- Achtergrond `--color-dark` en volle breedte. Verticale ruimte `--section-y`.
- Kop (H2, wit): "Oud ijzer of metaal kwijt? Bel ons voor de dagprijs."
- **Het telefoonnummer in de groot-stijl** (zie 3.1), wit, als `tel:`-link. Dit is het herkenbare beeldmoment van de site. Daaronder in kleiner formaat het tweede nummer en de openingstijden ("Ma t/m za 08:00 – 19:00 uur, na 18:00 uur op afspraak").
- Daaronder de knoppen: primair "Bel 06 53 31 26 07" en secundair "WhatsApp ons".

### 6.9 Veelgestelde vragen

- Gebruik `<details>`/`<summary>`, zodat het zonder JavaScript werkt. Er staat altijd hooguit één vraag open: alle `<details>` delen `name="faq"` (exclusieve accordeon, werkt zonder JavaScript). De lijst staat gecentreerd (27-10-2026).
- Elke vraag is een rij van minimaal 56 px hoog, met de vraag in 18 px, gewicht 600, en een plus-icoon rechts dat bij open een min wordt. Tussen de rijen staat een lijn van 1 px.
- Teksten en volgorde komen uit BRIEF A4. "Waar komen jullie?" en "Wat zijn de prijzen?" staan bovenaan.
- Voeg `FAQPage`-structured data toe met dezelfde vragen en antwoorden.
- Onder de lijst staat de belbalk.

### 6.10 Contact

- **Desktop:** links een contactkaart, rechts de kaart. **Mobiel:** onder elkaar.
- **Contactkaart:**
  1. Beide nummers als grote `tel:`-links, in de groot-stijl, kleiner geschaald.
  2. Twee WhatsApp-knoppen.
  3. De e-mail als link.
  4. Het adres.
  5. De openingstijden als `<dl>`.
  6. De regel "Wilt u iets komen brengen? Bel dan eerst even."
- **Kaart (voorstel, BRIEF A9):**
  - Geen Google Maps-iframe, want dat plaatst cookies.
  - Gebruik een statische kaartafbeelding (bijvoorbeeld een OpenStreetMap-uitsnede die je zelf als WebP opslaat) met de link "Route plannen" naar `https://www.google.com/maps/dir/?api=1&destination=Ritchiestraat+4,+5346+TZ+Oss`.
  - Of gebruik een klik-om-te-laden-kaart.
- Er komt geen formulier (BRIEF A6).

### 6.11 Footer

- Achtergrond `--color-ink` (donkerder dan de belbalk) met bovenaan een lijn van 1 px in `--color-ink-muted`, zodat belbalk en footer twee aparte vlakken zijn (27-10-2026). Tekst 15 px in `--color-on-dark-muted`; koppen en links zijn wit.
- **Vier kolommen op desktop, gestapeld op mobiel:**
  1. Logo + kernzin
  2. Contact: adres, nummers, e-mail
  3. Openingstijden
  4. Menu
- **Onderste regel:** "© Bloemers Metaal · KvK 16562310 · NIWO-gecertificeerd · Privacyverklaring". Geen "Powered by".
- Op mobiel extra ruimte onderaan (`padding-bottom`), zodat de vaste balk niets bedekt.

### 6.12 Vaste mobiele balk (`< 960 px`)

- `position: fixed; bottom: 0`, volle breedte en 64 px hoog, plus `env(safe-area-inset-bottom)`.
- Twee gelijke helften:
  - links **Bellen** (primair, accent, telefoonicoon) naar `tel:+31653312607`;
  - rechts **WhatsApp** (wit, groen icoon) naar de WhatsApp-link.
- Altijd zichtbaar. Hij verdwijnt niet bij scrollen.
- Voeg `padding-bottom: calc(64px + env(safe-area-inset-bottom))` toe aan de `body`.

### 6.13 Paginakop (overige pagina's)

- Geen grote foto: een `--color-surface`-vlak met een label, de H1 en de lead. Padding `--space-8` boven en `--space-6` onder.
- Op Over ons mag een brede foto onder de kop, in verhouding 21:9 op desktop en 4:3 op mobiel.

### 6.14 404-pagina

- Een paginakop met "Deze pagina bestaat niet" en de zin "Zoekt u ons nummer? Bel ons direct." Daaronder de primaire belknop en een link naar Home.

---

## 7. Paginaopbouw per pagina

| Pagina | Volgorde van secties |
|---|---|
| Home `/` | Header · Hero · Sterke punten · Dienstkaarten (3) · Werkgebied met kaart · Kort over ons · Veelgestelde vragen kort (3, exclusieve accordeon) · Belbalk · Footer (27-10-2026) |
| Diensten `/diensten` | Paginakop · Intro · 3 dienstrijen met foto · Primaire knop "Bel voor een afspraak" · Belbalk · Footer |
| Prijzen `/prijzen` | Paginakop · Tekstblok met daarnaast een opvallend blok "Dagprijs · Gratis container · Contant of per bank" (3 regels met iconen) · Knop "Bel voor de dagprijs" · Belbalk · Footer |
| Over ons `/over-ons` | Paginakop · Tekst met "1959"-element links, staande foto van de eigenaar rechts (4:5; vanaf 640 px naast elkaar) · Belbalk · Footer (27-10-2026) |
| Veelgestelde vragen `/veelgestelde-vragen` | Paginakop · FAQ-lijst · Belbalk · Footer |
| Contact `/contact` | Paginakop · Contactkaart + kaart · Footer (geen belbalk; de pagina ís het contact) |

Secties wisselen af tussen `--color-bg` en `--color-surface`, zodat de pagina ritme krijgt zonder lijnen of kaders.

---

## 8. Foto's

- **Alleen de echte foto's van de klant** uit `brand_assets/photos/`. Geen stockfoto's, geen AI-beelden en geen illustraties.
- Bekende onderwerpen: vrachtwagen van voren (hero en Open Graph), heftruck, heftruck met containers. Verdeel de overige foto's over Diensten, Over ons en Home (BRIEF A9).
- **Formaat:** WebP, max. ca. 200 KB per foto (de hero mag tot 250 KB), met `srcset` en `sizes`. Altijd `width`/`height` of `aspect-ratio`, zodat de pagina niet verspringt.
- **Laden:** alles behalve de hero met `loading="lazy"` en `decoding="async"`.
- **Verhoudingen:** hero vrij (cover), kaarten 4:3, brede foto 21:9 op desktop. Gebruik `object-fit: cover`.
- **Bewerking:** geen filters, geen zwart-wit en geen kleurzweem. Hooguit licht rechtzetten en bijsnijden.
- **Alt-teksten in het Nederlands,** beschrijvend en zonder "afbeelding van". Voorbeelden:
  - "Vrachtwagen van Bloemers Metaal, van voren gezien"
  - "Heftruck zet een container met oud ijzer neer"
  - "Containers voor oud ijzer op het terrein in Oss"
- **Open Graph-afbeelding:** de vrachtwagenfoto, 1200 × 630, met rechtsonder klein het logo.
- **Favicon:** van het logo, als `favicon.svg` plus `apple-touch-icon.png` (180 × 180). Gebruik op een effen ondergrond in `--color-dark` als het logo wit is.

---

## 9. Beweging

Rustig en functioneel. De site moet snel aanvoelen.

- Alleen kleur-overgangen op knoppen, links en kaarten (150 ms, `ease-out`).
- **Eén laadmoment:** de hero-tekst komt in beeld met een fade en een verschuiving van 12 px omhoog (400 ms). De knoppen volgen 80 ms later. Daarna beweegt er niets meer.
- De FAQ klapt open zonder animatie of met maximaal 200 ms.
- `@media (prefers-reduced-motion: reduce)`: alle animaties uit.
- **Niet gebruiken:** sliders of carrousels, parallax, scroll-animaties per sectie, pop-ups, chatwidgets, tellers die oplopen.

---

## 10. Toegankelijkheid (minimaal WCAG 2.1 AA)

- Contrast: tekst minimaal 4,5:1, grote tekst en UI-randen minimaal 3:1. De tokens in 2.1 halen dat. Controleer de definitieve accentkleur opnieuw.
- Tikdoelen minimaal 48 × 48 px, met minimaal 8 px tussen tikdoelen.
- Een skiplink "Naar de inhoud" als eerste focusbaar element.
- Eén `<h1>` per pagina en een logische koppenvolgorde.
- `lang="nl"` op `<html>`.
- Landmarks: `<header>`, `<nav aria-label="Hoofdmenu">`, `<main>`, `<footer>`.
- Telefoonlinks krijgen een duidelijke naam: `aria-label="Bel 06 53 31 26 07"` als de zichtbare tekst alleen "Bellen" is.
- De site werkt zonder JavaScript. Alleen het mobiele menu heeft JS nodig; zonder JS staat het menu uitgeklapt onder de header.

---

## 11. Tekststijl in de interface

- U-vorm, korte zinnen, nuchter (BRIEF A2). Geen uitroeptekens, geen emoji, geen "Neem vrijblijvend contact op".
- Knoppen beginnen met een werkwoord: "Bel …", "WhatsApp ons", "Plan uw route".
- Gebruik de concepteksten uit BRIEF A3/A4 letterlijk als basis. Verbeter alleen spelling en lopen.
- Nooit tonen (BRIEF A2):
  - ophalen langs de deur bij particulieren
  - een lijst met geweigerde metalen
  - kiloprijzen of prijslijsten
  - losse containermaten
  - reviews
  - een lang verhaal over de geschiedenis
  - verzonnen cijfers of klantlogo's

---

## 12. Techniek die het ontwerp raakt

- Statische site: Vite MPA met gewone HTML-pagina's (zie CLAUDE.md §2). Geen React en geen CSS-framework; werk met de tokens hierboven in `src/styles/tokens.css`.
- Totale CSS bij voorkeur onder 30 KB en JS onder 10 KB (alleen het mobiele menu).
- Eén lettertypebestand (variabel woff2, Latin), zelf gehost.
- Geen externe scripts, geen cookies, geen tracking (BRIEF A8).
- Doel: Lighthouse mobiel minimaal 90 op Performance, Accessibility, Best Practices en SEO.

---

## 13. Controle vóór oplevering

- [ ] Elke pagina bekeken op 360, 768, 1280 en 1440 px breed. Geen horizontale scroll.
- [ ] Op elk scherm is een belknop of telefoonnummer zichtbaar (sticky header of mobiele balk).
- [ ] Op geen enkel scherm staan twee accentknoppen naast elkaar.
- [ ] De accentkleur is uit het logo of de wagen gehaald, staat in `OPEN-PUNTEN.md` en haalt 4,5:1 met de knoptekst.
- [ ] Het logo staat scherp op de juiste ondergrond, en het favicon werkt.
- [ ] De hero-uitsnede toont de cabine van de vrachtwagen, op mobiel en desktop.
- [ ] Alle foto's zijn WebP, met alt-tekst, `width`/`height`, en lazy behalve de hero.
- [ ] Het lettertype is zelf gehost; er zijn geen verzoeken naar fonts.googleapis.com of andere derden.
- [ ] De focusring is zichtbaar bij het tabben door alle pagina's.
- [ ] Animaties staan uit bij `prefers-reduced-motion`.
- [ ] De vaste mobiele balk bedekt geen inhoud of footer.
