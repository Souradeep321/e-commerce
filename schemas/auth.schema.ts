import * as z from "zod";

export const nameValidation = z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be at most 50 characters long")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces");

export const passwordValidation = z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password must be at most 100 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character");

export const registerSchema = z.object({
    name: nameValidation,
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().min(10).max(15).optional(),
    password: passwordValidation,
});

export const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string(),
});

export const updateProfileSchema = z.object({
    name: nameValidation.optional(),
    phone: z.string().min(10).max(15).optional(),
    currentPassword: z.string().optional(),
    newPassword: passwordValidation.optional(),
}).refine(
    (data) => !data.newPassword || !!data.currentPassword,
    { message: "Current password is required to set a new password", path: ["currentPassword"] }
);

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
