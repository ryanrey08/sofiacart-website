import { Check } from "lucide-react";
import { Fragment } from "react";

import { cn } from "@/lib/utils";

const steps = ["Cart", "Checkout", "Place Order", "Order Complete"] as const;

/** Progress bar shared by the cart → checkout → review → confirmation screens. */
export function CheckoutStepper({ current }: { current: (typeof steps)[number] }) {
  const currentIndex = steps.indexOf(current);

  return (
    <ol className="flex items-center gap-2 overflow-x-auto text-xs font-semibold" aria-label="Checkout progress">
      {steps.map((step, index) => {
        const done = index < currentIndex;
        const active = index === currentIndex;

        return (
          <Fragment key={step}>
            {index > 0 ? (
              <li aria-hidden className={cn("h-[2px] w-6 shrink-0 sm:w-10", index <= currentIndex ? "bg-brand/40" : "bg-slate-200")} />
            ) : null}
            <li className={cn("flex shrink-0 items-center gap-1.5", done || active ? "text-brand" : "text-slate-400")} aria-current={active ? "step" : undefined}>
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold",
                  done || active ? "bg-brand text-white" : "bg-slate-200 text-slate-600"
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </span>
              <span className={cn(active && "font-bold text-ink")}>{step}</span>
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}
