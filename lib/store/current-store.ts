import { headers } from "next/headers";
import { cache } from "react";

import { env } from "@/lib/config/env";
import { storeSlugFromHost } from "@/lib/store/host";
import type { StoreProfile } from "@/types/domain";

export type CurrentStore =
  /** The platform-wide marketplace (no store subdomain). */
  | { status: "marketplace"; slug: null; store: null }
  /** A live store's subdomain. */
  | { status: "found"; slug: string; store: StoreProfile }
  /** A subdomain with no live (verified) store behind it. */
  | { status: "not-found"; slug: string; store: null }
  /** The store could not be loaded right now (API unreachable); pages still render unbranded. */
  | { status: "unavailable"; slug: string; store: null };

/** Server-to-API base URL. API_INTERNAL_BASE_URL lets the Next server use a private network address. */
const apiBaseUrl = () => (process.env.API_INTERNAL_BASE_URL || env.NEXT_PUBLIC_API_BASE_URL).replace(/\/+$/, "");

/**
 * The store this request's subdomain belongs to, loaded once per request (React cache) for the
 * layout, metadata, header, footer and home page. Always fetched fresh so a suspended store
 * disappears immediately.
 */
export const getCurrentStore = cache(async (): Promise<CurrentStore> => {
  const slug = storeSlugFromHost((await headers()).get("host"));
  if (!slug) return { status: "marketplace", slug: null, store: null };

  try {
    const response = await fetch(`${apiBaseUrl()}/stores/${encodeURIComponent(slug)}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    if (response.status === 404) return { status: "not-found", slug, store: null };
    if (!response.ok) return { status: "unavailable", slug, store: null };

    const body = (await response.json()) as { data?: { store?: StoreProfile } };
    return body.data?.store ? { status: "found", slug, store: body.data.store } : { status: "unavailable", slug, store: null };
  } catch {
    return { status: "unavailable", slug, store: null };
  }
});
