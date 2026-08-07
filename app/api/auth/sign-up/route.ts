import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { registerSchema } from "@/schemas";
import { createVerificationToken } from "@/lib/verification-token";
import { sendVerificationEmail } from "@/lib/services/resend";
import { authRateLimit } from "@/lib/rate-limit/rate-limit";
import { checkRateLimit } from "@/lib/rate-limit/rate-limit-helper";
import { handleApiError } from "@/lib/api-error-handler";

export async function POST(req: Request) {
    try {
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

        const rateLimitResponse = await checkRateLimit(authRateLimit, `signup:${ip}`);
        if (rateLimitResponse) return rateLimitResponse;

        const body = await req.json();
        const data = registerSchema.safeParse(body);

        if (!data.success) {
            return NextResponse.json({
                success: false,
                message: "Invalid request data",
                errors: data.error.format(),
            }, { status: 400 });
        }

        const { name, email, password } = data.data;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "User with email already exists" },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });


        const verificationToken = await createVerificationToken(newUser.id);

        if (!verificationToken) {
            return NextResponse.json({
                success: false,
                message: "Failed to create verification token",
            }, { status: 500 });
        }
        
        await sendVerificationEmail(newUser.email, String(newUser.name), verificationToken);

        return NextResponse.json({
            success: true,
            message: "User registered successfully and verification email sent",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
            },
        }, { status: 201 });
    } catch (error) {
        console.error("Error in POST /api/auth/sign-up:", error);
        return handleApiError(error, "SIGN UP");
    }
}