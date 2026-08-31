import { NextResponse } from "next/server";
import { getUserId } from "@/lib/session";
import { ensureUser } from "@/lib/db";
import { getEligibleWidgets } from "@/lib/widgets";

export async function GET() {
  const userId = await getUserId();
  const user = ensureUser(userId);
  const widgets = await getEligibleWidgets(user.rashi);
  return NextResponse.json({ widgets });
}
