"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { orderService, paymentService, refundService, returnService } from "@/lib/api/services/orders";
import { useSession } from "@/hooks/use-session";
import type { ListParams } from "@/types/api";
import type { OrderStatus, PaymentMethodCode, ReturnRequestInput } from "@/types/domain";

export function useOrders(params: ListParams & { status?: OrderStatus }) {
  const { isAuthenticated } = useSession();

  return useQuery({
    queryKey: queryKeys.orders(params),
    queryFn: () => orderService.list(params),
    enabled: isAuthenticated,
    placeholderData: keepPreviousData,
  });
}

export function useOrder(orderNumber: string | null | undefined) {
  const { isAuthenticated } = useSession();

  return useQuery({
    queryKey: queryKeys.order(orderNumber ?? ""),
    queryFn: () => orderService.get(orderNumber!),
    enabled: isAuthenticated && Boolean(orderNumber),
    retry: (count, error) => (error as { status?: number }).status !== 404 && count < 1,
  });
}

export function useReturnable(orderNumber: string) {
  const { isAuthenticated } = useSession();

  return useQuery({
    queryKey: queryKeys.returnable(orderNumber),
    queryFn: () => orderService.returnable(orderNumber),
    enabled: isAuthenticated,
  });
}

function useInvalidateOrder() {
  const queryClient = useQueryClient();

  return (orderNumber: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.ordersRoot });
    queryClient.invalidateQueries({ queryKey: queryKeys.order(orderNumber) });
    queryClient.invalidateQueries({ queryKey: ["me", "payments"] });
    queryClient.invalidateQueries({ queryKey: ["me", "returns"] });
    queryClient.invalidateQueries({ queryKey: queryKeys.notificationsRoot });
  };
}

export function useCancelOrder() {
  const invalidate = useInvalidateOrder();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderNumber, reason }: { orderNumber: string; reason?: string }) =>
      orderService.cancel(orderNumber, reason),
    onSuccess: (order) => {
      queryClient.setQueryData(queryKeys.order(order.orderNumber), order);
      invalidate(order.orderNumber);
      // Cancelling restores stock.
      queryClient.invalidateQueries({ queryKey: ["catalog"] });
    },
  });
}

export function useRetryPayment() {
  const invalidate = useInvalidateOrder();

  return useMutation({
    mutationFn: ({ orderNumber, paymentMethod }: { orderNumber: string; paymentMethod: PaymentMethodCode }) =>
      orderService.retryPayment(orderNumber, paymentMethod),
    onSuccess: (_payment, { orderNumber }) => invalidate(orderNumber),
  });
}

export function useSubmitPaymentReference() {
  const invalidate = useInvalidateOrder();

  return useMutation({
    mutationFn: ({ reference, gatewayReference }: { reference: string; gatewayReference: string; orderNumber: string }) =>
      paymentService.submitReference(reference, gatewayReference),
    onSuccess: (_payment, { orderNumber }) => invalidate(orderNumber),
  });
}

export function useRequestReturn() {
  const invalidate = useInvalidateOrder();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderNumber, payload }: { orderNumber: string; payload: ReturnRequestInput }) =>
      orderService.requestReturn(orderNumber, payload),
    onSuccess: (_return, { orderNumber }) => {
      invalidate(orderNumber);
      queryClient.invalidateQueries({ queryKey: queryKeys.returnable(orderNumber) });
    },
  });
}

export function useReturns(params: ListParams) {
  const { isAuthenticated } = useSession();
  return useQuery({
    queryKey: queryKeys.returns(params),
    queryFn: () => returnService.list(params),
    enabled: isAuthenticated,
    placeholderData: keepPreviousData,
  });
}

export function useRefunds(params: ListParams) {
  const { isAuthenticated } = useSession();
  return useQuery({
    queryKey: queryKeys.refunds(params),
    queryFn: () => refundService.list(params),
    enabled: isAuthenticated,
    placeholderData: keepPreviousData,
  });
}

export function usePayments(params: ListParams) {
  const { isAuthenticated } = useSession();
  return useQuery({
    queryKey: queryKeys.payments(params),
    queryFn: () => paymentService.list(params),
    enabled: isAuthenticated,
    placeholderData: keepPreviousData,
  });
}
