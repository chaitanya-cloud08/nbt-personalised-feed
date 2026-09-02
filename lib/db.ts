// Persisted user "database" standing in for a real users/user_interests
// table (see the Part 4 schema in the spec) — backed by Postgres (Neon, via
// Vercel Postgres) so accounts and preferences survive both server restarts
// and, critically, Vercel's serverless functions each running in their own
// isolated container with no shared memory or writable disk between them.
// A prior file-on-disk + in-memory version worked fine under `next dev`'s
// single long-running process but silently lost every account once deployed.
import { sql, ensureSchema } from "@/lib/pg";
import { UserInterests, UserRecord } from "@/lib/types";

export interface StoredUser extends UserRecord {
  email: string;
  passwordHash: string;
  passwordSalt: string;
}

interface UserRow {
  email: string;
  password_hash: string;
  password_salt: string;
  city: string | null;
  rashi: string | null;
  interests: UserInterests;
  onboarding_city_done: boolean;
  onboarding_interests_done: boolean;
  onboarding_rashi_done: boolean;
  created_at: string;
}

function fromRow(row: UserRow): StoredUser {
  return {
    id: row.email,
    email: row.email,
    passwordHash: row.password_hash,
    passwordSalt: row.password_salt,
    city: row.city,
    rashi: row.rashi,
    interests: row.interests,
    onboarding_city_done: row.onboarding_city_done,
    onboarding_interests_done: row.onboarding_interests_done,
    onboarding_rashi_done: row.onboarding_rashi_done,
    created_at: row.created_at,
  };
}

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export async function getUserByEmail(email: string): Promise<StoredUser | undefined> {
  await ensureSchema();
  const rows = (await sql`SELECT * FROM users WHERE email = ${normalizeEmail(email)}`) as UserRow[];
  return rows[0] ? fromRow(rows[0]) : undefined;
}

export async function createUser(email: string, passwordHash: string, passwordSalt: string): Promise<StoredUser> {
  await ensureSchema();
  const normalized = normalizeEmail(email);
  const rows = (await sql`
    INSERT INTO users (email, password_hash, password_salt)
    VALUES (${normalized}, ${passwordHash}, ${passwordSalt})
    RETURNING *
  `) as UserRow[];
  return fromRow(rows[0]);
}

/** Every mutator below assumes the caller already resolved a valid session
 * to this email — a missing account at this point is a bug, not a user
 * error, so this throws rather than silently creating one. */
function requireRow(rows: UserRow[], email: string): UserRow {
  if (!rows[0]) throw new Error(`No account for email ${email}`);
  return rows[0];
}

export async function setCity(email: string, city: string): Promise<StoredUser> {
  await ensureSchema();
  const normalized = normalizeEmail(email);
  const rows = (await sql`
    UPDATE users SET city = ${city}, onboarding_city_done = true
    WHERE email = ${normalized}
    RETURNING *
  `) as UserRow[];
  return fromRow(requireRow(rows, normalized));
}

export async function addInterestScores(email: string, deltas: Record<string, number>): Promise<StoredUser> {
  await ensureSchema();
  const normalized = normalizeEmail(email);
  const current = await getUserByEmail(normalized);
  if (!current) throw new Error(`No account for email ${normalized}`);

  const interests: UserInterests = { ...current.interests };
  for (const [section, delta] of Object.entries(deltas)) {
    interests[section] = (interests[section] ?? 0) + delta;
  }

  const rows = (await sql`
    UPDATE users SET interests = ${JSON.stringify(interests)}::jsonb, onboarding_interests_done = true
    WHERE email = ${normalized}
    RETURNING *
  `) as UserRow[];
  return fromRow(requireRow(rows, normalized));
}

export async function setRashi(email: string, rashi: string | null): Promise<StoredUser> {
  await ensureSchema();
  const normalized = normalizeEmail(email);
  const rows = (await sql`
    UPDATE users SET rashi = ${rashi}, onboarding_rashi_done = true
    WHERE email = ${normalized}
    RETURNING *
  `) as UserRow[];
  return fromRow(requireRow(rows, normalized));
}

export function isOnboardingComplete(user: UserRecord): boolean {
  return user.onboarding_city_done && user.onboarding_interests_done && user.onboarding_rashi_done;
}
