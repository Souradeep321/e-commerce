import { handleApiError } from "@/lib/api-error-handler";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Products are paginated, but categories are not. This is because categories are
// expected to be a small, finite set of data, while products can be very large.
// If categories ever become too large to return in a single response, we can
// add pagination later.
export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Category slug required" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url);

    // Pagination
    const page = Math.max(1, Number(searchParams.get("page") || "1"));

    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") || "12")));

    const skip = (page - 1) * limit;

    // Filters
    const q = searchParams.get("q") || undefined;
    const gender = searchParams.get("gender") || undefined;
    const sort = searchParams.get("sort") || "latest";

    // Find category by slug
    const category = await prisma.category.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        parentId: true,
        children: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    // Build product filters
    // Public users should only see active products
    const productWhere: any = {
      categoryId: category.id,
      isActive: true,
    };

    if (q) {
      productWhere.name = {
        contains: q,
        mode: "insensitive",
      };
    }
    if (gender) productWhere.gender = gender;



    let orderBy: any = { createdAt: "desc" };
    if (sort === "price_asc") orderBy = { minPrice: "asc" };
    if (sort === "price_desc") orderBy = { maxPrice: "desc" };

    // Two parallel queries, not a nested include with pagination
    // baked in — same shape as GET /api/admin/products, and it keeps
    // the response flat (category metadata + a sibling paginated
    // `products` array) rather than nesting an unbounded-looking
    // `category.products`.
    const [products, totalItems] = await Promise.all([
      prisma.product.findMany({
        where: productWhere,
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
          images: {
            take: 1,
            select: {
              url: true,
            },
          },
        },
      }),
      prisma.product.count({ where: productWhere }),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Category fetched successfully",
        category: {
          id: category.id,
          name: category.name,
          slug: category.slug,
          parentId: category.parentId,
          children: category.children,
        },
        products,
        page,
        totalPages: Math.max(1, Math.ceil(totalItems / limit)),
        totalItems,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in GET /api/categories/[slug]:", error);
    return handleApiError(error, "FETCH CATEGORY BY SLUG");
  }
}

