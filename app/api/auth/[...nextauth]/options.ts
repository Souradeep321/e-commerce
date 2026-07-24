import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { mergeGuestCartWithUserCart } from "@/lib/cart-merge";
import { loginSchema } from "@/schemas";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req): Promise<any> {
                try {
                    const parsed = loginSchema.safeParse(credentials);

                    if (!parsed.success) {
                        return null;
                    }

                    const { email, password } = parsed.data;

                    const user = await prisma.user.findUnique({
                        where: { email },
                    });

                    if (!user || !user.password) {
                        return null;
                    }

                    const isPasswordValid = await bcrypt.compare(password, user.password);

                    if (!isPasswordValid) {
                        return null;
                    }

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    };
                } catch (error) {
                    console.error("Error in authorize function:", error);
                    throw new Error("Authentication failed");
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.name = user.name;
                token.email = user.email;
            }
            return token;
        }, async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.name = token.name;
                session.user.email = token.email;

                // 🔥 MERGE GUEST CART ON LOGIN
                try {
                    const cookieStore = await cookies();
                    const sessionId = cookieStore.get("guest_session_id")?.value;

                    if (sessionId && session.user.id) {
                        await mergeGuestCartWithUserCart(session.user.id, sessionId);
                        // Clear guest session cookie after merge
                        cookieStore.delete("guest_session_id");
                    }
                } catch (error) {
                    console.error("Cart merge on login failed:", error);
                    // Don't block login if merge fails
                }
            }
            return session;
        }

    },
    pages: {
        signIn: "/sign-in",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};