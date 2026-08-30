// Widget eligibility rules. Each check is independent and rule-based; the
// carousel just renders whatever comes back.
import { strings } from "@/lib/strings.hi";
import { getMockLiveMatch } from "@/lib/data/liveMatch";
import { FESTIVAL_CALENDAR } from "@/lib/data/festivals";
import { getHoroscopeText } from "@/lib/data/horoscope";
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

export function checkHoroscope(rashiSlug: string | null, now: Date = new Date()): WidgetEligible | null {
  if (!rashiSlug) return null;
  const index = RASHIS.findIndex((r) => r.slug === rashiSlug);
  if (index === -1) return null;
  return {
    type: "horoscope",
    data: {
      rashi: rashiSlug,
      rashi_label_hi: rashiLabel(rashiSlug) ?? rashiSlug,
      text_hi: getHoroscopeText(index, now),
      date: now.toISOString().slice(0, 10),
    },
  };
}

/** Ordered by time-sensitivity: live match > festival > horoscope. */
export function getEligibleWidgets(rashiSlug: string | null, now: Date = new Date()): WidgetEligible[] {
  return [checkLiveMatch(now), checkFestival(now), checkHoroscope(rashiSlug, now)].filter(
    (w): w is WidgetEligible => w !== null
  );
}

export const festivalCopy = strings.widgets.festival.daysRemaining;
