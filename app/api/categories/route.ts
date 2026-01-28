import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const categories = await prisma.category.findMany({
            where: { parentId: null },
            select: { id: true, name: true, slug: true },
        });
        
        return NextResponse.json({
            success: true,
            message: "Categories fetched successfully",
            categories
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}