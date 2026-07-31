# 🚀 Deployment Guide — Good Bathroom Renos

> **Target Domain:** `https://app.goodbathroomrenos.ca`
> **VPS Provider:** Hostinger (Ubuntu 22.04 / 24.04 LTS)

---

## Architecture at a Glance

```
┌──────────────┐       ┌──────────────┐        ┌──────────────────┐
│   Browser    │──443──│    Nginx     │──5000──│  Next.js App     │
│              │       │  (SSL/gzip)  │        │  (Docker)        │
└──────────────┘       └──────────────┘        └──────┬───────────┘
                                                      │
                                                ┌─────▼──────────┐
                                                │   MongoDB 7.0  │
                                                │   (Docker)     │
                                                └────────────────┘
```

| Layer | Runs on | Notes |
|---|---|---|
| **Nginx** | Host (not Docker) | Reverse proxy, SSL termination, gzip, SSE support |
| **Next.js App** | Docker container `gbath-app` | Standalone build, port 5000, reads `.env` |
| **MongoDB** | Docker container `gbath-mongodb` | Persistent volume, port 27017 (localhost only) |
| **CI/CD** | GitHub Actions | Lint → Build → Push to GHCR → SSH Deploy |

---

## Table of Contents

1. [DNS Setup](#1-dns-setup)
2. [First-Time VPS Setup](#2-first-time-vps-setup)
3. [Install Docker](#3-install-docker)
4. [Install Nginx & SSL](#4-install-nginx--ssl)
5. [GitHub Secrets Configuration](#5-github-secrets-configuration)
6. [First Deployment](#6-first-deployment)
7. [Database Seeding](#7-database-seeding)
8. [How the CI/CD Pipeline Works](#8-how-the-cicd-pipeline-works)
9. [Maintenance & Troubleshooting](#9-maintenance--troubleshooting)

### Go-live checklist

Run these once on a fresh VPS (details in the sections below):

1. DNS — A record `app` → VPS IP; confirm `ping app.goodbathroomrenos.ca`
2. VPS — Ubuntu update, UFW (22/80/443), Docker Engine + Compose plugin
3. Nginx — Install nginx + certbot; copy `nginx/app.goodbathroomrenos.ca.conf` to `sites-available`, enable site (HTTP proxy first)
4. Start app containers (CI deploy or manual compose under `/var/www/g-bath`)
5. SSL — `certbot --nginx -d app.goodbathroomrenos.ca`
6. GitHub secrets — `VPS_HOST`, `VPS_USERNAME`, `VPS_SSH_KEY`, `VPS_PORT`, `GHCR_PAT`, `ENV_FILE` (from `.env.production.example`)
7. Deploy — push to `main` or `workflow_dispatch`
8. DB — `prisma db push` + seed via `/api/seed` (section 7)

---

## 1. DNS Setup

Go to your domain DNS manager and create an **A record**:

| Type | Host | Value | TTL |
|---|---|---|---|
| `A` | `app` | `YOUR_VPS_IP_ADDRESS` | 3600 |

Wait for DNS propagation (5–30 minutes), then verify:

```bash
ping app.goodbathroomrenos.ca
```

---

## 2. First-Time VPS Setup

SSH into your Hostinger VPS:

```bash
ssh root@YOUR_VPS_IP_ADDRESS
```

### Update system packages

```bash
apt update && apt upgrade -y
```

### Set timezone

```bash
timedatectl set-timezone America/Toronto
```

### Configure firewall

```bash
apt install ufw -y
ufw allow 22/tcp     # SSH
ufw allow 80/tcp     # HTTP
ufw allow 443/tcp    # HTTPS
ufw enable
ufw status
```

### Install essential tools

```bash
apt install -y curl wget git htop nano
```

---

## 3. Install Docker

```bash
# Add Docker's official GPG key and repository
apt install -y ca-certificates curl gnupg lsb-release
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine + Compose plugin
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Verify installation
docker --version
docker compose version
```

---

## 4. Install Nginx & SSL

### Install Nginx + Certbot

```bash
apt install -y nginx certbot python3-certbot-nginx
systemctl enable nginx
systemctl start nginx
```

### Create site config

```bash
nano /etc/nginx/sites-available/app.goodbathroomrenos.ca
```

Paste the content from the repo file `nginx/app.goodbathroomrenos.ca.conf`.  
**For the initial setup** (before SSL), use only the `server` block listening on port 80 with the proxy_pass location — skip the port 443 block for now. Certbot will generate it for you.

**Simplified initial config** (paste this first):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name app.goodbathroomrenos.ca;

    client_max_body_size 50M;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location /api/notifications/stream {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 86400s;
    }

    location /_next/static/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Enable the site

```bash
ln -s /etc/nginx/sites-available/app.goodbathroomrenos.ca /etc/nginx/sites-enabled/
nginx -t            # Test config is valid
systemctl reload nginx
```

### Generate SSL certificate

> ⚠️ Make sure DNS is pointing to the VPS and the app containers are running before this step.

```bash
certbot --nginx -d app.goodbathroomrenos.ca
```

Certbot will:
- Obtain a free Let's Encrypt SSL certificate
- Automatically update the Nginx config to add the `443` server block
- Set up auto-renewal via systemd timer

Verify auto-renewal is active:

```bash
certbot renew --dry-run
```

---

## 5. GitHub Secrets Configuration

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.

You need to add **5 secrets**:

### VPS Connection Secrets

| Secret Name | Value | Example |
|---|---|---|
| `VPS_HOST` | Your Hostinger VPS public IP | `154.56.xxx.xxx` |
| `VPS_USERNAME` | SSH username | `root` |
| `VPS_SSH_KEY` | Full private key content | *(see below)* |
| `VPS_PORT` | SSH port number | `22` |

**To generate an SSH deployment key:**

```bash
# Run on your local machine (or on the VPS itself)
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/gbath_deploy
```

- Copy the **private key** (`cat ~/.ssh/gbath_deploy`) → paste as `VPS_SSH_KEY` secret
- Copy the **public key** (`cat ~/.ssh/gbath_deploy.pub`) → add to VPS authorized keys:

```bash
# On VPS
cat >> ~/.ssh/authorized_keys << 'EOF'
<paste your public key here>
EOF
```

### GHCR Authentication Secret

| Secret Name | Value |
|---|---|
| `GHCR_PAT` | A GitHub Personal Access Token with `read:packages` scope |

**How to create the PAT:**
1. Go to GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **Generate new token (classic)**
3. Name: `gbath-vps-deploy`
4. Select scope: **`read:packages`**
5. Generate & copy → paste as `GHCR_PAT` secret

### Environment Variables Secret

| Secret Name | Value |
|---|---|
| `ENV_FILE` | The entire production `.env` file content |

Use [`.env.production.example`](.env.production.example) as the template. **Copy-paste it as the value of `ENV_FILE`**, replacing the placeholders:

```env
NEXT_PUBLIC_SITE_URL=https://app.goodbathroomrenos.ca
NEXT_PUBLIC_API_URL=https://app.goodbathroomrenos.ca

# Database Connection (Uses local MongoDB container configured as replica set rs0)
DATABASE_URL="mongodb://mongodb:27017/g-bath?replicaSet=rs0&directConnection=true"

# NextAuth
NEXTAUTH_SECRET="GENERATE_A_STRONG_RANDOM_SECRET_HERE"
NEXTAUTH_URL="https://app.goodbathroomrenos.ca"
AUTH_TRUST_HOST=true
```

> 💡 Generate a strong secret with: `openssl rand -base64 32`

> ⚠️ **Important:** The `DATABASE_URL` uses `mongodb` (the Docker service name) as the hostname — not `127.0.0.1` or `localhost`. Docker Compose networking resolves the service name to the container's internal IP automatically.

> ⚠️ **Build-time note:** `NEXT_PUBLIC_*` values are also passed as Docker **build-args** in `.github/workflows/deploy.yml` so the client bundle is compiled for `https://app.goodbathroomrenos.ca`. Runtime `.env` alone does not rewrite those baked-in URLs — change the workflow build-args if the domain changes.

---

## 6. First Deployment

### Option A: Automatic (Push to Main)

Just push your code to the `main` branch:

```bash
git add .
git commit -m "feat: add Docker deployment setup"
git push origin main
```

The GitHub Actions pipeline will automatically:
1. ✅ Lint & typecheck
2. 🐳 Build Docker image → push to `ghcr.io`
3. 🚀 SSH into VPS → write `.env` → write `docker-compose.yml` → pull image → start containers

### Option B: Manual First-Time Setup on VPS

If you want to start containers manually for the first time:

```bash
# On VPS
mkdir -p /var/www/g-bath
cd /var/www/g-bath

# Create .env file manually
nano .env
# Paste the production env vars (same content as ENV_FILE secret)

# Create docker-compose.yml manually
nano docker-compose.yml
# Paste the content from the repo's docker-compose.yml

# Login to GHCR
echo "YOUR_GHCR_PAT" | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

# Pull and start
docker compose pull
docker compose up -d

# Verify
docker compose ps
docker compose logs -f app
```

---

## 7. Database Seeding

After the first deployment, you need to push the Prisma schema and seed the admin user:

```bash
# On VPS
cd /var/www/g-bath

# Push Prisma schema to MongoDB (pinning v6 + skipping generate in production container)
docker exec -it gbath-app npx prisma@6.4.0 db push --skip-generate

# Seed database (creates initial admin & seller users)
# Pass your NEXTAUTH_SECRET as the key query parameter:
curl "http://localhost:5000/api/seed?key=YOUR_NEXTAUTH_SECRET"
```

---

## 8. How the CI/CD Pipeline Works

```
┌─────────────┐    ┌──────────────┐    ┌──────────────────┐
│ Push to main │───▶│ Lint &       │───▶│ Build & Push     │
│              │    │ Typecheck    │    │ to GHCR          │
└─────────────┘    └──────────────┘    └────────┬─────────┘
                                                │
                                       ┌────────▼─────────┐
                                       │ Deploy to VPS     │
                                       │                   │
                                       │ 1. Write .env     │
                                       │ 2. Write compose  │
                                       │ 3. docker pull    │
                                       │ 4. docker up -d   │
                                       │ 5. image prune    │
                                       └───────────────────┘
```

- **Trigger:** Every push to `main` branch, or manually via "Run workflow" button
- **Docker image tags:** `latest` + git SHA (e.g., `abc1234`)
- **Build-args:** `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_API_URL` are set to `https://app.goodbathroomrenos.ca` during the image build
- **`.env` on VPS:** Written fresh from the `ENV_FILE` secret on every deploy — update the secret in GitHub to change env vars, no SSH needed (see `.env.production.example`)
- **Zero-downtime:** Docker Compose pulls the new image and restarts the app container; MongoDB stays running with its persistent volume

---

## 9. Maintenance & Troubleshooting

### View application logs

```bash
cd /var/www/g-bath
docker compose logs -f app          # Follow app logs
docker compose logs -f mongodb      # Follow database logs
docker compose logs --tail=100 app  # Last 100 lines
```

### Restart services

```bash
docker compose restart app      # Restart just the app
docker compose restart          # Restart all services
docker compose down && docker compose up -d  # Full restart
```

### Check container health

```bash
docker compose ps                   # See status + health
curl http://localhost:5000/api/health   # Test health endpoint directly
```

### Update environment variables

1. Go to GitHub → Repository Settings → Secrets → Edit `ENV_FILE`
2. Update the values
3. Push any commit to `main` (or trigger the workflow manually)
4. The pipeline will write the new `.env` and restart the container

### Backup MongoDB

```bash
# Create backup
docker exec gbath-mongodb mongodump --db g-bath --archive=/data/db/backup-$(date +%F).gz --gzip

# Copy backup from container to host
docker cp gbath-mongodb:/data/db/backup-$(date +%F).gz ~/backups/
```

### Restore MongoDB from backup

```bash
docker cp ~/backups/backup-2024-01-01.gz gbath-mongodb:/data/db/
docker exec gbath-mongodb mongorestore --db g-bath --archive=/data/db/backup-2024-01-01.gz --gzip --drop
```

### Disk space cleanup

```bash
docker system prune -af --volumes  # ⚠️ Removes ALL unused images, containers, volumes
docker image prune -f              # Only remove dangling images (safer)
```

### SSH into app container

```bash
docker exec -it gbath-app sh       # Alpine shell
```

### Re-trigger deployment manually

Go to GitHub → **Actions** → **CI/CD — Build, Push & Deploy to VPS** → **Run workflow** → Select `main` → **Run workflow**

### Check SSL certificate status

```bash
certbot certificates
certbot renew --dry-run
```

---

## Quick Reference

| Action | Command |
|---|---|
| View logs | `docker compose logs -f app` |
| Restart app | `docker compose restart app` |
| Check health | `curl localhost:5000/api/health` |
| Container status | `docker compose ps` |
| Seed database | `docker exec -it gbath-app npx tsx prisma/seed.ts` |
| Backup DB | `docker exec gbath-mongodb mongodump --db g-bath --archive=/data/db/backup.gz --gzip` |
| Renew SSL | `certbot renew` |
| Manual deploy | GitHub Actions → Run workflow |
