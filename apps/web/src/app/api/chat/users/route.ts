import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import prisma from "@repo/database";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { userIds, chatId }: { userIds: string[]; chatId: string } =
      await request.json();

    await prisma.userChat.createMany({
      data: userIds.map((userId) => ({
        userId,
        chatId,
      })),
    });

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

    const chatUsers = await prisma.chat.findUnique({
      where: { id: session.user.id },
      include: { users: { include: { user: true } } },
    });

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
    const chatExists = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
    });

    if (!chatExists) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const isCreator = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      select: {
        creatorId: true,
      },
    });

    if (!isCreator) {
      return NextResponse.json(
        { error: "Only the creator can remove users" },
        { status: 403 }
      );
    }

    await prisma.userChat.delete({
      where: {
        userId_chatId: {
          userId,
          chatId,
        },
      },
    });

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
