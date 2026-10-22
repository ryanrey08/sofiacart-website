# SofiaCart — Security review and hardening

Date: 2026-10-22. Covers all four repos: `sofiacart-website` (customer site),
`sofiacart-website-backend` (customer API), `sofiacart-frontend` (Super Admin + merchant),
`sofiacart-backend` (admin/merchant API). This documents what was checked, what was fixed in code,
and what **you** must do on the server (I can't install certificates, firewalls or rotate
production secrets for you).

This is a baseline hardening pass, not a formal penetration test or a guarantee.

## 1. What was fixed in code (applied + verified locally)

| # | Fix | Repos | Why |
| --- | --- | --- | --- |
| 1 | **Security response headers** (HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, a conservative CSP) on every page/response | both Next apps (`next.config.ts`) and both Laravel APIs (`app/Http/Middleware/SecurityHeaders.php`) | Clickjacking, MIME sniffing, HTTPS downgrade, referrer and feature-policy hardening |
| 2 | **`X-Powered-By` removed** (`poweredByHeader: false`) | both Next apps | Stop advertising the framework/version |
| 3 | **Admin/merchant API CORS locked** to `FRONTEND_URL` (was the framework default, which allows any origin) | `sofiacart-backend/config/cors.php` | Only the seller dashboard may call the admin API from a browser |
| 4 | **Global API rate limit** (120/min, keyed by user or IP) added; sensitive routes keep their own stricter limits | `sofiacart-backend` | Most authenticated admin/merchant endpoints had **no** rate limit |
| 5 | **`APP_DEBUG=false`** in the example env | `sofiacart-backend/.env.example` | It shipped `true`; debug mode leaks stack traces and config |
| 6 | **Trust the reverse proxy** (`trustProxies(at: '*')`) | both Laravel APIs | So HTTPS is detected and secure URLs/cookies work behind nginx |
| 7 | **Unauthenticated API requests return a clean 401 JSON** instead of a 500 "Route [login] not defined" with a stack trace | both Laravel APIs (`redirectGuestsTo(null)` + auth-exception render) | A probe without an `Accept` header previously triggered a 500 and, with debug on, a full trace |

Verified locally: both Next apps build and serve the headers with no `X-Powered-By`; both APIs
return the headers; admin CORS does not grant a foreign origin; unauthenticated API calls now 401
cleanly with and without an `Accept` header; the document viewers still render under the CSP (no
console violations); backend suites stayed green (admin 197/198 — the one failure is the
pre-existing `OrderWorkflowTest`; customer 91/91).

**Behavior change to be aware of (#3):** the admin API now rejects browser calls from any origin
other than `FRONTEND_URL`. In production set `FRONTEND_URL` to the seller-dashboard origin
(e.g. `https://seller.sofiacart.ph`). If you ever add another browser client, add its origin there.

## 2. What was checked and found OK

- **No secrets committed.** No `.env`, keys or tokens are tracked in any repo (only `.env.example`).
- **No SQL injection** in the `selectRaw`/`DB::raw` reporting queries — every interpolated column is
  a hardcoded literal; no request input reaches them. Everything else uses the query builder /
  Eloquent (parameterized).
- **Payment webhook (HitPay)** is verified with HMAC-SHA256 and `hash_equals` (timing-safe); a
  payment is never marked paid from a browser redirect.
- **File uploads** (legal documents, merchant permits/IDs, product images, return evidence, payment
  attachments) validate type and size on the server. Legal documents additionally verify the file
  contents (real PDF / WordprocessingML, no macros), store on a private non-public disk under
  generated names, and stream through controlled endpoints with path-traversal checks.
- **Auth:** Sanctum bearer tokens with expiry; admin tokens carry an `admin` ability; passwords are
  hashed; the customer API keeps its tokens in a separate table from admin/merchant tokens.
- **Rate limiting** already protected the customer API globally and the sensitive admin endpoints
  (login, password, email verification).
- **Customer API** already locked CORS to one origin and hid model class names/ids in 404s.
- **Mass assignment** is guarded (`$fillable` / `$guarded`); the legal-document models hide
  `file_path`.

## 3. What YOU must do on the server (I can't do these)

These are operational and must be done where the apps run. **None of them are optional for a public
launch.**

1. **HTTPS / TLS.** Issue a free Let's Encrypt certificate (nginx + certbot) for every host and
   redirect all HTTP → HTTPS. You wrote `http://sofiacart.ph`; it must be `https://`. Tokens and
   payments over plain HTTP are insecure. The code already assumes HTTPS in production
   (verification links are forced to https, and the proxy is trusted).
2. **Set production env** (never commit it): `APP_ENV=production`, `APP_DEBUG=false`,
   `APP_URL=https://…`, `FRONTEND_URL=https://…` (the right origin per app — see the deploy notes),
   `MEDIA_URL=https://api-admin.sofiacart.ph/storage`, and on both APIs
   `SESSION_SECURE_COOKIE=true`.
3. **Generate fresh secrets for production**, separate from any dev values:
   - `php artisan key:generate` (a unique `APP_KEY` per backend),
   - strong, unique **database** credentials (not `sofiacart` / `secret` from the dev compose file),
   - real **HitPay** live keys/salt, mail credentials, and any other API keys — all via env, never
     committed. If any dev secret was ever shared, rotate it.
4. **Firewall / network.** Expose only 80/443. Do **not** publish MySQL (3306), Redis (6379),
   phpMyAdmin (8080) or Mailpit (8025) to the internet — those are dev-compose conveniences. Bind
   them to localhost or a private network.
5. **Shared legal-document storage** (from the legal-documents feature): both APIs must read the
   same files. Use one S3 bucket (set the `legal` disk to `s3` in both backends) or a shared volume.
   See `SOFIACART_LEGAL_DOCUMENTS_STATUS.md`.
6. **Keep software patched** and take **database backups** (and test a restore).
7. Run the queue/scheduler as managed services, and set a real cache/queue driver for production.

## 4. Recommended follow-ups (not yet done)

- **Tighten the CSP.** The current policy only sets `frame-ancestors 'none'; base-uri 'self';
  object-src 'none'` so it can't break the PDF/Word viewers (which use `blob:` URLs). A stricter
  `script-src`/`style-src`/`connect-src`/`img-src` policy is worth adding, but needs testing
  against the viewers, the API origin, and image hosts (`MEDIA_URL`) so nothing breaks.
- **Admin API CORS** is now one origin via `FRONTEND_URL`; if admins and merchants ever move to
  different domains, switch to an allow-list.
- **Dependency scanning** in CI (`npm audit`, `composer audit`) and Dependabot.
- **Security logging/alerting** on auth failures and rate-limit hits.
- **2FA** for Super Admin accounts.
- Consider **signed, short-TTL URLs** for streamed documents if you later serve them from a CDN.

## 5. Pre-existing issues (not introduced here, not fixed here)

- `OrderWorkflowTest::test_order_creation_rejects_inactive_or_draft_products` fails on an assertion
  key mismatch (functionality is correct; the test asserts the wrong error key).
- `sofiacart-frontend`'s `npm run test:unit` can't run on Node 20 (`.ts` loader); lint, typecheck
  and build are fine.
