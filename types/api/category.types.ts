// ==========================================
// Base category shape
// ==========================================
export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
}

// Category with nested relations (as returned by GET endpoints that include them)
export interface CategoryWithRelations extends Category {
  children: Category[];
  products: CategoryProductSummary[];
}

// Minimal product shape as it appears nested inside a category response
// (matches what `products: true` on a Category include actually returns —
// full Product fields, not a curated subset)
export interface CategoryProductSummary {
  id: string;
  name: string;
  slug: string;
  price: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  isActive: boolean;
  // ...rest of Product fields, since `include: { products: true }` returns everything
}

// ==========================================
// GET /api/categories/[slug]
// ==========================================
export interface CategoryDetailResponse {
  success: boolean;
  message: string;
  category: CategoryWithRelations | null;
}

// ==========================================
// GET /api/admin/categories
// ==========================================
export interface CategoryListResponse {
  success: boolean;
  message: string;
  categories: CategoryWithRelations[];
}

// ==========================================
// POST /api/admin/categories
// ==========================================
export interface CreateCategoryResponse {
  success: boolean;
  message: string;
  category: Category; // create() returns the flat category, no children/products yet
}