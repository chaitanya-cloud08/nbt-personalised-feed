import { Rashi } from "@/lib/types";

export const RASHIS: Rashi[] = [
  { slug: "mesh", label_hi: "मेष" },
  { slug: "vrishabh", label_hi: "वृषभ" },
  { slug: "mithun", label_hi: "मिथुन" },
  { slug: "kark", label_hi: "कर्क" },
  { slug: "singh", label_hi: "सिंह" },
  { slug: "kanya", label_hi: "कन्या" },
  { slug: "tula", label_hi: "तुला" },
  { slug: "vrishchik", label_hi: "वृश्चिक" },
  { slug: "dhanu", label_hi: "धनु" },
  { slug: "makar", label_hi: "मकर" },
  { slug: "kumbh", label_hi: "कुंभ" },
  { slug: "meen", label_hi: "मीन" },
];

export function rashiLabel(slug: string | null): string | null {
  if (!slug) return null;
  return RASHIS.find((r) => r.slug === slug)?.label_hi ?? slug;
}
