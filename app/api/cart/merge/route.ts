// app/api/cart/merge/route.ts
import { requireAuthAPI } from "@/lib/auth";
import { mergeGuestCartWithUserCart } from "@/lib/cart-merge";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { handleApiError } from "@/lib/api-error-handler";


// FIXME: Call it once, right after successful login, on the client:
/*
const result = await signIn("credentials", {
  email,
  password,
  redirect: false,
});

if (result?.ok) {
  await fetch("/api/cart/merge", { method: "POST" });
  router.push("/"); // or wherever you redirect after login
}
*/
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
        console.error("Error in POST /api/cart/merge:", error);
        return handleApiError(error, "MERGE CART");
    }
}