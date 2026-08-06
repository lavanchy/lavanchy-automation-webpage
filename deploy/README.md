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

## Dateien

- `docker-compose.yml` — Traefik (Reverse Proxy + automatisches Let's-Encrypt-SSL) + Website-Container
- `docker-compose.plausible.yml` — self-hosted Plausible Analytics unter `analytics.lavanchyautomation.ch`
- `.env.example` — Vorlage für Secrets/Config, die auf dem VPS in `.env` liegen (nicht im Git-Repo)
- `htpasswd` — Zugangsdaten für die Vorschau-Sperre (nicht im Git-Repo, siehe oben)
