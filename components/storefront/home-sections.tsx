"use client";

import { ChevronRight, LayoutGrid } from "lucide-react";
import Link from "next/link";

import { categoryHref } from "@/components/layout/category-bar";
import { CategoryVisual, categoryIcon } from "@/components/storefront/category-icon";
import { ProductCard } from "@/components/storefront/product-card";
import { EmptyState, ErrorState, ProductGridSkeleton } from "@/components/storefront/states";
import { Skeleton } from "@/components/ui/skeleton";
import { uniqueTopCategories, useCategories, usePopularProducts, useProducts } from "@/hooks/use-catalog";
import { useHydrated } from "@/hooks/use-session";

export function CategorySidebar() {
  const hydrated = useHydrated();
  const { data, isPending: loading, isError } = useCategories();
  // Server HTML always shows the skeleton; keep the first client render identical.
  const isPending = !hydrated || loading;
  const categories = uniqueTopCategories(data).slice(0, 9);

  return (
    <aside className="flex flex-col rounded-2xl border border-slate-100 bg-white p-3 shadow-sm lg:col-span-3">
      <Link href="/categories" className="mb-2 flex items-center justify-between rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white">
        <span className="flex items-center gap-2">
          <LayoutGrid className="h-4 w-4" /> All Categories
        </span>
        <ChevronRight className="h-4 w-4" />
      </Link>
      {isPending ? (
        <div className="space-y-2 p-2">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-6 w-full" />
          ))}
        </div>
      ) : isError ? (
        <p className="p-3 text-xs text-slate-500">Categories are unavailable right now.</p>
      ) : (
        <ul className="flex-1 space-y-1">
          {categories.map((category) => {
            const Icon = categoryIcon(category.name);
            return (
              <li key={category.id}>
                <Link
                  href={categoryHref(category)}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-brand/5 hover:text-brand"
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 text-slate-500" />
                    {category.name}
                  </span>
                  <ChevronRight className="h-3 w-3 text-slate-400" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      <Link
        href="/categories"
        className="mt-2 flex items-center justify-between rounded-lg border-t border-slate-100 px-3 py-2 pt-3 text-xs font-semibold text-slate-600 hover:text-brand"
      >
        More Categories <ChevronRight className="h-3 w-3 text-slate-400" />
      </Link>
    </aside>
  );
}

export function FeaturedCategories() {
  const hydrated = useHydrated();
  const { data, isPending: loading, isError, error, refetch } = useCategories();
  const isPending = !hydrated || loading;
  const categories = uniqueTopCategories(data).slice(0, 9);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-ink">Featured Categories</h2>
        <Link href="/categories" className="flex items-center gap-1 text-xs font-semibold text-brand hover:underline">
          View All Categories <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      {isPending ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
          {Array.from({ length: 9 }, (_, index) => (
            <Skeleton key={index} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState error={error} onRetry={() => void refetch()} title="Categories unavailable" />
      ) : categories.length === 0 ? (
        <EmptyState title="No categories yet" description="Stores haven't published any categories." />
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={categoryHref(category)}
              className="group flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <CategoryVisual category={category} className="mb-2 h-14 w-14 group-hover:bg-brand/10" />
              <span className="text-center text-[11px] font-semibold leading-tight text-slate-700">{category.name}</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

/**
 * Best sellers from `GET /products/popular` (ranked by units sold). When nothing has sold yet the
 * newest products are shown instead.
 */
export function PopularProducts({ title, limit = 12 }: { title?: string; limit?: number }) {
  const popular = usePopularProducts(limit);
  const showNewest = popular.isSuccess && popular.data.length === 0;
  const newest = useProducts({ sort: "newest", per_page: limit }, showNewest);
  const query = showNewest ? newest : popular;
  const products = showNewest ? (newest.data?.data ?? []) : (popular.data ?? []);
  const hydrated = useHydrated();

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-ink">{title ?? (showNewest ? "New Arrivals" : "Popular Products")}</h2>
        <Link href="/products" className="flex items-center gap-1 text-xs font-semibold text-brand hover:underline">
          View All Products <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      {!hydrated || query.isPending ? (
        <ProductGridSkeleton count={Math.min(limit, 6)} />
      ) : query.isError ? (
        <ErrorState error={query.error} onRetry={() => void query.refetch()} title="Products unavailable" />
      ) : products.length === 0 ? (
        <EmptyState title="No products yet" description="Check back soon — stores are adding products." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
