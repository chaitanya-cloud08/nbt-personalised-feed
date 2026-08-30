"use client";

import { useMemo, useState } from "react";
import { CITIES } from "@/lib/data/cities";
import { strings } from "@/lib/strings.hi";

export default function CityStep({ onSelect }: { onSelect: (citySlug: string) => void }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const s = strings.onboarding.step1;

  const filtered = useMemo(
    () => CITIES.filter((c) => c.label_hi.includes(query.trim())),
    [query]
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-headline text-xl font-bold text-on-surface">{s.title}</h2>
        <p className="text-on-surface-variant mt-1">{s.subtitle}</p>
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={s.searchPlaceholder}
        className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-lg outline-none focus:border-primary"
      />

      <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto">
        {filtered.map((city) => (
          <button
            key={city.slug}
            onClick={() => setSelected(city.slug)}
            className={`rounded-lg border px-4 py-3 text-lg text-left transition ${
              selected === city.slug
                ? "border-primary bg-primary-container/10 text-primary"
                : "border-outline-variant text-on-surface hover:border-outline"
            }`}
          >
            {city.label_hi}
          </button>
        ))}
      </div>

      <button
        disabled={!selected}
        onClick={() => selected && onSelect(selected)}
        className="mt-2 rounded-lg bg-primary disabled:bg-surface-dim disabled:text-on-surface-variant text-on-primary text-lg font-semibold py-3 transition"
      >
        {s.continue}
      </button>
    </div>
  );
}
