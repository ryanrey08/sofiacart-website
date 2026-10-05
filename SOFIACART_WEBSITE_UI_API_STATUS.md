# SofiaCart Website — UI & API Integration Status

```
sofiacart-website  →  sofiacart-website-backend  →  existing SofiaCart database
```

Status date: 2026-10-02. Branch: `main` at `6423a11` ("merge updated UI") plus the uncommitted changes described here.

- `sofiacart-website` calls **only** `sofiacart-website-backend` (`NEXT_PUBLIC_API_BASE_URL`, default `http://localhost:8001/api`).
- `sofiacart-backend` was not called or modified. `sofiacart-website-backend` was read, not modified.
- No mock API data remains. `lib/mocks/storefront.ts` was deleted. Every price, total, stock level, discount, shipping fee and payment, refund or order status on screen comes from the backend.

---

## 1. Sources inspected

**Canva** (`Sofia Cart Mock Up Design`, whiteboard). Customer frames:

- Customers – Landing Page
- Customers – Registration Page
- Customers – Add to Cart (the cart page)
- Customers – Check Out
- Customers – Place Order
- Customers – Order Complete
- Customers – My Orders (account sidebar, order list and order detail panel)
- Customer/Buyer Process Flow, which also shows thumbnails of:
  - Login
  - Browse & Search
  - Product details with "Add to Cart" and "Buy Now"
  - Track Order
  - Post-purchase actions: review, return/refund, contact support, wishlist

The merchant and super-admin frames are out of scope.

Canva has no dedicated frames for the product listing, the account pages other than My Orders, addresses, settings, notifications, vouchers, or password reset. These were built in the same visual language: tokens, cards, pills, the orange→pink call-to-action gradient and the stepper.

**`sofiacart-website-backend`.** Read in full:

- `routes/api.php`: 69 routes, served under both `/api` and `/api/v1`.
- Every controller, Form Request (validation), API Resource (response shape), enum and service that raises validation errors.

The TypeScript types in `types/domain.ts` mirror those resources field for field.

**`sofiacart-website`.** Read in full:

- The API client.
- All stores.
- All types.
- Every page, including PR #2's `lib/api/catalog.ts` and `catalog-sections.tsx`. Those two were orphaned on `main` and are now superseded.

---

## 2. Screen-by-screen status

**Legend**

- ✅ **Verified**: implemented and exercised in a browser against the running backend (see §4).
- 🟡 **Implemented, not verified end to end**: wired to the real endpoint, but the success path needs data the dev database doesn't have. The reason is given.
- ⚠️ **Adapted**: the Canva element is replaced by what the backend actually supports.
- ❌ **Not supported by the backend**: not built, and not faked.

### Header, navigation, homepage, catalog

