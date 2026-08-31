import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/session";
import { setCity } from "@/lib/db";

// Cities now come from NBT's live state hierarchy (see /api/cities), not a
// fixed list, so this only sanity-checks the shape rather than matching
// against a hardcoded set.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const city = body?.city;
  if (typeof city !== "string" || city.trim().length === 0 || city.length > 100) {
    return NextResponse.json({ error: "invalid city" }, { status: 400 });
  }
  const userId = await getUserId();
  const user = setCity(userId, city);
  return NextResponse.json({ ok: true, city: user.city });
}
