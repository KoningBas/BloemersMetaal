// One-off: stitches OpenStreetMap tiles of the Netherlands into a grey static WebP
// with a pin on Oss and a dashed 100 km ring (BRIEF A3: beyond 100 km it must be worth the trip).
// Same approach as map.mjs. Attribution "© OpenStreetMap-bijdragers" must stay next to the image.
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OSS = { lat: 51.7760623, lon: 5.5197216 };
const CENTER = { lat: 52.2, lon: 5.3 };
const ZOOM = 8;
const OUT_W = 760;
const OUT_H = 880;
const RING_KM = 100;
const UA = 'BloemersMetaalSiteBuild/1.0 (static map, one-off)';

const INK = '#16191D';
const DARK = '#1E2328';
const ACCENT = '#C2410C';

const n = 2 ** ZOOM;
const project = ({ lat, lon }) => {
  const latRad = (lat * Math.PI) / 180;
  return {
    x: ((lon + 180) / 360) * n * 256,
    y: ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n * 256,
  };
};

const c = project(CENTER);
const left = c.x - OUT_W / 2;
const top = c.y - OUT_H / 2;
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

const stitched = await sharp({ create: { width: (tx1 - tx0 + 1) * 256, height: (ty1 - ty0 + 1) * 256, channels: 3, background: '#ffffff' } })
  .composite(tiles)
  .png()
  .toBuffer();

// Grey, slightly lifted, so the pin and ring are the only things that stand out.
const grey = await sharp(stitched)
  .extract({ left: Math.round(left - tx0 * 256), top: Math.round(top - ty0 * 256), width: OUT_W, height: OUT_H })
  .grayscale()
  .linear(0.8, 40)
  .png()
  .toBuffer();

const o = project(OSS);
const ox = o.x - left;
const oy = o.y - top;
const metersPerPx = (156543.03392 * Math.cos((OSS.lat * Math.PI) / 180)) / n;
const r = (RING_KM * 1000) / metersPerPx;

const overlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${OUT_W}" height="${OUT_H}">
  <circle cx="${ox}" cy="${oy}" r="${r}" fill="${INK}" fill-opacity="0.06" stroke="${INK}" stroke-width="3" stroke-dasharray="10 8"/>
  <g transform="translate(${ox - 28} ${oy - 70})">
    <path d="M28 70 L16 50 H40 Z" fill="${DARK}"/>
    <rect x="4" y="4" width="48" height="48" rx="4" fill="${ACCENT}" stroke="#fff" stroke-width="4"/>
    <circle cx="28" cy="28" r="7" fill="#fff"/>
  </g>
</svg>`);

const base = await sharp(grey).composite([{ input: overlay }]).png().toBuffer();

for (const w of [380, 760]) {
  await sharp(base)
    .resize({ width: w })
    .webp({ quality: 70 })
    .toFile(path.join(root, `public/img/kaart-nederland-${w}.webp`));
}
console.log(`Map written: public/img/kaart-nederland-{380,760}.webp (ring ${Math.round(r)} px)`);
