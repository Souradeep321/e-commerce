import { RatingSummary } from "./rating-summary";
import { RatingBreakdown } from "./rating-breakdown";
import { ReviewList } from "./review-list";
import { Review, RatingCounts } from "@/types/api/review.types";

interface ProductReviewsSectionProps {
  productSlug: string;
  averageRating: number;
  totalReviews: number;
  ratingCounts: RatingCounts;
  initialReviews: Review[];
  initialPage: number;
  initialTotalPages: number;
}

export function ProductReviewsSection({
  productSlug,
  averageRating,
  totalReviews,
  ratingCounts,
  initialReviews,
  initialPage,
  initialTotalPages,
}: ProductReviewsSectionProps) {
  return (
    <section id="reviews" className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h2 className="mb-8 text-lg font-medium text-neutral-900">Reviews</h2>

      <div className="grid gap-10 sm:grid-cols-[auto_1fr] sm:gap-16">
        <div className="flex gap-8 sm:block sm:gap-0">
          <RatingSummary averageRating={averageRating} totalReviews={totalReviews} />
          <div className="mt-0 sm:mt-4">
            <RatingBreakdown ratingCounts={ratingCounts} totalReviews={totalReviews} />
          </div>
        </div>

        <ReviewList
          productSlug={productSlug}
          initialReviews={initialReviews}
          initialPage={initialPage}
          initialTotalPages={initialTotalPages}
        />
      </div>
    </section>
  );
}