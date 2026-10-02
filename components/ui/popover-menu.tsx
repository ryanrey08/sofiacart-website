"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Minimal disclosure menu: closes on outside click, Escape, or when an item is chosen. */
export function PopoverMenu({
  trigger,
  children,
  align = "right",
  className,
  label,
}: {
  trigger: (open: boolean) => ReactNode;
  children: (close: () => void) => ReactNode;
  align?: "left" | "right";
  className?: string;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointer = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button type="button" aria-expanded={open} aria-haspopup="menu" aria-label={label} onClick={() => setOpen((value) => !value)}>
        {trigger(open)}
      </button>
      {open ? (
        <div
          role="menu"
          className={cn(
            "absolute top-full z-50 mt-2 min-w-56 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl",
            align === "right" ? "right-0" : "left-0",
            className
          )}
        >
          {children(() => setOpen(false))}
        </div>
      ) : null}
    </div>
  );
}
