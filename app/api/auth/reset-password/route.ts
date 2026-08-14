import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { resetPasswordSchema } from "@/schemas";
import { handleApiError } from "@/lib/api-error-handler";
import { authRateLimit } from "@/lib/rate-limit/rate-limit";
import { checkRateLimit } from "@/lib/rate-limit/rate-limit-helper";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    // Same reasoning as the verify-token route — protects against
    // token-guessing, keyed by IP not token (a guessed token is a
    // new key every time, so IP is the only thing that stays constant).
    const rateLimitResponse = await checkRateLimit(authRateLimit, `reset-password:${ip}`);
    if (rateLimitResponse) return rateLimitResponse;

    const body = await req.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid request", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { token, newPassword } = parsed.data;

    const authToken = await prisma.authToken.findUnique({ where: { token } });

    if (!authToken || authToken.type !== "PASSWORD_RESET") {
      return NextResponse.json({ success: false, message: "Invalid or unknown token" }, { status: 400 });
    }

    if (authToken.used) {
      return NextResponse.json({ success: false, message: "This link has already been used" }, { status: 400 });
    }

    if (authToken.expiresAt < new Date()) {
      return NextResponse.json({ success: false, message: "This link has expired" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atomic: mark token used + update password together
    await prisma.$transaction([
      prisma.authToken.update({ where: { id: authToken.id }, data: { used: true } }),
      prisma.user.update({ where: { id: authToken.userId }, data: { password: hashedPassword } }),
    ]);

    return NextResponse.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    return handleApiError(error, "RESET PASSWORD");
  }
}