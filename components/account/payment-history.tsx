"use client";

import { ReceiptText } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { AccountPageHeader } from "@/components/account/account-page-header";
import { Pagination } from "@/components/storefront/pagination";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/storefront/states";
import { PaymentStatusBadge } from "@/components/storefront/status-badge";
import { Card } from "@/components/ui/card";
import { usePayments } from "@/hooks/use-orders";
import { formatCurrency, formatDateTime } from "@/lib/utils/format";

export function PaymentHistory() {
  const [page, setPage] = useState(1);
  const payments = usePayments({ page, per_page: 10 });

  return (
    <>
      <AccountPageHeader icon={ReceiptText} title="Payments" description="Payments for your orders. Open an order to add a reference number or pay again." />
      {payments.isPending ? (
        <ListSkeleton rows={3} />
      ) : payments.isError ? (
        <ErrorState error={payments.error} onRetry={() => void payments.refetch()} />
      ) : payments.data.items.length === 0 ? (
        <EmptyState icon={ReceiptText} title="No payments yet" description="Payments appear here after you place an order." />
      ) : (
        <>
          <ul className="space-y-3">
            {payments.data.items.map((payment) => (
              <Card key={payment.reference} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-ink">{payment.methodName ?? "Payment"} · {payment.reference}</p>
                  <p className="text-[11px] text-slate-400">{formatDateTime(payment.createdAt)}</p>
                  {payment.orderNumber ? (
                    <Link href={`/account/orders/${encodeURIComponent(payment.orderNumber)}`} className="text-[11px] font-semibold text-brand hover:underline">
                      Order #{payment.orderNumber}
                    </Link>
                  ) : null}
                  {payment.gatewayReference ? <p className="text-[11px] text-slate-500">Your reference: {payment.gatewayReference}</p> : null}
                </div>
                <div className="text-right">
                  <PaymentStatusBadge status={payment.isExpired && payment.status === "pending" ? "expired" : payment.status} />
                  <p className="mt-1 text-sm font-black text-ink">{formatCurrency(payment.amount, payment.currency)}</p>
                </div>
              </Card>
            ))}
          </ul>
          <Pagination page={page} lastPage={payments.data.meta?.lastPage ?? 1} onPageChange={setPage} disabled={payments.isFetching} />
        </>
      )}
    </>
  );
}
