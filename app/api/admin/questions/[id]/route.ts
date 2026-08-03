// app/api/admin/questions/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAPI } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error-handler";

// PATCH - Answer a question (admin)
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { user, response } = await requireAdminAPI();
        if (response) return response;

        const { id } = await params;
        const { answer } = await req.json();

        if (!answer || answer.trim().length < 10) {
            return NextResponse.json(
                { success: false, message: "Answer must be at least 10 characters" },
                { status: 400 }
            );
        }

        // Get question
        const question = await prisma.question.findUnique({
            where: { id },
            include: {
                user: {
                    select: { id: true, name: true },
                },
                product: {
                    select: { id: true, name: true },
                },
            },
        });

        if (!question) {
            return NextResponse.json(
                { success: false, message: "Question not found" },
                { status: 404 }
            );
        }

        // Update question with answer
        const updatedQuestion = await prisma.question.update({
            where: { id },
            data: {
                answer: answer.trim(),
                answeredAt: new Date(),
            },
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
                    },
                },
            },
        });

        // Create notification for user
        await prisma.notification.create({
            data: {
                userId: question.userId,
                audience: "CUSTOMER",
                type: "QUESTION_ANSWERED",
                title: "Your Question Was Answered",
                message: `Your question about ${question.product.name} has been answered`,
                entityId: id,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Question answered successfully",
            question: updatedQuestion,
        });
    } catch (error: any) {
        console.error("Error in PATCH /api/admin/questions/[id]:", error);
        return handleApiError(error, "ANSWER QUESTION");
    }
}

// DELETE - Delete a question (admin)
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { user, response } = await requireAdminAPI();
        if (response) return response;

        const { id } = await params;

        const question = await prisma.question.findUnique({
            where: { id },
        });

        if (!question) {
            return NextResponse.json(
                { success: false, message: "Question not found" },
                { status: 404 }
            );
        }

        // Delete question
        await prisma.question.delete({
            where: { id },
        });

        return NextResponse.json({
            success: true,
            message: "Question deleted successfully",
        });
    } catch (error: any) {
        console.error("Error in DELETE /api/admin/questions/[id]:", error);
        return handleApiError(error, "DELETE QUESTION");
    }
}