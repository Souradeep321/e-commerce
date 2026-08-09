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

// ==========================================
// PublicCategory
// Shape returned by GET /api/categories — deliberately minimal
// (select only pulls id/name/slug, no parentId) since this route
// only returns TOP-LEVEL categories (where parentId: null) for
// nav/browse purposes. Not the same as Category above, which
// includes parentId for routes that need the full hierarchy.
// ==========================================
export interface PublicCategory {
  id: string;
  name: string;
  slug: string;
}

// ==========================================
// GET /api/categories
// Public, unauthenticated. Only top-level categories — if you
// need subcategories for a specific parent, fetch via
// GET /api/categories/[slug] and read its `children` field instead.
// ==========================================
export interface PublicCategoriesResponse {
  success: boolean;
  message: string;
  categories: PublicCategory[];
}

// ==========================================
// DELETE /api/admin/categories/[id]
// Blocks deletion (400) if the category has children or products —
// only succeeds on a genuinely empty, leaf category.
// ==========================================
export interface DeleteCategoryResponse {
  success: boolean;
  message: string;
}