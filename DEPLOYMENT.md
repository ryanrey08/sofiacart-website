# SofiaCart — Production deployment on sofiacart.ph (HTTPS)

All four apps run on one web server behind nginx, with HTTPS from Cloudflare, and share one MySQL
database on a separate database server.

| Address | App | Runs on (web server) |
| --- | --- | --- |
| `https://sofiacart.ph` (`www` redirects here) | **sofiacart-frontend** — merchants and Super Admin | PM2, `127.0.0.1:3000` |
| `https://api.sofiacart.ph` | **sofiacart-backend** — admin/merchant API | Docker, `127.0.0.1:8000` |
| `https://store-api.sofiacart.ph` | **sofiacart-website-backend** — customer API | Docker, `127.0.0.1:8001` |
| `https://<store>.sofiacart.ph` (e.g. `chemkleen`) | **sofiacart-website** — each store's shop | PM2, `127.0.0.1:3001` |

| Server | Role |
| --- | --- |
| Web server — `178.128.111.10` (DigitalOcean) | nginx + the four apps. To use another server (e.g. the Linode at `45.79.222.138`), use its IP wherever this guide says `WEB_IP`. |
| DB server — `104.248.149.73` (DigitalOcean) | MySQL 8, one shared `sofiacart` database (both backends use it; do **not** split it). |

Plain `http://` always redirects to `https://`. The apps only listen on `127.0.0.1`; the internet
reaches them only through nginx on port 443.

---

## 0. First: change the leaked passwords (do this before anything else)

An earlier version of this file contained the servers' **root password in plain text**, and this
repository is **public** on GitHub. It is still in the git history, so treat it as known to anyone.

On **every** server that used it (both DigitalOcean droplets, and the Linode if it shared it):

```bash
passwd root
```

Then finish section 10 (SSH keys only, no root or password logins). Never put passwords, keys or
tokens in this file or anywhere in git — keep them only in each server's `.env` files.

---

## 1. Cloudflare: DNS and HTTPS for sofiacart.ph and every store

Why Cloudflare: each store gets its own subdomain (`<store>.sofiacart.ph`), so HTTPS must cover
`*.sofiacart.ph`. Cloudflare's free plan does that automatically, with no certificate renewals,
and adds DDoS protection. (Without Cloudflare, see Appendix A.)

1. Create a free account at <https://dash.cloudflare.com>, **Add a site** → `sofiacart.ph` → Free plan.
2. Cloudflare imports the current GoDaddy DNS records. **Check the email records survived**
   (MX, and TXT records such as SPF) — your email runs through GoDaddy — before continuing.
3. Set these DNS records, all **Proxied** (orange cloud), and delete the old `A sofiacart.ph →
   45.79.222.138` record:

   | Type | Name | Content |
   | --- | --- | --- |
   | A | `@` | `WEB_IP` |
   | A | `www` | `WEB_IP` |
   | A | `api` | `WEB_IP` |
   | A | `store-api` | `WEB_IP` |
   | A | `*` | `WEB_IP` |

4. In **GoDaddy → sofiacart.ph → DNS → Nameservers → Change**, enter the two nameservers
   Cloudflare shows you. Wait until Cloudflare says the site is **Active** (minutes to a few hours).
5. **SSL/TLS → Overview**: set encryption mode to **Full (strict)**.
6. **SSL/TLS → Edge Certificates**: turn on **Always Use HTTPS** and **Automatic HTTPS Rewrites**;
   set **Minimum TLS Version** to 1.2.
7. **SSL/TLS → Origin Server → Create Certificate**: RSA, hostnames `sofiacart.ph` and
   `*.sofiacart.ph`, validity 15 years. Keep the page open — you need the certificate and the
   private key in section 7 (the key is shown only once).

---

## 2. Web server: base setup (once)

```bash
ssh root@WEB_IP
```

