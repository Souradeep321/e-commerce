// app/api/admin/questions/route.ts
// Admin: View and answer questions
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAPI } from "@/lib/auth";

// GET - Fetch all questions (admin)
export async function GET(req: Request) {
  try {
    const { user, response } = await requireAdminAPI();
    if (response) return response;

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // "answered" | "unanswered" | "all"
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 20);
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (status === "answered") {
      where.answer = { not: null };
    } else if (status === "unanswered") {
      where.answer = null;
    }

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: { take: 1, select: { url: true } },
            },
          },
        },
        orderBy: [
          { answeredAt: "asc" }, // Unanswered first
          { createdAt: "desc" },
        ],
      }),
      prisma.question.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Questions fetched successfully",
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      questions,
    });
  } catch (error: any) {
    console.error("GET ADMIN QUESTIONS ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}