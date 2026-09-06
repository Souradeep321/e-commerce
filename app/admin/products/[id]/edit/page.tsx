// app/admin/products/[id]/edit/page.tsx
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/products/form/product-form";
import { mockAdminProduct } from "@/lib/admin/mock-product-detail";
// TODO: swap for the real call once /api/admin/products/[id] is wired
// up on the frontend: import { getAdminProduct } from "@/lib/api/products";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  // TODO: replace with:
  // const res = await getAdminProduct(id);
  // if (!res.success || !res.product) notFound();
  // const product = res.product;
  //
  // Mock only ever has one product (mockAdminProduct), so this just
  // checks the id matches it — once real data lands, any invalid id
  // naturally 404s via the real fetch instead of this placeholder check.
  if (id !== mockAdminProduct.id) {
    notFound();
  }

  return <ProductForm mode="edit" initialProduct={mockAdminProduct} />;
}