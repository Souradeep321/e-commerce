import { RatingCounts } from "@/types/api/review.types";

interface RatingBreakdownProps {
  ratingCounts: RatingCounts;
  totalReviews: number;
}

const STARS = [5, 4, 3, 2, 1] as const;

export function RatingBreakdown({ ratingCounts, totalReviews }: RatingBreakdownProps) {
  if (totalReviews === 0) return null;

  return (
    <div className="space-y-1.5">
      {STARS.map((star) => {
        const count = ratingCounts[star];
        const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

        return (
          <div key={star} className="flex items-center gap-2 text-xs text-neutral-500">
            <span className="w-3 text-right">{star}</span>
            <div className="h-1.5 flex-1 overflow-hidden bg-neutral-100">
              <div
                className="h-full bg-neutral-900"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="w-6 text-right">{count}</span>
          </div>
        );
      })}
    </div>
  );
}