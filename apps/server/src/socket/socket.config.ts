import { Server, Socket } from "socket.io";
import prisma from "@repo/database";

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

    if (!room) {
      return next(new Error("No room provided"));
    }

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
        // Fetch user details
        const user = await prisma.user.findUnique({
          where: { id: data.userId },
          select: { id: true, username: true, image: true },
        });

        if (!user) {
          console.error("User not found in database");
          return;
        }

        // Save the message to the database
        const savedMessage = await prisma.message.create({
          data: {
            message: data.message,
            chatId: data.chatId,
            userId: data.userId,
          },
        });

        // Construct message with user details
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

        console.log("Enriched message:", enrichedMessage);
        

        // Broadcast enriched message to the room
        socket.to(socket.room!).emit("message", enrichedMessage);
        console.log("Message sent to room:", enrichedMessage);
      } catch (error) {
        console.error("Database error:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
