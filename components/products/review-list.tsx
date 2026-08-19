"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DotLoader } from "@/components/ui/dotLoader";
import { Review } from "@/types/api/review.types";
import { ReviewItem } from "./review-item";
// import { getProductReviews } from "@/lib/api/reviews";
import { mockReviewsPage2 } from "@/lib/mock-data"; // TEMP — remove once real fetch is wired


interface ReviewListProps {
    productSlug: string;
    initialReviews: Review[];
    initialPage: number;
    initialTotalPages: number;
}

export function ReviewList({
    productSlug,
    initialReviews,
    initialPage,
    initialTotalPages,
}: ReviewListProps) {
    const [reviews, setReviews] = useState(initialReviews);
    const [page, setPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(initialTotalPages);
    const [loading, setLoading] = useState(false);

    const hasMore = page < totalPages;

    async function handleLoadMore() {
        setLoading(true);

        // TODO: swap for the real call once backend/data is ready:
        // const res = await getProductReviews(productSlug, { page: page + 1 });
        // setReviews((prev) => [...prev, ...res.data.reviews]);
        // setPage(res.page);
        // setTotalPages(res.totalPages);

        await new Promise((resolve) => setTimeout(resolve, 500)); // simulate network delay
        setReviews((prev) => [...prev, ...mockReviewsPage2]);
        setPage((prev) => prev + 1);
        setLoading(false);
    }

    return (
        <div>
            <h3 className="mb-4 text-sm font-medium text-neutral-900">
                {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
            </h3>

            <div className="divide-y divide-neutral-200">
                {reviews.map((review) => (
                    <ReviewItem key={review.id} review={review} />
                ))}
            </div>

            {hasMore && (
                <div className="mt-6 flex justify-center">
                    <Button variant="outline" onClick={handleLoadMore} disabled={loading}>
                        {loading ? <DotLoader /> : "Load More Reviews"}
                    </Button>
                </div>
            )}
        </div>
    );
}