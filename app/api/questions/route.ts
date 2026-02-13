// app/api/questions/route.ts
// User's own questions
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuthAPI } from "@/lib/auth";

// GET - Fetch user's own questions
export async function GET(req: Request) {
  try {
    const { user, response } = await requireAuthAPI();
    if (response) return response;

    const questions = await prisma.question.findMany({
      where: { userId: user!.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            images: { take: 1, select: { url: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const answeredCount = questions.filter(q => q.answer).length;
    const unansweredCount = questions.filter(q => !q.answer).length;

    return NextResponse.json({
      success: true,
      message: "Your questions fetched successfully",
      data: {
        questions,
        totalQuestions: questions.length,
        answeredCount,
        unansweredCount,
      },
    });
  } catch (error: any) {
    console.error("GET USER QUESTIONS ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}