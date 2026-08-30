import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/schemas";
import { checkRateLimit } from "@/lib/rate-limit/rate-limit-helper";
import { authRateLimit } from "@/lib/rate-limit/rate-limit";


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

                    const rateLimitResponse = await checkRateLimit(authRateLimit, `login:${email}`);
                    if (rateLimitResponse) return null; // authorize() must return null, not a NextResponse

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
                        isVerified: user.isVerified,
                    };
                } catch (error) {
                    console.error("Error in authorize function:", error);
                    throw new Error("Authentication failed");
                }
            }
        })
    ],
    callbacks: {
        //         async jwt({ token, user, trigger }) {
        //             console.log("JWT CALLBACK FIRED — trigger:", trigger, "isVerified:", token.isVerified, "id:", token.id);
        //             if (user) {
        //                 token.id = user.id;
        //                 token.role = user.role;
        //                 token.name = user.name;
        //                 token.email = user.email;
        //                 token.isVerified = user.isVerified;
        //             }

        //             // So we don't need the trigger update cause 
        //             // // 🔥 Re-fetch fresh isVerified from DB when explicitly triggered
        //             // if (trigger === "update") {
        //             //     const freshUser = await prisma.user.findUnique({
        //             //         where: { id: token.id as string },
        //             //         select: { isVerified: true },
        //             //     });
        //             //     if (freshUser) {
        //             //         token.isVerified = freshUser.isVerified;
        //             //     }
        //             // }

        //             // isVerified only ever flips false -> true, so once it's true we
        //             // never need to touch the DB again for this token.
        //             if (!token.isVerified && token.id) {
        //                 const freshUser = await prisma.user.findUnique({
        //                     where: { id: token.id as string },
        //                     select: { isVerified: true },
        //                 });
        //                 if (freshUser?.isVerified) {
        //                     token.isVerified = true;
        //                 }
        //             }

        //             /*
        //             if (token.id && (!token.isVerified || token.role !== "ADMIN")) {
        //                 const freshUser = await prisma.user.findUnique({
        //                     where: {
        //                         id: token.id as string,
        //                     },
        //                     select: {
        //                         isVerified: true,
        //                         role: true,
        //                     },
        //                 });

        //                 if (freshUser) {
        //                     if (!token.isVerified && freshUser.isVerified) {
        //                         token.isVerified = true;
        //                     }

        //                     if (token.role !== "ADMIN" && freshUser.role === "ADMIN") {
        //                         token.role = "ADMIN";
        //                     }
        //                 }
        //             }
        // */
        //             // TODO: On your /verify-email page (client-side), call update() from useSession() right after the verify API call succeeds:

        //             return token;
        //         }
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.name = user.name;
                token.email = user.email;
                token.isVerified = user.isVerified;
                token.roleCheckedAt = Date.now();
            }

            const ROLE_RECHECK_INTERVAL = 5 * 60 * 1000; // 5 min
            const needsRoleCheck =
                !token.roleCheckedAt || Date.now() - (token.roleCheckedAt as number) > ROLE_RECHECK_INTERVAL;

            if (token.id && (!token.isVerified || needsRoleCheck)) {
                const freshUser = await prisma.user.findUnique({
                    where: { id: token.id as string },
                    select: { isVerified: true, role: true },
                });

                if (freshUser) {
                    if (!token.isVerified && freshUser.isVerified) token.isVerified = true;
                    if (token.role !== freshUser.role) token.role = freshUser.role; // now heals BOTH directions
                    token.roleCheckedAt = Date.now();
                }
            }

            return token;
        }
        , async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.isVerified = token.isVerified;
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