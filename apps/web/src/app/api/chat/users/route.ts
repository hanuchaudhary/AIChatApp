import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { db } from "@/db";
import { chats, userChats, users } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { userIds, chatId }: { userIds: string[]; chatId: string } =
      await request.json();
    await db
      .insert(userChats)
      .values(userIds.map((userId: string) => ({ userId, chatId })));

    return NextResponse.json(
      { message: userIds.length + " Users added to chat" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { chatId } = await request.json();
    const chatUsers = await db
      .select({ userId: userChats.userId })
      .from(userChats)
      .where(eq(userChats.chatId, chatId));

    const userIds = chatUsers.map((user) => user.userId);

    const chatUsersData = await db
      .select()
      .from(users)
      .where(inArray(users.id, userIds));

    return NextResponse.json(chatUsers, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { userId, chatId }: { userId: string; chatId: string } =
      await request.json();

    // Check if the chat exists
    const chatExists = await db
      .select()
      .from(chats)
      .where(eq(chats.id, chatId));

    if (chatExists.length === 0) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const isCreator = await db
      .select()
      .from(chats)
      .where(and(eq(chats.id, chatId), eq(chats.creatorId, session.user.id)));

    if (isCreator.length === 0) {
      return NextResponse.json(
        { error: "Only the creator can remove users" },
        { status: 403 }
      );
    }

    await db
      .delete(userChats)
      .where(and(eq(userChats.chatId, chatId), eq(userChats.userId, userId)));

    return NextResponse.json({
      success: true,
      message: "User removed from chat",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
