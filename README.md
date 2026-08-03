# lavanchyautomation.ch — Website

Mehrsprachig vorbereitete (aktuell nur `de`) Astro-Webseite für den IT-Beratungs-Auftritt
(ERP-Integration mit balmung, n8n-Prozessautomatisierung, KI-Beratung für KMU).

## Projektstruktur

```text
src/
  content.config.ts       Content-Collections (pages, legal, blog)
  content/de/pages/        Startseite, Leistungen, Referenzen, Über mich, Kontakt
  content/de/legal/        Impressum, Datenschutz, AGB
  content/de/blog/         Blog-Posts (später via n8n aus LinkedIn befüllt)
  config/site.ts           Zentrale Config: Domain, Calendly-CTA-Link, RAV-Flag, Navigation
  layouts/                 PageLayout (Hero/CTA-fähig), LegalLayout (schlicht, ohne CTA)
  components/              Header, Nav, Footer, CtaButton
  styles/global.css        Design-Tokens (Tailwind v4 @theme) — hier Corporate Design eintragen
  pages/de/                Routen mit /de/-Prefix (später /fr/, /en/ analog ergänzbar)
deploy/                     VPS-seitige docker-compose-Dateien (Traefik, Website, Plausible)
```

### Mehrsprachigkeit später aktivieren

1. `astro.config.mjs`: `locales: ['de', 'fr']` ergänzen.
2. `src/content/fr/{pages,legal,blog}/` mit gleichen Dateinamen wie unter `de/` anlegen.
3. `src/content.config.ts`: analoge Collections mit `base: './src/content/fr/...'` ergänzen.
4. `src/pages/fr/` mit denselben Routen-Dateien wie `src/pages/de/` anlegen (Inhalte aus `fr`-Collections).

### Decap CMS (später)

Die Content-Struktur ist als flache Markdown-Dateien mit Frontmatter angelegt — genau das
Format, das Decap CMS erwartet. Ergänzen späterhin nur `public/admin/index.html` +
`public/admin/config.yml` mit `collections`, die auf `src/content/de/...` zeigen. Kein Umbau
der bestehenden Struktur nötig.

### RAV-Auflage (bis 29.09.2026)

Einzige Handlungsaufforderung ist der `CtaButton` (Calendly-Link, zentral in
`src/config/site.ts` unter `calendlyUrl`). Kein Preis-/Angebots-/Bestellformular. Nach dem
29.09.2026: `ravRestrictionActive` in `site.ts` auf `false` setzen und echtes Kontakt-/
Angebotsformular ergänzen.

## Entwicklung

| Befehl            | Aktion                                       |
| :----------------- | :-------------------------------------------- |
| `npm install`       | Dependencies installieren                     |
| `npm run dev`       | Lokaler Dev-Server auf `localhost:4321`       |
| `npm run build`     | Produktions-Build nach `./dist/`              |
| `npm run preview`   | Build lokal vor dem Deploy prüfen             |

## Docker

```sh
docker build -t lavanchy-website .
docker run -p 8080:80 lavanchy-website
```

## Deployment

Push auf `main` → GitHub Actions baut die Seite, baut ein Docker-Image, pusht es nach GHCR
(`ghcr.io/lavanchy/lavanchy-automation-webpage`) und aktualisiert den `website`-Container auf
dem VPS per SSH (`.github/workflows/deploy.yml`). Details zur VPS-seitigen Konfiguration
(Traefik, Let's-Encrypt, Plausible) siehe [`deploy/README.md`](./deploy/README.md).

**Benötigte GitHub Secrets** (Settings → Secrets and variables → Actions):

- `DEPLOY_HOST` — IP/Hostname des Webseiten-VPS
- `DEPLOY_USER` — eingeschränkter Deploy-User (kein root)
- `DEPLOY_SSH_KEY` — privater SSH-Key des Deploy-Users

**Einmalig manuell:** GHCR-Package nach dem ersten Push auf **public** stellen
(GitHub → Package Settings), damit der VPS beim Pull keine Registry-Anmeldedaten braucht.

## Manuelle Schritte bei Hostinger (Kurzanleitung)

1. **VPS bestellen:** hPanel → VPS → Plan KVM 1 (1 vCPU/4GB/50GB NVMe), Ubuntu 24.04 LTS,
   separat vom bestehenden n8n-VPS.
2. **SSH-Key hinterlegen** beim VPS-Setup (Root-Login zunächst nur für Ersteinrichtung).
3. **DNS-Records** bei `lavanchyautomation.ch` setzen:
   - `A` `@` → VPS-IP
   - `A` `www` → VPS-IP
   - `A` `analytics` → VPS-IP (Plausible)
4. **Härtung** (per SSH als root, einmalig): System-Updates + `unattended-upgrades`,
   Deploy-User anlegen (Gruppe `docker`, eigener SSH-Key), `PasswordAuthentication no` +
   `PermitRootLogin no` in `sshd_config`, `ufw allow 22,80,443/tcp` + `ufw enable`,
   Docker + Compose-Plugin installieren.
5. `deploy/` auf den VPS kopieren (z.B. nach `/opt/lavanchyautomation/`), `.env` aus
   `.env.example` befüllen, `docker compose -f docker-compose.yml -f docker-compose.plausible.yml up -d`.
6. GitHub Secrets eintragen (siehe oben), auf `main` pushen.
7. Optional: Hostinger-API-MCP-Server verbinden für Monitoring/DNS-Verwaltung per Claude:
   `claude mcp add --transport http hostinger https://mcp.hostinger.com` (öffnet Browser-Login).
   Für die Ersteinrichtung (SSH-Härtung, Docker-Install) bleibt direkter SSH-Zugriff der
   zuverlässigere Weg.
