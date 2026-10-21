# SofiaCart — Deployment Guide

Two DigitalOcean droplets:

| Role | IP | Runs |
|------|----|------|
| **Web** | `178.128.111.10` | sofiacart-backend, sofiacart-website-backend, sofiacart-frontend, sofiacart-website + Nginx reverse proxy |
| **DB**  | `104.248.149.73` | MySQL 8.0 (one shared `sofiacart` database) |

### Port map (internal, on the Web server)

| App | Internal port | Public route (example) |
|-----|---------------|------------------------|
| sofiacart-backend (admin API) | `8000` | `https://api.sofiacart.com` |
| sofiacart-website-backend (store API) | `8001` | `https://store-api.sofiacart.com` |
| sofiacart-frontend (admin UI) | `3000` | `https://admin.sofiacart.com` |
| sofiacart-website (storefront) | `3001` | `https://sofiacart.com` |

> Replace the example domains with yours. If you don't have domains yet you can test everything by IP + port first, then add Nginx + TLS.

> ⚠️ **Both backends share the same MySQL database** (`sofiacart`). They coexist because the website-backend tracks its own migrations in `customer_api_migrations`. Do **not** give them separate databases.

---

## 0. Before you start — security note

The pasted credentials use the **same root password on both servers, in plaintext**. As the very first and very last steps of this guide you'll:

- create a non-root `deploy` user,
- install your SSH public key,
- disable root SSH + password auth,
- rotate both passwords.

Don't skip section 8.

---

## 1. One-time: get your SSH key onto both servers

On **your Mac**:

```bash
[ -f ~/.ssh/id_ed25519.pub ] || ssh-keygen -t ed25519 -C "sofiacart-deploy"
```

