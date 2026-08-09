// ==========================================
// Shared building blocks
// ==========================================
export interface ProductImage {
  url: string;
}

export interface ProductVariant {
  id: string;
  size: string;
  price: number;
  stock: number;
}

export interface ProductCategoryRef {
  id: string;
  name: string;
  slug: string;
}

export type Gender = "MEN" | "WOMEN" | "UNISEX";

// ==========================================
// GET /api/products (listing)
// ==========================================
export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  price: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  isActive: boolean;
  gender: Gender | null;
  images: ProductImage[];
  category: Pick<ProductCategoryRef, "name" | "slug"> | null;
  rating: number;
  reviewCount: number;
}

export interface ProductListResponse {
  success: boolean;
  message: string;
  page: number;
  totalPages: number;
  totalItems: number;
  products: ProductListItem[];
}

// ==========================================
// GET /api/products/[slug] (detail)
// Note: this route uses `include`, not `select` — so it returns
// the FULL Product model, not a curated subset like the others.
// ==========================================
export interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number | null;
  stock: number | null;
  isActive: boolean;
  categoryId: string | null;
  gender: Gender | null;
  minPrice: number | null;
  maxPrice: number | null;
  ourRecommendation: boolean;
  createdAt: string; // ISO string once serialized over JSON
  updatedAt: string;

  images: ProductImage[];
  variants: ProductVariant[];
  category: ProductCategoryRef | null;
  reviews: ProductDetailReview[]; // preview only — take: 5
}

// Minimal review shape as it appears nested in product detail
// (full Review shape belongs in review.types.ts once we get there)
export interface ProductDetailReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface ProductDetailResponse {
  success: boolean;
  message: string;
  product: ProductDetail | null; // null if not found — route returns 404 in that case, but check response.success first
}

// ==========================================
// GET /api/products/search
// Note: uses "image" (singular, string) — different from
// the listing route's "images" (array). Real inconsistency,
// not a typo — flagging it so your frontend code accounts for it.
// ==========================================
export interface ProductSearchItem {
  id: string;
  name: string;
  slug: string;
  price: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  gender: Gender | null;
  ourRecommendation: boolean;
  images: ProductImage[];
  category: ProductCategoryRef | null;
  rating: number;
  reviewCount: number;
}

export interface ProductSearchResponse {
  success: boolean;
  message: string;
  page: number;
  totalPages: number;
  totalItems: number;
  products: ProductSearchItem[];
  metadata: {
    query: string;
    category: string | null;
    gender: string | null;
    minPrice: string | null;
    maxPrice: string | null;
    sort: string;
  };
}

// ==========================================
// GET /api/products/autocomplete
// ==========================================
export interface ProductSuggestion {
  id: string;
  name: string;
  slug: string;
  price: number | null;
  maxPrice: number | null;
  image: string | undefined;
  category: string | undefined; // just the category name, not a full object
  type: "product";
}

export interface CategorySuggestion {
  id: string;
  name: string;
  slug: string;
  type: "category";
}

export interface AutocompleteResponse {
  success: boolean;
  query: string;
  suggestions: {
    products: ProductSuggestion[];
    categories: CategorySuggestion[];
  };
}

// ==========================================
// AdminProduct
// Full product shape returned by admin create/update/get-one
// routes — includes ALL images, variants, and full category
// (unlike customer-facing routes, which curate fields).
// ==========================================
export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number | null;
  stock: number | null;
  isActive: boolean;
  categoryId: string | null;
  gender: Gender | null;
  minPrice: number | null;
  maxPrice: number | null;
  ourRecommendation: boolean;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
  variants: ProductVariant[];
  category: ProductCategoryRef | null;
}

export interface CreateProductResponse {
  success: boolean;
  message: string;
  product: AdminProduct;
}

export interface UpdateProductResponse {
  success: boolean;
  message: string;
  product: AdminProduct;
}

export interface GetAdminProductResponse {
  success: boolean;
  message: string;
  product: AdminProduct;
}

// ==========================================
// GET /api/admin/products
// Admin listing — no isActive filter by default (shows
// everything), unlike the public /api/products route.
// ==========================================
export interface AdminProductListItem {
  id: string;
  name: string;
  slug: string;
  price: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  isActive: boolean;
  images: ProductImage[];
  category: Pick<ProductCategoryRef, "name" | "slug"> | null;
}

export interface AdminProductListResponse {
  success: boolean;
  message: string;
  page: number;
  totalPages: number;
  totalItems: number;
  products: AdminProductListItem[];
}

export interface DeleteProductResponse {
  success: boolean;
  message: string;
}

// ==========================================
// PATCH /api/admin/products/[id]/status
// Toggles isActive — response returns only a partial product
// (id, name, isActive, description), not the full AdminProduct.
// ==========================================
export interface ToggleProductStatusResponse {
  success: boolean;
  message: string;
  product: {
    id: string;
    name: string;
    isActive: boolean;
    description: string;
  };
}