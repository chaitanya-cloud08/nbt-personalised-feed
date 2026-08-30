import { NextRequest, NextResponse } from "next/server";
import { USER_COOKIE } from "@/lib/session";

// Stands in for real auth: every visitor is treated as already logged in,
// identified by a stable random id stored in a cookie. This feature is a
// value-add for logged-in users, not an auth implementation itself.
export function proxy(request: NextRequest) {
  const existing = request.cookies.get(USER_COOKIE)?.value;
  if (existing) return NextResponse.next();

  const id = crypto.randomUUID();
  const response = NextResponse.next();
  response.cookies.set(USER_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return response;
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
