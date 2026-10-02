import { apiClient, getData } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import type { ApiResourceCollection, ListParams, PaginationMeta } from "@/types/api";
import type { Category, Product, ProductFilters, Review, ReviewSummary, StockStatus, ProductVariant } from "@/types/domain";

export interface ProductReviewsPage {
  reviews: Review[];
  summary: ReviewSummary;
  meta?: PaginationMeta;
}

export interface ProductAvailability {
  productId: number;
  slug: string;
  inStock: boolean;
  stockStatus: StockStatus;
  availableQuantity: number;
  variants: ProductVariant[];
}

export const catalogService = {
  async products(filters: ProductFilters = {}) {
    const params = { ...filters, in_stock: filters.in_stock ? 1 : undefined };
    const { data } = await apiClient.get<ApiResourceCollection<Product>>(apiEndpoints.catalog.products, { params });
    return data;
  },
  async popular(limit = 12) {
    const { data } = await apiClient.get<ApiResourceCollection<Product>>(apiEndpoints.catalog.popular, {
      params: { limit },
    });
    return data.data;
  },
  async categories() {
    const { data } = await apiClient.get<ApiResourceCollection<Category>>(apiEndpoints.catalog.categories);
    return data.data;
  },
  async product(slug: string) {
    const { data } = await apiClient.get<{ data: Product }>(apiEndpoints.catalog.productDetails(slug));
    return data.data;
  },
  availability(slug: string) {
    return getData<ProductAvailability>(apiEndpoints.catalog.availability(slug));
  },
  async reviews(slug: string, params: ListParams = {}): Promise<ProductReviewsPage> {
    const { data } = await apiClient.get<{
      data: { reviews: Review[]; summary: ReviewSummary };
      meta?: PaginationMeta;
    }>(apiEndpoints.catalog.reviews(slug), { params });
    return { ...data.data, meta: data.meta };
  },
};
