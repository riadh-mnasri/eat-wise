"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getOrderSearchUrl, missingIngredients } from "@/lib/suggestionEngine";
import { addHistoryEntry, useCustomPhoto, usePantry } from "@/lib/storage";
import { MealChoice, Recipe } from "@/lib/types";
import DishPhoto from "./DishPhoto";

function normalize(name: string) {
  return name.trim().toLowerCase();
}

const BURST_EMOJIS = ["✨", "🎉", "😋", "👏", "🔥", "💛"];

function CelebrationBurst() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {BURST_EMOJIS.map((emoji, i) => {
        const angle = (i / BURST_EMOJIS.length) * Math.PI * 2;
        const distance = 100;
        return (
          <motion.span
            key={emoji}
            className="absolute text-2xl"
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }}
            animate={{
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
              opacity: 0,
              scale: 1,
            }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            {emoji}
          </motion.span>
        );
      })}
    </div>
  );
}

export default function RecipeDetail({ recipe }: { recipe: Recipe }) {
  const [pantry, setPantry] = usePantry();
  const [choice, setChoice] = useState<MealChoice | null>(null);
  const [customPhoto, setCustomPhoto] = useCustomPhoto(recipe.id);
  const [editingPhoto, setEditingPhoto] = useState(false);
  const [photoInput, setPhotoInput] = useState(customPhoto ?? "");

  const missing = missingIngredients(recipe, pantry);
  const orderUrl = getOrderSearchUrl(recipe);

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
      <div className="relative flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <CelebrationBurst />
        <motion.p
          className="text-5xl"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.25, 1] }}
          transition={{ duration: 0.5 }}
        >
          {choice === "cuisine" ? "👨‍🍳" : "🛵"}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-xl font-bold text-stone-800"
        >
          {choice === "cuisine"
            ? "Bon appétit, régale-toi !"
            : "Commande envoyée, à toi de valider sur l'appli !"}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-3"
        >
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
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-1 flex-col gap-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.06 } },
      }}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 12 },
          visible: { opacity: 1, y: 0 },
        }}
        className={`relative h-44 overflow-hidden rounded-3xl bg-gradient-to-br ${recipe.gradient} shadow-lg`}
      >
        <DishPhoto recipe={recipe} emojiClassName="text-8xl" />
        <button
          onClick={() => {
            setPhotoInput(customPhoto ?? "");
            setEditingPhoto((v) => !v);
          }}
          aria-label="Changer la photo"
          className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-sm shadow-sm backdrop-blur transition hover:bg-white"
        >
          ✏️
        </button>
      </motion.div>

      {editingPhoto && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex gap-2"
        >
          <input
            value={photoInput}
            onChange={(e) => setPhotoInput(e.target.value)}
            placeholder="Coller l'URL d'une photo..."
            className="flex-1 rounded-full border-2 border-stone-200 px-4 py-2 text-sm outline-none focus:border-orange-400"
          />
          <button
            onClick={() => {
              setCustomPhoto(photoInput || null);
              setEditingPhoto(false);
            }}
            className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white"
          >
            Enregistrer
          </button>
          {customPhoto && (
            <button
              onClick={() => {
                setCustomPhoto(null);
                setPhotoInput("");
                setEditingPhoto(false);
              }}
              className="rounded-full border-2 border-stone-300 px-4 py-2 text-sm font-semibold text-stone-600"
            >
              Réinitialiser
            </button>
          )}
        </motion.div>
      )}

      <motion.div
        variants={{
          hidden: { opacity: 0, y: 12 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <h1 className="text-2xl font-bold text-stone-800">{recipe.name}</h1>
        <p className="text-stone-500">{recipe.cuisine}</p>
      </motion.div>

      <motion.div
        variants={{
          hidden: { opacity: 0, y: 12 },
          visible: { opacity: 1, y: 0 },
        }}
        className="grid grid-cols-2 gap-3"
      >
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
      </motion.div>

      <motion.div
        variants={{
          hidden: { opacity: 0, y: 12 },
          visible: { opacity: 1, y: 0 },
        }}
        className="space-y-2"
      >
        <h2 className="font-semibold text-stone-700">
          Liste de courses ({missing.length} à acheter)
        </h2>
        {missing.length === 0 ? (
          <p className="text-stone-500">
            Tu as déjà tous les ingrédients, parfait !
          </p>
        ) : (
          <ul className="space-y-1">
            {missing.map((i, idx) => (
              <motion.li
                key={i.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + idx * 0.05 }}
                className="flex justify-between rounded-xl bg-white px-3 py-2 text-stone-700 shadow-sm"
              >
                <span>{i.name}</span>
                <span className="text-stone-400">{i.quantity}</span>
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>

      <motion.div
        variants={{
          hidden: { opacity: 0, y: 12 },
          visible: { opacity: 1, y: 0 },
        }}
        className="mt-auto flex flex-col gap-3 pt-4"
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => handleChoice("cuisine")}
          className="rounded-full bg-gradient-to-r from-orange-500 to-rose-500 py-3.5 font-bold text-white shadow-md transition hover:opacity-90"
        >
          Je cuisine ce plat
        </motion.button>
        <motion.a
          whileTap={{ scale: 0.97 }}
          href={orderUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleChoice("commande")}
          className="rounded-full border-2 border-stone-300 py-3.5 text-center font-bold text-stone-600 transition hover:bg-stone-100"
        >
          Je commande à la place
        </motion.a>
      </motion.div>
    </motion.div>
  );
}
