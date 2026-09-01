// Persisted user "database" standing in for a real users/user_interests
// table (see the Part 4 schema in the spec) — keyed by email, backed by a
// JSON file on disk so accounts and preferences survive server restarts.
// That's the whole point of real accounts over the old anonymous cookie:
// without persistence, an "account" would be no better than the cookie it
// replaced.
import fs from "fs";
import path from "path";
import { UserRecord } from "@/lib/types";

export interface StoredUser extends UserRecord {
  email: string;
  passwordHash: string;
  passwordSalt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "users.json");

function loadFromDisk(): Map<string, StoredUser> {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed: StoredUser[] = JSON.parse(raw);
    return new Map(parsed.map((u) => [u.email, u]));
  } catch {
    return new Map();
  }
}

// Survive Next.js dev-server hot reload by attaching the store to
// globalThis; the disk file is what survives an actual process restart.
const globalForDb = globalThis as unknown as { __nbtUsers?: Map<string, StoredUser> };
const users = globalForDb.__nbtUsers ?? loadFromDisk();
globalForDb.__nbtUsers = users;

function persist(): void {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(Array.from(users.values()), null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to persist user store:", err);
  }
}

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function getUserByEmail(email: string): StoredUser | undefined {
  return users.get(normalizeEmail(email));
}

export function createUser(email: string, passwordHash: string, passwordSalt: string): StoredUser {
  const normalized = normalizeEmail(email);
  const user: StoredUser = {
    id: normalized,
    email: normalized,
    passwordHash,
    passwordSalt,
    city: null,
    rashi: null,
    interests: {},
    onboarding_city_done: false,
    onboarding_interests_done: false,
    onboarding_rashi_done: false,
    created_at: new Date().toISOString(),
  };
  users.set(normalized, user);
  persist();
  return user;
}

/** Every mutator below assumes the caller already resolved a valid session
 * to this email — a missing account at this point is a bug, not a user
 * error, so this throws rather than silently creating one. */
function requireUser(email: string): StoredUser {
  const user = users.get(normalizeEmail(email));
  if (!user) throw new Error(`No account for email ${email}`);
  return user;
}

export function setCity(email: string, city: string): StoredUser {
  const user = requireUser(email);
  user.city = city;
  user.onboarding_city_done = true;
  persist();
  return user;
}

export function addInterestScores(email: string, deltas: Record<string, number>): StoredUser {
  const user = requireUser(email);
  for (const [section, delta] of Object.entries(deltas)) {
    user.interests[section] = (user.interests[section] ?? 0) + delta;
  }
  user.onboarding_interests_done = true;
  persist();
  return user;
}

export function setRashi(email: string, rashi: string | null): StoredUser {
  const user = requireUser(email);
  user.rashi = rashi;
  user.onboarding_rashi_done = true;
  persist();
  return user;
}

export function isOnboardingComplete(user: UserRecord): boolean {
  return user.onboarding_city_done && user.onboarding_interests_done && user.onboarding_rashi_done;
}
