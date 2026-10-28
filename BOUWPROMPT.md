# Bouwprompt — website Bloemers Metaal

> Plak dit hele bestand in Claude Code, gestart in de map `Bloemers Metaal`. Of typ: *"Lees BOUWPROMPT.md en voer hem uit."*

---

Je bouwt de complete website van **Bloemers Metaal** (Oss, sinds 1959): zes pagina's, plus privacy en 404. Het doel is één ding: een bezoeker belt Bloemers. Alles wat je bouwt, schrijft of weglaat, toets je daaraan.

Je werkt zelfstandig van begin tot eind. **Maak geen apart plan, wacht niet op akkoord en gebruik geen superpowers-skills** (geen brainstorming, writing-plans, executing-plans, subagent-driven-development of andere `superpowers:*`). De BRIEF.md A10-startprompt vraagt om eerst een plan te laten zien. Die stap vervalt: de werkwijze hieronder ís het plan. Begin direct.

## 1. Lees eerst alles, volledig, in deze volgorde

| # | Bestand | Waarvoor |
|---|---|---|
| 1 | `CLAUDE.md` | Werkregels, projectvorm, screenshotworkflow, "Done means" |
| 2 | `BRIEF.md` | **Deel A** is de bouwopdracht: gegevens (A1), boodschap en verboden inhoud (A2), sitemap en teksten (A3), FAQ (A4), ontwerp (A5), knoppen (A6), SEO (A7), techniek (A8), open punten (A9). Deel B is achtergrond. |
| 3 | `DESIGN.md` | Het volledige visuele ontwerp: tokens, typografie, ruimte, componenten 6.1–6.14, opbouw per pagina, foto's, beweging, toegankelijkheid |
| 4 | `PRODUCT.md` | Register (brand), doelgroep, persoonlijkheid, anti-referenties |
| 5 | `OPEN-PUNTEN.md` | Wat nog niet vaststaat, en wat je dus níet invult |
| 6 | `docs/Analyse Bloemers Metaal.md` + `docs/Websiteconcept homepage en sitemap.png` | Context: concurrentie, positionering, de homepage-opbouw als tekening. Bekijk de PNG met de Read-tool. |
| 7 | `brand_assets/` | Logo en foto's. Kijk naar elke foto voordat je hem plaatst. |

**Wie wint bij een conflict:**

1. `BRIEF.md` deel A wint op inhoud, feiten en teksten.
2. `DESIGN.md` wint op alles wat visueel is.
3. `PRODUCT.md` wint op toon en merkgevoel.
4. `CLAUDE.md` wint op werkwijze.
5. Skills geven checklists en kritiek, maar overrulen nooit 1–4. Een skill die iets anders voorstelt dan DESIGN.md (ander font, andere kleur, ander patroon, meer animatie) volg je níet. Noteer het voorstel kort in je eindrapport als je het de moeite waard vindt.

## 2. Skills: welke, wanneer, waarvoor

Gebruik elke skill die hieronder staat en geïnstalleerd is. Ontbreekt er een, meld dat in één regel en ga door. Laad een skill pas op het moment dat hij aan de beurt is, niet allemaal vooraf.

