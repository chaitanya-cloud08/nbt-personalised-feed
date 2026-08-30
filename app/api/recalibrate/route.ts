import { NextResponse } from "next/server";
import { RECALIBRATION_POOL } from "@/lib/data/articles";
import { CalibrationCard } from "@/lib/types";

function pickRandom(pool: CalibrationCard[], count: number): CalibrationCard[] {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Returns 3 fresh cards, same shape as the onboarding calibration step.
// The client then POSTs the resulting {section, liked} picks to
// /api/onboarding/interests, whose scores accumulate rather than reset.
export async function POST() {
  const cards = pickRandom(RECALIBRATION_POOL, 3);
  return NextResponse.json({ cards });
}
