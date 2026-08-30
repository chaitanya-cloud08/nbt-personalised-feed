import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/session";
import { setRashi } from "@/lib/db";
import { RASHIS } from "@/lib/data/rashi";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const rashi: string | null | undefined = body?.rashi;
  if (rashi !== null && (typeof rashi !== "string" || !RASHIS.some((r) => r.slug === rashi))) {
    return NextResponse.json({ error: "invalid rashi" }, { status: 400 });
  }
  const userId = await getUserId();
  const user = setRashi(userId, rashi ?? null);
  return NextResponse.json({ ok: true, rashi: user.rashi });
}
