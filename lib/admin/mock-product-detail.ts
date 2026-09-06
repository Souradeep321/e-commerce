// lib/admin/mock-product-detail.ts
import { AdminProduct } from "@/types/api/product.types";

// TEMPORARY — stands in for GET /api/admin/products/[id] until wired.
export const mockAdminProduct: AdminProduct = {
  id: "prod_1",
  name: "Structured Wool Blazer",
  slug: "structured-wool-blazer",
  description:
    "A masterclass in modern tailoring, this structured blazer redefines classic silhouettes through a minimalist lens. Crafted from a premium heavyweight wool blend.",
  price: null,
  stock: null,
  isActive: true,
  categoryId: "cat_1",
  gender: "WOMEN",
  minPrice: 1899900,
  maxPrice: 2199900,
  ourRecommendation: true,
  createdAt: "2026-08-12T10:00:00.000Z",
  updatedAt: "2026-09-03T09:20:00.000Z",
  images: [
    { id: "img_1", url: "/images/mockRecommendedProducts/product-1.avif" },
    { id: "img_2", url: "/images/mockRecommendedProducts/product-2.avif" },
    { id: "img_3", url: "/images/mockRecommendedProducts/product-3.avif" },
  ],
  variants: [
    { id: "var_s", size: "S", price: 1899900, stock: 4 },
    { id: "var_m", size: "M", price: 1899900, stock: 2 },
    { id: "var_l", size: "L", price: 1899900, stock: 8 },
    { id: "var_xl", size: "XL", price: 1949900, stock: 0 },
  ],
  category: { id: "cat_1", name: "Outerwear", slug: "outerwear" },
};