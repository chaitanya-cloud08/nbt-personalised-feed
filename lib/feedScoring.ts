// Rule-based feed scoring — NOT machine learning. Plain tag-matching and
// weighted sorting so the ranking is easy to reason about, debug, and tweak.
//
//   score = recency_weight
//         + (article.city == user.city ? CITY_BOOST : 0)
//         + (interest_score[article.section] * INTEREST_WEIGHT)
//
// Tune the constants below to change ranking behaviour — no other file
// needs to change.
import { Article, ScoredArticle, UserInterests } from "@/lib/types";

export const SCORING_CONSTANTS = {
  /** Flat bonus when an article's city matches the user's chosen city. */
  CITY_BOOST: 10,
  /** Multiplier applied to the user's accumulated +1/-1 interest score for a section. */
  INTEREST_WEIGHT: 5,
  /** Recency score at publish time (t=0). Decays toward 0 as the article ages. */
  RECENCY_MAX_WEIGHT: 20,
  /** Hours after which recency_weight has halved. */
  RECENCY_HALF_LIFE_HOURS: 12,
};

/** Newer articles score higher; simple exponential half-life decay. */
export function recencyWeight(publishedAt: string, now: Date = new Date()): number {
  const ageHours = (now.getTime() - new Date(publishedAt).getTime()) / (1000 * 60 * 60);
  const decay = Math.pow(0.5, Math.max(ageHours, 0) / SCORING_CONSTANTS.RECENCY_HALF_LIFE_HOURS);
  return SCORING_CONSTANTS.RECENCY_MAX_WEIGHT * decay;
}

export function scoreArticle(
  article: Article,
  userCity: string | null,
  interests: UserInterests,
  now: Date = new Date()
): number {
  const cityScore = userCity && article.city === userCity ? SCORING_CONSTANTS.CITY_BOOST : 0;
  const interestScore = (interests[article.section] ?? 0) * SCORING_CONSTANTS.INTEREST_WEIGHT;
  return recencyWeight(article.published_at, now) + cityScore + interestScore;
}

/** Scores every article and returns them sorted highest score first. */
export function scoreAndSortFeed(
  articles: Article[],
  userCity: string | null,
  interests: UserInterests,
  now: Date = new Date()
): ScoredArticle[] {
  return articles
    .map((article) => ({ ...article, score: scoreArticle(article, userCity, interests, now) }))
    .sort((a, b) => b.score - a.score);
}

export interface FeedSplit {
  /** The single highest-scored article from the user's own city, always shown first as a featured card. */
  featured: ScoredArticle | null;
  /** Everything else, in normal score order. */
  rest: ScoredArticle[];
}

/**
 * Pulls the top-scored article matching the user's city out of an already
 * sorted feed so it can be pinned as the lead "thumb" story. Falls back to
 * the overall top article when the user has no city or no city article
 * exists in the pool.
 */
export function pickFeaturedCityArticle(sorted: ScoredArticle[], userCity: string | null): FeedSplit {
  if (sorted.length === 0) return { featured: null, rest: [] };

  const cityIndex = userCity ? sorted.findIndex((a) => a.city === userCity) : -1;
  const featuredIndex = cityIndex !== -1 ? cityIndex : 0;

  const featured = sorted[featuredIndex];
  const rest = [...sorted.slice(0, featuredIndex), ...sorted.slice(featuredIndex + 1)];
  return { featured, rest };
}
