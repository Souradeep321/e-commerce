import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error-handler";

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        // await requireAdmin();

        const params = await context.params;
        const { id } = params;

        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                children: true,
                products: true,
            },
        });

        if (!category) {
            return NextResponse.json(
                { success: false, message: "Category not found" },
                { status: 404 }
            );
        }

        if (category.children.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Cannot delete category with subcategories",
                },
                { status: 400 }
            );
        }

        if (category.products.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Cannot delete category with products",
                },
                { status: 400 }
            );
        }

        await prisma.category.delete({ where: { id } });

        return NextResponse.json({
            success: true,
            message: "Category deleted successfully",
        }, { status: 200 });
    } catch (error: any) {
        console.error("Error in DELETE /api/admin/categories/[id]:", error);
        return handleApiError(error, "DELETE CATEGORY");
    }
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Category ID is required" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "10");
    const q = searchParams.get("q") || undefined;
    const gender = searchParams.get("gender") || undefined;
    const isActiveParam = searchParams.get("isActive"); // "true" | "false" | null
    const sort = searchParams.get("sort") || "latest";
    const skip = (page - 1) * limit;

    // Confirm the category exists BEFORE running the products query —
    // "category not found" and "category exists but has 0 matching
    // products" are different failure modes and shouldn't collapse
    // into the same response.
    const category = await prisma.category.findUnique({
      where: { id },
      include: { children: true },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    const productWhere: any = { categoryId: id };
    if (q) productWhere.name = { contains: q, mode: "insensitive" };
    if (gender) productWhere.gender = gender;
    if (isActiveParam === "true") productWhere.isActive = true;
    if (isActiveParam === "false") productWhere.isActive = false;
    // Admin sees both active and inactive by default (no isActive
    // filter applied unless explicitly requested) — same convention
    // as GET /api/admin/products.

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
          images: { take: 1, select: { url: true } },
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
    console.error("Error in GET /api/admin/categories/[id]:", error);
    return handleApiError(error, "FETCH CATEGORY");
  }
}