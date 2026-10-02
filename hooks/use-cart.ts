"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { cartService, wishlistService } from "@/lib/api/services/cart";
import { useSession } from "@/hooks/use-session";
import { useCartStore } from "@/stores/cart-store";
import type { Cart, Product, ProductVariant } from "@/types/domain";

export function variantLabel(variant: Pick<ProductVariant, "color" | "size" | "sku"> | null | undefined) {
  if (!variant) return null;
  return [variant.color, variant.size].filter(Boolean).join(" / ") || variant.sku || null;
}

export function useCart() {
  const { hydrated, isAuthenticated } = useSession();
  const guestItems = useCartStore((state) => state.items);

  const query = useQuery({
    queryKey: queryKeys.cart,
    queryFn: cartService.get,
    enabled: isAuthenticated,
  });

  const count = isAuthenticated
    ? (query.data?.itemCount ?? 0)
    : guestItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    hydrated,
    isAuthenticated,
    cart: query.data,
    guestItems: hydrated ? guestItems : [],
    count: hydrated ? count : 0,
    isLoading: !hydrated || (isAuthenticated && query.isPending),
    error: query.error,
    refetch: query.refetch,
  };
}

function useCartWriter() {
  const queryClient = useQueryClient();

  return (cart: Cart) => {
    queryClient.setQueryData(queryKeys.cart, cart);
    queryClient.invalidateQueries({ queryKey: ["me", "checkout-summary"] });
  };
}

export interface AddToCartInput {
  product: Pick<Product, "id" | "name" | "slug" | "imageUrl" | "price" | "currency">;
  variant?: ProductVariant | null;
  quantity?: number;
}

/** Adds to the server cart when signed in, otherwise to the guest cart. */
export function useAddToCart() {
  const { isAuthenticated } = useSession();
  const writeCart = useCartWriter();
  const addGuestItem = useCartStore((state) => state.addItem);

  return useMutation({
    mutationFn: async ({ product, variant, quantity = 1 }: AddToCartInput) => {
      if (isAuthenticated) {
        writeCart(await cartService.add({ productId: product.id, variantId: variant?.id ?? null, quantity }));
        return;
      }

      addGuestItem({
        productId: product.id,
        variantId: variant?.id ?? null,
        variantLabel: variantLabel(variant),
        quantity,
        name: product.name,
        slug: product.slug,
        imageUrl: product.imageUrl ?? null,
        displayPrice: variant?.price ?? product.price,
        currency: product.currency,
      });
    },
  });
}

export function useUpdateCartItem() {
  const writeCart = useCartWriter();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) => cartService.update(itemId, quantity),
    onSuccess: writeCart,
  });
}

export function useRemoveCartItem() {
  const writeCart = useCartWriter();

  return useMutation({
    mutationFn: (itemId: number) => cartService.remove(itemId),
    onSuccess: writeCart,
  });
}

export function useClearCart() {
  const writeCart = useCartWriter();

  return useMutation({
    mutationFn: () => cartService.clear(),
    onSuccess: writeCart,
  });
}

export function useWishlist() {
  const { isAuthenticated } = useSession();

  const query = useQuery({
    queryKey: queryKeys.wishlist,
    queryFn: wishlistService.list,
    enabled: isAuthenticated,
  });

  const productIds = new Set(query.data?.map((item) => item.productId));

  return { ...query, isAuthenticated, has: (productId: number) => productIds.has(productId) };
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, saved }: { productId: number; saved: boolean }) => {
      if (saved) {
        await wishlistService.remove(productId);
        return false;
      }
      await wishlistService.add(productId);
      return true;
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.wishlist }),
  });
}
