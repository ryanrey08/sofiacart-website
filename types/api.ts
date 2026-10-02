/**
 * Response shapes of sofiacart-website-backend.
 *
 * Customer endpoints respond with `{ data, message?, meta? }`. The public catalog list endpoints
 * (`/products`, `/products/popular`, `/categories`) keep Laravel's resource pagination
 * (`{ data: [...], links, meta }` with snake_case meta keys).
 */

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginationMeta {
  currentPage: number;
  perPage: number;
  total: number;
  lastPage: number;
}

export interface ApiEnvelope<T> {
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

export interface CatalogPaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface CatalogPaginationLinks {
  first?: string | null;
  last?: string | null;
  prev?: string | null;
  next?: string | null;
}

export interface ApiResourceCollection<T> {
  data: T[];
  links?: CatalogPaginationLinks;
  meta?: CatalogPaginationMeta;
}

export interface ListParams {
  page?: number;
  per_page?: number;
}
