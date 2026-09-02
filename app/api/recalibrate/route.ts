import { NextResponse } from "next/server";
import { getCalibrationCards } from "@/lib/data/nbtFeed";

// Returns one fresh card per interest section (always all 6, live where
// possible — see getCalibrationCards), same shape as the onboarding
// calibration step. The client then POSTs the resulting {section, liked}
// picks to /api/onboarding/interests, whose scores accumulate rather than
// reset.
export async function POST() {
  const cards = await getCalibrationCards();
  return NextResponse.json({ cards });
}
