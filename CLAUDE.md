# CLAUDE.md — Frontend Rules

Scope: the public site for Bloemers Metaal. That is the six pages (`index.html`, `diensten/`,
`prijzen/`, `over-ons/`, `veelgestelde-vragen/`, `contact/`) plus `privacy/` and `404.html`.

This file is a template. The workflow sections are fixed across projects; the brand
block is filled in per project.

## 0. Project documents

Read these before anything else. They beat this file on their own subject:

| File | Holds | Wins on |
|---|---|---|
| `BRIEF.md` | Client brief. Part A is the build spec; part B is background. | Content, copy, facts, page list, what must never appear |
| `DESIGN.md` | Colors, type, spacing, components, page layouts (in Dutch) | Everything visual |
| `PRODUCT.md` | Register, audience, personality, anti-references | Tone and brand judgment |
| `brand_assets/` | Logo and the client's real photos | Imagery |

- Use only facts from `BRIEF.md`. Never invent prices, container sizes, reviews, names, numbers
  or contact details.
- Missing fact → write `[INVULLEN]` and add the point to `OPEN-PUNTEN.md`.

## 1. Always do first

Every session, before writing any frontend code, in this order:

1. **`impeccable`** — sets register, reads `PRODUCT.md`, enforces craft. Public pages are
   the brand register, not the product register.
2. **`ui-ux-pro-max`** — design system search, accessibility and interaction checklists.
3. Build.
4. **`stop-slop`** — run over every user-visible string before it ships. Headings, body,
   button labels, error messages, empty states, alt text.

No exceptions, including for a one-line change.

**Paths.** On the machine this file was written on (user `jbfok`):

```bash
node "C:/Users/jbfok/.claude/skills/impeccable/scripts/context.mjs"
python "C:/Users/jbfok/.claude/plugins/cache/ui-ux-pro-max-skill/ui-ux-pro-max/2.5.0/src/ui-ux-pro-max/scripts/search.py" "<query>" --design-system
```

On the `Bas` machine (checked 22-10-2026) neither `impeccable` nor `ui-ux-pro-max` is installed,
and Python is not installed either. Installed there: `design-taste-frontend` (taste), at
`C:/Users/Bas/.claude/skills/design-taste-frontend/`:

```bash
node "C:/Users/Bas/.claude/skills/design-taste-frontend/scripts/lint.mjs" index.html src
node "C:/Users/Bas/.claude/skills/design-taste-frontend/scripts/inspect.mjs" http://localhost:3000/ --out .taste-skill/home
```

Also available as plugin skills: `frontend-design` and `stop-slop`. Content and SEO checks
against the brief: `npm run build && node scripts/check.mjs`. There is no `.claude/skills/` in this repo.

**Who overrules whom.** `BRIEF.md` (content), `DESIGN.md` (visuals), `PRODUCT.md` and
`brand_assets/` are the truth and beat any skill output. `ui-ux-pro-max --design-system`
returns a menu, not a verdict. Take its checklists, and drop its picks when they fight the brand.
`stop-slop` tightens wording but never adds or removes facts from `BRIEF.md`.

## 2. Project shape

Vite MPA with **plain static HTML, no React**. The site is six content pages with no form,
no shop and no login (BRIEF A8). JavaScript is limited to the mobile menu.

```
index.html                     home
<page>/index.html              diensten, prijzen, over-ons, veelgestelde-vragen, contact, privacy
404.html
src/styles/tokens.css          design tokens from DESIGN.md §2–4 (single source)
src/styles/base.css            reset, type scale, layout, shared components
src/scripts/menu.ts            mobile menu only (< 10 KB total JS)
src/partials/                  header (incl. skip link), call band, footer, mobile call bar
public/fonts/                  Archivo variable woff2 (Latin), self-hosted
public/robots.txt, sitemap.xml, favicon.svg, apple-touch-icon.png, og-image.jpg
brand_assets/                  logo/ and photos/ from the client (originals)
```

- Shared chrome (header, call band, footer, mobile bar) lives once in `src/partials/`
  and is injected at build time with a Vite HTML-partials plugin or a small `transformIndexHtml`
  hook. Never copy-paste it into six pages by hand.
- A new page is not wired up until it is in `vite.config.ts` `rollupOptions.input` **and**
  served with a trailing slash. Miss either and it 404s in dev or vanishes from the build.
