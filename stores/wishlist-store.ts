import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface WishlistState {
  productIds: number[];
  toggleProduct: (productId: number) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      productIds: [],
      toggleProduct: (productId) =>
        set((state) => ({
          productIds: state.productIds.includes(productId)
            ? state.productIds.filter((entry) => entry !== productId)
            : [...state.productIds, productId],
        })),
      clearWishlist: () => set({ productIds: [] }),
    }),
    {
      name: "sofiacart-wishlist",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ productIds: state.productIds }),
    }
  )
);
