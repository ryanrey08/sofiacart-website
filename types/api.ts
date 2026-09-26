import type { Address, Cart, Category, Order, Product, User, WishlistItem } from "@/types/domain";

export interface ApiMeta {
  currentPage?: number;
  perPage?: number;
  total?: number;
}

export interface ApiEnvelope<T> {
  data: T;
  message?: string;
  meta?: ApiMeta;
}

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface AuthTokens {
  accessToken: string;
  tokenType?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
  passwordConfirmation: string;
  shippingAddress?: Omit<Address, "id">;
}

export interface LoginPayload {
  email: string;
  password: string;
  remember?: boolean;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface ProductListResponse {
  products: Product[];
  categories?: Category[];
}

export interface CartResponse {
  cart: Cart;
}

export interface WishlistResponse {
  items: WishlistItem[];
}

export interface OrdersResponse {
  orders: Order[];
}