- Photos are converted from `brand_assets/photos/` to WebP (≈ 200 KB max, hero ≤ 250 KB) with
  `srcset` widths 640/1024/1600/2000 by a script in `scripts/`. Originals stay untouched.

## 3. Local server

```bash
node serve.mjs        # Vite dev server on http://localhost:3000
```

- `serve.mjs` and `screenshot.mjs` started from the NieuweOldFashioned copies but were rewritten here: the originals call a missing `check-env.mjs` and have no viewport presets or REPORT block.
- Screenshots come from localhost. Never `file://`.
- Already running? Do not start a second instance. Port 3000 is strict.
- URLs need the trailing slash: `/diensten/`, not `/diensten`.

## 4. Screenshot workflow

```bash
node screenshot.mjs http://localhost:3000/ hero all
node screenshot.mjs http://localhost:3000/contact/ contact mobile
```

Arguments: `<url> [label] [desktop|tablet|mobile|all|<px>] [fullPage]`. Files land in
`./temporary screenshots/screenshot-N[-label][-viewport].png`, auto-incremented, never
overwritten. Chrome resolves from the newest build in `~/.cache/puppeteer/chrome/`.

Required every build round:

- All three viewports: **1440 desktop, 768 tablet, 390 mobile**. Tablet is where headings
  overflow and mobile is where layouts break. Also check **360** for the phone numbers and
  the mobile call bar.
- **Read the REPORT block first.** The script prints page errors, console errors, failed
  requests, horizontal overflow, and reveal-gated sections. A screenshot can look fine on a
  page that crashed. Fix everything in the report before comparing a single pixel.
- **Then read the PNGs** with the Read tool and look at them.
- **At least two comparison rounds.** Shoot, name the differences, fix, shoot again. Stop when
  nothing visible is off, or when the user says stop. Never stop after one pass.
- Name differences in numbers, not adjectives: "heading is 32px, scale says ~44px",
  "card gap 16px, should be 24px", "accent reads #D9480F, token is #C2410C". Check spacing,
  font size/weight/line-height, exact hex, alignment, radius, image sizing.

## 5. Reference images and placeholders

**With a reference image:** match layout, spacing, typography and color exactly. Swap in
placeholder content. Do not improve it, do not add to it. Reference screenshots live in
`docs/design-references/`.

**Without a reference image:** design it from `DESIGN.md`. This project has real photos, so
placeholders are the exception. Use one only when no client photo fits the slot, and number it:

```html
<img src="https://placehold.co/800x600/1E2328/FFFFFF?text=3"
     alt="Placeholder 3" width="800" height="600">
```

Numbering runs 1, 2, 3… per page, so real photos can be assigned by number later. Brand colors,
not default gray. Always set `width` and `height` to hold the space. No placeholder ships: list
every remaining one in `OPEN-PUNTEN.md`.

## 6. Brand and assets

Check `brand_assets/` before designing — see its README. Real asset present means real asset
ships; a placeholder next to an available photo is a mistake. `PRODUCT.md` holds brand
personality, audience and anti-references. `DESIGN.md` holds the full visual spec.

`src/styles/tokens.css` is the only place a hex value is written. These values are the
source of truth:

| Token                  | Value     | Role                                            |
|------------------------|-----------|-------------------------------------------------|
| `--color-bg`           | `#FFFFFF` | page background (client: white)                |
| `--color-surface`      | `#F3F4F5` | alternating sections, page headers, icon tiles  |
| `--color-border`       | `#D9DDE1` | card and divider lines (never text)             |
| `--color-ink`          | `#16191D` | headings and body on light — 17.6:1             |
| `--color-ink-muted`    | `#4A525C` | secondary copy on light — 7.9:1                 |
| `--color-dark`         | `#1E2328` | header, call band (anthracite); footer uses ink |
| `--color-on-dark`      | `#FFFFFF` | text on anthracite — 15.8:1                     |
| `--color-on-dark-muted`| `#B8C0C8` | secondary copy on anthracite — 8.6:1            |
| `--color-accent`       | `#C2410C` | **call buttons only** — `[INVULLEN]`, see below |
| `--color-accent-hover` | `#9A3412` | pressed / hover accent                          |
| `--color-on-accent`    | `#FFFFFF` | text on accent — 5.2:1                          |
| `--color-whatsapp`     | `#25D366` | WhatsApp icon only, never text or fill          |

