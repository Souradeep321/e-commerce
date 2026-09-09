// app/admin/products/page.tsx
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductsFilterBar } from "@/components/admin/products/products-filter-bar";
import { ProductsTable } from "@/components/admin/products/products-table";
import { ProductsEmptyState } from "@/components/admin/products/products-empty-state";
import { ProductsPagination } from "@/components/admin/products/products-pagination";
// TODO: swap for a real call once /api/admin/products is wired up:
import { getAdminProducts, getAdminCategories } from "@/lib/api";

interface AdminProductsPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    isActive?: string;
    q?: string;
  }>;
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const isActive = params.isActive === "true" || params.isActive === "false" ? params.isActive === "true" : undefined;

  const { products, totalPages, totalItems } = await getAdminProducts({
    page,
    limit: 8,
    category: params.category,
    isActive,
    q: params.q,
  });
  console.log("AdminProductsPage products:", products); // Debugging log

  const categories = await getAdminCategories();
  const PRODUCT_CATEGORIES = Array.from(categories.categories.map((c) => c.name));


  const hasActiveFilters = Boolean(params.category || params.isActive || params.q);


  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium">Products</h1>
          <p className="mt-1 text-sm text-neutral-500">{totalItems} total</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4" />
            Create Product
          </Link>
        </Button>
      </div>

      <div className="mt-6">
        <ProductsFilterBar categories={PRODUCT_CATEGORIES} />
      </div>

      <div className="mt-4">
        {products.length > 0 ? (
          <ProductsTable products={products} />
        ) : (
          <ProductsEmptyState hasActiveFilters={hasActiveFilters} />
        )}
      </div>

      {products.length > 0 && (
        <ProductsPagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={8}
          searchParams={params}
        />
      )}
    </div>
  );
}