// app/api/addresses/[id]/default/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuthAPI } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error-handler";

// PATCH - Set address as default
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, response } = await requireAuthAPI();
    if (response) return response;

    const { id } = await params;

    // Check if address belongs to user
    const address = await prisma.userAddress.findFirst({
      where: {
        id,
        userId: user!.id,
      },
    });

    if (!address) {
      return NextResponse.json(
        { success: false, message: "Address not found" },
        { status: 404 }
      );
    }

    // Unset all other defaults
    await prisma.userAddress.updateMany({
      where: {
        userId: user!.id,
        isDefault: true,
      },
      data: { isDefault: false },
    });

    // Set this address as default
    const updatedAddress = await prisma.userAddress.update({
      where: { id },
      data: { isDefault: true },
    });

    return NextResponse.json({
      success: true,
      message: "Default address updated successfully",
      address: updatedAddress,
    });
  } catch (error: any) {
    console.error("Error in PATCH /api/addresses/[id]/default:", error);
    return handleApiError(error, "SET DEFAULT ADDRESS");
  }
}