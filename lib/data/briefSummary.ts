// Turns the audio brief's top headlines into a single flowing, spoken-style
// Hindi paragraph via Groq, instead of the browser just reading a mechanical
// "headline 1, headline 2, ..." list. The browser's own free
// speechSynthesis still does the actual text-to-speech (see
// components/widgets/BriefWidget.tsx) — this only replaces what text it
// reads, so there's no per-play audio-generation cost, just one cheap Groq
// text completion per brief.
import { getGroqClient, GROQ_MODEL } from "@/lib/groq";

export interface BriefSummaryResult {
  summary?: string;
  error?: string;
}

export async function summarizeHeadlinesForBrief(headlines: string[], cityLabel: string | null): Promise<BriefSummaryResult> {
  const groq = getGroqClient();
  if (!groq) return { error: "GROQ_API_KEY is not set in this deployment's environment." };
  if (headlines.length === 0) return { error: "No headlines to summarize." };

  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: "system",
          content:
            "आप एक हिंदी समाचार वाचक हैं। दी गई सुर्खियों को जोड़कर एक सहज, बोलने-लायक सारांश लिखें — जैसे रेडियो पर पढ़ा जाए, 3-5 वाक्यों में। सिर्फ सारांश लिखें, कोई शीर्षक, नंबरिंग या अतिरिक्त टिप्पणी नहीं।",
        },
        {
          role: "user",
          content: `${cityLabel ? `शहर: ${cityLabel}\n` : ""}आज की मुख्य सुर्खियां:\n${headlines
            .map((h, i) => `${i + 1}. ${h}`)
            .join("\n")}`,
        },
      ],
      temperature: 0.6,
    });

    const summary = completion.choices[0]?.message?.content?.trim();
    if (!summary) return { error: "Groq returned an empty response." };
    return { summary };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Failed to summarize headlines for audio brief:", err);
    return { error: message };
  }
}
