import { handleApiError } from "@/lib/api-error-handler";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: {params: Promise<{ slug: string }>}) {
    try {
        const params = await context.params;
        const { slug } = params;
        const category = await prisma.category.findUnique({
            where: { slug },
            include: {
                children: true,
                products: true,
            },
        });
        return NextResponse.json({
            success: true,
            message: "Category retrieved successfully",
            category
        }, { status: 200 });
    } catch (error: any) {
        console.error("Error in GET /api/categories/[slug]:", error);
        return handleApiError(error, "FETCH CATEGORY BY SLUG");
    }
}