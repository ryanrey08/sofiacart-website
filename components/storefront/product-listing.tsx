"use client";

import { SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

import { categoryHref } from "@/components/layout/category-bar";
import { Pagination } from "@/components/storefront/pagination";
import { ProductCard } from "@/components/storefront/product-card";
import { EmptyState, ErrorState, ProductGridSkeleton } from "@/components/storefront/states";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uniqueTopCategories, useCategories, useProducts } from "@/hooks/use-catalog";
import { useHydrated } from "@/hooks/use-session";
import { cn } from "@/lib/utils";
import type { ProductFilters, ProductSort } from "@/types/domain";

const sortOptions: { value: ProductSort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name", label: "Name (A–Z)" },
];

const PER_PAGE = 24;

function positiveNumber(value: string | null) {
  if (value === null || value.trim() === "") return undefined;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : undefined;
}

export function ProductListing() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const search = searchParams.get("search")?.trim() || undefined;
  const categoryId = positiveNumber(searchParams.get("category_id"));
  const categoryName = searchParams.get("category");
  const minPrice = positiveNumber(searchParams.get("min_price"));
  const maxPrice = positiveNumber(searchParams.get("max_price"));
  const inStock = searchParams.get("in_stock") === "1";
  const sortParam = searchParams.get("sort") as ProductSort | null;
  const sort = sortOptions.some((option) => option.value === sortParam) ? sortParam! : "newest";
  const page = Math.max(1, Math.floor(positiveNumber(searchParams.get("page")) ?? 1));

  const filters: ProductFilters = {
    search,
    category_id: categoryId,
    min_price: minPrice,
    max_price: maxPrice !== undefined && minPrice !== undefined && maxPrice < minPrice ? undefined : maxPrice,
    in_stock: inStock || undefined,
    sort,
    page,
    per_page: PER_PAGE,
  };

  const hydrated = useHydrated();
  const products = useProducts(filters);
  const categories = useCategories();
  // Cached query data must not differ from the server-rendered HTML during hydration.
  const topCategories = hydrated ? uniqueTopCategories(categories.data) : [];
  const loading = !hydrated || products.isPending;

  function update(changes: Record<string, string | null>, resetPage = true) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
    }
    if (resetPage) next.delete("page");
    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function applyPrice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    update({ min_price: String(form.get("min_price") ?? ""), max_price: String(form.get("max_price") ?? "") });
  }

  const total = products.data?.meta?.total;
  const lastPage = products.data?.meta?.last_page ?? 1;
  const items = products.data?.data ?? [];
  const title = search ? `Results for “${search}”` : categoryName ?? "All Products";
  const hasFilters = Boolean(search || categoryId || minPrice !== undefined || maxPrice !== undefined || inStock);

  const filterPanel = (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Categories</h3>
        <ul className="space-y-0.5">
          <li>
            <button
              type="button"
              onClick={() => update({ category_id: null, category: null })}
              className={cn("w-full rounded-lg px-3 py-1.5 text-left text-xs font-semibold", !categoryId ? "bg-brand/10 text-brand" : "text-slate-600 hover:bg-slate-50")}
            >
              All categories
            </button>
          </li>
          {topCategories.map((category) => (
            <li key={category.id}>
              <Link
                href={categoryHref(category)}
                className={cn(
                  "block rounded-lg px-3 py-1.5 text-xs font-semibold",
                  categoryId === category.id ? "bg-brand/10 text-brand" : "text-slate-600 hover:bg-slate-50"
                )}
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={applyPrice} className="space-y-2" key={`${minPrice}-${maxPrice}`}>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Price (₱)</h3>
        <div className="flex items-center gap-2">
          <Input name="min_price" type="number" min={0} step="0.01" defaultValue={minPrice} placeholder="Min" aria-label="Minimum price" className="h-9 rounded-xl text-xs" />
          <span className="text-slate-300">–</span>
          <Input name="max_price" type="number" min={0} step="0.01" defaultValue={maxPrice} placeholder="Max" aria-label="Maximum price" className="h-9 rounded-xl text-xs" />
        </div>
        {minPrice !== undefined && maxPrice !== undefined && maxPrice < minPrice ? (
          <p className="text-[11px] text-red-600">Maximum price must be at least the minimum.</p>
        ) : null}
        <Button type="submit" size="sm" variant="outline" className="w-full rounded-xl text-xs">Apply price</Button>
      </form>

      <div className="flex items-center gap-2">
        <Checkbox id="in-stock" checked={inStock} onCheckedChange={(checked) => update({ in_stock: checked ? "1" : null })} />
        <Label htmlFor="in-stock" className="cursor-pointer text-xs font-semibold text-slate-700">In stock only</Label>
      </div>

      {hasFilters ? (
        <Button variant="ghost" size="sm" className="w-full text-xs text-slate-500" onClick={() => router.push(pathname)}>
          <X className="h-3.5 w-3.5" /> Clear all filters
        </Button>
      ) : null}
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
      <aside className="hidden h-fit rounded-2xl border border-slate-100 bg-white p-4 shadow-sm lg:block">{filterPanel}</aside>

      <div className="min-w-0 space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-black text-ink">{title}</h1>
            <p className="text-xs text-slate-500">
              {hydrated && total !== undefined ? `${total.toLocaleString()} product${total === 1 ? "" : "s"}` : "Loading products…"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-full text-xs lg:hidden" onClick={() => setFiltersOpen((open) => !open)} aria-expanded={filtersOpen}>
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
            </Button>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              Sort by
              <select
                value={sort}
                onChange={(event) => update({ sort: event.target.value === "newest" ? null : event.target.value })}
                className="h-9 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {filtersOpen ? <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm lg:hidden">{filterPanel}</div> : null}

        {loading ? (
          <ProductGridSkeleton count={8} className="lg:grid-cols-4" />
        ) : products.isError ? (
          <ErrorState error={products.error} onRetry={() => void products.refetch()} title="Products couldn't be loaded" />
        ) : items.length === 0 ? (
          <EmptyState
            title="No products found"
            description={hasFilters ? "Try a different search term or remove some filters." : "No products are available yet."}
            action={hasFilters ? <Button variant="outline" size="sm" className="rounded-full" onClick={() => router.push(pathname)}>Clear filters</Button> : undefined}
          />
        ) : (
          <div className={cn("grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4", products.isFetching && "opacity-60 transition-opacity")}>
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <Pagination
          page={page}
          lastPage={lastPage}
          disabled={products.isFetching}
          onPageChange={(nextPage) => {
            update({ page: nextPage > 1 ? String(nextPage) : null }, false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>
    </div>
  );
}
