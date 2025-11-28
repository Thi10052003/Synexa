import { getAuth } from "@clerk/nextjs/server";

export async function GET(req) {
  const { userId, sessionId } = getAuth(req);
  console.log("🔥 DEBUG AUTH:", { userId, sessionId });

  return Response.json({ userId, sessionId });
}
