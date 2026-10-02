import type { ListParams } from "@/types/api";
import type { CheckoutSummaryRequest, OrderStatus, ProductFilters } from "@/types/domain";

export const queryKeys = {
  catalog: {
    categories: ["catalog", "categories"] as const,
    products: (filters: ProductFilters) => ["catalog", "products", filters] as const,
    popular: (limit: number) => ["catalog", "popular", limit] as const,
    product: (slug: string) => ["catalog", "product", slug] as const,
    reviews: (slug: string, params: ListParams) => ["catalog", "reviews", slug, params] as const,
  },
  checkout: {
    shippingMethods: ["checkout", "shipping-methods"] as const,
    paymentMethods: ["checkout", "payment-methods"] as const,
    vouchers: ["vouchers"] as const,
  },
  /** Everything below belongs to the signed-in customer and is dropped on sign-out. */
  private: ["me"] as const,
  me: ["me", "user"] as const,
  cart: ["me", "cart"] as const,
  wishlist: ["me", "wishlist"] as const,
  summary: (request: CheckoutSummaryRequest) => ["me", "checkout-summary", request] as const,
  addresses: ["me", "addresses"] as const,
  orders: (params: ListParams & { status?: OrderStatus }) => ["me", "orders", "list", params] as const,
  ordersRoot: ["me", "orders"] as const,
  order: (orderNumber: string) => ["me", "orders", "detail", orderNumber] as const,
  returnable: (orderNumber: string) => ["me", "orders", "returnable", orderNumber] as const,
  returns: (params: ListParams) => ["me", "returns", params] as const,
  refunds: (params: ListParams) => ["me", "refunds", params] as const,
  payments: (params: ListParams) => ["me", "payments", params] as const,
  reviews: (params: ListParams) => ["me", "reviews", params] as const,
  notifications: (params: ListParams & { unread?: boolean }) => ["me", "notifications", params] as const,
  notificationsRoot: ["me", "notifications"] as const,
  unreadCount: ["me", "notifications", "unread-count"] as const,
  settings: ["me", "settings"] as const,
  sessions: ["me", "sessions"] as const,
};
