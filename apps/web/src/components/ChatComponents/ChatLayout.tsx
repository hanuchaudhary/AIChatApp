"use client"

import ChatArea from "./ChatArea"
import { OutputContainer } from "./OutputContainer"

export default function ChatLayout() {

  return (
    <div className="h-[100vh] grid grid-cols-2 bg-neutral-800">

      <ChatArea />
      <OutputContainer />
    </div>
  )
}

