"use client";

import { useState } from "react";
import { usePantry } from "@/lib/storage";

const QUICK_ADD = [
  "riz",
  "pâtes",
  "œufs",
  "lait",
  "tomates",
  "oignon",
  "ail",
  "pommes de terre",
  "carottes",
  "fromage",
  "beurre",
  "farine",
  "citron",
  "salade",
];

export default function StockPage() {
  const [pantry, setPantry] = usePantry();
  const [input, setInput] = useState("");

  function addItem(name: string) {
    const clean = name.trim().toLowerCase();
    if (!clean) return;
    if (!pantry.includes(clean)) setPantry([...pantry, clean]);
    setInput("");
  }

  function removeItem(name: string) {
    setPantry(pantry.filter((i) => i !== name));
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-stone-800">Mon stock</h1>
        <p className="text-stone-500">
          Ce que tu as à la maison, pour des suggestions qui évitent le
          gaspillage.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addItem(input);
        }}
        className="flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ajouter un ingrédient..."
          className="flex-1 rounded-full border-2 border-stone-200 px-4 py-2.5 outline-none focus:border-orange-400"
        />
        <button
          type="submit"
          className="rounded-full bg-orange-500 px-5 py-2.5 font-semibold text-white"
        >
          Ajouter
        </button>
      </form>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-stone-500">
          Ajout rapide
        </p>
        <div className="flex flex-wrap gap-2">
          {QUICK_ADD.map((item) => (
            <button
              key={item}
              onClick={() => addItem(item)}
              disabled={pantry.includes(item)}
              className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm text-stone-600 transition hover:border-orange-300 disabled:opacity-40"
            >
              + {item}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-stone-500">
          Dans mon stock ({pantry.length})
        </p>
        {pantry.length === 0 ? (
          <p className="text-stone-400">
            Ton stock est vide pour l&apos;instant.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {pantry.map((item) => (
              <span
                key={item}
                className="flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1.5 text-sm font-medium text-orange-700"
              >
                {item}
                <button
                  onClick={() => removeItem(item)}
                  aria-label={`Retirer ${item}`}
                  className="text-orange-500 hover:text-orange-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
