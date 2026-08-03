// app/api/orders/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuthAPI } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error-handler";

// GET - User's order history
export async function GET(req: Request) {
    try {
        const { user, response } = await requireAuthAPI();
        if (response) return response;

        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get("page") || 1);
        const limit = Number(searchParams.get("limit") || 10);
        const skip = (page - 1) * limit;

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where: { userId: user!.id },
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    items: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    slug: true,
                                    images: { take: 1, select: { url: true } },
                                },
                            },
                            variant: {
                                select: { size: true },
                            },
                        },
                    },
                    address: true,
                },
            }),
            prisma.order.count({ where: { userId: user!.id } }),
        ]);

        return NextResponse.json({
            success: true,
            message: "Orders fetched successfully",
            page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            orders,
        });
    } catch (error) {
        console.error("Error in GET /api/orders:", error);
        return handleApiError(error, "FETCH ORDERS");
    }
}