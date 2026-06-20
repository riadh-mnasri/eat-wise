"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import RecipeCard from "./RecipeCard";
import { Recipe } from "@/lib/types";

const SWIPE_THRESHOLD = 110;

export default function SwipeDeck({
  recipes,
  pantry,
  onChoose,
  onEmpty,
}: {
  recipes: Recipe[];
  pantry: string[];
  onChoose: (recipe: Recipe) => void;
  onEmpty: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const current = recipes[index];
  const upNext = recipes.slice(index + 1, index + 3);

  useEffect(() => {
    if (!current) onEmpty();
  }, [current, onEmpty]);

  function advance(dir: 1 | -1) {
    setDirection(dir);
    if (dir === 1) onChoose(current);
    setIndex((i) => i + 1);
  }

  if (!current) return null;

  return (
    <div className="flex flex-1 flex-col gap-5">
      <p className="text-center text-sm font-semibold text-stone-400">
        {index + 1} / {recipes.length}
      </p>
      <div className="relative h-[420px]" style={{ perspective: 1000 }}>
        {upNext
          .map((recipe, i) => ({ recipe, depth: i + 1 }))
          .reverse()
          .map(({ recipe, depth }) => (
            <div
              key={recipe.id}
              className="absolute inset-0 transition-transform duration-300"
              style={{
                transform: `scale(${1 - depth * 0.045}) translateY(${depth * 10}px)`,
                zIndex: 10 - depth,
                opacity: 1 - depth * 0.3,
              }}
            >
              <RecipeCard recipe={recipe} pantry={pantry} />
            </div>
          ))}

        <AnimatePresence>
          <SwipeCard
            key={current.id}
            recipe={current}
            pantry={pantry}
            direction={direction}
            onSwipe={advance}
          />
        </AnimatePresence>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => advance(-1)}
          className="flex-1 rounded-full border-2 border-stone-300 py-3 font-semibold text-stone-600 transition hover:bg-stone-100"
        >
          Pas envie 👎
        </button>
        <button
          onClick={() => advance(1)}
          className="flex-1 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 py-3 font-semibold text-white shadow-md transition hover:opacity-90 active:scale-95"
        >
          Je prends ça 😋
        </button>
      </div>
    </div>
  );
}

const cardVariants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: (dir: number) => ({
    x: dir * 600,
    rotate: dir * 20,
    opacity: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  }),
};

function SwipeCard({
  recipe,
  pantry,
  direction,
  onSwipe,
}: {
  recipe: Recipe;
  pantry: string[];
  direction: number;
  onSwipe: (direction: 1 | -1) => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-14, 14]);
  const yesOpacity = useTransform(x, [20, 110], [0, 1]);
  const noOpacity = useTransform(x, [-110, -20], [1, 0]);

  const tiltXRaw = useMotionValue(0);
  const tiltYRaw = useMotionValue(0);
  const rotateX = useSpring(tiltXRaw, { stiffness: 250, damping: 20 });
  const rotateY = useSpring(tiltYRaw, { stiffness: 250, damping: 20 });

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    tiltYRaw.set(px * 12);
    tiltXRaw.set(py * -12);
  }

  function resetTilt() {
    tiltXRaw.set(0);
    tiltYRaw.set(0);
  }

  return (
    <motion.div
      className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
      style={{ x, rotate, rotateX, rotateY }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={1}
      onDragEnd={(_, info) => {
        resetTilt();
        if (info.offset.x > SWIPE_THRESHOLD) onSwipe(1);
        else if (info.offset.x < -SWIPE_THRESHOLD) onSwipe(-1);
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      custom={direction}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
    >
      <motion.div
        className="pointer-events-none absolute left-5 top-5 z-10 -rotate-12 rounded-xl border-4 border-emerald-500 bg-white/70 px-3 py-1 text-xl font-extrabold tracking-wide text-emerald-500"
        style={{ opacity: yesOpacity }}
      >
        OUI
      </motion.div>
      <motion.div
        className="pointer-events-none absolute right-5 top-5 z-10 rotate-12 rounded-xl border-4 border-rose-500 bg-white/70 px-3 py-1 text-xl font-extrabold tracking-wide text-rose-500"
        style={{ opacity: noOpacity }}
      >
        NON
      </motion.div>
      <RecipeCard recipe={recipe} pantry={pantry} />
    </motion.div>
  );
}
