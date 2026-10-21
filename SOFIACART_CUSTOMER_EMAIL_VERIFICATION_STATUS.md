# SofiaCart Customer Email Verification — Status

Scope: `sofiacart-website` (storefront) and `sofiacart-website-backend` (customer API).
Nothing in `sofiacart-frontend` or `sofiacart-backend` was changed, and there are no database
migrations. The existing `customer_accounts.email_verified_at` column holds the verification state.
This file is kept identical in both repositories.

## Flow

1. The customer submits the existing registration form (`/register`).
2. `POST /auth/register` validates the input, creates the account with `email_verified_at = NULL`,
   signs the customer in (same token flow as before), and sends the verification email to the
   address the customer entered (lower-cased and trimmed).
3. The storefront goes to `/verify-email/pending?sent=1`. This page shows the address the link was
   sent to, a **Resend Verification Email** button (loading, success, error and 60 s cooldown
   states), and an **I've verified my email** button that re-checks `GET /auth/me`.
4. The email links to `FRONTEND_URL/verify-email?id=&hash=&expires=&signature=`.
5. `/verify-email` posts those parameters to `POST /auth/email/verify`. The backend checks the
   signature, the account binding and the expiry, then marks the email verified.
6. The page shows one of these states: **verified**, **already verified** (a link that was already
   used), **expired** (with **Send a New Link**), **invalid** (with a resend option: the account
   resend when signed in, or an email form when signed out), or a retryable error.
7. Verified customers continue with the existing flow: **Continue Shopping** / **Go to Cart** when
   signed in, **Sign In** otherwise.

Unverified customers can still sign in. After an unverified sign-in, `/login` sends them to
`/verify-email/pending`, which explains why and offers a resend. While signed in and unverified,
a banner under the header says "Verify your email address to place orders", and `/checkout` and
`/place-order` show a "Verify your email to place your order" card instead of the form. If the
backend refuses an action with `email_unverified`, the error message links to
`/verify-email/pending`, and the profile is refetched so these prompts appear.

## Backend design

- The links are Laravel signed routes (`URL::temporarySignedRoute`, an HMAC-SHA256 keyed by
  `APP_KEY`, with `APP_KEY` rotation via `APP_PREVIOUS_KEYS` respected). They are signed for the
  named route `verification.verify` with a relative path, so they don't depend on the API's host.
- **Bound to the customer:** the signed parameters include the account id and `sha1(email)`.
  A link for one account cannot verify another, and changing a link parameter breaks the signature.
- **Expiry:** `EMAIL_VERIFICATION_EXPIRE_MINUTES` (default 60) is part of the signature.
- **No reuse:** the email is marked verified with a conditional update (`email_verified_at IS NULL`
  and the email unchanged). Using a link again returns `already_verified` and changes nothing.
- **Email changes:** `CustomerAccount` clears `email_verified_at` whenever `email` changes,
  whatever code path changes it. `PATCH /account/profile` (which needs the current password) sends
  a new link to the new address. Links sent to the old address stop working because the hash no
  longer matches.
- **Opening a link doesn't verify:** the `GET` signed route only redirects to the storefront page.
  Verification needs the `POST`, so mail scanners that prefetch links don't verify anything.
