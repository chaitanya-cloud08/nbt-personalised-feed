import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { setCity } from "@/lib/db";

// Cities come from NBT's curated state/city map (lib/data/nbtSectionMap.ts),
// not a fixed list here, so this only sanity-checks the shape.
export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "not authenticated" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const city = body?.city;
  if (typeof city !== "string" || city.trim().length === 0 || city.length > 100) {
    return NextResponse.json({ error: "invalid city" }, { status: 400 });
  }
  const user = setCity(currentUser.email, city);
  return NextResponse.json({ ok: true, city: user.city });
}
