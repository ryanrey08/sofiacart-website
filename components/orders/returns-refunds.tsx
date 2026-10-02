"use client";

import { ReceiptText, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { AccountPageHeader } from "@/components/account/account-page-header";
import { Pagination } from "@/components/storefront/pagination";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/storefront/states";
import { RequestStatusBadge } from "@/components/storefront/status-badge";
import { Card } from "@/components/ui/card";
import { useRefunds, useReturns } from "@/hooks/use-orders";
import { formatCurrency, formatShortDate } from "@/lib/utils/format";

function OrderLink({ orderNumber }: { orderNumber?: string | null }) {
  if (!orderNumber) return null;
  return (
    <Link href={`/account/orders/${encodeURIComponent(orderNumber)}`} className="text-[11px] font-semibold text-brand hover:underline">
      Order #{orderNumber}
    </Link>
  );
}

export function ReturnsAndRefunds() {
  const [returnsPage, setReturnsPage] = useState(1);
  const [refundsPage, setRefundsPage] = useState(1);
  const returns = useReturns({ page: returnsPage, per_page: 10 });
  const refunds = useRefunds({ page: refundsPage, per_page: 10 });

  return (
    <>
      <AccountPageHeader icon={RotateCcw} title="Returns & Refunds" description="Track your return requests and refunds." />

      <section className="space-y-3">
        <h2 className="text-sm font-black text-ink">Return Requests</h2>
        {returns.isPending ? (
          <ListSkeleton rows={2} />
        ) : returns.isError ? (
          <ErrorState error={returns.error} onRetry={() => void returns.refetch()} />
        ) : returns.data.items.length === 0 ? (
          <EmptyState icon={RotateCcw} title="No return requests" description="You can request a return from a completed order in My Orders." />
        ) : (
          <>
            <ul className="space-y-3">
              {returns.data.items.map((entry) => (
                <Card key={entry.id} className="space-y-2 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-ink">Return #{entry.id} · {entry.reason}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>{formatShortDate(entry.createdAt)}</span>
                        <OrderLink orderNumber={entry.orderNumber} />
                      </div>
                    </div>
                    <div className="text-right">
                      <RequestStatusBadge status={entry.status} />
                      <p className="mt-1 text-xs font-black text-ink">{formatCurrency(entry.amount, entry.currency)}</p>
                    </div>
                  </div>
                  {entry.items?.length ? (
                    <ul className="text-[11px] text-slate-500">
                      {entry.items.map((item) => <li key={item.orderItemId}>{item.quantity} × {item.name}</li>)}
                    </ul>
                  ) : null}
                  {entry.refund ? (
                    <p className="text-[11px] text-slate-500">
                      Refund {entry.refund.reference}: <RequestStatusBadge status={entry.refund.status} /> {formatCurrency(entry.refund.amount, entry.currency)}
                    </p>
                  ) : null}
                </Card>
              ))}
            </ul>
            <Pagination page={returnsPage} lastPage={returns.data.meta?.lastPage ?? 1} onPageChange={setReturnsPage} disabled={returns.isFetching} />
          </>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-black text-ink">Refunds</h2>
        {refunds.isPending ? (
          <ListSkeleton rows={2} />
        ) : refunds.isError ? (
          <ErrorState error={refunds.error} onRetry={() => void refunds.refetch()} />
        ) : refunds.data.items.length === 0 ? (
          <EmptyState icon={ReceiptText} title="No refunds yet" description="Refunds issued by stores appear here." />
        ) : (
          <>
            <ul className="space-y-3">
              {refunds.data.items.map((refund) => (
                <Card key={refund.reference} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                  <div>
                    <p className="text-xs font-bold text-ink">Refund {refund.reference}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{formatShortDate(refund.refundedAt ?? refund.createdAt)}</span>
                      <OrderLink orderNumber={refund.orderNumber} />
                    </div>
                    {refund.reason ? <p className="text-[11px] text-slate-500">{refund.reason}</p> : null}
                  </div>
                  <div className="text-right">
                    <RequestStatusBadge status={refund.status} />
                    <p className="mt-1 text-xs font-black text-ink">{formatCurrency(refund.amount, refund.currency)}</p>
                  </div>
                </Card>
              ))}
            </ul>
            <Pagination page={refundsPage} lastPage={refunds.data.meta?.lastPage ?? 1} onPageChange={setRefundsPage} disabled={refunds.isFetching} />
          </>
        )}
      </section>
    </>
  );
}
