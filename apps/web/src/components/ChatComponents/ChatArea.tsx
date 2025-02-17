"use client"

import type React from "react"

import { useEffect, useMemo, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getSocket } from "@/lib/socket.config"
import { useMessages } from "@/hooks/useMessages"
import { ChatHeader } from "./ChatHeader"
import { Skeleton } from "@/components/ui/skeleton"

type SocketDataType = {
  message: string
  chatId: string
  userId: string
}

export default function ChatArea() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const chatId = pathname.split("/")[2]

  const [message, setMessage] = useState("")
  const { messages, isLoading, setMessages } = useMessages(chatId)

  const socket = useMemo(() => {
    const newSocket = getSocket()
    newSocket.auth = { room: chatId }
    return newSocket
  }, [chatId])

  useEffect(() => {
    socket.connect()

    const handleNewMessage = (data: SocketDataType) => {
      //@ts-ignore
      setMessages((prev) => [...prev, data])
    }

    socket.on("message", handleNewMessage)

    return () => {
      socket.off("message", handleNewMessage)
      socket.disconnect()
    }
  }, [socket, setMessages])

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim().length === 0) return

    const newMessage: SocketDataType = {
      message,
      chatId,
      userId: session?.user?.id || "",
    }

    socket.emit("message", newMessage)
    //@ts-ignore
    setMessages((prev) => [...prev, newMessage])
    setMessage("")
  }

  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex flex-col rounded-l-2xl overflow-hidden h-full w-[28rem] border-r border-r-primary-foreground">
      <ChatHeader />

      <ScrollArea className="flex-grow h-96 p-4">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-center space-x-2 mb-2 ${session?.user.id === String(msg.userId) ? "justify-end" : "justify-start"
                }`}
            >
              <div className="bg-secondary max-w-[80%] p-2 rounded-lg">
                <p className={session?.user?.id === String(msg.userId) ? "text-right" : "text-left"}>{msg.message}</p>
              </div>
            </div>
          ))
        )}
        <div ref={scrollRef} />
      </ScrollArea>

      <form onSubmit={sendMessage} className="flex items-center space-x-2 p-4">
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow"
          placeholder="Type a message..."
        />
        <Button type="submit" variant="default">
          Send
        </Button>
      </form>
    </div>
  )
}