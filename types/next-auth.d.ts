import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "CUSTOMER";
      name: string | null;
      email: string;
      isVerified: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "ADMIN" | "CUSTOMER";
    name: string | null;
    email: string;
    isVerified: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "ADMIN" | "CUSTOMER";
    name: string | null;
    email: string;
    isVerified: boolean;
  }
}
