import { apiFetch } from "./client";
import {
  ProductListResponse,
  ProductDetailResponse,
  ProductSearchResponse,
  AutocompleteResponse,
  CreateProductResponse,
  UpdateProductResponse,
  GetAdminProductResponse,
  AdminProductListResponse,
  DeleteProductResponse,
  ToggleProductStatusResponse,
} from "@/types/api/product.types";

// ---------- Public ----------

export function getProducts(params?: {
  page?: number;
  limit?: number;
  category?: string;
  gender?: string;
  sort?: string;
}) {
  return apiFetch<ProductListResponse>("/api/products", {
    params,
    next: { revalidate: 300 },
  });
}

export function getProduct(slug: string) {
  return apiFetch<ProductDetailResponse>(`/api/products/${slug}`, {
    next: { revalidate: 300 },
  });
}

export function searchProducts(params: {
  q?: string;
  category?: string;
  gender?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
}) {
  return apiFetch<ProductSearchResponse>("/api/products/search", {
    params,
    cache: "no-store",
  });
}

export function getAutocomplete(query: string) {
  return apiFetch<AutocompleteResponse>("/api/products/autocomplete", {
    params: { q: query },
    cache: "no-store",
  });
}

// ---------- Admin ----------

export function getAdminProducts(params?: {
  page?: number;
  limit?: number;
  category?: string;
  gender?: string;
  sort?: string;
  isActive?: boolean;
}) {
  return apiFetch<AdminProductListResponse>("/api/admin/products", {
    params,
    cache: "no-store",
  });
}

export function getAdminProduct(id: string) {
  return apiFetch<GetAdminProductResponse>(`/api/admin/products/${id}`, {
    cache: "no-store",
  });
}

export function createProduct(formData: FormData) {
  return apiFetch<CreateProductResponse>("/api/admin/products", {
    method: "POST",
    body: formData,
    cache: "no-store",
  });
}

export function updateProduct(id: string, data: FormData | Record<string, unknown>) {
  const isFormData = data instanceof FormData;
  return apiFetch<UpdateProductResponse>(`/api/admin/products/${id}`, {
    method: "PATCH",
    body: isFormData ? data : JSON.stringify(data),
    cache: "no-store",
  });
}

export function deleteProduct(id: string) {
  return apiFetch<DeleteProductResponse>(`/api/admin/products/${id}`, {
    method: "DELETE",
    cache: "no-store",
  });
}

export function toggleProductStatus(id: string) {
  return apiFetch<ToggleProductStatusResponse>(`/api/admin/products/${id}/status`, {
    method: "PATCH",
    cache: "no-store",
  });
}