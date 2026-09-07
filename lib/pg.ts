// Shared Postgres client (Neon serverless driver — what Vercel Postgres runs
// on). Connects over HTTP per-query instead of a persistent TCP socket, which
// is what makes it usable from serverless functions at all: a plain `pg`
// pool can't be kept warm across invocations the way it can on a long-lived
// server, and in-memory/file-based storage (the previous approach here)
// doesn't survive across the isolated containers Vercel runs each function
// in — see lib/db.ts and lib/auth/sessions.ts for what that broke.
import { neon, NeonQueryFunction } from "@neondatabase/serverless";

// Resolved lazily, on first query, not at module load — Next.js evaluates
// every route module during `next build`'s page-data collection, even ones
// that are fully dynamic at runtime, so throwing here eagerly would fail
// the production build itself whenever the env var isn't set at build time.
let client: NeonQueryFunction<false, false> | null = null;

// Neon's Vercel integration prefixes every env var it creates with the
// project's own name (e.g. "nbtpersonalised_DATABASE_URL_UNPOOLED"), not a
// fixed name — so instead of guessing exact names, scan for any key ending
// in one of these, preferring a pooled connection string when both exist.
const CONNECTION_STRING_SUFFIXES = [
  "DATABASE_URL",
  "POSTGRES_URL",
  "DATABASE_URL_UNPOOLED",
  "POSTGRES_URL_NON_POOLING",
  "POSTGRES_PRISMA_URL",
];

function findConnectionString(): string | undefined {
  for (const suffix of CONNECTION_STRING_SUFFIXES) {
    const key = Object.keys(process.env).find((k) => k === suffix || k.endsWith(`_${suffix}`));
    if (key && process.env[key]) return process.env[key];
  }
  return undefined;
}

function getClient(): NeonQueryFunction<false, false> {
  if (!client) {
    const connectionString = findConnectionString();
    if (!connectionString) {
      throw new Error(
        `No Postgres connection string found among env vars (checked names ending in ` +
          `${CONNECTION_STRING_SUFFIXES.join(", ")}, with or without a project-name prefix). ` +
          "Add a Postgres/Neon database to this project in the Vercel dashboard, " +
          "confirm it's enabled for the environment you're testing, and redeploy " +
          "(adding an env var does not affect deployments that already exist)."
      );
    }
    client = neon(connectionString);
  }
  return client;
}

export const sql: NeonQueryFunction<false, false> = ((...args: Parameters<NeonQueryFunction<false, false>>) =>
  getClient()(...args)) as NeonQueryFunction<false, false>;

let schemaReady: Promise<void> | null = null;

/** Idempotent — safe to call on every cold start. */
export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          email TEXT PRIMARY KEY,
          password_hash TEXT NOT NULL,
          password_salt TEXT NOT NULL,
          city TEXT,
          rashi TEXT,
          interests JSONB NOT NULL DEFAULT '{}'::jsonb,
          onboarding_city_done BOOLEAN NOT NULL DEFAULT false,
          onboarding_interests_done BOOLEAN NOT NULL DEFAULT false,
          onboarding_rashi_done BOOLEAN NOT NULL DEFAULT false,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS sessions (
          id TEXT PRIMARY KEY,
          email TEXT NOT NULL REFERENCES users(email) ON DELETE CASCADE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS festival_content (
          tag TEXT PRIMARY KEY,
          content JSONB NOT NULL,
          generated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
    })();
  }
  return schemaReady;
}
