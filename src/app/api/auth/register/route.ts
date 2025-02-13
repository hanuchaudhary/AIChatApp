import { db } from "@/db";
import { userSchema } from "@/validations/validations";
import { NextRequest, NextResponse } from "next/server";
import { user } from "../../../../../drizzle/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        const { email, password, username } = await request.json();
        if (!email || !password || !username) {
            return NextResponse.json({ error: "Please fill out all fields." }, { status: 400 });
        }

        const validation = userSchema.safeParse({ email, password, username });
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.format() }, { status: 400 });
        }

        const existingUser = await db.select().from(user).where(eq(user.email, email));
        if (existingUser.length > 0) {
            return NextResponse.json({ error: "User already exists." }, { status: 400 });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await db.insert(user).values({
            email,
            username,
            password : hashPassword,
        });

        return NextResponse.json({ message: "User registered successfully." }, { status: 201 });


    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Server error while registering user." }, { status: 500 });
    }

}