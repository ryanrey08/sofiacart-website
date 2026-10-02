"use client";

import { Star } from "lucide-react";
import { useState, type FormEvent } from "react";

import { InlineError } from "@/components/storefront/states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { ReviewInput } from "@/types/domain";

export function ReviewForm({
  initial,
  submitLabel,
  pending,
  error,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<ReviewInput>;
  submitLabel: string;
  pending: boolean;
  error: unknown;
  onSubmit: (input: ReviewInput) => void;
  onCancel?: () => void;
}) {
  const [rating, setRating] = useState(initial?.rating ?? 0);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [touched, setTouched] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);
    if (rating < 1) return;
    onSubmit({ rating, title: title.trim() || null, body: body.trim() || null });
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="space-y-1">
        <p className="text-xs font-bold text-ink">Your rating <span className="text-red-500">*</span></p>
        <div className="flex gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={`${value} star${value > 1 ? "s" : ""}`}
              onClick={() => setRating(value)}
            >
              <Star className={cn("h-6 w-6", value <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300")} />
            </button>
          ))}
        </div>
        {touched && rating < 1 ? <p className="text-[11px] text-red-600">Choose a rating from 1 to 5 stars.</p> : null}
      </div>
      <Input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={150} placeholder="Review title (optional)" aria-label="Review title" className="rounded-xl text-sm" />
      <Textarea value={body} onChange={(event) => setBody(event.target.value)} maxLength={5000} placeholder="What did you like or dislike? (optional)" aria-label="Review" className="rounded-xl text-sm" />
      <InlineError error={error} />
      <div className="flex gap-2">
        <Button type="submit" disabled={pending} className="rounded-full bg-brand text-xs font-bold">
          {pending ? "Saving…" : submitLabel}
        </Button>
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel} className="rounded-full text-xs">Cancel</Button>
        ) : null}
      </div>
    </form>
  );
}
