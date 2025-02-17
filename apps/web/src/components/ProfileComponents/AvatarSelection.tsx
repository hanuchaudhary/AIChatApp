"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const avatars = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
  "/avatars/avatar5.png",
  "/avatars/avatar6.png",
  "/avatars/avatar7.png",
  "/avatars/avatar8.png",
]

export default function AvatarSelection() {
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0])

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="w-24 h-24">
        <AvatarImage src={selectedAvatar} alt="Profile Avatar" />
        <AvatarFallback>Avatar</AvatarFallback>
      </Avatar>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Change Avatar</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Choose an Avatar</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-4 py-4">
            {avatars.map((avatar, index) => (
              <Avatar
                key={index}
                className="w-16 h-16 cursor-pointer hover:ring-2 hover:ring-primary"
                onClick={() => setSelectedAvatar(avatar)}
              >
                <AvatarImage src={avatar} alt={`Avatar ${index + 1}`} />
                <AvatarFallback>Avatar</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

