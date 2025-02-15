"use client"

import { Sidebar } from "../Sidebar"
import ChatArea from "./ChatArea"
import { OutputContainer } from "./OutputContainer"

export default function ChatLayout() {

  return (
    <div className="h-[100vh] flex bg-neutral-800">
      <Sidebar />
      <div className="grid grid-cols-2 h-full">
        <ChatArea />
        <OutputContainer />
      </div>
    </div>
  )
}

