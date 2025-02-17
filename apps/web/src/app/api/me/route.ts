import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import prisma from "@repo/database";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profile = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}


