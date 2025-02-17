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
    const { userId, chatId }: { userId: string; chatId: string } =
      await request.json();

    // Check if the chat exists
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      select: { creatorId: true },
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // Ensure the requester is the creator of the chat
    if (chat.creatorId !== session.user.id) {
      return NextResponse.json(
        { error: "Only the creator can add users" },
        { status: 403 }
      );
    }

    // Check if the user exists
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the user is already in the chat
    const userInChat = await prisma.userChat.findUnique({
      where: {
        userId_chatId: {
          userId,
          chatId,
        },
      },
    });

    if (userInChat) {
      return NextResponse.json(
        { error: "User is already in the chat" },
        { status: 400 }
      );
    }

    // Add user to the chat
    await prisma.userChat.create({
      data: {
        userId,
        chatId,
      },
    });

    return NextResponse.json(
      { message: "User added to chat" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get("chatId");

    if (!chatId) {
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 }
      );
    }

    // Check if the chat exists
    const chatExists = await prisma.chat.findUnique({
      where: { id: chatId },
    });

    if (!chatExists) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }
    const usersInChat = await prisma.userChat.findMany({
      where: {
        chatId,
        userId: { not: session.user.id },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(
      usersInChat.map((user) => user.user),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get("chatId");
  const userId = searchParams.get("userId");

  if (!chatId || !userId) {
    return NextResponse.json(
      { error: "Chat ID and User ID are required" },
      { status: 400 }
    );
  }

  try {
    // Check if the chat exists and get its creatorId
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      select: { creatorId: true },
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // Only allow the creator to remove users
    if (chat.creatorId !== session.user.id) {
      return NextResponse.json(
        { error: "Only the creator can remove users" },
        { status: 403 }
      );
    }

    // Check if the user is in the chat
    const userInChat = await prisma.userChat.findUnique({
      where: {
        userId_chatId: {
          userId,
          chatId,
        },
      },
    });

    if (!userInChat) {
      return NextResponse.json(
        { error: "User is not in the chat" },
        { status: 400 }
      );
    }

    // Remove the user from the chat
    await prisma.userChat.delete({
      where: {
        userId_chatId: {
          userId,
          chatId,
        },
      },
    });

    return NextResponse.json(
      { message: "User removed from chat" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

