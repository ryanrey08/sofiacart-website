import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Pagination({
  page,
  lastPage,
  onPageChange,
  disabled,
}: {
  page: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}) {
  if (lastPage <= 1) return null;

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-3">
      <Button variant="outline" size="sm" className="rounded-full" disabled={disabled || page <= 1} onClick={() => onPageChange(page - 1)}>
        <ChevronLeft className="h-4 w-4" /> Previous
      </Button>
      <span className="text-xs font-semibold text-slate-500">
        Page {page} of {lastPage}
      </span>
      <Button variant="outline" size="sm" className="rounded-full" disabled={disabled || page >= lastPage} onClick={() => onPageChange(page + 1)}>
        Next <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
