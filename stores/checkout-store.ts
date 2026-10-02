import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Checkout, PaymentMethodCode } from "@/types/domain";

/**
 * Choices carried from the cart through checkout to the review page. Totals are never stored here:
 * every step asks the backend (`POST /checkout/summary`) for them.
 */
interface CheckoutState {
  /** Cart item ids selected on the cart page; null means the whole cart. */
  cartItemIds: number[] | null;
  voucherCode: string | null;
  addressId: number | null;
  shippingMethod: string | null;
  paymentMethod: PaymentMethodCode | null;
  notes: string;
  /** Reused for retries of the same submission so the backend never creates a duplicate order. */
  idempotencyKey: string | null;
  /** Backend response of the last placed order, shown on the order-complete page. */
  lastCheckout: Checkout | null;
  setCartItemIds: (ids: number[] | null) => void;
  setVoucherCode: (code: string | null) => void;
  setDetails: (details: Partial<Pick<CheckoutState, "addressId" | "shippingMethod" | "paymentMethod" | "notes">>) => void;
  ensureIdempotencyKey: () => string;
  completeCheckout: (checkout: Checkout) => void;
}

const newKey = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      cartItemIds: null,
      voucherCode: null,
      addressId: null,
      shippingMethod: null,
      paymentMethod: null,
      notes: "",
      idempotencyKey: null,
      lastCheckout: null,
      setCartItemIds: (cartItemIds) => set({ cartItemIds, idempotencyKey: null }),
      setVoucherCode: (voucherCode) => set({ voucherCode, idempotencyKey: null }),
      setDetails: (details) => set({ ...details, idempotencyKey: null }),
      ensureIdempotencyKey: () => {
        const existing = get().idempotencyKey;
        if (existing) return existing;
        const key = newKey();
        set({ idempotencyKey: key });
        return key;
      },
      completeCheckout: (checkout) =>
        set({
          lastCheckout: checkout,
          cartItemIds: null,
          voucherCode: null,
          notes: "",
          idempotencyKey: null,
        }),
    }),
    {
      name: "sofiacart-checkout",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
