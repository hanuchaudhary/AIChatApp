"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useChatStore } from "@/store/ChatStore";
import { Pencil, Trash2 } from "lucide-react";
import ChatCard from "./ChatCard";

interface Chat {
  id: string;
  name: string;
  description: string;
}

export function ChatList() {
  const { chatList, fetchChats, deleteChat, updateChat } = useChatStore();
  const [editingChat, setEditingChat] = useState<Chat | null>(null);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);


  const handleEdit = (chat: Chat) => {
    setEditingChat(chat);
  };

  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="gap-4 p-4 grid grid-cols-3">
        {chatList.map((chat) => (
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
