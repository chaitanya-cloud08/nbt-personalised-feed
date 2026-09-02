"use client";

import { useState } from "react";
import CalibrationStep, { InterestPick } from "@/components/onboarding/CalibrationStep";
import { CalibrationCard } from "@/lib/types";
import { strings } from "@/lib/strings.hi";

type Phase = "prompt" | "loading" | "calibrating" | "saving";

// An interstitial embedded directly in the feed (see FeedSection) that
// lets the user recalibrate their interests without leaving the feed, then
// reloads the page so the newly-scored feed shows immediately.
export default function FeedResetCard() {
  const [phase, setPhase] = useState<Phase>("prompt");
  const [cards, setCards] = useState<CalibrationCard[]>([]);
  const s = strings.feed.resetInterests;

  async function start() {
    setPhase("loading");
    const res = await fetch("/api/recalibrate", { method: "POST" }).catch(() => null);
    const data = res ? await res.json().catch(() => null) : null;
    if (!Array.isArray(data?.cards) || data.cards.length === 0) {
      setPhase("prompt");
      return;
    }
    setCards(data.cards);
    setPhase("calibrating");
  }

  async function finish(picks: InterestPick[]) {
    setPhase("saving");
    await fetch("/api/onboarding/interests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interests: picks }),
    }).catch(() => {});
    // Hard reload, not router.refresh: the whole feed needs to re-score
    // with the just-updated interests, and this matches the same
    // hard-navigation pattern already used after login/onboarding.
    window.location.reload();
  }

  if (phase === "calibrating" || phase === "saving") {
    return (
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
        <CalibrationStep
          cards={cards}
          title={s.calibrationTitle}
          subtitle={s.calibrationSubtitle}
          onComplete={finish}
        />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest p-4 flex flex-col items-center gap-3 text-center">
      <span className="material-symbols-outlined text-primary text-[28px]" aria-hidden="true">
        tune
      </span>
      <div>
        <p className="font-headline text-on-surface font-semibold">{s.title}</p>
        <p className="text-on-surface-variant text-sm mt-1">{s.subtitle}</p>
      </div>
      <button
        onClick={start}
        disabled={phase === "loading"}
        className="rounded-lg bg-primary disabled:bg-surface-dim disabled:text-on-surface-variant text-on-primary text-sm font-semibold px-5 py-2 transition"
      >
        {phase === "loading" ? strings.common.loading : s.button}
      </button>
    </div>
  );
}
