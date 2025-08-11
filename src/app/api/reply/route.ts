import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
 const body = await req.json();
 // Forward the message to your backend
 await fetch("http://localhost:4000/reply", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
 });

 return new Response(JSON.stringify({ success: true }), { status: 200 });
}
