"use client";

import { useRouter } from "next/navigation";
import { AddUsers } from "./ChatComponents/AddUsers";
import { ChatUsers } from "./ChatComponents/ChatUsers";
import ThemeToggle from "./ThemeToggle";
import { MessageCircle } from "lucide-react";
import { useEffect, useMemo } from "react";
import { getSocket } from "@/lib/socket.config";

export const Sidebar: React.FC = () => {
  const router = useRouter();

  let socket = useMemo(() => {
    const socket = getSocket();

    socket.auth = {
      room : "ChatID",
    }

    return socket.connect();
  }, []);

  useEffect(() => {
    socket.on("message", (data: any) => {
      console.log("Message received " + data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);


  const handleClick = () => {
    console.log("Sending message");
    socket.emit("message", "Hello from client " + Math.random());
  }

  return (
    <nav className="h-screen bg-neutral-950 rounded-r-lg w-14 flex items-center flex-col justify-between p-4">
      <div className="flex flex-col items-center space-y-4">
        <h2 className="text-xl font-semibold"><MessageCircle /></h2>
        <AddUsers />
        <ChatUsers />
        <button onClick={handleClick} className="bg-primary-500 text-white rounded-full p-2">Send</button>
      </div>
      <div className="flex items-center justify-center flex-col space-x-4">
        <ThemeToggle />
      </div>
    </nav>
  );
}