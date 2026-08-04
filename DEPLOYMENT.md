# Deployment Guide — Good Bathroom Renos App

> **Domain:** `https://goodbathroomrenosapp.ca`  
> **VPS:** Hostinger · `187.127.249.101`  
> **Stack:** Nginx (host) → Next.js Docker → MongoDB 7 Docker · CI via GitHub Actions → GHCR

---

## Architecture

```
Browser ──443──▶ Nginx (SSL) ──5000──▶ Next.js (gbath-app)
                                          │
                                          ▼
                                     MongoDB (gbath-mongodb)
```

| Layer | Where | Notes |
|---|---|---|
| Nginx | Host | Reverse proxy, SSL, SSE for notifications |
| Next.js | Docker `gbath-app` | Standalone build, port 5000 on localhost only |
| MongoDB | Docker `gbath-mongodb` | Replica set `rs0`, volume persisted |
| CI/CD | GitHub Actions | Typecheck → build/push GHCR → SSH deploy |

---

## Go-live checklist

1. **DNS** — A records for `@` and `www` → `187.127.249.101`
2. **VPS** — Run `scripts/vps-setup.sh` (or follow sections 2–4)
3. **Nginx** — Install site config, reload (HTTP first)
4. **GitHub secrets** — `VPS_*`, `GHCR_PAT`, `ENV_FILE`
5. **Deploy** — Push to `main` or Run workflow
6. **SSL** — `certbot --nginx -d goodbathroomrenosapp.ca -d www.goodbathroomrenosapp.ca`
7. **DB** — `prisma db push` + seed admin (section 7)

---

## 1. DNS Setup

At your DNS provider for **goodbathroomrenosapp.ca**:

| Type | Host | Value | TTL |
|---|---|---|---|
| `A` | `@` | `187.127.249.101` | 3600 |
| `A` | `www` | `187.127.249.101` | 3600 |

Verify before Certbot:

```bash
nslookup goodbathroomrenosapp.ca
# Must show 187.127.249.101
```

---

## 2. First-Time VPS Setup

```bash
ssh root@187.127.249.101
```

**Option A — bootstrap script** (copy repo or paste script):

```bash
# After cloning/copying the repo somewhere on the VPS:
bash scripts/vps-setup.sh
```

**Option B — manual:**

```bash
apt update && apt upgrade -y
timedatectl set-timezone America/Toronto

apt install -y curl wget git htop nano ufw
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

---

## 3. Install Docker

```bash
apt install -y ca-certificates curl gnupg lsb-release
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
docker --version && docker compose version
```

---

## 4. Install Nginx & SSL

```bash
apt install -y nginx certbot python3-certbot-nginx
systemctl enable --now nginx
```

Copy the repo file `nginx/goodbathroomrenosapp.ca.conf` to the VPS:

```bash
nano /etc/nginx/sites-available/goodbathroomrenosapp.ca
# Paste contents of nginx/goodbathroomrenosapp.ca.conf

ln -sf /etc/nginx/sites-available/goodbathroomrenosapp.ca /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

Start the app containers first (CI or manual), then issue SSL:

```bash
certbot --nginx -d goodbathroomrenosapp.ca -d www.goodbathroomrenosapp.ca
certbot renew --dry-run
```

---

## 5. GitHub Secrets

Repo → **Settings** → **Secrets and variables** → **Actions**:

| Secret | Value |
|---|---|
| `VPS_HOST` | `187.127.249.101` |
| `VPS_USERNAME` | `root` (or your deploy user) |
| `VPS_SSH_KEY` | Private key for deploy |
| `VPS_PORT` | `22` |
| `GHCR_PAT` | PAT with `read:packages` |
| `ENV_FILE` | Full production `.env` (see below) |

### SSH deploy key

```bash
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/gbath_deploy
# Private → VPS_SSH_KEY secret
# Public → append to VPS ~/.ssh/authorized_keys
```

### `ENV_FILE` content

Use [`.env.production.example`](.env.production.example):

```env
NEXT_PUBLIC_SITE_URL=https://goodbathroomrenosapp.ca
NEXT_PUBLIC_API_URL=https://goodbathroomrenosapp.ca

DATABASE_URL="mongodb://mongodb:27017/g-bath?replicaSet=rs0&directConnection=true"

NEXTAUTH_SECRET="paste-output-of-openssl-rand-base64-32"
NEXTAUTH_URL="https://goodbathroomrenosapp.ca"
AUTH_TRUST_HOST=true
```

Generate secret: `openssl rand -base64 32`

> `DATABASE_URL` must use hostname `mongodb` (Docker service name), not `localhost`.

> `NEXT_PUBLIC_*` are also baked at **image build** in `.github/workflows/deploy.yml`. Changing the domain requires updating that workflow’s `SITE_URL` and rebuilding.

Make the GHCR package readable by the VPS PAT: after the first push, open the package on GitHub → Package settings → ensure the PAT user can pull (or set visibility to private with access for your account).

---

## 6. First Deployment

### Automatic (recommended)

```bash
git push origin main
```

Pipeline: typecheck → Docker build/push → SSH write `.env` + compose → `docker compose up -d`.

### Manual on VPS

```bash
mkdir -p /var/www/g-bath && cd /var/www/g-bath
# Copy Dockerfile, docker-compose.local.yml, prisma/, src/, package files, etc.
# Or: git clone <repo-url> .

nano .env   # from .env.production.example
bash scripts/deploy-manual.sh
```

---

## 7. Database Seeding

```bash
cd /var/www/g-bath

docker exec -it gbath-app npx prisma db push --skip-generate

# Seed admin/seller (key = your NEXTAUTH_SECRET)
curl "http://127.0.0.1:5000/api/seed?key=YOUR_NEXTAUTH_SECRET"
```

---

## 8. CI/CD flow

```
push main → typecheck → build image (SITE_URL baked) → push ghcr.io/.../g-bath
         → SSH: write .env + compose → pull → up -d → health check
```

- Image: `ghcr.io/shariarsultanfahim/g-bath:latest` (+ git SHA tag)
- App dir on VPS: `/var/www/g-bath`
- MongoDB volume survives app restarts

---

## 9. Maintenance

```bash
cd /var/www/g-bath
docker compose logs -f app
docker compose restart app
docker compose ps
curl http://127.0.0.1:5000/api/health

# Backup MongoDB
docker exec gbath-mongodb mongodump --db g-bath --archive=/data/db/backup-$(date +%F).gz --gzip
docker cp gbath-mongodb:/data/db/backup-$(date +%F).gz ~/backups/

# Restore
docker cp ~/backups/backup.gz gbath-mongodb:/data/db/
docker exec gbath-mongodb mongorestore --db g-bath --archive=/data/db/backup.gz --gzip --drop
```

Update env: edit `ENV_FILE` secret → re-run workflow (or edit `/var/www/g-bath/.env` and `docker compose up -d`).

---

## Quick reference

| Action | Command |
|---|---|
| Logs | `docker compose logs -f app` |
| Restart | `docker compose restart app` |
| Health | `curl localhost:5000/api/health` |
| Seed | `curl "http://localhost:5000/api/seed?key=$NEXTAUTH_SECRET"` |
| SSL renew | `certbot renew` |
| Manual CI | Actions → **CI/CD — Build, Push & Deploy to VPS** → Run workflow |
