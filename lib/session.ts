import { cookies } from "next/headers";
import { getUserBySession } from "@/lib/auth/sessions";
import { StoredUser } from "@/lib/db";

export const SESSION_COOKIE = "nbt_session";

/** The logged-in user for this request, or null if not authenticated. */
export async function getCurrentUser(): Promise<StoredUser | null> {
  const store = await cookies();
  const sessionId = store.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;
  return getUserBySession(sessionId);
}
