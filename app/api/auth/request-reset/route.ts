import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requestPasswordResetSchema } from "@/schemas";
import { createAuthToken } from "@/lib/verification-token";
import { sendPasswordResetEmail } from "@/lib/services/resend";
import { authRateLimit } from "@/lib/rate-limit/rate-limit";
import { checkRateLimit } from "@/lib/rate-limit/rate-limit-helper";
import { handleApiError } from "@/lib/api-error-handler";

export async function POST(req: Request) {
    try {
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

        const rateLimitResponse = await checkRateLimit(authRateLimit, `forgot-password:${ip}`);
        if (rateLimitResponse) return rateLimitResponse;

        const body = await req.json();
        const parsed = requestPasswordResetSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { success: false, message: "Invalid request", errors: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { email } = parsed.data;

        const user = await prisma.user.findUnique({ where: { email } });

        if (user) {
            const token = await createAuthToken(user.id, "PASSWORD_RESET", 60 * 60 * 1000); // 1 hour
            if (!token) {
                return NextResponse.json(
                    { success: false, message: "Failed to create verification token", },
                    { status: 500 }
                );
            }

            const emailResult = await sendPasswordResetEmail(user.email, user.name || "there", token);
            if (!emailResult.success) {
                return NextResponse.json(
                    { success: false, message: "Failed to send verification email. Please try again." },
                    { status: 500 }
                );
            }
        }

        return NextResponse.json({
            success: true,
            message: "If an account with that email exists, a reset link has been sent.",
        });

    } catch (error) {
        console.error("Error in POST api/auth/request-reset", error);
        return handleApiError(error, "FORGOT PASSWORD");
    }
}
