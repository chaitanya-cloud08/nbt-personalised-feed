import { NextResponse } from "next/server";
import { getUserId } from "@/lib/session";
import { ensureUser } from "@/lib/db";
import { FEED_ARTICLES } from "@/lib/data/articles";
import { scoreAndSortFeed, pickFeaturedCityArticle } from "@/lib/feedScoring";

export async function GET() {
  const userId = await getUserId();
  const user = ensureUser(userId);
  const sorted = scoreAndSortFeed(FEED_ARTICLES, user.city, user.interests);
  const { featured, rest } = pickFeaturedCityArticle(sorted, user.city);
  return NextResponse.json({ featured, feed: rest });
}
