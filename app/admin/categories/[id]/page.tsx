// app/admin/categories/[id]/page.tsx
import { getAdminCategoryById } from "@/lib/api";
import { CategoryHeader } from "@/components/admin/categories/category-header";
import { CategoryProductsFilterBar } from "@/components/admin/categories/category-products-filter-bar";
import { CategoryProductsTable } from "@/components/admin/categories/category-products-table";
import { CategoryProductsEmptyState } from "@/components/admin/categories/category-products-empty-state";
import { CategoryProductsPagination } from "@/components/admin/categories/category-products-pagination";

interface CategoryDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    page?: string;
    q?: string;
    gender?: string;
    isActive?: string;
    sort?: string;
  }>;
}

const PAGE_SIZE = 10;

export default async function AdminCategoryDetailPage({ params, searchParams }: CategoryDetailPageProps) {
  const { id } = await params;
  const sp = await searchParams;

  const page = Number(sp.page || "1");
  const isActive = sp.isActive === "true" ? true : sp.isActive === "false" ? false : undefined;

  // Letting this throw (rather than try/catch → empty state) is
  // deliberate — app/admin/error.tsx is the shared boundary for exactly
  // this kind of failable admin fetch (rule 13).
  const { category, products, totalPages, totalItems } = await getAdminCategoryById(id, {
    page,
    limit: PAGE_SIZE,
    q: sp.q,
    gender: sp.gender,
    sort: sp.sort,
    isActive,
  });

  const hasActiveFilters = Boolean(sp.q || sp.gender || sp.isActive);

  return (
    <div>
      <CategoryHeader category={category} totalItems={totalItems} />

      <div className="mt-6">
        <CategoryProductsFilterBar />
      </div>

      <div className="mt-4">
        {products.length === 0 ? (
          <CategoryProductsEmptyState hasActiveFilters={hasActiveFilters} />
        ) : (
          <CategoryProductsTable products={products} />
        )}
      </div>

      <CategoryProductsPagination
        categoryId={id}
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={PAGE_SIZE}
        searchParams={sp}
      />
    </div>
  );
}