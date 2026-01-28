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
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}