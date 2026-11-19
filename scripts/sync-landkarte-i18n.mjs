// Kopiert die Zeitfresser-Landkarte (public/landkarte/index.html, deutsche Quelle) nach
// public/en/landkarte/ und public/fr/landkarte/ und passt dabei den <head> an
// (Titel, Beschreibung, Canonical, Open-Graph-Bild, Sprache), damit Suchmaschinen und
// Link-Vorschauen (LinkedIn, WhatsApp) auch ohne JavaScript die richtige Sprache sehen.
// Die Texte im <body> übersetzt die Seite selbst per JavaScript anhand des Pfads.
// Zusätzlich setzt es zwischen den Markern SITE-HEADER / SITE-FOOTER den Header und Footer
// der Website ein (Nachbau von src/components/Header.astro und Footer.astro, Menü und
// Rechtslinks aus src/config/site.ts), auch in der deutschen Quelle selbst.
// Läuft automatisch vor `npm run build` (prebuild). Die Kopien sind in .gitignore.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { navByLocale, uiByLocale, siteConfig } from "../src/config/site.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = join(root, "public", "landkarte", "index.html");

const lkPath = (l) => (l === "de" ? "/landkarte/" : `/${l}/landkarte/`);
const LEGAL = {
  de: [["Impressum", "impressum"], ["Datenschutz", "datenschutz"], ["AGB", "agb"]],
  fr: [["Mentions légales", "impressum"], ["Confidentialité", "datenschutz"], ["CGV", "agb"]],
  en: [["Legal notice", "impressum"], ["Privacy", "datenschutz"], ["Terms", "agb"]],
};
const LINKEDIN = { de: "Loïc Lavanchy auf LinkedIn", fr: "Loïc Lavanchy sur LinkedIn", en: "Loïc Lavanchy on LinkedIn" };

function siteHeader(l) {
  const ui = uiByLocale[l];
  const nav = navByLocale[l]
    .map((i) => `<li><a href="${i.href}"${i.href === lkPath(l) ? ' aria-current="page"' : ""}>${i.label}</a></li>`)
    .join("");
  const langs = ["de", "fr", "en"]
    .map((x) => `<li><a href="${lkPath(x)}"${x === l ? ' aria-current="page"' : ""}>${x.toUpperCase()}</a></li>`)
    .join("");
  return `<!-- SITE-HEADER:START (generiert von scripts/sync-landkarte-i18n.mjs, nicht von Hand ändern) -->
<header class="sh">
  <div class="sh-in">
    <a class="sh-brand" href="/${l}/"><img src="/landkarte/logo-icon.png" alt="" width="48" height="38">${siteConfig.name}</a>
    <div class="sh-tools">
      <ul class="sh-lang" aria-label="${ui.langSwitcherLabel}">${langs}</ul>
      <button class="sh-toggle" id="sh-toggle" type="button" aria-expanded="false" aria-controls="sh-nav" aria-label="${ui.menuOpen}" data-open="${ui.menuOpen}" data-close="${ui.menuClose}">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
    </div>
    <nav class="sh-nav" id="sh-nav" aria-label="${ui.navAriaLabel}"><ul>${nav}</ul></nav>
  </div>
</header>
<script>(function(){var b=document.getElementById("sh-toggle"),n=document.getElementById("sh-nav");function s(o){n.classList.toggle("open",o);b.setAttribute("aria-expanded",String(o));b.setAttribute("aria-label",o?b.dataset.close:b.dataset.open);}b.addEventListener("click",function(){s(!n.classList.contains("open"));});document.addEventListener("keydown",function(e){if(e.key==="Escape")s(false);});})();</script>
<!-- SITE-HEADER:END -->`;
}

function siteFooter(l) {
  const legal = LEGAL[l].map(([label, slug]) => `<li><a href="/${l}/${slug}/">${label}</a></li>`).join("");
  return `<!-- SITE-FOOTER:START (generiert von scripts/sync-landkarte-i18n.mjs, nicht von Hand ändern) -->
<footer class="sf">
  <div class="sf-in">
    <p>&copy; ${new Date().getFullYear()} ${siteConfig.name}</p>
    <div class="sf-right">
      <ul>${legal}</ul>
      <a href="${siteConfig.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="${LINKEDIN[l]}"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.114 20.452H3.558V9h3.556v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
    </div>
  </div>
</footer>
<!-- SITE-FOOTER:END -->`;
}

function withChrome(html, l) {
  const swap = (h, name, block) => {
    const re = new RegExp(`<!-- ${name}:START[\\s\\S]*?<!-- ${name}:END -->`);
    if (!re.test(h)) throw new Error(`sync-landkarte: Marker ${name} nicht gefunden`);
    return h.replace(re, () => block);
  };
  return swap(swap(html, "SITE-HEADER", siteHeader(l)), "SITE-FOOTER", siteFooter(l));
}

const source = withChrome(readFileSync(sourcePath, "utf8"), "de");
writeFileSync(sourcePath, source);
const U = "https://lavanchyautomation.ch";

const DE = {
  title: "Zeitfresser-Landkarte · Lavanchy Automation",
  desc: "12 Fragen, 5 Minuten: Sieh deinen Betrieb als 3D-Stadt und erfahre, wo deine Zeit zwischen den Tools verschwindet.",
  by: " Von Lavanchy Automation.",
};
const LANGS = {
  en: {
    htmlLang: "en", ogLocale: "en_US",
    title: "Time-Drain Map · Lavanchy Automation",
    desc: "12 questions, 5 minutes: see your business as a 3D city and find out where your time disappears between tools.",
    by: " By Lavanchy Automation.",
  },
  fr: {
    htmlLang: "fr", ogLocale: "fr_CH",
    title: "Carte des pertes de temps · Lavanchy Automation",
    desc: "12 questions, 5 minutes : visualisez votre entreprise comme une ville en 3D et découvrez où votre temps se perd entre vos outils.",
    by: " Par Lavanchy Automation.",
  },
};

function replaceAll(html, from, to, label) {
  if (!html.includes(from)) throw new Error(`sync-landkarte: «${label}» nicht gefunden – Quelle geändert?`);
  return html.split(from).join(to);
}

for (const [lang, L] of Object.entries(LANGS)) {
  let html = withChrome(source, lang);
  html = replaceAll(html, '<html lang="de-CH">', `<html lang="${L.htmlLang}">`, "html lang");
  html = replaceAll(html, `<title>${DE.title}</title>`, `<title>${L.title}</title>`, "title");
  html = replaceAll(html, `content="${DE.title}"`, `content="${L.title}"`, "og/twitter title");
  html = replaceAll(html, DE.desc + DE.by, L.desc + L.by, "meta description");
  html = replaceAll(html, DE.desc, L.desc, "og/twitter description");
  html = replaceAll(html, `<link rel="canonical" href="${U}/landkarte/">`, `<link rel="canonical" href="${U}/${lang}/landkarte/">`, "canonical");
  html = replaceAll(html, `<meta property="og:url" content="${U}/landkarte/">`, `<meta property="og:url" content="${U}/${lang}/landkarte/">`, "og:url");
  html = replaceAll(html, "/landkarte/og-de.jpg", `/landkarte/og-${lang}.jpg`, "og image");
  html = replaceAll(html, '<meta property="og:locale" content="de_CH">', `<meta property="og:locale" content="${L.ogLocale}">`, "og:locale");

  const targetDir = join(root, "public", lang, "landkarte");
  mkdirSync(targetDir, { recursive: true });
  writeFileSync(join(targetDir, "index.html"), html);
  console.log(`landkarte: ${lang}/landkarte/index.html aktualisiert`);
}
