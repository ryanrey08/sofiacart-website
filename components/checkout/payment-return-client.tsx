"use client";

import { CheckCircle2, Clock, ListOrdered, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { PaymentPanel } from "@/components/orders/payment-panel";
import { EmptyState, ErrorState } from "@/components/storefront/states";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useOrder, useSyncHitPay } from "@/hooks/use-orders";

/**
 * Landing page after returning from HitPay's hosted checkout. The browser redirect is never
 * trusted: this page asks the backend for the verified payment status (which, if the webhook is
 * late, pulls the status straight from HitPay) and renders that result only.
 */
export function PaymentReturnClient() {
  const params = useSearchParams();
  const orderNumber = params.get("order");
  const sync = useSyncHitPay();
  const order = useOrder(orderNumber);
  const synced = useRef(false);

  useEffect(() => {
    if (orderNumber && !synced.current) {
      synced.current = true;
      sync.mutate({ orderNumber });
    }
  }, [orderNumber, sync]);

  if (!orderNumber) {
    return (
      <EmptyState
        icon={ListOrdered}
        title="Payment status unavailable"
        description="We couldn't tell which order this payment was for. Check My Orders for the latest status."
        action={<Button asChild className="rounded-full bg-brand"><Link href="/account/orders">View My Orders</Link></Button>}
      />
    );
  }

  const verifying = sync.isPending || order.isPending;
  const data = order.data;
  const paid = data?.paymentStatus === "paid";
  const current = data?.payments?.[0];
  const pending = current?.status === "pending" && !current.isExpired;

  if (order.isError) {
    return <ErrorState error={order.error} onRetry={() => void order.refetch()} title="We couldn't load your payment" />;
  }

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <Card className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm">
        {verifying ? (
          <>
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-brand" />
            <div>
              <h1 className="text-xl font-black text-ink">Confirming your payment…</h1>
              <p className="text-xs text-slate-500">We&apos;re verifying your payment with HitPay. This only takes a moment.</p>
            </div>
          </>
        ) : paid ? (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="h-10 w-10 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-ink">Payment successful</h1>
              <p className="text-xs text-slate-500">Your payment for order <span className="font-bold text-ink">{orderNumber}</span> is confirmed.</p>
            </div>
          </>
        ) : pending ? (
          <>
            <Clock className="mx-auto h-12 w-12 text-amber-500" />
            <div>
              <h1 className="text-xl font-black text-ink">Payment still processing</h1>
              <p className="text-xs text-slate-500">
                We haven&apos;t received confirmation from HitPay yet. This page updates automatically once it&apos;s verified — you can safely check back from My Orders.
              </p>
            </div>
          </>
        ) : (
          <>
            <XCircle className="mx-auto h-12 w-12 text-red-500" />
            <div>
              <h1 className="text-xl font-black text-ink">Payment not completed</h1>
              <p className="text-xs text-slate-500">Your payment wasn&apos;t completed. You can try again below — you won&apos;t be charged twice.</p>
            </div>
          </>
        )}

        {!verifying && data ? (
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 text-left">
            <PaymentPanel order={data} />
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-2">
          <Button asChild variant="outline" className="h-10 rounded-xl text-xs font-bold text-slate-700">
            <Link href={`/account/orders/${encodeURIComponent(orderNumber)}`}>View Order</Link>
          </Button>
          <Button asChild className="h-10 rounded-xl bg-brand text-xs font-bold text-white">
            <Link href="/account/orders"><ListOrdered className="h-3.5 w-3.5" /> My Orders</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
