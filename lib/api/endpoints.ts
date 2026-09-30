export const apiEndpoints = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    logout: "/auth/logout",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    oauth: "/auth/oauth",
    profile: "/account/profile",
  },
  catalog: {
    products: "/products",
    featuredProducts: "/products/featured",
    popularProducts: "/products/popular",
    categories: "/categories",
    productDetails: (slug: string) => `/products/${encodeURIComponent(slug)}`,
    search: "/products/search",
  },
  cart: {
    root: "/cart",
    items: "/cart/items",
    item: (itemId: number) => `/cart/items/${encodeURIComponent(String(itemId))}`,
  },
  wishlist: {
    root: "/wishlist",
    item: (productId: number) => `/wishlist/${encodeURIComponent(String(productId))}`,
  },
  checkout: {
    addresses: "/checkout/addresses",
    shippingMethods: "/checkout/shipping-methods",
    orders: "/checkout/orders",
  },
  account: {
    addresses: "/account/addresses",
    orderHistory: "/account/orders",
  },
} as const;

export type ApiEndpoints = typeof apiEndpoints;
