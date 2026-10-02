"use client";

import { CreditCard, MapPin, PackageX, RefreshCw, RotateCcw, Store, Truck } from "lucide-react";
import Link from "next/link";

import { AddressSummary } from "@/components/account/address-summary";
import { CancelOrderDialog } from "@/components/orders/cancel-order-dialog";
import { OrderItems, OrderTotals } from "@/components/orders/order-items";
import { OrderTracker } from "@/components/orders/order-tracker";
import { PaymentPanel } from "@/components/orders/payment-panel";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/storefront/states";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/storefront/status-badge";
import { Button } from "@/components/ui/button";
import { useOrder } from "@/hooks/use-orders";
import { ApiClientError } from "@/lib/api/client";
import { formatCurrency, formatDateTime } from "@/lib/utils/format";

function Section({ icon: Icon, title, children }: { icon: typeof MapPin; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="flex items-center gap-1.5 text-xs font-bold text-ink"><Icon className="h-4 w-4 text-brand" /> {title}</p>
      {children}
    </div>
  );
}

/** Full order view from `GET /account/orders/{orderNumber}` (panel on My Orders and the detail page). */
export function OrderDetail({ orderNumber, variant = "page" }: { orderNumber: string; variant?: "page" | "panel" }) {
  const { data: order, isPending, isError, error, refetch, isFetching } = useOrder(orderNumber);

  if (isPending) return <ListSkeleton rows={4} />;

  if (isError) {
    if (error instanceof ApiClientError && error.status === 404) {
      return <EmptyState icon={PackageX} title="Order not found" description="This order doesn't exist or doesn't belong to your account." />;
    }
    return <ErrorState error={error} onRetry={() => void refetch()} />;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="break-all text-sm font-black text-ink">Order #{order.orderNumber}</p>
          <p className="text-[11px] text-slate-400">Placed on {formatDateTime(order.placedAt)}</p>
          {order.store ? <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500"><Store className="h-3.5 w-3.5" /> {order.store.name}</p> : null}
        </div>
        <div className="flex flex-col items-end gap-1">
          <OrderStatusBadge status={order.status} className="text-xs" />
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex-1"><OrderTracker order={order} /></div>
        <Button variant="ghost" size="icon" aria-label="Refresh order status" disabled={isFetching} onClick={() => void refetch()} className="h-8 w-8 shrink-0 text-slate-400">
          <RefreshCw className={isFetching ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
        </Button>
      </div>
      {order.cancellationReason ? <p className="text-[11px] text-slate-500">Reason: {order.cancellationReason}</p> : null}

      <Section icon={Truck} title={`Order Items (${order.items?.length ?? 0})`}>
        <OrderItems items={order.items ?? []} currency={order.currency} />
      </Section>

      <OrderTotals order={order} />

      {order.balance && (order.balance.amountPaid > 0 || order.balance.amountRefunded > 0) ? (
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3 text-[11px] text-slate-600">
          <span>Paid: <b className="text-ink">{formatCurrency(order.balance.amountPaid, order.currency)}</b></span>
          <span>Refunded: <b className="text-ink">{formatCurrency(order.balance.amountRefunded, order.currency)}</b></span>
          <span>Outstanding: <b className="text-ink">{formatCurrency(order.balance.outstanding, order.currency)}</b></span>
        </div>
      ) : null}

      <div className={variant === "page" ? "grid gap-5 sm:grid-cols-2" : "space-y-5"}>
        <Section icon={MapPin} title="Shipping Information">
          {order.shippingAddress ? <AddressSummary address={order.shippingAddress} className="space-y-0.5 text-[11px] text-slate-500" /> : <p className="text-[11px] text-slate-400">—</p>}
          {order.shippingMethod ? <p className="text-[11px] text-slate-500">Delivery: <b className="text-ink">{order.shippingMethod.name}</b></p> : null}
          {order.notes ? <p className="text-[11px] text-slate-500">Notes: {order.notes}</p> : null}
        </Section>
        <Section icon={CreditCard} title="Payment">
          <PaymentPanel order={order} />
        </Section>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
        {variant === "panel" ? (
          <Button asChild className="h-9 rounded-xl bg-brand text-xs font-bold">
            <Link href={`/account/orders/${encodeURIComponent(order.orderNumber)}`}><Truck className="h-3.5 w-3.5" /> Track Order</Link>
          </Button>
        ) : null}
        {order.canRequestReturn ? (
          <Button asChild variant="outline" className="h-9 rounded-xl text-xs font-bold text-slate-700">
            <Link href={`/account/orders/${encodeURIComponent(order.orderNumber)}/return`}><RotateCcw className="h-3.5 w-3.5 text-brand" /> Request Return</Link>
          </Button>
        ) : null}
        {order.canCancel ? <CancelOrderDialog orderNumber={order.orderNumber} /> : null}
      </div>
    </div>
  );
}
