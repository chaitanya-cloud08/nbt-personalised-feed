import { LiveMatchData } from "@/lib/types";

// Mock stand-in for a real cricket score API (e.g. CricAPI / Cricbuzz).
// In production, swap `getMockLiveMatch()` for an actual fetch to a sports
// score provider inside checkLiveMatch() (lib/widgets.ts) — the polling
// cadence (every 2-3 min) and eligibility contract stay the same either way.
interface MockMatchWindow {
  team_a: string;
  team_b: string;
  score_a: string;
  score_b: string;
  status_hi: string;
  starts_at: string; // ISO
  ends_at: string; // ISO
}

// Window is anchored to "now" at module load so the demo always has a live
// match to show right now, without hardcoding a date that goes stale.
const MOCK_MATCH: MockMatchWindow = {
  team_a: "भारत",
  team_b: "ऑस्ट्रेलिया",
  score_a: "187/4 (32.1)",
  score_b: "—",
  status_hi: "पहली पारी जारी",
  starts_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  ends_at: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
};

export function getMockLiveMatch(now: Date = new Date()): LiveMatchData | null {
  const t = now.getTime();
  const starts = new Date(MOCK_MATCH.starts_at).getTime();
  const ends = new Date(MOCK_MATCH.ends_at).getTime();
  if (t < starts || t > ends) return null;
  const { team_a, team_b, score_a, score_b, status_hi } = MOCK_MATCH;
  return { team_a, team_b, score_a, score_b, status_hi };
}
