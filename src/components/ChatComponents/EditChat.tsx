import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useChatStore } from "@/store/ChatStore";
import { chatInterface } from "@/types/types";
import { Textarea } from "../ui/textarea";

export default function EditChat({ id }: { id: string }) {
  const { updateChat, fetchChats, chatList } = useChatStore();
  const [editingChat, setEditingChat] = useState<chatInterface | null>(null);

  const getChatById = (id: string) => {
    return chatList.find((chat) => chat.id === id);
  };

  const handleOpen = () => {
    const chat = getChatById(id);
    setEditingChat(chat!);
  };

  const handleUpdate = async () => {
    if (editingChat) {
      await updateChat(id, editingChat.name, editingChat.description);
      setEditingChat(null);
      fetchChats();
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger onClick={handleOpen}>
        <Button size={"sm"} variant="secondary">Edit Chat</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Chat</AlertDialogTitle>
          <AlertDialogDescription>
            Make changes to your chat here. Click save when you're done.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            value={editingChat?.name ?? ""}
            onChange={(e) =>
              setEditingChat((prev) =>
                prev ? { ...prev, name: e.target.value } : null
              )
            }
            placeholder="Chat name"
          />
          <Textarea
          className="h-24"
            value={editingChat?.description ?? ""}
            onChange={(e) =>
              setEditingChat((prev) =>
                prev ? { ...prev, description: e.target.value } : null
              )
            }
            placeholder="Chat description"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setEditingChat(null)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleUpdate}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
