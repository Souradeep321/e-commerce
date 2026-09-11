// ==========================================
// Base category shape
// ==========================================
export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
}

// ==========================================
// Category with children
// Used by:
// - GET /api/categories/[slug]
// - GET /api/admin/categories/[id]
// - GET /api/admin/categories
//
// Products are NOT nested inside category.
// ==========================================
export interface CategoryWithChildren extends Category {
  children: Category[];
}

// ==========================================
// Public product item for category page
// GET /api/categories/[slug]
//
// This matches the select used by the API.
// ==========================================
export interface CategoryProductListItem {
  id: string;
  name: string;
  slug: string;
  price: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  isActive: boolean;
  images: {
    url: string;
  }[];
}

// ==========================================
// Admin product item for category detail
// GET /api/admin/categories/[id]
//
// Kept separate from the public type so admin
// and customer APIs can evolve independently.
// ==========================================
export interface AdminCategoryProductListItem {
  id: string;
  name: string;
  slug: string;
  price: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  isActive: boolean;
  images: {
    url: string;
  }[];
}

// ==========================================
// GET /api/categories
//
// Public, top-level categories only.
// ==========================================
export interface PublicCategory {
  id: string;
  name: string;
  slug: string;
}

export interface PublicCategoriesResponse {
  success: boolean;
  message: string;
  categories: PublicCategory[];
}

// ==========================================
// GET /api/categories/[slug]
//
// Public category detail.
// Returns category metadata + children +
// paginated active products.
// ==========================================
export interface CategoryDetailResponse {
  success: boolean;
  message: string;
  category: CategoryWithChildren;
  products: CategoryProductListItem[];
  page: number;
  totalPages: number;
  totalItems: number;
}

// ==========================================
// GET /api/admin/categories
//
// Admin category list.
//
// IMPORTANT:
// This endpoint no longer includes products.
// ==========================================
export interface CategoryListResponse {
  success: boolean;
  message: string;
  categories: CategoryWithChildren[];
}

// ==========================================
// GET /api/admin/categories/[id]
//
// Admin category detail + paginated products.
// ==========================================
export interface AdminCategoryDetailResponse {
  success: boolean;
  message: string;
  category: CategoryWithChildren;
  products: AdminCategoryProductListItem[];
  page: number;
  totalPages: number;
  totalItems: number;
}

// ==========================================
// POST /api/admin/categories
// ==========================================
export interface CreateCategoryResponse {
  success: boolean;
  message: string;
  category: Category;
}

// ==========================================
// DELETE /api/admin/categories/[id]
// ==========================================
export interface DeleteCategoryResponse {
  success: boolean;
  message: string;
}