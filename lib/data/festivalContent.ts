// AI-generated festival detail content — summary, significance, tips, and an
// inspirational note, shown on the /festival/[tag] page a widget click leads
// to. Generated once per festival via Claude and cached in Postgres (see
// lib/pg.ts), since the content doesn't change between visitors or visits.
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { sql, ensureSchema } from "@/lib/pg";

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

let client: Anthropic | null = null;

function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!client) client = new Anthropic();
  return client;
}

/** Returns null when ANTHROPIC_API_KEY isn't configured, or on any API failure — the page falls back to just the calendar facts in that case. */
async function generateFestivalContent(nameHi: string, dateISO: string): Promise<FestivalContent | null> {
  const anthropic = getClient();
  if (!anthropic) return null;

  try {
    const response = await anthropic.messages.parse({
      model: "claude-opus-5",
      max_tokens: 2048,
      system:
        "आप भारतीय त्योहारों, उनके इतिहास और परंपराओं के विशेषज्ञ हैं। हमेशा स्पष्ट, गर्मजोशी भरी और सटीक हिंदी में जवाब दें।",
      messages: [
        {
          role: "user",
          content: `त्योहार: ${nameHi}\nतारीख: ${dateISO}\n\nइस त्योहार के बारे में जानकारी दीजिए।`,
        },
      ],
      output_config: { format: zodOutputFormat(FestivalContentSchema) },
    });
    return response.parsed_output;
  } catch (err) {
    console.error(`Failed to generate AI content for festival "${nameHi}":`, err);
    return null;
  }
}

interface FestivalContentRow {
  content: FestivalContent;
}

/** Cached in Postgres, keyed by tag — generated once, reused by every later visitor. */
export async function getFestivalContent(tag: string, nameHi: string, dateISO: string): Promise<FestivalContent | null> {
  await ensureSchema();

  const rows = (await sql`SELECT content FROM festival_content WHERE tag = ${tag}`) as FestivalContentRow[];
  if (rows[0]) return rows[0].content;

  const generated = await generateFestivalContent(nameHi, dateISO);
  if (!generated) return null;

  await sql`
    INSERT INTO festival_content (tag, content) VALUES (${tag}, ${JSON.stringify(generated)}::jsonb)
    ON CONFLICT (tag) DO UPDATE SET content = EXCLUDED.content
  `;
  return generated;
}
