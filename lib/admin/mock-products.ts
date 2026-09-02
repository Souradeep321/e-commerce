// lib/admin/mock-products.ts
import { AdminProductListItem, AdminProductListResponse } from "@/types/api/product.types";

/**
 * TEMPORARY — same pattern as lib/mock-data.ts and mock-analytics.ts.
 * Swap for a real getAdminProducts({ page, category, ... }) call once
 * wired up; delete this file at that point.
 *
 * Prices are in PAISE (matches the real schema/API — unlike analytics,
 * which is already in rupees), so these run through the same
 * formatProductPrice() the storefront uses, not lib/admin/format.ts.
 */

const ALL_MOCK_PRODUCTS: AdminProductListItem[] = [
  {
    id: "prod_1", name: "Merino Field Jacket", slug: "merino-field-jacket",
    price: null, minPrice: 1590000, maxPrice: 1790000, isActive: true,
    images: [{ url: "/images/mockRecommendedProducts/product-1.avif" }],
    category: { name: "Outerwear", slug: "outerwear" },
  },
  {
    id: "prod_2", name: "Brushed Cotton Overshirt", slug: "brushed-cotton-overshirt",
    price: 420000, minPrice: null, maxPrice: null, isActive: true,
    images: [{ url: "/images/mockRecommendedProducts/product-2.avif" }],
    category: { name: "Tops", slug: "tops" },
  },
  {
    id: "prod_3", name: "Slim Tapered Trouser", slug: "slim-tapered-trouser",
    price: null, minPrice: 650000, maxPrice: 720000, isActive: true,
    images: [{ url: "/images/mockRecommendedProducts/product-3.avif" }],
    category: { name: "Bottoms", slug: "bottoms" },
  },
  {
    id: "prod_4", name: "Ribbed Crew Knit", slug: "ribbed-crew-knit",
    price: null, minPrice: 380000, maxPrice: 440000, isActive: true,
    images: [{ url: "/images/mockRecommendedProducts/product-4.avif" }],
    category: { name: "Tops", slug: "tops" },
  },
  {
    id: "prod_5", name: "Leather Chelsea Boot", slug: "leather-chelsea-boot",
    price: 999900, minPrice: null, maxPrice: null, isActive: true,
    images: [{ url: "/images/mockRecommendedProducts/product-5.avif" }],
    category: { name: "Footwear", slug: "footwear" },
  },
  {
    id: "prod_6", name: "Linen Straight Trouser", slug: "linen-straight-trouser",
    price: null, minPrice: 520000, maxPrice: 590000, isActive: false,
    images: [{ url: "/images/mockRecommendedProducts/product-6.avif" }],
    category: { name: "Bottoms", slug: "bottoms" },
  },
  {
    id: "prod_7", name: "Canvas Tote", slug: "canvas-tote",
    price: 199900, minPrice: null, maxPrice: null, isActive: true,
    images: [{ url: "/images/mockRecommendedProducts/product-7.avif" }],
    category: { name: "Accessories", slug: "accessories" },
  },
  {
    id: "prod_8", name: "Technical Shell Jacket", slug: "technical-shell-jacket",
    price: null, minPrice: 1990000, maxPrice: 2190000, isActive: false,
    images: [{ url: "/images/mockRecommendedProducts/product-8.avif" }],
    category: { name: "Outerwear", slug: "outerwear" },
  },
  {
    id: "prod_9", name: "Wool Blend Overcoat", slug: "wool-blend-overcoat",
    price: 1850000, minPrice: null, maxPrice: null, isActive: true,
    images: [{ url: "/images/mockRecommendedProducts/product-1.avif" }],
    category: { name: "Outerwear", slug: "outerwear" },
  },
  {
    id: "prod_10", name: "Oxford Button-Down", slug: "oxford-button-down",
    price: 340000, minPrice: null, maxPrice: null, isActive: true,
    images: [{ url: "/images/mockRecommendedProducts/product-2.avif" }],
    category: { name: "Tops", slug: "tops" },
  },
  {
    id: "prod_11", name: "Cropped Wide Trouser", slug: "cropped-wide-trouser",
    price: null, minPrice: 560000, maxPrice: 610000, isActive: true,
    images: [{ url: "/images/mockRecommendedProducts/product-3.avif" }],
    category: { name: "Bottoms", slug: "bottoms" },
  },
  {
    id: "prod_12", name: "Suede Derby Shoe", slug: "suede-derby-shoe",
    price: 870000, minPrice: null, maxPrice: null, isActive: false,
    images: [{ url: "/images/mockRecommendedProducts/product-5.avif" }],
    category: { name: "Footwear", slug: "footwear" },
  },
];

export const MOCK_PRODUCT_CATEGORIES = [
  "Outerwear",
  "Tops",
  "Bottoms",
  "Footwear",
  "Accessories",
] as const;

// Slices the full mock array like a real paginated response would —
// so swapping this for getAdminProducts({ page, limit, ... }) later is
// a signature-compatible, low-effort change.
//
// Unlike the storefront's /products FilterBar (which deliberately
// leaves mock data unfiltered — the URL state is wired but inert),
// this DOES filter the mock array for real. Reasoning: the products
// list ships with a two-variant empty state (no products at all vs.
// no filter matches), and leaving filtering inert would make the
// filtered-empty variant permanently unreachable. The API call itself
// is still mocked — only the filtering logic is real.
export function getMockProductsPage(options: {
  page?: number;
  limit?: number;
  category?: string; // lowercase category name, e.g. "outerwear"
  status?: "active" | "inactive";
  q?: string;
} = {}): AdminProductListResponse {
  const { page = 1, limit = 8, category, status, q } = options;

  let filtered = ALL_MOCK_PRODUCTS;

  if (category) {
    filtered = filtered.filter((p) => p.category?.name.toLowerCase() === category);
  }
  if (status) {
    filtered = filtered.filter((p) => (status === "active" ? p.isActive : !p.isActive));
  }
  if (q) {
    const needle = q.toLowerCase();
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(needle));
  }

  const start = (page - 1) * limit;
  const products = filtered.slice(start, start + limit);

  return {
    success: true,
    message: "Products loaded",
    page,
    totalPages: Math.max(1, Math.ceil(filtered.length / limit)),
    totalItems: filtered.length,
    products,
  };
}