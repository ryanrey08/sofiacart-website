import { apiClient, getData } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import type { ApiEnvelope } from "@/types/api";
import type { Cart, WishlistItem } from "@/types/domain";

type CartEnvelope = ApiEnvelope<{ cart: Cart }>;

export interface MergeCartItem {
  productId: number;
  variantId?: number | null;
  quantity: number;
}

export const cartService = {
  async get() {
    return (await getData<{ cart: Cart }>(apiEndpoints.cart.root)).cart;
  },
  async add(payload: { productId: number; variantId?: number | null; quantity?: number }) {
    const { data } = await apiClient.post<CartEnvelope>(apiEndpoints.cart.items, payload);
    return data.data.cart;
  },
  async update(itemId: number, quantity: number) {
    const { data } = await apiClient.patch<CartEnvelope>(apiEndpoints.cart.item(itemId), { quantity });
    return data.data.cart;
  },
  async remove(itemId: number) {
    const { data } = await apiClient.delete<CartEnvelope>(apiEndpoints.cart.item(itemId));
    return data.data.cart;
  },
  async clear() {
    const { data } = await apiClient.delete<CartEnvelope>(apiEndpoints.cart.root);
    return data.data.cart;
  },
  async merge(items: MergeCartItem[]) {
    const { data } = await apiClient.post<ApiEnvelope<{ cart: Cart; warnings: string[] }>>(apiEndpoints.cart.merge, {
      items,
    });
    return data.data;
  },
};

export const wishlistService = {
  async list() {
    return (await getData<{ items: WishlistItem[] }>(apiEndpoints.wishlist.root)).items;
  },
  async add(productId: number) {
    const { data } = await apiClient.post<ApiEnvelope<{ item: WishlistItem }>>(apiEndpoints.wishlist.root, { productId });
    return data.data.item;
  },
  async remove(productId: number) {
    await apiClient.delete(apiEndpoints.wishlist.item(productId));
  },
};
