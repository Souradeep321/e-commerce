import * as z from "zod";

/* ---------------- ENUMS ---------------- */

export const notificationTypeEnum = z.enum([
  "ORDER_PLACED",
  "ORDER_STATUS_UPDATE",
  "QUESTION_ANSWERED",
  "REVIEW_APPROVED",
  "SYSTEM",
]);

export const notificationAudienceEnum = z.enum([
  "ADMIN",
  "CUSTOMER",
]);

/* ---------------- SCHEMA ---------------- */

export const notificationSchema = z.object({
  title: z.string().min(3),
  message: z.string().min(5),

  type: notificationTypeEnum,
  audience: notificationAudienceEnum,

  userId: z.string().cuid().optional(), // optional for admin-wide
  entityId: z.string().optional(),
});

/* ---------------- TYPES ---------------- */

export type NotificationInput = z.infer<typeof notificationSchema>;
