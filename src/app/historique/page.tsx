"use client";

import { useHistory } from "@/lib/storage";
import { getRecipeById } from "@/lib/suggestionEngine";

export default function HistoriquePage() {
  const history = useHistory();

  const cuisineCount = history.filter((h) => h.choice === "cuisine").length;
  const commandeCount = history.length - cuisineCount;

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-stone-800">Mon historique</h1>
        <p className="text-stone-500">
          {history.length === 0
            ? "Pas encore de repas enregistré."
            : `${cuisineCount} cuisinés, ${commandeCount} commandés.`}
        </p>
      </div>

      {history.length === 0 ? (
        <p className="text-stone-400">
          Choisis un plat depuis l&apos;accueil pour commencer ton historique.
        </p>
      ) : (
        <ul className="space-y-2">
          {history.map((entry, idx) => {
            const recipe = getRecipeById(entry.recipeId);
            if (!recipe) return null;
            return (
              <li
                key={`${entry.recipeId}-${entry.date}-${idx}`}
                className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm"
              >
                <span className="text-2xl">{recipe.emoji}</span>
                <div className="flex-1">
                  <p className="font-semibold text-stone-800">
                    {recipe.name}
                  </p>
                  <p className="text-sm text-stone-500">
                    {new Date(entry.date).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    entry.choice === "cuisine"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-sky-100 text-sky-700"
                  }`}
                >
                  {entry.choice === "cuisine" ? "Cuisiné" : "Commandé"}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
