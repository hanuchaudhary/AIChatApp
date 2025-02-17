import { formatTimeAgo } from "@/lib/FormatTime";
import { UserAvatar } from "../UserAvatar";

interface MessageBubbleProps {
  username: string;
  avatar: string;
  message: string;
  createdAt: string;
  isMe: boolean;
}

export const MessageBubble = ({
  createdAt,
  isMe,
  message,
  username,
  avatar
}: MessageBubbleProps) => {
  return (
    <div className={`flex gap-2 mt-1 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
      <UserAvatar fallback={username} src={avatar} />
      <div
        className={`flex flex-col max-w-xs p-2 rounded-lg ${
          isMe ? "bg-primary text-primary-foreground" : "bg-blue-600 text-white"
        }`}
      >
        {!isMe && <span className="font-semibold text-sm">@{username}</span>}
        <p className="text-sm">
          {message.split(" ").map((word, index) =>
            word.startsWith("@") ? (
              <span key={index} className="bg-neutral-300 text-black rounded px-1 mx-0.5">
                {word}
              </span>
            ) : (
              ` ${word} `
            )
          )}
        </p>
        <p className="text-xs text-muted-foreground text-right">
          {formatTimeAgo(new Date(createdAt))}
        </p>
      </div>
    </div>
  );
};
