"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CityStep from "@/components/onboarding/CityStep";
import RashiStep from "@/components/onboarding/RashiStep";
import CalibrationStep, { InterestPick } from "@/components/onboarding/CalibrationStep";
import BottomNav from "@/components/BottomNav";
import { cityLabel } from "@/lib/data/cities";
import { rashiLabel } from "@/lib/data/rashi";
import { strings } from "@/lib/strings.hi";
import { CalibrationCard } from "@/lib/types";

type Panel = "none" | "city" | "rashi" | "recalibrate" | "recalibrate_done";

export default function SettingsClient({
  initialCity,
  initialRashi,
}: {
  initialCity: string | null;
  initialRashi: string | null;
}) {
  const router = useRouter();
  const [city, setCity] = useState(initialCity);
  const [rashi, setRashi] = useState(initialRashi);
  const [panel, setPanel] = useState<Panel>("none");
  const [recalCards, setRecalCards] = useState<CalibrationCard[]>([]);
  const s = strings.settings;

  async function saveCity(slug: string) {
    await fetch("/api/onboarding/city", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city: slug }),
    });
    setCity(slug);
    setPanel("none");
    router.refresh();
  }

  async function saveRashi(slug: string | null) {
    await fetch("/api/onboarding/rashi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rashi: slug }),
    });
    setRashi(slug);
    setPanel("none");
    router.refresh();
  }

  async function startRecalibrate() {
    const res = await fetch("/api/recalibrate", { method: "POST" });
    const data = await res.json();
    setRecalCards(data.cards ?? []);
    setPanel("recalibrate");
  }

  async function finishRecalibrate(picks: InterestPick[]) {
    await fetch("/api/onboarding/interests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interests: picks }),
    });
    setPanel("recalibrate_done");
    router.refresh();
  }

  return (
    <>
      <header className="flex items-center justify-between px-4 h-14 w-full sticky top-0 z-10 bg-surface border-b border-outline-variant/40">
        <h1 className="font-headline text-xl font-bold text-primary">{s.title}</h1>
      </header>

      <main className="flex-1 flex flex-col w-full px-4 py-6 gap-6 bg-surface-bright">
        {panel === "none" && (
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-on-surface-variant">{s.cityLabel}</p>
                <p className="font-headline text-lg font-semibold text-on-surface">
                  {cityLabel(city) ?? "-"}
                </p>
              </div>
              <button
                onClick={() => setPanel("city")}
                className="text-sm font-medium text-primary hover:opacity-80"
              >
                {s.changeCity}
              </button>
            </div>

            <div className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-on-surface-variant">{s.rashiLabel}</p>
                <p className="font-headline text-lg font-semibold text-on-surface">
                  {rashiLabel(rashi) ?? s.rashiNotSet}
                </p>
              </div>
              <button
                onClick={() => setPanel("rashi")}
                className="text-sm font-medium text-primary hover:opacity-80"
              >
                {s.changeRashi}
              </button>
            </div>

            <div className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-4 flex flex-col gap-2">
              <p className="font-headline text-lg font-semibold text-on-surface">{s.recalibrate}</p>
              <p className="text-sm text-on-surface-variant">{s.recalibrateSubtitle}</p>
              <button
                onClick={startRecalibrate}
                className="mt-2 self-start rounded-lg bg-primary text-on-primary text-sm font-medium px-4 py-2"
              >
                {s.recalibrate}
              </button>
            </div>
          </div>
        )}

        {panel === "city" && <CityStep onSelect={saveCity} />}

        {panel === "rashi" && <RashiStep onFinish={saveRashi} />}

        {panel === "recalibrate" && recalCards.length > 0 && (
          <CalibrationStep cards={recalCards} onComplete={finishRecalibrate} />
        )}

        {panel === "recalibrate_done" && (
          <div className="flex flex-col items-center gap-4 text-center py-10">
            <p className="font-headline text-2xl font-bold text-on-surface">{s.saved}</p>
            <button
              onClick={() => router.push("/")}
              className="mt-4 rounded-lg bg-primary text-on-primary text-lg font-semibold px-8 py-3"
            >
              {s.backToFeed}
            </button>
          </div>
        )}
      </main>

      <BottomNav />
    </>
  );
}
