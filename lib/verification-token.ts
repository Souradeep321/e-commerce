import crypto from "crypto";
import prisma from "@/lib/prisma";
import { TokenType } from "@/app/generated/prisma/client";

export async function createAuthToken(userId: string, type: TokenType, expiresInMs: number) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + expiresInMs);

  await prisma.authToken.create({
    data: { userId, token, type, expiresAt },
  });

  return token;
}
