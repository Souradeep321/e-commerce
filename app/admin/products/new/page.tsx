// app/admin/products/new/page.tsx
import { ProductForm } from "@/components/admin/products/form/product-form";
import { getAdminCategories } from "@/lib/api/categories";


export default async function page() {
  const { categories } = await getAdminCategories();

  return <ProductForm mode="create" categories={categories} />;
}


