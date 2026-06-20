"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RecipeCard from "@/components/RecipeCard";
import { getSuggestions } from "@/lib/suggestionEngine";
import { getHistory, getPantry, getProfile } from "@/lib/storage";
import { Mood, Recipe } from "@/lib/types";

const moods: { id: Mood; label: string; emoji: string }[] = [
  { id: "reconfort", label: "Réconfort", emoji: "🤗" },
  { id: "leger", label: "Léger", emoji: "🥗" },
  { id: "sucre", label: "Sucré", emoji: "🍰" },
  { id: "sale", label: "Salé", emoji: "🧀" },
];

export default function HomePage() {
  const router = useRouter();
  const [selectedMoods, setSelectedMoods] = useState<Mood[]>([]);
  const [deck, setDeck] = useState<Recipe[] | null>(null);
  const [deckIndex, setDeckIndex] = useState(0);
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
    setDeckIndex(0);
  }

  function reset() {
    setDeck(null);
    setDeckIndex(0);
    setSelectedMoods([]);
  }

  const current = deck && deck[deckIndex];

  return (
    <div className="flex flex-1 flex-col gap-6">
      {!deck && (
        <div className="space-y-6">
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-bold text-stone-800">
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
                <button
                  key={mood.id}
                  onClick={() => toggleMood(mood.id)}
                  className={`flex flex-col items-center gap-2 rounded-2xl border-2 px-4 py-6 text-lg font-semibold transition ${
                    active
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-stone-200 bg-white text-stone-600 hover:border-orange-300"
                  }`}
                >
                  <span className="text-3xl">{mood.emoji}</span>
                  {mood.label}
                </button>
              );
            })}
          </div>
          <button
            onClick={findIdeas}
            className="w-full rounded-full bg-gradient-to-r from-orange-500 to-rose-500 py-3.5 text-lg font-bold text-white shadow-md transition hover:opacity-90"
          >
            Trouver une idée 🍽️
          </button>
        </div>
      )}

      {deck && current && (
        <div className="flex flex-1 flex-col gap-5">
          <RecipeCard recipe={current} pantry={pantry} />
          <div className="flex gap-3">
            <button
              onClick={() => setDeckIndex((i) => i + 1)}
              className="flex-1 rounded-full border-2 border-stone-300 py-3 font-semibold text-stone-600 transition hover:bg-stone-100"
            >
              Pas envie 👎
            </button>
            <button
              onClick={() => router.push(`/repas/${current.id}`)}
              className="flex-1 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 py-3 font-semibold text-white shadow-md transition hover:opacity-90"
            >
              Je prends ça 😋
            </button>
          </div>
          <button
            onClick={reset}
            className="text-sm text-stone-400 underline underline-offset-2"
          >
            Changer d&apos;envies
          </button>
        </div>
      )}

      {deck && !current && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <p className="text-3xl">🤔</p>
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
        </div>
      )}
    </div>
  );
}
