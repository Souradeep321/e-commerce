import { PublicCategory } from "@/types/api/category.types";
import { ProductListItem } from "@/types/api/product.types";

/**
 * TEMPORARY — delete this file once real products/categories exist in the DB
 * and swap mockCategories/mockProducts for actual getCategories()/getProducts()
 * calls in app/page.tsx. Shapes here match the real API response types exactly,
 * so that swap should be a one-line change, not a rewrite.
 */

export const mockCategories: PublicCategory[] = [
  { id: "cat_1", name: "Outerwear", slug: "outerwear" },
  { id: "cat_2", name: "Knitwear", slug: "knitwear" },
  { id: "cat_3", name: "Shirting", slug: "shirting" },
  { id: "cat_4", name: "Trousers", slug: "trousers" },
  { id: "cat_5", name: "Footwear", slug: "footwear" },
  { id: "cat_6", name: "Accessories", slug: "accessories" },
];

export const mockRecommendedProducts: ProductListItem[] = [
  {
    id: "prod_1",
    name: "Structured Wool Overcoat",
    slug: "structured-wool-overcoat",
    price: 849900, // ₹8,499 in paise
    minPrice: null,
    maxPrice: null,
    isActive: true,
    gender: "UNISEX",
    images: [{ url: "/images/mockRecommendedProducts/product-1.avif" }],
    category: { name: "Outerwear", slug: "outerwear" },
    rating: 4.7,
    reviewCount: 63,
  },
  {
    id: "prod_2",
    name: "Relaxed Linen Shirt",
    slug: "relaxed-linen-shirt",
    price: null,
    minPrice: 129900,
    maxPrice: 179900,
    isActive: true,
    gender: "MEN",
    images: [{ url: "/images/mockRecommendedProducts/product-2.avif" }],
    category: { name: "Shirting", slug: "shirting" },
    rating: 4.4,
    reviewCount: 41,
  },
  {
    id: "prod_3",
    name: "Classic White Low-Top",
    slug: "classic-white-low-top",
    price: 499900,
    minPrice: null,
    maxPrice: null,
    isActive: true,
    gender: "UNISEX",
    images: [{ url: "/images/mockRecommendedProducts/product-3.avif" }],
    category: { name: "Footwear", slug: "footwear" },
    rating: 4.8,
    reviewCount: 117,
  },
  {
    id: "prod_4",
    name: "Double-Breasted Blazer",
    slug: "double-breasted-blazer",
    price: null,
    minPrice: 649900,
    maxPrice: 799900,
    isActive: true,
    gender: "WOMEN",
    images: [{ url: "/images/mockRecommendedProducts/product-4.avif" }],
    category: { name: "Outerwear", slug: "outerwear" },
    rating: 4.5,
    reviewCount: 63,
  },
  {
    id: "prod_5",
    name: "Asymmetric Linen Blazer",
    slug: "asymmetric-linen-blazer",
    price: 529900,
    minPrice: null,
    maxPrice: null,
    isActive: true,
    gender: "WOMEN",
    images: [{ url: "/images/mockRecommendedProducts/product-5.avif" }],
    category: { name: "Outerwear", slug: "outerwear" },
    rating: 4.6,
    reviewCount: 12,
  },
  {
    id: "prod_6",
    name: "Pleated Midi Skirt",
    slug: "pleated-midi-skirt",
    price: null,
    minPrice: 199900,
    maxPrice: 249900,
    isActive: true,
    gender: "WOMEN",
    images: [{ url: "/images/mockRecommendedProducts/product-6.avif" }],
    category: { name: "Trousers", slug: "trousers" },
    rating: 4.4,
    reviewCount: 8,
  },
  {
    id: "prod_7",
    name: "Relaxed Suit Jacket",
    slug: "relaxed-suit-jacket",
    price: 699900,
    minPrice: null,
    maxPrice: null,
    isActive: true,
    gender: "MEN",
    images: [{ url: "/images/mockRecommendedProducts/product-7.avif" }],
    category: { name: "Outerwear", slug: "outerwear" },
    rating: 4.7,
    reviewCount: 19,
  },
  {
    id: "prod_8",
    name: "Minimal Leather Belt Bag",
    slug: "minimal-leather-belt-bag",
    price: null,
    minPrice: 149900,
    maxPrice: 199900,
    isActive: true,
    gender: "UNISEX",
    images: [{ url: "/images/mockRecommendedProducts/product-8.avif" }],
    category: { name: "Accessories", slug: "accessories" },
    rating: 4.3,
    reviewCount: 34,
  },
];

export const mockNewArrivalProducts: ProductListItem[] = [
  {
    id: "prod_5",
    name: "Asymmetric Linen Blazer",
    slug: "asymmetric-linen-blazer",
    price: 529900,
    minPrice: null,
    maxPrice: null,
    isActive: true,
    gender: "WOMEN",
    images: [{ url: "/images/mockNewArrivalProducts/product-1.avif" }],
    category: { name: "Outerwear", slug: "outerwear" },
    rating: 4.6,
    reviewCount: 12,
  },
  {
    id: "prod_6",
    name: "Pleated Midi Skirt",
    slug: "pleated-midi-skirt",
    price: null,
    minPrice: 199900,
    maxPrice: 249900,
    isActive: true,
    gender: "WOMEN",
    images: [{ url: "/images/mockNewArrivalProducts/product-2.avif" }],
    category: { name: "Trousers", slug: "trousers" },
    rating: 4.4,
    reviewCount: 8,
  },
  {
    id: "prod_7",
    name: "Relaxed Suit Jacket",
    slug: "relaxed-suit-jacket",
    price: 699900,
    minPrice: null,
    maxPrice: null,
    isActive: true,
    gender: "MEN",
    images: [{ url: "/images/mockNewArrivalProducts/product-3.avif" }],
    category: { name: "Outerwear", slug: "outerwear" },
    rating: 4.7,
    reviewCount: 19,
  },
  {
    id: "prod_8",
    name: "Minimal Leather Belt Bag",
    slug: "minimal-leather-belt-bag",
    price: null,
    minPrice: 149900,
    maxPrice: 199900,
    isActive: true,
    gender: "UNISEX",
    images: [{ url: "/images/mockNewArrivalProducts/product-4.avif" }],
    category: { name: "Accessories", slug: "accessories" },
    rating: 4.3,
    reviewCount: 34,
  },
];

// ---- Listing page mock (combines both Home arrays into one "catalog") ----
// TEMPORARY, same as everything else in this file — delete once real
// products exist and app/products/page.tsx calls the real getProducts().
export const mockAllProducts: ProductListItem[] = [
  ...mockRecommendedProducts,
  // ...mockNewArrivalProducts,
];

// With only 8 mock products and a typical page size of 12, this is
// realistically always 1 page — hardcoded here since there's no real
// pagination to compute yet.
export const mockTotalPages = 3;