```bash
apt update && apt -y upgrade
apt -y install git nginx ufw ca-certificates curl unattended-upgrades
curl -fsSL https://get.docker.com | sh
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt -y install nodejs
npm install -g pm2
```

Firewall — SSH and web only. (Docker-published ports would bypass ufw, which is why the apps'
ports are bound to `127.0.0.1` in the compose files.)

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
```

---

## 3. Get the code (all four repos, `main` branch)

```bash
mkdir -p /opt/sofiacart && cd /opt/sofiacart
git clone https://github.com/ryanrey08/sofiacart-backend.git
git clone https://github.com/ryanrey08/sofiacart-frontend.git
git clone https://github.com/ryanrey08/sofiacart-website.git
git clone git@github.com:ryanrey08/sofiacart-website-backend.git
```

`sofiacart-website-backend` is private: add the server's SSH public key
(`ssh-keygen -t ed25519` then `cat ~/.ssh/id_ed25519.pub`) as a read-only **Deploy key** in that
repository's GitHub settings first.

Already cloned? Update each with `git -C /opt/sofiacart/<repo> pull origin main`.

---

## 4. sofiacart-backend — admin/merchant API (`api.sofiacart.ph`)

```bash
cd /opt/sofiacart/sofiacart-backend
cp .env.example .env
nano .env
```

Set these values (replace the `<...>` placeholders; keep the rest of the file as it is):

```dotenv
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.sofiacart.ph
# The merchant platform; the only browser origin this API accepts (CORS).
FRONTEND_URL=https://sofiacart.ph
LOG_LEVEL=warning

DB_CONNECTION=mysql
DB_HOST=<DB server IP, the private IP if both servers share a private network>
DB_PORT=3306
DB_DATABASE=sofiacart
DB_USERNAME=sofiacart
DB_PASSWORD=<strong database password>

SESSION_DRIVER=database
SESSION_SECURE_COOKIE=true
FILESYSTEM_DISK=public
QUEUE_CONNECTION=database
CACHE_STORE=database

LEGAL_DOCUMENTS_DISK=legal
LEGAL_DOCUMENTS_MAX_KB=10240
LEGAL_DOCUMENTS_REQUIRE_ACCEPTANCE=true

MAIL_MAILER=smtp
MAIL_HOST=<your SMTP host>
MAIL_PORT=465
MAIL_SCHEME=smtps
MAIL_USERNAME=<mailbox>
MAIL_PASSWORD=<mailbox password>
MAIL_FROM_ADDRESS=<no-reply@sofiacart.ph>
MAIL_FROM_NAME=SofiaCart
```

Start it, then prepare the app (each line once):

```bash
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml exec app composer install --no-dev --optimize-autoloader --no-interaction
docker compose -f docker-compose.prod.yml exec app php artisan key:generate --force
docker compose -f docker-compose.prod.yml exec app sh -c 'mkdir -p storage/app/private/legal-documents && chown -R www-data:www-data storage bootstrap/cache'
docker compose -f docker-compose.prod.yml exec app php artisan storage:link
docker compose -f docker-compose.prod.yml exec app php artisan migrate --force
docker compose -f docker-compose.prod.yml exec app php artisan db:seed --class='Database\Seeders\AdminAuthorizationSeeder' --force
docker compose -f docker-compose.prod.yml exec app php artisan config:cache
docker compose -f docker-compose.prod.yml exec app php artisan route:cache
docker compose -f docker-compose.prod.yml restart queue scheduler
```

Check: `curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8000/up` prints `200`.

No Super Admin yet? Create one (it prints a one-time password-setup token only with
`--show-token`):

```bash
docker compose -f docker-compose.prod.yml exec app php artisan admin:provision-super-admin you@sofiacart.ph "Your Name" --show-token
```

Store addresses that clash with platform subdomains (`www`, `api`, `store-api`, …) are refused at
registration from now on. Check that no **existing** store already uses one:

```bash
docker compose -f docker-compose.prod.yml exec app php artisan tinker --execute='echo App\Models\Merchant::whereIn("store_slug", App\Models\Merchant::RESERVED_STORE_SLUGS)->pluck("store_slug")->implode(", ") ?: "none";'
```

---

## 5. sofiacart-website-backend — customer API (`store-api.sofiacart.ph`)

```bash
cd /opt/sofiacart/sofiacart-website-backend
cp .env.example .env
nano .env
```

```dotenv
APP_ENV=production
APP_DEBUG=false
APP_KEY=<generated below>
APP_URL=https://store-api.sofiacart.ph
FRONTEND_URL=https://sofiacart.ph

