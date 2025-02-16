import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/database";
export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: "Username is required." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username is already taken." },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Username is available." });
  } catch (error) {
    console.error("Error checking username:", error);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
