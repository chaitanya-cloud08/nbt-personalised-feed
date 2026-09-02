import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { getEligibleWidgets } from "@/lib/widgets";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "not authenticated" }, { status: 401 });

  const widgets = await getEligibleWidgets(user.rashi);
  return NextResponse.json({ widgets });
}
