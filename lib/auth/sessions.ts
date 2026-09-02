// Session store — persisted to Postgres (see lib/db.ts for why). A plain
// in-memory Map worked under `next dev` but broke on Vercel: each API route
// is its own serverless function, and different invocations — even of the
// *same* route seconds apart — are not guaranteed to share a process, so a
// session created by the login route was often invisible to the very next
// request that tried to read it.
import { sql, ensureSchema } from "@/lib/pg";
import { StoredUser, getUserByEmail } from "@/lib/db";

export async function createSession(email: string): Promise<string> {
  await ensureSchema();
  const sessionId = crypto.randomUUID();
  await sql`INSERT INTO sessions (id, email) VALUES (${sessionId}, ${email.toLowerCase().trim()})`;
  return sessionId;
}

export async function destroySession(sessionId: string): Promise<void> {
  await ensureSchema();
  await sql`DELETE FROM sessions WHERE id = ${sessionId}`;
}

export async function getUserBySession(sessionId: string): Promise<StoredUser | null> {
  await ensureSchema();
  const rows = (await sql`SELECT email FROM sessions WHERE id = ${sessionId}`) as { email: string }[];
  if (!rows[0]) return null;
  return (await getUserByEmail(rows[0].email)) ?? null;
}
