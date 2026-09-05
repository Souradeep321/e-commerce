// app/api/admin/products/[id]/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import cloudinary from "@/lib/services/cloudinary";
import { updateProductSchema } from "@/schemas";
import slugify from "slugify";
import { handleApiError } from "@/lib/api-error-handler";

//  GET   /api/admin/products/[id]      → get single product (edit page)
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    // 🔒 FIXED: was commented out — anyone could fetch any product's
    // full admin detail with no auth at all.
    await requireAdmin();

    const params = await context.params;
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: {
          select: { id: true, url: true },
        },
        variants: true,
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "Product fetched successfully", product },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/admin/products/[id]:", error);
    return handleApiError(error, "FETCH ADMIN PRODUCT");
  }
}

// PATCH   /api/admin/products/[id]     → update product
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 🔒 FIXED: was commented out.
    await requireAdmin();

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    let rawData: any = {};

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      rawData = await req.json();
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      rawData = {
        name: formData.get("name") || undefined,
        description: formData.get("description") || undefined,
        categoryId: formData.get("categoryId") || undefined,
        // 🔧 Same empty-string-vs-unset fragility as the POST route.
        gender: (() => {
          const g = formData.get("gender") as string | null;
          return g && g.length > 0 ? g : undefined;
        })(),
        isActive: formData.get("isActive") ? formData.get("isActive") === "true" : undefined,
        // 🔧 FIXED: was defined in updateProductSchema but never
        // actually read here or applied below — the toggle did nothing.
        ourRecommendation: formData.get("ourRecommendation")
          ? formData.get("ourRecommendation") === "true"
          : undefined,
        price: formData.get("price") ? Number(formData.get("price")) : undefined,
        stock: formData.get("stock") ? Number(formData.get("stock")) : undefined,
      };

      const variantsField = formData.get("variants");
      if (variantsField) {
        try {
          rawData.variants = typeof variantsField === "string" ? JSON.parse(variantsField) : variantsField;
        } catch {
          return NextResponse.json(
            { success: false, message: "Invalid variants format" },
            { status: 400 }
          );
        }
      }
    } else {
      return NextResponse.json(
        { success: false, message: "Unsupported content type" },
        { status: 415 }
      );
    }

    // ---------- Validate ----------
    const parsed = updateProductSchema.safeParse(rawData);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: parsed.error.format() },
        { status: 400 }
      );
    }
    const data = parsed.data;

    // ---------- Validate category exists ----------
    if (data.categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: data.categoryId },
        select: { id: true },
      });
      if (!categoryExists) {
        return NextResponse.json(
          { success: false, message: "Invalid category ID" },
          { status: 400 }
        );
      }
    }

    // ---------- Handle variants if provided ----------
    if (data.variants !== undefined) {
      await prisma.productVariant.deleteMany({ where: { productId: id } });
      if (data.variants.length > 0) {
        await prisma.productVariant.createMany({
          data: data.variants.map((v) => ({ ...v, productId: id })),
        });
      }
    }

    // ---------- Recalculate minPrice / maxPrice ----------
    const currentVariants = await prisma.productVariant.findMany({
      where: { productId: id },
      select: { price: true },
    });

    let minPrice: number | null = null;
    let maxPrice: number | null = null;

    if (currentVariants.length > 0) {
      const prices = currentVariants.map((v) => v.price);
      minPrice = Math.min(...prices);
      maxPrice = Math.max(...prices);
    } else {
      const basePrice =
        data.price !== undefined
          ? data.price
          : (await prisma.product.findUnique({ where: { id }, select: { price: true } }))?.price ?? null;

      if (basePrice !== null) {
        minPrice = basePrice;
        maxPrice = basePrice;
      }
    }

    // ---------- Update product ----------
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name, slug: slugify(data.name, { lower: true, strict: true }) }),
        ...(data.description && { description: data.description }),
        ...(data.categoryId && { category: { connect: { id: data.categoryId } } }),
        ...(data.gender && { gender: data.gender }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.stock !== undefined && { stock: data.stock }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.ourRecommendation !== undefined && { ourRecommendation: data.ourRecommendation }),
        minPrice,
        maxPrice,
      },
      include: {
        images: true,
        variants: true,
        category: true,
      },
    });

    return NextResponse.json(
      { success: true, message: "Product updated successfully", product: updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PATCH /api/admin/products/[id]:", error);
    return handleApiError(error, "PATCH PRODUCT");
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 🔒 FIXED: was commented out.
    await requireAdmin();

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ message: "Product ID missing" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // 🆕 Explicit pre-check for the Restrict constraint on
    // OrderItem.product (schema.prisma). Without this, attempting to
    // delete a previously-ordered product hits a Prisma foreign-key
    // error that handleApiError maps to "Related record not found" —
    // technically-confusing wording for "a related record EXISTS and
    // is blocking this delete." This gives an accurate, actionable
    // message instead, and fails fast before touching anything.
    const orderItemCount = await prisma.orderItem.count({ where: { productId: id } });
    if (orderItemCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This product has order history and can't be deleted. Mark it Inactive instead to hide it from the storefront while preserving past orders.",
        },
        { status: 409 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.productVariant.deleteMany({ where: { productId: id } });
      await tx.productImage.deleteMany({ where: { productId: id } });
      await tx.product.delete({ where: { id } });
    });

    const publicIds = product.images.map((img) => img.publicId).filter(Boolean);
    if (publicIds.length > 0) {
      await cloudinary.api.delete_resources(publicIds);
    }

    return NextResponse.json(
      { success: true, message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /api/admin/products/[id]:", error);
    return handleApiError(error, "DELETE PRODUCT");
  }
}