import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-error-handler";


// Status   /api/admin/products/[id]/status     → change product status
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        // await requireAdmin();
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
        }

        const product = await prisma.product.findUnique({
            where: { id }
        });

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        product.isActive = !product.isActive;

        await prisma.product.update({
            where: { id },
            data: { isActive: product.isActive }
        });

        return NextResponse.json({
            success: true,
            message: "Product Status changed successfully",
            product: {
                id: product.id,
                name: product.name,
                isActive: product.isActive,
                description: product.description
            }
        }, { status: 200 });
    } catch (error) {
        console.error("Error in PATCH /api/admin/products/[id]/status:", error);
        return handleApiError(error, "CHANGE PRODUCT STATUS");
    }
}