// === CHANGED === BMR now uses sex-specific constant (Mifflin-St Jeor)
import { ActivityLevel, Goal, Sex } from '../context/onboarding';

// Unit conversions
const LBS_TO_KG = 0.453592;
const INCHES_TO_CM = 2.54;

// Mifflin-St Jeor BMR:
//   Male:   BMR = (10 * weight kg) + (6.25 * height cm) - (5 * age) + 5
//   Female: BMR = (10 * weight kg) + (6.25 * height cm) - (5 * age) - 161
// Difference between male/female coefficients is ~166 kcal/day -- meaningful enough to matter.
// sex is typed as required, but null is accepted at runtime and defaults to the male constant
// (covers existing users who completed onboarding before the sex step existed).
export function calculateBMR(
  weightLbs: number,
  heightFt: number,
  heightIn: number,
  age: number,
  sex: Sex | null,
): number {
  const weightKg = weightLbs * LBS_TO_KG;
  const heightCm = (heightFt * 12 + heightIn) * INCHES_TO_CM;
  const sexConstant = sex === 'female' ? -161 : 5;
  return (10 * weightKg) + (6.25 * heightCm) - (5 * age) + sexConstant;
}

// Activity multipliers -- standard TDEE coefficients
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
};

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}

// Calorie surplus by goal (how aggressive the bulk is)
const GOAL_SURPLUS: Record<Goal, number> = {
  bulk: 500,        // ~1 lb/week of weight gain
  lean: 250,        // slower, less fat gain
  exploring: 0,     // maintenance until they decide
};

export function calculateTargetCalories(tdee: number, goal: Goal): number {
  return tdee + GOAL_SURPLUS[goal];
}

// Protein target -- 1g per lb bodyweight (hypertrophy standard)
export function calculateProteinTarget(weightLbs: number): number {
  return Math.round(weightLbs);
}

// One-stop function -- gives you everything for the dashboard
export type Targets = {
  bmr: number;
  tdee: number;
  calories: number;
  protein: number;
  surplus: number;
};

// === CHANGED === added sex parameter (required type, null tolerated at runtime)
export function calculateTargets(
  weightLbs: number,
  heightFt: number,
  heightIn: number,
  age: number,
  activityLevel: ActivityLevel,
  goal: Goal,
  sex: Sex | null,
): Targets {
  const bmr = calculateBMR(weightLbs, heightFt, heightIn, age, sex);
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
