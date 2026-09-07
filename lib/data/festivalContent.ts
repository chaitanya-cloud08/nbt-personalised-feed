// AI-generated festival detail content — summary, significance, tips, and an
// inspirational note, shown on the /festival/[tag] page a widget click leads
// to. Generated once per festival via Groq and cached in Postgres (see
// lib/pg.ts), since the content doesn't change between visitors or visits.
import Groq from "groq-sdk";
import { z } from "zod";
import { sql, ensureSchema } from "@/lib/pg";

const GROQ_MODEL = "llama-3.3-70b-versatile";

const FestivalContentSchema = z.object({
  summary_hi: z
    .string()
    .describe("A warm, 2-3 sentence summary of what this festival is and why people celebrate it, in Hindi"),
  significance_hi: z
    .string()
    .describe("A short paragraph (3-5 sentences) on the festival's history, mythology, or cultural significance, in Hindi"),
  tips_hi: z
    .array(z.string())
    .min(3)
    .max(6)
    .describe(
      "3-6 short, practical, one-sentence tips for celebrating this festival well — rituals, food, family activities, or safety — in Hindi"
    ),
  inspiration_hi: z
    .string()
    .describe("A short, uplifting one-paragraph inspirational message tied to the festival's themes, in Hindi"),
});

export type FestivalContent = z.infer<typeof FestivalContentSchema>;

// Groq's Structured Outputs JSON schema — hand-written to mirror
// FestivalContentSchema above; the Zod schema is what actually validates the
// parsed response (defense in depth against the model not honoring it).
const FESTIVAL_CONTENT_JSON_SCHEMA = {
  type: "object",
  properties: {
    summary_hi: { type: "string" },
    significance_hi: { type: "string" },
    tips_hi: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 6 },
    inspiration_hi: { type: "string" },
  },
  required: ["summary_hi", "significance_hi", "tips_hi", "inspiration_hi"],
  additionalProperties: false,
};

export interface FestivalContentResult {
  content: FestivalContent | null;
  // Surfaced directly on the page (not just server logs) so a deployment-
  // environment issue — a missing key, a retired model, a schema mismatch —
  // is visible without pulling platform logs. See app/api/auth/login for
  // the same pattern applied to a different silent-500 problem.
  error?: string;
}

let client: Groq | null = null;

function getClient(): Groq | null {
  if (!process.env.GROQ_API_KEY) return null;
  if (!client) client = new Groq();
  return client;
}

async function generateFestivalContent(nameHi: string, dateISO: string): Promise<FestivalContentResult> {
  const groq = getClient();
  if (!groq) return { content: null, error: "GROQ_API_KEY is not set in this deployment's environment." };

  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: "system",
          content:
            "आप भारतीय त्योहारों, उनके इतिहास और परंपराओं के विशेषज्ञ हैं। हमेशा स्पष्ट, गर्मजोशी भरी और सटीक हिंदी में जवाब दें।",
        },
        {
          role: "user",
          content: `त्योहार: ${nameHi}\nतारीख: ${dateISO}\n\nइस त्योहार के बारे में जानकारी दीजिए।`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: { name: "festival_content", schema: FESTIVAL_CONTENT_JSON_SCHEMA, strict: true },
      },
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) return { content: null, error: "Groq returned an empty response." };

    const parsed = FestivalContentSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      return { content: null, error: `Response failed schema validation: ${parsed.error.message}` };
    }
    return { content: parsed.data };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Failed to generate AI content for festival "${nameHi}":`, err);
    return { content: null, error: message };
  }
}

interface FestivalContentRow {
  content: FestivalContent;
}

/** Cached in Postgres, keyed by tag — generated once, reused by every later visitor. */
export async function getFestivalContent(tag: string, nameHi: string, dateISO: string): Promise<FestivalContentResult> {
  await ensureSchema();

  const rows = (await sql`SELECT content FROM festival_content WHERE tag = ${tag}`) as FestivalContentRow[];
  if (rows[0]) return { content: rows[0].content };

  const result = await generateFestivalContent(nameHi, dateISO);
  if (!result.content) return result;

  await sql`
    INSERT INTO festival_content (tag, content) VALUES (${tag}, ${JSON.stringify(result.content)}::jsonb)
    ON CONFLICT (tag) DO UPDATE SET content = EXCLUDED.content
  `;
  return result;
}
