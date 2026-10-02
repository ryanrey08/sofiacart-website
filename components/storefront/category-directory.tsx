"use client";

import Link from "next/link";

import { categoryHref } from "@/components/layout/category-bar";
import { CategoryVisual } from "@/components/storefront/category-icon";
import { EmptyState, ErrorState } from "@/components/storefront/states";
import { Skeleton } from "@/components/ui/skeleton";
import { uniqueTopCategories, useCategories } from "@/hooks/use-catalog";
import { useHydrated } from "@/hooks/use-session";
import { stripHtml } from "@/lib/utils/format";

export function CategoryDirectory() {
  const hydrated = useHydrated();
  const { data, isPending: loading, isError, error, refetch } = useCategories();
  const isPending = !hydrated || loading;
  const categories = uniqueTopCategories(data);
  const children = (data ?? []).filter((category) => category.parentId);

  if (isPending) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => <Skeleton key={index} className="h-32 rounded-2xl" />)}
      </div>
    );
  }

  if (isError) return <ErrorState error={error} onRetry={() => void refetch()} />;
  if (categories.length === 0) return <EmptyState title="No categories yet" />;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {categories.map((category) => {
        const subcategories = children.filter((child) => child.parentId === category.id);
        return (
          <div key={category.id} className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <Link href={categoryHref(category)} className="group flex items-center gap-3">
              <CategoryVisual category={category} className="h-12 w-12 shrink-0" />
              <span className="text-sm font-bold text-ink group-hover:text-brand">{category.name}</span>
            </Link>
            {category.description ? <p className="line-clamp-2 text-[11px] text-slate-500">{stripHtml(category.description)}</p> : null}
            {subcategories.length > 0 ? (
              <ul className="flex flex-wrap gap-1.5">
                {subcategories.map((child) => (
                  <li key={child.id}>
                    <Link href={categoryHref(child)} className="rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-600 hover:bg-brand/10 hover:text-brand">
                      {child.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
