// Shared feed assembly, used by both the feed page and /api/feed so the two
// never drift: merges live NBT articles with the mock sarkari-naukri pool
// (no live source exists for that section), scores everything, and pins
// the live "hero" article as the featured card.
import { UserRecord } from "@/lib/types";
import { FEED_ARTICLES } from "@/lib/data/articles";
import { fetchHeroArticle, fetchLiveArticles } from "@/lib/data/nbtFeed";
import { scoreArticle, scoreAndSortFeed, pickFeaturedCityArticle, FeedSplit } from "@/lib/feedScoring";

export async function buildFeed(user: UserRecord): Promise<FeedSplit> {
  const [liveArticles, hero] = await Promise.all([fetchLiveArticles(), fetchHeroArticle()]);

  const sarkariNaukriMock = FEED_ARTICLES.filter((a) => a.section === "sarkari-naukri");
  const pool = liveArticles.length > 0 ? [...liveArticles, ...sarkariNaukriMock] : FEED_ARTICLES;
  const sorted = scoreAndSortFeed(pool, user.city, user.interests);

  if (!hero) return pickFeaturedCityArticle(sorted, user.city);

  const featured = { ...hero, score: scoreArticle(hero, user.city, user.interests) };
  return { featured, rest: sorted.filter((a) => a.id !== featured.id) };
}
