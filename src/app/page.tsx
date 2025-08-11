"use client";
import { socket } from "@/socket";
import React, { useEffect, useRef, useState } from "react";

type ChatMessage = {
 text: string;
 type: "sent" | "received";
};

export default function ChatPage() {
 const [message, setMessage] = useState("");
 const [chat, setChat] = useState<ChatMessage[]>([]);
 const [isConnected, setIsConnected] = useState(false);
 const [error, setError] = useState("");
 const messagesEndRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
  // Connect when component mounts
  socket.connect();

  socket.on("connect", () => setIsConnected(true));
  socket.on("disconnect", () => setIsConnected(false));
  socket.on("receiveMessage", (msg: string) => {
   setChat((prev) => [...prev, { text: msg, type: "received" }]);
  });

  return () => {
   // Cleanup listeners & disconnect
   socket.off("connect");
   socket.off("disconnect");
   socket.off("receiveMessage");
   socket.disconnect();
  };
 }, []);

 useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
 }, [chat]);

 const sendMessage = (e: React.FormEvent) => {
  e.preventDefault();
  if (!message.trim()) return;

  if (!isConnected) {
   setError("Internet disconnected. Message not sent.");
   return;
  }

  setChat((prev) => [...prev, { text: message, type: "sent" }]);
  socket.emit("sendMessage", message);
  setMessage("");
  setError("");
 };

 return (
  <div className="max-w-2xl mx-auto mt-16 p-8 bg-white rounded-xl shadow-lg border border-gray-200">
   {!isConnected && (
    <div className="mb-2 text-red-600 font-semibold">
     Not connected to server!
    </div>
   )}
   {error && <div className="mb-2 text-red-500">{error}</div>}

   <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
    Socket.IO Chat
   </h2>

   <div className="h-96 overflow-y-auto mb-6 bg-gray-50 rounded-lg p-4 border border-gray-100 flex flex-col">
    {chat.length === 0 ? (
     <div className="text-gray-400 text-center mt-32">No messages yet.</div>
    ) : (
     chat.map((msg, idx) => (
      <div
       key={idx}
       className={`mb-3 flex ${
        msg.type === "sent" ? "justify-end" : "justify-start"
       }`}
      >
       <div
        className={`px-4 py-2 rounded-lg shadow-sm max-w-xl break-words
                  ${
                   msg.type === "sent"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 text-blue-800"
                  }`}
       >
        {msg.text}
       </div>
      </div>
     ))
    )}
    <div ref={messagesEndRef} />
   </div>

   <form onSubmit={sendMessage} className="flex gap-4">
    <input
     type="text"
     value={message}
     onChange={(e) => setMessage(e.target.value)}
     placeholder="Type your message..."
     className="flex-1 px-4 py-2 text-black/75 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    <button
     type="submit"
     className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
    >
     Send
    </button>
   </form>
  </div>
 );
}
