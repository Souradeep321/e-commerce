// lib/admin/product-form-schema.ts
import * as z from "zod";

/**
 * UI-layer schema ONLY — validates in rupees for a sane admin typing
 * experience. This is NOT a replacement for productSchema/
 * updateProductSchema (lib/schemas/product.schema.ts), which validate
 * in paise server-side and remain the actual source of truth. Values
 * get converted rupees -> paise at submit time (see product-form.tsx).
 */

export const genderFormEnum = z.enum(["MEN", "WOMEN", "UNISEX"]);

export const variantFormSchema = z.object({
  size: z.string().min(1, "Size is required"),
  priceRupees: z.coerce.number().positive("Price must be positive"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
});

export const productFormSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters").max(150),
    description: z.string().min(10, "Description must be at least 10 characters"),
    categoryId: z.string().min(1, "Category is required"),
    gender: genderFormEnum.optional(),
    pricingMode: z.enum(["simple", "variants"]),
    priceRupees: z.coerce.number().positive("Price must be positive").optional(),
    stock: z.coerce.number().int().min(0, "Stock cannot be negative").optional(),
    variants: z.array(variantFormSchema).default([]),
    isActive: z.boolean().default(true),
    ourRecommendation: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.pricingMode === "simple") {
      if (data.priceRupees === undefined) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["priceRupees"], message: "Price is required" });
      }
      if (data.stock === undefined) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["stock"], message: "Stock is required" });
      }
    } else {
      if (data.variants.length === 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["variants"], message: "Add at least one size" });
      }
    }
  });

// export type ProductFormValues = z.infer<typeof productFormSchema>;
export type ProductFormInput = z.input<typeof productFormSchema>;
export type ProductFormValues = z.output<typeof productFormSchema>;

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

export function paiseToRupees(paise: number): number {
  return paise / 100;
}

