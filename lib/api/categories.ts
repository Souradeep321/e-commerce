import { apiFetch } from "./client";
import {
  PublicCategoriesResponse,
  CategoryDetailResponse,
  CategoryListResponse,
  CreateCategoryResponse,
  DeleteCategoryResponse,
} from "@/types/api/category.types";
import { CategoryInput } from "@/schemas/category.schema";

// ==========================================
// GET /api/categories
// Public, top-level only — for nav menus / category browse.
// Low-churn data, safe to cache for a while.
// ==========================================
export function getCategories() {
  return apiFetch<PublicCategoriesResponse>("/api/categories", {
    next: { revalidate: 3600 },
  });
}

// ==========================================
// GET /api/categories/[slug]
// Public, single category with children + nested products.
// ==========================================
export function getCategoryBySlug(slug: string) {
  return apiFetch<CategoryDetailResponse>(`/api/categories/${slug}`, {
    next: { revalidate: 3600 },
  });
}

// ==========================================
// GET /api/admin/categories
// Admin-only, full list with relations — never cached.
// ==========================================
export function getAdminCategories() {
  return apiFetch<CategoryListResponse>("/api/admin/categories", {
    cache: "no-store",
  });
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
  return apiFetch<DeleteCategoryResponse>(`/api/admin/categories/${id}`, {
    method: "DELETE",
    cache: "no-store",
  });
}