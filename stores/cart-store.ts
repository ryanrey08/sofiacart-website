import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { CartItem } from "@/types/domain";

interface CartState {
  currency: string;
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  replaceItems: (payload: { currency: string; items: CartItem[] }) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      currency: "PHP",
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find(
            (entry) => entry.productId === item.productId
          );

          if (!existingItem) {
            return { items: [...state.items, item] };
          }

          return {
            items: state.items.map((entry) =>
              entry.productId === item.productId
                ? { ...entry, quantity: entry.quantity + item.quantity }
                : entry
            ),
          };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((entry) => entry.productId !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((entry) =>
            entry.productId === productId
              ? { ...entry, quantity: Math.max(1, quantity) }
              : entry
          ),
        })),
      replaceItems: ({ currency, items }) => set({ currency, items }),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "sofiacart-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items, currency: state.currency }),
    }
  )
);
