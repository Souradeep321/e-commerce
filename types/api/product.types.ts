export interface ProductImage {
  url: string;
}

export interface ProductVariant {
  id: string;
  size: string;
  price: number;
  stock: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

// Shape returned by GET /api/products (listing)
export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  price: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  isActive: boolean;
  gender: "MEN" | "WOMEN" | "UNISEX" | null;
  rating: number;
  reviewCount: number;
  images: ProductImage[];
  category: Pick<ProductCategory, "name" | "slug"> | null;
}

export interface ProductListResponse {
  success: boolean;
  message: string;
  page: number;
  totalPages: number;
  totalItems: number;
  products: ProductListItem[];
}

// Shape returned by GET /api/products/[slug] (single product)
export interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  images: ProductImage[];
  variants: ProductVariant[];
  category: ProductCategory | null;
  reviews: /* review preview shape */ any[]; // refine once review.types.ts exists
}

export interface ProductDetailResponse {
  success: boolean;
  message: string;
  product: ProductDetail;
}