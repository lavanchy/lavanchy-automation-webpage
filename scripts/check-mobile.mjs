// Automated mobile-viewport check: builds the site, serves the static output,
// and fails if any page has horizontal overflow (layout breaks) at common
// mobile/tablet widths. Uses playwright-core against a locally installed
// Chrome/Chromium (no bundled browser download) — see README note in package.json.
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
].filter(Boolean);
const chromePath = CHROME_CANDIDATES.find((p) => existsSync(p));

if (!chromePath) {
  console.error(
    'No local Chrome/Chromium found. Install one, or set CHROME_PATH to its executable.'
  );
  process.exit(1);
}

const PORT = 4321;
const BASE_URL = `http://localhost:${PORT}`;
const PAGES = [
  '/de/',
  '/de/leistungen/',
  '/de/referenzen/',
  '/de/partner/',
  '/de/ueber-mich/',
  '/de/kontakt/',
  '/de/impressum/',
  '/de/datenschutz/',
  '/de/agb/',
];
const VIEWPORTS = [
  { name: 'mobile-320', width: 320, height: 800 },
  { name: 'mobile-375', width: 375, height: 800 },
  { name: 'tablet-768', width: 768, height: 900 },
];

function runNpm(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn('npx', ['astro', ...args], { stdio: 'inherit' });
    proc.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`astro ${args.join(' ')} failed (${code})`))));
  });
}

async function main() {
  console.log('Building site…');
  await runNpm(['build']);

  console.log('Starting preview server…');
  const preview = spawn('npx', ['astro', 'preview', '--port', String(PORT)], {
    stdio: 'pipe',
  });
  await sleep(3000);

  const browser = await chromium.launch({ executablePath: chromePath });
  const failures = [];

  try {
    for (const viewport of VIEWPORTS) {
      const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
      for (const path of PAGES) {
        await page.goto(`${BASE_URL}${path}`, { waitUntil: 'networkidle' });
        const { scrollWidth, clientWidth } = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));
        const overflow = scrollWidth - clientWidth;
        const status = overflow > 1 ? 'FAIL' : 'ok';
        console.log(`[${status}] ${viewport.name.padEnd(12)} ${path.padEnd(20)} scrollWidth=${scrollWidth} clientWidth=${clientWidth}`);
        if (overflow > 1) {
          failures.push(`${viewport.name} ${path}: horizontal overflow of ${overflow}px`);
        }
      }
      await page.close();
    }
  } finally {
    await browser.close();
    preview.kill();
  }

  if (failures.length > 0) {
    console.error('\nMobile-viewport check FAILED:');
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }

  console.log('\nAll pages render without horizontal overflow at all tested viewports.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
