# EatWise 🍽️

**What should I eat today?** EatWise answers in three taps: pick a craving, swipe through suggestions tailored to what's in your kitchen and your dietary needs, then decide to cook or order — with a shopping list and a cook-vs-order comparison ready either way.

No backend, no signup. Everything runs in the browser and is saved to `localStorage` on your device.

## Features

- **Real swipe gestures** — drag suggestion cards left/right (Tinder-style), stacked deck with depth, animated OUI/NON labels
- **Mood-based suggestions** — pick one or more cravings (comfort, light, sweet, savory) and get a swipeable deck of matching recipes
- **Pantry-aware** — recipes are scored higher when you already have the ingredients at home, to cut food waste
- **Diet & allergy filters** — vegan, vegetarian, gluten-free, lactose-free, halal, plus allergen exclusions (gluten, lactose, egg, shellfish, peanuts, soy)
- **Calorie goal aware** — suggestions lean toward recipes that fit your daily calorie target
- **No-repeat logic** — recently eaten meals are deprioritized so suggestions stay varied
- **Cook vs. order comparator** — see estimated time, budget, and calories for cooking at home vs. ordering delivery
- **Favorites to order** — a dedicated shortlist of go-to delivery dishes, one tap away from an order search, no swiping needed
- **Auto-generated shopping list** — only the ingredients you're missing for the recipe you picked
- **Dish photos** — fetched automatically by keyword (LoremFlickr), with a manual override per dish if you want to set your own picture
- **Meal history** — track what you've cooked or ordered over time, with a streak counter

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack, React 19.2)
- TypeScript
- Tailwind CSS v4
- [framer-motion](https://www.framer.com/motion/) for drag gestures and animations
- `localStorage` + `useSyncExternalStore` for client-side persistence — no database, no API

## Getting started

```bash
npm install
npm run dev
```

The app runs on **http://localhost:3210** (a non-default port, to avoid clashing with other local projects on 3000).

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build (port 3210)
npm run lint     # ESLint
```

## How the suggestion engine works

See [`src/lib/suggestionEngine.ts`](src/lib/suggestionEngine.ts). For a given set of cravings:

1. Recipes are filtered out if they violate your diet or allergy profile (`src/lib/types.ts`, `src/app/profil`)
2. Remaining recipes are scored on: mood match, how many ingredients you already have in your pantry (`src/app/stock`), how recently you ate them (history penalty), and closeness to your calorie goal
3. The top-scoring recipes form the swipe deck on the home page

Recipe data lives in [`src/lib/recipes.ts`](src/lib/recipes.ts) — a static list, easy to extend with new dishes.

## Project structure

```
src/
  app/
    page.tsx                # home: mood picker + swipe deck
    favoris/page.tsx        # quick-order favorite dishes
    stock/page.tsx          # pantry manager
    profil/page.tsx         # diet/allergy/calorie profile
    repas/[id]/page.tsx     # meal detail (server) -> RecipeDetail (client)
    historique/page.tsx     # meal history
    template.tsx             # page transition wrapper
  components/
    Nav.tsx
    RecipeCard.tsx
    RecipeDetail.tsx
    SwipeDeck.tsx
  lib/
    types.ts                # domain types
    recipes.ts               # recipe dataset
    suggestionEngine.ts       # scoring/matching logic
    storage.ts                # localStorage helpers + reactive hooks
    photo.ts                  # dish photo URL resolution (stock + manual override)
```

## Roadmap ideas

- Fridge photo scan to update pantry without manual entry
- Real delivery integrations (Uber Eats, Deliveroo) instead of a search link
- Multiple family profiles with compromise suggestions
- Taste learning over time based on past choices

## License

© 2026 Riadh Mnasri. All rights reserved — see [LICENSE](LICENSE). The source is public for portfolio/demonstration purposes only.
