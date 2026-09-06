// lib/admin/mock-categories.ts
// TEMPORARY mock, id+name pairs — distinct from mock-products.ts's
// plain-string MOCK_PRODUCT_CATEGORIES (which only feeds the filter
// bar's URL-slug-style values). The form's Select needs a real
// categoryId to submit, so this shape is deliberately different.
export interface MockCategoryOption {
  id: string;
  name: string;
}
 
export const MOCK_CATEGORY_OPTIONS: MockCategoryOption[] = [
  { id: "cat_1", name: "Outerwear" },
  { id: "cat_2", name: "Tops" },
  { id: "cat_3", name: "Bottoms" },
  { id: "cat_4", name: "Footwear" },
  { id: "cat_5", name: "Accessories" },
];
 