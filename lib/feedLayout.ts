// Positional feed layout: instead of pure score order, the feed below the
// featured/hero card (which already occupies slot 1) follows a fixed
// pattern — city/state articles pinned at slots 4, 7, 9 of every following
// 9-slot block, with every other slot cycling through the user's own
// ranked interests (highest interest score first). Nothing about which
// articles fill those slots is hardcoded — only the slot positions are.
import { Article, ScoredArticle, SectionSlug, UserInterests } from "@/lib/types";
import { scoreAndSortFeed } from "@/lib/feedScoring";
import { SECTIONS } from "@/lib/data/sections";

// 1-indexed positions within each repeating block that are reserved for a
// city/state-matched article. Position 1 of the very first block is the
// featured/hero card, handled separately by the caller.
const CITY_SLOT_POSITIONS = new Set([1, 4, 7, 9]);
const BLOCK_SIZE = 9;

function isCitySlot(position: number): boolean {
  const relative = ((position - 1) % BLOCK_SIZE) + 1;
  return CITY_SLOT_POSITIONS.has(relative);
}

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
 * is the featured card) according to the city/interest slot pattern
 * described above. A slot whose target pool is empty falls through to the
 * next best-scored leftover article — preferring one from a *different*
 * section than whichever was just shown, so a data gap in one or two
 * sections can't flood several consecutive slots with the same section.
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
  const result: ScoredArticle[] = [];
  let interestCursor = 0;
  let lastSection: SectionSlug | null = null;

  for (let position = startPosition; used.size < scored.length; position++) {
    let next: ScoredArticle | undefined;

    if (userCity && isCitySlot(position)) {
      next = take((a) => a.city === userCity);
    } else if (interestOrder.length > 0) {
      for (let i = 0; i < interestOrder.length && !next; i++) {
        const section = interestOrder[(interestCursor + i) % interestOrder.length];
        next = take((a) => a.section === section);
      }
      interestCursor = (interestCursor + 1) % interestOrder.length;
    }

    if (!next) next = take((a) => a.section !== lastSection) ?? take(() => true);
    if (!next) break; // pool exhausted

    lastSection = next.section;
    result.push(next);
  }

  return result;
}
