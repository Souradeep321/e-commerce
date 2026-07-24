// /api/products
// /api/products/[slug]       
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // ---------- Query params ----------
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 12);
    const category = searchParams.get("category"); // category slug
    const gender = searchParams.get("gender");     // MEN | WOMEN | UNISEX
    const sort = searchParams.get("sort");         // price_asc | price_desc | latest

    const skip = (page - 1) * limit;

    // ---------- Filters ----------
    const where: any = {
      isActive: true,
    };

    if (gender) {
      where.gender = gender;
    }

    if (category) {
      where.category = {
        slug: category,
      };
    }

    // ---------- Sorting ----------
    // Use minPrice for ascending (shows cheapest option first)
    // Use maxPrice for descending (shows most expensive option first)
    let orderBy: any = { createdAt: "desc" };

    if (sort === "price_asc")  orderBy = { minPrice: "asc" };
    if (sort === "price_desc") orderBy = { maxPrice: "desc" };
    if (sort === "latest")     orderBy = { createdAt: "desc" };

    // ---------- Query ----------
    const [products, total] = await Promise.all([
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
          isActive: true,
          gender: true,
          rating: true,
          images: {
            take: 1, // thumbnail only
            select: { url: true },
          },
          category: {
            select: { name: true, slug: true },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Products fetched successfully",
        page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        products,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}
