"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { catalogService } from "@/lib/api/services/catalog";
import type { ListParams } from "@/types/api";
import type { Category, ProductFilters } from "@/types/domain";

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.catalog.categories,
    queryFn: catalogService.categories,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Categories belong to individual stores, so the same name can appear once per store. The
 * storefront navigation shows each top-level name once and links to its first category id.
 */
export function uniqueTopCategories(categories: Category[] = []) {
  const seen = new Map<string, Category>();

  for (const category of categories) {
    if (category.parentId) continue;
    const key = category.name.trim().toLowerCase();
    if (!seen.has(key)) seen.set(key, category);
  }

  return [...seen.values()];
}

export function useProducts(filters: ProductFilters, enabled = true) {
  return useQuery({
    queryKey: queryKeys.catalog.products(filters),
    queryFn: () => catalogService.products(filters),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function usePopularProducts(limit = 12) {
  return useQuery({
    queryKey: queryKeys.catalog.popular(limit),
    queryFn: () => catalogService.popular(limit),
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: queryKeys.catalog.product(slug),
    queryFn: () => catalogService.product(slug),
    retry: (count, error) => (error as { status?: number }).status !== 404 && count < 1,
  });
}

export function useProductReviews(slug: string, params: ListParams) {
  return useQuery({
    queryKey: queryKeys.catalog.reviews(slug, params),
    queryFn: () => catalogService.reviews(slug, params),
    placeholderData: keepPreviousData,
  });
}
