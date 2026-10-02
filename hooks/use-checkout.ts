"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { checkoutService, voucherService } from "@/lib/api/services/checkout";
import { useSession } from "@/hooks/use-session";
import type { CheckoutSummaryRequest, PlaceOrderRequest } from "@/types/domain";

export function useShippingMethods() {
  return useQuery({
    queryKey: queryKeys.checkout.shippingMethods,
    queryFn: checkoutService.shippingMethods,
    staleTime: 10 * 60 * 1000,
  });
}

export function usePaymentMethods() {
  return useQuery({
    queryKey: queryKeys.checkout.paymentMethods,
    queryFn: checkoutService.paymentMethods,
    staleTime: 10 * 60 * 1000,
  });
}

export function useVouchers() {
  return useQuery({
    queryKey: queryKeys.checkout.vouchers,
    queryFn: voucherService.list,
  });
}

/** Server-computed totals for the selected cart items, shipping method and voucher. */
export function useCheckoutSummary(request: CheckoutSummaryRequest, enabled = true) {
  const { isAuthenticated } = useSession();

  return useQuery({
    queryKey: queryKeys.summary(request),
    queryFn: () => checkoutService.summary(request),
    enabled: isAuthenticated && enabled,
    placeholderData: keepPreviousData,
    retry: false,
  });
}

export function useValidateVoucher() {
  return useMutation({
    mutationFn: ({ code, cartItemIds }: { code: string; cartItemIds?: number[] | null }) =>
      voucherService.validate(code, cartItemIds),
  });
}

export function usePlaceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ payload, idempotencyKey }: { payload: PlaceOrderRequest; idempotencyKey: string }) =>
      checkoutService.placeOrder(payload, idempotencyKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      queryClient.invalidateQueries({ queryKey: queryKeys.ordersRoot });
      queryClient.invalidateQueries({ queryKey: queryKeys.notificationsRoot });
      queryClient.invalidateQueries({ queryKey: ["catalog"] });
    },
  });
}
