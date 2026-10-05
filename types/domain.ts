/**
 * Domain types matching the resources returned by sofiacart-website-backend
 * (app/Http/Resources/V1). Money values are decimal numbers in `currency` (PHP).
 */

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  emailVerified?: boolean;
  emailVerifiedAt?: string | null;
  createdAt?: string | null;
}

export interface AuthTokens {
  accessToken: string;
  tokenType?: string;
  expiresAt?: string | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  parentId?: number | null;
}

export interface StoreSummary {
  id: number;
  name: string;
  slug: string;
  logoUrl: string | null;
}

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface ProductVariant {
  id: number;
  sku: string | null;
  color: string | null;
  size: string | null;
  attributes: Record<string, string> | string[];
  price: number;
  inStock: boolean;
  stockStatus: StockStatus;
  availableQuantity: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  shortDescription?: string | null;
  price: number;
  /** Always null: the backend charges `price` (sale_price is not applied at checkout). */
  compareAtPrice?: number | null;
  currency: string;
  imageUrl?: string | null;
  brand?: string | null;
  category?: Category | null;
  store?: StoreSummary | null;
  inStock: boolean;
  stockStatus?: StockStatus;
  availableQuantity?: number;
  rating?: number | null;
  reviewCount?: number;
  // Present on GET /products/{slug} only.
  fullDescription?: string | null;
  condition?: string | null;
  tags?: string[];
  images?: string[];
  variants?: ProductVariant[];
}

export interface ProductFilters {
  search?: string;
  category_id?: number;
  store?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  sort?: ProductSort;
  page?: number;
  per_page?: number;
}

export type ProductSort = "newest" | "price_asc" | "price_desc" | "name";

