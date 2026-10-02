import { cn } from "@/lib/utils";
import type { OrderPaymentStatus, OrderStatus, PaymentStatus, RefundStatus, ReturnRequestStatus } from "@/types/domain";

type Tone = "green" | "blue" | "amber" | "slate" | "red" | "purple";

const tones: Record<Tone, string> = {
  green: "bg-emerald-50 text-emerald-700 border-emerald-100",
  blue: "bg-sky-50 text-sky-700 border-sky-100",
  amber: "bg-amber-50 text-amber-700 border-amber-100",
  slate: "bg-slate-100 text-slate-600 border-slate-200",
  red: "bg-red-50 text-red-600 border-red-100",
  purple: "bg-brand/10 text-brand border-brand/20",
};

export const orderStatusLabel: Record<OrderStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  completed: "Completed",
  cancelled: "Cancelled",
};

const orderTone: Record<OrderStatus, Tone> = {
  pending: "amber",
  processing: "blue",
  completed: "green",
  cancelled: "slate",
};

export const paymentStatusLabel: Record<OrderPaymentStatus | PaymentStatus, string> = {
  unpaid: "Unpaid",
  partially_paid: "Partially paid",
  paid: "Paid",
  partially_refunded: "Partially refunded",
  refunded: "Refunded",
  pending: "Pending",
  completed: "Paid",
  failed: "Failed",
  cancelled: "Cancelled",
  expired: "Expired",
};

const paymentTone: Record<OrderPaymentStatus | PaymentStatus, Tone> = {
  unpaid: "amber",
  partially_paid: "blue",
  paid: "green",
  partially_refunded: "purple",
  refunded: "purple",
  pending: "amber",
  completed: "green",
  failed: "red",
  cancelled: "slate",
  expired: "slate",
};

const requestTone: Record<ReturnRequestStatus | RefundStatus, Tone> = {
  pending: "amber",
  approved: "blue",
  rejected: "red",
  processing: "blue",
  processed: "green",
  failed: "red",
  cancelled: "slate",
};

function Pill({ tone, children, className }: { tone: Tone; children: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold", tones[tone], className)}>
      {children}
    </span>
  );
}

export function OrderStatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  return <Pill tone={orderTone[status] ?? "slate"} className={className}>{orderStatusLabel[status] ?? status}</Pill>;
}

export function PaymentStatusBadge({ status, className }: { status: OrderPaymentStatus | PaymentStatus; className?: string }) {
  return <Pill tone={paymentTone[status] ?? "slate"} className={className}>{paymentStatusLabel[status] ?? status}</Pill>;
}

export function RequestStatusBadge({ status }: { status: ReturnRequestStatus | RefundStatus }) {
  return <Pill tone={requestTone[status] ?? "slate"}>{status.charAt(0).toUpperCase() + status.slice(1)}</Pill>;
}
