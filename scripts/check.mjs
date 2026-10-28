// Content and SEO checks on dist/ against BRIEF.md A1, A2, A4 and A7.
// Run after `npm run build`: node scripts/check.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

const A7 = {
  'index.html': ['Oud ijzer en metalen ophalen in heel Nederland | Bloemers Metaal', 'Al vanaf 1959 halen wij oud ijzer en alle soorten metalen op, door heel Nederland. Gratis containers, dagprijs, contant of per bank. Bel 06 53 31 26 07.', 'Al vanaf 1959 uw partner in oud ijzer en metalen'],
  'diensten/index.html': ['Metaal ophalen en gratis containers | Bloemers Metaal', 'Wij halen oud ijzer en metalen bij u op met onze eigen vrachtwagen en plaatsen gratis containers in diverse maten.', 'Onze diensten'],
  'prijzen/index.html': ['Dagprijs voor oud ijzer en metalen | Bloemers Metaal', 'Wij werken met de dagprijs. Bel voor de actuele prijs. Gratis container, betaling contant of per bank.', 'Prijzen'],
  'over-ons/index.html': ['Familiebedrijf sinds 1959 | Bloemers Metaal', 'Bloemers Metaal is een familiebedrijf van vader en zoon uit Oss, al vanaf 1959 uw partner in oud ijzer en metalen.', 'Al vanaf 1959 uw partner in oud ijzer en metalen'],
  'veelgestelde-vragen/index.html': ['Veelgestelde vragen | Bloemers Metaal', 'Waar komen wij, hoe werkt de dagprijs en wat kost een container? Hier vindt u de antwoorden.', 'Veelgestelde vragen'],
  'contact/index.html': ['Contact | Bloemers Metaal, Oss', 'Bel of app 06 53 31 26 07 of 06 11 19 68 87. Maandag t/m zaterdag 08:00 – 19:00 uur. Ritchiestraat 4, Oss.', 'Contact'],
  'privacy/index.html': [null, null, 'Privacyverklaring'],
  '404.html': [null, null, 'Deze pagina bestaat niet'],
};

const NAP = ['06&nbsp;53&nbsp;31&nbsp;26&nbsp;07', '06&nbsp;11&nbsp;19&nbsp;68&nbsp;87', 'info@bloemers-metaal.nl', 'Ritchiestraat 4', '5346 TZ Oss', 'KvK 16562310', 'NIWO-gecertificeerd', '08:00&nbsp;–&nbsp;19:00 uur', 'op afspraak'];
const LINKS = ['tel:+31653312607', 'tel:+31611196887', 'https://wa.me/31653312607?text=Hallo%2C%20ik%20heb%20oud%20ijzer%20of%20metaal%20en%20wil%20graag%20een%20afspraak%20maken.', 'mailto:info@bloemers-metaal.nl'];
// BRIEF A2 and OPEN-PUNTEN 3–9: must never appear.
const FORBIDDEN = [/per kilo/i, /kiloprijs/i, /€/, /\bm³|m3\b|kuub/i, /review/i, /langs de deur/i, /24 uur/i, /stapelbak/i, /0412/, /hotmail/i, /VIHB/i, /gratis ophal/i, /vrijblijvend/i, /!/];

const decode = (s) => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const visibleText = (html) => decode(html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/<head>[\s\S]*?<\/head>/, ''));

let fails = 0;
const fail = (page, msg) => { fails++; console.log(`FAIL ${page}: ${msg}`); };

