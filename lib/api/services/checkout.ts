import { apiClient, getData } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import type { ApiEnvelope } from "@/types/api";
import type {
  Checkout,
  CheckoutSummary,
  CheckoutSummaryRequest,
  PaymentMethodOption,
  PlaceOrderRequest,
  ShippingMethodsResponse,
  Voucher,
  VoucherValidation,
} from "@/types/domain";

export const checkoutService = {
  shippingMethods() {
    return getData<ShippingMethodsResponse>(apiEndpoints.checkout.shippingMethods);
  },
  async paymentMethods() {
    return (await getData<{ paymentMethods: PaymentMethodOption[] }>(apiEndpoints.checkout.paymentMethods)).paymentMethods;
  },
  async summary(payload: CheckoutSummaryRequest) {
    const { data } = await apiClient.post<ApiEnvelope<{ summary: CheckoutSummary }>>(
      apiEndpoints.checkout.summary,
      payload
    );
    return data.data.summary;
  },
  /** `idempotencyKey` makes a retried submission return the original order instead of a duplicate. */
  async placeOrder(payload: PlaceOrderRequest, idempotencyKey: string) {
    const { data } = await apiClient.post<ApiEnvelope<{ checkout: Checkout }>>(apiEndpoints.checkout.orders, payload, {
      headers: { "Idempotency-Key": idempotencyKey },
    });
    return data.data.checkout;
  },
};

export const voucherService = {
  async list() {
    return (await getData<{ vouchers: Voucher[] }>(apiEndpoints.vouchers.list)).vouchers;
  },
  async validate(code: string, cartItemIds?: number[] | null) {
    const { data } = await apiClient.post<ApiEnvelope<VoucherValidation>>(apiEndpoints.vouchers.validate, {
      code,
      cartItemIds: cartItemIds?.length ? cartItemIds : undefined,
    });
    return data.data;
  },
};
