import { Recipe } from "@/lib/types";
import { missingIngredients } from "@/lib/suggestionEngine";

const moodLabels: Record<string, string> = {
  reconfort: "Réconfort",
  leger: "Léger",
  sucre: "Sucré",
  sale: "Salé",
};

export default function RecipeCard({
  recipe,
  pantry,
}: {
  recipe: Recipe;
  pantry: string[];
}) {
  const missing = missingIngredients(recipe, pantry);
  const owned = recipe.ingredients.length - missing.length;

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
      <div
        className={`flex h-40 items-center justify-center bg-gradient-to-br ${recipe.gradient} text-7xl`}
      >
        {recipe.emoji}
      </div>
      <div className="space-y-3 p-5">
        <h3 className="text-xl font-bold text-stone-800">{recipe.name}</h3>
        <div className="flex flex-wrap gap-1.5 text-xs font-medium">
          {recipe.moods.map((m) => (
            <span
              key={m}
              className="rounded-full bg-orange-100 px-2.5 py-1 text-orange-700"
            >
              {moodLabels[m]}
            </span>
          ))}
          <span className="rounded-full bg-stone-100 px-2.5 py-1 text-stone-600">
            ⏱ {recipe.timeMinutes} min
          </span>
          <span className="rounded-full bg-stone-100 px-2.5 py-1 text-stone-600">
            🔥 {recipe.calories} kcal
          </span>
          <span className="rounded-full bg-stone-100 px-2.5 py-1 text-stone-600">
            {recipe.cuisine}
          </span>
        </div>
        <p className="text-sm text-stone-500">
          {owned}/{recipe.ingredients.length} ingrédients déjà dans ton stock
        </p>
      </div>
    </div>
  );
}
