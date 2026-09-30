# SofiaCart Website API Integration Status

## Scope and verification boundary

This change connects the existing storefront to the public catalog contract described in the issue. The issue identifies backend `main` at `c25404bbccd7d2acaa6feb265c1d11599485988f` as implementing only the four public catalog routes listed below. I could not independently inspect the backend repository: GitHub API and raw-file requests for `ryanrey08/sofiacart-website-backend` returned 404. Therefore the frontend contract is based on that supplied, verified snapshot; the latest backend source and live response behavior remain unverified.

The frontend source branch is `sofia-cart-website` at `1c04fba8a4be262e1528a00c508c7ee336769117`. The task PR (#2) is currently based on README-only `main` (`389e5e83e1e302c78ce6a398346c3528c9f2737e`). The source-bearing branch was merged into the task branch to preserve the existing application. The available GitHub tools did not provide a way to retarget PR #2, and the browser tool was unavailable. For a focused review, PR #2 must target `sofia-cart-website`; against `main`, its diff also contains the pre-existing frontend foundation.

## Catalog endpoints

The frontend uses the `/api` route convention in `.env.example` (`NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api`). Endpoint paths are relative to that base URL.

| Endpoint | Frontend use |
| --- | --- |
| `GET /api/categories` | Fetches live categories and category filters. |
| `GET /api/products` | Fetches paginated products with category, sort, page, and page-size filters. |
| `GET /api/products/search` | Searches products with the supported search and catalog filters. |
| `GET /api/products/{slug}` | Reported by the supplied backend snapshot, but not called: the current frontend has no product-detail route or detail UI. |

The client expects Laravel resource collections (`data`, `links`, and `meta`) and uses the backend’s snake-case pagination metadata. Product and category types include only the documented resource fields. Search, category selection, sorting (`newest`, `price_asc`, `price_desc`, `name`), and pagination use the existing homepage catalog area. The page size is 12 (within the reported backend maximum of 50). Loading, API error/retry, and empty states are shown.

Product images use `imageUrl` when present, and stock display uses `inStock`. Product prices are shown as numeric amounts without a currency symbol because the catalog API does not define a currency. The old mock featured/popular catalog is no longer used on the homepage.

## Unsupported customer functionality

The supplied backend status says the following are not implemented; no calls or contracts for them were added:

- Customer authentication (register, login, logout, profile, password recovery), protected pages, and account management/settings
- Server-persisted carts and wishlist
- Checkout, saved addresses, shipping, vouchers/promotions, and order creation/history
- Payments, reviews, and notifications

The existing registration page remains a UI preview, but its submit action is disabled and the form is not sent or saved. Cart and checkout values remain local sample data and are explicitly labeled as previews; the order action is disabled. The order-complete route now states that no order has been placed. These screens must not be treated as working customer flows.

## Frontend files changed

- `app/page.tsx`
- `app/cart/page.tsx`
- `app/checkout/page.tsx`
- `app/order/complete/page.tsx`
- `components/storefront/catalog-sections.tsx` (new)
- `components/storefront/cart-page-client.tsx`
- `components/storefront/register-form.tsx`
- `lib/api/catalog.ts` (new)
- `lib/api/endpoints.ts`
- `types/api.ts`
- `SOFIACART_WEBSITE_API_INTEGRATION_STATUS.md` (new)

`.env.example` already uses the backend `/api` base convention and did not need modification.

## Verification results

- `npm ci` — passed; 417 packages installed and the audit reported zero vulnerabilities. npm reported an unapproved `unrs-resolver` install script warning.
- `npm run lint` — passed after removing one unused import.
- `npx tsc --noEmit` — passed.
- `npm run build` — passed with Next.js 16.3.6; the existing App Router routes compiled and prerendered.
- Production route smoke check — `GET /`, `/register`, `/cart`, `/checkout`, and `/order/complete` each returned HTTP 200.
- `git diff --check` — passed.
- Tests — no test script or existing test/spec files are present in the frontend.
- Backend request verification — not run: backend GitHub and raw-file requests returned 404, so no live API host or accessible backend source was available.

## Remaining work and blockers

1. Restore access to the backend repository and verify its latest branch, routes, resources, and real catalog responses against this adapter.
2. Retarget PR #2 to `sofia-cart-website` so the review diff excludes the pre-existing frontend foundation.
3. Configure a reachable API URL and verify CORS, category/product payloads, pagination, search, images, and error behavior against the running backend.
4. Obtain a backend-defined currency before presenting product amounts as currency values.
5. Implement customer flows only after the corresponding backend APIs and contracts exist.
