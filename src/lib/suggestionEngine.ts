import { recipes } from "./recipes";
import { HistoryEntry, Mood, Recipe, UserProfile } from "./types";

function normalize(name: string) {
  return name.trim().toLowerCase();
}

export function missingIngredients(recipe: Recipe, pantry: string[]) {
  const owned = new Set(pantry.map(normalize));
  return recipe.ingredients.filter((i) => !owned.has(normalize(i.name)));
}

function matchesProfile(recipe: Recipe, profile: UserProfile) {
  const hasAllergen = recipe.allergens.some((a) =>
    profile.allergies.includes(a),
  );
  if (hasAllergen) return false;

  const missingDiet = profile.diets.some((d) => !recipe.diets.includes(d));
  if (missingDiet) return false;

  return true;
}

export function getSuggestions(
  moods: Mood[],
  profile: UserProfile,
  pantry: string[],
  history: HistoryEntry[],
  count = 6,
): Recipe[] {
  const recentIds = history.slice(0, 5).map((h) => h.recipeId);
  const olderIds = history.slice(5, 10).map((h) => h.recipeId);

  const scored = recipes
    .filter((r) => matchesProfile(r, profile))
    .map((recipe) => {
      let score = 0;

      const moodOverlap = recipe.moods.filter((m) => moods.includes(m)).length;
      score += moodOverlap * 4;

      const missing = missingIngredients(recipe, pantry);
      const ownedRatio =
        (recipe.ingredients.length - missing.length) /
        recipe.ingredients.length;
      score += ownedRatio * 5;

      if (recentIds.includes(recipe.id)) score -= 8;
      else if (olderIds.includes(recipe.id)) score -= 3;

      if (profile.calorieGoal) {
        const target = profile.calorieGoal / 3;
        const diff = Math.abs(recipe.calories - target);
        score += Math.max(0, 2 - diff / 200);
      }

      score += Math.random() * 0.5;

      return { recipe, score };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, count).map((s) => s.recipe);
}

export function getRecipeById(id: string): Recipe | undefined {
  return recipes.find((r) => r.id === id);
}

export function getFavoriteOrderRecipes(): Recipe[] {
  return recipes.filter((r) => r.favoriteOrder);
}

export function getOrderSearchUrl(recipe: Recipe): string {
  return `https://www.google.com/search?q=${encodeURIComponent(
    `${recipe.name} livraison`,
  )}`;
}
