import { Server, Socket } from "socket.io";
import prisma from "@repo/database";
import { generateContent } from "./generative.config.js";

interface CustomSocket extends Socket {
  room?: string;
}

type IncomingDataType = {
  message: string;
  chatId: string;
  userId: string;
};

export const socketInit = (io: Server) => {
  io.use((socket: CustomSocket, next) => {
    const room = socket.handshake.auth?.room;
    if (!room) return next(new Error("No room provided"));
    socket.room = room;
    next();
  });

  io.on("connection", (socket: CustomSocket) => {
    if (!socket.room) {
      console.error("Socket connected without a room!");
      socket.disconnect();
      return;
    }

    socket.join(socket.room);
    console.log("User connected:", socket.id, "Room:", socket.room);

    socket.on("message", async (data: IncomingDataType) => {
      try {
        // Fetch user details & AI response in parallel
        const [user, aiResponse] = await Promise.all([
          prisma.user.findUnique({
            where: { id: data.userId },
            select: { id: true, username: true, image: true },
          }),
          data.message.startsWith("@AI") ? generateContent(data.message) : null,
        ]);

        if (!user) {
          console.error("User not found in database");
          return;
        }

        // Save user message to the database
        const savedMessage = await prisma.message.create({
          data: {
            message: data.message,
            chatId: data.chatId,
            userId: data.userId,
          },
        });

        // Construct user message object
        const enrichedMessage = {
          id: savedMessage.id,
          message: savedMessage.message,
          chatId: savedMessage.chatId,
          createdAt: savedMessage.createdAt,
          user: {
            id: user.id,
            username: user.username,
            image: user.image,
          },
        };

        // Send user message to the room
        socket.to(socket.room!).emit("message", enrichedMessage);
        console.log("User message sent:", enrichedMessage);

        // If AI is triggered, send a separate AI message
        if (aiResponse) {
          const aiMessage = {
            id: `ai-${Date.now()}`, // Temporary ID for AI message
            message: aiResponse,
            chatId: data.chatId,
            createdAt: new Date(),
            user: {
              id: "ai-bot",
              username: "AI Assistant",
              image: "https://i.pinimg.com/474x/32/85/d7/3285d7a00dc65dfb890dffa978b7fd64.jpg", // Add AI bot avatar
            },
          };

          // Broadcast AI message
          io.to(socket.room!).emit("message", aiMessage);
          console.log("AI message sent:", aiMessage);
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
