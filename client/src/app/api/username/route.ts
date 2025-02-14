import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { users } from "@/db/schema"; // Ensure this is correctly named
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
    try {
        const { username } = await request.json();

        if (!username) {
            return NextResponse.json({ error: "Username is required." }, { status: 400 });
        }

        const existingUser = await db.select().from(users).where(eq(users.username, username)).limit(1);

        if (existingUser.length > 0) {
            return NextResponse.json({ error: "Username is already taken." }, { status: 400 });
        }

        return NextResponse.json({ message: "Username is available." });

    } catch (error) {
        console.error("Error checking username:", error);
        return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
    }
}
