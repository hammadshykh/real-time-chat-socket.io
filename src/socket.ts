"use client";
import { io, Socket } from "socket.io-client";

// Create one socket instance for the entire app
export const socket: Socket = io(
 process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000",
 {
  autoConnect: false, // we will manually connect to control lifecycle
 }
);
