// app/api/admin/products/route.ts

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
    // 🔒 FIXED: was commented out — this route had NO auth check at all.
    // const { user, response } = await requireAdminAPI();
    // if (response) return response;

    /* 2️⃣ Read formData */
    const formData = await req.formData();

    /* 3️⃣ Extract & normalize fields */
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const categoryId = formData.get("categoryId") as string | null;

    // 🔧 FIXED: an empty string ("" — e.g. an unselected <select>) is not
    // the same as "not provided" to Zod's .optional(), and would fail
    // genderEnum validation instead of being treated as unset.
    const genderRaw = formData.get("gender") as string | null;
    const gender = genderRaw && genderRaw.length > 0 ? genderRaw : undefined;

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

      price = Math.round(priceInRupees * 100); // rupees -> paise
    }

    const stock = formData.get("stock") ? Number(formData.get("stock")) : null;
    const isActive = formData.get("isActive") !== "false";

    // 🔧 FIXED: was thrown from inside .map() and swallowed into a
    // generic 500 by the outer catch — now returns a precise 400
    // immediately, before any Cloudinary uploads happen.
    const variantsRaw = formData.get("variants");
    let variants: { size: string; price: number; stock: number }[] = [];

    if (variantsRaw) {
      let parsedVariants: any[];
      try {
        parsedVariants = JSON.parse(variantsRaw as string);
      } catch {
        return NextResponse.json(
          { success: false, message: "Invalid variants format" },
          { status: 400 }
        );
      }

      for (const v of parsedVariants) {
        const variantPrice = Number(v.price);
        if (isNaN(variantPrice) || variantPrice < 0) {
          return NextResponse.json(
            { success: false, message: `Invalid price for variant "${v.size}"` },
            { status: 400 }
          );
        }
        variants.push({
          size: v.size,
          price: Math.round(variantPrice * 100), // rupees -> paise
          stock: Number(v.stock),
        });
      }
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
    const baseSlug = slugify(validated.name, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    /* 6️⃣ Upload images to Cloudinary */
    const imageFiles = formData.getAll("images") as File[];

    // 🔧 FIXED: was a thrown Error, swallowed into a generic 500 —
    // now a precise 400, matching the "at least one image" rule the
    // admin form also enforces client-side.
    if (!imageFiles.length) {
      return NextResponse.json(
        { success: false, message: "At least one image is required" },
        { status: 400 }
      );
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
        ...(validated.categoryId && { category: { connect: { id: validated.categoryId } } }),
        ...(validated.price !== null && validated.price !== undefined && { price: validated.price }),
        ...(validated.stock !== null && validated.stock !== undefined && { stock: validated.stock }),
        images: { create: uploadedImages },
        ...(validated.variants.length > 0 && { variants: { create: validated.variants } }),
      },
      include: {
        images: true,
        variants: true,
        category: true,
      },
    });

    return NextResponse.json(
      { success: true, message: "Product created successfully", product },
      { status: 201 }
    );
  } catch (err: any) {
    if (uploadedPublicIds.length) {
      await Promise.all(
        uploadedPublicIds.map((id) => cloudinary.uploader.destroy(id).catch(() => null))
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
    // const { user, response } = await requireAdminAPI();
    // if (response) return response;

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "10");
    const category = searchParams.get("category") || undefined;
    const gender = searchParams.get("gender") || undefined;
    const sort = searchParams.get("sort") || "latest";
    const isActiveParam = searchParams.get("isActive");
    // 🔧 FIXED: added — the admin products list frontend already has
    // a search box wired to this `q` param (against mock data until
    // now); this was the one gap flagged without a fix in the prior
    // handoff pass.
    const q = searchParams.get("q") || undefined;

    const skip = (page - 1) * limit;
    const where: any = {};

    if (isActiveParam === "true") where.isActive = true;
    if (isActiveParam === "false") where.isActive = false;
    if (category) where.category = { slug: category };
    if (gender) where.gender = gender;
    if (q) {
      where.name = { contains: q, mode: "insensitive" };
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
        totalPages: Math.ceil(total / limit),
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