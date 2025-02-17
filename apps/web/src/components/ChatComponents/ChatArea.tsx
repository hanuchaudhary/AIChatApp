"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSocket } from "@/lib/socket.config";
import { useMessages } from "@/hooks/useMessages";
import { ChatHeader } from "./ChatHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageBubble } from "./MessageBubble";
import { Send } from "lucide-react";
import { useChatStore } from "@/store/ChatStore";
import { userTypes } from "@/types/types";

export type IncomingDataType = {
  id: string;
  message: string;
  chatId: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    image: string;
  };
};

export default function ChatArea() {
  const { data: session } = useSession();
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

    const handleNewMessage = (data: IncomingDataType) => {
      setMessages((prev: IncomingDataType[]) => [...prev, data]);
    };

    socket.on("message", handleNewMessage);

    return () => {
      socket.off("message", handleNewMessage);
      socket.disconnect();
    };
  }, [socket, setMessages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim().length === 0) return;

    const newMessage = {
      message,
      chatId,
      userId: session?.user?.id || "",
    };

    socket.emit("message", newMessage);
    setMessages((prev) => [...prev, {
      chatId: newMessage.chatId,
      createdAt: new Date().toISOString(),
      id: Math.random().toString(),
      message: newMessage.message,
      user: {
        id: session?.user?.id || "",
        image: session?.user?.image || "",
        username: session?.user?.username || "",
      }
    }]);
    setMessage("");
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const [showMentionPopup, setShowMentionPopup] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<userTypes[]>([]);
  const [mentionQuery, setMentionQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { chatUsers } = useChatStore()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setMessage(text);
    if (!text) {
      setShowMentionPopup(false);
    }

    // Detect @ mention
    const match = text.match(/@(\w*)$/);
    if (match) {
      setShowMentionPopup(true);
      const query = match[1].toLowerCase();
      setMentionQuery(query);

      const filtered = chatUsers.filter((user) =>
        user.username.toLowerCase().startsWith(query)
      );
      setFilteredUsers([...filtered, { id: "yakyak", username: "YakBot", image: "https://i.pinimg.com/474x/32/85/d7/3285d7a00dc65dfb890dffa978b7fd64.jpg", email: "yakyakai@gmail.com" }]);
    } else {
      setShowMentionPopup(false);
      setMentionQuery("");
    }
  };

  const selectUser = (user: userTypes) => {
    // Replace @mention in input
    const newMessage = message.replace(/@\w*$/, `@${user.username} `);
    setMessage(newMessage);
    setShowMentionPopup(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showMentionPopup) return;

    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) =>
        prev < filteredUsers.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && filteredUsers.length > 0) {
      e.preventDefault();
      selectUser(filteredUsers[selectedIndex]);
    } else if (e.key === "Escape") {
      setShowMentionPopup(false);
    }
  };

  return (
    <div className="relative flex flex-col rounded-l-2xl overflow-hidden h-full w-[28rem] border-r border-r-primary-foreground">
      <ChatHeader />

      <ScrollArea className="flex-grow h-96 p-4">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              createdAt={msg.createdAt}
              isMe={session?.user.id === msg.user.id}
              message={msg.message}
              username={msg.user.username}
              avatar={msg.user.image}
            />
          ))
        )}
        <div ref={scrollRef} />
      </ScrollArea>

      {showMentionPopup && (
        <div className="absolute bottom-14 left-4 mt-1 w-48 bg-secondary shadow-lg rounded-md lowercase overflow-hidden space-y-1 p-1">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <span
                key={user.id}
                className={`flex items-center p-1 rounded-md text-sm bg-primary-foreground cursor-pointer ${selectedIndex === index ? "bg-neutral-600" : "hover:bg-neutral-600"
                  }`}
                onClick={() => selectUser(user)}
              >
                @{user.username}
              </span>
            ))
          ) : (
            <div className="p-2 text-muted-foreground">No users found</div>
          )}
        </div>
      )}
      <form onSubmit={sendMessage} className="flex items-center space-x-2 p-4">
        <Input
          type="text"
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-grow"
          placeholder="Type a message..."
        />
        <Button type="submit" variant="default">
          <Send />
        </Button>
      </form>
    </div>
  );
}
