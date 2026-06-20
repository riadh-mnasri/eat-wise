"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import SwipeDeck from "@/components/SwipeDeck";
import { getSuggestions } from "@/lib/suggestionEngine";
import { getHistory, getPantry, getProfile } from "@/lib/storage";
import { Mood, Recipe } from "@/lib/types";

const moods: { id: Mood; label: string; emoji: string }[] = [
  { id: "reconfort", label: "Réconfort", emoji: "🤗" },
  { id: "leger", label: "Léger", emoji: "🥗" },
  { id: "sucre", label: "Sucré", emoji: "🍰" },
  { id: "sale", label: "Salé", emoji: "🧀" },
];

type Stage = "pick" | "deck" | "empty";

export default function HomePage() {
  const router = useRouter();
  const [selectedMoods, setSelectedMoods] = useState<Mood[]>([]);
  const [stage, setStage] = useState<Stage>("pick");
  const [deck, setDeck] = useState<Recipe[]>([]);
  const [pantry, setPantry] = useState<string[]>([]);

  function toggleMood(mood: Mood) {
    setSelectedMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood],
    );
  }

  function findIdeas() {
    const currentPantry = getPantry();
    setPantry(currentPantry);
    const suggestions = getSuggestions(
      selectedMoods,
      getProfile(),
      currentPantry,
      getHistory(),
      8,
    );
    setDeck(suggestions);
    setStage("deck");
  }

  function reset() {
    setStage("pick");
    setSelectedMoods([]);
  }

  const handleChoose = useCallback(
    (recipe: Recipe) => {
      router.push(`/repas/${recipe.id}`);
    },
    [router],
  );

  const handleEmpty = useCallback(() => setStage("empty"), []);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <AnimatePresence mode="wait">
        {stage === "pick" && (
          <motion.div
            key="pick"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="space-y-1 text-center">
              <h1 className="text-3xl font-bold text-stone-800">
                Qu&apos;est-ce qui te ferait envie ?
              </h1>
              <p className="text-stone-500">
                Choisis une ou plusieurs envies, on s&apos;occupe du reste.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {moods.map((mood) => {
                const active = selectedMoods.includes(mood.id);
                return (
                  <motion.button
                    key={mood.id}
                    onClick={() => toggleMood(mood.id)}
                    whileTap={{ scale: 0.95 }}
                    animate={{ scale: active ? 1.03 : 1 }}
                    className={`flex flex-col items-center gap-2 rounded-2xl border-2 px-4 py-6 text-lg font-semibold shadow-sm transition-colors ${
                      active
                        ? "border-orange-500 bg-orange-50 text-orange-700 shadow-orange-200"
                        : "border-stone-200 bg-white text-stone-600 hover:border-orange-300"
                    }`}
                  >
                    <span className="text-3xl">{mood.emoji}</span>
                    {mood.label}
                  </motion.button>
                );
              })}
            </div>
            <motion.button
              onClick={findIdeas}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              className="shine-sweep relative isolate w-full overflow-hidden rounded-full bg-gradient-to-r from-orange-500 to-rose-500 py-3.5 text-lg font-bold text-white shadow-lg shadow-orange-200 transition hover:opacity-90"
            >
              Trouver une idée 🍽️
            </motion.button>
            <Link
              href="/favoris"
              className="block text-center text-sm font-semibold text-orange-600 underline underline-offset-2"
            >
              🛵 Voir mes favoris à commander
            </Link>
          </motion.div>
        )}

        {stage === "deck" && (
          <motion.div
            key="deck"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="flex flex-1 flex-col gap-3"
          >
            <SwipeDeck
              recipes={deck}
              pantry={pantry}
              onChoose={handleChoose}
              onEmpty={handleEmpty}
            />
            <button
              onClick={reset}
              className="text-sm text-stone-400 underline underline-offset-2"
            >
              Changer d&apos;envies
            </button>
          </motion.div>
        )}

        {stage === "empty" && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-1 flex-col items-center justify-center gap-4 text-center"
          >
            <p className="float-slow text-4xl">🤔</p>
            <p className="text-stone-600">
              Plus d&apos;idée pour ces envies-là. Élargis tes envies, ou
              vérifie ton stock et ton profil.
            </p>
            <button
              onClick={reset}
              className="rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-2.5 font-semibold text-white shadow-md"
            >
              Recommencer
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