| Skill | Moment | Wat je ermee doet | Wat hij níet mag |
|---|---|---|---|
| **impeccable** | Start (stap 0), daarna bij elke kritiekronde | Register `brand` zetten, PRODUCT.md laten lezen, craft-regels handhaven, audit/polish-passes over elke pagina | De tokens of het font uit DESIGN.md vervangen |
| **ui-ux-pro-max** | Stap 0 en vóór elk nieuw componenttype | Design-system search met gerichte queries (zie hieronder); de toegankelijkheids-, interactie- en mobiele checklists afwerken | Een palet, font of landingspatroon kiezen. Zijn picks zijn een menu, geen besluit (CLAUDE.md §1). |
| **taste** (de taste-/design-taste-skill) | Na de eerste build van Home, en na elke pagina | Kritische smaakronde: wat voelt generiek, template-achtig of "AI"? Hiërarchie, ritme, witruimte, typografisch contrast, details. Verbeter binnen de grenzen van DESIGN.md. | Bold/experimentele richtingen opleggen die botsen met "wit, rustig, professioneel" (BRIEF A5). Asymmetrie, overlap of motion toevoegen buiten DESIGN.md §9. |
| **frontend-design** | Bij het bouwen van componenten | Productiekwaliteit: precisie in spacing, typografie en states | Een eigen esthetische richting kiezen. Die ligt vast in DESIGN.md §1. |
| **stop-slop** | Na het bouwen van elke pagina én als laatste pass over de hele site | Elke string voor bezoekers aanscherpen: koppen, broodtekst, knoppen, alt-teksten, `<title>`, meta descriptions, FAQ, 404, privacy, JSON-LD-teksten | Feiten toevoegen, weghalen of veranderen. Teksten uit BRIEF A3/A4 blijven inhoudelijk gelijk; alleen spelling, lopen en slop eruit. De u-vorm blijft. |
| **design:accessibility-review** | Stap 7 | WCAG 2.1 AA-audit per pagina | — |
| **design:ux-copy** | Alleen voor microcopy die de brief niet geeft (knoplabels 404, aria-labels, "Route plannen") | Korte, functionele labels | Nieuwe claims of verkooptekst |
| **marketing:seo-audit** | Stap 6 | Controle van titels, descriptions, koppen, structured data, sitemap tegen BRIEF A7 | Zoekwoorden opsommen of teksten volstoppen |

**ui-ux-pro-max: queries om te draaien** (pad: zie CLAUDE.md §1):

```bash
python "<pad>/search.py" "local trade service business call to action mobile" --design-system
python "<pad>/search.py" "sticky mobile call bar click to call"
python "<pad>/search.py" "accordion faq accessibility details summary"
python "<pad>/search.py" "hero image overlay text contrast"
```

Neem de checklists over en negeer de palet- en fontvoorstellen.

**Skillpaden controleren:** de paden in CLAUDE.md §1 (`C:/Users/jbfok/...`) komen van een andere machine. Zoek de echte paden onder `%USERPROFILE%\.claude\skills` en `%USERPROFILE%\.claude\plugins\cache`. Werkt een pad niet, werk dan CLAUDE.md §1 bij met het juiste pad.

## 3. Werkwijze

Voer de stappen in deze volgorde uit. Na elke stap: screenshots volgens CLAUDE.md §4 (1440, 768, 390, plus 360 voor telefoonnummers), eerst het REPORT-blok, dan de PNG's bekijken, minimaal twee vergelijkingsrondes. Verschillen benoem je in getallen.

### Stap 0 — Opzet

1. Laad **impeccable** (`node "<pad>/context.mjs"`) en **ui-ux-pro-max** (queries hierboven).
2. Controleer `brand_assets/`:
   - Staan logo en foto's er? Zet ze dan in `brand_assets/logo/` en `brand_assets/photos/`, en hernoem naar duidelijke namen (`vrachtwagen-voorkant.jpg`, `heftruck.jpg`, `heftruck-containers.jpg`).
   - Ontbreken ze? Gebruik genummerde placeholders (CLAUDE.md §5) en zet ze in OPEN-PUNTEN.md.
3. Bepaal de accentkleur volgens DESIGN.md §2.2:
   - kijk naar het logo en de vrachtwagenfoto;
   - meet het contrast;
   - zet de hex in `tokens.css`;
   - noteer hem in OPEN-PUNTEN.md, punt 2.
4. Zet het project op volgens CLAUDE.md §2:
   - `npm init`, `vite`, `@fontsource-variable/archivo`, `sharp` (afbeeldingen) en `puppeteer` (screenshots);
   - kopieer `serve.mjs` en `screenshot.mjs` uit `%USERPROFILE%\NieuweOldFashioned`;
   - maak `vite.config.ts` met alle pagina's in `rollupOptions.input` en een partials-oplossing voor de gedeelde onderdelen;
   - draai `git init` met een `.gitignore` voor `node_modules`, `dist` en `temporary screenshots`.
5. Schrijf `scripts/images.mjs`:
   - `brand_assets/photos/` → WebP in `public/img/`;
   - breedtes 640/1024/1600/2000;
   - ≈ 200 KB max (hero ≤ 250 KB);
   - plus `og-image.jpg` (1200 × 630) en de favicons uit het logo.

