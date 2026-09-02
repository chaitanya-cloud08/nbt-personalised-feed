import { findPickerCity } from "@/lib/data/nbtSectionMap";

/** Resolves a chosen city slug to its Hindi display label, using NBT's
 * curated state/city data. Falls back to the slug itself if unresolved. */
export function cityLabel(slug: string | null): string | null {
  if (!slug) return null;
  return findPickerCity(slug)?.label_hi ?? slug;
}
