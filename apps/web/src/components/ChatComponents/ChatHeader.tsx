"use client"

import type React from "react"

import { useChatStore } from "@/store/ChatStore"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { formatLongDate, formatTimeAgo } from "@/lib/FormatTime"


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

