// Shared feed assembly, used by both the feed page and /api/feed so the two
// never drift: merges live NBT articles (every interest section has a real
// live source) with the live state-news articles (tagged with the user's
// city — see fetchStateArticles), pins the top state article as the
// featured card, then lays out everything else per the city/interest slot
// pattern in lib/feedLayout.ts. Falls back to the mock pool only if the
// live category fetch entirely fails.
import { UserRecord } from "@/lib/types";
import { FEED_ARTICLES } from "@/lib/data/articles";
import { fetchStateArticles, fetchLiveArticles } from "@/lib/data/nbtFeed";
import { scoreAndSortFeed, pickFeaturedCityArticle, FeedSplit } from "@/lib/feedScoring";
import { layoutRest } from "@/lib/feedLayout";

export async function buildFeed(user: UserRecord): Promise<FeedSplit> {
  const [liveArticles, stateArticles] = await Promise.all([
    fetchLiveArticles(),
    fetchStateArticles(user.city),
  ]);

  const pool = liveArticles.length > 0 ? [...liveArticles, ...stateArticles] : FEED_ARTICLES;

  const sorted = scoreAndSortFeed(pool, user.city, user.interests);
  const { featured, rest: remaining } = pickFeaturedCityArticle(sorted, user.city);
  if (!featured) return { featured: null, rest: [] };
  return { featured, rest: layoutRest(remaining, user.city, user.interests) };
}
