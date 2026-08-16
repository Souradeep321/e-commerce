import { Suspense } from "react";
// import { getProducts } from "@/lib/api/products";
// import { getCategories } from "@/lib/api/categories";
import { FilterBar } from "@/components/products/filter-bar";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductGridSkeleton } from "@/components/products/product-grid-skeleton";
import { Pagination } from "@/components/products/pagination";
import { mockCategories, mockAllProducts, mockTotalPages } from "@/lib/mock-data";

interface ProductsPageProps {
    searchParams: Promise<{
        page?: string;
        category?: string;
        gender?: string;
        sort?: string;
    }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    const params = await searchParams;
    const page = Number(params.page) || 1;

    // categories load independently of the product query — fetch in parallel,
    // not sequentially, since one doesn't depend on the other
    //   const [{ categories }, { products, totalPages }] = await Promise.all([
    //     getCategories(),
    //     getProducts({
    //       page,
    //       category: params.category,
    //       gender: params.gender,
    //       sort: params.sort,
    //     }),
    //   ]);

    const categories = mockCategories;
    const products = mockAllProducts;
    const totalPages = mockTotalPages;

    return (
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-medium text-neutral-900">All Products</h1>
                <FilterBar categories={categories} />
            </div>

            <Suspense fallback={<ProductGridSkeleton />}>
                <ProductGrid products={products} />
            </Suspense>

            <Pagination currentPage={page} totalPages={totalPages} searchParams={params} />
        </main>
    );
}