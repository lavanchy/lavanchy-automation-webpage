// Render-Dienst für die Zeitfresser-Landkarte.
// Öffnet die Landkarte im Render-Modus (?render=1), übergibt die gespeicherten Antworten
// und druckt den vollständigen Bericht mit Chromium als PDF (Text statt Bild, klein).
// Nur intern erreichbar (Docker-Netz von n8n), kein öffentlicher Port.
//
// POST /render  {"lang":"de","data":{...Felder wie im Webhook...},"date":"2026-11-18"}
//   -> {"ok":true,"pdfBase64":"JVBER...","warnings":[],"items":5,"city":true,"ms":4200}
// GET  /health  -> {"ok":true}
import http from "node:http";
import { chromium } from "playwright";

const PORT = Number(process.env.PORT || 3000);
const BASE = (process.env.LANDKARTE_URL || "https://lavanchyautomation.ch").replace(/\/$/, "");
const TIMEOUT = Number(process.env.RENDER_TIMEOUT_MS || 45000);
const BLOCK = /analytics\.lavanchyautomation\.ch|plausible|\/webhook\/|meetergo|tally\.so/i;

let browser = null;
async function getBrowser() {
  if (browser && browser.isConnected()) return browser;
  browser = await chromium.launch({
    args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist", "--disable-dev-shm-usage"],
  });
  return browser;
}

// Immer nur ein PDF gleichzeitig (VPS schonen)
let chain = Promise.resolve();
const enqueue = fn => { const p = chain.then(fn, fn); chain = p.catch(() => {}); return p; };

async function render({ lang, data, date }) {
  const t0 = Date.now();
  const l = ["de", "en", "fr"].includes(lang) ? lang : "de";
  const url = BASE + (l === "de" ? "/landkarte/" : `/${l}/landkarte/`) + "?render=1";
  const b = await getBrowser();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
  try {
    const page = await ctx.newPage();
    await page.route("**/*", r => (BLOCK.test(r.request().url()) ? r.abort() : r.continue()));
    await page.goto(url, { waitUntil: "load", timeout: TIMEOUT });
    await page.waitForFunction(() => window.__lkReady === true && typeof window.__lkRender === "function", null, { timeout: TIMEOUT });
    const info = await page.evaluate(([d, o]) => window.__lkRender(d, o), [data || {}, { date: date || null }]);
    await page.emulateMedia({ media: "screen" });
    const pdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true, timeout: TIMEOUT });
    return { ok: true, pdfBase64: Buffer.from(pdf).toString("base64"), ...info, ms: Date.now() - t0 };
  } finally {
    await ctx.close().catch(() => {});
  }
}

const send = (res, code, obj) => { res.writeHead(code, { "content-type": "application/json" }); res.end(JSON.stringify(obj)); };

http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/health") return send(res, 200, { ok: true });
  if (req.method !== "POST" || req.url !== "/render") return send(res, 404, { ok: false, error: "not found" });
  let body = "";
  req.on("data", c => { body += c; if (body.length > 200000) req.destroy(); });
  req.on("end", async () => {
    let input;
    try { input = JSON.parse(body || "{}"); } catch { return send(res, 400, { ok: false, error: "invalid json" }); }
    try {
      const out = await enqueue(() => render(input));
      console.log(new Date().toISOString(), "render", input.lang, out.items, "items", out.ms, "ms", out.warnings.length, "warnings");
      send(res, 200, out);
    } catch (e) {
      console.error(new Date().toISOString(), "render failed", e && e.message);
      if (browser) { browser.close().catch(() => {}); browser = null; }
      send(res, 500, { ok: false, error: String(e && e.message || e).slice(0, 300) });
    }
  });
}).listen(PORT, () => console.log("landkarte-render on", PORT, "->", BASE));
