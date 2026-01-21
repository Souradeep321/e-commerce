import * as z from "zod";

/* ---------------- ORDER ITEM ---------------- */

export const orderItemSchema = z.object({
  productId: z.string().cuid(),
  variantId: z.string().cuid().optional(),
  price: z.number().int().positive("Price must be positive"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export type OrderItemInput = z.infer<typeof orderItemSchema>;

/* ---------------- ORDER ADDRESS ---------------- */

export const orderAddressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email().optional(),
  phone: z.string().min(10).max(15, "Phone must be valid"),
  addressLine1: z.string().min(5, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  city: z.string().default("Kolkata"),
  state: z.string().default("West Bengal"),
  postalCode: z.string().min(4).max(10),
  country: z.string().default("India"),
});

export type OrderAddressInput = z.infer<typeof orderAddressSchema>;

/* ---------------- ORDER ---------------- */

export const orderSchema = z.object({
  userId: z.string().cuid(),
  totalAmount: z.number().int().positive(),

  // Razorpay / payment info
  razorpayOrderId: z.string().optional(),
  razorpayPaymentId: z.string().optional(),
  razorpaySignature: z.string().optional(),
  paymentCaptured: z.boolean().optional(),

  items: z.array(orderItemSchema).min(1, "Order must have at least one item"),
  address: orderAddressSchema,
});

export type OrderInput = z.infer<typeof orderSchema>;
