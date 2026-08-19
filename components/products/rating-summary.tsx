import { Star } from "lucide-react";
import { formatRating } from "@/lib/format";

interface RatingSummaryProps {
  averageRating: number;
  totalReviews: number;
}

export function RatingSummary({ averageRating, totalReviews }: RatingSummaryProps) {
  if (totalReviews === 0) {
    return (
      <div>
        <p className="text-3xl font-medium text-neutral-900">—</p>
        <p className="mt-1 text-sm text-neutral-500">No reviews yet</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-medium text-neutral-900">
          {formatRating(averageRating)}
        </p>
        <Star className="h-5 w-5 fill-neutral-900 text-neutral-900" />
      </div>
      <p className="mt-1 text-sm text-neutral-500">
        Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
      </p>
    </div>
  );
}