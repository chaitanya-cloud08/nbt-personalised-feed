// Live article source: Navbharat Times' public "wufs" feed
// (https://global-feed.indiatimes.com/wufs/feed/list/article). One NBT
// section msid is fetched per app SectionSlug that has a live equivalent;
// sarkari-naukri has none, so it stays on the mock FEED_ARTICLES pool.
import { Article, SectionSlug } from "@/lib/types";

const NBT_FEED_BASE = "https://global-feed.indiatimes.com/wufs/feed/list/article";
const NBT_ARTICLE_BASE = "https://navbharattimes.indiatimes.com";

const SECTION_MSID: Partial<Record<SectionSlug, string>> = {
  cricket: "2279790", // sports
  bollywood: "2279793", // entertainment
  "dharm-tyohar": "17127056", // dharm
  rajniti: "2279786", // business — no dedicated politics folder available
};

// State-news folder, used as the always-on lead "hero" card in place of a
// city match: the live feed carries no per-article city data.
const HERO_MSID = "2279808";

interface NbtFeedItem {
  id: string;
  hl: string;
  dl: string; // e.g. "Aug 31, 2026, 11:54 AM"
  seolocation: string;
}

interface NbtFeedResponse {
  items?: NbtFeedItem[];
}

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

const NBT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const NBT_DATE_RE = /^(\w{3}) (\d{1,2}), (\d{4}), (\d{1,2}):(\d{2}) (AM|PM)$/;
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

/**
 * NBT timestamps (e.g. "Aug 31, 2026, 11:54 AM") are always IST, with no
 * timezone marker. Parsed via a plain `new Date(dl)` they'd be read in the
 * server's local timezone instead — silently skewing recency scoring by up
 * to 5.5h depending on where this app is deployed. Parse the fields
 * explicitly and convert from IST to UTC.
 */
function parseNbtDate(dl: string): string {
  const match = NBT_DATE_RE.exec(dl.trim());
  if (!match) return new Date().toISOString();
  const [, mon, day, year, hourStr, minute, ampm] = match;
  const monthIndex = NBT_MONTHS.indexOf(mon);
  if (monthIndex === -1) return new Date().toISOString();
  let hour = Number(hourStr) % 12;
  if (ampm === "PM") hour += 12;
  const utcMs = Date.UTC(Number(year), monthIndex, Number(day), hour, Number(minute)) - IST_OFFSET_MS;
  return new Date(utcMs).toISOString();
}

function toArticle(item: NbtFeedItem, section: SectionSlug): Article {
  return {
    id: `nbt-${item.id}`,
    headline_hi: stripTags(item.hl),
    section,
    city: null,
    published_at: parseNbtDate(item.dl),
    // NBT's site uses this URL scheme (seolocation + articleshow + id) for
    // both regular articles and photo-gallery items.
    url: `${NBT_ARTICLE_BASE}/${item.seolocation}/articleshow/${item.id}.cms`,
  };
}

async function fetchNbtItems(msid: string): Promise<NbtFeedItem[]> {
  const res = await fetch(`${NBT_FEED_BASE}?client=nbt&pc=nbt&dm=t&msid=${msid}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`NBT feed ${msid} responded ${res.status}`);
  const data: NbtFeedResponse = await res.json();
  return data.items ?? [];
}

/**
 * Fetches every section with a live source, in parallel. A section whose
 * fetch fails is dropped silently — callers fall back to mock data when the
 * combined result is empty.
 */
export async function fetchLiveArticles(): Promise<Article[]> {
  const entries = Object.entries(SECTION_MSID) as [SectionSlug, string][];
  const results = await Promise.all(
    entries.map(async ([section, msid]) => {
      try {
        return (await fetchNbtItems(msid)).map((item) => toArticle(item, section));
      } catch {
        return [];
      }
    })
  );
  return results.flat();
}

/** The always-on lead card, sourced from NBT's state-news folder. */
export async function fetchHeroArticle(): Promise<Article | null> {
  try {
    const [first] = await fetchNbtItems(HERO_MSID);
    return first ? toArticle(first, "rajniti") : null;
  } catch {
    return null;
  }
}
