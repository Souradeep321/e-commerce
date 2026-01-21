import * as z from "zod";

/* 
model Category {
  id       String     @id @default(cuid())
  name     String     @unique
  slug     String     @unique
  parentId String?
  parent   Category?  @relation("Subcategories", fields: [parentId], references: [id])
  children Category[] @relation("Subcategories")

  products Product[]
}
*/

export const categorySchema: z.ZodType<any> = z.object({ 
  name: z.string().min(3, "Category name must be at least 3 characters long").max(100),
  slug: z.string().min(3, "Category slug must be at least 3 characters long").max(100),
  parentId: z.string().optional(),

  // children as recursive categories
  children: z.array(z.lazy((): z.ZodType<any> => categorySchema)).optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
