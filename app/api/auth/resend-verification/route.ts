// app/api/auth/resend-verification/route.ts
import { NextResponse } from "next/server";
import { requireAuthAPI } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createAuthToken } from "@/lib/verification-token";
import { sendVerificationEmail } from "@/lib/services/resend";
import { authRateLimit } from "@/lib/rate-limit/rate-limit";
import { checkRateLimit } from "@/lib/rate-limit/rate-limit-helper";
import { handleApiError } from "@/lib/api-error-handler";

export async function POST() {
  try {
    const { user, response } = await requireAuthAPI();
    if (response) return response;

    const rateLimitResponse = await checkRateLimit(authRateLimit, `resend-verification:${user!.email}`);
    if (rateLimitResponse) return rateLimitResponse;

    const dbUser = await prisma.user.findUnique({ where: { id: user!.id } });

    if (!dbUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    if (dbUser.isVerified) {
      return NextResponse.json({ success: false, message: "Email already verified" }, { status: 400 });
    }

    const token = await createAuthToken(dbUser.id, "EMAIL_VERIFICATION", 24 * 60 * 60 * 1000); // 24 hours in milliseconds
    if (!token) {
      return NextResponse.json({ success: false, message: "Failed to create verification token" }, { status: 500 });
    }

    await sendVerificationEmail(dbUser.email, dbUser.name || "there", token);

    return NextResponse.json({ success: true, message: "Verification email sent" });
  }catch (error) {
    console.error("Error in POST /api/auth/resend-verification:", error);
    return handleApiError(error, "RESEND VERIFICATION");
  }
}