"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useProfile } from "@/lib/storage";
import { Allergen, Diet } from "@/lib/types";

const DIETS: { id: Diet; label: string; emoji: string }[] = [
  { id: "vegan", label: "Vegan", emoji: "🌱" },
  { id: "vegetarien", label: "Végétarien", emoji: "🥦" },
  { id: "sans_gluten", label: "Sans gluten", emoji: "🌾" },
  { id: "sans_lactose", label: "Sans lactose", emoji: "🥛" },
  { id: "halal", label: "Halal", emoji: "✅" },
];

const ALLERGENS: { id: Allergen; label: string; emoji: string }[] = [
  { id: "gluten", label: "Gluten", emoji: "🌾" },
  { id: "lactose", label: "Lactose", emoji: "🥛" },
  { id: "oeuf", label: "Œuf", emoji: "🥚" },
  { id: "fruits_de_mer", label: "Fruits de mer", emoji: "🦐" },
  { id: "arachides", label: "Arachides", emoji: "🥜" },
  { id: "soja", label: "Soja", emoji: "🫘" },
];

function Chip({
  active,
  emoji,
  label,
  activeClass,
  onClick,
}: {
  active: boolean;
  emoji: string;
  label: string;
  activeClass: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      animate={{ scale: active ? 1.04 : 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={`relative flex items-center gap-1.5 rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? activeClass
          : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
      }`}
    >
      <span>{emoji}</span>
      {label}
      <AnimatePresence>
        {active && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
            className="ml-0.5 text-xs"
          >
            ✓
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export default function ProfilPage() {
  const [profile, setProfile] = useProfile();

  function toggleDiet(diet: Diet) {
    setProfile({
      ...profile,
      diets: profile.diets.includes(diet)
        ? profile.diets.filter((d) => d !== diet)
        : [...profile.diets, diet],
    });
  }

  function toggleAllergy(allergen: Allergen) {
    setProfile({
      ...profile,
      allergies: profile.allergies.includes(allergen)
        ? profile.allergies.filter((a) => a !== allergen)
        : [...profile.allergies, allergen],
    });
  }

  return (
    <div className="flex flex-1 flex-col gap-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-stone-800">Mon profil</h1>
        <p className="text-stone-500">
          Pour des suggestions qui respectent tes besoins.
        </p>
      </div>

      <section className="space-y-2">
        <h2 className="font-semibold text-stone-700">Régime alimentaire</h2>
        <div className="flex flex-wrap gap-2">
          {DIETS.map((diet) => (
            <Chip
              key={diet.id}
              emoji={diet.emoji}
              label={diet.label}
              active={profile.diets.includes(diet.id)}
              onClick={() => toggleDiet(diet.id)}
              activeClass="border-orange-500 bg-orange-50 text-orange-700"
            />
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold text-stone-700">
          Allergies / intolérances
        </h2>
        <div className="flex flex-wrap gap-2">
          {ALLERGENS.map((allergen) => (
            <Chip
              key={allergen.id}
              emoji={allergen.emoji}
              label={allergen.label}
              active={profile.allergies.includes(allergen.id)}
              onClick={() => toggleAllergy(allergen.id)}
              activeClass="border-rose-500 bg-rose-50 text-rose-700"
            />
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold text-stone-700">
          Objectif calorique journalier (optionnel)
        </h2>
        <input
          type="number"
          min={0}
          value={profile.calorieGoal ?? ""}
          onChange={(e) =>
            setProfile({
              ...profile,
              calorieGoal: e.target.value ? Number(e.target.value) : null,
            })
          }
          placeholder="ex: 2000"
          className="w-40 rounded-full border-2 border-stone-200 px-4 py-2.5 outline-none transition-shadow focus:border-orange-400 focus:shadow-[0_0_0_4px_rgba(251,146,60,0.15)]"
        />
      </section>
    </div>
  );
}
