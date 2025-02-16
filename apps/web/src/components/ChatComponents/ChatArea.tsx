"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { getSocket } from "@/lib/socket.config";
import { useSession } from "next-auth/react";
import { useMessages } from "@/hooks/useMessages";

type SocketDataType = {
    message: string;
    chatId: string;
    userId: string;
};

export default function ChatArea() {
    const { data } = useSession();
    const pathname = usePathname();
    const chatId = pathname.split("/")[2];

    const [message, setMessage] = useState("");
    const { messages, isLoading, setMessages } = useMessages(chatId);

    const socket = useMemo(() => {
        const newSocket = getSocket();
        newSocket.auth = { room: chatId };
        return newSocket;
    }, [chatId]);

    useEffect(() => {
        socket.connect();

        socket.on("message", (data: SocketDataType) => {
            setMessages((prev) => [...prev, data]);
        });

        return () => {
            socket.off("message");
            socket.disconnect();
        };
    }, [socket]);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim().length === 0) return;

        const newMessage: SocketDataType = {
            message,
            chatId,
            userId: data?.user.id || "",
        };

        socket.emit("message", newMessage);
        setMessages((prev) => [...prev, newMessage]);
        setMessage("");
    };

    const scrollRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    return (
        <div className="h-full flex w-96 border-r border-r-primary-foreground">
            <div className="flex flex-col flex-grow">
                <div className="flex items-center bg-neutral-950 justify-between p-4 border-b">
                    <h1 className="text-xl font-semibold">{chatId}</h1>
                </div>

                <ScrollArea className="p-4 h-[50vh] overflow-y-scroll">
                    {messages.map((msg, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <div className="bg-neutral-950 p-2 rounded-lg">
                                <p>{msg.message}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={scrollRef} />
                </ScrollArea>

                <form onSubmit={sendMessage} className="flex items-center space-x-4 p-4">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-neutral-950 rounded-lg p-2"
                        placeholder="Type a message..."
                    />
                    <button
                        type="submit"
                        className="bg-primary-500 text-white rounded-lg p-2"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}
