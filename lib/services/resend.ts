import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function sendVerificationEmail(to: string, name: string, token: string) {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Verify your email address",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>Hi ${name},</h2>
          <p>Thanks for signing up! Please verify your email address to activate your account.</p>
          <p style="margin: 24px 0;">
            <a href="${verifyUrl}" style="background: #111; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Verify Email
            </a>
          </p>
          <p style="color: #666; font-size: 13px;">
            This link expires in 24 hours. If you didn't create this account, you can ignore this email.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("RESEND ERROR:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("RESEND SEND FAILED:", err);
    return { success: false, error: err };
  }
}

export async function sendPasswordResetEmail(to: string, name: string, token: string) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Reset your password",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>Hi ${name},</h2>
          <p>We received a request to reset your password. Click the button below to choose a new one.</p>
          <p style="margin: 24px 0;">
            <a href="${resetUrl}" style="background: #111; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Reset Password
            </a>
          </p>
          <p style="color: #666; font-size: 13px;">
            This link expires in 1 hour. If you didn't request this, you can safely ignore this email — your password will remain unchanged.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("RESEND ERROR:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("RESEND SEND FAILED:", err);
    return { success: false, error: err };
  }
}
