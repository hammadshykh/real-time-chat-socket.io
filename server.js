// server.js
import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
 const httpServer = createServer((req, res) => {
  handle(req, res);
 });

 const io = new Server(httpServer, {
  cors: { origin: process.env.NEXT_PUBLIC_SITE_URL }, // adjust as needed
 });

 io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("sendMessage", (message) => {
   socket.broadcast.emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
   console.log("User disconnected:", socket.id);
  });
 });

 httpServer.listen(PORT, () => {
  console.log(`> Ready on ${process.env.NEXT_PUBLIC_SITE_URL}:${PORT}`);
 });
});
