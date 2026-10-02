"use client";

import { CheckCircle2, Info, X, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { useToastStore } from "@/stores/toast-store";

const icons = { success: CheckCircle2, error: XCircle, info: Info };
const iconColors = { success: "text-emerald-500", error: "text-red-500", info: "text-brand" };

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-end gap-2 sm:left-auto sm:right-6 sm:w-96">
      {toasts.map((entry) => {
        const Icon = icons[entry.tone];
        return (
          <div
            key={entry.id}
            role={entry.tone === "error" ? "alert" : "status"}
            className="pointer-events-auto flex w-full items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-lg"
          >
            <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", iconColors[entry.tone])} />
            <div className="flex-1 space-y-0.5">
              <p className="text-sm font-bold text-ink">{entry.title}</p>
              {entry.description ? <p className="text-xs text-slate-500">{entry.description}</p> : null}
            </div>
            <button type="button" onClick={() => dismiss(entry.id)} className="text-slate-400 hover:text-slate-600" aria-label="Dismiss">
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
