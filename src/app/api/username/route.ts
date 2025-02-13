import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { user } from "../../../../drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
    try {
        const { username } = await request.json();
        if (!username) {
            return NextResponse.json({ error: "Username is required." }, { status: 400 });
        }

        const dbUsername = await db.select().from(user).where(eq(user.username, username));
        if (dbUsername.length > 0) {
            return NextResponse.json({ error: "Username is already taken." }, { status: 400 });
        }

        return NextResponse.json({ message: "Username is available." });

    } catch (error) {
        return NextResponse.json({ error: "An error occurred." }, { status: 500 });
    }
}