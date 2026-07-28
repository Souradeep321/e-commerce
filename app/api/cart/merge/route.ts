// app/api/cart/merge/route.ts
import { requireAuthAPI } from "@/lib/auth";
import { mergeGuestCartWithUserCart } from "@/lib/cart-merge";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        const { user, response } = await requireAuthAPI();
        if (response) return response;

        const cookieStore = await cookies();
        const sessionId = cookieStore.get("guest_session_id")?.value;

        if (sessionId) {
            await mergeGuestCartWithUserCart(user!.id, sessionId);
            cookieStore.delete("guest_session_id");
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error in cart merge route:", error);
        return NextResponse.json(
            {
                success: false,
                message: "An error occurred while merging the cart.",
            },
            { status: 500 }
        );
    }
}