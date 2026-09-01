import { NextRequest, NextResponse } from "next/server";
import { destroySession } from "@/lib/auth/sessions";
import { SESSION_COOKIE } from "@/lib/session";

export async function POST(request: NextRequest) {
  const sessionId = request.cookies.get(SESSION_COOKIE)?.value;
  if (sessionId) destroySession(sessionId);

  const response = NextResponse.json({ ok: true });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
