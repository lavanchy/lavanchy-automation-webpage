// Kopiert die Zeitfresser-Landkarte (public/landkarte/index.html, deutsche Quelle) nach
// public/en/landkarte/ und public/fr/landkarte/ und passt dabei den <head> an
// (Titel, Beschreibung, Canonical, Open-Graph-Bild, Sprache), damit Suchmaschinen und
// Link-Vorschauen (LinkedIn, WhatsApp) auch ohne JavaScript die richtige Sprache sehen.
// Die Texte im <body> übersetzt die Seite selbst per JavaScript anhand des Pfads.
// Läuft automatisch vor `npm run build` (prebuild). Die Kopien sind in .gitignore.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(join(root, "public", "landkarte", "index.html"), "utf8");
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
  let html = source;
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
