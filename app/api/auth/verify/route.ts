import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyTokenSchema } from "@/schemas";
import { authRateLimit } from "@/lib/rate-limit";
import { checkRateLimit } from "@/lib/rate-limit-helper";
import { handleApiError } from "@/lib/api-error-handler";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rateLimitResponse = await checkRateLimit(authRateLimit, `verify-token:${ip}`);
    if (rateLimitResponse) return rateLimitResponse;

    const body = await req.json();
    const parsed = verifyTokenSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid request" },
        { status: 400 }
      );
    }

    const { token, type } = parsed.data;

    const authToken = await prisma.authToken.findUnique({
      where: { token },
    });

    if (!authToken || authToken.type !== type) {
      return NextResponse.json(
        { success: false, message: "Invalid or unknown token" },
        { status: 400 }
      );
    }

    if (authToken.used) {
      return NextResponse.json(
        { success: false, message: "This link has already been used" },
        { status: 400 }
      );
    }

    if (authToken.expiresAt < new Date()) {
      return NextResponse.json(
        { success: false, message: "This link has expired" },
        { status: 400 }
      );
    }

    // Transaction: mark token used + flip user.isVerified together
    await prisma.$transaction([
      prisma.authToken.update({
        where: { id: authToken.id },
        data: { used: true },
      }),
      prisma.user.update({
        where: { id: authToken.userId },
        data: { isVerified: true },
      }),
    ]);

    return NextResponse.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Error in POST /api/auth/verify:", error);
    return handleApiError(error, "VERIFY TOKEN");
  }
}