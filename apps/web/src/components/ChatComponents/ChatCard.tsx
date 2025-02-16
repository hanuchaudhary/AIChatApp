import React from "react";
import DeleteChat from "./DeleteChat";
import EditChat from "./EditChat";
import Link from "next/link";

export default function ChatCard({
  title,
  description,
  id,
}: {
  id: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative border p-3 group rounded-2xl hover:border-emerald-600 transition-all duration-300 hover:shadow-md">
      <Link href={`/chat/${id}`}>
        <div className="cursor-pointer">
          <h2 className="text-lg font-semibold mb-4 group-hover:text-emerald-600 transition-colors duration-300">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </Link>
      <div className="flex justify-end mt-4 gap-2">
        <EditChat id={id} />
        <DeleteChat id={id} />
      </div>
    </div>
  );
}