The accent is a proposal. Pull the real one from the logo or the truck. Keep white text at
≥ 4.5:1 or darken it, and log the hex in `OPEN-PUNTEN.md` (DESIGN.md §2.2).

Type: **Archivo** variable (one family, BRIEF A5), self-hosted from `public/fonts/`. Headings
use `wght` 700–800 and `wdth` 108–125; body uses `wght` 400 and `wdth` 100 at 17 px. No Google
Fonts link. Shared classes `.btn-call`, `.btn-whatsapp` and `.eyebrow` live in
`src/styles/base.css` only.

## 7. Output defaults

- Plain CSS with custom properties. **No Tailwind CDN, no CSS framework, no external scripts,
  no cookies, no tracking** (BRIEF A8). This differs from the NieuweOldFashioned defaults.
- Page-level CSS goes in `base.css` sections; there are no inline `<style>` blocks per page.
- Site copy is Dutch, u-form. Comments and code are English.
- Mobile-first, `min-width` queries at 640 / 960 / 1200.
- Each page gets its own `<title>`, meta description and `<h1>` from BRIEF A7. Every page
  gets the `RecyclingCenter` JSON-LD from BRIEF A7, and the FAQ page also gets `FAQPage`.

## 8. Craft rules

`impeccable` covers the general craft bans. These are the ones this kind of site gets wrong:

- **Never gate content visibility on a class-triggered transition.** `opacity: 0` until JS adds
  `.visible` means no JS, no content — for crawlers, for headless renders, for anyone whose
  observer never fires. Content is visible by default; the reveal is the enhancement. Use
  `@starting-style` or an animation that runs from a visible base. The only animation here is
  the hero text on load (DESIGN.md §9).
- **One accent button per screen height.** The call button is always the loudest element;
  WhatsApp is always the secondary style.
- **Phone numbers never wrap.** Write `06&nbsp;53&nbsp;31&nbsp;26&nbsp;07`, set
  `white-space: nowrap`, and check the large-number style at 360 px.
- Focus-visible states must survive on `#1E2328`: use a white outline on dark surfaces and the
  accent outline on light ones.
- Body copy on dark uses `--color-on-dark-muted` at minimum, never `--color-ink-muted`.
- The mobile call bar is `position: fixed`. The body gets matching bottom padding, so the
  footer is never covered.
- No Google Maps iframe (it sets cookies). Use a static map image with a "Route plannen" link.

## 9. Hard rules

- Do not add sections, features or content that are not in `BRIEF.md` part A or `DESIGN.md`.
- Never show any of these (BRIEF A2):
  - door-to-door collection from private homes
  - a list of refused metals
  - prices per kilo or price lists
  - specific container sizes
  - reviews
  - a long history story
  - invented names, numbers or client logos
- No contact form.
- Do not "improve" a reference design. Match it.
- Do not stop after one screenshot pass.
- Do not ship with anything in the screenshot REPORT block.
- Do not use `transition: all`.
- Do not hardcode a hex that is not in the token table.
- Do not use stock photos or AI-generated images.
- Do not add a page without updating `vite.config.ts`.

## 10. Done means

- [ ] Screenshot at 1440, 768 and 390 (plus 360 for phone numbers), and all read.
- [ ] Two or more comparison rounds done.
- [ ] REPORT clean: 0 page errors, 0 console errors, 0 failed requests.
- [ ] No horizontal scroll at 360.
- [ ] Body text ≥ 4.5:1, large text ≥ 3:1 against its actual background.
- [ ] Tab through the page: every interactive element shows a visible focus state.
- [ ] `prefers-reduced-motion: reduce` on: nothing breaks, nothing stays hidden.
- [ ] Content renders with JS disabled.
- [ ] Both `tel:` links, both WhatsApp links and the `mailto:` link open the right target.
- [ ] Name, address, phone, hours and KvK match BRIEF A1 on every page.
- [ ] Title, description and h1 per page match BRIEF A7. `sitemap.xml` and `robots.txt` are present.
- [ ] No requests to third-party hosts (fonts, maps, analytics).
- [ ] Lighthouse mobile ≥ 90 for Performance, Accessibility, Best Practices and SEO.
- [ ] Every user-visible string passed through `stop-slop`.
- [ ] Tokens only, no stray hex values.
- [ ] `OPEN-PUNTEN.md` lists every `[INVULLEN]` and every remaining placeholder.
