// app/api/reviews/[id]/route.ts
// ✅ FIXED - All issues resolved

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuthAPI } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

// PATCH - Update own review
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const uploadedPublicIds: string[] = [];

  try {
    const { user, response } = await requireAuthAPI();
    if (response) return response;

    const { id } = await params;

    // ✅ FIXED: Only read FormData (for images)
    const formData = await req.formData();
    const rating = formData.get("rating") ? Number(formData.get("rating")) : null;
    const comment = formData.get("comment") as string | null;
    const newImageFiles = formData.getAll("newImages") as File[];
    const deleteImageIds = formData.get("deleteImageIds")
      ? JSON.parse(formData.get("deleteImageIds") as string)
      : [];

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { success: false, message: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // ✅ FIXED: Check ownership FIRST, then get images
    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!review) {
      return NextResponse.json(
        { success: false, message: "Review not found" },
        { status: 404 }
      );
    }

    // ✅ Auth check BEFORE any modifications
    if (review.userId !== user!.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    // ✅ Validate total images after update
    const remainingImages = review.images.filter(
      img => !deleteImageIds.includes(img.id)
    ).length;
    const totalImagesAfterUpdate = remainingImages + newImageFiles.length;

    if (totalImagesAfterUpdate > 5) {
      return NextResponse.json(
        { success: false, message: "Maximum 5 images allowed per review" },
        { status: 400 }
      );
    }

    // ✅ Delete images from Cloudinary
    if (deleteImageIds.length > 0) {
      const imagesToDelete = review.images.filter(img =>
        deleteImageIds.includes(img.id)
      );

      // Delete from Cloudinary
      await Promise.all(
        imagesToDelete.map((img) =>
          cloudinary.uploader.destroy(img.publicId).catch(() => null)
        )
      );
    }

    // ✅ Upload new images to Cloudinary
    const uploadedImages: { url: string; publicId: string }[] = [];

    if (newImageFiles.length > 0) {
      for (const file of newImageFiles) {
        if (!file.type.startsWith("image/")) {
          continue;
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        const uploadResult: any = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: "reviews",
                transformation: [
                  { width: 800, height: 800, crop: "limit" },
                  { quality: "auto" }
                ]
              },
              (err, result) => {
                if (err) reject(err);
                else resolve(result);
              }
            )
            .end(buffer);
        });

        uploadedPublicIds.push(uploadResult.public_id);

        uploadedImages.push({
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
        });
      }
    }

    // ✅ Update review
    const updatedReview = await prisma.$transaction(async (tx) => {
      if (deleteImageIds.length > 0) {
        await tx.reviewImage.deleteMany({
          where: { id: { in: deleteImageIds }, reviewId: id },
        });
      }

      return tx.review.update({
        where: { id },
        data: {
          ...(rating && { rating }),
          ...(comment !== null && { comment }),
          ...(uploadedImages.length > 0 && { images: { create: uploadedImages } }),
        },
        include: {
          product: { select: { id: true, name: true, slug: true } },
          images: true,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (error: any) {
    console.error("UPDATE REVIEW ERROR:", error);

    // ✅ Rollback: Delete newly uploaded images
    if (uploadedPublicIds.length) {
      await Promise.all(
        uploadedPublicIds.map((id) =>
          cloudinary.uploader.destroy(id).catch(() => null)
        )
      );
    }

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

// DELETE - Delete own review
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, response } = await requireAuthAPI();
    if (response) return response;

    const { id } = await params;

    // ✅ FIXED: Get review with images
    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!review) {
      return NextResponse.json(
        { success: false, message: "Review not found" },
        { status: 404 }
      );
    }

    // ✅ FIXED: Check ownership BEFORE deleting anything
    if (review.userId !== user!.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    // ✅ NOW delete images from Cloudinary
    if (review.images.length > 0) {
      await Promise.all(
        review.images.map((img) =>
          cloudinary.uploader.destroy(img.publicId).catch(() => null)
        )
      );
    }

    // ✅ Delete review from database (cascade deletes ReviewImage records)
    await prisma.review.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE REVIEW ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}