import { Ban, Check, ClipboardCheck, Package, PackageCheck } from "lucide-react";
import { Fragment } from "react";

import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/utils/format";
import type { Order } from "@/types/domain";

/**
 * Order progress from the backend's order status. The shared schema has no shipment tracking, so
 * the steps are the statuses that exist: pending → processing → completed (or cancelled).
 */
const steps = [
  { key: "pending", label: "Order Placed", icon: ClipboardCheck },
  { key: "processing", label: "Processing", icon: Package },
  { key: "completed", label: "Completed", icon: PackageCheck },
] as const;

export function OrderTracker({ order, compact = false }: { order: Pick<Order, "status" | "placedAt" | "cancelledAt">; compact?: boolean }) {
  if (order.status === "cancelled") {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-xs">
        <Ban className="h-5 w-5 text-slate-400" />
        <div>
          <p className="font-bold text-ink">Order cancelled</p>
          {order.cancelledAt ? <p className="text-[11px] text-slate-500">{formatDateTime(order.cancelledAt)}</p> : null}
        </div>
      </div>
    );
  }

  const current = steps.findIndex((step) => step.key === order.status);

  return (
    <ol className="flex items-start" aria-label="Order progress">
      {steps.map((step, index) => {
        const reached = index <= current;
        const Icon = index < current ? Check : step.icon;
        return (
          <Fragment key={step.key}>
            {index > 0 ? <li aria-hidden className={cn("mt-4 h-0.5 flex-1", reached ? "bg-brand" : "bg-slate-200")} /> : null}
            <li className="flex w-20 flex-col items-center gap-1 text-center" aria-current={index === current ? "step" : undefined}>
              <span className={cn("flex h-8 w-8 items-center justify-center rounded-full", reached ? "bg-brand text-white" : "border-2 border-slate-200 text-slate-300")}>
                <Icon className="h-4 w-4" />
              </span>
              <span className={cn("text-[10px] font-bold leading-tight", reached ? "text-ink" : "text-slate-400")}>{step.label}</span>
              {!compact && index === 0 && order.placedAt ? <span className="text-[9px] text-slate-400">{formatDateTime(order.placedAt)}</span> : null}
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}
