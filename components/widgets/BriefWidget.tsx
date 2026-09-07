"use client";

import { useEffect, useRef, useState } from "react";
import { strings, BriefTimeOfDay } from "@/lib/strings.hi";

// Morning/evening audio brief — reads the day's top headlines aloud using
// the browser's built-in Web Speech Synthesis API (window.speechSynthesis).
// The spoken text itself is a flowing summary written by Groq (see
// lib/data/briefSummary.ts + app/api/brief), not a mechanical headline
// list — but the actual text-to-speech stays entirely client-side and free:
// no TTS backend, no per-play audio-generation cost, just one cheap Groq
// text completion. Feature detection follows the pattern from Chrome's own
// speech-synthesis guide
// (https://developer.chrome.com/blog/web-apps-that-talk-introduction-to-the-speech-synthesis-api#feature_detection) —
// check `"speechSynthesis" in window` before touching the API at all, since
// it's absent on some browsers/embedded webviews.
type PlaybackState = "idle" | "loading" | "speaking" | "paused" | "unsupported";

/** Splits text into sentence-sized chunks for one utterance each — short
 * utterances avoid a known Chrome bug where a single long utterance can
 * silently cut off partway through instead of finishing. */
function splitIntoSentences(text: string): string[] {
  return text
    .split(/(?<=[।.!?])\s+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Fallback script (mechanical headline list) used only if the Groq summary
 * couldn't be fetched — still fully functional, just less natural-sounding. */
function buildFallbackScript(headlines: string[], cityLabel: string | null, greeting: string): string[] {
  const s = strings.widgets.brief;
  const intro = `${greeting}। ${cityLabel ? s.introWithCity(cityLabel) : s.introWithoutCity}`;
  const lines = headlines.map((headline, i) => `${s.headlineNumber(i + 1)} ${headline}`);
  return [intro, ...lines, s.outro];
}

function pickHindiVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  return voices.find((v) => v.lang.toLowerCase().startsWith("hi")) ?? voices.find((v) => v.lang.toLowerCase().startsWith("en"));
}

export default function BriefWidget({
  cityLabel,
  headlines,
  copy,
}: {
  cityLabel: string | null;
  headlines: string[];
  copy: BriefTimeOfDay;
}) {
  const [state, setState] = useState<PlaybackState>("idle");
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  // Cached after the first fetch so replaying doesn't re-call Groq.
  const summaryRef = useRef<string | null>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      // Browser support can only be known client-side, after mount — there
      // is no external-system subscription to attach here instead, so this
      // is a legitimate one-time setState-in-effect, not a synchronization
      // that belongs in the render body.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState("unsupported");
      return;
    }

    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    loadVoices();
    // Chrome loads voices asynchronously — the first getVoices() call can
    // return an empty list, filled in later via this event.
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      window.speechSynthesis.cancel();
    };
  }, []);

  function speakScript(script: string[]) {
    const voice = pickHindiVoice(voicesRef.current.length ? voicesRef.current : window.speechSynthesis.getVoices());
    const utterances = script.map((text) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "hi-IN";
      utterance.rate = 0.95;
      if (voice) utterance.voice = voice;
      return utterance;
    });
    utterances[utterances.length - 1].onend = () => setState("idle");
    utterances.forEach((utterance) => window.speechSynthesis.speak(utterance));
    setState("speaking");
  }

  async function play() {
    if (state === "unsupported" || state === "loading") return;
    window.speechSynthesis.cancel();

    if (fetchedRef.current) {
      speakFromSummaryOrFallback();
      return;
    }

    setState("loading");
    fetchedRef.current = true;
    try {
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headlines, cityLabel }),
      });
      const data = await res.json().catch(() => null);
      summaryRef.current = typeof data?.summary_hi === "string" ? data.summary_hi : null;
    } catch {
      summaryRef.current = null;
    }
    speakFromSummaryOrFallback();
  }

  function speakFromSummaryOrFallback() {
    const intro = `${copy.greeting}। ${cityLabel ? strings.widgets.brief.introWithCity(cityLabel) : strings.widgets.brief.introWithoutCity}`;
    const script = summaryRef.current
      ? [intro, ...splitIntoSentences(summaryRef.current), strings.widgets.brief.outro]
      : buildFallbackScript(headlines, cityLabel, copy.greeting);
    speakScript(script);
  }

  function pause() {
    window.speechSynthesis.pause();
    setState("paused");
  }

  function resume() {
    window.speechSynthesis.resume();
    setState("speaking");
  }

  function stop() {
    window.speechSynthesis.cancel();
    setState("idle");
  }

  if (state === "unsupported" || headlines.length === 0) return null;

  const s = strings.widgets.brief;
  const statusText = state === "loading" ? s.loading : state === "speaking" ? s.playing : s.subtitle;

  return (
    <div className="mx-4 rounded-xl bg-brief-bg border border-brief-accent/20 p-4 flex items-center gap-4">
      <button
        onClick={state === "speaking" ? pause : state === "paused" ? resume : play}
        disabled={state === "loading"}
        aria-label={state === "speaking" ? s.pause : state === "paused" ? s.resume : s.play}
        className="shrink-0 w-14 h-14 rounded-full bg-brief-accent text-white flex items-center justify-center shadow-sm disabled:opacity-60"
      >
        <span className="material-symbols-outlined text-[28px]" aria-hidden="true">
          {state === "speaking" ? "pause" : "play_arrow"}
        </span>
      </button>
      <div className="flex-1 min-w-0">
        <h3 className="font-headline text-on-surface font-bold">{copy.title}</h3>
        <p className="text-on-surface-variant text-sm">{statusText}</p>
      </div>
      {state !== "idle" && state !== "loading" && (
        <button
          onClick={stop}
          aria-label={s.stop}
          className="shrink-0 text-brief-accent p-2 rounded-full hover:bg-brief-accent/10"
        >
          <span className="material-symbols-outlined" aria-hidden="true">stop</span>
        </button>
      )}
    </div>
  );
}
