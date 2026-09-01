import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/passwords";
import { createSession } from "@/lib/auth/sessions";
import { SESSION_COOKIE } from "@/lib/session";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  const user = getUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash, user.passwordSalt)) {
    return NextResponse.json({ error: "ईमेल या पासवर्ड ग़लत है" }, { status: 401 });
  }

  const sessionId = createSession(user.email);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return response;
}
