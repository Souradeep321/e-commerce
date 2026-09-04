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
    // await requireAdmin();
    const params = await context.params;
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: {
          select: {
            id: true,
            url: true,
          },
        },
        variants: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
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
    console.error("Error in GET /api/admin/products/[id]:", error);
    return handleApiError(error, "FETCH ADMIN PRODUCT");
  }
}

// PATCH   /api/admin/products/[id]     → update product
// export async function PATCH(
//   req: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     // await requireAdmin();
//     const { id } = await params;
//     if (!id) {
//       return NextResponse.json(
//         { success: false, message: "Product ID is required" },
//         { status: 400 }
//       );
//     }

//     let rawData: any = {};

//     // Check content type to handle both JSON and FormData
//     const contentType = req.headers.get("content-type") || "";

//     if (contentType.includes("application/json")) {
//       rawData = await req.json();
//     } else if (contentType.includes("multipart/form-data")) {
//       const formData = await req.formData();

//       rawData = {
//         name: formData.get("name") || undefined,
//         description: formData.get("description") || undefined,
//         categoryId: formData.get("categoryId") || undefined,
//         gender: formData.get("gender") || undefined,
//         isActive: formData.get("isActive")
//           ? formData.get("isActive") === "true"
//           : undefined,
//         price: formData.get("price")
//           ? Number(formData.get("price"))
//           : undefined,
//         stock: formData.get("stock")
//           ? Number(formData.get("stock"))
//           : undefined,
//       };

//       const variantsField = formData.get("variants");
//       if (variantsField) {
//         try {
//           rawData.variants =
//             typeof variantsField === "string"
//               ? JSON.parse(variantsField)
//               : variantsField;
//         } catch (error) {
//           return NextResponse.json(
//             { success: false, message: "Invalid variants format" },
//             { status: 400 }
//           );
//         }
//       }
//     } else {
//       return NextResponse.json(
//         { success: false, message: "Unsupported content type" },
//         { status: 415 }
//       );
//     }

//     // ---------- Validate ----------
//     const parsed = updateProductSchema.safeParse(rawData);
//     if (!parsed.success) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Validation failed",
//           errors: parsed.error.format(),
//         },
//         { status: 400 }
//       );
//     }

//     const data = parsed.data;

//     // ---------- Validate category exists ----------
//     if (data.categoryId) {
//       const categoryExists = await prisma.category.findUnique({
//         where: { id: data.categoryId },
//         select: { id: true },
//       });

//       if (!categoryExists) {
//         return NextResponse.json(
//           { success: false, message: "Invalid category ID" },
//           { status: 400 }
//         );
//       }
//     }

//     // ---------- Handle variants if provided ----------
//     // Do this BEFORE the product update so we can compute minPrice/maxPrice
//     if (data.variants !== undefined) {
//       await prisma.productVariant.deleteMany({
//         where: { productId: id },
//       });

//       if (data.variants.length > 0) {
//         await prisma.productVariant.createMany({
//           data: data.variants.map((v) => ({
//             ...v,
//             productId: id,
//           })),
//         });
//       }
//     }

//     // ---------- Recalculate minPrice / maxPrice ----------
//     // We need the FINAL state of variants to compute this correctly,
//     // so fetch what's currently in the DB after the variant update above.
//     const currentVariants = await prisma.productVariant.findMany({
//       where: { productId: id },
//       select: { price: true },
//     });

//     let minPrice: number | null = null;
//     let maxPrice: number | null = null;

//     if (currentVariants.length > 0) {
//       // Product has variants → derive from them
//       const prices = currentVariants.map((v) => v.price);
//       minPrice = Math.min(...prices);
//       maxPrice = Math.max(...prices);
//     } else {
//       // No variants → use the incoming price if provided,
//       // otherwise fall back to the existing product price
//       const basePrice =
//         data.price !== undefined
//           ? data.price
//           : (
//             await prisma.product.findUnique({
//               where: { id },
//               select: { price: true },
//             })
//           )?.price ?? null;

//       if (basePrice !== null) {
//         minPrice = basePrice;
//         maxPrice = basePrice;
//       }
//     }

//     // ---------- Update product ----------
//     const updatedProduct = await prisma.product.update({
//       where: { id },
//       data: {
//         ...(data.name && {
//           name: data.name,
//           slug: slugify(data.name, { lower: true, strict: true }),
//         }),
//         ...(data.description && { description: data.description }),

