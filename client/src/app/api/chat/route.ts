import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { db } from "@/db";
import { chats } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, description } = await request.json();

        const chatAlreadyExists = await db
            .select()
            .from(chats)
            .where(eq(chats.name, name))
            .limit(1);

        if (chatAlreadyExists.length > 0) {
            return NextResponse.json({ error: "Chat already exists with this name" }, { status: 400 });
        }

        const [newChat] = await db.insert(chats).values({
            name,
            description,
            creatorId: session.user.id,
        }).returning();

        return NextResponse.json(newChat, { status: 201 });

    } catch (error) {
        console.error("Chat creation error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userChats = await db
            .select()
            .from(chats)
            .where(eq(chats.creatorId, session.user.id));

        return NextResponse.json(userChats, { status: 200 });

    } catch (error) {
        console.error("Chat fetch error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id, name, description } = await request.json();

        const chat = await db
            .select()
            .from(chats)
            .where(eq(chats.id, id))
            .limit(1);

        if (chat.length === 0) {
            return NextResponse.json({ error: "Chat not found" }, { status: 404 });
        }

        if (chat[0].creatorId !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const updatedChat = await db
            .update(chats)
            .set({ name, description })
            .where(eq(chats.id, id))
            .returning();

        return NextResponse.json(updatedChat, { status: 200 });

    } catch (error) {
        console.error("Chat update error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await request.json();

        const chat = await db
            .select()
            .from(chats)
            .where(eq(chats.id, id))
            .limit(1);

        if (chat.length === 0) {
            return NextResponse.json({ error: "Chat not found" }, { status: 404 });
        }

        if (chat[0].creatorId !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await db.delete(chats).where(eq(chats.id, id));

        return NextResponse.json({ message: "Chat deleted" }, { status: 200 });

    } catch (error) {
        console.error("Chat deletion error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}