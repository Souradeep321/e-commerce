// ==========================================
// Admin analytics dashboard — a single large aggregated
// response covering overview stats, charts, top products,
// category sales, and recent orders. Everything (except
// recentOrders) is scoped to the ?period=<days> query param.
// ==========================================
export interface AnalyticsOverview {
  totalRevenue: number; // in rupees, already divided from paise
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  lowStockProducts: number;
}

export interface RevenueChartPoint {
  date: string; // YYYY-MM-DD
  revenue: number; // rupees
}

export interface OrdersChartPoint {
  date: string;
  orders: number;
}

export interface CustomerChartPoint {
  date: string;
  customers: number;
}

export interface CategorySalesPoint {
  category: string;
  sales: number;
}

export interface AnalyticsCharts {
  revenue: RevenueChartPoint[];
  orders: OrdersChartPoint[];
  customers: CustomerChartPoint[];
  categoryWise: CategorySalesPoint[];
}

export interface TopProduct {
  product: {
    id: string;
    name: string;
    slug: string;
    images: { url: string }[];
  } | null; // null if product was deleted after the sale
  totalSold: number;
}

export interface AnalyticsRecentOrder {
  id: string;
  orderNumber: string; // e.g. "#a1b2c3d4"
  customer: string; // name, falls back to email
  total: number; // rupees
  status: string;
  itemCount: number;
  createdAt: string;
}

export interface AnalyticsResponse {
  success: boolean;
  message: string;
  data: {
    overview: AnalyticsOverview;
    orderStatus: Record<string, number>; // e.g. { PAID: 12, PENDING: 3 }
    charts: AnalyticsCharts;
    topProducts: TopProduct[];
    recentOrders: AnalyticsRecentOrder[];
  };
}