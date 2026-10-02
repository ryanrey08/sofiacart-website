"use client";

import { ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { AccountPageHeader } from "@/components/account/account-page-header";
import { ProductImage } from "@/components/storefront/product-image";
import { QuantityStepper } from "@/components/storefront/quantity-stepper";
import { EmptyState, ErrorState, InlineError, ListSkeleton } from "@/components/storefront/states";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useRequestReturn, useReturnable } from "@/hooks/use-orders";
import { formatCurrency } from "@/lib/utils/format";
import { toast } from "@/stores/toast-store";

const reasons = ["Item is damaged or defective", "Wrong item received", "Item not as described", "Missing parts or accessories", "Changed my mind", "Other"];

export function ReturnRequestForm({ orderNumber }: { orderNumber: string }) {
  const router = useRouter();
  const returnable = useReturnable(orderNumber);
  const request = useRequestReturn();
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const back = (
    <Link href={`/account/orders/${encodeURIComponent(orderNumber)}`} className="flex items-center gap-1 text-xs font-bold text-brand hover:underline">
      <ArrowLeft className="h-3.5 w-3.5" /> Back to order
    </Link>
  );
  const header = <AccountPageHeader icon={RotateCcw} title="Request a Return" description={`Order #${orderNumber}`} action={back} />;

  if (returnable.isPending) return <>{header}<ListSkeleton rows={3} /></>;
  if (returnable.isError) return <>{header}<ErrorState error={returnable.error} onRetry={() => void returnable.refetch()} /></>;

  const items = returnable.data.items.filter((item) => item.returnableQuantity > 0);

  if (!returnable.data.eligible || items.length === 0) {
    return (
      <>
        {header}
        <EmptyState
          icon={RotateCcw}
          title="This order can't be returned"
          description={`Returns are available for completed, paid orders within ${returnable.data.returnWindowDays} days, for items that haven't already been returned.`}
        />
      </>
    );
  }

  const selected = items.filter((item) => (quantities[item.id] ?? 0) > 0);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (selected.length === 0 || !reason || !notes.trim()) return;

    request.mutate(
      {
        orderNumber,
        payload: {
          reason,
          notes: notes.trim(),
          items: selected.map((item) => ({ orderItemId: item.id, quantity: quantities[item.id] })),
        },
      },
      {
        onSuccess: () => {
          toast.success("Return request submitted", "The store will review your request.");
          router.push("/account/returns");
        },
      }
    );
  }

  return (
    <>
      {header}
      <form onSubmit={submit} className="space-y-5">
        <Card className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div>
            <h2 className="text-sm font-black text-ink">1. Choose items to return</h2>
            <p className="text-[11px] text-slate-500">Returns are accepted within {returnable.data.returnWindowDays} days. Refund amounts are calculated by the store.</p>
          </div>
          <ul className="divide-y divide-slate-100">
            {items.map((item) => {
              const quantity = quantities[item.id] ?? 0;
              return (
                <li key={item.id} className="flex flex-wrap items-center gap-3 py-3">
                  <Checkbox
                    checked={quantity > 0}
                    onCheckedChange={(checked) => setQuantities((current) => ({ ...current, [item.id]: checked ? 1 : 0 }))}
                    aria-label={`Return ${item.name}`}
                  />
                  <ProductImage src={item.imageUrl} alt={item.name} className="h-12 w-12 rounded-xl border border-slate-100 p-1" />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-xs font-bold text-ink">{item.name}</p>
                    <p className="text-[10px] text-slate-400">{formatCurrency(item.unitPrice)} · up to {item.returnableQuantity} returnable</p>
                  </div>
                  {quantity > 0 ? (
                    <QuantityStepper value={quantity} max={item.returnableQuantity} onChange={(value) => setQuantities((current) => ({ ...current, [item.id]: value }))} />
                  ) : null}
                </li>
              );
            })}
          </ul>
          {submitted && selected.length === 0 ? <p className="text-[11px] text-red-600">Select at least one item.</p> : null}
        </Card>

        <Card className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-black text-ink">2. Tell us why</h2>
          <div className="space-y-1">
            <label htmlFor="return-reason" className="text-xs font-semibold text-slate-700">Reason <span className="text-red-500">*</span></label>
            <select id="return-reason" value={reason} onChange={(event) => setReason(event.target.value)} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs">
              <option value="" disabled>Select a reason</option>
              {reasons.map((entry) => <option key={entry} value={entry}>{entry}</option>)}
            </select>
            {submitted && !reason ? <p className="text-[11px] text-red-600">Choose a reason.</p> : null}
          </div>
          <div className="space-y-1">
            <label htmlFor="return-notes" className="text-xs font-semibold text-slate-700">Details <span className="text-red-500">*</span></label>
            <Textarea id="return-notes" value={notes} onChange={(event) => setNotes(event.target.value)} maxLength={5000} placeholder="Describe the problem so the store can process your return." className="rounded-xl text-sm" />
            {submitted && !notes.trim() ? <p className="text-[11px] text-red-600">Add a few details about the return.</p> : null}
          </div>
          <InlineError error={request.error} />
          <Button type="submit" disabled={request.isPending} className="rounded-full bg-cta px-6 text-xs font-bold text-white">
            {request.isPending ? "Submitting…" : "Submit Return Request"}
          </Button>
        </Card>
      </form>
    </>
  );
}
