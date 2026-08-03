// app/api/products/[slug]/can-review/route.ts
// Check if user can review this product

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuthAPI } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error-handler";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { user, response } = await requireAuthAPI();
    if (response) return response;

    const { slug } = await params;

    // Get product
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

    // Find all delivered orders containing this product
    const deliveredOrders = await prisma.order.findMany({
      where: {
        userId: user!.id,
        status: "DELIVERED",
        items: {
          some: {
            productId: product.id,
          },
        },
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    if (deliveredOrders.length === 0) {
      return NextResponse.json({
        success: false,
        canReview: false,
        message: "You haven't received this product yet",
      });
    }

    // Check if user already reviewed this product from any order
    const existingReviews = await prisma.review.findMany({
      where: {
        userId: user!.id,
        productId: product.id,
      },
      select: {
        orderId: true,
      },
    });

    const reviewedOrderIds = existingReviews.map(r => r.orderId);
    const unreviewedOrders = deliveredOrders.filter(
      order => !reviewedOrderIds.includes(order.id)
    );

    if (unreviewedOrders.length === 0) {
      return NextResponse.json({
        success: false,
        canReview: false,
        message: "You have already reviewed this product",
      });
    }

    return NextResponse.json({
      success: true,
      canReview: true,
      message: "You can review this product",
      availableOrders: unreviewedOrders,
    });
  } catch (error: any) {
    console.error("Error in GET /api/products/[slug]/can-review:", error);
    return handleApiError(error, "GET /api/products/[slug]/can-review");
  }
}