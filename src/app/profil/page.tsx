"use client";

import { useProfile } from "@/lib/storage";
import { Allergen, Diet } from "@/lib/types";

const DIETS: { id: Diet; label: string }[] = [
  { id: "vegan", label: "Vegan" },
  { id: "vegetarien", label: "Végétarien" },
  { id: "sans_gluten", label: "Sans gluten" },
  { id: "sans_lactose", label: "Sans lactose" },
];

const ALLERGENS: { id: Allergen; label: string }[] = [
  { id: "gluten", label: "Gluten" },
  { id: "lactose", label: "Lactose" },
  { id: "oeuf", label: "Œuf" },
  { id: "fruits_de_mer", label: "Fruits de mer" },
  { id: "arachides", label: "Arachides" },
  { id: "soja", label: "Soja" },
];

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
          {DIETS.map((diet) => {
            const active = profile.diets.includes(diet.id);
            return (
              <button
                key={diet.id}
                onClick={() => toggleDiet(diet.id)}
                className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-stone-200 bg-white text-stone-600 hover:border-orange-300"
                }`}
              >
                {diet.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold text-stone-700">Allergies / intolérances</h2>
        <div className="flex flex-wrap gap-2">
          {ALLERGENS.map((allergen) => {
            const active = profile.allergies.includes(allergen.id);
            return (
              <button
                key={allergen.id}
                onClick={() => toggleAllergy(allergen.id)}
                className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "border-rose-500 bg-rose-50 text-rose-700"
                    : "border-stone-200 bg-white text-stone-600 hover:border-rose-300"
                }`}
              >
                {allergen.label}
              </button>
            );
          })}
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
          className="w-40 rounded-full border-2 border-stone-200 px-4 py-2.5 outline-none focus:border-orange-400"
        />
      </section>
    </div>
  );
}
