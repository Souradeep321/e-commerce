// app/api/addresses/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuthAPI } from "@/lib/auth";
import { addressSchema } from "@/schemas";
import { handleApiError } from "@/lib/api-error-handler";

// PATCH - Update address
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, response } = await requireAuthAPI();
    if (response) return response;

    const { id } = await params;
    const body = await req.json();

    // Check if address belongs to user
    const existingAddress = await prisma.userAddress.findFirst({
      where: {
        id,
        userId: user!.id,
      },
    });

    if (!existingAddress) {
      return NextResponse.json(
        { success: false, message: "Address not found" },
        { status: 404 }
      );
    }

    // Validate partial update
    const validated = addressSchema.partial().parse(body);

    // If setting as default, unset other defaults
    const address = await prisma.$transaction(async (tx) => {
      if (validated.isDefault === true) {
        await tx.userAddress.updateMany({
          where: { userId: user!.id, isDefault: true, id: { not: id } },
          data: { isDefault: false },
        });
      }

      return tx.userAddress.update({
        where: { id },
        data: {
          ...(validated.fullName && { fullName: validated.fullName }),
          ...(validated.phone && { phone: validated.phone }),
          ...(validated.addressLine1 && { addressLine1: validated.addressLine1 }),
          ...(validated.addressLine2 !== undefined && { addressLine2: validated.addressLine2 }),
          ...(validated.city && { city: validated.city }),
          ...(validated.state && { state: validated.state }),
          ...(validated.pincode && { postalCode: validated.pincode }),
          ...(validated.country && { country: validated.country }),
          ...(validated.isDefault !== undefined && { isDefault: validated.isDefault }),
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Address updated successfully",
      address,
    });
  } catch (error: any) {
    console.error("Error in PATCH /api/addresses/[id]:", error);
    return handleApiError(error, "UPDATE ADDRESS");
  }
}

// DELETE - Delete address
export async function DELETE(
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

    // Delete address
    await prisma.$transaction(async (tx) => {
      await tx.userAddress.delete({ where: { id } });

      if (address.isDefault) {
        const firstAddress = await tx.userAddress.findFirst({ where: { userId: user!.id } });
        if (firstAddress) {
          await tx.userAddress.update({ where: { id: firstAddress.id }, data: { isDefault: true } });
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error: any) {
    console.error("Error in DELETE /api/addresses/[id]:", error);
    return handleApiError(error, "DELETE ADDRESS");
  }
}