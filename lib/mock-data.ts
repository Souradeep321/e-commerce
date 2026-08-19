import { PublicCategory } from "@/types/api/category.types";
import { ProductListItem } from "@/types/api/product.types";
import { ProductDetail } from "@/types/api/product.types";
import { Review, RatingCounts } from "@/types/api/review.types";


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


export const mockProductDetail: ProductDetail = {
  id: "prod_detail_1",
  name: "Structured Wool Blazer",
  slug: "structured-wool-blazer",
  description:
    "A masterclass in modern tailoring, this structured blazer redefines classic silhouettes through a minimalist lens.\nCrafted from a premium heavyweight wool blend, it offers exceptional drape without sacrificing comfort.",
  price: null,
  stock: null,
  isActive: true,
  categoryId: "cat_1",
  gender: "UNISEX",
  minPrice: 1899900,
  maxPrice: 2199900,
  ourRecommendation: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  images: [
    { url: "/images/mockRecommendedProducts/product-1.avif" },
    { url: "/images/mockRecommendedProducts/product-2.avif" },
    { url: "/images/mockRecommendedProducts/product-3.avif" },
  ],
  variants: [
    { id: "var_s", size: "S", price: 1899900, stock: 8 },
    { id: "var_m", size: "M", price: 1899900, stock: 2 }, // triggers low-stock message
    { id: "var_l", size: "L", price: 2099900, stock: 5 },
    { id: "var_xl", size: "XL", price: 2199900, stock: 0 }, // triggers out-of-stock pill
  ],
  category: { id: "cat_1", name: "Outerwear", slug: "outerwear" },
  reviews: [], // not rendered on this page — full reviews come from getProductReviews() in stage 2
};


// Aggregate stats — feeds RatingSummary + RatingBreakdown
export const mockAverageRating = 4.1;
export const mockTotalReviews = 8;
export const mockRatingCounts: RatingCounts = { 5: 4, 4: 2, 3: 1, 2: 1, 1: 0 };

// Split into two "pages" to make Load More demonstrable without a real backend
export const mockReviewsPage1: Review[] = [
  {
    id: "rev_1",
    userId: "user_1",
    productId: "prod_detail_1",
    orderId: "order_1",
    rating: 5,
    comment: "Exceptional quality — the wool blend drapes beautifully and the tailoring is spot on.",
    createdAt: "2026-06-10T10:00:00.000Z",
    user: { id: "user_1", name: "Ananya R." },
    images: [{ id: "img_1", url: "/images/mockRecommendedProducts/product-4.avif", publicId: "mock_1" }],
  },
  {
    id: "rev_2",
    userId: "user_2", 
    productId: "prod_detail_1",
    orderId: "order_2",
    rating: 4,
    comment: "Great fit, runs slightly large — consider sizing down.",
    createdAt: "2026-06-02T10:00:00.000Z",
    user: { id: "user_2", name: "Karan M." },
    images: [],
  },
  {
    id: "rev_3",
    userId: "user_3",
    productId: "prod_detail_1",
    orderId: "order_3",
    rating: 5,
    comment: "Has become my go-to piece for meetings. Structured but still comfortable.",
    createdAt: "2026-05-20T10:00:00.000Z",
    user: { id: "user_3", name: "Priya S." },
    images: [],
  },
  {
    id: "rev_4",
    userId: "user_4",
    productId: "prod_detail_1",
    orderId: "order_4",
    rating: 3,
    comment: "Good overall, but the lining felt a bit thin for the price point.",
    createdAt: "2026-05-11T10:00:00.000Z",
    user: { id: "user_4", name: "Rohan D." },
    images: [],
  },
  {
    id: "rev_5",
    userId: "user_5",
    productId: "prod_detail_1",
    orderId: "order_5",
    rating: 5,
    comment: null, // some reviews are rating-only, no written comment
    createdAt: "2026-04-28T10:00:00.000Z",
    user: { id: "user_5", name: "Meera J." },
    images: [],
  },
];

export const mockReviewsPage2: Review[] = [
  {
    id: "rev_6",
    userId: "user_6",
    productId: "prod_detail_1",
    orderId: "order_6",
    rating: 2,
    comment: "Stitching came loose after a few wears. Expected better at this price.",
    createdAt: "2026-04-15T10:00:00.000Z",
    user: { id: "user_6", name: "Vikram T." },
    images: [],
  },
  {
    id: "rev_7",
    userId: "user_7",
    productId: "prod_detail_1",
    orderId: "order_7",
    rating: 4,
    comment: "Solid piece, exactly as pictured.",
    createdAt: "2026-04-03T10:00:00.000Z",
    user: { id: "user_7", name: "Sana K." },
    images: [],
  },
  {
    id: "rev_8",
    userId: "user_8",
    productId: "prod_detail_1",
    orderId: "order_8",
    rating: 5,
    comment: "Perfect. Bought a second one in a different size.",
    createdAt: "2026-03-22T10:00:00.000Z",
    user: { id: "user_8", name: "Arjun P." },
    images: [],
  },
];