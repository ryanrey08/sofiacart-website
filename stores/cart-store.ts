import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * Guest cart, kept in the browser until the shopper signs in. It stores product references and
 * quantities; on sign-in it is merged into the server cart (`POST /cart/merge`), which re-prices
 * every line. `displayPrice` is only the catalog price shown while browsing, never a total.
 */
export interface GuestCartItem {
  productId: number;
  variantId: number | null;
  variantLabel: string | null;
  quantity: number;
  name: string;
  slug: string;
  imageUrl: string | null;
  displayPrice: number;
  currency: string;
}

const sameLine = (a: Pick<GuestCartItem, "productId" | "variantId">, b: Pick<GuestCartItem, "productId" | "variantId">) =>
  a.productId === b.productId && (a.variantId ?? null) === (b.variantId ?? null);

interface CartState {
  items: GuestCartItem[];
  addItem: (item: GuestCartItem) => void;
  removeItem: (productId: number, variantId: number | null) => void;
  updateQuantity: (productId: number, variantId: number | null, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((entry) => sameLine(entry, item));

          if (!existing) {
            return { items: [...state.items, item] };
          }

          return {
            items: state.items.map((entry) =>
              sameLine(entry, item) ? { ...entry, quantity: Math.min(999, entry.quantity + item.quantity) } : entry
            ),
          };
        }),
      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter((entry) => !sameLine(entry, { productId, variantId })),
        })),
      updateQuantity: (productId, variantId, quantity) =>
        set((state) => ({
          items: state.items.map((entry) =>
            sameLine(entry, { productId, variantId })
              ? { ...entry, quantity: Math.min(999, Math.max(1, quantity)) }
              : entry
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "sofiacart-guest-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
