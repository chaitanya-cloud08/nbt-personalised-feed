// Live article source: Navbharat Times' public "wufs" feed
// (https://global-feed.indiatimes.com/wufs/feed/list/article). One NBT
// section msid is fetched per app SectionSlug that has a live equivalent;
// sarkari-naukri has none, so it stays on the mock FEED_ARTICLES pool.
import { Article, City, SectionSlug } from "@/lib/types";

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
  syn?: string; // short synopsis, when present
  subsecname?: string;
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

/** IST calendar-date key ("YYYY-MM-DD") parsed straight from an NBT
 * timestamp's own date fields, avoiding a UTC round trip near midnight. */
function nbtDateKeyIST(dl: string): string | null {
  const match = NBT_DATE_RE.exec(dl.trim());
  if (!match) return null;
  const [, mon, day, year] = match;
  const monthIndex = NBT_MONTHS.indexOf(mon);
  if (monthIndex === -1) return null;
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(Number(day)).padStart(2, "0")}`;
}

function todayKeyIST(now: Date): string {
  const ist = new Date(now.getTime() + IST_OFFSET_MS);
  return `${ist.getUTCFullYear()}-${String(ist.getUTCMonth() + 1).padStart(2, "0")}-${String(ist.getUTCDate()).padStart(2, "0")}`;
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

const STATES_MSID = "2279808"; // aggregate "states" folder
const CITY_FRESHNESS_HOURS = 24;

interface NbtCity {
  slug: string; // the city's own Hindi name, doubling as its display label
  stateMsid: string;
  cityMsid: string;
}

/**
 * Walks NBT's states folder (aggregate) down through every state to every
 * city beneath it, in parallel. A city's `slug` is its own Hindi name —
 * there's no English name to base one on, and using it directly means
 * every existing `cityLabel()` call site keeps working unchanged (it
 * already falls back to showing the slug verbatim when not found in the
 * static city list). A state whose fetch fails is dropped, not fatal.
 */
async function fetchStatesWithCities(): Promise<NbtCity[]> {
  const statesLevel = await fetchSection(STATES_MSID, 3600);
  const perState = await Promise.all(
    statesLevel.sections.map(async (state) => {
      try {
        const stateLevel = await fetchSection(state.id, 3600);
        return stateLevel.sections
          .filter((c): c is NbtFeedSection & { secname: string } => !!c.secname?.trim())
          .map((c) => ({ slug: c.secname.trim(), stateMsid: state.id, cityMsid: c.id }));
      } catch (err) {
        console.error(`Failed to fetch NBT state "${state.secname}" (msid ${state.id}):`, err);
        return [];
      }
    })
  );
  return perState.flat();
}

/**
 * Every city NBT's state hierarchy actually lists, for the onboarding city
 * picker. Falls back to an empty list (caller uses the static CITIES pool
 * instead) on any failure.
 */
export async function fetchAllCities(): Promise<City[]> {
  try {
    const cities = await fetchStatesWithCities();
    const seen = new Set<string>();
    return cities
      .filter((c) => (seen.has(c.slug) ? false : (seen.add(c.slug), true)))
      .map(({ slug }) => ({ slug, label_hi: slug }))
      .sort((a, b) => a.label_hi.localeCompare(b.label_hi, "hi"));
  } catch (err) {
    console.error("Failed to fetch NBT city list:", err);
    return [];
  }
}

/**
 * Finds the user's chosen city within the state hierarchy and returns its
 * articles. If the city-level folder has nothing, or its freshest article
 * is older than 24h, falls back to the broader state-level folder instead.
 */
export async function fetchStateArticles(citySlug: string | null): Promise<Article[]> {
  if (!citySlug) return [];

  try {
    const cities = await fetchStatesWithCities();
    const match = cities.find((c) => c.slug === citySlug);
    if (!match) {
      console.warn(`No NBT state/city folder found matching "${citySlug}"`);
      return [];
    }

    const stateLevel = await fetchSection(match.stateMsid, 3600);
    const stateArticles = stateLevel.items.map((item) => toArticle(item, "rajniti", citySlug));

    const cityItems = await fetchNbtItems(match.cityMsid);
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

const ASTRO_MSID = "17127089"; // dharm/astro section — daily per-rashi horoscope posts
const HOROSCOPE_SNIPPET_LENGTH = 140;

function shortHoroscopeText(item: NbtFeedItem): string {
  const source = (item.syn?.trim() || stripTags(item.hl)).trim();
  if (source.length <= HOROSCOPE_SNIPPET_LENGTH) return source;
  return `${source.slice(0, HOROSCOPE_SNIPPET_LENGTH).trim()}…`;
}

/**
 * Today's short-form horoscope for one rashi, sourced live from NBT's
 * astro folder. The feed has no dedicated rashi field, so an item is
 * matched by the rashi's Hindi name appearing in its subsection name or
 * headline, and to "today" by IST calendar date (these are daily posts).
 * Returns null on any failure, or when nothing matches — the caller falls
 * back to the static mock horoscope text.
 */
export async function fetchTodayHoroscope(rashiNameHi: string, now: Date = new Date()): Promise<string | null> {
  try {
    const items = await fetchNbtItems(ASTRO_MSID);
    const todayKey = todayKeyIST(now);
    const match = items.find((item) => {
      if (nbtDateKeyIST(item.dl) !== todayKey) return false;
      const haystack = `${item.subsecname ?? ""} ${item.hl}`;
      return haystack.includes(rashiNameHi);
    });
    return match ? shortHoroscopeText(match) : null;
  } catch (err) {
    console.error(`Failed to fetch NBT astro section (msid ${ASTRO_MSID}) for rashi "${rashiNameHi}":`, err);
    return null;
  }
}
