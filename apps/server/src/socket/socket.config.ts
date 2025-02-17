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
      socket.disconnect(); // Disconnect the socket if no room is assigned
      return;
    }

    socket.join(socket.room);
    console.log("User connected:", socket.id, "Room:", socket.room);

    socket.on("message", async (data: IncomingDataType) => {
      try {

        if (!prisma.message) {
          console.error("Prisma message model is undefined");
        } else {

          const user = await prisma.user.findUnique({
            where: {
              id: data.userId,
            },
          });

          if (!user) {
            console.error("User not found in database");
            return;
          }

          await prisma.message.create({
            data: {
              message: data.message,
              chatId: data.chatId,
              userId: data.userId,
            },
          });

          console.log("Message saved to database");
        }

        // Broadcast message to room
        socket.to(socket.room!).emit("message", data);
        console.log("Message received:", data);
      } catch (error) {
        console.error("Database error:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