export interface Address {
  id: number;
  label?: string | null;
  recipientName: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  /** Province. */
  state?: string | null;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export type AddressSnapshot = Omit<Address, "id" | "isDefault">;

export interface AddressInput {
  label?: string | null;
  recipientName: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state?: string | null;
  postalCode: string;
  country?: string | null;
  isDefault?: boolean;
}

export interface CartItemVariant {
  id: number;
  sku: string | null;
  label: string | null;
  color: string | null;
  size: string | null;
}

export interface CartItem {
  id: number;
  productId: number;
  variantId: number | null;
  variant: CartItemVariant | null;
  name: string | null;
  slug: string | null;
  imageUrl?: string | null;
  store: StoreSummary | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  currency: string;
  available: boolean;
  availableQuantity: number;
  issue: string | null;
}

export interface Cart {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
}

export interface WishlistItem {
  id: number;
  productId: number;
  name: string | null;
  slug: string | null;
  imageUrl?: string | null;
  price: number;
  currency: string;
  available: boolean;
  inStock: boolean;
  addedAt: string | null;
}

export interface ShippingMethod {
  code: string;
  name: string;
  description: string | null;
  fee: number;
  currency: string;
}

export interface ShippingMethodsResponse {
  shippingMethods: ShippingMethod[];
  freeShippingThreshold: number | null;
  chargedPer: "store_order";
}

export type PaymentMethodCode =
  | "card"
  | "gcash"
  | "maya"
  | "bank_transfer"
  | "cod"
  | "cash"
  | "paypal"
  | "other";

export interface PaymentMethodOption {
  code: PaymentMethodCode;
  name: string;
  description: string | null;
}

export type VoucherType = "fixed" | "percentage";

export interface Voucher {
  code: string;
  name: string | null;
  description: string | null;
  type: VoucherType;
  value: number;
  maxDiscount: number | null;
  minSpend: number;
  currency: string;
  store: StoreSummary | null;
  startsAt: string | null;
  endsAt: string | null;
}

export interface VoucherValidation {
  voucher: Voucher;
  discount: number;
  subtotal: number;
  timesUsed: number;
  currency: string;
}

export interface CheckoutSummaryLine {
  cartItemId: number;
  productId: number;
  variantId: number | null;
  name: string;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface CheckoutSummaryGroup {
  store: StoreSummary;
  items: CheckoutSummaryLine[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

export interface CheckoutSummary {
  orders: CheckoutSummaryGroup[];
  shippingMethod: { code: string; name: string } | null;
  voucher: Voucher | null;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
}

export interface CheckoutSummaryRequest {
  cartItemIds?: number[] | null;
  shippingMethod?: string | null;
  voucherCode?: string | null;
}

export interface PlaceOrderRequest extends CheckoutSummaryRequest {
  addressId?: number;
  address?: AddressInput;
  shippingMethod: string;
  paymentMethod: PaymentMethodCode;
  notes?: string | null;
}

export type OrderStatus = "pending" | "processing" | "out_for_delivery" | "completed" | "cancelled";

export type OrderPaymentStatus =
  | "unpaid"
  | "partially_paid"
  | "paid"
  | "partially_refunded"
  | "refunded";

export type PaymentStatus =
  | "pending"
  | "completed"
  | "failed"
  | "cancelled"
  | "expired"
  | "partially_refunded"
  | "refunded";

export interface OrderItem {
  id: number;
  productId: number | null;
  variantId: number | null;
  name: string;
  sku: string | null;
  slug: string | null;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
  total: number;
}

export interface OrderBalance {
  total: number;
  amountPaid: number;
  amountRefunded: number;
  pendingAmount: number;
  outstanding: number;
}

export interface Payment {
  reference: string;
  orderNumber?: string | null;
  method: PaymentMethodCode | null;
  methodName: string | null;
  status: PaymentStatus;
  isExpired: boolean;
  amount: number;
  currency: string;
  gatewayReference: string | null;
  failureReason: string | null;
  paidAt: string | null;
  expiresAt: string | null;
  createdAt: string | null;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: OrderPaymentStatus;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  store?: StoreSummary;
  items?: OrderItem[];
  shippingAddress: AddressSnapshot | null;
  shippingMethod: { code: string; name: string } | null;
  paymentMethod: PaymentMethodCode | null;
  checkoutReference: string | null;
  notes: string | null;
  placedAt: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  canCancel: boolean;
  canRequestReturn: boolean;
  // GET /account/orders/{orderNumber} only.
  balance?: OrderBalance;
  payments?: Payment[];
}

export interface OrderStatusSnapshot {
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: OrderPaymentStatus;
  balance: OrderBalance;
  updatedAt: string | null;
}

export interface Checkout {
  reference: string;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  voucherCode: string | null;
  shippingAddress: AddressSnapshot;
  orders: Order[];
  createdAt: string | null;
}

export interface ReturnableItem extends OrderItem {
  returnableQuantity: number;
}

export interface Returnability {
  eligible: boolean;
  returnWindowDays: number;
  items: ReturnableItem[];
}

export type ReturnRequestStatus = "pending" | "approved" | "rejected" | "processed";

export type RefundStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "processing"
  | "processed"
  | "failed"
  | "cancelled";

export interface ReturnLine {
  orderItemId: number;
  name: string | null;
  quantity: number;
  amount: number;
}

export interface ReturnRequest {
  id: number;
  orderNumber?: string | null;
  status: ReturnRequestStatus;
  reason: string;
  notes: string | null;
  amount: number;
  currency: string;
  items?: ReturnLine[];
  refund?: { reference: string; status: RefundStatus; amount: number } | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ReturnRequestInput {
  reason: string;
  notes: string;
  items: { orderItemId: number; quantity: number }[];
}

export interface Refund {
  reference: string;
  orderNumber?: string | null;
  paymentReference?: string | null;
  status: RefundStatus;
  amount: number;
  currency: string;
  reason: string | null;
  items?: ReturnLine[];
  refundedAt: string | null;
  createdAt: string | null;
}

export interface Review {
  id: number;
  productId: number;
  product?: { id: number; name: string; slug: string } | null;
  rating: number;
  title: string | null;
  body: string | null;
  author?: string | null;
  verifiedPurchase: boolean;
  status: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ReviewInput {
  rating: number;
  title?: string | null;
  body?: string | null;
}

export interface ReviewSummary {
  average: number | null;
  count: number;
  distribution: Record<"1" | "2" | "3" | "4" | "5", number>;
}

export interface CustomerNotification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  data: Record<string, unknown>;
  read: boolean;
  readAt: string | null;
  createdAt: string | null;
}

export interface AccountSettings {
  orderUpdates: boolean;
  promotions: boolean;
}

export interface AccountSession {
  id: number;
  name: string;
  current: boolean;
  lastUsedAt: string | null;
  expiresAt: string | null;
  createdAt: string | null;
}