| Canva screen / feature | Frontend page / component | Backend endpoint | Integration | UI | Missing backend API / blockers | Remaining work |
| --- | --- | --- | --- | --- | --- | --- |
| Header: logo, search, Wishlist, Cart badge, "Hi, Juan" menu | `components/layout/header.tsx`, `header-search.tsx`, `cart-indicator.tsx`, `account-menu.tsx` | `GET /cart` (`itemCount`), `GET /account/notifications/unread-count`, `GET /auth/me` | ✅ | ✅ Canva layout | — | — |
| Header category row ("All Categories", category links, **Deals**) | `components/layout/category-bar.tsx` | `GET /categories` | ✅ | ⚠️ "Deals" links to the public vouchers page | No "deals" or featured flag in the schema. Categories are **per store**, so the same name appears up to 6 times. The UI shows each name once and links to the first category id. | Needs platform-level categories, or a category filter by slug or name across stores |
| Landing: category sidebar, hero, trust bar, Featured Categories | `app/page.tsx`, `components/storefront/home-sections.tsx` | `GET /categories` | ✅ | ✅ | No category images in the data (`imageUrl` is null), so icons are matched by name. Promo banners have no backend content; they link to real searches. "Up to 50% off" copy was removed. | CMS or banner API if promotions should be managed |
| Landing: Popular Products | `PopularProducts` | `GET /products/popular?limit=` (falls back to `GET /products?sort=newest` when nothing has sold) | ✅ | ✅ | "Best Seller" badges need a flag the API doesn't have | — |
| Product listing, search, category filter, price filter, in-stock filter, sort, pagination | `app/products/page.tsx`, `components/storefront/product-listing.tsx` | `GET /products` with `search`, `category_id`, `min_price`, `max_price`, `in_stock`, `sort` (`newest`, `price_asc`, `price_desc`, `name`), `page`, `per_page`. Laravel pagination meta. | ✅ (pagination rendered; next-page click not exercised) | Built in Canva style | No brand or rating filter or sort in the API | — |
| Categories page | `app/categories/page.tsx` | `GET /categories` (includes `parentId`) | ✅ | ✅ | Per-store categories (see above) | — |
| Product details (flow step 4): gallery, price, rating, options, quantity, Add to Cart, Buy Now, wishlist, store, shipping options | `app/products/[slug]/page.tsx`, `components/storefront/product-detail.tsx` | `GET /products/{slug}` (`images`, `variants`, stock), `GET /checkout/shipping-methods` | ✅ add to cart, wishlist, quantity. 🟡 Buy Now and variant selection not exercised (seed products have no variants). | ✅ | `compareAtPrice` is always null (the backend charges `price`; sale price is not applied), so no strike-through price | Server-side page titles (`generateMetadata`) for SEO |
| Product images | `components/storefront/product-image.tsx` | `imageUrl` / `images[]` from `MEDIA_URL` | ⚠️ | Placeholder icon on load failure | **Blocker:** `http://localhost:8000/storage/products/*.png` (sofiacart-backend public storage) returns **403**, so every image shows the placeholder | Fix storage access in sofiacart-backend's deployment (`storage:link` or web server rules) |
| Product reviews: summary, distribution, list, write | `components/storefront/product-reviews.tsx`, `review-form.tsx` | `GET /products/{slug}/reviews`, `POST /products/{slug}/reviews` | ✅ list and empty state. ✅ backend rejection shown ("You can review products from your completed orders."). 🟡 successful submit: needs an order completed by the merchant. | ✅ | No moderation (reviews publish immediately) | Verify after completing an order in sofiacart-backend |

### Authentication

| Canva screen / feature | Frontend page / component | Backend endpoint | Integration | UI | Missing backend API / blockers | Remaining work |
| --- | --- | --- | --- | --- | --- | --- |
| Registration page | `app/register/page.tsx`, `components/storefront/register-form.tsx` (the existing Canva form) | `POST /auth/register` (`firstName`, `lastName`, `email`, `phone`, `password`, `passwordConfirmation`, `shippingAddress`) → `{ user, tokens }` | ✅ client validation, ✅ success. The default address is created and the user lands on `/account`. Server 422 errors map onto fields. | ✅ | `acceptTerms` is validated client-side only (no column). **Social sign-up (Google, Facebook, Apple): no OAuth API, so the buttons were removed.** Terms and Privacy pages don't exist (content, not API). | OAuth endpoints, legal pages |
| Login (flow step 2) | `app/login/page.tsx`, `components/auth/login-form.tsx` | `POST /auth/login` (`remember` → 30-day token) | ✅ wrong password (422 shown), ✅ success with Remember me, ✅ `?redirect=` honored, ✅ guest-cart merge | Built in Canva style | Social login not supported (see above) | — |
| Forgot / reset password | `app/forgot-password`, `app/reset-password` (`?token=&email=` from the backend email) | `POST /auth/forgot-password`, `POST /auth/reset-password` | 🟡 implemented, not exercised (emails go to Mailpit) | ✅ | — | Click through with Mailpit |
| Current customer, token expiry, logout | `hooks/use-auth.ts` (`useAuthSync`), `lib/api/client.ts`, `components/auth/require-auth.tsx` | `GET /auth/me`, `POST /auth/logout`, `POST /auth/logout-all` | ✅ 401 → session cleared → `/login?redirect=…` with an "expired" notice. ✅ logout. A 403 "deactivated" response is handled in code but not exercised. | ✅ | — | — |

### Cart and checkout

