export type SectionSlug =
  | "business"
  | "entertainment"
  | "cricket"
  | "lifestyle"
  | "india"
  | "world";

export interface Section {
  slug: SectionSlug;
  label_hi: string;
}

export interface City {
  slug: string;
  label_hi: string;
}

export interface Rashi {
  slug: string;
  label_hi: string;
}

export interface Article {
  id: string;
  headline_hi: string;
  section: SectionSlug;
  city: string | null; // null = national news
  published_at: string; // ISO timestamp
  url?: string; // link to the source article; absent for mock/demo articles
  thumbnail_url?: string; // article image; absent for mock/demo articles
}

export interface ScoredArticle extends Article {
  score: number;
}

export interface UserInterests {
  [section: string]: number; // accumulated +1/-1 per section
}

export interface UserRecord {
  id: string;
  city: string | null;
  rashi: string | null;
  interests: UserInterests;
  onboarding_city_done: boolean;
  onboarding_interests_done: boolean;
  onboarding_rashi_done: boolean; // true once step is shown & resolved (skip counts as done)
  created_at: string;
}

export interface CalibrationCard {
  section: SectionSlug;
  headline_hi: string;
  url?: string; // link to the source article; absent for mock/demo cards
}

export type WidgetEligible =
  | { type: "live_match"; data: LiveMatchData }
  | { type: "festival"; data: FestivalWidgetData }
  | { type: "horoscope"; data: HoroscopeWidgetData };

export interface LiveMatchData {
  team_a: string;
  team_b: string;
  score_a: string;
  score_b: string;
  status_hi: string;
}

export interface FestivalWidgetData {
  name_hi: string;
  date: string;
  days_remaining: number;
}

export interface HoroscopeWidgetData {
  rashi: string;
  rashi_label_hi: string;
  text_hi: string;
  date: string;
  url?: string; // link to the full article; absent for the static mock text
}
