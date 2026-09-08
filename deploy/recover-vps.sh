#!/usr/bin/env bash
# One-shot recovery + fix for the "VPS unresponsive / Hostinger CPU throttle"
# incident (first seen 2026-08-21): ClickHouse's system.*_log tables peg the
# single vCPU with a background-merge loop, Traefik stops answering, the whole
# site goes dark even though the host still pings.
#
# Run this ON THE VPS as the deploy user:
#   cd /opt/lavanchyautomation/deploy   # or wherever the compose files live
#   bash recover-vps.sh
#
# Safe to run repeatedly. It only touches the Plausible stack, never the website
# container.
set -euo pipefail

COMPOSE_BASE="docker-compose.yml"
COMPOSE_PLAUSIBLE="docker-compose.plausible.yml"
DC=(docker compose -f "$COMPOSE_BASE" -f "$COMPOSE_PLAUSIBLE")

say() { printf '\n\033[1;36m== %s ==\033[0m\n' "$*"; }

say "1. Current load"
uptime
top -bn1 | head -12 || true

say "2. Container state / resource use"
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Image}}' || true
timeout 15 docker stats --no-stream || echo "(docker stats timed out — host is very busy)"

say "3. Immediate relief: stop the Plausible stack"
# Website + Traefik keep running; only analytics goes offline for a moment.
"${DC[@]}" stop plausible plausible_events_db plausible_db || true

say "4. Make sure the fix files are in place"
mkdir -p clickhouse
if [ ! -f clickhouse/disable-internal-logs.xml ]; then
  cat > clickhouse/disable-internal-logs.xml <<'XML'
<clickhouse>
    <metric_log remove="remove"/>
    <asynchronous_metric_log remove="remove"/>
    <error_log remove="remove"/>
    <trace_log remove="remove"/>
    <part_log remove="remove"/>
    <query_log remove="remove"/>
    <query_thread_log remove="remove"/>
    <query_views_log remove="remove"/>
    <session_log remove="remove"/>
    <text_log remove="remove"/>
</clickhouse>
XML
  echo "wrote clickhouse/disable-internal-logs.xml"
else
  echo "clickhouse/disable-internal-logs.xml already present"
fi

if ! grep -q 'disable-internal-logs.xml' "$COMPOSE_PLAUSIBLE"; then
  echo
  echo "!! $COMPOSE_PLAUSIBLE does not mount the config yet."
  echo "!! Pull the latest deploy/ files from git (commit dea78fe) or add under"
  echo "!! the plausible_events_db service:"
  echo "     mem_limit: 1500m"
  echo "     volumes:"
  echo "       - ./clickhouse/disable-internal-logs.xml:/etc/clickhouse-server/config.d/disable-internal-logs.xml:ro"
  echo "!! then re-run this script."
  exit 1
fi

say "5. Drop the log tables that already accumulated on disk"
"${DC[@]}" start plausible_events_db
sleep 8
for t in metric_log asynchronous_metric_log error_log trace_log part_log \
         query_log query_thread_log query_views_log session_log text_log; do
  docker exec plausible_events_db clickhouse-client -q \
    "DROP TABLE IF EXISTS system.${t}" 2>/dev/null \
    && echo "dropped system.${t}" || true
done

say "6. Recreate ClickHouse with the new config + memory cap, then bring Plausible up"
"${DC[@]}" up -d --force-recreate plausible_events_db
sleep 5
"${DC[@]}" up -d plausible plausible_db

say "7. Verify"
sleep 5
docker ps --format 'table {{.Names}}\t{{.Status}}'
echo
echo "internal log tables still present (want: empty):"
docker exec plausible_events_db clickhouse-client -q \
  "SELECT name FROM system.tables WHERE database='system' AND name LIKE '%\_log'" || true
echo
uptime
curl -sS -m 10 -o /dev/null -w "website  https -> %{http_code}\n" https://lavanchyautomation.ch/ || true

say "Done. Watch 'top' for a minute — one vCPU should settle well below 100%."
