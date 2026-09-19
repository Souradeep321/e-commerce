// app/admin/products/[id]/edit/page.tsx
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/products/form/product-form";
import { getAdminCategories, getAdminProduct } from "@/lib/api";
// TODO: swap for the real call once /api/admin/products/[id] is wired

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const { categories } = await getAdminCategories();

  const res = await getAdminProduct(id);

  if (!res.success || !res.product) {
    notFound();
  }

  const product = res.product;

  return <ProductForm mode="edit" initialProduct={product} categories={categories} />;
}