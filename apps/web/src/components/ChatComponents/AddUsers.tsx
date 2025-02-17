"use client";

import { UserPlus } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { useEffect, useState } from "react";
import { useUsersStore } from "@/store/useUsersStore";
import { UserAvatar } from "../UserAvatar";
import { usePathname } from "next/navigation";
import { useChatStore } from "@/store/ChatStore";

export const AddUsers: React.FC = () => {
    const [filter, setFilter] = useState("");

    const { fetchUsers, isLoading, users } = useUsersStore()
    const { addUser, chatUsers } = useChatStore()

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers(filter);
        }, 300);

        return () => clearTimeout(timer);
    }, [filter]);


    const pathname = usePathname();
    const chatId = pathname.split("/")[2];

    return (
        <AlertDialog >
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <UserPlus className="h-6 w-6" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <h2 className="text-lg font-semibold mb-4">Add User to Chat</h2>
                <Input placeholder="Search username" onChange={(e) => setFilter(e.target.value)} value={filter} className="mb-4" />
                <ScrollArea>
                    <div className="space-y-4">
                        {users.map((user) => (
                            <div key={user.id} className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <UserAvatar fallback={user.username} src={user.image!} />
                                    <div className="leading-none flex flex-col">
                                        <p className="text-lg">{user.username}</p>
                                        <span className="text-sm text-muted-foreground">
                                            {user.email}
                                        </span>
                                    </div>

                                </div>
                                <Button onClick={() => addUser(user.id, chatId)} variant="ghost" size="icon">
                                    <UserPlus className="h-6 w-6" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </AlertDialogContent>
        </AlertDialog>
    );
}