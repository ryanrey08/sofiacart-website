"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ApiClientError } from "@/lib/api/client";
import { useCatalogCategories, useCatalogProducts, type CatalogSort } from "@/lib/api/catalog";
import type { CatalogCategory } from "@/types/api";

const pageSize = 12;

function errorMessage(error: Error) {
  return error instanceof ApiClientError
    ? error.message
    : "The catalog could not be loaded. Check the API connection and try again.";
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en", { maximumFractionDigits: 2 }).format(amount);
}

function CategoryCard({
  category,
  selected,
  onSelect,
}: {
  category: CatalogCategory;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className="rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Card className={`h-full overflow-hidden transition-colors ${selected ? "ring-2 ring-primary" : "hover:bg-muted/40"}`}>
        <CardContent className="space-y-3 p-5">
          <Badge variant={selected ? "default" : "secondary"}>{category.name}</Badge>
          {category.description ? (
            <p className="line-clamp-2 text-sm text-muted-foreground">{category.description}</p>
          ) : null}
        </CardContent>
      </Card>
    </button>
  );
}

export function CatalogSections() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [sort, setSort] = useState<CatalogSort>("newest");
  const [page, setPage] = useState(1);
  const categoriesQuery = useCatalogCategories();
  const productsQuery = useCatalogProducts({
    search,
    categoryId,
    sort,
    page,
    perPage: pageSize,
  });

  const products = productsQuery.data?.data ?? [];
  const currentPage = productsQuery.data?.meta?.current_page ?? page;
  const lastPage = productsQuery.data?.meta?.last_page ?? currentPage;
  const hasPreviousPage = Boolean(productsQuery.data?.links?.prev) || currentPage > 1;
  const hasNextPage = Boolean(productsQuery.data?.links?.next) || currentPage < lastPage;

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  }

  function selectCategory(id: number | null) {
    setCategoryId(id);
    setPage(1);
  }

  return (
    <section id="catalog" className="space-y-10">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Shop by category</h2>
        <p className="text-sm text-muted-foreground">
          Categories and products are loaded from the public catalog API.
        </p>
        {categoriesQuery.isError ? (
          <p role="alert" className="text-sm text-destructive">
            Categories unavailable: {errorMessage(categoriesQuery.error)}
          </p>
        ) : null}
        {categoriesQuery.data?.length ? (
          <div className="grid gap-3 pt-3 sm:grid-cols-2 xl:grid-cols-4">
            {categoriesQuery.data.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                selected={categoryId === category.id}
                onSelect={() => selectCategory(categoryId === category.id ? null : category.id)}
              />
            ))}
          </div>
        ) : categoriesQuery.isSuccess ? (
          <p className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
            No categories are available.
          </p>
        ) : null}
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Browse products</h2>
          <p className="text-sm text-muted-foreground">
            Prices are shown as amounts; the catalog API does not specify a currency.
          </p>
        </div>

        <form className="grid gap-3 md:grid-cols-[minmax(12rem,1fr)_12rem_12rem_auto]" onSubmit={submitSearch}>
          <Input
            aria-label="Search products"
            placeholder="Search products"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <select
            aria-label="Filter by category"
            className="h-10 rounded-md border border-border bg-background px-3 text-sm"
            value={categoryId ?? ""}
            onChange={(event) => selectCategory(event.target.value ? Number(event.target.value) : null)}
          >
            <option value="">All categories</option>
            {(categoriesQuery.data ?? []).map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <select
            aria-label="Sort products"
            className="h-10 rounded-md border border-border bg-background px-3 text-sm"
            value={sort}
            onChange={(event) => {
              setSort(event.target.value as CatalogSort);
              setPage(1);
            }}
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
            <option value="name">Name</option>
          </select>
          <Button type="submit">Search</Button>
        </form>

        {productsQuery.isPending ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Loading products">
            {Array.from({ length: 4 }, (_, index) => (
              <Card key={index} className="h-64 animate-pulse bg-muted/50" />
            ))}
          </div>
        ) : productsQuery.isError ? (
          <div role="alert" className="space-y-3 rounded-xl border border-destructive/30 p-6">
            <p className="text-sm text-destructive">{errorMessage(productsQuery.error)}</p>
            <Button variant="outline" onClick={() => void productsQuery.refetch()}>Retry</Button>
          </div>
        ) : products.length === 0 ? (
          <p className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
            No products match these filters.
          </p>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  {product.imageUrl ? (
                    <Image
                      alt={product.name}
                      className="h-40 w-full object-cover"
                      height={160}
                      src={product.imageUrl}
                      unoptimized
                      width={320}
                    />
                  ) : (
                    <div className="flex h-40 items-center justify-center bg-muted text-3xl font-semibold text-primary">
                      {product.name.charAt(0)}
                    </div>
                  )}
                  <CardContent className="space-y-3 p-5">
                    {product.category ? (
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {product.category.name}
                      </p>
                    ) : null}
                    <div className="space-y-1">
                      <h3 className="font-semibold leading-tight">{product.name}</h3>
                      {product.description ? (
                        <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
                      ) : null}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold">{formatAmount(product.price)}</span>
                      <Badge variant={product.inStock ? "secondary" : "outline"}>
                        {product.inStock ? "In stock" : "Out of stock"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                {productsQuery.data?.meta?.total !== undefined
                  ? `${productsQuery.data.meta.total} products`
                  : `Page ${currentPage}`}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  disabled={!hasPreviousPage || productsQuery.isFetching}
                  onClick={() => setPage(Math.max(1, currentPage - 1))}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage}{productsQuery.data?.meta?.last_page ? ` of ${lastPage}` : ""}
                </span>
                <Button
                  variant="outline"
                  disabled={!hasNextPage || productsQuery.isFetching}
                  onClick={() => setPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