| Canva screen / feature | Frontend page / component | Backend endpoint | Integration | UI | Missing backend API / blockers | Remaining work |
| --- | --- | --- | --- | --- | --- | --- |
| Add to Cart page (cart) | `app/cart/page.tsx`, `components/storefront/cart-page-client.tsx` | `GET /cart`, `PATCH /cart/items/{id}`, `DELETE /cart/items/{id}`, `DELETE /cart`, `POST /checkout/summary` (totals for the selected items), `POST /vouchers/validate` | ✅ list, quantity update, remove, totals from the backend, invalid voucher error. 🟡 Clear Cart not clicked. | ✅ Canva layout | "Brand / Storage / Color" row details → store name and variant label. "7-day returns" and "Free shipping ₱1,000+" claims removed; free shipping is shown only when the backend returns a threshold. | — |
| Guest cart | `stores/cart-store.ts`, `GuestCart` | `POST /cart/merge` on sign-in | ✅ added as guest → signed in → merged and re-priced, local cart cleared | ✅ | The cart API needs authentication, so guests see no total (by design: no client-computed totals) | — |
| Check Out: shipping information, delivery method, payment method, summary, promo | `app/checkout/page.tsx`, `components/checkout/checkout-page-client.tsx`, `checkout-summary-card.tsx` | `GET /account/addresses`, `POST /account/addresses`, `GET /checkout/shipping-methods`, `GET /checkout/payment-methods`, `POST /checkout/summary` | ✅ saved addresses with default, shipping and payment methods from the API, per-store shipping (₱100 × 2 stores), missing-payment validation | ✅ | Canva's free-text "Email" field → the account email is shown (orders belong to the account) | — |
| Place Order (review) | `app/place-order/page.tsx`, `components/checkout/place-order-client.tsx` | `POST /checkout/summary`, `POST /checkout/orders` with an `Idempotency-Key` header | ✅ 201. The backend split it into 2 orders, one per store. A retried submit reuses the same key. | ✅ | **Billing Information ("same as shipping"): no billing field in the API, so it was removed.** **Saved card "**** 1234": no stored payment instruments and no gateway, so it was removed; no card data is ever collected.** | Billing address and payment gateway APIs |
| Order Complete | `app/order/complete/page.tsx`, `components/checkout/order-complete-client.tsx` | Response of `POST /checkout/orders`, plus live `GET /account/orders/{orderNumber}` | ✅ | ✅ | **"A confirmation email has been sent": the backend sends no order emails (only in-app notifications), so the copy now points to Notifications.** The page only renders right after checkout; there is no `GET checkout/{reference}` endpoint. | Order email; a checkout lookup endpoint if the page must survive a new tab |
| Payment step (stepper) / pay later | `components/orders/payment-panel.tsx` | `POST /account/payments/{ref}/reference`, `POST /account/orders/{n}/payments` (retry) | ✅ GCash reference submitted. 🟡 retry: needs an expired or failed payment. | ✅ | No payment gateway: payments stay `pending` until the merchant confirms them in sofiacart-backend | Gateway integration and callbacks |
| Vouchers / promotions | `app/vouchers`, `app/account/vouchers`, `components/account/voucher-list.tsx`, `voucher-input.tsx` | `GET /vouchers`, `POST /vouchers/validate`, `voucherCode` in summary and order | ✅ empty state, ✅ invalid code. 🟡 successful apply: **the database has no vouchers**. | ✅ | No voucher administration API (merchant side) | Insert a voucher and verify the discount path |

### Orders, returns, account

