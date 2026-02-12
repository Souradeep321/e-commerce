// app/api/notifications/mark-all-read/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuthAPI } from "@/lib/auth";

// PATCH - Mark all notifications as read
export async function PATCH(req: Request) {
  try {
    const { user, response } = await requireAuthAPI();
    if (response) return response;

    const where: any = {
      isRead: false,
    };

    if (user!.role === "ADMIN") {
      where.audience = "ADMIN";
    } else {
      where.userId = user!.id;
      where.audience = "CUSTOMER";
    }

    const result = await prisma.notification.updateMany({
      where,
      data: { isRead: true },
    });

    return NextResponse.json({
      success: true,
      message: `${result.count} notifications marked as read`,
      updatedCount: result.count,
    });
  } catch (error: any) {
    console.error("MARK ALL READ ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}