for (const [file, [title, desc, h1]] of Object.entries(A7)) {
  const html = fs.readFileSync(path.join(dist, file), 'utf8');
  const get = (re) => (html.match(re) || [])[1];
  if (!/<html lang="nl">/.test(html)) fail(file, 'lang="nl" missing');
  if (/\{\{\w+\}\}|partial:/.test(html)) fail(file, 'unrendered partial or placeholder');
  const t = decode(get(/<title>([\s\S]*?)<\/title>/) || '');
  if (title && t !== title) fail(file, `title "${t}"`);
  const d = decode(get(/<meta name="description" content="([^"]*)"/) || '');
  if (desc && d !== desc) fail(file, `description "${d}"`);
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)];
  if (h1s.length !== 1) fail(file, `${h1s.length} h1 elements`);
  if (decode(h1s[0]?.[1] || '') !== h1) fail(file, `h1 "${decode(h1s[0]?.[1] || '')}"`);
  if (!/<link rel="canonical" href="https:\/\/bloemers-metaal\.nl\//.test(html)) fail(file, 'canonical');
  if (!/og:image" content="https:\/\/bloemers-metaal\.nl\/og-image\.jpg"/.test(html)) fail(file, 'og:image');

  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
  const rc = ld.find((x) => x['@type'] === 'RecyclingCenter');
  if (!rc || rc.telephone !== '+31653312607' || rc.address.postalCode !== '5346 TZ') fail(file, 'RecyclingCenter JSON-LD');

  const footer = html.slice(html.indexOf('<footer'));
  for (const n of NAP) if (!footer.includes(n)) fail(file, `footer misses ${n}`);
  for (const l of LINKS) if (!html.includes(l.replace(/&/g, '&amp;')) && !html.includes(l)) fail(file, `link missing ${l}`);

  const text = visibleText(html) + ' ' + ld.map((x) => JSON.stringify(x)).join(' ');
  for (const re of FORBIDDEN) {
    const m = text.match(re);
    if (m) fail(file, `forbidden "${m[0]}" …${text.slice(Math.max(0, m.index - 40), m.index + 40)}…`);
  }
  const todo = (visibleText(html).match(/\[INVULLEN[^\]]*\]/g) || []);
  if (todo.length) console.log(`note ${file}: ${todo.length}× ${[...new Set(todo)].join(' | ')}`);
  const placeholders = [...html.matchAll(/alt="(Placeholder[^"]*)"/g)].map((m) => m[1]);
  if (placeholders.length) console.log(`note ${file}: ${placeholders.length} placeholder photo(s)`);
  for (const img of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = img[0];
    for (const attr of ['alt=', 'width=', 'height=', 'srcset=', 'sizes=']) if (!tag.includes(attr)) fail(file, `img without ${attr} ${tag.slice(0, 60)}`);
    if (!/fetchpriority="high"/.test(tag) && !/loading="lazy"/.test(tag)) fail(file, 'img neither lazy nor priority');
  }
  // Phone numbers must never be able to wrap.
  if (/06 \d\d \d\d/.test(html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<head>[\s\S]*?<\/head>/, '').replace(/aria-label="[^"]*"/g, ''))) fail(file, 'phone number with breaking spaces');
}

// FAQ: visible text and FAQPage JSON-LD must match.
const faqHtml = fs.readFileSync(path.join(dist, 'veelgestelde-vragen/index.html'), 'utf8');
const faqLd = [...faqHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1])).find((x) => x['@type'] === 'FAQPage');
const items = [...faqHtml.matchAll(/<summary>([\s\S]*?)<svg[\s\S]*?<\/summary>\s*<p class="faq__answer">([\s\S]*?)<\/p>/g)].map((m) => [decode(m[1]), decode(m[2])]);
if (items.length !== 9 || faqLd.mainEntity.length !== 9) fail('faq', `count ${items.length}/${faqLd.mainEntity.length}`);
items.forEach(([q, a], i) => {
  const e = faqLd.mainEntity[i];
  if (e.name !== q) fail('faq', `question ${i + 1}: "${q}" vs "${e.name}"`);
  if (e.acceptedAnswer.text !== a) fail('faq', `answer ${i + 1} differs:\n  html: ${a}\n  ld:   ${e.acceptedAnswer.text}`);
});

// CSS: hex only in tokens, no transition: all.
const cssDir = path.join(root, 'src/styles');
for (const f of fs.readdirSync(cssDir)) {
  const css = fs.readFileSync(path.join(cssDir, f), 'utf8');
  if (f !== 'tokens.css' && /#[0-9a-f]{3,8}\b/i.test(css)) fail(f, 'hex outside tokens.css');
  if (/transition:\s*all/.test(css)) fail(f, 'transition: all');
}
for (const f of ['index.html', ...fs.readdirSync(root).filter((d) => fs.existsSync(path.join(root, d, 'index.html'))).map((d) => `${d}/index.html`), '404.html', ...fs.readdirSync(path.join(root, 'src/partials')).map((p) => `src/partials/${p}`)]) {
  const src = fs.readFileSync(path.join(root, f), 'utf8');
  if (/(?:fill|stroke|color|background)[=:]\s*"?#[0-9a-f]{3,8}/i.test(src)) fail(f, 'hex in markup');
  if (/<style/.test(src)) fail(f, 'inline <style> block');
}

console.log(fails ? `\n${fails} check(s) failed` : '\nAll checks passed');
process.exitCode = fails ? 1 : 0;
