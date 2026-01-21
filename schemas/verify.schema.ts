import * as z from "zod";

export const tokenTypeEnum = z.enum([
  "EMAIL_VERIFICATION",
  "PASSWORD_RESET",
  "PHONE_OTP",
]);

/**
 * Verify token (email / OTP / reset)
 * ⚠️ Not wired yet – future use
 */
export const verifyTokenSchema = z.object({
  token: z.string().min(6),
  type: tokenTypeEnum,
});

export type VerifyTokenInput = z.infer<typeof verifyTokenSchema>;
