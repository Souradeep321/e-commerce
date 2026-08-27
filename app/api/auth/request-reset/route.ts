import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requestPasswordResetSchema } from "@/schemas";
import { createAuthToken } from "@/lib/verification-token";
import { sendPasswordResetEmail } from "@/lib/services/resend";
import { authRateLimit } from "@/lib/rate-limit/rate-limit";
import { checkRateLimit } from "@/lib/rate-limit/rate-limit-helper";
import { handleApiError } from "@/lib/api-error-handler";

// app/api/auth/request-reset/route.ts
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
            // Same reasoning as resend-verification: don't invalidate a
            // still-valid reset link just because they clicked the button
            // again — that would silently break a link they might already
            // have open in their inbox.
            const existingToken = await prisma.authToken.findFirst({
                where: {
                    userId: user.id,
                    type: "PASSWORD_RESET",
                    used: false,
                    expiresAt: { gt: new Date() },
                },
            });

            if (!existingToken) {
                const token = await createAuthToken(user.id, "PASSWORD_RESET", 60 * 60 * 1000); // 1 hour
                await sendPasswordResetEmail(user.email, user.name || "there", token);
                /* 
                This route's entire security model is "always return the same generic message regardless of what happened internally," specifically so it can't be used to enumerate which emails have accounts. If I added an email-failure branch that returned a different message, that itself becomes a signal — someone could distinguish "email exists but send failed" from "email doesn't exist" by the response differing. So the email-send failure here should be a silent server-side concern (log it, maybe alert yourself via monitoring later) rather than surfaced to the client at all. Flagging this as a real inconsistency with the resend-verification fix, not something to copy over blindly.
                */
            }
            // If a valid token already exists, do nothing — same generic
            // response goes out either way, below, so this still doesn't
            // leak whether the email exists or whether a resend happened.
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

        
        //     const token = await createAuthToken(user.id, "PASSWORD_RESET", 60 * 60 * 1000); // 1 hour
        //     if (!token) {
        //         return NextResponse.json(
        //             { success: false, message: "Failed to create verification token", },
        //             { status: 500 }
        //         );
        //     }

        //     const emailResult = await sendPasswordResetEmail(user.email, user.name || "there", token);
        //     if (!emailResult.success) {
        //         return NextResponse.json(
        //             { success: false, message: "Failed to send verification email. Please try again." },
        //             { status: 500 }
        //         );
        //     }
        // }