// app/api/reviews/route.ts
// ✅ FIXED - Proper pagination response

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuthAPI } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error-handler";

// GET - Fetch user's own reviews
export async function GET(req: Request) {
  try {
    const { user, response } = await requireAuthAPI();
    if (response) return response;

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // ✅ Get total count for pagination
    const [reviews, totalReviews] = await Promise.all([
      prisma.review.findMany({
        where: { userId: user!.id },
        skip,
        take: limit,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: { take: 1, select: { url: true } },
            },
          },
          order: {
            select: {
              id: true,
              createdAt: true,
            },
          },
          images: true, // ✅ Include review images
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.review.count({
        where: { userId: user!.id },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Your reviews fetched successfully",
      page,
      totalPages: Math.ceil(totalReviews / limit),
      totalItems: totalReviews,
      reviews,
    }, { status: 200 });
  } catch (error: any) {
    console.error("Error in GET /api/reviews:", error);
    return handleApiError(error, "GET /api/reviews");
  }
}