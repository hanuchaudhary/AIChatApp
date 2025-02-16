"use client";

import { ChatList } from "@/components/ChatComponents/ChatList";
import { CreateChatDialog } from "@/components/ChatComponents/CreateChat";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

export default function page() {

  const router = useRouter();

  return (
    <div className="pt-10 max-w-6xl mx-auto">
      <CreateChatDialog />
      <Button onClick={() => {
        signOut();
        router.push("/");
      }}>Logout</Button>
      <ChatList />
    </div>
  );
}
