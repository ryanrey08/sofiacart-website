import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function AccountPageHeader({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-brand/20 bg-brand/5 text-brand">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-ink">{title}</h1>
          {description ? <p className="text-xs text-slate-500">{description}</p> : null}
        </div>
      </div>
      {action}
    </div>
  );
}
