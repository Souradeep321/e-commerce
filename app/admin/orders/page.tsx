// app/admin/orders/page.tsx
import { getAdminOrders } from "@/lib/api";
import { OrdersPageHeader } from "@/components/admin/orders/orders-page-header";
import { OrdersFilterBar } from "@/components/admin/orders/orders-filter-bar";
import { OrdersTable } from "@/components/admin/orders/orders-table";
import { OrdersEmptyState } from "@/components/admin/orders/orders-empty-state";
import { OrdersPagination } from "@/components/admin/orders/orders-pagination";

const PAGE_SIZE = 10;

interface AdminOrdersPageProps {
  searchParams: Promise<{ status?: string; page?: string }>;
}

// No try/catch here — a failed fetch (401, 500, etc.) should surface
// to app/admin/error.tsx, not silently render an empty table. Same
// rule already applied to the products list.
export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const params = await searchParams;
  const status = params.status && params.status !== "all" ? params.status : undefined;
  const page = Math.max(1, Number(params.page) || 1);

  const { orders, totalPages, totalItems } = await getAdminOrders({
    status,
    page,
    limit: PAGE_SIZE,
  });

  const hasActiveFilters = Boolean(status);

  return (
    <div>
      <OrdersPageHeader />

      <div className="mt-6">
        <OrdersFilterBar />
      </div>

      <div className="mt-4">
        {orders.length === 0 ? (
          <OrdersEmptyState hasActiveFilters={hasActiveFilters} />
        ) : (
          <OrdersTable orders={orders} />
        )}
      </div>

      <OrdersPagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={PAGE_SIZE}
        searchParams={{ status: params.status, page: params.page }}
      />
    </div>
  );
}