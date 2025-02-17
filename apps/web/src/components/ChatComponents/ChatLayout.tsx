"use client"

import { Sidebar } from "../Sidebar"
import ChatArea from "./ChatArea"
import { OutputContainer } from "./OutputContainer"

export default function ChatLayout() {

  return (
    <div className="h-[100vh] flex">
      <Sidebar />
      <div className="flex h-full px-2 gap-2 w-full">
        <ChatArea />
        <OutputContainer />
      </div>
    </div>
  )
}

