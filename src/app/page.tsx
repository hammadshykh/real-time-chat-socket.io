"use client";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000"); // Update if your backend runs elsewhere

export default function ChatPage() {
 const [message, setMessage] = useState("");
 const [chat, setChat] = useState<string[]>([]);

 useEffect(() => {
  socket.on("receiveMessage", (msg: string) => {
   setChat((prev) => [...prev, msg]);
  });

  return () => {
   socket.off("receiveMessage");
  };
 }, []);

 const sendMessage = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!message.trim()) return;

  // Send message to backend via REST API
  await fetch("/api/reply", {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ message }),
  });

  setMessage("");
 };

 return (
  <div
   style={{
    maxWidth: 400,
    margin: "40px auto",
    padding: 20,
    border: "1px solid #ccc",
    borderRadius: 8,
   }}
  >
   <h2>Socket.IO Chat</h2>
   <div
    style={{
     minHeight: 120,
     marginBottom: 16,
     background: "#f9f9f9",
     padding: 10,
     borderRadius: 4,
    }}
   >
    {chat.map((msg, idx) => (
     <div key={idx} style={{ marginBottom: 4 }}>
      {msg}
     </div>
    ))}
   </div>
   <form onSubmit={sendMessage} style={{ display: "flex", gap: 8 }}>
    <input
     type="text"
     value={message}
     onChange={(e) => setMessage(e.target.value)}
     placeholder="Type your message..."
     style={{ flex: 1, padding: 8 }}
    />
    <button type="submit" style={{ padding: "8px 16px" }}>
     Send
    </button>
   </form>
  </div>
 );
}