# Store subdomains. Keep the single quotes on the pattern.
STOREFRONT_STORE_URL=https://{store}.sofiacart.ph
STOREFRONT_ORIGIN_PATTERN='#^https://[a-z0-9-]+\.sofiacart\.ph$#'
# Product images and store logos are served by the admin API.
MEDIA_URL=https://api.sofiacart.ph/storage

DB_CONNECTION=mysql
DB_HOST=<same as sofiacart-backend>
DB_PORT=3306
DB_DATABASE=sofiacart
DB_USERNAME=sofiacart
DB_PASSWORD=<same as sofiacart-backend>
DB_MIGRATIONS_TABLE=customer_api_migrations

SESSION_SECURE_COOKIE=true
CACHE_STORE=file
QUEUE_CONNECTION=sync

LEGAL_DOCUMENTS_DISK=legal
LEGAL_DOCUMENTS_REQUIRE_ACCEPTANCE=true

# Payments: live keys from your HitPay dashboard (server-side only).
HITPAY_ENABLED=true
HITPAY_MODE=live
HITPAY_API_KEY=<from HitPay>
HITPAY_SALT=<from HitPay>

MAIL_MAILER=smtp
MAIL_HOST=<your SMTP host>
MAIL_PORT=465
MAIL_SCHEME=smtps
MAIL_USERNAME=<mailbox>
MAIL_PASSWORD=<mailbox password>
MAIL_FROM_ADDRESS=<no-reply@sofiacart.ph>
MAIL_FROM_NAME=SofiaCart
```

This image reads its settings from `.env` and won't start without `APP_KEY`. Generate one and
paste it into `APP_KEY=`:

```bash
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml run --rm --no-deps --entrypoint php api artisan key:generate --show
nano .env
```

Start and migrate:

```bash
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml exec api php artisan migrate --force
```

Check: `curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8001/up` prints `200`.

In the HitPay dashboard, set the webhook URL to
`https://store-api.sofiacart.ph/api/payments/hitpay/webhook`.

---

## 6. The two Next.js apps (PM2)

`NEXT_PUBLIC_*` values are built into the app: after changing them, run `npm run build` again.

### sofiacart-frontend — `sofiacart.ph`

```bash
cd /opt/sofiacart/sofiacart-frontend
cat > .env.production <<'ENV'
NEXT_PUBLIC_API_URL=https://api.sofiacart.ph
NEXT_PUBLIC_STORE_URL_TEMPLATE=https://{store}.sofiacart.ph
ENV
npm ci
npm run build
pm2 start npm --name sofiacart-frontend -- start -- -p 3000 -H 127.0.0.1
```

### sofiacart-website — `<store>.sofiacart.ph`

```bash
cd /opt/sofiacart/sofiacart-website
cat > .env.production <<'ENV'
NEXT_PUBLIC_APP_NAME=SofiaCart
NEXT_PUBLIC_API_BASE_URL=https://store-api.sofiacart.ph/api
NEXT_PUBLIC_ENABLE_API_MOCKS=false
NEXT_PUBLIC_STORE_ROOT_DOMAIN=sofiacart.ph
NEXT_PUBLIC_PLATFORM_URL=https://sofiacart.ph
NEXT_PUBLIC_SITE_URL=https://sofiacart.ph
API_INTERNAL_BASE_URL=http://127.0.0.1:8001/api
ENV
npm ci
npm run build
pm2 start npm --name sofiacart-website -- start -- -p 3001 -H 127.0.0.1
```

