#!/usr/bin/env bash
# Manual deploy on the VPS (build locally, no GHCR).
# Usage (from anywhere in the repo):
#   bash scripts/deploy-manual.sh
# Or override:
#   APP_DIR=/var/www/G-Bath bash scripts/deploy-manual.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="${APP_DIR:-$(cd "${SCRIPT_DIR}/.." && pwd)}"
cd "${APP_DIR}"

echo "==> Deploying from ${APP_DIR}"

if [[ ! -f .env ]]; then
  echo "Missing ${APP_DIR}/.env — copy from .env.production.example and fill secrets."
  exit 1
fi

echo "==> Building and starting containers"
docker compose -f docker-compose.local.yml up -d --build --remove-orphans

echo "==> Waiting for health endpoint"
for i in $(seq 1 45); do
  if curl -fsS http://127.0.0.1:5000/api/health >/dev/null 2>&1; then
    echo "App is healthy"
    docker compose -f docker-compose.local.yml ps
    exit 0
  fi
  sleep 2
done

echo "Health check did not pass — showing logs:"
docker compose -f docker-compose.local.yml logs --tail=80 app
exit 1
