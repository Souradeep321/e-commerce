import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Product slug required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findFirst({
      where: {
        slug,
        isActive: true, // 🚨 IMPORTANT
      },
      include: {
        images: true,
        variants: true,
        category: {
          select: { id: true, name: true, slug: true },
        },
        reviews: {
          take: 5,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product fetched successfully",
      product,
    }, { status: 200 });
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