Keep both running after reboots:

```bash
pm2 save
pm2 startup systemd
```

---

## 7. nginx with HTTPS

Install the Cloudflare Origin certificate from section 1, step 7:

```bash
mkdir -p /etc/ssl/sofiacart
nano /etc/ssl/sofiacart/origin.pem     # paste the certificate
nano /etc/ssl/sofiacart/origin.key     # paste the private key
chmod 600 /etc/ssl/sofiacart/origin.key
```

Show visitors' real IP addresses to the apps (otherwise every visitor looks like a Cloudflare
server, and login rate limits would throttle everyone together):

```bash
{ for ip in $(curl -s https://www.cloudflare.com/ips-v4) $(curl -s https://www.cloudflare.com/ips-v6); do
    echo "set_real_ip_from $ip;"
  done
  echo "real_ip_header CF-Connecting-IP;"
} > /etc/nginx/conf.d/cloudflare-realip.conf
```

Install the SofiaCart site (`deploy/nginx/` in this repo) and remove the default one:

```bash
cp /opt/sofiacart/sofiacart-website/deploy/nginx/sofiacart-ssl.conf /etc/nginx/snippets/sofiacart-ssl.conf
cp /opt/sofiacart/sofiacart-website/deploy/nginx/sofiacart-ssl-stores.conf /etc/nginx/snippets/sofiacart-ssl-stores.conf
cp /opt/sofiacart/sofiacart-website/deploy/nginx/sofiacart.ph.conf /etc/nginx/sites-available/sofiacart.ph
ln -sf /etc/nginx/sites-available/sofiacart.ph /etc/nginx/sites-enabled/sofiacart.ph
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

---

## 8. Check it works

From your own computer once Cloudflare is **Active**:

```bash
curl -sI http://sofiacart.ph | head -3
```

expects `301` to `https://sofiacart.ph/`.

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://sofiacart.ph/login
```

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://api.sofiacart.ph/up
```

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://store-api.sofiacart.ph/up
```

each print `200`. In a browser: `https://sofiacart.ph` shows the merchant sign-in with a padlock,
and `https://<an approved store's slug>.sofiacart.ph` shows that store; an unknown subdomain shows
"Store not found".

---

## 9. Before you announce it

1. Sign in as Super Admin → **Platform → Legal Documents**: upload and **publish** the buyer and
   merchant Terms and Privacy Policy. Customer and merchant registration stays closed until both
   documents for that audience are published.
2. Make a test merchant registration and a test order on a store subdomain.
3. Retire the old server only after everything above works (the Linode at `45.79.222.138`
   currently serves the old customer site at `sofiacart.ph`).

---

## 10. Harden the servers (do not skip)

On **both** servers:

```bash
adduser deploy
usermod -aG sudo deploy
usermod -aG docker deploy      # web server only
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy
```

In `/etc/ssh/sshd_config` set `PermitRootLogin no` and `PasswordAuthentication no`, then
`systemctl restart ssh`. Confirm you can still log in as `deploy` **in a second terminal** before
closing the root session.

Database server:

- MySQL reachable **only** from the web server: `ufw allow from <web server IP> to any port 3306 proto tcp`
  (prefer the droplets' private network IPs if they're in the same region).
- The `sofiacart` MySQL user limited to the web server's IP, with a long random password.
- Daily backups, e.g. DigitalOcean droplet backups plus a nightly `mysqldump` kept off the server.

Optional: allow ports 80/443 only from Cloudflare's IP ranges, so nobody can bypass Cloudflare.

---

## 11. Updating to a new version

