import { cookies } from "next/headers";

export const USER_COOKIE = "nbt_uid";

/** Reads the simulated-logged-in user's id. Middleware guarantees this cookie exists. */
export async function getUserId(): Promise<string> {
  const store = await cookies();
  const id = store.get(USER_COOKIE)?.value;
  if (!id) {
    // Should not happen once middleware.ts has run, but fall back safely.
    return "anonymous";
  }
  return id;
}
