import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { addInterestScores } from "@/lib/db";
import { SECTIONS } from "@/lib/data/sections";

interface InterestInput {
  section: string;
  liked: boolean;
}

// Also used by the recalibration flow (Part 2) — scores accumulate across
// onboarding and any later recalibration rounds, they are not overwritten.
export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "not authenticated" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const interests: InterestInput[] | undefined = body?.interests;
  if (!Array.isArray(interests) || interests.length === 0) {
    return NextResponse.json({ error: "invalid interests" }, { status: 400 });
  }

  const deltas: Record<string, number> = {};
  for (const item of interests) {
    if (!SECTIONS.some((s) => s.slug === item.section) || typeof item.liked !== "boolean") {
      return NextResponse.json({ error: "invalid interest item" }, { status: 400 });
    }
    deltas[item.section] = (deltas[item.section] ?? 0) + (item.liked ? 1 : -1);
  }

  const user = addInterestScores(currentUser.email, deltas);
  return NextResponse.json({ ok: true, interests: user.interests });
}
