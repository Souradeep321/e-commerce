import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error-handler";

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        // await requireAdmin();

        const params = await context.params;
        const { id } = params;

        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                children: true,
                products: true,
            },
        });

        if (!category) {
            return NextResponse.json(
                { success: false, message: "Category not found" },
                { status: 404 }
            );
        }

        if (category.children.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Cannot delete category with subcategories",
                },
                { status: 400 }
            );
        }

        if (category.products.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Cannot delete category with products",
                },
                { status: 400 }
            );
        }

        await prisma.category.delete({ where: { id } });

        return NextResponse.json({
            success: true,
            message: "Category deleted successfully",
        }, { status: 200 });
    } catch (error: any) {
        console.error("Error in DELETE /api/admin/categories/[id]:", error);
        return handleApiError(error, "DELETE CATEGORY");
    }
}

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        // await requireAdmin();

        const params = await context.params;
        const { id } = params;

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Category ID is required" },
                { status: 400 }
            );
        }

        // const { searchParams } = new URL(req.url);

        // const page = Number(searchParams.get("page") || "1");
        // const limit = Number(searchParams.get("limit") || "10");

        // const skip = (page - 1) * limit;

        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                children: true,
                products: true,
            },
        });

        if (!category) {
            return NextResponse.json(
                { success: false, message: "Category not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Category fetched successfully",
            category,
        }, { status: 200 });

    } catch (error: any) {
        console.error("Error in GET /api/admin/categories/[id]:", error);
        return handleApiError(error, "FETCH CATEGORY");
    }
}