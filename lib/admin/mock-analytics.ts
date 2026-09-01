// lib/admin/mock-analytics.ts
import { AnalyticsResponse } from "@/types/api/analytics.types";

/**
 * TEMPORARY — same pattern as lib/mock-data.ts. Swap for a real
 * getAnalytics(period) call in app/admin/page.tsx once /api/admin/
 * analytics is wired up. Delete this file at that point.
 */

function generateSeries(base: number, amplitude: number, days = 30) {
  const start = new Date("2026-08-02");
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const wave = Math.sin(i * 0.9) * amplitude + Math.sin(i * 0.3) * (amplitude / 2);
    const value = Math.max(0, Math.round(base + wave));
    return { date: date.toISOString().slice(0, 10), value };
  });
}

const revenueSeries = generateSeries(9000, 2800);
const ordersSeries = generateSeries(55, 22);
const customersSeries = generateSeries(16, 9);

export const mockAnalyticsResponse: AnalyticsResponse = {
  success: true,
  message: "Analytics loaded",
  data: {
    overview: {
      totalRevenue: 284900,
      totalOrders: 1847,
      totalCustomers: 642,
      totalProducts: 93,
      pendingOrders: 38,
      lowStockProducts: 11,
    },

    orderStatus: {
      DELIVERED: 1419,
      SHIPPED: 203,
      PAID: 124,
      PENDING: 38,
      CANCELLED: 54,
      FAILED: 9,
    },

    charts: {
      revenue: revenueSeries.map((p) => ({ date: p.date, revenue: p.value })),
      orders: ordersSeries.map((p) => ({ date: p.date, orders: p.value })),
      customers: customersSeries.map((p) => ({ date: p.date, customers: p.value })),
      categoryWise: [
        { category: "Outerwear", sales: 155000 },
        { category: "Tops", sales: 110000 },
        { category: "Bottoms", sales: 78000 },
        { category: "Footwear", sales: 68000 },
        { category: "Accessories", sales: 45000 },
      ],
    },

    topProducts: [
      {
        product: {
          id: "prod_1",
          name: "Merino Field Jacket",
          slug: "merino-field-jacket",
          images: [{ url: "/images/mockRecommendedProducts/product-1.avif" }],
        },
        totalSold: 312,
      },
      {
        product: {
          id: "prod_2",
          name: "Brushed Cotton Overshirt",
          slug: "brushed-cotton-overshirt",
          images: [{ url: "/images/mockRecommendedProducts/product-2.avif" }],
        },
        totalSold: 278,
      },
      {
        product: {
          id: "prod_3",
          name: "Slim Tapered Trouser",
          slug: "slim-tapered-trouser",
          images: [{ url: "/images/mockRecommendedProducts/product-3.avif" }],
        },
        totalSold: 241,
      },
      {
        product: {
          id: "prod_4",
          name: "Ribbed Crew Knit",
          slug: "ribbed-crew-knit",
          images: [{ url: "/images/mockRecommendedProducts/product-4.avif" }],
        },
        totalSold: 198,
      },
      {
        product: {
          id: "prod_5",
          name: "Leather Chelsea Boot",
          slug: "leather-chelsea-boot",
          images: [{ url: "/images/mockRecommendedProducts/product-5.avif" }],
        },
        totalSold: 174,
      },
      {
        // Exercises the null-product case documented on TopProduct —
        // the product was deleted after this sale was recorded.
        product: null,
        totalSold: 89,
      },
    ],

    recentOrders: [
      { id: "ord_1", orderNumber: "#10091", customer: "Sasha Kimura", total: 348, status: "DELIVERED", itemCount: 3, createdAt: "2026-08-31T10:00:00.000Z" },
      { id: "ord_2", orderNumber: "#10090", customer: "Martina Voss", total: 189, status: "SHIPPED", itemCount: 1, createdAt: "2026-08-31T09:00:00.000Z" },
      { id: "ord_3", orderNumber: "#10089", customer: "Eliot Crane", total: 524, status: "PAID", itemCount: 4, createdAt: "2026-08-30T15:00:00.000Z" },
      { id: "ord_4", orderNumber: "#10088", customer: "Priya Menon", total: 97, status: "PENDING", itemCount: 1, createdAt: "2026-08-30T11:00:00.000Z" },
      { id: "ord_5", orderNumber: "#10087", customer: "Luca Ferretti", total: 213, status: "FAILED", itemCount: 2, createdAt: "2026-08-29T14:00:00.000Z" },
      { id: "ord_6", orderNumber: "#10086", customer: "Nina Park", total: 415, status: "CANCELLED", itemCount: 3, createdAt: "2026-08-29T09:00:00.000Z" },
      { id: "ord_7", orderNumber: "#10085", customer: "James Okoro", total: 162, status: "DELIVERED", itemCount: 2, createdAt: "2026-08-28T16:00:00.000Z" },
    ],
  },
};