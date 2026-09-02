import { Section } from "@/lib/types";

export const SECTIONS: Section[] = [
  { slug: "business", label_hi: "बिजनेस" },
  { slug: "entertainment", label_hi: "मनोरंजन" },
  { slug: "cricket", label_hi: "क्रिकेट" },
  { slug: "lifestyle", label_hi: "लाइफस्टाइल" },
  { slug: "india", label_hi: "भारत" },
  { slug: "world", label_hi: "दुनिया" },
];

export function sectionLabel(slug: string): string {
  return SECTIONS.find((s) => s.slug === slug)?.label_hi ?? slug;
}
