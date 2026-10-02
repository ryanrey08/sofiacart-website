import { apiClient, getData } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import type { ApiEnvelope, ListParams, PaginationMeta } from "@/types/api";
import type {
  Order,
  OrderStatus,
  OrderStatusSnapshot,
  Payment,
  PaymentMethodCode,
  Refund,
  Returnability,
  ReturnRequest,
  ReturnRequestInput,
} from "@/types/domain";

export interface Paginated<T> {
  items: T[];
  meta?: PaginationMeta;
}

async function paginated<T>(url: string, key: string, params: object): Promise<Paginated<T>> {
  const { data } = await apiClient.get<ApiEnvelope<Record<string, T[]>>>(url, { params });
  return { items: data.data[key] ?? [], meta: data.meta };
}

export const orderService = {
  list(params: ListParams & { status?: OrderStatus } = {}) {
    return paginated<Order>(apiEndpoints.account.orders, "orders", params);
  },
  async get(orderNumber: string) {
    return (await getData<{ order: Order }>(apiEndpoints.account.order(orderNumber))).order;
  },
  status(orderNumber: string) {
    return getData<OrderStatusSnapshot>(apiEndpoints.account.orderStatus(orderNumber));
  },
  async cancel(orderNumber: string, reason?: string) {
    const { data } = await apiClient.post<ApiEnvelope<{ order: Order }>>(apiEndpoints.account.cancelOrder(orderNumber), {
      reason: reason || undefined,
    });
    return data.data.order;
  },
  async retryPayment(orderNumber: string, paymentMethod: PaymentMethodCode) {
    const { data } = await apiClient.post<ApiEnvelope<{ payment: Payment }>>(
      apiEndpoints.account.retryPayment(orderNumber),
      { paymentMethod }
    );
    return data.data.payment;
  },
  returnable(orderNumber: string) {
    return getData<Returnability>(apiEndpoints.account.returnable(orderNumber));
  },
  async requestReturn(orderNumber: string, payload: ReturnRequestInput) {
    const { data } = await apiClient.post<ApiEnvelope<{ return: ReturnRequest }>>(
      apiEndpoints.account.requestReturn(orderNumber),
      payload
    );
    return data.data.return;
  },
};

export const returnService = {
  list(params: ListParams = {}) {
    return paginated<ReturnRequest>(apiEndpoints.account.returns, "returns", params);
  },
};

export const refundService = {
  list(params: ListParams = {}) {
    return paginated<Refund>(apiEndpoints.account.refunds, "refunds", params);
  },
};

export const paymentService = {
  list(params: ListParams = {}) {
    return paginated<Payment>(apiEndpoints.account.payments, "payments", params);
  },
  async submitReference(reference: string, gatewayReference: string) {
    const { data } = await apiClient.post<ApiEnvelope<{ payment: Payment }>>(
      apiEndpoints.account.paymentReference(reference),
      { gatewayReference }
    );
    return data.data.payment;
  },
};