| Canva screen / feature | Frontend page / component | Backend endpoint | Integration | UI | Missing backend API / blockers | Remaining work |
| --- | --- | --- | --- | --- | --- | --- |
| My Orders: sidebar, status tabs, order cards, detail panel | `app/account/orders/page.tsx`, `components/orders/my-orders.tsx`, `order-detail.tsx` | `GET /account/orders?status=&page=&per_page=`, `GET /account/orders/{n}` | ✅ list, tabs, detail panel (≥1280 px), mobile cards | ✅ Canva layout | **Tabs "Pending Payment", "Shipped", "Delivered": the schema has no shipment statuses and the API has no payment-status filter.** The tabs show real statuses instead: All, Pending, Processing, Out for Delivery, Completed, Cancelled. **"Search by order number or product" and the date filter: no API parameters, so they were not built.** | Shipment status, `payment_status`, search and date filters in the API |
| Order details, order status, "Track Order" | `app/account/orders/[orderNumber]/page.tsx` | `GET /account/orders/{n}` (refresh button refetches) | ✅ | ✅ | **Tracking: no shipment or courier API.** The tracker shows the order statuses Placed → Processing → Out for Delivery → Completed (or Cancelled). | Shipment API |
| Cancellation | `components/orders/cancel-order-dialog.tsx` | `POST /account/orders/{n}/cancel` (`canCancel`) | ✅ order and payment cancelled, notification created | ✅ | — | — |
| "Contact Seller" | — | — | ❌ | Not shown | No messaging or support API | Messaging API |
| Return / refund request | `app/account/orders/[orderNumber]/return/page.tsx`, `components/orders/return-request-form.tsx` | `GET /account/orders/{n}/returnable`, `POST /account/orders/{n}/returns` | ✅ ineligible state. 🟡 submit: needs a completed, paid order (set by the merchant). | ✅ | No evidence or photo upload (needs shared storage) | Verify after completing an order |
| Returns & refunds list | `app/account/returns/page.tsx`, `components/orders/returns-refunds.tsx` | `GET /account/returns`, `GET /account/refunds` | ✅ empty states. 🟡 with data. | ✅ | — | — |
| Payments (Canva sidebar: "Payment Methods") | `app/account/payments/page.tsx` | `GET /account/payments` | ✅ | ⚠️ payment history instead of saved methods | **No saved payment methods API** | — |
| Dashboard | `app/account/page.tsx` | orders, wishlist, unread count, addresses, profile | ✅ | ✅ | — | — |
| Address management | `app/account/addresses/page.tsx`, `components/account/address-book.tsx`, `address-form.tsx` | `GET/POST /account/addresses`, `PATCH /account/addresses/{id}`, `POST …/{id}/default`, `DELETE …/{id}` | ✅ add (dialog), set default, delete (backend promotes the next default). 🟡 edit not clicked. | ✅ | — | — |
| Wishlist | `app/account/wishlist`, `components/account/wishlist-page.tsx`, `wishlist-button.tsx` (`/wishlist` redirects) | `GET /wishlist`, `POST /wishlist`, `DELETE /wishlist/{productId}` | ✅ add from product, list. 🟡 remove from the list page not clicked. | ✅ | Guests must sign in (the API requires authentication) | — |
| My Reviews | `app/account/reviews/page.tsx`, `components/account/my-reviews.tsx` | `GET /account/reviews`, `PATCH/DELETE /account/reviews/{id}` | ✅ empty state. 🟡 edit and delete need an existing review. | ✅ | — | — |
| Notifications | `app/account/notifications/page.tsx` | `GET /account/notifications`, `POST …/{id}/read`, `POST …/read-all`, `DELETE …/{id}` | ✅ list, mark one read, mark all read, unread badges. 🟡 delete not clicked. | ✅ | **Status changes made by the merchant in sofiacart-backend create no notifications** (backend blocker) | Shared event or webhook |
| Account settings: profile, password, preferences, signed-in devices | `app/account/settings/page.tsx`, `components/account/account-settings.tsx` | `PATCH /account/profile`, `PUT /account/password`, `GET/PATCH /account/settings`, `GET/DELETE /account/sessions`, `POST /auth/email/verification-notification` | ✅ phone update persisted, ✅ wrong current password (422 on the field), ✅ "promotions" toggle persisted, ✅ sessions listed. 🟡 not exercised: email change, password change success, resend verification, revoking another device, sign out everywhere. | ✅ | The `promotions` setting is stored but nothing sends promotions. No account deletion API. | — |

### Cross-cutting states

| Feature | Status |
| --- | --- |
| Loading states | Skeletons on every data view; the first client render matches the server HTML (hydration-safe) |
| Empty states | Shared `EmptyState` component |
| API error states | `ErrorState` with retry; mutation errors in `InlineError` or toasts |
| Validation | zod on the client, plus Laravel 422 `errors` mapped onto form fields |
| Responsive | Verified: no horizontal overflow on 18 routes at 375 px. My Orders also checked at 1440 px and 375 px. |

---

## 3. Business rules applied

- **No client totals.** Totals come from:
  - `POST /checkout/summary`: cart, checkout and review pages.
  - The checkout response: order complete.
  - Order resources: account pages.
- **Guest cart.** It stores product, variant and quantity only. It shows catalog prices per line, never a total. Lines are re-priced by `POST /cart/merge`.
- **Duplicate orders.** `POST /checkout/orders` sends an `Idempotency-Key` that is reused until the order succeeds.
- **Payments.**
  - No card data is collected anywhere.
  - E-wallet and bank payments can add a reference number. Neither the form nor the API's regex (`[A-Za-z0-9\-_./ ]`) can tell a card number from a reference, so the UI only asks for the e-wallet or bank reference and never mentions cards there.
  - Payments are confirmed by the merchant.
