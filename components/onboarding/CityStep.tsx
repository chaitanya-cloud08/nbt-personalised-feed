"use client";

import { useEffect, useMemo, useState } from "react";
import { CITIES } from "@/lib/data/cities";
import { City } from "@/lib/types";
import { strings } from "@/lib/strings.hi";

export default function CityStep({ onSelect }: { onSelect: (citySlug: string) => void }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  // Seeded with the static list so the picker isn't empty while the live
  // NBT city list loads; replaced once/if that fetch succeeds.
  const [cities, setCities] = useState<City[]>(CITIES);
  const s = strings.onboarding.step1;

  useEffect(() => {
    let cancelled = false;
    fetch("/api/cities")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data.cities) && data.cities.length > 0) {
          setCities(data.cities);
        }
      })
      .catch(() => {}); // keep the static fallback on failure
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => cities.filter((c) => c.label_hi.includes(query.trim())), [cities, query]);

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