- **Email:** `App\Notifications\VerifyCustomerEmail` (extends Laravel's `VerifyEmail`) sends
  `resources/views/mail/customer/verify-email(.blade.php|-text.blade.php)` to the account's own
  address. No recipient is hardcoded.
- Links use https when `APP_ENV=production`, even if `FRONTEND_URL` was set with `http://`.
- Responses never include passwords, hashes or tokens. The app never logs tokens itself, but see
  the `MAIL_MAILER=log` note below.

## API endpoints

All endpoints are available under `/api` and `/api/v1`.

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/auth/register` | public | Reused. Now also returns `verificationEmailSent`. Duplicate emails, including simultaneous submissions, return 422 `email`. |
| POST | `/auth/login` | public | Reused. Unverified accounts sign in with `user.emailVerified: false`. |
| GET | `/auth/me` | bearer | Reused. `user.emailVerified` / `emailVerifiedAt` is the status the storefront trusts. |
| POST | `/auth/email/verify` | public | **New.** Body `{id, hash, expires, signature}`. 200 `{data:{status:"verified"\|"already_verified"}}`, 410 `code: verification_link_expired`, 403 `code: verification_link_invalid`, 422 for malformed input. |
| GET | `/auth/email/verify/{id}/{hash}` | public | Changed. The signed route name. It now only redirects to the storefront page and no longer verifies. |
| POST | `/auth/email/verification-notification` | bearer | Reused. Resends to the signed-in customer. 202 `status: sent`, 200 `status: already_verified`, 503 if mail delivery fails. |
| POST | `/auth/email/resend` | public | **New.** Body `{email}` or the parameters of an expired link. Always 202 with the same message, so it doesn't reveal whether an account exists. |

Features that need a verified email (middleware `customer.verified`, which returns 403
`{code: "email_unverified"}`):
`POST /checkout/orders`, `POST /account/orders/{n}/payments`,
`POST /account/orders/{n}/payments/hitpay`, `POST /account/payments/{ref}/reference`,
`POST /account/orders/{n}/returns`, `POST /products/{slug}/reviews`.

These stay open to unverified customers: the catalog, cart, wishlist, checkout totals
(`POST /checkout/summary`, which the cart page uses), the address book, profile and settings,
viewing orders and payments, cancelling orders, and notifications.

## Rate limits

| Limiter | Applies to | Limits |
| --- | --- | --- |
| `customer-verification-resend` | both resend endpoints | 1/min and 6/hour per account (or per submitted email / link id when signed out), plus 10/min per IP |
| `customer-verification-verify` | `POST /auth/email/verify`, the `GET` route | 10/min per IP |
| `customer-auth` (existing) | register / login / password reset | unchanged |

A 429 response includes `Retry-After`. CORS now exposes this header, and the storefront uses it
for the button cooldown. The signed-out limits apply whether or not the address has an account.

## Environment

Backend (`sofiacart-website-backend/.env`):

| Variable | Notes |
| --- | --- |
| `FRONTEND_URL` | The storefront origin. Links go to `FRONTEND_URL/verify-email`, and CORS allows this origin. Use https in production. |
| `EMAIL_VERIFICATION_EXPIRE_MINUTES` | Link lifetime, default 60. |
| `MAIL_MAILER` | `smtp`. The `.env.example` defaults point it at the Docker Mailpit. `log` writes whole emails, including links, to the log, so use it in development only. Never use `log` or `array` in production. |
| `MAIL_SCHEME`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD` | SMTP settings of the sending mailbox (see **Mail provider: GoDaddy Professional Email** below). These are secrets: keep them server-side only. |
| `MAIL_FROM_ADDRESS`, `MAIL_FROM_NAME` | The sender: `admin@sofiacart.ph` / `SofiaCart`. |
| `APP_KEY` | Signs the links. Rotating it invalidates outstanding links; set `APP_PREVIOUS_KEYS` for a smooth rotation. |

### Mail provider: GoDaddy Professional Email

Customer emails are sent from `admin@sofiacart.ph`, a GoDaddy Professional Email mailbox. Its
webmail runs on Titan (https://secureserver.titan.email/mail), but the mailbox is hosted by GoDaddy:
`sofiacart.ph`'s MX records point to `secureserver.net` and its SPF record is
`v=spf1 include:secureserver.net -all`. Send through GoDaddy's SMTP server, not
`smtp.titan.email` (which rejects this mailbox's login with `535 authentication failed`, and
isn't allowed by the domain's SPF record):

```
MAIL_MAILER=smtp
MAIL_SCHEME=smtps
MAIL_HOST=smtpout.secureserver.net
MAIL_PORT=465
MAIL_USERNAME=admin@sofiacart.ph
MAIL_PASSWORD=<the mailbox password>
MAIL_FROM_ADDRESS=admin@sofiacart.ph
MAIL_FROM_NAME=SofiaCart
```

Keep `MAIL_FROM_ADDRESS` equal to `MAIL_USERNAME`. The domain publishes a DMARC policy
(`p=quarantine`), so mail from any other server is likely to land in spam.

Storefront: no new variables. It reaches the API through the existing `NEXT_PUBLIC_API_BASE_URL`,
and no backend secret is exposed to the frontend.

Development: `docker-compose.yml` no longer forces Mailpit; the API container reads `MAIL_*` from
`.env`. With the `.env.example` defaults, emails go to Mailpit (http://localhost:8025) and never
reach real inboxes. To receive real emails locally, put the GoDaddy settings below in `.env`, then
run `docker compose up -d api` once so the container picks up the change. After that, edits to
`.env` apply on the next request. Every local test then sends a real email from
`admin@sofiacart.ph`. The storefront must run on the `FRONTEND_URL` origin (currently
`http://localhost:3001` in the local `.env`).

Production: set up a real mail provider. Make sure `APP_ENV=production` and `FRONTEND_URL` is
https. Keep separate `.env` files and mail credentials for development and production.

## Tests executed (2026-10-21)

- Backend `php artisan test`: **59 passed (728 assertions)**. The 50 earlier tests still pass,
  including login, checkout, orders, payments and HitPay.
  New `tests/Feature/EmailVerificationApiTest.php` covers:
  - registration sends the branded email to the registered address (array mailer, To header
    asserted), and its link verifies the account
  - a used link reports `already_verified` without changes
  - tampered signature / id / hash / expires are rejected; missing params give 422
  - expired links return 410, and a new link can be requested from the expired one
  - the GET route only redirects
  - changing the email unverifies the account and invalidates old links
  - signed-in resend is rate-limited (429 + Retry-After)
  - signed-out resend answers identically for unknown, unverified and verified addresses
  - duplicate registration (case-insensitive) is rejected
  - unverified customers can browse, use the cart, wishlist and summary, but get 403 on every
    gated endpoint; after verifying, they can place an order
- `vendor/bin/pint --dirty`: passed.
- Storefront `npm run typecheck`, `npm run lint` and `npm run build`: all passed. The build
  includes the new `/verify-email` and `/verify-email/pending` routes.
- Live check against the local Docker stack (MySQL + Mailpit SMTP, storefront dev server on
  :3001):
  - registered through the UI and got the pending page with the address and cooldown
  - checkout was gated and the banner showed
  - the email arrived in Mailpit addressed to the registered address
  - a tampered link showed "This link isn't valid"
  - the real link verified the account; opening it again showed "Email already verified"
  - the banner and checkout gate disappeared
  - with curl: 403 `email_unverified` before verification, a 429 + `Retry-After` on a rapid
    resend, and the generic public resend reply

  The live check left two test accounts in the local database:
  `e2e-verify-1792558702@example.test` and `ui-verify-1792558900@example.test`.

Automated tests use Laravel's notification and array-mailer fakes. Mailpit shows that SMTP
delivery works locally. Neither shows that a production provider will deliver to real inboxes.

## Remaining configuration steps

1. On the production server, set the GoDaddy `MAIL_*` variables above, including the
   `admin@sofiacart.ph` mailbox password.
2. Set the production `FRONTEND_URL` (https), and `EMAIL_VERIFICATION_EXPIRE_MINUTES` if 60
   minutes is too short.
3. Optional: set `QUEUE_CONNECTION` to a real queue with a worker and make
   `VerifyCustomerEmail` queued. Emails are currently sent synchronously in the request, like
   password reset emails, so response timing could hint whether a signed-out resend matched an
   account.
4. Registration still answers "email has already been taken" for existing addresses. That was
   the behaviour before this change, and the form needs it.
5. There is no social login, so there is no external email-verified claim to trust.
