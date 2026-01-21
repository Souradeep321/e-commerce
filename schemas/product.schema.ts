import * as z from "zod";

/* ---------------- ENUMS ---------------- */

export const genderEnum = z.enum(["MEN", "WOMEN", "UNISEX"]);

/* ---------------- VARIANT ---------------- */

export const productVariantSchema = z.object({
  size: z.string().min(1, "Size is required"), // "S", "M", "L", etc.
  price: z.number().int().positive("Price must be positive"),
  stock: z.number().int().min(0),
});

/* ---------------- IMAGE ---------------- */

export const productImageSchema = z.object({
  url: z.string().url("Invalid image URL"),
  publicId: z.string().min(1),
});

/* ---------------- PRODUCT ---------------- */

export const productSchema = z
  .object({
    name: z.string().min(3).max(150),
    description: z.string().min(10),

    categoryId: z.string().cuid("Invalid category"),

    gender: genderEnum.optional(),

    price: z.number().int().positive().optional(),
    stock: z.number().int().min(0).optional(),

    variants: z.array(productVariantSchema).optional(),

    images: z.array(productImageSchema).min(1, "At least one image required"),

    isActive: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    const hasVariants = !!data.variants?.length;
    const hasBasePrice = typeof data.price === "number";

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
        message: "Use either variants OR base price, not both",
      });
    }
  });

/* ---------------- TYPES ---------------- */

export type ProductInput = z.infer<typeof productSchema>;
export type ProductVariantInput = z.infer<typeof productVariantSchema>;
