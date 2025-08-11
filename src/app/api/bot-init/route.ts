import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
 const res = await fetch(
  "https://n8n-self-host-lvfp.onrender.com/webhook/ee30d5a2-b250-4e42-a4ff-d0cb6f2e3fa2"
 );
 const data = await res.json();
 return new Response(JSON.stringify(data), { status: 200 });
}
