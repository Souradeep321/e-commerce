// app/admin/products/page.tsx
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductsFilterBar } from "@/components/admin/products/products-filter-bar";
import { ProductsTable } from "@/components/admin/products/products-table";
import { ProductsEmptyState } from "@/components/admin/products/products-empty-state";
import { ProductsPagination } from "@/components/admin/products/products-pagination";
import { getMockProductsPage, MOCK_PRODUCT_CATEGORIES } from "@/lib/admin/mock-products";
// TODO: swap for a real call once /api/admin/products is wired up:
// import { getAdminProducts } from "@/lib/api/products";

interface AdminProductsPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    status?: string;
    q?: string;
  }>;
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const status = params.status === "active" || params.status === "inactive" ? params.status : undefined;

  const { products, totalPages, totalItems } = getMockProductsPage({
    page,
    limit: 8,
    category: params.category,
    status,
    q: params.q,
  });

  const hasActiveFilters = Boolean(params.category || params.status || params.q);

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
        <ProductsFilterBar categories={MOCK_PRODUCT_CATEGORIES} />
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