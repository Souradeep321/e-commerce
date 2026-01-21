import * as z from "zod";

/* ---------------- ADDRESS ---------------- */


export const addressSchema = z.object({
    fullName: z.string().min(2),
    phone: z.string().min(10).max(15),
    addressLine1: z.string().min(1, "Address line 1 is required"),
    addressLine2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(2).default("India"),

    pincode: z.string().min(4).max(10),

    isDefault: z.boolean().optional(),
});

export type AddressInput = z.infer<typeof addressSchema>;


