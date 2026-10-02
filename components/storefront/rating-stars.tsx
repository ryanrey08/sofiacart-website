import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export function RatingStars({ rating, className }: { rating: number | null | undefined; className?: string }) {
  const value = rating ?? 0;

  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={rating ? `Rated ${rating} out of 5` : "No ratings yet"}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={cn(
            "h-3 w-3",
            index < Math.round(value) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"
          )}
        />
      ))}
    </span>
  );
}
