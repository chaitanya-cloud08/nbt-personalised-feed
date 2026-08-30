import { Section } from "@/lib/types";

export const SECTIONS: Section[] = [
  { slug: "sarkari-naukri", label_hi: "सरकारी नौकरी" },
  { slug: "cricket", label_hi: "क्रिकेट" },
  { slug: "bollywood", label_hi: "बॉलीवुड" },
  { slug: "dharm-tyohar", label_hi: "धर्म/त्योहार" },
  { slug: "rajniti", label_hi: "राजनीति" },
];

export function sectionLabel(slug: string): string {
  return SECTIONS.find((s) => s.slug === slug)?.label_hi ?? slug;
}
