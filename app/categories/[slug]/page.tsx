import { notFound } from "next/navigation";
import { getCategoryBySlug, ApiError } from "@/lib/api";
import { FilterBar } from "@/components/products/filter-bar";
import { ProductGrid } from "@/components/products/product-grid";
import { Pagination } from "@/components/products/pagination";

const PAGE_SIZE = 12;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; q?: string; gender?: string; sort?: string }>;
}

// Deliberately no subcategory tabs/links here yet — category.children
// is returned by the API (and kept intact for the future header nav
// per plan) but that UI is explicitly deferred. This page is just:
// category info, filters (q/gender/sort), product grid, pagination.
export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  let data;
  try {
    data = await getCategoryBySlug(slug, {
      page,
      limit: PAGE_SIZE,
      q: sp.q,
      gender: sp.gender,
      sort: sp.sort,
    });
  } catch (err) {
    // GET /api/categories/[slug] returns a real 404 status (not a
    // 200-with-null-body) when the slug doesn't exist, so apiFetch
    // throws an ApiError here rather than returning something to
    // null-check — catch specifically that case for notFound(), and
    // let anything else (500s, network errors) propagate to
    // app/categories/[slug]/error.tsx (falls back to the nearest
    // error boundary if that file doesn't exist yet).
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }
    throw err;
  }

  const { category, products, totalPages, totalItems } = data;
  const basePath = `/categories/${slug}`;

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium text-neutral-900">{category.name}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {totalItems} {totalItems === 1 ? "product" : "products"}
          </p>
        </div>

        <FilterBar showSearch />
      </div>

      <ProductGrid products={products} clearFiltersHref={basePath} />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        searchParams={{ q: sp.q, gender: sp.gender, sort: sp.sort, page: sp.page }}
        basePath={basePath}
      />
    </main>
  );
}