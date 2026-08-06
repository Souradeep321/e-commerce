// ==========================================
// ReviewImage
// Matches ReviewImage model — url for display, publicId
// only matters server-side for Cloudinary deletion, but
// harmless to include since the API does return it.
// ==========================================
export interface ReviewImage {
  id: string;
  url: string;
  publicId: string;
}

// ==========================================
// ReviewUserSummary
// Minimal user info shown alongside a review — never
// exposes email or anything sensitive.
// ==========================================
export interface ReviewUserSummary {
  id: string;
  name: string | null;
}

// ==========================================
// Review
// Full review shape as returned by GET/POST on
// /api/products/[slug]/reviews. Includes user + images,
// NOT the full product (only PATCH's response nests a
// product summary — see ReviewWithProduct below).
// ==========================================
export interface Review {
  id: string;
  userId: string;
  productId: string;
  orderId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: ReviewUserSummary;
  images: ReviewImage[];
}

// ==========================================
// GET /api/products/[slug]/reviews
// Paginated reviews for one product, plus aggregate stats
// (averageRating, ratingCounts) computed across ALL reviews,
// not just the current page.
// ==========================================
export interface RatingCounts {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

export interface ProductReviewsResponse {
  success: boolean;
  message: string;
  page: number;
  totalPages: number;
  totalItems: number;
  data: {
    reviews: Review[];
    totalReviews: number;
    averageRating: number;
    ratingCounts: RatingCounts;
  };
}

// ==========================================
// POST /api/products/[slug]/reviews
// Creating a review returns the full review WITH a product
// summary attached (unlike the GET above, which is already
// scoped to one product and doesn't repeat it per-review).
// ==========================================
export interface ReviewProductSummary {
  id: string;
  name: string;
}

export interface CreateReviewResponse {
  success: boolean;
  message: string;
  review: Review & { product: ReviewProductSummary };
}

// ==========================================
// PATCH /api/reviews/[id]
// Updating a review — product summary shape here is
// slightly different (adds slug, since this response is
// used outside the product-page context, e.g. a "my reviews"
// page that needs to link back to the product).
// ==========================================
export interface UpdateReviewProductSummary extends ReviewProductSummary {
  slug: string;
}

export interface UpdateReviewResponse {
  success: boolean;
  message: string;
  review: Review & { product: UpdateReviewProductSummary };
}

// ==========================================
// DELETE /api/reviews/[id]
// ==========================================
export interface DeleteReviewResponse {
  success: boolean;
  message: string;
}

// ==========================================
// PENDING — not yet reviewed, don't guess at shape:
// GET /api/products/[slug]/can-review
// GET /api/reviews (if it exists as a listing route)
// ==========================================

// ==========================================
// GET /api/reviews (user's own reviews)
// Different shape from the product-page review: includes
// product summary + order reference (so a "my reviews" page
// can link back to both), but does NOT include `user`
// (redundant — it's always the current user).
// ==========================================
export interface OwnReviewProductSummary {
  id: string;
  name: string;
  slug: string;
  images: { url: string }[];
}

export interface OwnReviewOrderSummary {
  id: string;
  createdAt: string;
}

export interface OwnReview {
  id: string;
  userId: string;
  productId: string;
  orderId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  product: OwnReviewProductSummary;
  order: OwnReviewOrderSummary;
  images: ReviewImage[];
}

export interface GetOwnReviewsResponse {
  success: boolean;
  message: string;
  page: number;
  totalPages: number;
  totalItems: number;
  reviews: OwnReview[];
}

// ==========================================
// GET /api/products/[slug]/can-review
// Three distinct outcomes, each with a different shape —
// always check `canReview` before assuming `availableOrders` exists.
// ==========================================
export interface CanReviewOrder {
  id: string;
  createdAt: string;
}

export interface CannotReviewResponse {
  success: false;
  canReview: false;
  message: string;
}

export interface CanReviewResponse {
  success: true;
  canReview: true;
  message: string;
  availableOrders: CanReviewOrder[];
}

export type CanReviewCheckResponse = CannotReviewResponse | CanReviewResponse;