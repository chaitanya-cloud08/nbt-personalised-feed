"use client";

import { useState } from "react";
import CityStep from "@/components/onboarding/CityStep";
import CalibrationStep, { InterestPick } from "@/components/onboarding/CalibrationStep";
import RashiStep from "@/components/onboarding/RashiStep";
import { CALIBRATION_ARTICLES } from "@/lib/data/articles";
import { strings } from "@/lib/strings.hi";

type Step = "city" | "interests" | "interests_done" | "rashi";

export default function OnboardingClient() {
  const [step, setStep] = useState<Step>("city");
  const s = strings.onboarding.step2;

  async function handleCity(city: string) {
    await fetch("/api/onboarding/city", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city }),
    });
    setStep("interests");
  }

  async function handleInterests(picks: InterestPick[]) {
    await fetch("/api/onboarding/interests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interests: picks }),
    });
    setStep("interests_done");
  }

  async function handleRashi(rashi: string | null) {
    await fetch("/api/onboarding/rashi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rashi }),
    });
    // A hard navigation, not router.push: the very first visit to "/"
    // (before onboarding started) redirected to "/onboarding", and the
    // client-side Router Cache can replay that stale redirect on a plain
    // push here since a fetch()-based mutation doesn't invalidate it —
    // sending the user straight back to onboarding they just finished.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = "/";
  }

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {step === "city" && <CityStep onSelect={handleCity} />}

        {step === "interests" && (
          <CalibrationStep cards={CALIBRATION_ARTICLES} onComplete={handleInterests} />
        )}

        {step === "interests_done" && (
          <div className="flex flex-col items-center gap-4 text-center py-10">
            <p className="font-headline text-2xl font-bold text-on-surface">{s.done}</p>
            <p className="text-on-surface-variant">{s.doneSubtitle}</p>
            <button
              onClick={() => setStep("rashi")}
              className="mt-4 rounded-lg bg-primary text-on-primary text-lg font-semibold px-8 py-3"
            >
              {strings.onboarding.step1.continue}
            </button>
          </div>
        )}

        {step === "rashi" && <RashiStep onFinish={handleRashi} />}
      </div>
    </main>
  );
}
