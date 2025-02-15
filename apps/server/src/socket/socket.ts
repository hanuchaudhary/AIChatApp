import { Server, Socket } from "socket.io";

interface CustomSocket extends Socket {
  room?: string;
}

export const socketInit = (io: Server) => {
  
  io.use((socket: CustomSocket, next) => {
    const room = socket.handshake.auth.room;
    if (!room) {
      next(new Error("No room provided"));
    }
    socket.room = room;
    next();
  });

  io.on("connection", (socket: CustomSocket) => {

    socket.join(socket.room!);

    console.log("User connected", socket.id);

    socket.on("message", (data) => {
      io.to(socket.room!).emit("message", data);
      console.log("Message received", data);
      
    });

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
    });
  });
};
