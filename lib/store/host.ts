/**
 * Store subdomains: `chemkleen.sofiacart.ph` is the storefront of the store whose slug is
 * `chemkleen`. Shared by the server (request Host header) and the browser (window.location), so
 * both always agree on which store a page belongs to. Dependency-free on purpose.
 */

/** The domain stores live under: "sofiacart.ph" in production, "localhost" for local development. */
export const STORE_ROOT_DOMAIN = (process.env.NEXT_PUBLIC_STORE_ROOT_DOMAIN || "localhost").trim().toLowerCase();

/** Subdomains used by the platform itself, never by a store. */
const RESERVED_SUBDOMAINS = new Set(["www", "api", "api-admin", "admin", "seller", "app", "mail", "static", "cdn", "assets"]);

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** HTTP header the customer API reads to scope every request to the store (ResolveStore middleware). */
export const STORE_HEADER = "X-Store";

/**
 * The store slug for a host such as "chemkleen.sofiacart.ph" or "chemkleen.localhost:3001", or
 * null for the platform itself (the root domain, reserved subdomains, IP addresses, other hosts).
 */
export function storeSlugFromHost(host: string | null | undefined, rootDomain: string = STORE_ROOT_DOMAIN): string | null {
  if (!host) return null;

  const hostname = host.trim().toLowerCase().replace(/:\d+$/, "").replace(/\.$/, "");
  const suffix = `.${rootDomain}`;
  if (!rootDomain || !hostname.endsWith(suffix)) return null;

  const label = hostname.slice(0, -suffix.length);
  if (!SLUG_PATTERN.test(label) || RESERVED_SUBDOMAINS.has(label) || label.length > 63) return null;

  return label;
}

/** The store slug of the page the browser is on (client side only). */
export function currentBrowserStoreSlug(): string | null {
  return typeof window === "undefined" ? null : storeSlugFromHost(window.location.host);
}
