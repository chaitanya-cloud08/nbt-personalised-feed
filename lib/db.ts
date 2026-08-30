// In-memory "database" standing in for a real users/user_interests table
// (see the Part 4 schema in the spec). Keyed by a cookie-issued user id —
// this app treats the visitor as already logged in and simulates the
// session with that cookie rather than implementing auth.
import { UserRecord } from "@/lib/types";

// Survive Next.js dev-server hot reload by attaching the store to globalThis.
const globalForDb = globalThis as unknown as { __nbtUsers?: Map<string, UserRecord> };
const users = globalForDb.__nbtUsers ?? new Map<string, UserRecord>();
globalForDb.__nbtUsers = users;

export function getUser(id: string): UserRecord | undefined {
  return users.get(id);
}

export function ensureUser(id: string): UserRecord {
  let user = users.get(id);
  if (!user) {
    user = {
      id,
      city: null,
      rashi: null,
      interests: {},
      onboarding_city_done: false,
      onboarding_interests_done: false,
      onboarding_rashi_done: false,
      created_at: new Date().toISOString(),
    };
    users.set(id, user);
  }
  return user;
}

export function setCity(id: string, city: string): UserRecord {
  const user = ensureUser(id);
  user.city = city;
  user.onboarding_city_done = true;
  return user;
}

export function addInterestScores(id: string, deltas: Record<string, number>): UserRecord {
  const user = ensureUser(id);
  for (const [section, delta] of Object.entries(deltas)) {
    user.interests[section] = (user.interests[section] ?? 0) + delta;
  }
  user.onboarding_interests_done = true;
  return user;
}

export function setRashi(id: string, rashi: string | null): UserRecord {
  const user = ensureUser(id);
  user.rashi = rashi;
  user.onboarding_rashi_done = true;
  return user;
}

export function isOnboardingComplete(user: UserRecord): boolean {
  return user.onboarding_city_done && user.onboarding_interests_done && user.onboarding_rashi_done;
}
