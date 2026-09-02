// Positional feed layout: instead of pure score order, the feed below the
// featured/hero card (which already occupies position 1, itself a city
// article) follows a repeating pattern — one city slot, then one slot for
// each section the user has shown interest in, then city again, and so on.
// Nothing about which articles fill those slots is hardcoded — only the
// slot positions are.
import { Article, ScoredArticle, SectionSlug, UserInterests } from "@/lib/types";
import { scoreAndSortFeed } from "@/lib/feedScoring";
import { SECTIONS } from "@/lib/data/sections";

/**
 * Sections the user has actually shown net-positive interest in, ranked
 * highest score first. Ties fall back to the app's canonical section
 * order so the cycle is deterministic.
 */
function rankedInterestSections(interests: UserInterests): SectionSlug[] {
  const canonicalOrder = SECTIONS.map((s) => s.slug);
  return canonicalOrder
    .filter((section) => (interests[section] ?? 0) > 0)
    .sort((a, b) => (interests[b] ?? 0) - (interests[a] ?? 0));
}

/**
 * Lays out `pool` starting at `startPosition` (2 by default, since slot 1
 * is the featured card) as a repeating block of one city slot followed by
 * one slot per section the user likes: city, interest 1, interest 2, ...,
 * city, repeat. A slot whose target pool is empty falls through to the next
 * best-scored leftover article — preferring one from a *different* section
 * than whichever was just shown, so a data gap in one or two sections can't
 * flood several consecutive slots with the same section.
 */
export function layoutRest(
  pool: Article[],
  userCity: string | null,
  interests: UserInterests,
  now: Date = new Date(),
  startPosition = 2
): ScoredArticle[] {
  const scored = scoreAndSortFeed(pool, userCity, interests, now);
  const used = new Set<string>();
  const take = (predicate: (a: ScoredArticle) => boolean): ScoredArticle | undefined => {
    const found = scored.find((a) => !used.has(a.id) && predicate(a));
    if (found) used.add(found.id);
    return found;
  };

  const interestOrder = rankedInterestSections(interests);
  // Block = 1 city slot + one slot per section the user likes, so the
  // pattern is: city, interest 1, interest 2, ..., city, repeat.
  const blockSize = interestOrder.length + 1;
  const result: ScoredArticle[] = [];
  let lastSection: SectionSlug | null = null;

  for (let position = startPosition; used.size < scored.length; position++) {
    const relative = (position - 1) % blockSize;
    let next: ScoredArticle | undefined;

    if (relative === 0) {
      if (userCity) next = take((a) => a.city === userCity);
    } else {
      const assignedSection = interestOrder[relative - 1];
      next = take((a) => a.section === assignedSection);
      // That section's pool is exhausted — try the rest of the user's
      // liked sections before falling through to the generic fallback.
      for (let i = 0; !next && i < interestOrder.length; i++) {
        next = take((a) => a.section === interestOrder[i]);
      }
    }

    if (!next) next = take((a) => a.section !== lastSection) ?? take(() => true);
    if (!next) break; // pool exhausted

    lastSection = next.section;
    result.push(next);
  }

  return result;
}
