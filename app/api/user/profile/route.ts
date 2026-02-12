// app/api/user/profile/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuthAPI } from "@/lib/auth";
import bcrypt from "bcryptjs";

// GET - Get user profile
export async function GET(req: Request) {
  try {
    const { user, response } = await requireAuthAPI();
    if (response) return response;

    const profile = await prisma.user.findUnique({
      where: { id: user!.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile fetched successfully",
      profile,
    });
  } catch (error: any) {
    console.error("GET PROFILE ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

// PATCH - Update user profile
export async function PATCH(req: Request) {
  try {
    const { user, response } = await requireAuthAPI();
    if (response) return response;

    const body = await req.json();
    const { name, phone, currentPassword, newPassword } = body;

    // Prepare update data
    const updateData: any = {};

    if (name) {
      updateData.name = name;
    }

    if (phone) {
      // Check if phone is already taken by another user
      const existingPhone = await prisma.user.findFirst({
        where: {
          phone,
          id: { not: user!.id },
        },
      });

      if (existingPhone) {
        return NextResponse.json(
          { success: false, message: "Phone number already in use" },
          { status: 409 }
        );
      }

      updateData.phone = phone;
    }

    // Handle password change
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { success: false, message: "Current password is required" },
          { status: 400 }
        );
      }

      // Verify current password
      const currentUser = await prisma.user.findUnique({
        where: { id: user!.id },
        select: { password: true },
      });

      if (!currentUser || !currentUser.password) {
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 }
        );
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        currentUser.password
      );

      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, message: "Current password is incorrect" },
          { status: 401 }
        );
      }

      // Validate new password
      if (newPassword.length < 6) {
        return NextResponse.json(
          { success: false, message: "New password must be at least 6 characters" },
          { status: 400 }
        );
      }

      // Hash new password
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user!.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedUser,
    });
  } catch (error: any) {
    console.error("UPDATE PROFILE ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}