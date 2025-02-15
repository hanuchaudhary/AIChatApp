"use client";

import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/store/ChatStore";
import ChatCard from "./ChatCard";

export function ChatList() {
  const { chatList, fetchChats, deleteChat, updateChat } = useChatStore();

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);


  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="gap-4 p-4 grid grid-cols-3">
        {chatList?.map((chat) => (
          <ChatCard
            id={chat.id}
            description={chat.description}
            name={chat.name}
            key={chat.id}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
