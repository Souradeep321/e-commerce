// app/api/products/search/route.ts
// ✅ ENHANCED - Searches product name, description, AND category name

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category");
    const gender = searchParams.get("gender");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort") || "newest";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // ========================================
    // BUILD WHERE CLAUSE
    // ========================================
    const where: any = {
      isActive: true,
    };

    // ✅ ENHANCED: Search by name, description, OR category name
    if (query) {
      where.OR = [
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
        // ✅ NEW: Search in category name too!
        {
          category: {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
        },
        // ✅ NEW: Search in category slug too!
        {
          category: {
            slug: {
              contains: query,
              mode: "insensitive",
            },
          },
        },
      ];
    }

    // Filter by specific category (overrides search)
    if (category) {
      const categoryRecord = await prisma.category.findUnique({
        where: { slug: category },
        select: { id: true },
      });

      if (categoryRecord) {
        where.categoryId = categoryRecord.id;
      }
    }

    // Filter by gender
    if (gender && ["MEN", "WOMEN", "UNISEX"].includes(gender.toUpperCase())) {
      where.gender = gender.toUpperCase();
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      const priceConditions: any[] = [];

      if (minPrice) {
        const min = parseInt(minPrice);
        priceConditions.push({
          OR: [
            { price: { gte: min } },
            { minPrice: { gte: min } },
          ],
        });
      }

      if (maxPrice) {
        const max = parseInt(maxPrice);
        priceConditions.push({
          OR: [
            { price: { lte: max } },
            { maxPrice: { lte: max } },
          ],
        });
      }

      if (priceConditions.length > 0) {
        where.AND = priceConditions;
      }
    }

    // ========================================
    // BUILD ORDER BY CLAUSE
    // ========================================
    let orderBy: any;

    switch (sort) {
      case "price_asc":
        orderBy = { price: "asc" };
        break;
      case "price_desc":
        orderBy = { price: "desc" };
        break;
      case "rating":
        orderBy = { createdAt: "desc" };
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    // ========================================
    // FETCH PRODUCTS
    // ========================================
    const [products, totalProducts] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          minPrice: true,
          maxPrice: true,
          gender: true,
          ourRecommendation: true,
          images: {
            take: 1,
            select: {
              url: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    // ========================================
    // ENHANCE WITH REVIEW STATS
    // ========================================
    const enhancedProducts = products.map(product => {
      const averageRating = product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : 0;

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        minPrice: product.minPrice,
        maxPrice: product.maxPrice,
        gender: product.gender,
        ourRecommendation: product.ourRecommendation,
        image: product.images[0]?.url || null,
        category: product.category,
        rating: Number(averageRating.toFixed(1)),
        reviewCount: product.reviews.length,
      };
    });

    return NextResponse.json({
      success: true,
      message: "Products fetched successfully",
      page,
      totalPages: Math.ceil(totalProducts / limit),
      totalItems: totalProducts,
      products: enhancedProducts,
      metadata: {
        query,
        category,
        gender,
        minPrice,
        maxPrice,
        sort,
      },
    });
  } catch (error: any) {
    console.error("PRODUCT SEARCH ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}