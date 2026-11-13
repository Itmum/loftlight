import {
  HouseIllustration,
  MicIllustration,
  RoomIllustration,
} from "@/components/hero-illustrations";

/**
 * Geometric fallback artwork shown when a studio has no photo, keyed by
 * category so each kind of space gets a fitting illustration. Fills its
 * parent, which must be `relative` and `overflow-hidden`.
 */
export function StudioFallbackArtwork({ category }: { category: string }) {
  const c = category.toLowerCase();

  if (/podcast|music|mic/.test(c)) return <MicIllustration />;
  if (/photo|art/.test(c)) return <RoomIllustration />;
  return <HouseIllustration />;
}
