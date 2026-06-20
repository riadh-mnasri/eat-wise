import { Recipe } from "@/lib/types";
import { missingIngredients } from "@/lib/suggestionEngine";

const moodLabels: Record<string, { label: string; emoji: string }> = {
  reconfort: { label: "Réconfort", emoji: "🤗" },
  leger: { label: "Léger", emoji: "🥗" },
  sucre: { label: "Sucré", emoji: "🍰" },
  sale: { label: "Salé", emoji: "🧀" },
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
  const ownedRatio = owned / recipe.ingredients.length;

  return (
    <div className="flex h-full select-none flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_20px_45px_-15px_rgba(120,53,15,0.35)]">
      <div
        className={`relative flex h-56 shrink-0 items-center justify-center bg-gradient-to-br ${recipe.gradient}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
        <span className="float-slow text-[5.5rem] drop-shadow-[0_8px_16px_rgba(0,0,0,0.25)]">
          {recipe.emoji}
        </span>
        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/85 px-3 py-1 text-xs font-bold text-stone-700 shadow-sm backdrop-blur">
          {Math.round(ownedRatio * 100)}%{" "}
          <span className="font-medium text-stone-400">au frigo</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-xl font-bold text-stone-800">{recipe.name}</h3>
        <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
          {recipe.moods.map((m) => (
            <span
              key={m}
              className="rounded-full bg-orange-100 px-2.5 py-1 text-orange-700"
            >
              {moodLabels[m].emoji} {moodLabels[m].label}
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

        <div className="mt-auto space-y-1.5">
          <div className="flex justify-between text-xs font-medium text-stone-500">
            <span>Ingrédients déjà chez toi</span>
            <span>
              {owned}/{recipe.ingredients.length}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-lime-500 transition-[width] duration-500"
              style={{ width: `${ownedRatio * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
