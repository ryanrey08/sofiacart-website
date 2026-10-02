/**
 * Routes of sofiacart-website-backend (routes/api.php), relative to NEXT_PUBLIC_API_BASE_URL.
 */
const segment = (value: string | number) => encodeURIComponent(String(value));

export const apiEndpoints = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    me: "/auth/me",
    logout: "/auth/logout",
    logoutAll: "/auth/logout-all",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    resendVerification: "/auth/email/verification-notification",
  },
  catalog: {
    products: "/products",
    search: "/products/search",
    popular: "/products/popular",
    categories: "/categories",
    productDetails: (slug: string) => `/products/${segment(slug)}`,
    availability: (slug: string) => `/products/${segment(slug)}/availability`,
    reviews: (slug: string) => `/products/${segment(slug)}/reviews`,
  },
  account: {
    profile: "/account/profile",
    password: "/account/password",
    settings: "/account/settings",
    sessions: "/account/sessions",
    session: (id: number) => `/account/sessions/${segment(id)}`,
    addresses: "/account/addresses",
    address: (id: number) => `/account/addresses/${segment(id)}`,
    defaultAddress: (id: number) => `/account/addresses/${segment(id)}/default`,
    orders: "/account/orders",
    order: (orderNumber: string) => `/account/orders/${segment(orderNumber)}`,
    orderStatus: (orderNumber: string) => `/account/orders/${segment(orderNumber)}/status`,
    cancelOrder: (orderNumber: string) => `/account/orders/${segment(orderNumber)}/cancel`,
    retryPayment: (orderNumber: string) => `/account/orders/${segment(orderNumber)}/payments`,
    returnable: (orderNumber: string) => `/account/orders/${segment(orderNumber)}/returnable`,
    requestReturn: (orderNumber: string) => `/account/orders/${segment(orderNumber)}/returns`,
    returns: "/account/returns",
    returnRequest: (id: number) => `/account/returns/${segment(id)}`,
    payments: "/account/payments",
    payment: (reference: string) => `/account/payments/${segment(reference)}`,
    paymentReference: (reference: string) => `/account/payments/${segment(reference)}/reference`,
    refunds: "/account/refunds",
    refund: (reference: string) => `/account/refunds/${segment(reference)}`,
    transactions: "/account/transactions",
    reviews: "/account/reviews",
    review: (id: number) => `/account/reviews/${segment(id)}`,
    notifications: "/account/notifications",
    unreadNotifications: "/account/notifications/unread-count",
    readAllNotifications: "/account/notifications/read-all",
    readNotification: (id: string) => `/account/notifications/${segment(id)}/read`,
    notification: (id: string) => `/account/notifications/${segment(id)}`,
  },
  cart: {
    root: "/cart",
    items: "/cart/items",
    item: (id: number) => `/cart/items/${segment(id)}`,
    merge: "/cart/merge",
  },
  wishlist: {
    root: "/wishlist",
    item: (productId: number) => `/wishlist/${segment(productId)}`,
  },
  checkout: {
    shippingMethods: "/checkout/shipping-methods",
    paymentMethods: "/checkout/payment-methods",
    summary: "/checkout/summary",
    orders: "/checkout/orders",
  },
  vouchers: {
    list: "/vouchers",
    validate: "/vouchers/validate",
  },
} as const;

export type ApiEndpoints = typeof apiEndpoints;
