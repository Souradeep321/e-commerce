import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAPI } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error-handler";

export async function GET(req: Request) {
    try {
        const { user, response } = await requireAdminAPI();
        if (response) return response;

        const { searchParams } = new URL(req.url);

        const status = searchParams.get("status"); // Filter by status
        const page = Number(searchParams.get("page") || 1);
        const limit = Number(searchParams.get("limit") || 20);
        const skip = (page - 1) * limit;

        const where: any = {};
        if (status) {
            where.status = status;
        }

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
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
                                select: {
                                    size: true,
                                },
                            },
                        },
                    },
                    address: true,
                },
            }),
            prisma.order.count({ where }),
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
        console.error("Error in GET /api/admin/orders:", error); 
        return handleApiError(error, "FETCH ADMIN ORDERS");
    }
}