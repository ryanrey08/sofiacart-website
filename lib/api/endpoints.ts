export const apiEndpoints = {
  catalog: {
    products: "/products",
    categories: "/categories",
    productDetails: (slug: string) => `/products/${encodeURIComponent(slug)}`,
    search: "/products/search",
  },
} as const;

export type ApiEndpoints = typeof apiEndpoints;
