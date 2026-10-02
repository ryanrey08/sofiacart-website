"use client";

import { BadgeCheck, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { loginHref } from "@/components/auth/require-auth";
import { Pagination } from "@/components/storefront/pagination";
import { RatingStars } from "@/components/storefront/rating-stars";
import { ReviewForm } from "@/components/storefront/review-form";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/storefront/states";
import { Button } from "@/components/ui/button";
import { useCreateReview } from "@/hooks/use-account";
import { useProductReviews } from "@/hooks/use-catalog";
import { useHydrated, useSession } from "@/hooks/use-session";
import { formatShortDate } from "@/lib/utils/format";
import { toast } from "@/stores/toast-store";

export function ProductReviews({ slug }: { slug: string }) {
  const [page, setPage] = useState(1);
  const [writing, setWriting] = useState(false);
  const { isAuthenticated } = useSession();
  const reviews = useProductReviews(slug, { page, per_page: 5 });
  const createReview = useCreateReview();
  const summary = reviews.data?.summary;
  const hydrated = useHydrated();

  return (
    <section id="reviews" className="space-y-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-black text-ink">Ratings & Reviews</h2>
        {isAuthenticated ? (
          !writing ? (
            <Button variant="outline" size="sm" className="rounded-full text-xs" onClick={() => setWriting(true)}>
              Write a Review
            </Button>
          ) : null
        ) : (
          <Link href={loginHref(`/products/${slug}#reviews`)} className="text-xs font-bold text-brand hover:underline">
            Sign in to write a review
          </Link>
        )}
      </div>

      {writing ? (
        <div className="rounded-2xl border border-brand/15 bg-brand/5 p-4">
          <p className="mb-3 text-[11px] text-slate-500">You can review products from your completed orders, once per product.</p>
          <ReviewForm
            submitLabel="Submit Review"
            pending={createReview.isPending}
            error={createReview.error}
            onCancel={() => {
              setWriting(false);
              createReview.reset();
            }}
            onSubmit={(payload) =>
              createReview.mutate(
                { slug, payload },
                {
                  onSuccess: () => {
                    setWriting(false);
                    setPage(1);
                    toast.success("Thanks for your review!");
                  },
                }
              )
            }
          />
        </div>
      ) : null}

      {!hydrated || reviews.isPending ? (
        <ListSkeleton rows={2} />
      ) : reviews.isError ? (
        <ErrorState error={reviews.error} onRetry={() => void reviews.refetch()} title="Reviews couldn't be loaded" />
      ) : !summary || summary.count === 0 ? (
        <EmptyState icon={MessageSquare} title="No reviews yet" description="Customers who bought this product can share their experience here." />
      ) : (
        <div className="grid gap-6 md:grid-cols-[220px_1fr]">
          <div className="space-y-3">
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-ink">{summary.average?.toFixed(1)}</span>
              <span className="pb-1 text-xs text-slate-500">out of 5</span>
            </div>
            <RatingStars rating={summary.average} className="[&_svg]:h-4 [&_svg]:w-4" />
            <p className="text-xs text-slate-500">{summary.count} review{summary.count === 1 ? "" : "s"}</p>
            <div className="space-y-1">
              {(["5", "4", "3", "2", "1"] as const).map((star) => {
                const count = summary.distribution[star] ?? 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="w-3">{star}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-amber-400" style={{ width: `${summary.count ? (count / summary.count) * 100 : 0}%` }} />
                    </div>
                    <span className="w-6 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="space-y-4">
            <ul className="divide-y divide-slate-100">
              {reviews.data.reviews.map((review) => (
                <li key={review.id} className="space-y-1.5 py-4 first:pt-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <RatingStars rating={review.rating} />
                    {review.title ? <span className="text-sm font-bold text-ink">{review.title}</span> : null}
                  </div>
                  {review.body ? <p className="text-sm text-slate-600">{review.body}</p> : null}
                  <p className="flex items-center gap-2 text-[11px] text-slate-400">
                    {review.author ?? "Customer"} · {formatShortDate(review.createdAt)}
                    {review.verifiedPurchase ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                        <BadgeCheck className="h-3.5 w-3.5" /> Verified purchase
                      </span>
                    ) : null}
                  </p>
                </li>
              ))}
            </ul>
            <Pagination page={page} lastPage={reviews.data.meta?.lastPage ?? 1} onPageChange={setPage} disabled={reviews.isFetching} />
          </div>
        </div>
      )}
    </section>
  );
}
