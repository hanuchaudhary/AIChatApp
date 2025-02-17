import http from "http";
import express from "express";
import { Server } from "socket.io";
import { socketInit } from "./socket/socket.config.js";

// import { createAdapter } from "@socket.io/redis-streams-adapter";
// import redis from "./socket/redis.config";

const PORT = process.env.PORT || 8080;


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
  // adapter: createAdapter(redis),
});


socketInit(io);
export { io };

app.get("/", (req, res) => {
  res.json({
    API: "Server is running",
  });
});

server.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});

process.on("SIGINT", () => {
  console.log("Server shutting down");
  server.close(() => {
    process.exit(0);
  });
});