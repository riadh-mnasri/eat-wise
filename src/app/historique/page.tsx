"use client";

import { motion } from "framer-motion";
import { useHistory } from "@/lib/storage";
import { getRecipeById } from "@/lib/suggestionEngine";

function computeStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const days = new Set(dates.map((d) => new Date(d).toDateString()));
  let streak = 0;
  const cursor = new Date();
  while (days.has(cursor.toDateString())) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export default function HistoriquePage() {
  const history = useHistory();

  const cuisineCount = history.filter((h) => h.choice === "cuisine").length;
  const commandeCount = history.length - cuisineCount;
  const streak = computeStreak(history.map((h) => h.date));

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-stone-800">Mon historique</h1>
        <p className="text-stone-500">
          {history.length === 0
            ? "Pas encore de repas enregistré."
            : "Ce que tu as cuisiné ou commandé récemment."}
        </p>
      </div>

      {history.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-3"
        >
          <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-stone-800">
              {history.length}
            </p>
            <p className="text-xs font-medium text-stone-500">repas suivis</p>
          </div>
          <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-orange-600">
              {cuisineCount}
              <span className="text-sm text-stone-400">/{commandeCount}</span>
            </p>
            <p className="text-xs font-medium text-stone-500">
              cuisinés / commandés
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-stone-800">🔥 {streak}</p>
            <p className="text-xs font-medium text-stone-500">
              jour{streak > 1 ? "s" : ""} de suite
            </p>
          </div>
        </motion.div>
      )}

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
              <motion.li
                key={`${entry.recipeId}-${entry.date}-${idx}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(idx * 0.04, 0.4) }}
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
              </motion.li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
