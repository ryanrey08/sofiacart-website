export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface CatalogCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
}

export interface CatalogProduct {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  category: CatalogCategory | null;
  inStock: boolean;
}

export interface CatalogPaginationMeta {
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
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
