// app/api/notifications/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuthAPI, requireAdminAPI } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error-handler";

// GET - Fetch user notifications
export async function GET(req: Request) {
  try {
    const { user, response } = await requireAuthAPI();
    if (response) return response;

    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get("unreadOnly") === "true";
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 20);
    const skip = (page - 1) * limit;

    // Build where clause based on user role
    const where: any = {};

    if (user!.role === "ADMIN") {
      // Admin sees ADMIN audience notifications
      where.audience = "ADMIN";
      if (unreadOnly) {
        where.isRead = false;
      }
    } else {
      // Customer sees their own notifications
      where.userId = user!.id;
      where.audience = "CUSTOMER";
      if (unreadOnly) {
        where.isRead = false;
      }
    }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: {
          ...where,
          isRead: false,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Notifications fetched successfully",
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      unreadCount,
      notifications,
    });
  } catch (error: any) {
    console.error("Error in GET /api/notifications:", error);
    return handleApiError(error, "FETCH NOTIFICATIONS");
  }
}

// DELETE - Clear all read notifications
export async function DELETE(req: Request) {
  try {
    const { user, response } = await requireAuthAPI();
    if (response) return response;

    const where: any = {
      isRead: true,
    };

    if (user!.role === "ADMIN") {
      where.audience = "ADMIN";
    } else {
      where.userId = user!.id;
      where.audience = "CUSTOMER";
    }

    const result = await prisma.notification.deleteMany({
      where,
    });

    return NextResponse.json({
      success: true,
      message: `${result.count} notifications cleared successfully`,
      deletedCount: result.count,
    });
  } catch (error: any) {
    console.error("Error in DELETE /api/notifications:", error);
    return handleApiError(error, "CLEAR NOTIFICATIONS");
  }
}