// app/api/auth/resend-verification/route.ts
import { NextResponse } from "next/server";
import { requireAuthAPI } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createVerificationToken } from "@/lib/verification-token";
import { sendVerificationEmail } from "@/lib/resend";
import { authRateLimit } from "@/lib/rate-limit";
import { checkRateLimit } from "@/lib/rate-limit-helper";

export async function POST() {
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

  const token = await createVerificationToken(dbUser.id);
  await sendVerificationEmail(dbUser.email, dbUser.name || "there", token);

  return NextResponse.json({ success: true, message: "Verification email sent" });
}