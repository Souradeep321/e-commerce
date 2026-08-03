// app/api/orders/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuthAPI } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error-handler";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { user, response } = await requireAuthAPI();
        if (response) return response;

        const { id } = await params;
        if (!id) return NextResponse.json({ message: "Order ID missing" }, { status: 400 });

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
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
                            select: { size: true },
                        },
                    },
                },
            },
        });

        return NextResponse.json({ success: true, message: "Order fetched successfully", order }, { status: 200 });
    } catch (error: any) {
        console.error("Error in GET /api/orders/[id]:", error);
        return handleApiError(error, "FETCH ORDER");
    }
}

