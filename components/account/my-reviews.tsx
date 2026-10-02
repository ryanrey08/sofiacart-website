"use client";

import { Pencil, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { AccountPageHeader } from "@/components/account/account-page-header";
import { Pagination } from "@/components/storefront/pagination";
import { RatingStars } from "@/components/storefront/rating-stars";
import { ReviewForm } from "@/components/storefront/review-form";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/storefront/states";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDeleteReview, useMyReviews, useUpdateReview } from "@/hooks/use-account";
import { errorMessage } from "@/lib/api/client";
import { formatShortDate } from "@/lib/utils/format";
import { toast } from "@/stores/toast-store";

export function MyReviews() {
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const reviews = useMyReviews({ page, per_page: 10 });
  const update = useUpdateReview();
  const remove = useDeleteReview();

  return (
    <>
      <AccountPageHeader icon={Star} title="My Reviews" description="Reviews you've written for products you bought." />
      {reviews.isPending ? (
        <ListSkeleton rows={2} />
      ) : reviews.isError ? (
        <ErrorState error={reviews.error} onRetry={() => void reviews.refetch()} />
      ) : reviews.data.items.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No reviews yet"
          description="After an order is completed, open the product page to rate it."
          action={<Button asChild variant="outline" className="rounded-full"><Link href="/account/orders?status=completed">Completed orders</Link></Button>}
        />
      ) : (
        <>
          <ul className="space-y-3">
            {reviews.data.items.map((review) => (
              <Card key={review.id} className="space-y-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    {review.product ? (
                      <Link href={`/products/${review.product.slug}`} className="text-sm font-bold text-ink hover:text-brand">{review.product.name}</Link>
                    ) : null}
                    <p className="text-[11px] text-slate-400">{formatShortDate(review.updatedAt ?? review.createdAt)}</p>
                  </div>
                  {editingId !== review.id ? (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setEditingId(review.id)}><Pencil className="h-3.5 w-3.5" /> Edit</Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs text-red-600 hover:bg-red-50"
                        disabled={remove.isPending}
                        onClick={() => {
                          if (!window.confirm("Delete this review?")) return;
                          remove.mutate(review.id, {
                            onSuccess: () => toast.success("Review deleted"),
                            onError: (error) => toast.error("Couldn't delete review", errorMessage(error)),
                          });
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </Button>
                    </div>
                  ) : null}
                </div>
                {editingId === review.id ? (
                  <ReviewForm
                    initial={review}
                    submitLabel="Save Review"
                    pending={update.isPending}
                    error={update.error}
                    onCancel={() => {
                      setEditingId(null);
                      update.reset();
                    }}
                    onSubmit={(payload) =>
                      update.mutate({ id: review.id, payload }, {
                        onSuccess: () => {
                          setEditingId(null);
                          toast.success("Review updated");
                        },
                      })
                    }
                  />
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <RatingStars rating={review.rating} />
                      {review.title ? <span className="text-xs font-bold text-ink">{review.title}</span> : null}
                    </div>
                    {review.body ? <p className="text-xs text-slate-600">{review.body}</p> : null}
                  </div>
                )}
              </Card>
            ))}
          </ul>
          <Pagination page={page} lastPage={reviews.data.meta?.lastPage ?? 1} onPageChange={setPage} disabled={reviews.isFetching} />
        </>
      )}
    </>
  );
}
