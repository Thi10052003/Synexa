import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const { userId, sessionId } = getAuth(req);

    // đọc raw body từ frontend
    const body = await req.json();

    console.log("📥 RECEIVED BODY:", body);

    const event_name = body.event_name;    // ⬅️ PHẢI LÀ event_name
    const payload = body.payload || {};

    if (!event_name) {
      console.error("❌ Missing event_name! Received:", body);
    }

    const client = await clientPromise;
    const db = client.db("synexa");

    await db.collection("events").insertOne({
      event_name: event_name || "(missing_event_name)",
      payload,
      user_id: userId || null,
      session_id: sessionId || null,
      timestamp: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ EVENT API ERROR:", err);
    return NextResponse.json({ success: false, message: err.message });
  }
}
