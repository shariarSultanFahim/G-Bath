#!/usr/bin/env bash
# One-time VPS bootstrap for goodbathroomrenosapp.ca
# Run as root on the VPS:  bash scripts/vps-setup.sh
set -euo pipefail

DOMAIN="goodbathroomrenosapp.ca"
APP_DIR="/var/www/g-bath"
TIMEZONE="${TIMEZONE:-America/Toronto}"

echo "==> Updating system packages"
apt update && apt upgrade -y

echo "==> Setting timezone to ${TIMEZONE}"
timedatectl set-timezone "${TIMEZONE}"

echo "==> Installing essentials"
apt install -y curl wget git htop nano ufw ca-certificates gnupg lsb-release

echo "==> Configuring UFW (22/80/443)"
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
ufw status

echo "==> Installing Docker Engine + Compose plugin"
if ! command -v docker >/dev/null 2>&1; then
  mkdir -p /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
  apt update
  apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
fi
docker --version
docker compose version

echo "==> Installing Nginx + Certbot"
apt install -y nginx certbot python3-certbot-nginx
systemctl enable nginx
systemctl start nginx

echo "==> Creating app directory ${APP_DIR}"
mkdir -p "${APP_DIR}"

echo "==> Done."
echo ""
echo "Next steps:"
echo "  1. Point DNS A records for ${DOMAIN} (and www) to this VPS IP"
echo "  2. Copy nginx/${DOMAIN}.conf → /etc/nginx/sites-available/${DOMAIN}"
echo "  3. Enable site, reload nginx"
echo "  4. Add GitHub secrets and push to main (or run docker compose manually)"
echo "  5. After app is up: certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
echo "  6. Seed DB: docker exec gbath-app npx prisma db push --skip-generate"
echo "             curl \"http://127.0.0.1:5000/api/seed?key=\$NEXTAUTH_SECRET\""
