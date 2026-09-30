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
| `NEXT_PUBLIC_API_BASE_URL` | Base URL for the backend REST API |
| `NEXT_PUBLIC_ENABLE_API_MOCKS` | Optional frontend mock toggle for future use |

## Project Structure

- `app/` - route structure, layout shell, and error boundaries
- `components/layout/` - header, footer, navigation, and shared page placeholders
- `components/ui/` - reusable UI primitives
- `components/providers/` - application providers (Query + theme)
- `lib/api/` - axios client and endpoint definitions
- `lib/config/` - environment configuration
- `stores/` - Zustand stores for auth, cart, and wishlist
- `types/` - shared API and domain model types

## Backend Integration Notes

The backend repository branch referenced in the planning notes was not accessible from this sandbox during setup, so endpoint groups are scaffolded from the agreed Phase 3 integration targets and should be verified against the Laravel backend before wiring live requests:

- Authentication
- Product catalog
- Cart
- Wishlist
- Checkout
- Account management

Those planned integration points are centralized in `lib/api/endpoints.ts`.
