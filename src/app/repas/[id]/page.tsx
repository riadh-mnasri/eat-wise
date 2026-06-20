import { notFound } from "next/navigation";
import { getRecipeById } from "@/lib/suggestionEngine";
import RecipeDetail from "@/components/RecipeDetail";

export default async function RepasPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = getRecipeById(id);

  if (!recipe) notFound();

  return <RecipeDetail recipe={recipe} />;
}
