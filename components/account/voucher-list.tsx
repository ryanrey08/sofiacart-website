"use client";

import { Copy, TicketPercent } from "lucide-react";

import { EmptyState, ErrorState, ListSkeleton } from "@/components/storefront/states";
import { Button } from "@/components/ui/button";
import { useVouchers } from "@/hooks/use-checkout";
import { useHydrated } from "@/hooks/use-session";
import { formatCurrency, formatShortDate } from "@/lib/utils/format";
import { toast } from "@/stores/toast-store";
import type { Voucher } from "@/types/domain";

function describe(voucher: Voucher) {
  if (voucher.type === "percentage") {
    return `${voucher.value}% off${voucher.maxDiscount ? ` (up to ${formatCurrency(voucher.maxDiscount, voucher.currency)})` : ""}`;
  }
  return `${formatCurrency(voucher.value, voucher.currency)} off`;
}

/** Public vouchers from `GET /vouchers`. Eligibility is checked by the backend when a code is applied. */
export function VoucherList() {
  const vouchers = useVouchers();
  const hydrated = useHydrated();

  if (!hydrated || vouchers.isPending) return <ListSkeleton rows={2} />;
  if (vouchers.isError) return <ErrorState error={vouchers.error} onRetry={() => void vouchers.refetch()} />;
  if (vouchers.data.length === 0) {
    return <EmptyState icon={TicketPercent} title="No promotions right now" description="Check back soon for new vouchers and deals." />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {vouchers.data.map((voucher) => (
        <div key={voucher.code} className="flex overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex w-24 shrink-0 flex-col items-center justify-center bg-cta p-3 text-center text-white">
            <TicketPercent className="h-6 w-6" />
            <span className="mt-1 text-[11px] font-black leading-tight">{voucher.type === "percentage" ? `${voucher.value}%` : formatCurrency(voucher.value, voucher.currency)}</span>
          </div>
          <div className="flex flex-1 flex-col justify-between gap-2 p-4">
            <div className="space-y-0.5">
              <p className="text-sm font-bold text-ink">{voucher.name ?? describe(voucher)}</p>
              <p className="text-[11px] text-slate-500">{voucher.description ?? describe(voucher)}</p>
              <p className="text-[10px] text-slate-400">
                {voucher.minSpend > 0 ? `Min. spend ${formatCurrency(voucher.minSpend, voucher.currency)} · ` : ""}
                {voucher.store ? `${voucher.store.name} only · ` : "All stores · "}
                {voucher.endsAt ? `Valid until ${formatShortDate(voucher.endsAt)}` : "No expiry"}
              </p>
            </div>
            <div className="flex items-center justify-between gap-2">
              <code className="rounded-lg border border-dashed border-brand/40 bg-brand/5 px-2 py-1 text-xs font-bold text-brand">{voucher.code}</code>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  void navigator.clipboard?.writeText(voucher.code);
                  toast.success("Code copied", "Apply it in your cart or at checkout.");
                }}
              >
                <Copy className="h-3.5 w-3.5" /> Copy
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
