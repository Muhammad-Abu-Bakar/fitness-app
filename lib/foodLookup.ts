// === NEW === Parser + lookup for the local food database.
// Takes raw user input like "250g chicken" or "2 eggs" and returns
// scaled calories + protein, or { matched: false } if we can't figure it out.

import { FOOD_DATABASE, FoodItem, FoodUnit } from './foodDatabase';

export type LookupResult =
  | { matched: false }
  | {
      matched: true;
      foodName: string;   // e.g. "Chicken breast" — what we recognized
      calories: number;
      protein: number;
    };

// Map every word the user might type to our internal unit set.
// "g", "gram", "grams" all mean the same thing.
const UNIT_WORDS: Record<string, FoodUnit> = {
  g: 'g', gram: 'g', grams: 'g',
  ml: 'ml', milliliter: 'ml', milliliters: 'ml',
  piece: 'piece', pieces: 'piece', pc: 'piece',
  tbsp: 'tbsp', tablespoon: 'tbsp', tablespoons: 'tbsp',
  scoop: 'scoop', scoops: 'scoop',
};

// === Step A: split the input into number + unit (optional) + food text ===
function parseInput(raw: string): { quantity: number; unit: FoodUnit | null; foodText: string } | null {
  const cleaned = raw.trim().toLowerCase();
  if (!cleaned) return null;

  // Look for a number at the start. "250g chicken" → "250" + "g chicken".
  // "2 eggs" → "2" + " eggs". Supports decimals like "1.5".
  const numMatch = cleaned.match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!numMatch) return null; // no number at start — can't compute portions

  const quantity = parseFloat(numMatch[1]);
  const rest = numMatch[2].trim();
  if (!rest) return null; // just a number, no food name

  // Look at the first word after the number. If it's a known unit word,
  // peel it off. Otherwise the whole rest is the food name.
  const firstWordMatch = rest.match(/^([a-z]+)\s*(.*)$/);
  if (firstWordMatch) {
    const firstWord = firstWordMatch[1];
    const afterWord = firstWordMatch[2].trim();

    if (UNIT_WORDS[firstWord]) {
      // The first word is a unit — strip it (and an optional "of ") and continue.
      const foodText = afterWord.replace(/^of\s+/, '');
      if (!foodText) return null;
      return { quantity, unit: UNIT_WORDS[firstWord], foodText };
    }
  }

  // No unit word — the rest IS the food name. e.g. "2 eggs" → foodText="eggs", unit=null.
  return { quantity, unit: null, foodText: rest };
}

// === Step B: find the best matching food in the database ===
function findFood(foodText: string): FoodItem | null {
  const text = foodText.trim().toLowerCase();
  if (!text) return null;

  // Build a flat list of (food, alias) pairs, then sort by alias length DESC.
  // This makes "chicken breast" win over "chicken" when both could match.
  const candidates: { food: FoodItem; alias: string }[] = [];
  for (const food of FOOD_DATABASE) {
    for (const alias of food.aliases) {
      candidates.push({ food, alias });
    }
  }
  candidates.sort((a, b) => b.alias.length - a.alias.length);

  // First pass: exact match against the whole food text.
  for (const { food, alias } of candidates) {
    if (text === alias) return food;
  }

  // Second pass: substring match. "grilled chicken breast" → contains "chicken breast".
  for (const { food, alias } of candidates) {
    if (text.includes(alias)) return food;
  }

  return null;
}

// === Step C: scale the food's per-base nutrition to the user's quantity ===
function scale(food: FoodItem, quantity: number, unit: FoodUnit | null): { calories: number; protein: number } | null {
  // If the user didn't specify a unit AND the food is weighable (g or ml),
  // we don't auto-fill — it's ambiguous (is "1 rice" one gram? one cup?).
  // Better to skip than guess wrong.
  if (unit === null && (food.baseUnit === 'g' || food.baseUnit === 'ml')) {
    return null;
  }

  // For countable foods (piece, scoop, tbsp), no unit means "1 of that thing".
  // e.g. "2 eggs" → 2 pieces, since egg's baseUnit is 'piece'.
  const effectiveUnit = unit ?? food.baseUnit;

  // We don't do cross-unit conversion (no "cup → grams"). If units don't match, bail.
  if (effectiveUnit !== food.baseUnit) return null;

  const ratio = quantity / food.baseAmount;
  return {
    calories: Math.round(food.caloriesPerBase * ratio),
    protein: Math.round(food.proteinPerBase * ratio),
  };
}

// === Public entry point ===
export function lookupFood(input: string): LookupResult {
  const parsed = parseInput(input);
  if (!parsed) return { matched: false };

  const food = findFood(parsed.foodText);
  if (!food) return { matched: false };

  const scaled = scale(food, parsed.quantity, parsed.unit);
  if (!scaled) return { matched: false };

  return {
    matched: true,
    foodName: food.name,
    calories: scaled.calories,
    protein: scaled.protein,
  };
}
