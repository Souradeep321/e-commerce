import { apiFetch } from "./client";
import {
  ProductReviewsResponse,
  CreateReviewResponse,
  UpdateReviewResponse,
  DeleteReviewResponse,
  GetOwnReviewsResponse,
  CanReviewCheckResponse,
} from "@/types/api/review.types";

// ==========================================
// GET /api/products/[slug]/reviews
// Paginated, public. Review data changes moderately often —
// short cache window is fine.
// ==========================================
export function getProductReviews(slug: string, params?: { page?: number; limit?: number }) {
  return apiFetch<ProductReviewsResponse>(`/api/products/${slug}/reviews`, {
    params,
    next: { revalidate: 300 },
  });
}

// ==========================================
// POST /api/products/[slug]/reviews
// REQUIRES FormData — handles up to 5 image uploads via
// Cloudinary. Build the FormData in the calling component:
//   const fd = new FormData();
//   fd.append("rating", String(rating));
//   fd.append("comment", comment);
//   fd.append("orderId", orderId);
//   imageFiles.forEach(f => fd.append("images", f));
// ==========================================
export function createReview(slug: string, formData: FormData) {
  return apiFetch<CreateReviewResponse>(`/api/products/${slug}/reviews`, {
    method: "POST",
    body: formData,
    cache: "no-store",
  });
}

// ==========================================
// PATCH /api/reviews/[id]
// Also FormData — supports newImages (files to add) and
// deleteImageIds (JSON-stringified array of image ids to remove):
//   const fd = new FormData();
//   fd.append("rating", String(rating));
//   fd.append("deleteImageIds", JSON.stringify(["img_1", "img_2"]));
//   newFiles.forEach(f => fd.append("newImages", f));
// ==========================================
export function updateReview(id: string, formData: FormData) {
  return apiFetch<UpdateReviewResponse>(`/api/reviews/${id}`, {
    method: "PATCH",
    body: formData,
    cache: "no-store",
  });
}

// ==========================================
// DELETE /api/reviews/[id]
// Ownership-checked server-side; also deletes Cloudinary images.
// ==========================================
export function deleteReview(id: string) {
  return apiFetch<DeleteReviewResponse>(`/api/reviews/${id}`, {
    method: "DELETE",
    cache: "no-store",
  });
}

// ==========================================
// GET /api/reviews
// Current user's own reviews, paginated. Always live.
// ==========================================
export function getMyReviews(params?: { page?: number; limit?: number }) {
  return apiFetch<GetOwnReviewsResponse>("/api/reviews", {
    params,
    cache: "no-store",
  });
}

// ==========================================
// GET /api/products/[slug]/can-review
// Check before showing a "write a review" button — three
// possible outcomes (see CanReviewCheckResponse union type).
// Always live, since it depends on the user's own order history.
// ==========================================
export function canReviewProduct(slug: string) {
  return apiFetch<CanReviewCheckResponse>(`/api/products/${slug}/can-review`, {
    cache: "no-store",
  });
}