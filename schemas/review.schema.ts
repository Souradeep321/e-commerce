import * as z from "zod";

/* 
model Review {
  id        String   @id @default(cuid())
  userId    String
  productId String
  orderId   String // ensures only buyers can review
  rating    Int // 1-5
  comment   String?
  createdAt DateTime @default(now())

  user    User    @relation(fields: [userId], references: [id])
  product Product @relation(fields: [productId], references: [id])
  order   Order   @relation(fields: [orderId], references: [id])

  @@unique([userId, productId, orderId])
}
*/


export const createReviewSchema = z.object({
  productId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5, "Comment must be at least 5 characters long").max(500).optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().min(5).max(500).optional(),
});

export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;

