import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { CartItem } from "@/types/domain";

interface CartState {
  currency: string;
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  replaceItems: (items: CartItem[]) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      currency: "PHP",
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((entry) => entry.id === item.id);

          if (!existingItem) {
            return { items: [...state.items, item] };
          }

          return {
            items: state.items.map((entry) =>
              entry.id === item.id
                ? { ...entry, quantity: entry.quantity + item.quantity }
                : entry
            ),
          };
        }),
      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((entry) => entry.id !== itemId),
        })),
      updateQuantity: (itemId, quantity) =>
        set((state) => ({
          items: state.items.map((entry) =>
            entry.id === itemId ? { ...entry, quantity: Math.max(1, quantity) } : entry
          ),
        })),
      replaceItems: (items) => set({ items }),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "sofiacart-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items, currency: state.currency }),
    }
  )
);
