import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@repo/database";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description } = await request.json();

    const chatAlreadyExists = await prisma.chat.findFirst({
      where: {
        title,
      },
    });

    if (chatAlreadyExists) {
      return NextResponse.json(
        { error: "Chat already exists with this name" },
        { status: 400 }
      );
    }

    const newChat = await prisma.chat.create({
      data: {
        title,
        description,
        creatorId: session.user.id,
      },
    });

    return NextResponse.json(newChat, { status: 201 });
  } catch (error) {
    console.error("Chat creation error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userChats = await prisma.userChat.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        chat: true,
      },
    });

    return NextResponse.json(userChats.map((chat) => chat.chat), { status: 200 });
  } catch (error) {
    console.error("Chat fetch error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, name, description } = await request.json();

    const chat = await prisma.chat.findUnique({
      where: {
        id,
      },
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    if (chat.creatorId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updatedChat = await prisma.chat.update({
      where: {
        id,
      },
      data: {
        title: name,
        description,
      },
    });

    return NextResponse.json(updatedChat, { status: 200 });
  } catch (error) {
    console.error("Chat update error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();

    const chat = await prisma.chat.findUnique({
      where: {
        id,
      },
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    if (chat.creatorId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.chat.delete({ where: { id } });

    return NextResponse.json({ message: "Chat deleted" }, { status: 200 });
  } catch (error) {
    console.error("Chat deletion error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
