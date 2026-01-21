import * as z from "zod";

/* ---------------- CART ITEM ---------------- */

export const cartItemSchema = z
  .object({
    productId: z.string().cuid().optional(),
    productVariantId: z.string().cuid().optional(),

    quantity: z.number().int().min(1, "Quantity must be at least 1"),
  })
  .superRefine((data, ctx) => {
    const hasProduct = !!data.productId;
    const hasVariant = !!data.productVariantId;

    if (!hasProduct && !hasVariant) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["productId"],
        message: "Cart item must reference a product or a variant",
      });
    }

    if (hasProduct && hasVariant) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["productVariantId"],
        message: "Use either productId or productVariantId, not both",
      });
    }
  });

/* ---------------- CART ---------------- */

export const cartSchema = z.object({
  items: z.array(cartItemSchema).min(1, "Cart cannot be empty"),
});

/* ---------------- TYPES ---------------- */

export type CartItemInput = z.infer<typeof cartItemSchema>;
export type CartInput = z.infer<typeof cartSchema>;

