"use client";

import { useEffect, useRef, useState } from "react";
import { strings, BriefTimeOfDay } from "@/lib/strings.hi";

// Morning/evening audio brief — reads the day's top headlines aloud using
// the browser's built-in Web Speech Synthesis API (window.speechSynthesis).
// Entirely client-side: no TTS backend, no API key, no per-use cost. Feature
// detection follows the pattern from Chrome's own speech-synthesis guide
// (https://developer.chrome.com/blog/web-apps-that-talk-introduction-to-the-speech-synthesis-api#feature_detection) —
// check `"speechSynthesis" in window` before touching the API at all, since
// it's absent on some browsers/embedded webviews.
type PlaybackState = "idle" | "speaking" | "paused" | "unsupported";

/** Splits the brief into one utterance per line — short utterances avoid a
 * known Chrome bug where a single long utterance can silently cut off
 * partway through instead of finishing. */
function buildScript(headlines: string[], cityLabel: string | null, greeting: string): string[] {
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

  function play() {
    if (state === "unsupported") return;
    window.speechSynthesis.cancel();

    const voice = pickHindiVoice(voicesRef.current.length ? voicesRef.current : window.speechSynthesis.getVoices());
    const script = buildScript(headlines, cityLabel, copy.greeting);
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

  return (
    <div className="mx-4 rounded-xl bg-brief-bg border border-brief-accent/20 p-4 flex items-center gap-4">
      <button
        onClick={state === "speaking" ? pause : state === "paused" ? resume : play}
        aria-label={state === "speaking" ? s.pause : state === "paused" ? s.resume : s.play}
        className="shrink-0 w-14 h-14 rounded-full bg-brief-accent text-white flex items-center justify-center shadow-sm"
      >
        <span className="material-symbols-outlined text-[28px]" aria-hidden="true">
          {state === "speaking" ? "pause" : "play_arrow"}
        </span>
      </button>
      <div className="flex-1 min-w-0">
        <h3 className="font-headline text-on-surface font-bold">{copy.title}</h3>
        <p className="text-on-surface-variant text-sm">{state === "speaking" ? s.playing : s.subtitle}</p>
      </div>
      {state !== "idle" && (
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
