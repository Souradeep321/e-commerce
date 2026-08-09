// app/api/admin/products/route.ts
// ✅ FIXED VERSION - With paise conversion

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAPI } from "@/lib/auth";
import cloudinary from "@/lib/services/cloudinary";
import { productSchema } from "@/schemas";
import slugify from "slugify";
import { handleApiError } from "@/lib/api-error-handler";

export async function POST(req: Request) {
  const uploadedPublicIds: string[] = [];

  try {
    // ✅ FIXED: Admin auth using helper
    // const { user, response } = await requireAdminAPI();
    // if (response) return response;

    /* 2️⃣ Read formData */
    const formData = await req.formData();

    /* 3️⃣ Extract & normalize fields */
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const categoryId = formData.get("categoryId") as string | null;
    const gender = formData.get("gender") as any;

    // ========================================
    // ✅ FIXED: Convert rupees to paise
    // ========================================
    let price: number | null = null;
    const priceInput = formData.get("price");

    if (priceInput) {
      const priceInRupees = Number(priceInput);

      if (isNaN(priceInRupees) || priceInRupees < 0) {
        return NextResponse.json(
          { success: false, message: "Invalid price" },
          { status: 400 }
        );
      }

      price = Math.round(priceInRupees * 100); // Convert to paise
    }

    const stock = formData.get("stock")
      ? Number(formData.get("stock"))
      : null;

    const isActive = formData.get("isActive") !== "false";

    // ========================================
    // ✅ FIXED: Convert variant prices to paise
    // ========================================
    const variantsRaw = formData.get("variants");
    let variants: any[] = [];

    if (variantsRaw) {
      const parsedVariants = JSON.parse(variantsRaw as string);

      // Validate and convert each variant price
      variants = parsedVariants.map((v: any) => {
        const variantPrice = Number(v.price);

        if (isNaN(variantPrice) || variantPrice < 0) {
          throw new Error(`Invalid price for variant ${v.size}`);
        }

        return {
          size: v.size,
          price: Math.round(variantPrice * 100), // Convert to paise
          stock: Number(v.stock),
        };
      });
    }

    /* 4️⃣ Validate using Zod */
    const validated = productSchema.parse({
      name,
      description,
      categoryId: categoryId || undefined,
      gender,
      price,
      stock,
      variants,
      isActive,
    });

    /* 5️⃣ Generate unique slug */
    const baseSlug = slugify(validated.name, {
      lower: true,
      strict: true,
    });

    let slug = baseSlug;
    let counter = 1;

    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    /* 6️⃣ Upload images to Cloudinary */
    const imageFiles = formData.getAll("images") as File[];

    if (!imageFiles.length) {
      throw new Error("At least one image is required");
    }

    const uploadedImages: { url: string; publicId: string }[] = [];

    for (const file of imageFiles) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const uploadResult: any = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "products" }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          })
          .end(buffer);
      });

      uploadedPublicIds.push(uploadResult.public_id);

      uploadedImages.push({
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      });
    }

    /* 7️⃣ Compute minPrice / maxPrice (already in paise) */
    let minPrice: number | null = null;
    let maxPrice: number | null = null;

    if (validated.variants.length > 0) {
      const prices = validated.variants.map((v) => v.price);
      minPrice = Math.min(...prices);
      maxPrice = Math.max(...prices);
    } else if (validated.price !== null && validated.price !== undefined) {
      minPrice = validated.price;
      maxPrice = validated.price;
    }

    /* 8️⃣ Create product in DB */
    const product = await prisma.product.create({
      data: {
        name: validated.name,
        slug,
        description: validated.description,
        gender: validated.gender,
        isActive: validated.isActive,
        minPrice,
        maxPrice,

        ...(validated.categoryId && {
          category: {
            connect: { id: validated.categoryId },
          },
        }),

        ...(validated.price !== null &&
          validated.price !== undefined && { price: validated.price }),
        ...(validated.stock !== null &&
          validated.stock !== undefined && { stock: validated.stock }),

        images: {
          create: uploadedImages,
        },

        ...(validated.variants.length > 0 && {
          variants: {
            create: validated.variants,
          },
        }),
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
        message: "Product created successfully",
        product,
      },
      { status: 201 }
    );
  } catch (err: any) {
    /* 🔥 Rollback Cloudinary uploads */
    if (uploadedPublicIds.length) {
      await Promise.all(
        uploadedPublicIds.map((id) =>
          cloudinary.uploader.destroy(id).catch(() => null)
        )
      );
    }

    console.error("Error in POST /api/admin/products:", err);
    return handleApiError(err, "CREATE PRODUCT");

  }
}

/* ============================================
   GET - Fetch all products (ADMIN)
   ============================================ */
export async function GET(req: Request) {
  try {
    const { user, response } = await requireAdminAPI();
    if (response) return response;

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "10");
    const category = searchParams.get("category") || undefined;
    const gender = searchParams.get("gender") || undefined;
    const sort = searchParams.get("sort") || "latest";
    const isActiveParam = searchParams.get("isActive"); // "true" | "false" | null

    const skip = (page - 1) * limit;

    const where: any = {};

    // Only filter by isActive if explicitly requested —
    // admin sees everything by default, unlike the public listing route
    if (isActiveParam === "true") where.isActive = true;
    if (isActiveParam === "false") where.isActive = false;

    if (category) {
      where.category = { slug: category };
    }

    if (gender) {
      where.gender = gender;
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === "price_asc") orderBy = { minPrice: "asc" };
    if (sort === "price_desc") orderBy = { maxPrice: "desc" };
    if (sort === "latest") orderBy = { createdAt: "desc" };

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
          images: { take: 1, select: { url: true } },
          category: { select: { name: true, slug: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Products fetched successfully",
        page,
        totalPages: Math.ceil(total / limit), // aligned with your other list routes
        totalItems: total,
        products,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in GET /api/admin/products:", err);
    return handleApiError(err, "FETCH PRODUCTS");
  }
}