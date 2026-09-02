"use client";

import { useState } from "react";
import { CalibrationCard } from "@/lib/types";
import { sectionLabel } from "@/lib/data/sections";
import { strings } from "@/lib/strings.hi";

export interface InterestPick {
  section: string;
  liked: boolean;
}

export default function CalibrationStep({
  cards,
  title,
  subtitle,
  onComplete,
}: {
  cards: CalibrationCard[];
  title?: string;
  subtitle?: string;
  onComplete: (picks: InterestPick[]) => void;
}) {
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<InterestPick[]>([]);
  const s = strings.onboarding.step2;

  const card = cards[index];

  function choose(liked: boolean) {
    const next = [...picks, { section: card.section, liked }];
    if (index + 1 < cards.length) {
      setPicks(next);
      setIndex(index + 1);
    } else {
      onComplete(next);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-headline text-xl font-bold text-on-surface">{title ?? s.title}</h2>
        <p className="text-on-surface-variant mt-1">{subtitle ?? s.subtitle}</p>
      </div>

      <div className="text-sm text-on-surface-variant">
        {strings.onboarding.progress(index + 1, cards.length)}
      </div>

      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm p-6 flex flex-col gap-4 min-h-48 justify-between">
        {card.url ? (
          <a href={card.url} target="_blank" rel="noopener noreferrer" className="block">
            <span className="inline-block rounded-full bg-primary-container/10 text-primary text-sm px-3 py-1 font-medium">
              {sectionLabel(card.section)}
            </span>
            <p className="font-headline text-lg font-semibold mt-3 leading-relaxed text-on-surface hover:underline">
              {card.headline_hi}
            </p>
          </a>
        ) : (
          <div>
            <span className="inline-block rounded-full bg-primary-container/10 text-primary text-sm px-3 py-1 font-medium">
              {sectionLabel(card.section)}
            </span>
            <p className="font-headline text-lg font-semibold mt-3 leading-relaxed text-on-surface">
              {card.headline_hi}
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => choose(false)}
            className="flex-1 rounded-lg border border-outline-variant text-on-surface py-3 text-lg font-medium hover:bg-surface-container transition"
          >
            {s.notInterested}
          </button>
          <button
            onClick={() => choose(true)}
            className="flex-1 rounded-lg bg-primary text-on-primary py-3 text-lg font-medium hover:opacity-90 transition"
          >
            {s.interested}
          </button>
        </div>
      </div>
    </div>
  );
}
