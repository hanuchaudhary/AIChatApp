"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from "lucide-react"
import { usePathname } from "next/navigation"

export default function ChatArea() {
    const [message, setMessage] = useState("")

    const pathname = usePathname();

    const chatname = pathname.split("/")[2];

    const handleSendMessage = () => {
        console.log("Sending message:", message)
        setMessage("")
    }

    return (
        <div className="h-full flex w-96 border-r border-r-primary-foreground">
            <div className="flex flex-col flex-grow">
                <div className="flex items-center bg-neutral-950 justify-between p-4 border-b">
                    <h1 className="text-xl font-semibold">{chatname}</h1>
                </div>

                <ScrollArea className="flex-grow p-4">
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

