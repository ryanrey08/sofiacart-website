import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const tones = {
  brand: "bg-brand/10 text-brand",
  success: "bg-emerald-50 text-emerald-600",
  warning: "bg-amber-50 text-amber-600",
  danger: "bg-red-50 text-red-500",
};

/** Card used by the email verification screens (same look as the password reset screens). */
export function VerificationShell({
  icon: Icon,
  tone = "brand",
  title,
  children,
  className,
}: {
  icon: LucideIcon;
  tone?: keyof typeof tones;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-md space-y-5 rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-sm md:p-8", className)}>
      <div className={cn("mx-auto flex h-14 w-14 items-center justify-center rounded-2xl", tones[tone])}>
        <Icon className="h-7 w-7" />
      </div>
      <h1 className="text-2xl font-black text-ink">{title}</h1>
      {children}
    </div>
  );
}
