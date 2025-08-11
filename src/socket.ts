"use client";
import { io } from "socket.io-client";

// Create one socket instance for the entire app
export const socket = io();
