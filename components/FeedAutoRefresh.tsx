"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

// The feed page is server-rendered from a single buildFeed() call, so
// there's nothing for a visitor to naturally trigger a re-fetch. This just
// re-runs that server render on an interval, silently, so a tab left open
// picks up new live articles without the user having to reload.
export default function FeedAutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => router.refresh(), REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [router]);

  return null;
}
