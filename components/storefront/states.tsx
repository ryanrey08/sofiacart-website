import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Inbox } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { errorMessage } from "@/lib/api/client";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center", className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
        <Icon className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-bold text-ink">{title}</p>
        {description ? <p className="mx-auto max-w-md text-xs text-slate-500">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function ErrorState({
  error,
  onRetry,
  title = "We couldn't load this",
  className,
}: {
  error: unknown;
  onRetry?: () => void;
  title?: string;
  className?: string;
}) {
  return (
    <div role="alert" className={cn("flex flex-col items-center gap-3 rounded-2xl border border-red-100 bg-red-50/60 px-6 py-10 text-center", className)}>
      <AlertTriangle className="h-6 w-6 text-red-500" />
      <div className="space-y-1">
        <p className="text-sm font-bold text-ink">{title}</p>
        <p className="text-xs text-slate-600">{errorMessage(error)}</p>
      </div>
      {onRetry ? (
        <Button variant="outline" size="sm" className="rounded-full" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}

export function InlineError({ error, className }: { error: unknown; className?: string }) {
  if (!error) return null;
  return (
    <p role="alert" className={cn("rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-600", className)}>
      {errorMessage(error)}
    </p>
  );
}

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6", className)} aria-label="Loading products">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="space-y-2 rounded-2xl border border-slate-100 bg-white p-3">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-8 w-full rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-label="Loading">
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} className="h-24 w-full rounded-2xl" />
      ))}
    </div>
  );
}
