import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { registerSchema } from "@/schemas";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const data = registerSchema.safeParse(body);

        if (!data.success) {
            return NextResponse.json({
                success: false,
                message: "Invalid request data",
                errors: data.error.format(),
            }, { status: 400 });
        }

        const { name, email, password } = data.data;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "User with email already exists" },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return NextResponse.json({
            success: true,
            message: "User registered successfully",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
            },
        }, { status: 201 });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error",
        }, { status: 500 });
    }
}