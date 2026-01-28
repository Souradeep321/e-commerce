import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin();

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
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 400 }
        );
    }
}
