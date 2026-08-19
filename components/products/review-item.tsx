import Image from "next/image";
import { Star } from "lucide-react";
import { Review } from "@/types/api/review.types";
import { formatDate } from "@/lib/format";

interface ReviewItemProps {
  review: Review;
}

export function ReviewItem({ review }: ReviewItemProps) {
  return (
    <div className="py-6 first:pt-0">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${
              i < review.rating
                ? "fill-neutral-900 text-neutral-900"
                : "fill-neutral-200 text-neutral-200"
            }`}
          />
        ))}
      </div>

      <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
        <span className="font-medium text-neutral-900">
          {review.user.name ?? "Anonymous"}
        </span>
        <span>·</span>
        <span>{formatDate(review.createdAt)}</span>
      </div>

      {review.comment && (
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
          {review.comment}
        </p>
      )}

      {review.images.length > 0 && (
        <div className="mt-3 flex gap-2">
          {review.images.map((image) => (
            <div key={image.id} className="relative h-16 w-16 overflow-hidden bg-neutral-100">
              <Image src={image.url} alt="Review photo" fill className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}