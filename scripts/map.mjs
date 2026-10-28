// One-off: stitches OpenStreetMap tiles around Ritchiestraat 4, Oss into a
// static WebP with a pin. The site never loads a map from a third party.
// Attribution "© OpenStreetMap-bijdragers" must stay next to the image.
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LAT = 51.7760623;
const LON = 5.5197216;
const ZOOM = 16;
const OUT_W = 1200;
const OUT_H = 900;
const UA = 'BloemersMetaalSiteBuild/1.0 (static map, one-off)';

const DARK = '#1E2328';
const ACCENT = '#C2410C';

const n = 2 ** ZOOM;
const px = ((LON + 180) / 360) * n * 256;
const latRad = (LAT * Math.PI) / 180;
const py = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n * 256;

const left = px - OUT_W / 2;
const top = py - OUT_H / 2;
const tx0 = Math.floor(left / 256);
const ty0 = Math.floor(top / 256);
const tx1 = Math.floor((left + OUT_W) / 256);
const ty1 = Math.floor((top + OUT_H) / 256);

const tiles = [];
for (let x = tx0; x <= tx1; x++) {
  for (let y = ty0; y <= ty1; y++) {
    const res = await fetch(`https://tile.openstreetmap.org/${ZOOM}/${x}/${y}.png`, { headers: { 'User-Agent': UA } });
    if (!res.ok) throw new Error(`Tile ${x}/${y}: HTTP ${res.status}`);
    tiles.push({ input: Buffer.from(await res.arrayBuffer()), left: (x - tx0) * 256, top: (y - ty0) * 256 });
  }
}

const canvasW = (tx1 - tx0 + 1) * 256;
const canvasH = (ty1 - ty0 + 1) * 256;
const stitched = await sharp({ create: { width: canvasW, height: canvasH, channels: 3, background: '#ffffff' } })
  .composite(tiles)
  .png()
  .toBuffer();

const cropLeft = Math.round(left - tx0 * 256);
const cropTop = Math.round(top - ty0 * 256);

// Square pin, matching the 4px-corner language of the site.
const pin = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="56" height="72" viewBox="0 0 56 72">
  <path d="M28 70 L16 50 H40 Z" fill="${DARK}"/>
  <rect x="4" y="4" width="48" height="48" rx="4" fill="${ACCENT}" stroke="#fff" stroke-width="4"/>
  <circle cx="28" cy="28" r="7" fill="#fff"/>
</svg>`);

const base = await sharp(stitched)
  .extract({ left: cropLeft, top: cropTop, width: OUT_W, height: OUT_H })
  .composite([{ input: pin, left: OUT_W / 2 - 28, top: OUT_H / 2 - 70 }])
  .png()
  .toBuffer();

for (const w of [640, 1024]) {
  await sharp(base)
    .resize({ width: w })
    .webp({ quality: 62 })
    .toFile(path.join(root, `public/img/kaart-ritchiestraat-${w}.webp`));
}
console.log('Map written: public/img/kaart-ritchiestraat-{640,1024}.webp');
