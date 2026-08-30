import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/session";
import { setCity } from "@/lib/db";
import { CITIES } from "@/lib/data/cities";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const city = body?.city;
  if (typeof city !== "string" || !CITIES.some((c) => c.slug === city)) {
    return NextResponse.json({ error: "invalid city" }, { status: 400 });
  }
  const userId = await getUserId();
  const user = setCity(userId, city);
  return NextResponse.json({ ok: true, city: user.city });
}
