// Live cricket score, sourced from NBT's own app cricket-widget feed — a
// match calendar (recent results, live match, upcoming fixtures), not a
// dedicated single-match endpoint. Distinct host/shape from the wufs
// article feed, hence its own file.
import { LiveMatchData } from "@/lib/types";

const CRICKET_WIDGET_URL = "https://nbtstorage.indiatimes.com/nbtappcricwidget.htm?feedtype=sjson";

interface NbtCricketMatch {
  live: string; // "1" while live, "0" otherwise
  isprogress: string; // "0" upcoming, "1" in progress, "2" completed
  teama: string;
  teamb: string;
  teama_short: string;
  teamb_short: string;
  teama_score: string;
  teamb_score: string;
  teama_overs: string;
  teamb_overs: string;
  inn_score_1: string;
  inn_score_2: string;
  inn_score_3: string;
  inn_score_4: string;
}

interface NbtCricketFeed {
  Calendar?: NbtCricketMatch[];
}

function formatScore(score: string, overs: string): string {
  if (!score?.trim()) return "—";
  const oversClean = overs?.replace(/\s*ov$/i, "").trim();
  return oversClean ? `${score} (${oversClean})` : score;
}

const INNINGS_LABELS_HI = ["पहली पारी", "दूसरी पारी", "तीसरी पारी", "चौथी पारी"];

/** The feed writes a partial score into inn_score_N for whichever innings
 * is currently being played, so counting non-empty entries gives the
 * current innings number directly (no +1 needed). */
function inningsStatusHi(match: NbtCricketMatch): string {
  const scores = [match.inn_score_1, match.inn_score_2, match.inn_score_3, match.inn_score_4];
  const activeInnings = scores.filter((s) => s?.trim()).length || 1;
  const label = INNINGS_LABELS_HI[Math.min(activeInnings - 1, INNINGS_LABELS_HI.length - 1)];
  return `${label} जारी`;
}

function toLiveMatchData(match: NbtCricketMatch): LiveMatchData {
  return {
    team_a: match.teama_short || match.teama,
    team_b: match.teamb_short || match.teamb,
    score_a: formatScore(match.teama_score, match.teama_overs),
    score_b: formatScore(match.teamb_score, match.teamb_overs),
    status_hi: inningsStatusHi(match),
  };
}

/**
 * The currently in-progress match, if any. Returns null when nothing is
 * live right now (the calendar has only upcoming/completed fixtures) or on
 * any fetch failure — the caller falls back to the static mock match.
 */
export async function fetchLiveCricketMatch(): Promise<LiveMatchData | null> {
  try {
    const res = await fetch(CRICKET_WIDGET_URL, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 }, // scores move fast; keep this short
    });
    if (!res.ok) throw new Error(`Cricket widget feed responded ${res.status}`);
    const data: NbtCricketFeed = await res.json();
    const match = (data.Calendar ?? []).find((m) => m.isprogress === "1" || m.live === "1");
    return match ? toLiveMatchData(match) : null;
  } catch (err) {
    console.error("Failed to fetch NBT cricket widget feed:", err);
    return null;
  }
}
