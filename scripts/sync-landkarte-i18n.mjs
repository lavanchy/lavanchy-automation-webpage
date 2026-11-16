// Kopiert die Copy-Paste-Landkarte (public/landkarte/index.html) nach
// public/en/landkarte/ und public/fr/landkarte/. Die Seite erkennt die Sprache
// selbst am Pfad; Bibliotheken werden absolut aus /landkarte/ geladen.
// Läuft automatisch vor `npm run build` (prebuild). Die Kopien sind in .gitignore.
import { mkdirSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "public", "landkarte", "index.html");

for (const lang of ["en", "fr"]) {
  const targetDir = join(root, "public", lang, "landkarte");
  mkdirSync(targetDir, { recursive: true });
  copyFileSync(source, join(targetDir, "index.html"));
  console.log(`landkarte: ${lang}/landkarte/index.html aktualisiert`);
}
