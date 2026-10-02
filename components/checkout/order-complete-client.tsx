"use client";

import { Bell, Check, CreditCard, FileText, ListOrdered, MapPin, Printer, ShoppingBag, Truck } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { AddressSummary } from "@/components/account/address-summary";
import { OrderItems, OrderTotals } from "@/components/orders/order-items";
import { OrderTracker } from "@/components/orders/order-tracker";
import { PaymentPanel } from "@/components/orders/payment-panel";
import { CheckoutStepper } from "@/components/storefront/checkout-stepper";
import { EmptyState } from "@/components/storefront/states";
import { OrderStatusBadge } from "@/components/storefront/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrder } from "@/hooks/use-orders";
import { useHydrated } from "@/hooks/use-session";
import { formatDateTime } from "@/lib/utils/format";
import { useCheckoutStore } from "@/stores/checkout-store";
import type { Order } from "@/types/domain";

/** One store order with live payment status from `GET /account/orders/{orderNumber}`. */
function PlacedOrder({ placed, multiple }: { placed: Order; multiple: boolean }) {
  const live = useOrder(placed.orderNumber);
  const order = live.data ?? placed;

  return (
    <Card className="space-y-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-black text-ink">Order Details</h2>
            {multiple && order.store ? <p className="text-[11px] text-slate-500">Sold by {order.store.name}</p> : null}
          </div>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xs font-bold text-ink">
            Order Number: <span className="font-extrabold text-brand">{order.orderNumber}</span>
          </p>
          <p className="text-[11px] text-slate-400">Placed on {formatDateTime(order.placedAt)}</p>
        </div>
      </div>

      <OrderItems items={order.items ?? []} currency={order.currency} />

      <div className="grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
        <div className="space-y-1">
          <p className="flex items-center gap-1.5 text-xs font-bold text-ink"><MapPin className="h-4 w-4 text-brand" /> Shipping Information</p>
          {order.shippingAddress ? <AddressSummary address={order.shippingAddress} className="space-y-0.5 pt-1 text-[11px] text-slate-500" /> : null}
        </div>
        <div className="space-y-1">
          <p className="flex items-center gap-1.5 text-xs font-bold text-ink"><Truck className="h-4 w-4 text-brand" /> Delivery Method</p>
          <p className="pt-1 text-[11px] font-bold text-slate-800">{order.shippingMethod?.name ?? "—"}</p>
          <div className="pt-1"><OrderStatusBadge status={order.status} /></div>
        </div>
        <div className="space-y-1 border-t border-slate-100 pt-4 sm:col-span-2">
          <p className="flex items-center gap-1.5 text-xs font-bold text-ink"><CreditCard className="h-4 w-4 text-brand" /> Payment</p>
          {live.isPending ? <Skeleton className="h-10 w-full" /> : <PaymentPanel order={order} />}
        </div>
      </div>

      {multiple ? <OrderTotals order={order} /> : null}
    </Card>
  );
}

export function OrderCompleteClient() {
  const hydrated = useHydrated();
  const reference = useSearchParams().get("ref");
  const lastCheckout = useCheckoutStore((state) => state.lastCheckout);
  const checkout = lastCheckout && lastCheckout.reference === reference ? lastCheckout : null;

  if (!hydrated) {
    return <Skeleton className="h-64 w-full rounded-2xl" />;
  }

  if (!checkout) {
    return (
      <EmptyState
        icon={ListOrdered}
        title="Order confirmation not available here"
        description="This confirmation can only be shown right after you place an order. Your orders are always available in My Orders."
        action={<Button asChild className="rounded-full bg-brand"><Link href="/account/orders">View My Orders</Link></Button>}
      />
    );
  }

  const multiple = checkout.orders.length > 1;
  const firstOrder = checkout.orders[0];

  return (
    <div className="space-y-6">
      <div className="flex justify-center"><CheckoutStepper current="Order Complete" /></div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-brand/5 to-white p-6 shadow-sm sm:flex-row sm:p-8">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                <Check className="h-10 w-10 stroke-[3]" />
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-black tracking-tight text-ink sm:text-3xl">Thank you for your order!</h1>
                <p className="text-xs font-semibold text-slate-700 sm:text-sm">Your order has been successfully placed.</p>
                <p className="text-xs text-slate-500">
                  {multiple
                    ? `Your items come from ${checkout.orders.length} stores, so they were placed as ${checkout.orders.length} orders.`
                    : "The store will confirm your payment and start preparing your order."}
                </p>
              </div>
            </div>
          </div>

          {checkout.orders.map((order) => (
            <PlacedOrder key={order.orderNumber} placed={order} multiple={multiple} />
          ))}
        </div>

        <div className="space-y-4 lg:col-span-4">
          <div className="flex items-start gap-3 rounded-2xl border border-brand/15 bg-brand/5 p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Bell className="h-4 w-4" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-ink">Stay up to date</p>
              <p className="text-[11px] text-slate-500">Order updates appear in your <Link href="/account/notifications" className="font-semibold text-brand hover:underline">notifications</Link> and in My Orders.</p>
            </div>
          </div>

          <Card className="space-y-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-base font-black text-ink">
              <FileText className="h-5 w-5 text-brand" />
              <h2>Order Summary</h2>
            </div>
            <p className="text-[11px] text-slate-500">Checkout reference <span className="font-bold text-ink">{checkout.reference}</span></p>
            <OrderTotals order={checkout} />

            {firstOrder ? (
              <div className="space-y-3 pt-2">
                <p className="flex items-center gap-1.5 text-xs font-bold text-ink"><Truck className="h-4 w-4 text-brand" /> What&apos;s Next?</p>
                <OrderTracker order={firstOrder} compact />
              </div>
            ) : null}

            <div className="space-y-2 pt-2">
              <Button asChild className="h-11 w-full rounded-2xl bg-brand text-xs font-bold text-white hover:bg-brand/90">
                <Link href="/products"><ShoppingBag className="h-4 w-4" /> Continue Shopping</Link>
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button asChild variant="outline" className="h-9 rounded-xl text-xs font-bold text-slate-700">
                  <Link href="/account/orders"><ListOrdered className="h-3.5 w-3.5 text-brand" /> My Orders</Link>
                </Button>
                <Button variant="outline" onClick={() => window.print()} className="h-9 rounded-xl text-xs font-bold text-slate-700">
                  <Printer className="h-3.5 w-3.5 text-brand" /> Print
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
