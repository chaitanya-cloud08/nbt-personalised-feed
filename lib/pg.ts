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

function getClient(): NeonQueryFunction<false, false> {
  if (!client) {
    const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
    if (!connectionString) {
      throw new Error(
        "No Postgres connection string found (DATABASE_URL or POSTGRES_URL). " +
          "Add a Postgres/Neon database to this project in the Vercel dashboard, " +
          "then run `vercel env pull .env.local` to get it locally."
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
    })();
  }
  return schemaReady;
}
