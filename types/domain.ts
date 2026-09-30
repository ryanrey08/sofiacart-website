export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string | null;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  compareAtPrice?: number | null;
  currency: string;
  imageUrl?: string | null;
  category?: Category | null;
  inStock: boolean;
  rating?: number | null;
}

export interface Address {
  id: number;
  label?: string | null;
  recipientName: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state?: string | null;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface CartItem {
  id: number;
  productId: number;
  name: string;
  slug: string;
  imageUrl?: string | null;
  unitPrice: number;
  quantity: number;
  currency: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
}

export interface WishlistItem {
  id: number;
  productId: number;
  name: string;
  slug: string;
  imageUrl?: string | null;
  price: number;
  currency: string;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  items: CartItem[];
  total: number;
  currency: string;
  shippingAddress: Address;
  placedAt: string;
}
