# SofiaCart Website

SofiaCart Website is a production-ready Next.js storefront foundation for the SofiaCart e-commerce platform.

## Stack

- Next.js App Router
- TypeScript (strict mode)
- Tailwind CSS v4 with SofiaCart brand tokens
- shadcn-compatible UI primitives built with Radix UI
- React Hook Form + Zod
- Zustand
- TanStack Query
- Axios

## Getting Started

1. Copy `.env.example` to `.env.local`
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

## Environment Variables

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_APP_NAME` | Storefront display name |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL of `sofiacart-website-backend` (default `http://localhost:8001/api`, the backend's Docker stack) |
| `NEXT_PUBLIC_ENABLE_API_MOCKS` | Unused; no mock API responses are shipped |

The backend only accepts browser requests from its `FRONTEND_URL` (CORS), `http://localhost:3000` by default. Run the website on that origin, or change `FRONTEND_URL` in the backend's `.env`.

## Project Structure

- `app/` - routes: storefront (`/`, `/products`, `/products/[slug]`, `/categories`, `/vouchers`), auth (`/login`, `/register`, `/forgot-password`, `/reset-password`), checkout (`/cart`, `/checkout`, `/place-order`, `/order/complete`) and the customer account (`/account/*`)
- `components/layout/` - header (search, category bar, account menu), footer
- `components/storefront/`, `components/checkout/`, `components/orders/`, `components/account/`, `components/auth/` - feature components
- `components/ui/` - reusable UI primitives
- `components/providers/` - application providers (Query, theme, auth sync, toasts)
- `lib/api/` - axios client, endpoint map, query keys and one service module per backend area (`services/`)
- `hooks/` - TanStack Query hooks used by the pages
- `stores/` - Zustand stores: auth token, guest cart, checkout choices, toasts
- `types/` - API envelope and domain types matching the backend resources

## Backend Integration

`sofiacart-website` talks only to `sofiacart-website-backend`. Every screen, the endpoint it uses and what the backend does not support yet are listed in [`SOFIACART_WEBSITE_UI_API_STATUS.md`](SOFIACART_WEBSITE_UI_API_STATUS.md).

- Customer tokens come from `POST /auth/login` / `POST /auth/register` and are sent as `Authorization: Bearer …`. A 401 ends the session and protected pages redirect to `/login`.
- Prices, stock, discounts, shipping fees and totals are always taken from the backend (`POST /checkout/summary`, order resources); the website never computes a total.
- Signed-out shoppers keep a guest cart in the browser; it is merged into their server cart (`POST /cart/merge`) when they sign in.
