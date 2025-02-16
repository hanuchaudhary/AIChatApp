"use client";

import { useRouter } from "next/navigation";
import { AddUsers } from "./ChatComponents/AddUsers";
import { ChatUsers } from "./ChatComponents/ChatUsers";
import ThemeToggle from "./ThemeToggle";
import { MessageCircle } from "lucide-react";
import { useEffect, useMemo } from "react";


export const Sidebar: React.FC = () => {
  const router = useRouter();
 
  return (
    <nav className="h-screen bg-neutral-950 rounded-r-lg w-14 flex items-center flex-col justify-between p-4">
      <div className="flex flex-col items-center space-y-4">
        <h2 className="text-xl font-semibold"><MessageCircle /></h2>
        <AddUsers />
        <ChatUsers />
      </div>
      <div className="flex items-center justify-center flex-col space-x-4">
        <ThemeToggle />
      </div>
    </nav>
  );
}