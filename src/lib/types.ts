export type Mood = "reconfort" | "leger" | "sucre" | "sale";

export type Diet =
  | "vegan"
  | "vegetarien"
  | "sans_gluten"
  | "sans_lactose"
  | "halal";

export type Allergen =
  | "gluten"
  | "lactose"
  | "oeuf"
  | "fruits_de_mer"
  | "arachides"
  | "soja";

export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Recipe {
  id: string;
  name: string;
  emoji: string;
  gradient: string;
  moods: Mood[];
  diets: Diet[];
  allergens: Allergen[];
  cuisine: string;
  calories: number;
  timeMinutes: number;
  cookBudget: number;
  orderBudget: number;
  ingredients: Ingredient[];
  /** English keywords used to fetch an appetizing stock photo. */
  photoKeywords: string[];
  /** Dishes the user specifically likes to order in, surfaced in "Mes favoris". */
  favoriteOrder?: boolean;
}

export interface UserProfile {
  diets: Diet[];
  allergies: Allergen[];
  calorieGoal: number | null;
}

export type MealChoice = "cuisine" | "commande";

export interface HistoryEntry {
  recipeId: string;
  date: string;
  choice: MealChoice;
}

export const EMPTY_PROFILE: UserProfile = {
  diets: [],
  allergies: [],
  calorieGoal: null,
};
