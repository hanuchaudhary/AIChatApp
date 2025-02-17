"use client"

import type React from "react"

import { useChatStore } from "@/store/ChatStore"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { CalendarDays, Clock } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Function to format date as "13 November, 2099"
const formatLongDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
    })
}

// Function to format date as "2 seconds ago", "5 minutes ago", etc.
const formatTimeAgo = (date: Date): string => {
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    const intervals = [
        { label: "year", seconds: 31536000 },
        { label: "month", seconds: 2592000 },
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 },
        { label: "second", seconds: 1 },
    ]

    for (let i = 0; i < intervals.length; i++) {
        const interval = intervals[i]
        const count = Math.floor(seconds / interval.seconds)
        if (count >= 1) {
            return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`
        }
    }

    return "just now"
}

export const ChatHeader: React.FC = () => {
    const pathname = usePathname()
    const chatId = pathname.split("/")[2]
    const { singleChat, fetchSingleChat } = useChatStore()

    useEffect(() => {
        fetchSingleChat(chatId)
    }, [fetchSingleChat, chatId])

    const createdDate = singleChat?.createdAt ? new Date(singleChat.createdAt) : null

    return (
        <div className="flex items-center justify-between p-4 bg-secondary">
            <div>
                <h1 className="text-xl font-bold text-primary">{singleChat?.title}</h1>
                {createdDate && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="text-xs text-muted-foreground">
                                    <span>{formatLongDate(createdDate)}</span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span>{formatTimeAgo(createdDate)}</span>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>
        </div>
    )
}

