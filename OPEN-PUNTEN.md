# Open punten — Bloemers Metaal

Lijst met alles wat nog niet vaststaat. Claude Code werkt deze lijst bij: elk `[INVULLEN]` en elke overgebleven placeholder komt hier. Afgevinkt = beantwoord en verwerkt.

Bronnen: BRIEF.md A9 en de analyse (`docs/Analyse Bloemers Metaal.md`).

## Voorleggen aan Willy (via Bram)

| # | Punt | Waarom | Tot die tijd | Status |
|---|---|---|---|---|
| 1 | Spelling bedrijfsnaam: "Bloemers Metaal" of "W. Bloemers Metaal"? | Online staan vier varianten | "Bloemers Metaal" | open |
| 2 | Accentkleur: kleur van het logo of van de vrachtwagen? | Belknoppen | `#C2410C` (roestoranje, DESIGN.md §2.2 stap 5), hover `#9A3412`. Witte knoptekst 5,18:1 (hover 7,31:1). De vrachtwagens op de foto's zijn zilver en wit met zwarte belettering: geen bruikbare signaalkleur, daarom het voorstel aangehouden. (Het rood op de foto is de Linde-heftruck, geen huiskleur.) Logo-bestand nog niet ontvangen. | open |
| 20 | Op de DAF staat "BLOEMRS-METAAL.NL" (zonder tweede e). Weet Willy dit? | De foto staat groot op Home en Over ons | Foto gebruikt zoals hij is | open |
| 21 | Mogen de kentekens (BD-913-D, 06-1366-7) zichtbaar op de site? | Privacy/veiligheid, keuze klant | Zichtbaar gelaten | open |
| 3 | Is ophalen gratis boven de minimale hoeveelheid? | Staat op de oude site, niet in de brief | Niet noemen | open |
| 4 | Wisselt u containers nog binnen 24 uur? | Staat op de oude site, niet in de brief | Niet noemen | open |
| 5 | Heeft u nog kleine stapelbakken met aftapkranen? | Staat op de oude site, niet in de brief | Niet noemen | open |
| 6 | Werkt het vaste nummer 0412-651849 nog? | Staat bij Telefoonboek.nl | Niet op de site | open |
| 7 | Is "Bloemers K" in Oss hetzelfde bedrijf of familie? | Vermelding op oudijzer-handel.nl | — | open |
| 8 | Wat is uw VIHB-nummer (NIWO), en mag het op de site? | Maakt NIWO controleerbaar | Alleen "NIWO-gecertificeerd" | open |
| 9 | Mag rolus11@hotmail.com doorsturen naar info@bloemers-metaal.nl? | Oud adres staat nog online | — | open |
| 10 | Btw-nummer: mag het op de site, en welk nummer? | Footer | Weglaten | open |
| 11 | Socials (Facebook, Instagram)? | Footer | Weglaten | open |
| 12 | Google-bedrijfsprofiel: bestaat het, wie kan inloggen? | Vindbaarheid | Geen koppeling | open |
| 13 | Kaart op de contactpagina? | Voorstel, nog niet besproken | Statische kaart + "Route plannen" | open |
| 14 | Statistieken gewenst? | Tracking vereist mogelijk cookiemelding | Geen tracking | open |
| 15 | Bestaande privacyverklaring of voorwaarden? | Footer | Standaard privacyverklaring | open |
| 16 | Bij welk bedrijf staat het domein? | Livegang en e-mail | Site klaarzetten | open |
| 17 | Oude JouwWeb-site opzeggen of doorsturen? | Dubbele inhoud | Laten staan | open |
| 18 | Deadline en wie later aanpast | Planning | Zo snel mogelijk een concept | open |
| 19 | Contactgegevens bovenaan bevestigen ("staat half boven") | Opbouw | Contactbalk op 27-10-2026 verwijderd op verzoek van de opdrachtgever. Bellen blijft bovenaan via de knop "Bel ons" in de header (sticky) en op mobiel via de vaste balk onderaan. Wijkt af van BRIEF A3/A6; laten bevestigen door Willy. | besloten, bevestigen |
| 22 | Nieuwe teksten (27-10-2026) op Home ("Vader en zoon uit Oss"), Diensten, Prijzen en Over ons laten nalezen | De teksten zijn uitgebreid met uitleg over de werkwijze en de dagprijs. Ze bevatten geen nieuwe bedrijfsfeiten, maar wel algemene uitleg die Willy moet herkennen: een foto via WhatsApp sturen helpt, een container is handig bij een verbouwing of opruiming, onze vrachtwagen moet de plek kunnen bereiken, gescheiden metaal is meer waard, de prijs volgt de wereldmarkt, voorbeeldmetalen (oud ijzer, staal, plaatwerk, koper, aluminium, messing, rvs) | Zo laten staan | open |
| 26 | Nieuwe homesecties (27-10-2026) laten goedkeuren: "Werkgebied" met kaart en 100 km-cirkel rond Oss (noemt Brabant, Gelderland, Utrecht, noord-Limburg binnen 100 km; Groningen, Friesland, Zeeland als verder weg), en drie veelgestelde vragen | Niet letterlijk in BRIEF A3; feiten komen wel uit A2–A4. Kaart: `scripts/map-nl.mjs` (OSM, bronvermelding moet blijven staan) | Zo laten staan | open |
| 23 | Wegen jullie het metaal (weegbrug, of weegschaal op de wagen)? | Klanten willen weten hoe het gewicht wordt bepaald; staat nu niet op de site | Niet noemen | open |
| 24 | Moet een klant legitimatie laten zien bij contante betaling? | Bij metaalhandel gebruikelijk en mogelijk wettelijk verplicht; zou als tip op Diensten of in de FAQ kunnen | Niet noemen | open |
| 25 | Betaalt u direct bij het ophalen? | Uitleg werkwijze | Niet noemen | open |

