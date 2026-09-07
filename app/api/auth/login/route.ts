import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/passwords";
import { createSession } from "@/lib/auth/sessions";
import { SESSION_COOKIE } from "@/lib/session";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  try {
    const user = await getUserByEmail(email);
    if (!user || !verifyPassword(password, user.passwordHash, user.passwordSalt)) {
      return NextResponse.json({ error: "ईमेल या पासवर्ड ग़लत है" }, { status: 401 });
    }

    const sessionId = await createSession(user.email);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
    return response;
  } catch (err) {
    // Surfaced directly in the response (not just server logs) so a
    // deployment-environment issue — e.g. a missing/misnamed Postgres env
    // var — is visible from the browser's network tab without needing
    // platform log access.
    console.error("Login failed:", err);
    return NextResponse.json(
      { error: "server error", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
