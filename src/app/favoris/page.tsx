"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  getFavoriteOrderRecipes,
  getOrderSearchUrl,
} from "@/lib/suggestionEngine";
import { addHistoryEntry } from "@/lib/storage";
import { Recipe } from "@/lib/types";
import DishPhoto from "@/components/DishPhoto";

function FavoriteCard({ recipe, index }: { recipe: Recipe; index: number }) {
  const orderUrl = getOrderSearchUrl(recipe);

  function handleOrderNow() {
    addHistoryEntry({
      recipeId: recipe.id,
      date: new Date().toISOString(),
      choice: "commande",
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.3) }}
      className="flex items-center gap-3 overflow-hidden rounded-2xl bg-white p-3 shadow-sm"
    >
      <Link
        href={`/repas/${recipe.id}`}
        className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br ${recipe.gradient}`}
      >
        <DishPhoto recipe={recipe} emojiClassName="text-3xl" />
      </Link>

      <Link href={`/repas/${recipe.id}`} className="min-w-0 flex-1">
        <p className="truncate font-semibold text-stone-800">{recipe.name}</p>
        <p className="text-sm text-stone-500">
          {recipe.cuisine} · {recipe.orderBudget} €
        </p>
      </Link>

      <motion.a
        whileTap={{ scale: 0.95 }}
        href={orderUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleOrderNow}
        className="shrink-0 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-2 text-sm font-bold text-white shadow-md transition hover:opacity-90"
      >
        Commander 🛵
      </motion.a>
    </motion.div>
  );
}

export default function FavorisPage() {
  const favorites = getFavoriteOrderRecipes();

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-stone-800">
          Mes favoris à commander
        </h1>
        <p className="text-stone-500">
          Tes plats préférés, à une commande de distance — sans passer par le
          swipe.
        </p>
      </div>

      {favorites.length === 0 ? (
        <p className="text-stone-400">Pas encore de favori enregistré.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {favorites.map((recipe, idx) => (
            <FavoriteCard key={recipe.id} recipe={recipe} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
