import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function createVerificationToken(userId: string) {
  const token = crypto.randomBytes(32).toString("hex");

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await prisma.authToken.create({
    data: {
      userId,
      token,
      type: "EMAIL_VERIFICATION",
      expiresAt,
    },
  });

  return token;
}