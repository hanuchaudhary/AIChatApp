"use client";

import { useRouter } from "next/navigation";
import { AddUsers } from "./ChatComponents/AddUsers";
import { ChatUsers } from "./ChatComponents/ChatUsers";
import ThemeToggle from "./ThemeToggle";
import { MessageCircle } from "lucide-react";
import { useEffect, useMemo } from "react";
import Link from "next/link";
import { UserAvatar } from "./UserAvatar";
import { useSession } from "next-auth/react";


export const Sidebar: React.FC = () => {
  const router = useRouter();
  const { data, status } = useSession();

  return (
    <nav className="h-screen bg-primary-foreground rounded-r-lg w-14 flex items-center flex-col justify-between p-4">
      <div className="flex flex-col items-center space-y-4">
        <h2 className="text-xl font-semibold"><MessageCircle /></h2>
        <AddUsers />
        <ChatUsers />
      </div>
      <div className="flex items-center justify-center flex-col gap-4">
        {status === "authenticated" && (
          <Link href={"/profile"}>
            <UserAvatar src={data?.user.image!} fallback={data?.user.username!} />
          </Link>
        )
        }
        <ThemeToggle />
      </div>
    </nav>
  );
}