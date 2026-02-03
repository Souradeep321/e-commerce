// lib/validations/product.ts
import * as z from "zod";

/* ---------------- ENUMS ---------------- */
export const genderEnum = z.enum(["MEN", "WOMEN", "UNISEX"]);

/* ---------------- VARIANT ---------------- */
export const productVariantSchema = z.object({
  size: z.string().min(1, "Size is required"),
  price: z.number().int().positive("Price must be positive"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
});

/* ---------------- PRODUCT (create) ---------------- */
export const productSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters").max(150),
    description: z.string().min(10, "Description must be at least 10 characters"),
    categoryId: z.string().cuid("Invalid category ID").optional(),
    gender: genderEnum.optional(),
    price: z.number().int().positive("Price must be positive").optional().nullable(),
    stock: z.number().int().min(0, "Stock cannot be negative").optional().nullable(),
    variants: z.array(productVariantSchema).default([]),
    isActive: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    const hasVariants = data.variants.length > 0;
    const hasBasePrice = typeof data.price === "number";

    // Must have one or the other — not neither, not both
    if (!hasVariants && !hasBasePrice) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["price"],
        message: "Product must have either variants or a base price",
      });
    }

    if (hasVariants && hasBasePrice) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["variants"],
        message: "Use either variants OR a base price, not both",
      });
    }

    // If no variants, stock is required at the product level
    if (!hasVariants && (data.stock === null || data.stock === undefined)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["stock"],
        message: "Stock is required when product has no variants",
      });
    }
  });

/* ---------------- PRODUCT (update) ---------------- */
export const updateProductSchema = z.object({
  name: z.string().min(3).max(150).optional(),
  description: z.string().min(10).optional(),
  categoryId: z.string().cuid().optional().nullable(),
  gender: genderEnum.optional().nullable(),
  price: z.number().int().positive().nullable().optional(),
  stock: z.number().int().min(0).nullable().optional(),
  variants: z.array(productVariantSchema).optional(),
  isActive: z.boolean().optional(),
  ourRecommendation: z.boolean().optional(),
});

/* ---------------- TYPES ---------------- */
export type ProductInput = z.infer<typeof productSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductVariantInput = z.infer<typeof productVariantSchema>;