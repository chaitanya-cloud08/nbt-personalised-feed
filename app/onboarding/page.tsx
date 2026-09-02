import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { isOnboardingComplete } from "@/lib/db";
import { getCalibrationCards } from "@/lib/data/nbtFeed";
import OnboardingClient from "@/components/onboarding/OnboardingClient";

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (isOnboardingComplete(user)) redirect("/");

  const calibrationCards = await getCalibrationCards();
  return <OnboardingClient calibrationCards={calibrationCards} />;
}
