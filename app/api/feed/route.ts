import { NextResponse } from "next/server";
import { getUserId } from "@/lib/session";
import { ensureUser } from "@/lib/db";
import { buildFeed } from "@/lib/feed";

export async function GET() {
  const userId = await getUserId();
  const user = ensureUser(userId);
  const { featured, rest } = await buildFeed(user);
  return NextResponse.json({ featured, feed: rest });
}
