import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { buildFeed } from "@/lib/feed";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "not authenticated" }, { status: 401 });

  const { featured, rest } = await buildFeed(user);
  return NextResponse.json({ featured, feed: rest });
}
