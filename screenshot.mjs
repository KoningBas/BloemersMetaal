// Usage: node screenshot.mjs <url> [label] [desktop|tablet|mobile|all|<px>] [fullPage]
// Prints a REPORT block (page errors, console errors, failed requests, external
// requests, horizontal overflow, hidden content) before saving the PNGs.
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotDir = path.join(__dirname, 'temporary screenshots');
if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

const url = process.argv[2] || 'http://localhost:3000/';
const label = process.argv[3] || '';
const viewportArg = process.argv[4] || 'desktop';
const fullPage = process.argv[5] !== 'false';

const PRESETS = { desktop: 1440, tablet: 768, mobile: 390 };
const widths =
  viewportArg === 'all'
    ? [['desktop', 1440], ['tablet', 768], ['mobile', 390]]
    : PRESETS[viewportArg]
      ? [[viewportArg, PRESETS[viewportArg]]]
      : [[String(parseInt(viewportArg) || 1440), parseInt(viewportArg) || 1440]];

function nextNumber() {
  const nums = fs
    .readdirSync(screenshotDir)
    .map((f) => parseInt(f.match(/^screenshot-(\d+)/)?.[1] || '0'));
  return nums.length ? Math.max(...nums) + 1 : 1;
}

const origin = new URL(url).origin;
const browser = await puppeteer.launch({
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const n = nextNumber();
let problems = 0;

for (const [name, width] of widths) {
  const page = await browser.newPage();
  const pageErrors = [];
  const consoleErrors = [];
  const failed = [];
  const external = [];

  page.on('pageerror', (e) => pageErrors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));
  page.on('requestfailed', (r) => failed.push(`${r.url()} (${r.failure()?.errorText})`));
  page.on('response', (r) => r.status() >= 400 && failed.push(`${r.url()} (HTTP ${r.status()})`));
  page.on('request', (r) => {
    const u = r.url();
    if (!u.startsWith(origin) && !u.startsWith('data:') && !u.startsWith('blob:')) external.push(u);
  });

  await page.setViewport({ width, height: name === 'desktop' ? 900 : 844, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  // Load lazy images by scrolling through the page once.
  const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= docHeight; y += 500) {
    await page.evaluate((s) => window.scrollTo(0, s), y);
    await new Promise((r) => setTimeout(r, 120));
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 900));

  const layout = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const overflow = document.documentElement.scrollWidth - vw;
    const offenders = [];
    if (overflow > 0) {
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect();
        if (r.right > vw + 1 && getComputedStyle(el).position !== 'fixed') {
          offenders.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')} right=${Math.round(r.right)}`);
        }
        if (offenders.length > 5) break;
      }
    }
    const hidden = [...document.querySelectorAll('main section, main h1, main h2, main p')]
      .filter((el) => {
        const s = getComputedStyle(el);
        return s.opacity === '0' || s.visibility === 'hidden';
      })
      .map((el) => el.tagName.toLowerCase() + (el.className ? '.' + el.className : ''));
    const brokenImgs = [...document.images]
      .filter((i) => i.complete && i.naturalWidth === 0)
      .map((i) => i.currentSrc || i.src);
    return { overflow, offenders, hidden, brokenImgs };
  });

  const file = `screenshot-${n}${label ? '-' + label : ''}-${name}.png`;
  await page.screenshot({ path: path.join(screenshotDir, file), fullPage });

  const rows = [
    ['page errors', pageErrors],
    ['console errors', consoleErrors],
    ['failed requests', failed],
    ['external requests', external],
    ['broken images', layout.brokenImgs],
    ['hidden content', layout.hidden],
    ['horizontal overflow', layout.overflow > 0 ? [`${layout.overflow}px`, ...layout.offenders] : []],
  ];
  console.log(`\n=== REPORT ${name} (${width}px) ${url}`);
  for (const [k, v] of rows) {
    problems += v.length;
    console.log(`${v.length ? 'FAIL' : 'ok  '} ${k}: ${v.length}`);
    for (const item of v) console.log(`       - ${item}`);
  }
  console.log(`Saved: temporary screenshots/${file}`);
  await page.close();
}

await browser.close();
console.log(problems ? `\nREPORT: ${problems} problem(s)` : '\nREPORT: clean');
process.exitCode = problems ? 1 : 0;
