"use client";

import { CheckCircle2, Clock, ExternalLink, RefreshCw } from "lucide-react";
import { useState, type FormEvent } from "react";

import { PaymentStatusBadge } from "@/components/storefront/status-badge";
import { InlineError } from "@/components/storefront/states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePaymentMethods } from "@/hooks/use-checkout";
import { useInitiateHitPay, useRetryPayment, useSubmitPaymentReference } from "@/hooks/use-orders";
import { errorMessage } from "@/lib/api/client";
import { formatCurrency, formatDateTime } from "@/lib/utils/format";
import { toast } from "@/stores/toast-store";
import type { Order, Payment, PaymentMethodCode } from "@/types/domain";

const cashMethods = new Set(["cod", "cash"]);

/** Send the browser to HitPay's hosted checkout for an order, choosing/keeping a method. */
function usePayWithHitPay() {
  const initiate = useInitiateHitPay();

  const pay = (orderNumber: string, paymentMethod?: PaymentMethodCode) =>
    initiate.mutate(
      { orderNumber, paymentMethod },
      {
        onSuccess: ({ redirectUrl }) => {
          if (redirectUrl) window.location.assign(redirectUrl);
          else toast.error("Couldn't start payment", "Please try again.");
        },
        onError: (error) => toast.error("Couldn't start payment", errorMessage(error)),
      }
    );

  return { pay, pending: initiate.isPending };
}

function ReferenceForm({ payment, orderNumber }: { payment: Payment; orderNumber: string }) {
  const [value, setValue] = useState(payment.gatewayReference ?? "");
  const submit = useSubmitPaymentReference();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit.mutate(
      { reference: payment.reference, gatewayReference: value.trim(), orderNumber },
      { onSuccess: () => toast.success("Reference submitted", "The store will verify your payment.") }
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <label htmlFor={`ref-${payment.reference}`} className="text-[11px] font-semibold text-slate-600">
        {payment.gatewayReference ? "Update your" : "Enter your"} {payment.methodName} reference number
      </label>
      <div className="flex gap-2">
        <Input
          id={`ref-${payment.reference}`}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          maxLength={100}
          pattern="[A-Za-z0-9\-_./ ]+"
          title="Letters, numbers, spaces and - _ . / only"
          placeholder="e.g. 1234 567 890"
          className="h-9 rounded-xl text-xs"
          required
        />
        <Button type="submit" disabled={submit.isPending || !value.trim()} className="h-9 rounded-xl bg-brand px-4 text-xs font-bold">
          {submit.isPending ? "…" : "Submit"}
        </Button>
      </div>
      <InlineError error={submit.error} />
    </form>
  );
}

function RetryPayment({ order }: { order: Order }) {
  const methods = usePaymentMethods();
  const retry = useRetryPayment();
  const { pay, pending: hitpayPending } = usePayWithHitPay();
  const [method, setMethod] = useState<PaymentMethodCode | "">(order.paymentMethod ?? "");

  const selected = methods.data?.find((option) => option.code === method);

  function onPayAgain() {
    if (!method) return;
    // Online methods go back through HitPay; store-verified methods create a new pending payment.
    if (selected?.online) {
      pay(order.orderNumber, method);
    } else {
      retry.mutate({ orderNumber: order.orderNumber, paymentMethod: method }, { onSuccess: () => toast.success("New payment created") });
    }
  }

  return (
    <div className="space-y-2 rounded-xl border border-amber-100 bg-amber-50/60 p-3">
      <p className="text-[11px] font-semibold text-amber-800">
        Your last payment didn&apos;t go through. Choose a payment method to pay the remaining {formatCurrency(order.balance?.outstanding, order.currency)}.
      </p>
      <div className="flex gap-2">
        <select
          value={method}
          onChange={(event) => setMethod(event.target.value as PaymentMethodCode)}
          aria-label="Payment method"
          className="h-9 flex-1 rounded-xl border border-slate-200 bg-white px-2 text-xs"
        >
          <option value="" disabled>Select a method</option>
          {methods.data?.map((option) => <option key={option.code} value={option.code}>{option.name}</option>)}
        </select>
        <Button
          disabled={!method || retry.isPending || hitpayPending}
          onClick={onPayAgain}
          className="h-9 rounded-xl bg-brand text-xs font-bold"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Pay again
        </Button>
      </div>
      <InlineError error={retry.error} />
    </div>
  );
}

/** Payment status, HitPay checkout, reference submission and retry for one order (needs the detailed order). */
export function PaymentPanel({ order }: { order: Order }) {
  const payments = order.payments ?? [];
  const current = payments[0];
  const { pay, pending: hitpayPending } = usePayWithHitPay();
  const outstanding = order.balance?.outstanding ?? 0;
  const hasPending = payments.some((payment) => payment.status === "pending" && !payment.isExpired);
  const canRetry = order.status !== "cancelled" && outstanding > 0 && !hasPending && payments.length > 0;

  if (!current) return null;

  const isPendingLive = current.status === "pending" && !current.isExpired;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div>
          <p className="font-bold text-ink">{current.methodName ?? "Payment"}</p>
          <p className="text-[10px] text-slate-400">Ref. {current.reference}</p>
        </div>
        <div className="text-right">
          <PaymentStatusBadge status={current.isExpired && current.status === "pending" ? "expired" : current.status} />
          <p className="mt-0.5 text-[11px] font-bold text-ink">{formatCurrency(current.amount, current.currency)}</p>
        </div>
      </div>

      {current.status === "completed" ? (
        <p className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
          <CheckCircle2 className="h-4 w-4" /> Paid {current.paidAt ? `on ${formatDateTime(current.paidAt)}` : ""}
        </p>
      ) : isPendingLive && current.isHitPay ? (
        <div className="space-y-2">
          <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Clock className="h-4 w-4" /> Complete your secure {current.methodName} payment with HitPay.
          </p>
          {order.status !== "cancelled" ? (
            <Button
              onClick={() => pay(order.orderNumber)}
              disabled={hitpayPending}
              className="h-9 w-full rounded-xl bg-brand text-xs font-bold"
            >
              <ExternalLink className="h-3.5 w-3.5" /> {hitpayPending ? "Redirecting…" : `Pay now with ${current.methodName}`}
            </Button>
          ) : null}
        </div>
      ) : isPendingLive ? (
        cashMethods.has(current.method ?? "") ? (
          <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Clock className="h-4 w-4" /> Pay in cash when your order arrives.
          </p>
        ) : (
          <div className="space-y-2">
            <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <Clock className="h-4 w-4" />
              Awaiting confirmation by the store{current.expiresAt ? ` · pay before ${formatDateTime(current.expiresAt)}` : ""}.
            </p>
            {order.status !== "cancelled" ? <ReferenceForm payment={current} orderNumber={order.orderNumber} /> : null}
          </div>
        )
      ) : current.failureReason ? (
        <p className="text-[11px] text-slate-500">{current.failureReason}</p>
      ) : null}

      {canRetry ? <RetryPayment order={order} /> : null}
    </div>
  );
}
