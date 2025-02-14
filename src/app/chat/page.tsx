
import { ChatList } from "@/components/ChatComponents/ChatList";
import { CreateChatDialog } from "@/components/ChatComponents/CreateChat";
import React from "react";

export default function page() {
  
  return (
    <div className="pt-10 max-w-5xl mx-auto">
      <CreateChatDialog />
      <ChatList/>
    </div>
  );
}
