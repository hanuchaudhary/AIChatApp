"use client"

import type React from "react"

import {  UserPlus, Users, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChatStore } from "@/store/ChatStore"
import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { UserAvatar } from "@/components/UserAvatar"
import { Separator } from "@/components/ui/separator"

export const ChatUsers: React.FC = () => {
  const pathname = usePathname()
  const chatId = pathname.split("/")[2]

  const { chatUsers, fetchChatUsers, removeUser, isLoading } = useChatStore()

  useEffect(() => {
    fetchChatUsers(chatId)
  }, [fetchChatUsers, chatId])

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Users className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
            {chatUsers.length}
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Chat Users</h2>
          <Button variant="outline" size="icon">
            <UserPlus className="h-4 w-4" />
          </Button>
        </div>
        <Separator className="mb-6" />
        <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground animate-pulse">Loading users...</p>
            </div>
          ) : chatUsers.length > 0 ? (
            <div className="space-y-4">
              {chatUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between bg-secondary/30 rounded-lg p-3 transition-all hover:bg-secondary/50"
                >
                  <div className="flex items-center space-x-3">
                    <UserAvatar src={user.image!} fallback={user.username} />
                    <div>
                      <p className="font-medium">{user.username}</p>
                      <p className="text-sm text-muted-foreground">User ID: {user.id.slice(0, 8)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeUser(user.id, chatId)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-secondary/30 rounded-xl p-6 text-center">
              <p className="text-muted-foreground">No users in this chat</p>
              <Button variant="outline" className="mt-4">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Users
              </Button>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