```bash
# Admin API
cd /opt/sofiacart/sofiacart-backend && git pull origin main \
  && docker compose -f docker-compose.prod.yml up -d --build \
  && docker compose -f docker-compose.prod.yml exec app composer install --no-dev --optimize-autoloader --no-interaction \
  && docker compose -f docker-compose.prod.yml exec app php artisan migrate --force \
  && docker compose -f docker-compose.prod.yml exec app php artisan config:cache \
  && docker compose -f docker-compose.prod.yml exec app php artisan route:cache \
  && docker compose -f docker-compose.prod.yml restart queue scheduler

# Customer API (the image contains the code, so rebuild it)
cd /opt/sofiacart/sofiacart-website-backend && git pull origin main \
  && docker compose -f docker-compose.prod.yml up -d --build \
  && docker compose -f docker-compose.prod.yml exec api php artisan migrate --force

# Merchant platform
cd /opt/sofiacart/sofiacart-frontend && git pull origin main && npm ci && npm run build && pm2 restart sofiacart-frontend

# Store sites
cd /opt/sofiacart/sofiacart-website && git pull origin main && npm ci && npm run build && pm2 restart sofiacart-website
```

Logs: `docker compose -f docker-compose.prod.yml logs -f` (backends), `pm2 logs` (Next.js apps),
`/var/log/nginx/error.log`.

---

## Appendix A — HTTPS without Cloudflare (Let's Encrypt)

Keep GoDaddy DNS and point the same A records (`@`, `www`, `api`, `store-api`, `*`) at `WEB_IP`.
Use two free Let's Encrypt certificates, and skip the Cloudflare real-IP step.

1. **Platform names** — renews automatically (HTTP challenge; port 80 must reach this server):

   ```bash
   apt -y install certbot
   mkdir -p /var/www/letsencrypt
   certbot certonly --webroot -w /var/www/letsencrypt --cert-name sofiacart.ph \
     -d sofiacart.ph -d www.sofiacart.ph -d api.sofiacart.ph -d store-api.sofiacart.ph \
     --deploy-hook "systemctl reload nginx"
   ```

   The nginx config serves `/.well-known/acme-challenge/` over plain HTTP for this, so renewals
   keep working. nginx needs some certificate to start: until this one exists, point the snippets
   at a temporary self-signed certificate.

   In `/etc/nginx/snippets/sofiacart-ssl.conf` use
   `/etc/letsencrypt/live/sofiacart.ph/fullchain.pem` and `/etc/letsencrypt/live/sofiacart.ph/privkey.pem`.

2. **Store subdomains** (`*.sofiacart.ph`) — Let's Encrypt issues wildcards only through a DNS
   challenge, and GoDaddy's DNS API is generally unavailable, so this one is renewed **by hand every
   90 days** (Let's Encrypt emails a reminder):

   ```bash
   certbot certonly --manual --preferred-challenges dns --cert-name sofiacart-stores -d "*.sofiacart.ph"
   ```

   Certbot shows a value: add it at GoDaddy as a **TXT** record named `_acme-challenge`, wait a
   minute, then continue. In `/etc/nginx/snippets/sofiacart-ssl-stores.conf` use
   `/etc/letsencrypt/live/sofiacart-stores/fullchain.pem` and `.../privkey.pem`.

3. Reload after the manual renewal: `nginx -t && systemctl reload nginx` (automatic renewals of the
   first certificate reload nginx through the deploy hook).

Moving to Cloudflare later (section 1) removes the manual renewal.

## Checklist

- [ ] Root passwords changed on every server (section 0)
- [ ] Cloudflare active, DNS records proxied, Full (strict), Origin certificate created
- [ ] Admin API up on `127.0.0.1:8000`, migrated, permissions seeded, `storage:link`
- [ ] Customer API up on `127.0.0.1:8001`, `APP_KEY` set, migrated, HitPay webhook set
- [ ] Both Next.js apps built and running in PM2, `pm2 save` done
- [ ] nginx installed with the Origin certificate and Cloudflare real-IP config, `nginx -t` OK
- [ ] All checks in section 8 pass over HTTPS
- [ ] Legal documents published (section 9)
- [ ] SSH keys only, root login off, DB firewalled, backups on (section 10)
