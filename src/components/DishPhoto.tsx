"use client";

import { useEffect, useState } from "react";
import { Recipe } from "@/lib/types";
import { getRecipePhotoUrl } from "@/lib/photo";
import { useCustomPhoto } from "@/lib/storage";

type Status = "loading" | "loaded" | "failed";

export default function DishPhoto({
  recipe,
  emojiClassName = "text-6xl",
  onStatusChange,
}: {
  recipe: Recipe;
  emojiClassName?: string;
  onStatusChange?: (status: Status) => void;
}) {
  const [customPhoto] = useCustomPhoto(recipe.id);
  const [status, setStatus] = useState<Status>("loading");
  const photoUrl = getRecipePhotoUrl(recipe, customPhoto);

  // Reset the loading state when the resolved photo changes (e.g. a custom
  // override is saved/cleared) — adjusting state during render rather than
  // in an effect, per https://react.dev/learn/you-might-not-need-an-effect.
  const [trackedUrl, setTrackedUrl] = useState(photoUrl);
  if (photoUrl !== trackedUrl) {
    setTrackedUrl(photoUrl);
    setStatus("loading");
  }

  useEffect(() => {
    onStatusChange?.(status);
  }, [status, onStatusChange]);

  if (status === "failed") {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span
          className={`float-slow drop-shadow-[0_8px_16px_rgba(0,0,0,0.25)] ${emojiClassName}`}
        >
          {recipe.emoji}
        </span>
      </div>
    );
  }

  return (
    <>
      {status === "loading" && (
        <div className="photo-shimmer absolute inset-0" />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photoUrl}
        alt={recipe.name}
        draggable={false}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("failed")}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          status === "loaded" ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}
