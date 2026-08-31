// Widget eligibility rules. Each check is independent and rule-based; the
// carousel just renders whatever comes back.
import { strings } from "@/lib/strings.hi";
import { getMockLiveMatch } from "@/lib/data/liveMatch";
import { FESTIVAL_CALENDAR } from "@/lib/data/festivals";
import { getHoroscopeText } from "@/lib/data/horoscope";
import { fetchTodayHoroscope } from "@/lib/data/nbtFeed";
import { RASHIS, rashiLabel } from "@/lib/data/rashi";
import { WidgetEligible } from "@/lib/types";

const FESTIVAL_WINDOW_DAYS = 5;

export function checkLiveMatch(now: Date = new Date()): WidgetEligible | null {
  const match = getMockLiveMatch(now);
  if (!match) return null;
  return { type: "live_match", data: match };
}

function daysBetween(now: Date, date: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.round((startOfDate.getTime() - startOfNow.getTime()) / msPerDay);
}

export function checkFestival(now: Date = new Date()): WidgetEligible | null {
  for (const festival of FESTIVAL_CALENDAR) {
    const diff = daysBetween(now, new Date(festival.date));
    if (diff >= 0 && diff <= FESTIVAL_WINDOW_DAYS) {
      return {
        type: "festival",
        data: { name_hi: festival.name_hi, date: festival.date, days_remaining: diff },
      };
    }
  }
  return null;
}

/**
 * Prefers today's live, per-rashi horoscope from NBT's astro folder
 * (see fetchTodayHoroscope); falls back to the static rotating mock text
 * when there's no live match for today (fetch failure, no matching
 * headline found, etc.).
 */
export async function checkHoroscope(rashiSlug: string | null, now: Date = new Date()): Promise<WidgetEligible | null> {
  if (!rashiSlug) return null;
  const index = RASHIS.findIndex((r) => r.slug === rashiSlug);
  if (index === -1) return null;
  const label = rashiLabel(rashiSlug) ?? rashiSlug;
  const liveText = await fetchTodayHoroscope(label, now);
  return {
    type: "horoscope",
    data: {
      rashi: rashiSlug,
      rashi_label_hi: label,
      text_hi: liveText ?? getHoroscopeText(index, now),
      date: now.toISOString().slice(0, 10),
    },
  };
}

/** Horoscope leads (the astro widget shown first); live match and festival follow. */
export async function getEligibleWidgets(rashiSlug: string | null, now: Date = new Date()): Promise<WidgetEligible[]> {
  const horoscope = await checkHoroscope(rashiSlug, now);
  return [horoscope, checkLiveMatch(now), checkFestival(now)].filter(
    (w): w is WidgetEligible => w !== null
  );
}

export const festivalCopy = strings.widgets.festival.daysRemaining;