Copy it to each server (you'll be prompted for the root password `BlitzDev123Ako`):

```bash
ssh-copy-id root@178.128.111.10
```

```bash
ssh-copy-id root@104.248.149.73
```

Now you can `ssh root@178.128.111.10` without a password.

---

## 2. DB server (`104.248.149.73`) — MySQL 8.0

SSH in:

```bash
ssh root@104.248.149.73
```

Install MySQL:

```bash
apt update && apt -y upgrade && apt -y install mysql-server
```

Let MySQL listen on the private/public interface so the Web server can reach it (default is localhost only):

```bash
sed -i 's/^bind-address.*/bind-address = 0.0.0.0/' /etc/mysql/mysql.conf.d/mysqld.cnf
systemctl restart mysql
```

Create the shared database and an app user. **Pick a strong password** and keep it — it goes in both backend `.env` files as `DB_PASSWORD`:

```bash
mysql <<'SQL'
CREATE DATABASE IF NOT EXISTS sofiacart CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'sofiacart'@'178.128.111.10' IDENTIFIED BY 'CHANGE_ME_STRONG_DB_PASSWORD';
GRANT ALL PRIVILEGES ON sofiacart.* TO 'sofiacart'@'178.128.111.10';
FLUSH PRIVILEGES;
SQL
```

> The user is locked to the Web server's IP so only that box can connect.

Firewall: allow SSH from anywhere, MySQL **only** from the Web server:

```bash
ufw allow OpenSSH
ufw allow from 178.128.111.10 to any port 3306 proto tcp
ufw --force enable
```

Verify from the **Web server** later with:
`mysql -h 104.248.149.73 -u sofiacart -p sofiacart`

---

## 3. Web server (`178.128.111.10`) — base setup

SSH in:

```bash
ssh root@178.128.111.10
```

System packages + Docker + Node 20 + Nginx:

```bash
apt update && apt -y upgrade
apt -y install git nginx ufw ca-certificates curl
# Docker Engine + compose plugin
curl -fsSL https://get.docker.com | sh
# Node 20 LTS (for the two Next.js apps) + PM2
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt -y install nodejs
npm install -g pm2
```

Firewall (open web + SSH; the app ports stay internal behind Nginx):

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
```

Create a deploy directory and clone all four repos (swap in your Git remote URLs):

```bash
mkdir -p /opt/sofiacart && cd /opt/sofiacart
git clone <git-url> sofiacart-backend
git clone <git-url> sofiacart-website-backend
git clone <git-url> sofiacart-frontend
git clone <git-url> sofiacart-website
```

> No Git remote? From your Mac you can `rsync -av --exclude node_modules --exclude vendor ~/Desktop/sofia-cart/<app>/ root@178.128.111.10:/opt/sofiacart/<app>/` for each app instead.

---

## 4. Deploy sofiacart-backend (admin API → port 8000)

The committed `docker-compose.yml` spins up a **local** MySQL. In production we point at the remote DB server instead and drop the local `db` container. Create a production compose override:

```bash
cd /opt/sofiacart/sofiacart-backend
cat > docker-compose.prod.yml <<'YAML'
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: sofiacart-app
    working_dir: /var/www
    env_file: .env
    volumes:
      - ./:/var/www
      - vendor_data:/var/www/vendor
    extra_hosts:
      - "host.docker.internal:host-gateway"
    command: sh -c "git config --global --add safe.directory /var/www || true; (grep -q '^APP_KEY=base64:' .env || php artisan key:generate --force) && php-fpm"
    depends_on:
      - redis
    restart: unless-stopped

  queue:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: sofiacart-queue
    working_dir: /var/www
    env_file: .env
    volumes:
      - ./:/var/www
      - vendor_data:/var/www/vendor
    command: php artisan queue:work --sleep=3 --tries=3
    depends_on:
      - redis
    restart: unless-stopped

  nginx:
    image: nginx:1.27-alpine
    container_name: sofiacart-nginx
    ports:
      - "8000:80"
    volumes:
      - ./:/var/www
      - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - app
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: sofiacart-redis
    restart: unless-stopped

volumes:
  mysql_data:
  vendor_data:
YAML
```

Create the `.env` (copy the example, then edit the values shown):

```bash
cp .env.example .env
```

Set at least these keys in `.env` (`nano .env`):

```
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.sofiacart.com
FRONTEND_URL=https://admin.sofiacart.com

DB_CONNECTION=mysql
DB_HOST=104.248.149.73
DB_PORT=3306
DB_DATABASE=sofiacart
DB_USERNAME=sofiacart
DB_PASSWORD=CHANGE_ME_STRONG_DB_PASSWORD

QUEUE_CONNECTION=database
REDIS_HOST=redis
```

Build and start, install dependencies, generate key, migrate:

```bash
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml exec app composer install --no-dev --optimize-autoloader
docker compose -f docker-compose.prod.yml exec app php artisan key:generate --force
docker compose -f docker-compose.prod.yml exec app php artisan migrate --force
docker compose -f docker-compose.prod.yml exec app php artisan config:cache
```

Smoke test: `curl -I http://localhost:8000` should return an HTTP response.

---

## 5. Deploy sofiacart-website-backend (store API → port 8001)

This one already expects a remote DB via `host.docker.internal`, but we point it straight at the DB server. Same pattern:

```bash
cd /opt/sofiacart/sofiacart-website-backend
cat > docker-compose.prod.yml <<'YAML'
services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
      target: prod
    image: sofiacart-website-backend:prod
    container_name: sofiacart-website-api
    working_dir: /var/www
    env_file: .env
    volumes:
      - ./:/var/www
    extra_hosts:
      - "host.docker.internal:host-gateway"
    restart: unless-stopped

  web:
    image: nginx:1.27-alpine
    container_name: sofiacart-website-web
    ports:
      - "8001:80"
    volumes:
      - ./:/var/www
      - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - api
    restart: unless-stopped

  scheduler:
    build:
      context: .
      dockerfile: Dockerfile
      target: prod
    image: sofiacart-website-backend:prod
    container_name: sofiacart-website-scheduler
    working_dir: /var/www
    env_file: .env
    volumes:
      - ./:/var/www
    command: ["php", "artisan", "schedule:work"]
    restart: unless-stopped
YAML
```

> Check the real service/volume names in this repo's own `docker-compose.yml` and the Nginx conf path under `docker/nginx/` — adjust the override if they differ.

`.env`:

```bash
cp .env.example .env
```

Key values (`nano .env`):

```
APP_ENV=production
APP_DEBUG=false
APP_URL=https://store-api.sofiacart.com
APP_PORT=8001
FRONTEND_URL=https://sofiacart.com

DB_CONNECTION=mysql
DB_HOST=104.248.149.73
DB_PORT=3306
DB_DATABASE=sofiacart
DB_USERNAME=sofiacart
DB_PASSWORD=CHANGE_ME_STRONG_DB_PASSWORD
DB_MIGRATIONS_TABLE=customer_api_migrations

QUEUE_CONNECTION=sync
```

Build, start, migrate:

```bash
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml exec api composer install --no-dev --optimize-autoloader
docker compose -f docker-compose.prod.yml exec api php artisan key:generate --force
docker compose -f docker-compose.prod.yml exec api php artisan migrate --force
docker compose -f docker-compose.prod.yml exec api php artisan config:cache
```

Smoke test: `curl -I http://localhost:8001/api` (or a known route).

---

## 6. Deploy the Next.js frontends with PM2

### 6a. sofiacart-frontend (admin UI → port 3000)

```bash
cd /opt/sofiacart/sofiacart-frontend
cat > .env.production <<'ENV'
NEXT_PUBLIC_API_URL=https://api.sofiacart.com
ENV
npm ci
npm run build
pm2 start npm --name sofiacart-frontend -- start -- -p 3000
```

### 6b. sofiacart-website (storefront → port 3001)

```bash
cd /opt/sofiacart/sofiacart-website
cat > .env.production <<'ENV'
NEXT_PUBLIC_API_BASE_URL=https://store-api.sofiacart.com/api
NEXT_PUBLIC_ENABLE_API_MOCKS=false
ENV
npm ci
npm run build
pm2 start npm --name sofiacart-website -- start -- -p 3001
```

Persist PM2 across reboots:

```bash
pm2 save
pm2 startup systemd -u root --hp /root
```

> Testing by IP before you have domains? Set `NEXT_PUBLIC_API_URL=http://178.128.111.10:8000` and `NEXT_PUBLIC_API_BASE_URL=http://178.128.111.10:8001/api` instead, and rebuild. These are baked in at `npm run build`, so you must rebuild after changing them.

---

## 7. Nginx reverse proxy (Web server)

Create one server block per domain. Example for all four:

```bash
cat > /etc/nginx/sites-available/sofiacart <<'NGINX'
server {
    listen 80;
    server_name sofiacart.com www.sofiacart.com;
    location / { proxy_pass http://127.0.0.1:3001; include proxy_params; }
}
server {
    listen 80;
    server_name admin.sofiacart.com;
    location / { proxy_pass http://127.0.0.1:3000; include proxy_params; }
}
server {
    listen 80;
    server_name store-api.sofiacart.com;
    location / { proxy_pass http://127.0.0.1:8001; include proxy_params; }
}
server {
    listen 80;
    server_name api.sofiacart.com;
    location / { proxy_pass http://127.0.0.1:8000; include proxy_params; }
}
NGINX
ln -sf /etc/nginx/sites-available/sofiacart /etc/nginx/sites-enabled/sofiacart
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

Point your DNS A records (`sofiacart.com`, `admin`, `api`, `store-api`) at `178.128.111.10`, then add TLS:

```bash
apt -y install certbot python3-certbot-nginx
certbot --nginx -d sofiacart.com -d www.sofiacart.com -d admin.sofiacart.com -d api.sofiacart.com -d store-api.sofiacart.com
```

> After HTTPS is live, make sure each backend's `FRONTEND_URL` / CORS / Sanctum config lists the real frontend domains, and rebuild the frontends if you changed their `NEXT_PUBLIC_*` URLs.

---

## 8. Harden (do not skip)

On **both** servers:

```bash
adduser deploy
usermod -aG sudo deploy        # + 'docker' group on the Web server: usermod -aG docker deploy
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy
```

Then lock down SSH (`/etc/ssh/sshd_config`): set `PermitRootLogin no` and `PasswordAuthentication no`, then `systemctl restart ssh`. Confirm you can still log in as `deploy` **in a second terminal** before closing your root session.

Rotate the leaked passwords:

```bash
passwd root
```

---

## 9. Everyday operations

```bash
# Laravel backends
cd /opt/sofiacart/sofiacart-backend && docker compose -f docker-compose.prod.yml logs -f
docker compose -f docker-compose.prod.yml restart app

# Next.js frontends
pm2 logs sofiacart-website
pm2 restart sofiacart-frontend

# Redeploy after a git pull (frontend)
cd /opt/sofiacart/sofiacart-website && git pull && npm ci && npm run build && pm2 restart sofiacart-website

# Redeploy after a git pull (backend)
cd /opt/sofiacart/sofiacart-backend && git pull && docker compose -f docker-compose.prod.yml up -d --build \
  && docker compose -f docker-compose.prod.yml exec app php artisan migrate --force
```

---

## Checklist

- [ ] SSH keys installed on both servers
- [ ] MySQL running on DB server, `sofiacart` DB + user created, firewalled to Web server IP
- [ ] Web server has Docker, Node 20, PM2, Nginx
- [ ] sofiacart-backend up on :8000, migrated
- [ ] sofiacart-website-backend up on :8001, migrated (into `customer_api_migrations`)
- [ ] sofiacart-frontend built + PM2 on :3000
- [ ] sofiacart-website built + PM2 on :3001
- [ ] Nginx proxying all four domains, TLS issued
- [ ] Root login disabled, passwords rotated, `pm2 save` done
