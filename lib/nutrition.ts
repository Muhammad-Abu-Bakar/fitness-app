// === NEW === all nutrition math lives here — pure functions, no React
import { ActivityLevel, Goal } from '../context/onboarding';

// === NEW === unit conversions
const LBS_TO_KG = 0.453592;
const INCHES_TO_CM = 2.54;

// === NEW === Mifflin-St Jeor BMR (men formula — matches our target audience)
// BMR = (10 × weight kg) + (6.25 × height cm) − (5 × age) + 5
export function calculateBMR(weightLbs: number, heightFt: number, heightIn: number, age: number): number {
  const weightKg = weightLbs * LBS_TO_KG;
  const heightCm = (heightFt * 12 + heightIn) * INCHES_TO_CM;
  return (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
}

// === NEW === activity multipliers — standard TDEE coefficients
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
};

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}

// === NEW === calorie surplus by goal (how aggressive the bulk is)
const GOAL_SURPLUS: Record<Goal, number> = {
  bulk: 500,        // ~1 lb/week of weight gain
  lean: 250,        // slower, less fat gain
  exploring: 0,     // maintenance until they decide
};

export function calculateTargetCalories(tdee: number, goal: Goal): number {
  return tdee + GOAL_SURPLUS[goal];
}

// === NEW === protein target — 1g per lb bodyweight (hypertrophy standard)
export function calculateProteinTarget(weightLbs: number): number {
  return Math.round(weightLbs);
}

// === NEW === one-stop function — gives you everything for the dashboard
export type Targets = {
  bmr: number;
  tdee: number;
  calories: number;
  protein: number;
  surplus: number;
};

export function calculateTargets(
  weightLbs: number,
  heightFt: number,
  heightIn: number,
  age: number,
  activityLevel: ActivityLevel,
  goal: Goal
): Targets {
  const bmr = calculateBMR(weightLbs, heightFt, heightIn, age);
  const tdee = calculateTDEE(bmr, activityLevel);
  const calories = calculateTargetCalories(tdee, goal);
  const protein = calculateProteinTarget(weightLbs);
  return {
    bmr: Math.round(bmr),
    tdee,
    calories,
    protein,
    surplus: calories - tdee,
  };
}