- **Authorization.**
  - The token is sent as a bearer header.
  - A 401 clears the session and drops all `["me", …]` query caches. A 403 "deactivated" response clears it too.
  - Protected routes (`/account/*`, `/checkout`, `/place-order`, `/order/complete`) redirect to `/login?redirect=…`. Only same-site paths are followed after sign-in (`lib/utils/redirect.ts`).
  - Ownership is enforced by the backend: another customer's order returns 404, which the UI shows as "Order not found".
- **Refresh after mutations.**
  - Cart changes → checkout summary.
  - Order placed → cart, orders, notifications, catalog stock.
  - Cancellation → order, payments, returns, notifications, catalog stock.
  - Review → reviews and catalog rating.
  - Addresses, wishlist, settings and notifications → their own queries.

---

## 4. Verification actually executed (2026-10-02)

| Check | Command / method | Result |
| --- | --- | --- |
| ESLint | `npm run lint` | Pass (0 errors, 0 warnings) |
| TypeScript | `npm run typecheck` | Pass |
| Production build | `npm run build` (Next.js 16.3.6) | Pass. 26 routes; `/products/[slug]` and `/account/orders/[orderNumber]` are dynamic. |
| Whitespace | `git diff --check` | Pass |
| Frontend tests | — | **None exist.** The project has no test runner or test files. |
| Manual browser flows | The website's dev server on `:3001`, against `sofiacart-website-backend` on `:8001` (Docker, shared dev database) | Every ✅ in §2 |

**CORS during testing.** The backend only allows `FRONTEND_URL`. Port 3000 was occupied by another project, so `FRONTEND_URL` in the backend's local `.env` was temporarily set to `http://localhost:3001` for the browser session. It was then **restored** (byte-identical to a backup) and `config:clear` was re-run.

**Flow exercised, in order** (one generated test customer):

1. Register.
2. Dashboard.
3. Product listing: category, price range, in stock, ascending sort, search, descending sort.
4. Product detail → wishlist → quantity 2 → add to cart → add a second store's product from a card.
5. Cart: backend totals ₱2,725.51 → quantity update → ₱3,457.48 → invalid voucher error.
6. Checkout: default address, standard shipping ₱100 × 2 stores, missing-payment validation, GCash.
7. Review → place order: `CHK-20261002-QPRJXOQ0`, 2 orders.
8. Order complete → GCash reference submitted.
9. My Orders (panel at 1440 px) → order detail → cancel with a reason.
10. Ineligible return page, payments, notifications (read and read-all), addresses (add, default, delete), wishlist, vouchers, reviews (backend rejection).
11. Settings: profile, wrong password, preference toggle.
12. Expired token: corrupted token → `/login` with notice.
13. Guest cart → login (wrong password, then correct with Remember me) → merge → remove item.
14. Logout. 375 px overflow scan.

**Bugs found and fixed during verification:**

- Hydration mismatches (query cache vs. server HTML) on the home, listing, product, categories and vouchers pages.
- Cart total column overlapping the action icons.
- Order-complete payment section too narrow.
- My Orders mobile overflow (account grid without a `minmax(0,1fr)` column).
- Logout redirect racing the auth guard.
- The homepage requesting the "newest" fallback unconditionally.

**Test data left in the local dev database:**

- One customer account (`qa.web.…@example.test`) with one address and one wishlist item.
- Two **cancelled** orders. The backend restored their stock and cancelled their payments.
- Their notifications.

There is no account-deletion API to remove them.

---

## 5. Blockers and remaining work

1. **Product images return 403** from sofiacart-backend's public storage (`MEDIA_URL`). This is a deployment fix in sofiacart-backend.
2. **Shipment tracking** is missing:
   - No separate Shipped status. `out_for_delivery` was added on 2026-10-05 (section 7). "Delivered" is the existing `completed`.
   - No status history, so the tracker can't show a timestamp for each step.
   - No courier tracking.
   - No payment-status or search/date filters on `/account/orders`.
3. **No payment gateway, saved payment methods or billing address.** Payments are manual and verified by the merchant.
4. **No OAuth, order confirmation emails, contact-seller messaging, account deletion or return evidence uploads.**
5. **Merchant-side order changes don't notify customers.** This needs an integration with sofiacart-backend.
6. **Categories are per store.** A cross-store category filter (or platform categories) is needed for exact category pages.
7. **Flows still to verify once data exists:**
   - Voucher apply: insert a voucher.
   - Return request, refunds, and review create/edit/delete: complete and pay an order in sofiacart-backend.
   - Payment retry: needs an expired or failed payment.
   - Forgot/reset password and email verification: use Mailpit at `:8025`.
