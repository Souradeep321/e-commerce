import crypto from "crypto";
import prisma from "@/lib/prisma";
import { TokenType } from "@/app/generated/prisma/client";

// lib/verification-token.ts
export async function createAuthToken(userId: string, type: TokenType, expiresInMs: number) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + expiresInMs);

  // Only the newest token of a given type should ever be valid for a user.
  // This also keeps the table from accumulating unlimited stale rows every
  // time someone requests a resend / reset link more than once.
  await prisma.authToken.deleteMany({
    where: { userId, type },
  });

  await prisma.authToken.create({
    data: { userId, token, type, expiresAt },
  });

  return token;
}