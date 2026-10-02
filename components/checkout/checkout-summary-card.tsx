"use client";

import { Pencil, Store } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { ProductImage } from "@/components/storefront/product-image";
import { InlineError } from "@/components/storefront/states";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils/format";
import type { CheckoutSummary } from "@/types/domain";

/** Right-hand order summary on checkout and review, rendered from `POST /checkout/summary`. */
export function CheckoutSummaryCard({
  summary,
  pending,
  fetching,
  error,
  shippingChosen,
  children,
}: {
  summary: CheckoutSummary | undefined;
  pending: boolean;
  fetching?: boolean;
  error: unknown;
  shippingChosen: boolean;
  children?: ReactNode;
}) {
  const itemCount = summary?.orders.reduce((sum, group) => sum + group.items.reduce((count, line) => count + line.quantity, 0), 0) ?? 0;

  return (
    <Card className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-black text-ink">Order Summary {summary ? `(${itemCount} item${itemCount === 1 ? "" : "s"})` : ""}</h2>
        <Link href="/cart" className="flex items-center gap-1 text-xs font-bold text-brand hover:underline">
          <Pencil className="h-3 w-3" /> Edit Cart
        </Link>
      </div>

      {pending ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      ) : error ? (
        <InlineError error={error} />
      ) : summary ? (
        <div className={fetching ? "opacity-60 transition-opacity" : undefined}>
          <div className="max-h-80 space-y-4 overflow-y-auto pr-1">
            {summary.orders.map((group) => (
              <div key={group.store.id} className="space-y-2">
                {summary.orders.length > 1 ? (
                  <p className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                    <Store className="h-3.5 w-3.5" /> {group.store.name}
                  </p>
                ) : null}
                <ul className="space-y-3">
                  {group.items.map((line) => (
                    <li key={line.cartItemId} className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <ProductImage src={line.imageUrl} alt={line.name} className="h-12 w-12 shrink-0 rounded-xl border border-slate-100 p-1" />
                        <div className="min-w-0">
                          <p className="line-clamp-1 text-xs font-bold text-ink">{line.name}</p>
                          <p className="text-[10px] text-slate-400">{formatCurrency(line.unitPrice, summary.currency)} × {line.quantity}</p>
                        </div>
                      </div>
                      <p className="shrink-0 text-xs font-black text-ink">{formatCurrency(line.lineTotal, summary.currency)}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Separator className="my-4 bg-slate-100" />

          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal ({itemCount} items)</span>
              <span className="font-bold text-ink">{formatCurrency(summary.subtotal, summary.currency)}</span>
            </div>
            {summary.discount > 0 ? (
              <div className="flex justify-between font-semibold text-emerald-600">
                <span>Discount{summary.voucher ? ` (${summary.voucher.code})` : ""}</span>
                <span>-{formatCurrency(summary.discount, summary.currency)}</span>
              </div>
            ) : null}
            <div className="flex justify-between">
              <span>Shipping Fee{summary.orders.length > 1 ? ` (${summary.orders.length} stores)` : ""}</span>
              <span className="font-bold text-ink">
                {shippingChosen ? formatCurrency(summary.shipping, summary.currency) : <span className="font-normal text-slate-400">Choose a delivery method</span>}
              </span>
            </div>
          </div>

          <Separator className="my-4 bg-slate-100" />

          <div className="flex items-baseline justify-between">
            <span className="text-sm font-bold text-ink">Total Amount</span>
            <div className="text-right">
              <span className="text-xl font-black text-ink">{formatCurrency(summary.total, summary.currency)}</span>
              <p className="text-[9px] text-slate-400">Inclusive of VAT (if applicable)</p>
            </div>
          </div>
          {summary.orders.length > 1 ? (
            <p className="mt-2 text-[10px] text-slate-400">Items from different stores are placed as separate orders, each with its own shipping fee.</p>
          ) : null}
        </div>
      ) : null}

      {children}
    </Card>
  );
}
