import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { summarizeHeadlinesForBrief } from "@/lib/data/briefSummary";

const MAX_HEADLINES = 5;
const MAX_HEADLINE_LENGTH = 300;
const MAX_CITY_LABEL_LENGTH = 100;

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "not authenticated" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const headlinesInput = body?.headlines;
  if (!Array.isArray(headlinesInput) || headlinesInput.length === 0) {
    return NextResponse.json({ error: "invalid headlines" }, { status: 400 });
  }

  // These headlines are already public content this same user's own feed
  // just rendered — clamp length/count rather than trust it blindly, since
  // it's still client-supplied input reaching a paid API call.
  const headlines = headlinesInput
    .filter((h): h is string => typeof h === "string")
    .slice(0, MAX_HEADLINES)
    .map((h) => h.slice(0, MAX_HEADLINE_LENGTH));
  const cityLabel = typeof body?.cityLabel === "string" ? body.cityLabel.slice(0, MAX_CITY_LABEL_LENGTH) : null;

  const { summary, error } = await summarizeHeadlinesForBrief(headlines, cityLabel);
  if (!summary) return NextResponse.json({ error: error ?? "summary unavailable" }, { status: 502 });
  return NextResponse.json({ summary_hi: summary });
}
