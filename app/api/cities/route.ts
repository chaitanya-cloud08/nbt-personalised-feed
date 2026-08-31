import { NextResponse } from "next/server";
import { fetchAllCities } from "@/lib/data/nbtFeed";
import { CITIES } from "@/lib/data/cities";

export async function GET() {
  const live = await fetchAllCities();
  return NextResponse.json({ cities: live.length > 0 ? live : CITIES });
}