## Voor de developer

- [x] Foto's ontvangen (22-10-2026): `brand_assets/photos/vrachtwagens-heftruck-voorkant.jpg` (DAF + MAN + heftruck) en `vrachtwagen-containerwagen-zijkant.jpg` (DAF met container). Een derde foto (losse rode Linde-heftruck) is **niet** gebruikt: er staat een watermerk van Troostwijk (veilingsite) op, het is geen eigen foto van Bloemers. Bron en uitsneden staan in `scripts/images.mjs`.
- [ ] Meer eigen foto's welkom: oud ijzer of metalen, het terrein, de containers los, vader en zoon. Nu is "Alle soorten metalen" geïllustreerd met de heftruck.
- [ ] **Logo-bestand ontbreekt nog.** Op de vrachtwagens staat een "MB"-monogram; vraag het originele bestand (SVG of PNG zonder achtergrond).
- [ ] Logo ontvangen? Vervang het tekstwoordmerk "BLOEMERS / METAAL · SINDS 1959" in `src/partials/header.html` en `src/partials/footer.html` door het logobestand (max. 44 px hoog, wit op antraciet), en vervang de "B"-favicon (`public/favicon.svg`) door een versie van het logo.
- [ ] Accentkleur uit het logo halen, contrast controleren, hexcode hier noteren (punt 2).
- [x] Hero-uitsnede gecontroleerd op 360, 768 en 1440: mobiel toont de witte MAN-cabine (`object-position: 78% 50%`), desktop beide wagens (`50% 40%`). Tekstcontrast op de foto gemeten: kop ≥ 4,2:1, intro ≥ 6,0:1, label op eigen antraciet plaatje 15,8:1.
- [ ] Extra diensten (punten 3–5) pas toevoegen na akkoord van Willy.
- [ ] Kaart op Contact: statische OpenStreetMap-uitsnede (`scripts/map.mjs`). De pin staat op de Ritchiestraat (straatniveau, OSM kent het huisnummer niet). Bronvermelding "© OpenStreetMap-bijdragers" moet blijven staan.

### Welke foto waar

| WebP in `public/img/` | Bron | Pagina en plek | Alt-tekst |
|---|---|---|---|
| `vrachtwagen-voorkant` | voorkant, heel | Home hero, `og-image.jpg` | Twee vrachtwagens van Bloemers Metaal met een heftruck ertussen, van voren gezien |
| `vrachtwagen-container` | zijkant, heel | Home kaart "Metaal ophalen", Diensten "Ophalen" | Vrachtwagen van Bloemers Metaal met een container voor oud ijzer |
| `container` | zijkant, uitsnede | Home kaart "Containers", Diensten "Containers" (niet meer op Prijzen) | Container met kettingen op de vrachtwagen van Bloemers Metaal |
| `heftruck` | voorkant, uitsnede | Home kaart "Alle soorten metalen", Diensten "Alle soorten metalen" | Heftruck tussen de vrachtwagens van Bloemers Metaal |
| `vrachtwagen-belettering` | voorkant, uitsnede | Home "Vader en zoon uit Oss" | Witte vrachtwagen met de belettering Bloemers Metaal Oss |

## [INVULLEN] en placeholders in de code

| Pagina | Plek | Wat ontbreekt |
|---|---|---|
| Over ons | Rechts naast de tekst | **Placeholder 1**: `public/img/placeholder-over-ons-1.svg`. Foto van de eigenaar opvragen (staand, liefst minstens 1000 px breed; vader en zoon samen kan ook). Daarna via `scripts/images.mjs` naar WebP met srcset, en de alt-tekst invullen. |
| Alle pagina's | Header en footer | Tekstwoordmerk in plaats van het logo |
| Alle pagina's | Favicon, apple-touch-icon | "B"-monogram in plaats van het logo |
| Privacy | Hele pagina | Ingevuld 27-10-2026: bewaartermijn 7 jaar, verwerkers als categorie (e-mailprovider, hosting, boekhouder, bank, WhatsApp/Meta), serverlogs zonder naam van de hoster. **Zodra de hoster bekend is:** controleren hoe lang die serverlogs bewaart, en met hoster, e-mailprovider en boekhouder een verwerkersovereenkomst afsluiten (AVG art. 28). Naam en termijn mogen dan in de tekst, hoeft niet. |
| Hosting | — | Redirect www ↔ zonder www en https (BRIEF A8) regelen bij de hoster; `404.html` als foutpagina instellen. |
