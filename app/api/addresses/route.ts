// app/api/addresses/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuthAPI } from "@/lib/auth";
import { addressSchema } from "@/schemas";

// GET - Fetch all user addresses
export async function GET(req: Request) {
  try {
    const { user, response } = await requireAuthAPI();
    if (response) return response;

    const addresses = await prisma.userAddress.findMany({
      where: { userId: user!.id },
      orderBy: { isDefault: "desc" }, // Default address first
    });

    return NextResponse.json({
      success: true,
      message: "Addresses fetched successfully",
      addresses,
    });
  } catch (error: any) {
    console.error("GET ADDRESSES ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

// POST - Create new address
export async function POST(req: Request) {
  try {
    const { user, response } = await requireAuthAPI();
    if (response) return response;

    const body = await req.json();
    
    // Validate using Zod
    const validated = addressSchema.parse(body);

    // If setting as default, unset other defaults
    if (validated.isDefault) {
      await prisma.userAddress.updateMany({
        where: {
          userId: user!.id,
          isDefault: true,
        },
        data: { isDefault: false },
      });
    }

    // Create address
    const address = await prisma.userAddress.create({
      data: {
        userId: user!.id,
        fullName: validated.fullName,
        phone: validated.phone,
        addressLine1: validated.addressLine1,
        addressLine2: validated.addressLine2,
        city: validated.city,
        state: validated.state,
        postalCode: validated.pincode,
        country: validated.country,
        isDefault: validated.isDefault || false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Address created successfully",
      address,
    }, { status: 201 });
  } catch (error: any) {
    console.error("CREATE ADDRESS ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}