import { City } from "@/lib/types";

export const CITIES: City[] = [
  { slug: "lucknow", label_hi: "लखनऊ" },
  { slug: "kanpur", label_hi: "कानपुर" },
  { slug: "patna", label_hi: "पटना" },
  { slug: "indore", label_hi: "इंदौर" },
  { slug: "jaipur", label_hi: "जयपुर" },
  { slug: "bhopal", label_hi: "भोपाल" },
  { slug: "varanasi", label_hi: "वाराणसी" },
  { slug: "ranchi", label_hi: "रांची" },
  { slug: "meerut", label_hi: "मेरठ" },
  { slug: "agra", label_hi: "आगरा" },
  { slug: "nagpur", label_hi: "नागपुर" },
  { slug: "guwahati", label_hi: "गुवाहाटी" },
  { slug: "raipur", label_hi: "रायपुर" },
  { slug: "dehradun", label_hi: "देहरादून" },
  { slug: "gorakhpur", label_hi: "गोरखपुर" },
];

export function cityLabel(slug: string | null): string | null {
  if (!slug) return null;
  return CITIES.find((c) => c.slug === slug)?.label_hi ?? slug;
}
