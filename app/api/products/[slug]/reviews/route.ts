// app/api/products/[slug]/reviews/route.ts
// ✅ FIXED - Proper pagination response

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuthAPI } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { writeRateLimit } from "@/lib/rate-limit";
import {checkRateLimit} from "@/lib/rate-limit-helper";

// GET - Fetch all reviews for a product with pagination
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // ✅ Get reviews and total count in parallel
    const [reviews, totalReviews] = await Promise.all([
      prisma.review.findMany({
        where: { productId: product.id },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          images: true, // ✅ Include review images
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.review.count({
        where: { productId: product.id },
      }),
    ]);

    // ✅ Calculate stats from ALL reviews (not just current page)
    const allReviews = await prisma.review.findMany({
      where: { productId: product.id },
      select: { rating: true },
    });

    const averageRating = allReviews.length > 0
      ? allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length
      : 0;

    const ratingCounts = {
      5: allReviews.filter(r => r.rating === 5).length,
      4: allReviews.filter(r => r.rating === 4).length,
      3: allReviews.filter(r => r.rating === 3).length,
      2: allReviews.filter(r => r.rating === 2).length,
      1: allReviews.filter(r => r.rating === 1).length,
    };

    return NextResponse.json({
      success: true,
      message: "Reviews fetched successfully",
      page,
      totalPages: Math.ceil(totalReviews / limit),
      totalItems: totalReviews,
      data: {
        reviews,
        totalReviews,
        averageRating: Number(averageRating.toFixed(1)),
        ratingCounts,
      },
    });
  } catch (error: any) {
    console.error("GET REVIEWS ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

// POST - Create review with images (same as before)
export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const uploadedPublicIds: string[] = [];

  try {
    const { user, response } = await requireAuthAPI();
    if (response) return response;

    const ratelimitResponse = await checkRateLimit(writeRateLimit, `create-review:${user!.email}`);
    if (ratelimitResponse) return ratelimitResponse;

    const { slug } = await params;

    // Read FormData (for images)
    const formData = await req.formData();
    const rating = Number(formData.get("rating"));
    const comment = formData.get("comment") as string | null;
    const orderId = formData.get("orderId") as string;
    const imageFiles = formData.getAll("images") as File[];

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Validate image count (max 5)
    if (imageFiles.length > 5) {
      return NextResponse.json(
        { success: false, message: "Maximum 5 images allowed" },
        { status: 400 }
      );
    }

    // Get product
    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true, name: true },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Verify: User bought this product AND order is delivered
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: user!.id,
        status: "DELIVERED",
        items: {
          some: {
            productId: product.id,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "You can only review products from delivered orders",
        },
        { status: 403 }
      );
    }

    // Check if already reviewed
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId_orderId: {
          userId: user!.id,
          productId: product.id,
          orderId: orderId,
        },
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { success: false, message: "You have already reviewed this product" },
        { status: 409 }
      );
    }

    // Upload images to Cloudinary
    const uploadedImages: { url: string; publicId: string }[] = [];

    if (imageFiles.length > 0) {
      for (const file of imageFiles) {
        if (!file.type.startsWith("image/")) {
          continue;
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        const uploadResult: any = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { 
                folder: "reviews",
                transformation: [
                  { width: 800, height: 800, crop: "limit" },
                  { quality: "auto" }
                ]
              },
              (err, result) => {
                if (err) reject(err);
                else resolve(result);
              }
            )
            .end(buffer);
        });

        uploadedPublicIds.push(uploadResult.public_id);

        uploadedImages.push({
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
        });
      }
    }

    // Create review with images
    const review = await prisma.review.create({
      data: {
        userId: user!.id,
        productId: product.id,
        orderId: orderId,
        rating,
        comment: comment || null,
        ...(uploadedImages.length > 0 && {
          images: {
            create: uploadedImages,
          },
        }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
          },
        },
        images: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully",
      review,
    }, { status: 201 });
  } catch (error: any) {
    console.error("CREATE REVIEW ERROR:", error);

    // Rollback: Delete uploaded images
    if (uploadedPublicIds.length) {
      await Promise.all(
        uploadedPublicIds.map((id) =>
          cloudinary.uploader.destroy(id).catch(() => null)
        )
      );
    }

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}