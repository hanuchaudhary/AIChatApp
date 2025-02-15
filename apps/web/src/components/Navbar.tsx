"use client";

import { usePathname, useRouter } from "next/navigation";
import { AddUsers } from "./ChatComponents/AddUsers";
import { ChatUsers } from "./ChatComponents/ChatUsers";
import ThemeToggle from "./ThemeToggle";

export const Navbar: React.FC = () => {
  const router = useRouter();
 

  return (
    <nav className="h-screen bg-secondary w-16 flex items-center flex-col justify-between p-4">
      <div className="flex flex-col items-center space-y-4">
        <h2 className="text-xl font-semibold">CHAT.io</h2>
        <AddUsers />
        <ChatUsers />
      </div>
      <div className="flex items-center justify-center flex-col space-x-4">
        <ThemeToggle />
      </div>
    </nav>
  );
}