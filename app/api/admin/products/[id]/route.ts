import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { updateProductSchema } from "@/schemas";
import slugify from "slugify";

//  GET   /api/admin/products/[id]      → get single product (edit page)
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    // await requireAdmin();
    const params = await context.params;
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: true,
        variants: true,
        category: {
          select: { id: true, name: true, slug: true }
        }
      }
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Product fetched successfully",
      product
    }, { status: 200 });
  } catch (error) {
    console.error("GET ADMIN PRODUCT ERROR:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch product"
    }, { status: 500 });
  }
}

// PATCH   /api/admin/products/[id]     → update product
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // await requireAdmin();
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    let rawData: any = {};

    // Check content type to handle both JSON and FormData
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      rawData = await req.json();
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      rawData = {
        name: formData.get("name") || undefined,
        description: formData.get("description") || undefined,
        categoryId: formData.get("categoryId") || undefined,
        gender: formData.get("gender") || undefined,
        isActive: formData.get("isActive")
          ? formData.get("isActive") === "true"
          : undefined,
        price: formData.get("price")
          ? Number(formData.get("price"))
          : undefined,
        stock: formData.get("stock")
          ? Number(formData.get("stock"))
          : undefined,
      };

      const variantsField = formData.get("variants");
      if (variantsField) {
        try {
          rawData.variants =
            typeof variantsField === "string"
              ? JSON.parse(variantsField)
              : variantsField;
        } catch (error) {
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
        {
          success: false,
          message: "Validation failed",
          errors: parsed.error.format(),
        },
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
    // Do this BEFORE the product update so we can compute minPrice/maxPrice
    if (data.variants !== undefined) {
      await prisma.productVariant.deleteMany({
        where: { productId: id },
      });

      if (data.variants.length > 0) {
        await prisma.productVariant.createMany({
          data: data.variants.map((v) => ({
            ...v,
            productId: id,
          })),
        });
      }
    }

    // ---------- Recalculate minPrice / maxPrice ----------
    // We need the FINAL state of variants to compute this correctly,
    // so fetch what's currently in the DB after the variant update above.
    const currentVariants = await prisma.productVariant.findMany({
      where: { productId: id },
      select: { price: true },
    });

    let minPrice: number | null = null;
    let maxPrice: number | null = null;

    if (currentVariants.length > 0) {
      // Product has variants → derive from them
      const prices = currentVariants.map((v) => v.price);
      minPrice = Math.min(...prices);
      maxPrice = Math.max(...prices);
    } else {
      // No variants → use the incoming price if provided,
      // otherwise fall back to the existing product price
      const basePrice =
        data.price !== undefined
          ? data.price
          : (
            await prisma.product.findUnique({
              where: { id },
              select: { price: true },
            })
          )?.price ?? null;

      if (basePrice !== null) {
        minPrice = basePrice;
        maxPrice = basePrice;
      }
    }

    // ---------- Update product ----------
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...(data.name && {
          name: data.name,
          slug: slugify(data.name, { lower: true, strict: true }),
        }),
        ...(data.description && { description: data.description }),

        // ✅ Use connect for category relation (same fix as POST)
        ...(data.categoryId && {
          category: {
            connect: { id: data.categoryId },
          },
        }),

        ...(data.gender && { gender: data.gender }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.stock !== undefined && { stock: data.stock }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),

        // ✅ Always sync these so listing sorts stay correct
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
      {
        success: true,
        message: "Product updated successfully",
        product: updatedProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH PRODUCT ERROR:", error);

    if ((error as any)?.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    if ((error as any)?.code === "P2002") {
      return NextResponse.json(
        { success: false, message: "Product with this name already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update product",
        error:
          process.env.NODE_ENV === "development"
            ? (error as any)?.message
            : undefined,
      },
      { status: 500 }
    );
  }
}

// DELETE  /api/admin/products/[id]     → delete product
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // await requireAdmin();

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

    await prisma.$transaction(async (tx) => {
      // 1️⃣ Delete variants
      await tx.productVariant.deleteMany({
        where: { productId: id },
      });

      // 2️⃣ Delete images
      await tx.productImage.deleteMany({
        where: { productId: id },
      });

      // 3️⃣ Delete product
      await tx.product.delete({
        where: { id },
      });
    });

    // 4️⃣ Cloudinary cleanup
    const publicIds = product.images
      .map((img) => img.publicId)
      .filter(Boolean);

    if (publicIds.length > 0) {
      await cloudinary.api.delete_resources(publicIds);
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete product" },
      { status: 500 }
    );
  }
}


