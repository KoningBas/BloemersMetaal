// brand_assets/photos/* -> public/img/<slot>-<w>.webp, plus public/og-image.jpg,
// public/favicon.svg and public/apple-touch-icon.png. Originals stay untouched.
// Each slot names its source photo and an optional crop. A slot whose source is
// missing gets a placeholder in brand colors, so the layout holds.
// Never upscales: widths above the source (or crop) width are skipped.
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const photosDir = path.join(root, 'brand_assets/photos');
const logoDir = path.join(root, 'brand_assets/logo');
const outDir = path.join(root, 'public/img');
fs.mkdirSync(outDir, { recursive: true });

// Colors mirror src/styles/tokens.css (sharp cannot read CSS).
const DARK = '#1E2328';
const BORDER = '#D9DDE1';
const INK_MUTED = '#4A525C';

const FRONT = 'vrachtwagens-heftruck-voorkant.jpg';
const SIDE = 'vrachtwagen-containerwagen-zijkant.jpg';

const SLOTS = [
  // Two trucks and the forklift, front on. Hero, Open Graph.
  { slot: 'vrachtwagen-voorkant', source: FRONT, widths: [640, 800, 1024, 1536], hero: true },
  // Silver DAF with a skip container, side on.
  { slot: 'vrachtwagen-container', source: SIDE, widths: [640, 800, 1024, 1536] },
  // Crop: the container and the skip arm.
  { slot: 'container', source: SIDE, crop: { left: 771, top: 150, width: 780, height: 585 }, widths: [640, 760] },
  // Crop: the forklift between the trucks.
  { slot: 'heftruck', source: FRONT, crop: { left: 280, top: 310, width: 760, height: 570 }, widths: [640, 760] },
  // Crop: the white MAN with "BLOEMERS METAAL OSS" on the cab.
  { slot: 'vrachtwagen-belettering', source: FRONT, crop: { left: 763, top: 180, width: 773, height: 580 }, widths: [640, 760] },
];

const MAX_KB = 200;
const HERO_MAX_KB = 250;

function placeholder(subject, w, h) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <rect width="100%" height="100%" fill="${BORDER}"/>
  <text x="50%" y="50%" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="${Math.round(w / 30)}" fill="${INK_MUTED}">FOTO VOLGT · ${subject}</text>
</svg>`);
}

async function encode(input, width, maxKb) {
  // Step quality down until the file fits the budget.
  for (let q = 82; q >= 40; q -= 6) {
    const buf = await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: q, effort: 5 }).toBuffer();
    if (buf.length <= maxKb * 1024 || q - 6 < 40) return buf;
  }
}

const report = [];
for (const s of SLOTS) {
  const src = path.join(photosDir, s.source);
  let input;
  if (fs.existsSync(src)) {
    input = s.crop ? await sharp(src).rotate().extract(s.crop).toBuffer() : await sharp(src).rotate().toBuffer();
  } else {
    input = await sharp(placeholder(s.slot.toUpperCase(), 1600, 1200)).png().toBuffer();
  }
  const { width: srcW, height: srcH } = await sharp(input).metadata();
  const sizes = [];
  for (const w of s.widths.filter((w) => w <= srcW)) {
    const buf = await encode(input, w, s.hero ? HERO_MAX_KB : MAX_KB);
    fs.writeFileSync(path.join(outDir, `${s.slot}-${w}.webp`), buf);
    sizes.push(`${w}w ${Math.round(buf.length / 1024)}KB`);
  }
  report.push(`${s.slot}: ${fs.existsSync(src) ? s.source : 'PLACEHOLDER'} ${srcW}x${srcH} -> ${sizes.join(', ')}`);

  if (s.hero) {
    await sharp(input)
      .resize({ width: 1200, height: 630, fit: 'cover', position: 'centre' })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(path.join(root, 'public/og-image.jpg'));
  }
}

// Favicons: the logo if present, otherwise a "B" monogram on anthracite.
const logo = fs.existsSync(logoDir) && fs.readdirSync(logoDir).find((f) => /\.(svg|png)$/i.test(f));
const monogram = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="6" fill="${DARK}"/><text x="32" y="46" text-anchor="middle" font-family="Arial, sans-serif" font-weight="800" font-size="40" fill="#FFFFFF">B</text></svg>`;
if (logo) {
  const buf = fs.readFileSync(path.join(logoDir, logo));
  await sharp({ create: { width: 180, height: 180, channels: 4, background: DARK } })
    .composite([{ input: await sharp(buf).resize(140, 140, { fit: 'inside' }).toBuffer() }])
    .png()
    .toFile(path.join(root, 'public/apple-touch-icon.png'));
  report.push(`favicon: from ${logo} (favicon.svg left as monogram until an SVG logo arrives)`);
} else {
  await sharp(Buffer.from(monogram)).resize(180, 180).png().toFile(path.join(root, 'public/apple-touch-icon.png'));
  report.push('favicon: PLACEHOLDER monogram');
}
fs.writeFileSync(path.join(root, 'public/favicon.svg'), monogram);

console.log(report.join('\n'));
