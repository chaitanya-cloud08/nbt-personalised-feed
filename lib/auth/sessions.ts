// In-memory session store — deliberately NOT persisted to disk. Losing
// sessions on a server restart just means logging back in; it doesn't lose
// any account data, which lives in lib/db.ts's persisted store.
import { StoredUser, getUserByEmail } from "@/lib/db";

const globalForSessions = globalThis as unknown as { __nbtSessions?: Map<string, string> };
const sessions = globalForSessions.__nbtSessions ?? new Map<string, string>(); // sessionId -> email
globalForSessions.__nbtSessions = sessions;

export function createSession(email: string): string {
  const sessionId = crypto.randomUUID();
  sessions.set(sessionId, email);
  return sessionId;
}

export function destroySession(sessionId: string): void {
  sessions.delete(sessionId);
}

export function getUserBySession(sessionId: string): StoredUser | null {
  const email = sessions.get(sessionId);
  if (!email) return null;
  return getUserByEmail(email) ?? null;
}
