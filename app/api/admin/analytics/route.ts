// app/api/admin/analytics/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAPI } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error-handler";

export async function GET(req: Request) {
  try {
    const { user, response } = await requireAdminAPI();
    if (response) return response;

    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "30"; // days
    const days = parseInt(period);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // ========================================
    // 1. OVERVIEW STATS
    // ========================================
    const [
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      pendingOrders,
      lowStockProducts,
    ] = await Promise.all([
      // Total revenue (PAID orders only)
      prisma.order.aggregate({
        where: {
          status: "PAID",
          createdAt: { gte: startDate },
        },
        _sum: { totalAmount: true },
      }),

      // Total orders
      prisma.order.count({
        where: { createdAt: { gte: startDate } },
      }),

      // Total customers
      prisma.user.count({
        where: {
          role: "CUSTOMER",
          createdAt: { gte: startDate },
        },
      }),

      // Total products
      prisma.product.count({
        where: { isActive: true },
      }),

      // Pending orders
      prisma.order.count({
        where: { status: "PENDING" },
      }),

      // Low stock products (stock < 10)
      prisma.product.count({
        where: {
          stock: { lt: 10 },
          isActive: true,
        },
      }),
    ]);

    // ========================================
    // 2. ORDER STATUS BREAKDOWN
    // ========================================
    const ordersByStatus = await prisma.order.groupBy({
      by: ["status"],
      where: { createdAt: { gte: startDate } },
      _count: { status: true },
    });

    const statusBreakdown = ordersByStatus.reduce((acc, curr) => {
      acc[curr.status] = curr._count.status;
      return acc;
    }, {} as Record<string, number>);

    // ========================================
    // 3. REVENUE OVER TIME (Daily)
    // ========================================
    const orders = await prisma.order.findMany({
      where: {
        status: "PAID",
        createdAt: { gte: startDate },
      },
      select: {
        totalAmount: true,
        createdAt: true,
      },
    });

    // Group by date
    const revenueByDate: Record<string, number> = {};
    orders.forEach((order) => {
      const date = order.createdAt.toISOString().split("T")[0]; // YYYY-MM-DD
      revenueByDate[date] = (revenueByDate[date] || 0) + order.totalAmount;
    });

    // Convert to array for charts
    const revenueChart = Object.entries(revenueByDate)
      .map(([date, amount]) => ({
        date,
        revenue: amount / 100, // Convert paise to rupees
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // ========================================
    // 4. ORDERS OVER TIME (Daily)
    // ========================================
    const ordersByDate: Record<string, number> = {};
    orders.forEach((order) => {
      const date = order.createdAt.toISOString().split("T")[0];
      ordersByDate[date] = (ordersByDate[date] || 0) + 1;
    });

    const ordersChart = Object.entries(ordersByDate)
      .map(([date, count]) => ({
        date,
        orders: count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // ========================================
    // 5. TOP SELLING PRODUCTS
    // ========================================
    const topProducts = await prisma.orderItem.groupBy({
      by: ["productId"],
      where: {
        order: {
          status: "PAID",
          createdAt: { gte: startDate },
        },
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    });

    const topProductsDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name: true,
            slug: true,
            images: { take: 1, select: { url: true } },
          },
        });
        return {
          product,
          totalSold: item._sum.quantity || 0,
        };
      })
    );

    // ========================================
    // 6. CATEGORY WISE SALES
    // ========================================
    const categoryWiseSales = await prisma.$queryRaw<
      Array<{ categoryId: string; categoryName: string; totalSales: bigint }>
    >`
      SELECT 
        c.id as "categoryId",
        c.name as "categoryName",
        COALESCE(SUM(oi.quantity), 0) as "totalSales"
      FROM "Category" c
      LEFT JOIN "Product" p ON p."categoryId" = c.id
      LEFT JOIN "OrderItem" oi ON oi."productId" = p.id
      LEFT JOIN "Order" o ON o.id = oi."orderId"
      WHERE o.status = 'PAID' 
        AND o."createdAt" >= ${startDate}
      GROUP BY c.id, c.name
      ORDER BY "totalSales" DESC
      LIMIT 5
    `;

    const categorySales = categoryWiseSales.map((item) => ({
      category: item.categoryName,
      sales: Number(item.totalSales),
    }));

    // ========================================
    // 7. RECENT ORDERS
    // ========================================
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // ========================================
    // 8. CUSTOMER GROWTH
    // ========================================
    const customerGrowth = await prisma.$queryRaw<
      Array<{ date: string; count: bigint }>
    >`
      SELECT 
        DATE("createdAt") as date,
        COUNT(*) as count
      FROM "User"
      WHERE role = 'CUSTOMER'
        AND "createdAt" >= ${startDate}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;

    const customerChart = customerGrowth.map((item) => ({
      date: item.date,
      customers: Number(item.count),
    }));

    // ========================================
    // RESPONSE
    // ========================================
    return NextResponse.json({
      success: true,
      message: "Analytics data fetched successfully",
      data: {
        overview: {
          totalRevenue: (totalRevenue._sum.totalAmount || 0) / 100, // Rupees
          totalOrders,
          totalCustomers,
          totalProducts,
          pendingOrders,
          lowStockProducts,
        },
        orderStatus: statusBreakdown,
        charts: {
          revenue: revenueChart,
          orders: ordersChart,
          customers: customerChart,
          categoryWise: categorySales,
        },
        topProducts: topProductsDetails,
        recentOrders: recentOrders.map((order) => ({
          id: order.id,
          orderNumber: `#${order.id.slice(-8)}`,
          customer: order.user.name || order.user.email,
          total: order.totalAmount / 100,
          status: order.status,
          itemCount: order.items.length,
          createdAt: order.createdAt,
        })),
      },
    });
  } catch (error: any) {
    console.error("Error in GET /api/admin/analytics:", error);
    return handleApiError(error, "FETCH ANALYTICS");
  }
}