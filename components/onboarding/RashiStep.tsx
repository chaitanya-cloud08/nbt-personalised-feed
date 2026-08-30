"use client";

import { useState } from "react";
import { RASHIS } from "@/lib/data/rashi";
import { strings } from "@/lib/strings.hi";

export default function RashiStep({
  onFinish,
}: {
  onFinish: (rashi: string | null) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const s = strings.onboarding.step3;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-headline text-xl font-bold text-on-surface">{s.title}</h2>
        <p className="text-on-surface-variant mt-1">{s.subtitle}</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {RASHIS.map((r) => (
          <button
            key={r.slug}
            onClick={() => setSelected(r.slug)}
            className={`rounded-lg border px-3 py-3 text-lg transition ${
              selected === r.slug
                ? "border-primary bg-primary-container/10 text-primary"
                : "border-outline-variant text-on-surface hover:border-outline"
            }`}
          >
            {r.label_hi}
          </button>
        ))}
      </div>

      <div className="flex gap-3 mt-2">
        <button
          onClick={() => onFinish(null)}
          className="flex-1 rounded-lg border border-outline-variant text-on-surface py-3 text-lg font-medium hover:bg-surface-container transition"
        >
          {s.skip}
        </button>
        <button
          disabled={!selected}
          onClick={() => selected && onFinish(selected)}
          className="flex-1 rounded-lg bg-primary disabled:bg-surface-dim disabled:text-on-surface-variant text-on-primary py-3 text-lg font-medium transition"
        >
          {s.finish}
        </button>
      </div>
    </div>
  );
}
