import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import prisma from "@repo/database";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const filter = await request.nextUrl.searchParams.get("filter");
    let users: any;
    if (filter) {
      users = await prisma.user.findMany({
        where: {
          OR: [
            {
              name: {
                contains: filter,
              },
            },
            {
              email: {
                contains: filter,
              },
            },
          ],
        },
        select: {
          email: true,
          username: true,
          id: true,
          image: true,
        },
      });
    } else {
      users = [];
    }

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("User fetch error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}