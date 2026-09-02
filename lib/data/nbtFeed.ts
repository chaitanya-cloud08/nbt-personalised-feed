// Live article source: Navbharat Times' public "wufs" feed
// (https://global-feed.indiatimes.com/wufs/feed/list/article). One NBT
// section msid is fetched per app SectionSlug — all 6 have a real live
// source (see lib/data/nbtSectionMap.ts for the full curated msid table).
import { Article, CalibrationCard, SectionSlug } from "@/lib/types";
import { findPickerCity } from "@/lib/data/nbtSectionMap";
import { CALIBRATION_ARTICLES } from "@/lib/data/articles";

const NBT_FEED_BASE = "https://global-feed.indiatimes.com/wufs/feed/list/article";
const NBT_ARTICLE_BASE = "https://navbharattimes.indiatimes.com";

const SECTION_MSID: Partial<Record<SectionSlug, string>> = {
  business: "2279786",
  entertainment: "2279793",
  cricket: "3521869", // sports/cricket specifically, not the broader sports msid
  lifestyle: "2354729",
  india: "1564454",
  world: "2279801",
};

interface NbtFeedItem {
  id: string;
  hl: string;
  dl: string; // e.g. "Aug 31, 2026, 11:54 AM"
  seolocation: string;
  imageid?: string;
  syn?: string; // short synopsis, when present
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

/**
 * The single most recent article from each interest section, for the
 * onboarding/recalibration calibration cards. A section whose live fetch
 * fails, or returns nothing, falls back to its static CALIBRATION_ARTICLES
 * entry — callers always get exactly one card per section, live where
 * possible.
 */
export async function getCalibrationCards(): Promise<CalibrationCard[]> {
  const entries = Object.entries(SECTION_MSID) as [SectionSlug, string][];
  const live = await Promise.all(
    entries.map(async ([section, msid]): Promise<CalibrationCard | null> => {
      try {
        const items = await fetchNbtItems(msid);
        if (items.length === 0) return null;
        // Compare parsed ISO timestamps, not raw `dl` strings — those start
        // with an English month name, which doesn't sort chronologically.
        const latest = items.reduce((a, b) => (parseNbtDate(b.dl) > parseNbtDate(a.dl) ? b : a));
        return { section, headline_hi: stripTags(latest.hl) };
      } catch (err) {
        console.error(`Failed to fetch latest "${section}" article for calibration (msid ${msid}):`, err);
        return null;
      }
    })
  );
  const liveBySection = new Map(live.filter((c): c is CalibrationCard => c !== null).map((c) => [c.section, c]));
  return CALIBRATION_ARTICLES.map((fallback) => liveBySection.get(fallback.section) ?? fallback);
}

const CITY_FRESHNESS_HOURS = 24;

/**
 * Finds the user's chosen city's articles, using the curated static
 * state/city msid map (lib/data/nbtSectionMap.ts) instead of live
 * discovery — exact, no name-matching guesswork. If the city-level folder
 * has nothing, or its freshest article is older than 24h, falls back to
 * the broader state-level folder instead (same as before the sibling-city
 * filtering — that filter has been removed per request).
 */
export async function fetchStateArticles(citySlug: string | null): Promise<Article[]> {
  if (!citySlug) return [];

  try {
    const match = findPickerCity(citySlug);
    if (!match) {
      console.warn(`No NBT state/city entry found for city slug "${citySlug}"`);
      return [];
    }

    const stateLevel = await fetchSection(match.stateMsid, 3600);
    const stateArticles = stateLevel.items.map((item) => toArticle(item, "india", citySlug));

    const cityItems = await fetchNbtItems(match.msid);
    const cityArticles = cityItems.map((item) => toArticle(item, "india", citySlug));
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
const HOROSCOPE_SNIPPET_LENGTH = 160;
// Weekly/monthly/yearly roundups mention several rashis in passing and would
// otherwise false-positive-match any of them; only daily posts are wanted.
const HOROSCOPE_ROUNDUP_RE = /weekly|monthly|yearly|साप्ताहिक|मासिक|वार्षिक/i;

// NBT's synopsis text is prefixed with its own English title + date restated
// (e.g. "Aaj Ka Mesh Rashifal, 1 September 2026 : ..."), before the actual
// Hindi prediction starts. That boilerplate is always plain ASCII up to a
// colon, unlike the Devanagari content that follows, so it's safe to strip.
const HOROSCOPE_PREFIX_RE = /^[A-Za-z0-9,.\s]+:\s*/;
const SENTENCE_END_RE = /[।.!?]/;

/**
 * Cuts at the last full sentence that fits within the length budget, so the
 * snippet reads as a complete thought instead of stopping mid-sentence.
 * Falls back to the last whole word + ellipsis only when no sentence ending
 * falls far enough into the window to leave a substantial snippet.
 */
function shortHoroscopeText(item: NbtFeedItem): string {
  const source = stripTags(item.syn?.trim() || item.hl)
    .trim()
    .replace(HOROSCOPE_PREFIX_RE, "");
  if (source.length <= HOROSCOPE_SNIPPET_LENGTH) return source;

  const window = source.slice(0, HOROSCOPE_SNIPPET_LENGTH);
  let sentenceEnd = -1;
  for (let i = window.length - 1; i >= 0; i--) {
    if (SENTENCE_END_RE.test(window[i])) {
      sentenceEnd = i;
      break;
    }
  }
  if (sentenceEnd >= window.length * 0.4) {
    return window.slice(0, sentenceEnd + 1).trim();
  }

  const lastSpace = window.lastIndexOf(" ");
  const safeCut = lastSpace > 0 ? lastSpace : window.length;
  return `${window.slice(0, safeCut).trim()}…`;
}

function nbtArticleUrl(item: NbtFeedItem): string {
  return `${NBT_ARTICLE_BASE}/${item.seolocation}/articleshow/${item.id}.cms`;
}

export interface TodayHoroscope {
  text: string;
  url: string;
}

/**
 * Today's short-form horoscope for one rashi, sourced live from NBT's
 * astro folder, plus the link to the full article. The feed has no
 * dedicated rashi field, so an item is matched by rashi name appearing in
 * its own headline — daily per-rashi posts are titled in transliterated
 * English (e.g. "Aaj Ka Mesh Rashifal..."), which is exactly this app's
 * own rashi slug convention, so that's matched case-insensitively; the
 * Hindi label is also checked in case a headline uses it instead. Only the
 * headline is checked, not the longer synopsis body, which can mention
 * other rashis in passing and cause false matches. Roundups
 * (weekly/monthly/yearly) are excluded, and items are matched to "today"
 * via IST calendar date (these are daily posts). Returns null on any
 * failure or when nothing matches — the caller falls back to the static
 * mock horoscope text.
 */
export async function fetchTodayHoroscope(
  rashiSlug: string,
  rashiNameHi: string,
  now: Date = new Date()
): Promise<TodayHoroscope | null> {
  try {
    const items = await fetchNbtItems(ASTRO_MSID);
    const todayKey = todayKeyIST(now);
    const slugLower = rashiSlug.toLowerCase();
    const match = items.find((item) => {
      if (nbtDateKeyIST(item.dl) !== todayKey) return false;
      const headline = stripTags(item.hl);
      if (HOROSCOPE_ROUNDUP_RE.test(headline)) return false;
      return headline.toLowerCase().includes(slugLower) || headline.includes(rashiNameHi);
    });
    return match ? { text: shortHoroscopeText(match), url: nbtArticleUrl(match) } : null;
  } catch (err) {
    console.error(`Failed to fetch NBT astro section (msid ${ASTRO_MSID}) for rashi "${rashiSlug}":`, err);
    return null;
  }
}
