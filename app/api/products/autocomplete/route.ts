// app/api/products/autocomplete/route.ts
// ✅ ENHANCED - Also searches in category names

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    // Return empty if query too short
    if (query.length < 2) {
      return NextResponse.json({
        success: true,
        suggestions: {
          products: [],
          categories: [],
        },
      });
    }

    // ========================================
    // ✅ ENHANCED: Search in name, description, AND category
    // ========================================
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
          // ✅ NEW: Search by category name
          {
            category: {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
          // ✅ NEW: Search by category slug
          {
            category: {
              slug: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
        ],
      },
      take: 10,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        minPrice: true,
        maxPrice: true,
        images: {
          take: 1,
          select: {
            url: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        ourRecommendation: "desc",
      },
    });

    // ========================================
    // SEARCH CATEGORIES
    // ========================================
    const categories = await prisma.category.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      take: 5,
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    // ========================================
    // FORMAT RESPONSE
    // ========================================
    const suggestions = {
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price || p.minPrice,
        maxPrice: p.maxPrice,
        image: p.images[0]?.url,
        category: p.category?.name,
        type: "product",
      })),
      categories: categories.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        type: "category",
      })),
    };

    return NextResponse.json({
      success: true,
      query,
      suggestions,
    });
  } catch (error: any) {
    console.error("AUTOCOMPLETE ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}