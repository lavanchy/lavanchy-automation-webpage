# Deploy-Konfiguration (läuft auf dem VPS, nicht im CI-Image)

Diese Dateien werden **einmalig manuell** auf den Webseiten-VPS kopiert (z.B. nach
`/opt/lavanchyautomation/`). Danach übernimmt die GitHub-Actions-Pipeline nur noch
`docker compose pull website && docker compose up -d --no-deps --wait website`.

## Ersteinrichtung auf dem VPS

```bash
cp .env.example .env
# Werte in .env eintragen (siehe Kommentare in den .yml-Dateien)

# Vorschau-Sperre (Basic Auth), solange die Seite nicht öffentlich sein soll:
htpasswd -B -c htpasswd DEIN-USERNAME   # fragt interaktiv nach dem Passwort
# ohne `htpasswd`-Tool: openssl passwd -apr1 'DEIN-PASSWORT' und Ergebnis manuell
# als "username:hash" in eine Datei "htpasswd" schreiben.

docker compose -f docker-compose.yml -f docker-compose.plausible.yml up -d
```

Sobald die Seite live gehen soll: die `website-auth`-Middleware-Zeilen in
`docker-compose.yml` (beim `website`- und beim `traefik`-Service) entfernen und
`htpasswd` löschen.

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

## Dateien

- `docker-compose.yml` — Traefik (Reverse Proxy + automatisches Let's-Encrypt-SSL) + Website-Container
- `docker-compose.plausible.yml` — self-hosted Plausible Analytics unter `analytics.lavanchyautomation.ch`
- `.env.example` — Vorlage für Secrets/Config, die auf dem VPS in `.env` liegen (nicht im Git-Repo)
- `htpasswd` — Zugangsdaten für die Vorschau-Sperre (nicht im Git-Repo, siehe oben)
