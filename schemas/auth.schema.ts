import * as z from "zod";

export const usernameValidation = z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(30, "Username must be at most 30 characters long")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores");

export const passwordValidation = z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password must be at most 100 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character");

export const registerSchema = z.object({
    name: usernameValidation,
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().min(10).max(15).optional(),
    password: passwordValidation,
});

export type RegisterSchema = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    identifier: z.string().min(3, "Identifier must be at least 3 characters long"),
    password: z.string(),
});

export type LoginSchema = z.infer<typeof loginSchema>;