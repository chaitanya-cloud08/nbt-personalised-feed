"use client";

import { useMemo, useState } from "react";
import { getPickerStates, getPickerCities, PickerState } from "@/lib/data/nbtSectionMap";
import { strings } from "@/lib/strings.hi";

type Phase = "state" | "city";

// Two-step picker (state, then that state's cities) instead of one flat
// list — NBT's real hierarchy has 300+ cities, which would be unusable as
// a single grid.
export default function CityStep({ onSelect }: { onSelect: (citySlug: string) => void }) {
  const [phase, setPhase] = useState<Phase>("state");
  const [query, setQuery] = useState("");
  const [selectedState, setSelectedState] = useState<PickerState | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const s = strings.onboarding.step1;

  const states = useMemo(() => getPickerStates(), []);
  const cities = useMemo(() => (selectedState ? getPickerCities(selectedState.slug) : []), [selectedState]);

  const filteredStates = useMemo(
    () => states.filter((state) => state.label_hi.includes(query.trim())),
    [states, query]
  );
  const filteredCities = useMemo(
    () => cities.filter((city) => city.label_hi.includes(query.trim())),
    [cities, query]
  );

  function chooseState(state: PickerState) {
    setSelectedState(state);
    setSelectedCity(null);
    setQuery("");
    setPhase("city");
  }

  function backToStates() {
    setPhase("state");
    setSelectedCity(null);
    setQuery("");
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        {phase === "city" && selectedState && (
          <button
            onClick={backToStates}
            className="text-sm font-medium text-primary hover:opacity-80 mb-2 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              arrow_back
            </span>
            {selectedState.label_hi}
          </button>
        )}
        <h2 className="font-headline text-xl font-bold text-on-surface">
          {phase === "state" ? s.title : s.cityTitle}
        </h2>
        <p className="text-on-surface-variant mt-1">{phase === "state" ? s.subtitle : s.citySubtitle}</p>
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={phase === "state" ? s.searchPlaceholder : s.citySearchPlaceholder}
        className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-lg outline-none focus:border-primary"
      />

      {phase === "state" ? (
        <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto">
          {filteredStates.map((state) => (
            <button
              key={state.slug}
              onClick={() => chooseState(state)}
              className="rounded-lg border px-4 py-3 text-lg text-left transition border-outline-variant text-on-surface hover:border-outline"
            >
              {state.label_hi}
            </button>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto">
          {filteredCities.map((city) => (
            <button
              key={city.slug}
              onClick={() => setSelectedCity(city.slug)}
              className={`rounded-lg border px-4 py-3 text-lg text-left transition ${
                selectedCity === city.slug
                  ? "border-primary bg-primary-container/10 text-primary"
                  : "border-outline-variant text-on-surface hover:border-outline"
              }`}
            >
              {city.label_hi}
            </button>
          ))}
        </div>
      )}

      {phase === "city" && (
        <button
          disabled={!selectedCity}
          onClick={() => selectedCity && onSelect(selectedCity)}
          className="mt-2 rounded-lg bg-primary disabled:bg-surface-dim disabled:text-on-surface-variant text-on-primary text-lg font-semibold py-3 transition"
        >
          {s.continue}
        </button>
      )}
    </div>
  );
}
