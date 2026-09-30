import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import type { ApiResourceCollection, CatalogCategory, CatalogProduct } from "@/types/api";

export type CatalogSort = "newest" | "price_asc" | "price_desc" | "name";

export interface CatalogFilters {
  search: string;
  categoryId: number | null;
  sort: CatalogSort;
  page: number;
  perPage: number;
}

export async function fetchCatalogCategories(): Promise<CatalogCategory[]> {
  const response = await apiClient.get<ApiResourceCollection<CatalogCategory>>(
    apiEndpoints.catalog.categories
  );

  return response.data.data;
}

export async function fetchCatalogProducts(
  filters: CatalogFilters
): Promise<ApiResourceCollection<CatalogProduct>> {
  const search = filters.search.trim();
  const endpoint = search ? apiEndpoints.catalog.search : apiEndpoints.catalog.products;
  const response = await apiClient.get<ApiResourceCollection<CatalogProduct>>(endpoint, {
    params: {
      ...(search ? { search } : {}),
      ...(filters.categoryId ? { category_id: filters.categoryId } : {}),
      sort: filters.sort,
      page: filters.page,
      per_page: filters.perPage,
    },
  });

  return response.data;
}

export function useCatalogCategories() {
  return useQuery({
    queryKey: ["catalog", "categories"],
    queryFn: fetchCatalogCategories,
  });
}

export function useCatalogProducts(filters: CatalogFilters) {
  return useQuery({
    queryKey: ["catalog", "products", filters],
    queryFn: () => fetchCatalogProducts(filters),
  });
}
