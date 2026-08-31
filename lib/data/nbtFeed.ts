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
  imageid?: string;
  subsecmsid?: number;
}

interface NbtFeedSection {
  id: string;
}

interface NbtFeedResponse {
  id?: string; // echoes back the msid that was actually served
  items?: NbtFeedItem[];
  sections?: NbtFeedSection[]; // the valid subsections under this msid
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

// Confirmed from the feed's own misc_config.pwa_meta.ogimg field, which uses
// exactly this msid-keyed path on the same CDN.
function nbtImageUrl(imageid: string): string {
  return `https://static.langimg.com/photo/msid-${imageid}/navbharat-times.jpg`;
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
    thumbnail_url: item.imageid ? nbtImageUrl(item.imageid) : undefined,
  };
}

/**
 * Confirms the feed actually served the section we asked for — its own
 * `id` field echoes back the requested msid. This guards against a wrong
 * or stale msid silently returning an unrelated (or default/homepage)
 * feed instead of failing loudly.
 *
 * Deliberately does NOT also require each item's `subsecmsid` to appear in
 * this response's own `sections[]` list: that per-item check was verified
 * only against one section's payload shape (Lifestyle) and NBT's other
 * verticals may structure `sections[]` differently, which would silently
 * empty an otherwise-valid section rather than catch anything wrong. The
 * top-level `id` match is the reliable signal.
 */
function validateSection(data: NbtFeedResponse, expectedMsid: string): NbtFeedItem[] {
  if (data.id !== expectedMsid) {
    throw new Error(`NBT feed for msid ${expectedMsid} returned a different section (id=${data.id})`);
  }
  return data.items ?? [];
}

async function fetchNbtItems(msid: string): Promise<NbtFeedItem[]> {
  const res = await fetch(`${NBT_FEED_BASE}?client=nbt&pc=nbt&dm=t&msid=${msid}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`NBT feed ${msid} responded ${res.status}`);
  const data: NbtFeedResponse = await res.json();
  return validateSection(data, msid);
}

/**
 * Fetches every section with a live source, in parallel. A section whose
 * fetch or validation fails is dropped silently (logged, not thrown) —
 * callers fall back to mock data when the combined result is empty.
 */
export async function fetchLiveArticles(): Promise<Article[]> {
  const entries = Object.entries(SECTION_MSID) as [SectionSlug, string][];
  const results = await Promise.all(
    entries.map(async ([section, msid]) => {
      try {
        return (await fetchNbtItems(msid)).map((item) => toArticle(item, section));
      } catch (err) {
        console.error(`Failed to fetch NBT section "${section}" (msid ${msid}):`, err);
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
  } catch (err) {
    console.error(`Failed to fetch NBT hero article (msid ${HERO_MSID}):`, err);
    return null;
  }
}
