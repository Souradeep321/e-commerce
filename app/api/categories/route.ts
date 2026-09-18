import { handleApiError } from "@/lib/api-error-handler";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: "asc" },
            include: {
                children: true
            }
        });

        return NextResponse.json({
            success: true,
            message: "Categories fetched successfully",
            categories,
        }, { status: 200 });
    } catch (error: any) {
        console.error("Error in GET /api/categories:", error);
        return handleApiError(error, "FETCH CATEGORIES");
    }
}