### Stap 1 — Fundament

- `src/styles/tokens.css`: exact de tokens uit DESIGN.md §2.1, §3 en §4. Dit is de enige plek met hex-waarden.
- `src/styles/base.css`:
  - reset en typeschaal (§3.1);
  - layout en container (§4.2);
  - knoppen `.btn-call` en `.btn-whatsapp` (§6.1);
  - focusstijlen (wit op antraciet, accent op licht);
  - `.eyebrow`;
  - `prefers-reduced-motion`.
- Partials: contactbalk (§6.2), header + mobiel menu (§6.3), belbalk (§6.8), footer (§6.11), vaste mobiele balk (§6.12).
- `src/scripts/menu.ts`: alleen het mobiele menu:
  - `aria-expanded`;
  - focus blijft binnen het menu;
  - Esc sluit het menu;
  - zonder JS uitgeklapt.

### Stap 2 — Home

1. Bouw de homepage exact in de volgorde van BRIEF A3 en DESIGN.md §6.4–6.8. Gebruik de tekening in `docs/` als structuurreferentie, niet als pixelreferentie.
2. Screenshots en twee vergelijkingsrondes.
3. **taste**-ronde: wat ziet er nog generiek uit? Verbeter dat binnen DESIGN.md.
4. **impeccable** audit-pass.
5. **stop-slop** over alle tekst op Home.
6. Screenshots opnieuw.

### Stap 3 — Overige pagina's

Bouw Diensten, Prijzen, Over ons, Veelgestelde vragen en Contact volgens BRIEF A3/A4 en DESIGN.md §6.9, §6.10, §6.13 en §7. Per pagina: screenshots → taste → stop-slop → screenshots.

- **Contact:** statische kaart plus de link "Route plannen". Geen iframe en geen formulier.
- **FAQ:** `<details>`/`<summary>`, de volgorde uit A4, plus `FAQPage`-JSON-LD.

### Stap 4 — Privacy en 404

- **`privacy/`:** een korte standaardverklaring, omdat bezoekers gegevens sturen via e-mail en WhatsApp. Er zijn geen cookies en geen tracking. Gebruik de bedrijfsgegevens uit A1. Wat je niet weet (bewaartermijn, verwerkers) zet je als `[INVULLEN]` en neem je op in OPEN-PUNTEN.md.
- **`404.html`:** volgens DESIGN.md §6.14.

### Stap 5 — Afbeeldingen

1. Draai `scripts/images.mjs`.
2. Geef elke `<img>`:
   - `srcset` en `sizes`;
   - `width` en `height`;
   - `loading="lazy"` en `decoding="async"`, behalve de hero, die `fetchpriority="high"` krijgt;
   - een Nederlandse alt-tekst (DESIGN.md §8).
3. Controleer de hero-uitsnede op 360 en 1440: de cabine moet in beeld blijven.

### Stap 6 — Vindbaarheid

- Per pagina de `<title>`, meta description en `<h1>` exact uit BRIEF A7.
- `lang="nl"`, canonical URLs op `https://bloemers-metaal.nl/...`, Open Graph- en Twitter-tags met `og-image.jpg`.
- `RecyclingCenter`-JSON-LD uit A7 op elke pagina, `FAQPage` op de FAQ-pagina.
- `public/sitemap.xml` en `public/robots.txt`.
- Draai **marketing:seo-audit** en los op wat binnen de brief valt.

### Stap 7 — Audits

