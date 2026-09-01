// app/admin/page.tsx
import {
  IndianRupee,
  ShoppingCart,
  Users,
  Package,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { StatCard } from "@/components/admin/dashboard/stat-card";
import { PeriodSelector } from "@/components/admin/dashboard/period-selector";
import { LineChartCard } from "@/components/admin/dashboard/line-chart-card";
import { CategorySalesChart } from "@/components/admin/dashboard/category-sales-chart";
import { OrderStatusBreakdown } from "@/components/admin/dashboard/order-status-breakdown";
import { TopProductsList } from "@/components/admin/dashboard/top-products-list";
import { RecentOrdersTable } from "@/components/admin/dashboard/recent-orders-table";
import { formatINRCompact } from "@/lib/admin/format";
import { mockAnalyticsResponse } from "@/lib/admin/mock-analytics";
// TODO: swap for a real call once /api/admin/analytics is wired up:
// import { getAnalytics } from "@/lib/api/analytics";

interface AdminDashboardPageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function AdminDashboardPage({ searchParams }: AdminDashboardPageProps) {
  const params = await searchParams;
  const period = params.period ?? "30";
  void period; // TODO: pass to getAnalytics(Number(period)) once real — mock data doesn't vary by period yet

  const { data } = mockAnalyticsResponse;
  const { overview, orderStatus, charts, topProducts, recentOrders } = data;

  const today = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium">Dashboard</h1>
          <p className="mt-1 text-sm text-neutral-500">{today}</p>
        </div>
        <PeriodSelector />
      </div>

      {/* Overview stat cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Total Revenue" value={formatINRCompact(overview.totalRevenue)} icon={<IndianRupee />} />
        <StatCard label="Total Orders" value={overview.totalOrders.toLocaleString("en-IN")} icon={<ShoppingCart />} />
        <StatCard label="Customers" value={overview.totalCustomers.toLocaleString("en-IN")} icon={<Users />} />
        <StatCard label="Products" value={overview.totalProducts.toLocaleString("en-IN")} icon={<Package />} />
        <StatCard label="Pending Orders" value={String(overview.pendingOrders)} icon={< Clock />} emphasis />
        <StatCard label="Low Stock" value={String(overview.lowStockProducts)} icon={<AlertTriangle />} emphasis/>
      </div>

      {/* Trend charts */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <LineChartCard
          title="Revenue"
          data={charts.revenue.map((p) => ({
            date: p.date,
            value: p.revenue,
          }))}
          valueFormat="currency"
        />
        <LineChartCard
          title="Orders"
          data={charts.orders.map((p) => ({ date: p.date, value: p.orders }))}
        />
        <LineChartCard
          title="New Customers"
          data={charts.customers.map((p) => ({ date: p.date, value: p.customers }))}
        />
      </div>

      {/* Category sales + status breakdown */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <CategorySalesChart data={charts.categoryWise} />
        <OrderStatusBreakdown orderStatus={orderStatus} />
      </div>

      {/* Top products + recent orders */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <TopProductsList products={topProducts} />
        <RecentOrdersTable orders={recentOrders} />
      </div>
    </div>
  );
}