"use client";

import { useState } from "react";
import Link from "next/link";
import { missingIngredients } from "@/lib/suggestionEngine";
import { addHistoryEntry, usePantry } from "@/lib/storage";
import { MealChoice, Recipe } from "@/lib/types";

function normalize(name: string) {
  return name.trim().toLowerCase();
}

export default function RecipeDetail({ recipe }: { recipe: Recipe }) {
  const [pantry, setPantry] = usePantry();
  const [choice, setChoice] = useState<MealChoice | null>(null);

  const missing = missingIngredients(recipe, pantry);
  const orderUrl = `https://www.google.com/search?q=${encodeURIComponent(
    `${recipe.name} livraison`,
  )}`;

  function handleChoice(value: MealChoice) {
    addHistoryEntry({
      recipeId: recipe.id,
      date: new Date().toISOString(),
      choice: value,
    });

    if (value === "cuisine") {
      const recipeIngredientNames = new Set(
        recipe.ingredients.map((i) => normalize(i.name)),
      );
      setPantry(
        pantry.filter((item) => !recipeIngredientNames.has(normalize(item))),
      );
    }

    setChoice(value);
  }

  if (choice) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <p className="text-4xl">{choice === "cuisine" ? "👨‍🍳" : "🛵"}</p>
        <h1 className="text-xl font-bold text-stone-800">
          {choice === "cuisine"
            ? "Bon appétit, régale-toi !"
            : "Commande envoyée, à toi de valider sur l'appli !"}
        </h1>
        <div className="flex gap-3">
          <Link
            href="/"
            className="rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-2.5 font-semibold text-white shadow-md"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/historique"
            className="rounded-full border-2 border-stone-300 px-5 py-2.5 font-semibold text-stone-600"
          >
            Mon historique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div
        className={`flex h-44 items-center justify-center rounded-3xl bg-gradient-to-br ${recipe.gradient} text-8xl shadow-lg`}
      >
        {recipe.emoji}
      </div>

      <div>
        <h1 className="text-2xl font-bold text-stone-800">{recipe.name}</h1>
        <p className="text-stone-500">{recipe.cuisine}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-sm text-stone-500">👨‍🍳 Cuisiner</p>
          <p className="text-lg font-bold text-stone-800">
            {recipe.timeMinutes} min · {recipe.cookBudget} €
          </p>
          <p className="text-sm text-stone-500">{recipe.calories} kcal</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-sm text-stone-500">🛵 Commander</p>
          <p className="text-lg font-bold text-stone-800">
            ~35 min · {recipe.orderBudget} €
          </p>
          <p className="text-sm text-stone-500">Livré chez toi</p>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="font-semibold text-stone-700">
          Liste de courses ({missing.length} à acheter)
        </h2>
        {missing.length === 0 ? (
          <p className="text-stone-500">
            Tu as déjà tous les ingrédients, parfait !
          </p>
        ) : (
          <ul className="space-y-1">
            {missing.map((i) => (
              <li
                key={i.name}
                className="flex justify-between rounded-xl bg-white px-3 py-2 text-stone-700 shadow-sm"
              >
                <span>{i.name}</span>
                <span className="text-stone-400">{i.quantity}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-4">
        <button
          onClick={() => handleChoice("cuisine")}
          className="rounded-full bg-gradient-to-r from-orange-500 to-rose-500 py-3.5 font-bold text-white shadow-md transition hover:opacity-90"
        >
          Je cuisine ce plat
        </button>
        <a
          href={orderUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleChoice("commande")}
          className="rounded-full border-2 border-stone-300 py-3.5 text-center font-bold text-stone-600 transition hover:bg-stone-100"
        >
          Je commande à la place
        </a>
      </div>
    </div>
  );
}