1. **design:accessibility-review** per pagina.
2. Tab met het toetsenbord door elke pagina: focus moet overal zichtbaar zijn en de volgorde logisch.
3. Bekijk de site met JavaScript uit: alle inhoud moet zichtbaar zijn.
4. Zet `prefers-reduced-motion` aan: niets mag breken.
5. `npm run build` en Lighthouse mobiel op de build voor alle pagina's. Doel: ≥ 90 op Performance, Accessibility, Best Practices en SEO. Lager? Repareren en opnieuw meten.
6. Controleer het netwerk: **nul** verzoeken naar externe hosts (fonts, kaarten, analytics, CDN's).
7. Laatste **taste**-ronde en **impeccable** polish-pass over de hele site.

### Stap 8 — Laatste tekstpass

Draai **stop-slop** over álle strings van de hele site in één keer: koppen, broodtekst, knoppen, alt-teksten, titels, descriptions, aria-labels, FAQ, 404, privacy. Daarna:

- leg de FAQ-tekst en de `FAQPage`-JSON-LD naast elkaar: ze moeten identiek zijn;
- controleer de NAP-gegevens tegen BRIEF A1, op elke pagina.

## 4. Harde inhoudsregels

- **Alleen feiten uit BRIEF.md.** Niets verzinnen: geen prijzen, containermaten, aantallen jaren behalve "sinds 1959", reviews, klantnamen, cijfers of beloftes (zoals "binnen 24 uur").
- **Nooit op de site (BRIEF A2):**
  - ophalen langs de deur bij particulieren
  - een lijst met metalen die niet worden aangenomen
  - kiloprijzen of prijslijsten
  - losse containermaten
  - reviews of een reviewpagina
  - een uitgebreid verhaal over de geschiedenis
  - verzonnen gegevens of klantlogo's
  - een contactformulier
- **Niet toevoegen tot Willy akkoord geeft** (OPEN-PUNTEN.md punten 3–9):
  - gratis ophalen
  - containerwissel binnen 24 uur
  - stapelbakken
  - het vaste nummer 0412-651849
  - het VIHB-nummer
  - het Hotmail-adres
- **Gegevens exact zoals in BRIEF A1:**
  - `06 53 31 26 07` (voorkeur) en `06 11 19 68 87`, met harde spaties, nooit afgebroken
  - `info@bloemers-metaal.nl`
  - Ritchiestraat 4, 5346 TZ Oss
  - ma t/m za 08:00 – 19:00 uur, na 18:00 uur op afspraak
  - KvK 16562310
  - NIWO-gecertificeerd
- **Links exact zoals in BRIEF A6.** WhatsApp 1 krijgt de starttekst; WhatsApp 2 niet.
- **Toon:** u-vorm, korte zinnen, nuchter. Geen uitroeptekens, geen emoji, geen superlatieven, geen "vrijblijvend".

## 5. Ontwerp in het kort (details in DESIGN.md)

- "De vakman met de nette vrachtwagen": wit en rustig, antraciet `#1E2328` voor de balken, één accentkleur **alleen** voor belknoppen.
- Archivo variabel en zelf gehost. Brede, zware koppen (`wdth` 108–125, `wght` 700–800), body 17 px.
- **Het herkenbare moment:** het telefoonnummer groot in de belbalk, in de stijl van belettering op een bedrijfswagen.
- Op elk scherm is een belknop of nummer zichtbaar. Maximaal één accentknop per schermhoogte. WhatsApp is altijd secundair.
- Strakke hoeken (4 px), randen in plaats van schaduwen, geen gradients behalve de hero-overlay.
- Labels (eyebrows) alleen in de hero, de paginakoppen en bij "1959". Niet boven elke sectie.
- Beweging: alleen de hero-tekst bij het laden, plus kleurovergangen op knoppen.
- Alleen echte foto's van de klant. Geen stockfoto's, geen AI-beelden.

## 6. Klaar betekent

Werk de volledige checklist af uit CLAUDE.md §10, uit BRIEF.md A8 en uit DESIGN.md §13. Vink niets af wat je niet met een screenshot, meting of commando hebt gecontroleerd.

## 7. Eindrapport

Sluit af met een kort rapport in het Nederlands, in deze vorm:

1. **Gebouwd:** de pagina's en de belangrijkste bestanden, in één regel per onderdeel.
2. **Gemeten:** de Lighthouse-scores per pagina (mobiel) in een tabel, plus het aantal externe verzoeken (moet 0 zijn).
3. **Accentkleur:** de gekozen hex, waar hij vandaan komt en de contrastwaarde.
4. **Skills:** per skill in één regel wat hij heeft veranderd. Noem ook voorstellen die je bewust níet hebt overgenomen, en waarom.
5. **Open:** alles wat in OPEN-PUNTEN.md is bijgekomen (`[INVULLEN]`, placeholders, vragen).
6. **Lokaal bekijken:** het commando en de URL.

Begin nu met stap 0.
