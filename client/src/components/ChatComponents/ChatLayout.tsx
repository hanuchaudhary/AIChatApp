"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { MenuIcon, Send, UserPlus } from "lucide-react"

export default function ChatLayout() {
  const [message, setMessage] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)

  const handleSendMessage = () => {
    console.log("Sending message:", message)
    setMessage("")
  }

  return (
    <div className="flex h-[calc(100vh-100px)] bg-background">
      <div className="flex flex-col flex-grow">
        <div className="flex items-center justify-between p-4 border-b">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <MenuIcon className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <ScrollArea className="h-[calc(100vh-4rem)] w-full">
  
                <div className="p-4">User list goes here</div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
          <h1 className="text-xl font-semibold">Chat Room</h1>
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <UserPlus className="h-6 w-6" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <h2 className="text-lg font-semibold mb-4">Add User to Chat</h2>
              <Input placeholder="Search username" className="mb-4" />
              {/* Add user search results here */}
              <div>User search results go here</div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-grow p-4">
          {/* Add messages here */}
          <div className="space-y-4">
            <div className="bg-primary-foreground p-2 rounded-lg max-w-[70%] self-start">Hello! How are you?</div>
            <div className="bg-primary p-2 rounded-lg max-w-[70%] self-end ml-auto text-primary-foreground">
              I'm doing great, thanks for asking!
            </div>
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t flex items-center space-x-2">
          <Input
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