8. **Not built:** frontend automated tests (no runner configured), server-rendered page titles for product and order pages, Terms and Privacy pages.

---

## 6. Files changed

**API layer**

- `lib/api/client.ts`: 401/403 session handling, friendly network/429/5xx messages, `getData`, `errorMessage`.
- `lib/api/endpoints.ts`: every backend route.
- `lib/api/query-keys.ts` (new).
- `lib/api/services/*.ts` (new): `auth`, `catalog`, `cart`, `checkout`, `orders`, `account`.
- `types/api.ts`, `types/domain.ts`: rewritten to the backend resources.
- `lib/config/env.ts`, `.env.example`: API default changed to `:8001`.

**Hooks and state**

- `hooks/*` (new): `use-session`, `use-auth`, `use-catalog`, `use-cart`, `use-checkout`, `use-orders`, `use-account`.
- `stores/auth-store.ts`: expiry and session-end reason.
- `stores/cart-store.ts`: guest cart.
- `stores/checkout-store.ts`, `stores/toast-store.ts` (new).
- Removed: `stores/wishlist-store.ts` (the wishlist is server-side now).

**Pages**

- Updated: `app/page.tsx`, `app/cart`, `app/checkout`, `app/place-order`, `app/order/complete`, `app/register`, `app/layout.tsx`, `app/globals.css` (brand tokens and `bg-cta`).
- New: `app/products`, `app/products/[slug]`, `app/categories`, `app/vouchers`, `app/wishlist`, `app/login`, `app/forgot-password`, `app/reset-password`, and `app/account/*` (layout, dashboard, orders, order detail, return, returns, addresses, payments, reviews, wishlist, vouchers, notifications, settings).

**Components**

- `components/layout/*`:
  - Header rewritten with the category bar, account menu and search.
  - Footer updated.
  - Removed: `navigation.tsx`, `page-placeholder.tsx`.
- `components/storefront/*`:
  - Cart and register wired to the API.
  - New: product card, listing, detail, reviews, states, stepper, badges and more.
- New folders: `components/auth/*`, `components/checkout/*`, `components/orders/*`, `components/account/*`.
- New primitives: `components/ui/toaster.tsx`, `components/ui/popover-menu.tsx`.

**Removed (superseded)**

- `lib/api/catalog.ts`, `components/storefront/catalog-sections.tsx` (PR #2).
- `lib/mocks/storefront.ts`.

**Docs**

- `README.md`: updated.
- `SOFIACART_WEBSITE_API_INTEGRATION_STATUS.md`: marked superseded.
- This file.

---

## 7. Order status: Out for Delivery (2026-10-05)

- **Status:** `out_for_delivery`, shown as "Out for Delivery". It is the value of the shared `orders.status` column, owned by `sofiacart-backend`, which also enforces the lifecycle: `pending → processing → out_for_delivery → completed`. `pending` and `processing` can also go to `cancelled`. `out_for_delivery` can only go to `completed`, and `completed` still needs a paid order.
- **Frontend changes:**
  - `types/domain.ts`: `OrderStatus` includes `out_for_delivery`.
  - `components/storefront/status-badge.tsx`: label "Out for Delivery". It uses the existing `purple` (brand) tone so it looks different from Processing (blue) and Completed (green).
  - `components/orders/order-tracker.tsx`: new step with a truck icon between Processing and Completed, matching the Canva tracker. Steps are narrower (`w-14 sm:w-16`) so four steps fit in the 380 px detail panel and at 375 px wide.
  - `components/orders/my-orders.tsx`: new "Out for Delivery" filter tab. The empty-state title uses the status label instead of the raw value.
- **Canva vs. backend mismatches (backend rules kept):**
  - Canva shows "Order Confirmed / Processing Your Order / Out for Delivery / Delivered" with a timestamp under every step.
  - The existing labels "Order Placed / Processing / Completed" are kept, because the status is `completed`.
  - There is no status history in either backend, so only "Order Placed" shows a time. No times are made up.
  - The Canva tabs "Pending Payment", "Shipped" and "Delivered" have no matching status.
  - Orders completed before this change also show the Out for Delivery step as done, because the tracker shows progress by position.
- **Verified:**
  - `npm run typecheck`, `npm run lint` and `npm run build` pass on the final code.
  - In the browser against the local stack, with an order moved through the merchant API: list badge, filter tab, detail panel, order details page, and the tracker at 1440 px and 375 px (no horizontal scroll). Existing Completed orders still render correctly.
