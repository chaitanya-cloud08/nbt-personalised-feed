// Shared Groq client — lazily constructed so a missing GROQ_API_KEY doesn't
// throw at module load (Next.js evaluates route modules during `next
// build`'s page-data collection, so an eager throw here would fail the
// production build itself; see lib/pg.ts for the same lazy pattern).
import Groq from "groq-sdk";

// llama-3.3-70b-versatile was deprecated by Groq; this is their current
// recommended general-purpose/reasoning model.
export const GROQ_MODEL = "openai/gpt-oss-120b";

let client: Groq | null = null;

export function getGroqClient(): Groq | null {
  if (!process.env.GROQ_API_KEY) return null;
  if (!client) client = new Groq();
  return client;
}
