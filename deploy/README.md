# Deploy-Konfiguration (läuft auf dem VPS, nicht im CI-Image)

Diese Dateien werden **einmalig manuell** auf den Webseiten-VPS kopiert (z.B. nach
`/opt/lavanchyautomation/`). Danach übernimmt die GitHub-Actions-Pipeline nur noch
`docker compose pull website && docker compose up -d --no-deps --wait website`.

## Ersteinrichtung auf dem VPS

```bash
cp .env.example .env
# Werte in .env eintragen (siehe Kommentare in den .yml-Dateien)

# Nur falls wieder eine Vorschau-Sperre (Basic Auth) gewünscht ist:
htpasswd -B -c htpasswd DEIN-USERNAME   # fragt interaktiv nach dem Passwort
# ohne `htpasswd`-Tool: openssl passwd -apr1 'DEIN-PASSWORT' und Ergebnis manuell
# als "username:hash" in eine Datei "htpasswd" schreiben.

docker compose -f docker-compose.yml -f docker-compose.plausible.yml up -d
```

**Seit 2026-09-28 live:** Die Vorschau-Sperre ist entfernt (Middleware-Labels,
htpasswd-Mount und `htpasswd`-Datei). Für eine erneute Sperre: `htpasswd` wie oben
anlegen und beim `traefik`-Service den Mount `./htpasswd:/etc/traefik/htpasswd:ro`,
beim `website`-Service die Labels
`traefik.http.middlewares.website-auth.basicauth.usersfile=/etc/traefik/htpasswd` und
`traefik.http.routers.website.middlewares=website-auth` wieder ergänzen.

## Wartungsroutine

Damit Updates nicht vom manuellen Nachschauen abhängen, laufen drei automatische
Mechanismen parallel:

1. **OS-Sicherheitsupdates**: `unattended-upgrades` auf dem VPS (inkl. Docker CEs
   eigenem apt-Repo in den Allowed-Origins) installiert Patches automatisch;
   `Automatic-Reboot` ist auf `true` gesetzt (nachts 03:00 Uhr), falls ein
   Kernel-Update einen Neustart braucht.
2. **Container-Images mit gepinntem Tag** (Traefik, Plausible, Postgres,
   ClickHouse): Cronjob im `deploy`-User (`crontab -l` zeigt ihn), läuft
   sonntags 03:00 Uhr — pullt neue Patch-Versionen innerhalb der gepinnten Tags
   (z.B. `v3`, `16-alpine`) und startet betroffene Container neu. Log unter
   `/home/deploy/maintenance.log`.
3. **Website-Image-Basis** (node:22-alpine, nginx:alpine): wöchentlicher
   Schedule-Trigger (sonntags 04:00 UTC, siehe `.github/workflows/deploy.yml`)
   baut das Image neu, auch ohne Code-Änderung, damit Patches in den
   Basis-Layern ankommen — danach automatisch deployt wie bei jedem Push.

Hostingers tägliches Backup-Add-on ist bewusst (noch) nicht aktiviert (Kosten
vs. Nutzen für die Vorschau-Phase) — siehe VPS-Bestellung, optional später im
hPanel unter VPS → Snapshot & Backups nachrüstbar.

## ClickHouse auf dem 1-vCPU-VPS

Am 2026-08-21 hat ClickHouse (Plausibles Events-DB) die eine vCPU des VPS
stundenlang zu ~100% ausgelastet und die Hostinger-CPU-Drosselung ausgelöst.
Ursache: ClickHouse's eigene `system.metric_log`/`error_log`-Tabellen schreiben
im Sekundentakt neue Parts; auf einem Ein-Kern-Host kam der Background-Merge
nicht mehr hinterher, lief ans Speicherlimit, brach ab und wurde neu versucht
— eine Dauerschleife. Fix in `docker-compose.plausible.yml`:

- `clickhouse/disable-internal-logs.xml` deaktiviert alle `system.*_log`-Tabellen
  (Plausible liest diese nie, reine ClickHouse-Introspektion).
- `mem_limit: 1500m` als Sicherheitsnetz, damit ClickHouse nicht erneut den
  ganzen Host-Speicher beansprucht und mit anderen Containern kollidiert.

## Dateien

- `docker-compose.yml` — Traefik (Reverse Proxy + automatisches Let's-Encrypt-SSL) + Website-Container
- `docker-compose.plausible.yml` — self-hosted Plausible Analytics unter `analytics.lavanchyautomation.ch`
- `clickhouse/disable-internal-logs.xml` — deaktiviert ClickHouse's interne `system.*_log`-Tabellen (siehe oben)
- `.env.example` — Vorlage für Secrets/Config, die auf dem VPS in `.env` liegen (nicht im Git-Repo)
- `htpasswd` — Zugangsdaten für die Vorschau-Sperre (nicht im Git-Repo, siehe oben)

## Landkarte-Render (PDF-Bericht der Zeitfresser-Landkarte)

Der PDF-Bericht der Landkarte entsteht nicht im Browser, sondern auf dem **n8n-VPS** (nicht auf dem Website-VPS):
der Container `landkarte-render` öffnet `https://lavanchyautomation.ch/landkarte/?render=1` mit Chromium,
übergibt die Antworten (`window.__lkRender`) und druckt den Bericht als PDF. Er hängt nur im Docker-Netz
`n8n_default` (kein öffentlicher Port), ist auf 1 CPU / 1 GB begrenzt und rendert immer nur ein PDF gleichzeitig.

Genutzt von den n8n-Workflows «[Landkarte] Ergebnis-Webhook» (Node «PDF rendern», Fallback: PDF aus dem Browser)
und «[Landkarte] PDF neu erstellen» (Webhook `/webhook/landkarte-pdf-neu?id=<JP-ID>&key=<Schlüssel>`, `&dry=1` = nur Daten prüfen).

Deploy / Update (vom Laptop, im Repo-Root):

```bash
ssh joinpoint-vps 'mkdir -p /docker/landkarte-render'
scp deploy/landkarte-render/{Dockerfile,server.mjs,package.json,docker-compose.yml} joinpoint-vps:/docker/landkarte-render/
ssh joinpoint-vps 'cd /docker/landkarte-render && docker compose up -d --build && sleep 5 && docker exec n8n-n8n-1 wget -qO- http://landkarte-render:3000/health'
```

Lokal testen: `docker build -t landkarte-render:dev deploy/landkarte-render`, dann
`docker run --rm --network host -e LANDKARTE_URL=http://localhost:8765 -e PORT=3999 --shm-size 256m landkarte-render:dev`
(Landkarte vorher mit `node scripts/sync-landkarte-i18n.mjs` und `python3 -m http.server 8765` in `public/` bereitstellen).
