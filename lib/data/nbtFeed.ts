// Live article source: Navbharat Times' public "wufs" feed
// (https://global-feed.indiatimes.com/wufs/feed/list/article). One NBT
// section msid is fetched per app SectionSlug that has a live equivalent;
// sarkari-naukri has none, so it stays on the mock FEED_ARTICLES pool.
import { Article, SectionSlug } from "@/lib/types";
import { cityLabel } from "@/lib/data/cities";

const NBT_FEED_BASE = "https://global-feed.indiatimes.com/wufs/feed/list/article";
const NBT_ARTICLE_BASE = "https://navbharattimes.indiatimes.com";

const SECTION_MSID: Partial<Record<SectionSlug, string>> = {
  cricket: "2279790", // sports
  bollywood: "2279793", // entertainment
  "dharm-tyohar": "17127056", // dharm
  rajniti: "2279786", // business — no dedicated politics folder available
};

interface NbtFeedItem {
  id: string;
  hl: string;
  dl: string; // e.g. "Aug 31, 2026, 11:54 AM"
  seolocation: string;
  imageid?: string;
}

interface NbtFeedSection {
  id: string;
  secname?: string;
}

interface NbtFeedResponse {
  id?: string; // echoes back the msid that was actually served
  items?: NbtFeedItem[];
  sections?: NbtFeedSection[]; // this folder's direct child folders
}

interface NbtSection {
  items: NbtFeedItem[];
  sections: NbtFeedSection[];
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

function toArticle(item: NbtFeedItem, section: SectionSlug, city: string | null = null): Article {
  return {
    id: `nbt-${item.id}`,
    headline_hi: stripTags(item.hl),
    section,
    city,
    published_at: parseNbtDate(item.dl),
    // NBT's site uses this URL scheme (seolocation + articleshow + id) for
    // both regular articles and photo-gallery items.
    url: `${NBT_ARTICLE_BASE}/${item.seolocation}/articleshow/${item.id}.cms`,
    thumbnail_url: item.imageid ? nbtImageUrl(item.imageid) : undefined,
  };
}

/**
 * Fetches one folder and confirms it actually served the section we asked
 * for — its own `id` field echoes back the requested msid. This guards
 * against a wrong or stale msid silently returning an unrelated (or
 * default/homepage) feed instead of failing loudly.
 */
async function fetchSection(msid: string, revalidateSeconds: number): Promise<NbtSection> {
  const res = await fetch(`${NBT_FEED_BASE}?client=nbt&pc=nbt&dm=t&msid=${msid}`, {
    next: { revalidate: revalidateSeconds },
  });
  if (!res.ok) throw new Error(`NBT feed ${msid} responded ${res.status}`);
  const data: NbtFeedResponse = await res.json();
  if (data.id !== msid) {
    throw new Error(`NBT feed for msid ${msid} returned a different section (id=${data.id})`);
  }
  return { items: data.items ?? [], sections: data.sections ?? [] };
}

async function fetchNbtItems(msid: string): Promise<NbtFeedItem[]> {
  return (await fetchSection(msid, 300)).items;
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

// The app's supported cities, mapped to their state's Hindi name. Used only
// to pick the right branch under the states folder below — the msids
// themselves are discovered live from each folder's own `sections[]`
// listing, never hardcoded.
const CITY_STATE_HI: Partial<Record<string, string>> = {
  lucknow: "उत्तर प्रदेश",
  kanpur: "उत्तर प्रदेश",
  meerut: "उत्तर प्रदेश",
  agra: "उत्तर प्रदेश",
  varanasi: "उत्तर प्रदेश",
  gorakhpur: "उत्तर प्रदेश",
  patna: "बिहार",
  indore: "मध्य प्रदेश",
  bhopal: "मध्य प्रदेश",
  jaipur: "राजस्थान",
  ranchi: "झारखंड",
  nagpur: "महाराष्ट्र",
  guwahati: "असम",
  raipur: "छत्तीसगढ़",
  dehradun: "उत्तराखंड",
};

const STATES_MSID = "2279808"; // aggregate "states" folder
const CITY_FRESHNESS_HOURS = 24;

function findChildMsid(sections: NbtFeedSection[], nameHi: string): string | null {
  const target = nameHi.trim();
  const exact = sections.find((s) => s.secname?.trim() === target);
  if (exact) return exact.id;
  const partial = sections.find((s) => s.secname && (s.secname.includes(target) || target.includes(s.secname)));
  return partial?.id ?? null;
}

/**
 * Walks NBT's states folder (aggregate) down to the user's specific state,
 * then their specific city, resolving each msid from the parent folder's
 * own `sections[]` listing rather than a hardcoded table. If the
 * city-level folder has nothing, or its freshest article is older than
 * 24h, falls back to the broader state-level folder instead.
 */
export async function fetchStateArticles(citySlug: string | null): Promise<Article[]> {
  if (!citySlug) return [];
  const stateNameHi = CITY_STATE_HI[citySlug];
  if (!stateNameHi) return [];

  try {
    const statesLevel = await fetchSection(STATES_MSID, 3600);
    const stateMsid = findChildMsid(statesLevel.sections, stateNameHi);
    if (!stateMsid) {
      console.warn(`NBT states folder has no match for state "${stateNameHi}" (city: ${citySlug})`);
      return [];
    }

    const stateLevel = await fetchSection(stateMsid, 3600);
    const stateArticles = stateLevel.items.map((item) => toArticle(item, "rajniti", citySlug));

    const cityNameHi = cityLabel(citySlug);
    const cityMsid = cityNameHi ? findChildMsid(stateLevel.sections, cityNameHi) : null;
    if (!cityMsid) {
      console.warn(`NBT state folder "${stateNameHi}" has no match for city "${cityNameHi}" — using state-level articles`);
      return stateArticles;
    }

    const cityItems = await fetchNbtItems(cityMsid);
    const cityArticles = cityItems.map((item) => toArticle(item, "rajniti", citySlug));
    const freshestAgeMs = cityArticles.length
      ? Date.now() - Math.max(...cityArticles.map((a) => new Date(a.published_at).getTime()))
      : Infinity;

    if (cityArticles.length > 0 && freshestAgeMs < CITY_FRESHNESS_HOURS * 60 * 60 * 1000) {
      return cityArticles;
    }
    // City folder empty or stale (>24h old) — fall back to the state folder.
    return stateArticles.length > 0 ? stateArticles : cityArticles;
  } catch (err) {
    console.error(`Failed to resolve NBT city/state articles for "${citySlug}":`, err);
    return [];
  }
}
