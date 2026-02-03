import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { productSchema } from "@/schemas";
import slugify from "slugify";

//  POST /api/admin/products -->  Create product (ADMIN)

// export async function POST(req: Request) {
//   const uploadedPublicIds: string[] = [];

//   try {
//     /* 1️⃣ Admin auth */
//     // await requireAdmin();

//     /* 2️⃣ Read formData */
//     const formData = await req.formData();

//     /* 3️⃣ Extract & normalize fields */
//     const name = formData.get("name") as string;
//     const description = formData.get("description") as string;
//     const categoryId = formData.get("categoryId") as string | null;
//     const gender = formData.get("gender") as any;

//     const price = formData.get("price")
//       ? Number(formData.get("price"))
//       : null;

//     const stock = formData.get("stock")
//       ? Number(formData.get("stock"))
//       : null;

//     const isActive = formData.get("isActive") !== "false";

//     const variantsRaw = formData.get("variants");
//     const variants = variantsRaw
//       ? JSON.parse(variantsRaw as string)
//       : [];

//     /* 4️⃣ Validate using Zod */
//     const validated = productSchema.parse({
//       name,
//       description,
//       categoryId: categoryId || undefined,
//       gender,
//       price,
//       stock,
//       variants,
//       isActive,
//     });

//     /* 5️⃣ Generate unique slug */
//     const baseSlug = slugify(validated.name, {
//       lower: true,
//       strict: true,
//     });

//     let slug = baseSlug;
//     let counter = 1;

//     while (await prisma.product.findUnique({ where: { slug } })) {
//       slug = `${baseSlug}-${counter++}`;
//     }

//     /* 6️⃣ Upload images to Cloudinary */
//     const imageFiles = formData.getAll("images") as File[];

//     if (!imageFiles.length) {
//       throw new Error("At least one image is required");
//     }

//     const uploadedImages = [];

//     for (const file of imageFiles) {
//       const buffer = Buffer.from(await file.arrayBuffer());

//       const uploadResult: any = await new Promise((resolve, reject) => {
//         cloudinary.uploader
//           .upload_stream({ folder: "products" }, (err, result) => {
//             if (err) reject(err);
//             else resolve(result);
//           })
//           .end(buffer);
//       });

//       uploadedPublicIds.push(uploadResult.public_id);

//       uploadedImages.push({
//         url: uploadResult.secure_url,
//         publicId: uploadResult.public_id,
//       });
//     }

//     /* 7️⃣ Create product in DB */
//     const product = await prisma.product.create({
//       data: {
//         name: validated.name,
//         slug,
//         description: validated.description,
//         categoryId: validated.categoryId,
//         gender: validated.gender,
//         isActive: validated.isActive,

//         ...(validated.price !== null && { price: validated.price }),
//         ...(validated.stock !== null && { stock: validated.stock }),

//         images: {
//           create: uploadedImages,
//         },

//         ...(validated.variants.length > 0 && {
//           variants: {
//             create: validated.variants,
//           },
//         }),
//       },
//       include: {
//         images: true,
//         variants: true,
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Product created successfully",
//       product
//     }, { status: 201 });
//   } catch (err: any) {
//     console.error("POST ADMIN PRODUCT ERROR:", err);
//     /* 🔥 Rollback Cloudinary uploads */
//     if (uploadedPublicIds.length) {
//       await Promise.all(
//         uploadedPublicIds.map((id) =>
//           cloudinary.uploader.destroy(id).catch(() => null)
//         )
//       );
//     }

//     return NextResponse.json(
//       {
//         success: false,
//         message: err?.message || "Product creation failed",
//       },
//       { status: 400 }
//     );
//   }
// }

export async function POST(req: Request) {
  const uploadedPublicIds: string[] = [];

  try {
    /* 1️⃣ Admin auth */
    // await requireAdmin();

    /* 2️⃣ Read formData */
    const formData = await req.formData();

    /* 3️⃣ Extract & normalize fields */
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const categoryId = formData.get("categoryId") as string | null;
    const gender = formData.get("gender") as any;

    const price = formData.get("price")
      ? Number(formData.get("price"))
      : null;

    const stock = formData.get("stock")
      ? Number(formData.get("stock"))
      : null;

    const isActive = formData.get("isActive") !== "false";

    const variantsRaw = formData.get("variants");
    const variants = variantsRaw ? JSON.parse(variantsRaw as string) : [];

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

    /* 7️⃣ Compute minPrice / maxPrice */
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

        // ✅ Use connect{} for the relation — Prisma 7 doesn't allow categoryId directly
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
    console.error("POST ADMIN PRODUCT ERROR:", err);

    /* 🔥 Rollback Cloudinary uploads */
    if (uploadedPublicIds.length) {
      await Promise.all(
        uploadedPublicIds.map((id) =>
          cloudinary.uploader.destroy(id).catch(() => null)
        )
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Product creation failed",
      },
      { status: 400 }
    );
  }
}

//  GET /api/admin/products -->  Get all products (ADMIN)
export async function GET(req: Request) {
  try {
    /* 1️⃣ Admin auth */
    // await requireAdmin();

    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category:
          { select: { id: true, name: true, slug: true, }, },
        images: {
          take: 1, // thumbnail
          select: {
            url: true,
          },
        },
        variants: true,
      },
    });

    if (!products || products.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No products found",
        products: []
      }, { status: 404 });
    }


    return NextResponse.json({
      success: true,
      message: "Products fetched successfully",
      products
    }, { status: 200 });
  } catch (err: any) {
    console.error("GET ADMIN PRODUCTS ERROR:", err);
    return NextResponse.json({
      success: false,
      message: err?.message || "Failed to fetch products",
    }, { status: 400 });
  }
}