import { Recipe } from "./types";

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Stable (non-random) stock photo for a dish, keyed by its keywords. */
function getStockPhotoUrl(recipe: Recipe, width: number, height: number) {
  // LoremFlickr expects comma-separated single-word tags — a literal space
  // (even URL-encoded) inside a tag makes the upstream Flickr query fail.
  const tags = recipe.photoKeywords
    .flatMap((keyword) => keyword.trim().split(/\s+/))
    .filter(Boolean)
    .map(encodeURIComponent)
    .join(",");
  const lock = hashString(recipe.id) % 100000;
  return `https://loremflickr.com/${width}/${height}/${tags}?lock=${lock}`;
}

export function getRecipePhotoUrl(
  recipe: Recipe,
  customUrl?: string | null,
  width = 640,
  height = 480,
): string {
  if (customUrl && customUrl.trim()) return customUrl.trim();
  return getStockPhotoUrl(recipe, width, height);
}
