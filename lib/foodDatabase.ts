// === NEW === Local food database for nutrition auto-fill.
// ~35 common bulking foods + Pakistani staples (roti, naan, daal, paratha).
// Each food has aliases so user input like "chicken" matches "chicken-breast".
// Nutrition is stored per "base unit" (per 100g, per 1 piece, per 1 tbsp, etc.)
// and scaled at lookup time by foodLookup.ts.
//
// Numbers are rounded approximations based on USDA values for COOKED weights
// (most people weigh food on their plate, not raw).

export type FoodUnit = 'g' | 'ml' | 'piece' | 'tbsp' | 'scoop';

export type FoodItem = {
  id: string;              // unique key, e.g. 'chicken-breast'
  name: string;            // display name shown back to user
  aliases: string[];       // lowercase strings that match this food (longest first wins)
  baseAmount: number;      // the amount the nutrition values are FOR
  baseUnit: FoodUnit;      // unit of baseAmount
  caloriesPerBase: number;
  proteinPerBase: number;  // grams of protein
};

export const FOOD_DATABASE: FoodItem[] = [
  // === PROTEINS ===
  {
    id: 'chicken-breast',
    name: 'Chicken breast',
    aliases: ['chicken breast', 'chicken'],
    baseAmount: 100, baseUnit: 'g',
    caloriesPerBase: 165, proteinPerBase: 31,
  },
  {
    id: 'chicken-thigh',
    name: 'Chicken thigh',
    aliases: ['chicken thigh', 'thigh'],
    baseAmount: 100, baseUnit: 'g',
    caloriesPerBase: 209, proteinPerBase: 26,
  },
  {
    id: 'ground-beef',
    name: 'Ground beef',
    aliases: ['ground beef', 'mince', 'beef mince', 'qeema', 'keema'],
    baseAmount: 100, baseUnit: 'g',
    caloriesPerBase: 250, proteinPerBase: 26,
  },
  {
    id: 'beef-steak',
    name: 'Beef steak',
    aliases: ['steak', 'beef steak', 'beef'],
    baseAmount: 100, baseUnit: 'g',
    caloriesPerBase: 271, proteinPerBase: 26,
  },
  {
    id: 'salmon',
    name: 'Salmon',
    aliases: ['salmon'],
    baseAmount: 100, baseUnit: 'g',
    caloriesPerBase: 208, proteinPerBase: 22,
  },
  {
    id: 'tuna',
    name: 'Tuna (canned)',
    aliases: ['tuna'],
    baseAmount: 100, baseUnit: 'g',
    caloriesPerBase: 116, proteinPerBase: 26,
  },
  {
    id: 'egg',
    name: 'Egg (whole, large)',
    aliases: ['egg', 'eggs', 'whole egg'],
    baseAmount: 1, baseUnit: 'piece',
    caloriesPerBase: 72, proteinPerBase: 6,
  },
  {
    id: 'egg-white',
    name: 'Egg white',
    aliases: ['egg white', 'egg whites'],
    baseAmount: 1, baseUnit: 'piece',
    caloriesPerBase: 17, proteinPerBase: 4,
  },
  {
    id: 'whey-protein',
    name: 'Whey protein scoop',
    aliases: ['whey', 'protein shake', 'whey protein', 'shake', 'scoop'],
    baseAmount: 1, baseUnit: 'scoop',
    caloriesPerBase: 120, proteinPerBase: 24,
  },
  {
    id: 'greek-yogurt',
    name: 'Greek yogurt (nonfat)',
    aliases: ['greek yogurt', 'yogurt', 'yoghurt', 'dahi'],
    baseAmount: 100, baseUnit: 'g',
    caloriesPerBase: 59, proteinPerBase: 10,
  },
  {
    id: 'cottage-cheese',
    name: 'Cottage cheese',
    aliases: ['cottage cheese', 'paneer'],
    baseAmount: 100, baseUnit: 'g',
    caloriesPerBase: 98, proteinPerBase: 11,
  },
  {
    id: 'tofu',
    name: 'Tofu (firm)',
    aliases: ['tofu'],
    baseAmount: 100, baseUnit: 'g',
    caloriesPerBase: 144, proteinPerBase: 17,
  },
  {
    id: 'lentils',
    name: 'Lentils (cooked)',
    aliases: ['lentils', 'daal', 'dal', 'masoor'],
    baseAmount: 100, baseUnit: 'g',
    caloriesPerBase: 116, proteinPerBase: 9,
  },
  {
    id: 'chickpeas',
    name: 'Chickpeas (cooked)',
    aliases: ['chickpeas', 'chana', 'channa', 'garbanzo'],
    baseAmount: 100, baseUnit: 'g',
    caloriesPerBase: 164, proteinPerBase: 9,
  },

  // === CARBS ===
  {
    id: 'white-rice',
    name: 'White rice (cooked)',
    aliases: ['white rice', 'rice', 'chawal'],
    baseAmount: 100, baseUnit: 'g',
    caloriesPerBase: 130, proteinPerBase: 3,
  },
  {
    id: 'brown-rice',
    name: 'Brown rice (cooked)',
    aliases: ['brown rice'],
    baseAmount: 100, baseUnit: 'g',
    caloriesPerBase: 123, proteinPerBase: 3,
  },
  {
    id: 'oats',
    name: 'Oats (dry, rolled)',
    aliases: ['oats', 'oatmeal', 'rolled oats'],
    baseAmount: 100, baseUnit: 'g',
    caloriesPerBase: 389, proteinPerBase: 17,
  },
  {
    id: 'pasta',
    name: 'Pasta (cooked)',
    aliases: ['pasta', 'spaghetti', 'macaroni'],
    baseAmount: 100, baseUnit: 'g',
    caloriesPerBase: 131, proteinPerBase: 5,
  },
  {
    id: 'white-bread',
    name: 'White bread (slice)',
    aliases: ['white bread', 'bread slice', 'slice of bread', 'bread'],
    baseAmount: 1, baseUnit: 'piece',
    caloriesPerBase: 80, proteinPerBase: 3,
  },
  {
    id: 'wheat-bread',
    name: 'Whole wheat bread (slice)',
    aliases: ['wheat bread', 'whole wheat bread', 'brown bread'],
    baseAmount: 1, baseUnit: 'piece',
    caloriesPerBase: 70, proteinPerBase: 4,
  },
  {
    id: 'potato',
    name: 'Potato (boiled)',
    aliases: ['potato', 'aloo', 'potatoes'],
    baseAmount: 100, baseUnit: 'g',
    caloriesPerBase: 87, proteinPerBase: 2,
  },
  {
    id: 'sweet-potato',
    name: 'Sweet potato (baked)',
    aliases: ['sweet potato', 'shakarkandi'],
    baseAmount: 100, baseUnit: 'g',
    caloriesPerBase: 90, proteinPerBase: 2,
  },
  {
    id: 'banana',
    name: 'Banana (medium)',
    aliases: ['banana', 'bananas', 'kela'],
    baseAmount: 1, baseUnit: 'piece',
    caloriesPerBase: 105, proteinPerBase: 1,
  },
  {
    id: 'apple',
    name: 'Apple (medium)',
    aliases: ['apple', 'apples', 'seb'],
    baseAmount: 1, baseUnit: 'piece',
    caloriesPerBase: 95, proteinPerBase: 0,
  },
  {
    id: 'roti',
    name: 'Roti / Chapati',
    aliases: ['roti', 'rotis', 'chapati', 'chapatti', 'phulka'],
    baseAmount: 1, baseUnit: 'piece',
    caloriesPerBase: 120, proteinPerBase: 3,
  },
  {
    id: 'naan',
    name: 'Naan (plain, medium)',
    aliases: ['naan'],
    baseAmount: 1, baseUnit: 'piece',
    caloriesPerBase: 262, proteinPerBase: 9,
  },
  {
    id: 'paratha',
    name: 'Paratha (plain)',
    aliases: ['paratha', 'parantha', 'parotha'],
    baseAmount: 1, baseUnit: 'piece',
    caloriesPerBase: 280, proteinPerBase: 6,
  },
  {
    id: 'quinoa',
    name: 'Quinoa (cooked)',
    aliases: ['quinoa'],
    baseAmount: 100, baseUnit: 'g',
    caloriesPerBase: 120, proteinPerBase: 4,
  },

  // === FATS ===
  {
    id: 'peanut-butter',
    name: 'Peanut butter',
    aliases: ['peanut butter', 'pb'],
    baseAmount: 1, baseUnit: 'tbsp',
    caloriesPerBase: 95, proteinPerBase: 4,
  },
  {
    id: 'almonds',
    name: 'Almonds',
    aliases: ['almonds', 'almond', 'badam'],
    baseAmount: 100, baseUnit: 'g',
    caloriesPerBase: 579, proteinPerBase: 21,
  },
  {
    id: 'olive-oil',
    name: 'Olive oil',
    aliases: ['olive oil'],
    baseAmount: 1, baseUnit: 'tbsp',
    caloriesPerBase: 119, proteinPerBase: 0,
  },
  {
    id: 'avocado',
    name: 'Avocado',
    aliases: ['avocado'],
    baseAmount: 100, baseUnit: 'g',
    caloriesPerBase: 160, proteinPerBase: 2,
  },

  // === DAIRY / DRINKS ===
  {
    id: 'whole-milk',
    name: 'Whole milk',
    aliases: ['whole milk', 'milk', 'doodh'],
    baseAmount: 100, baseUnit: 'ml',
    caloriesPerBase: 61, proteinPerBase: 3,
  },
  {
    id: 'skim-milk',
    name: 'Skim milk',
    aliases: ['skim milk', 'low fat milk'],
    baseAmount: 100, baseUnit: 'ml',
    caloriesPerBase: 34, proteinPerBase: 3,
  },
];