//         // ✅ Use connect for category relation (same fix as POST)
//         ...(data.categoryId && {
//           category: {
//             connect: { id: data.categoryId },
//           },
//         }),

//         ...(data.gender && { gender: data.gender }),
//         ...(data.price !== undefined && { price: data.price }),
//         ...(data.stock !== undefined && { stock: data.stock }),
//         ...(data.isActive !== undefined && { isActive: data.isActive }),

//         // ✅ Always sync these so listing sorts stay correct
//         minPrice,
//         maxPrice,
//       },
//       include: {
//         images: true,
//         variants: true,
//         category: true,
//       },
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Product updated successfully",
//         product: updatedProduct,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error in PATCH /api/admin/products/[id]:", error);
//     return handleApiError(error, "PATCH PRODUCT");
//   }
// }

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { success: false, message: "Product ID is required" },
      { status: 400 }
    );
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: true,
      variants: true,
    },
  });

  if (!product) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }

  let body: {
    name?: string;
    description?: string;
    categoryId?: string | null;
    gender?: "MEN" | "WOMEN" | "UNISEX" | null;
    isActive?: boolean;
    ourRecommendation?: boolean;

    price?: number | null;
    stock?: number | null;

    variants?: {
      size: string;
      price: number;
      stock: number;
    }[];

    deleteImageIds?: string[];
  };

  const newUploadedPublicIds: string[] = [];

  try {
    const contentType = req.headers.get("content-type") ?? "";

    // --------------------------------------------------
    // Parse request
    // --------------------------------------------------

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      const priceInput = formData.get("price");
      const stockInput = formData.get("stock");

      const variantsInput = formData.get("variants");
      const deleteImageIdsInput = formData.get("deleteImageIds");

      body = {
        name: formData.get("name")?.toString(),
        description: formData.get("description")?.toString(),

        categoryId:
          formData.get("categoryId")?.toString() || null,

        gender:
          (formData.get("gender")?.toString() as
            | "MEN"
            | "WOMEN"
            | "UNISEX"
            | undefined) || null,

        isActive:
          formData.get("isActive") !== null
            ? formData.get("isActive") === "true"
            : undefined,

        ourRecommendation:
          formData.get("ourRecommendation") !== null
            ? formData.get("ourRecommendation") === "true"
            : undefined,

        price:
          priceInput !== null && priceInput.toString() !== ""
            ? Math.round(Number(priceInput) * 100)
            : null,

        stock:
          stockInput !== null && stockInput.toString() !== ""
            ? Number(stockInput)
            : null,

        variants:
          variantsInput
            ? JSON.parse(variantsInput.toString()).map(
              (variant: {
                size: string;
                price: number;
                stock: number;
              }) => ({
                size: variant.size,
                price: Math.round(Number(variant.price) * 100),
                stock: Number(variant.stock),
              })
            )
            : undefined,

        deleteImageIds:
          deleteImageIdsInput
            ? JSON.parse(deleteImageIdsInput.toString())
            : [],
      };

      // --------------------------------------------------
      // Upload new images
      // --------------------------------------------------

      const imageFiles = formData
        .getAll("images")
        .filter((value): value is File => value instanceof File);

      if (imageFiles.length > 0) {
        const uploadedImages = [];

        for (const file of imageFiles) {
          if (file.size === 0) continue;

          const buffer = Buffer.from(await file.arrayBuffer());

          const result = await new Promise<{
            secure_url: string;
            public_id: string;
          }>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: "products",
              },
              (error, result) => {
                if (error || !result) {
                  reject(error ?? new Error("Cloudinary upload failed"));
                  return;
                }

                resolve({
                  secure_url: result.secure_url,
                  public_id: result.public_id,
                });
              }
            );

            uploadStream.end(buffer);
          });

          newUploadedPublicIds.push(result.public_id);

          uploadedImages.push({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }

        body = {
          ...body,
          // temporary property used internally
          ...(uploadedImages.length > 0
            ? { newImages: uploadedImages }
            : {}),
        } as typeof body & {
          newImages: {
            url: string;
            publicId: string;
          }[];
        };
      }
    } else {
      body = await req.json();
    }

    // --------------------------------------------------
    // Validate request
    // --------------------------------------------------

    const validated = updateProductSchema.parse(body);

    const deleteImageIds = body.deleteImageIds ?? [];

    // --------------------------------------------------
    // Validate category
    // --------------------------------------------------

    if (validated.categoryId) {
      const category = await prisma.category.findUnique({
        where: {
          id: validated.categoryId,
        },
      });

      if (!category) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 400 }
        );
      }
    }

    // --------------------------------------------------
    // Validate image deletion IDs
    // --------------------------------------------------

    const imagesToDelete =
      deleteImageIds.length > 0
        ? product.images.filter((image) =>
          deleteImageIds.includes(image.id)
        )
        : [];

    if (imagesToDelete.length !== deleteImageIds.length) {
      return NextResponse.json(
        { error: "One or more images do not belong to this product" },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Determine pricing mode
    // --------------------------------------------------

    const hasVariants =
      validated.variants !== undefined &&
      validated.variants.length > 0;

    // Simple pricing
    let price: number | null = validated.price ?? null;
    let stock: number | null = validated.stock ?? null;

    let minPrice: number | null = null;
    let maxPrice: number | null = null;

    if (hasVariants) {
      price = null;
      stock = null;

      const prices = validated.variants!.map(
        (variant) => variant.price
      );

      minPrice = Math.min(...prices);
      maxPrice = Math.max(...prices);
    } else {
      minPrice = price;
      maxPrice = price;
    }

    // --------------------------------------------------
    // Prevent deleting every image
    // --------------------------------------------------

    const remainingExistingImages =
      product.images.filter(
        (image) => !deleteImageIds.includes(image.id)
      );

    const newImages =
      "newImages" in body
        ? (
          body as typeof body & {
            newImages?: {
              url: string;
              publicId: string;
            }[];
          }
        ).newImages ?? []
        : [];

    const totalImages =
      remainingExistingImages.length + newImages.length;

    if (totalImages === 0) {
      return NextResponse.json(
        { error: "At least one product image is required" },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Update product
    // --------------------------------------------------

    const updatedProduct = await prisma.$transaction(async (tx) => {
      // If variants were supplied, replace all variants.
      if (validated.variants !== undefined) {
        await tx.productVariant.deleteMany({
          where: {
            productId: id,
          },
        });

        if (validated.variants.length > 0) {
          await tx.productVariant.createMany({
            data: validated.variants.map((variant) => ({
              productId: id,
              size: variant.size,
              price: variant.price,
              stock: variant.stock,
            })),
          });
        }
      }

      // Delete selected ProductImage records.
      if (imagesToDelete.length > 0) {
        await tx.productImage.deleteMany({
          where: {
            id: {
              in: imagesToDelete.map((image) => image.id),
            },
          },
        });
      }

      // Create newly uploaded images.
      if (newImages.length > 0) {
        await tx.productImage.createMany({
          data: newImages.map((image) => ({
            productId: id,
            url: image.url,
            publicId: image.publicId,
          })),
        });
      }

      return tx.product.update({
        where: {
          id,
        },
        data: {
          name: validated.name,
          description: validated.description,
          categoryId: validated.categoryId,
          gender: validated.gender,
          isActive: validated.isActive,
          ourRecommendation: validated.ourRecommendation,

          price,
          stock,
          minPrice,
          maxPrice,
        },

        include: {
          images: true,
          variants: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });
    });

    // --------------------------------------------------
    // Delete removed Cloudinary images
    // --------------------------------------------------

    for (const image of imagesToDelete) {
      try {
        await cloudinary.uploader.destroy(image.publicId);
      } catch (error) {
        console.error(
          "Failed to delete Cloudinary image:",
          image.publicId,
          error
        );
      }
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    // --------------------------------------------------
    // Rollback newly uploaded Cloudinary images
    // --------------------------------------------------

    if (newUploadedPublicIds.length > 0) {
      await Promise.allSettled(
        newUploadedPublicIds.map((publicId) =>
          cloudinary.uploader.destroy(publicId)
        )
      );
    }

    console.error("PATCH /api/admin/products/[id] error:", error);

    console.error("Error in PATCH /api/admin/products/[id]:", error);
    return handleApiError(error, "PATCH PRODUCT");
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
    console.error("Error in DELETE /api/admin/products/[id]:", error);
    return handleApiError(error, "DELETE PRODUCT");
  }
}


