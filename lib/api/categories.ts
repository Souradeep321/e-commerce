import { apiFetch } from "./client";
import {
  PublicCategoriesResponse,
  CategoryDetailResponse,
  CategoryListResponse,
  AdminCategoryDetailResponse,
  CreateCategoryResponse,
  DeleteCategoryResponse,
} from "@/types/api/category.types";
import { CategoryInput } from "@/schemas/category.schema";

// ==========================================
// GET /api/categories
// Public, top-level categories only
// ==========================================
export function getCategories() {
  return apiFetch<PublicCategoriesResponse>("/api/categories", {
    next: { revalidate: 3600 },
  });
}

// ==========================================
// GET /api/categories/[slug]
// Public category detail
// ==========================================
export function getCategoryBySlug(
  slug: string,
  params?: {
    page?: number;
    limit?: number;
    q?: string;
    gender?: string;
    sort?: string;
  }
) {
  return apiFetch<CategoryDetailResponse>(
    `/api/categories/${slug}`,
    {
      params,
      next: { revalidate: 3600 },
    }
  );
}

// ==========================================
// GET /api/admin/categories
// Admin category list
// ==========================================
export function getAdminCategories() {
  return apiFetch<CategoryListResponse>("/api/admin/categories", {
    cache: "no-store",
  });
}

// ==========================================
// GET /api/admin/categories/[id]
// Admin category detail + products
// ==========================================
export function getAdminCategoryById(
  id: string,
  params?: {
    page?: number;
    limit?: number;
    q?: string;
    gender?: string;
    sort?: string;
    isActive?: boolean;
  }
) {
  return apiFetch<AdminCategoryDetailResponse>(
    `/api/admin/categories/${id}`,
    {
      params,
      cache: "no-store",
    }
  );
}

// ==========================================
// POST /api/admin/categories
// ==========================================
export function createCategory(data: CategoryInput) {
  return apiFetch<CreateCategoryResponse>("/api/admin/categories", {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });
}

// ==========================================
// DELETE /api/admin/categories/[id]
// ==========================================
export function deleteCategory(id: string) {
  return apiFetch<DeleteCategoryResponse>(
    `/api/admin/categories/${id}`,
    {
      method: "DELETE",
      cache: "no-store",
    }
  );
}