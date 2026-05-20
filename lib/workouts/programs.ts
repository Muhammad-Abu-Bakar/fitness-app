// === NEW ===
// lib/workouts/programs.ts
//
// Three programs, each optimized for one goal:
//   - Hardgainer PPL          (bulk)       — high volume, mass-building
//   - Lean & Strong            (lean)       — lower volume, preserve strength in deficit
//   - Beginner Full-Body       (exploring)  — Stronglifts-style, learn the lifts first
//
// Exercise IDs are reused across programs where the lift is identical
// (back-squat, barbell-bench-press) so future PR tracking sees them as one.

import type { Program, WorkoutDay } from './types';
import type { Goal } from '../../context/onboarding';

// ============================================================
// HARDGAINER PPL (bulk) — Push / Pull / Legs, high volume
// ============================================================

const pushDay: WorkoutDay = {
  id: 'push',
  name: 'Push Day',
  subtitle: 'Chest, Shoulders, Triceps',
  exercises: [
    { id: 'barbell-bench-press', name: 'Barbell Bench Press', category: 'compound', primaryMuscle: 'chest', sets: 4, repsLow: 6, repsHigh: 8, restSeconds: 150, notes: 'Pinch shoulder blades. Bar to mid-chest, not neck.' },
    { id: 'overhead-press', name: 'Overhead Press', category: 'compound', primaryMuscle: 'shoulders', sets: 3, repsLow: 6, repsHigh: 8, restSeconds: 120, notes: 'Squeeze glutes. Bar travels straight up over your head.' },
    { id: 'incline-dumbbell-press', name: 'Incline Dumbbell Press', category: 'compound', primaryMuscle: 'chest', sets: 3, repsLow: 8, repsHigh: 10, restSeconds: 90, notes: 'Bench at 30-45 degrees. Stop just short of lockout.' },
    { id: 'dips', name: 'Dips', category: 'compound', primaryMuscle: 'triceps', sets: 3, repsLow: 8, repsHigh: 12, restSeconds: 90, notes: 'Lean forward for chest, stay upright for triceps.' },
    { id: 'lateral-raises', name: 'Lateral Raises', category: 'isolation', primaryMuscle: 'shoulders', sets: 3, repsLow: 12, repsHigh: 15, restSeconds: 60, notes: 'Light weight, slow tempo. Lead with your elbows.' },
    { id: 'tricep-pushdown', name: 'Tricep Pushdown', category: 'isolation', primaryMuscle: 'triceps', sets: 3, repsLow: 10, repsHigh: 12, restSeconds: 60, notes: 'Elbows pinned. Squeeze at the bottom.' },
  ],
};

const pullDay: WorkoutDay = {
  id: 'pull',
  name: 'Pull Day',
  subtitle: 'Back, Biceps',
  exercises: [
    { id: 'deadlift', name: 'Deadlift', category: 'compound', primaryMuscle: 'back', sets: 3, repsLow: 5, repsHigh: 5, restSeconds: 180, notes: "Bar over mid-foot. Push the floor away, don't yank up." },
    { id: 'pull-ups', name: 'Pull-ups', category: 'compound', primaryMuscle: 'back', sets: 3, repsLow: 6, repsHigh: 10, restSeconds: 120, notes: "Full hang at bottom, chin over bar at top. Sub lat pulldown if you can't hit 6 yet." },
    { id: 'barbell-row', name: 'Barbell Row', category: 'compound', primaryMuscle: 'back', sets: 3, repsLow: 6, repsHigh: 8, restSeconds: 120, notes: 'Hinge at the hips. Pull the bar to your lower chest.' },
    { id: 'face-pulls', name: 'Face Pulls', category: 'isolation', primaryMuscle: 'shoulders', sets: 3, repsLow: 12, repsHigh: 15, restSeconds: 60, notes: 'High elbows. Pull rope to your forehead, not your chin.' },
    { id: 'barbell-curl', name: 'Barbell Curl', category: 'isolation', primaryMuscle: 'biceps', sets: 3, repsLow: 8, repsHigh: 12, restSeconds: 60, notes: 'No swinging. Slow on the way down.' },
    { id: 'hammer-curl', name: 'Hammer Curl', category: 'isolation', primaryMuscle: 'biceps', sets: 3, repsLow: 10, repsHigh: 12, restSeconds: 60, notes: 'Neutral grip. Keep elbows still.' },
  ],
};

const legDay: WorkoutDay = {
  id: 'legs',
  name: 'Leg Day',
  subtitle: 'Quads, Hamstrings, Glutes, Calves',
  exercises: [
    { id: 'back-squat', name: 'Back Squat', category: 'compound', primaryMuscle: 'quads', sets: 4, repsLow: 6, repsHigh: 8, restSeconds: 180, notes: 'Chest up. Sit between your heels. Hit at least parallel.' },
    { id: 'romanian-deadlift', name: 'Romanian Deadlift', category: 'compound', primaryMuscle: 'hamstrings', sets: 3, repsLow: 8, repsHigh: 10, restSeconds: 120, notes: 'Soft knees, push hips back. Feel it in your hamstrings.' },
    { id: 'leg-press', name: 'Leg Press', category: 'compound', primaryMuscle: 'quads', sets: 3, repsLow: 10, repsHigh: 12, restSeconds: 90, notes: "Don't lock your knees at the top. Feet shoulder-width." },
    { id: 'leg-curl', name: 'Leg Curl', category: 'isolation', primaryMuscle: 'hamstrings', sets: 3, repsLow: 10, repsHigh: 12, restSeconds: 60, notes: 'Slow on the way down. Squeeze at the top.' },
    { id: 'calf-raises', name: 'Standing Calf Raises', category: 'isolation', primaryMuscle: 'calves', sets: 4, repsLow: 12, repsHigh: 15, restSeconds: 60, notes: 'Pause one second at the top of every rep.' },
  ],
};

// ============================================================
// LEAN & STRONG (lean) — Upper/Lower split, strength-preservation focus
// Designed for deficit phases: heavy compounds, reduced accessory volume,
// recovery is harder when calories are low.
// ============================================================

const upperA: WorkoutDay = {
  id: 'upper-a',
  name: 'Upper Strength',
  subtitle: 'Preserve pressing + pulling strength',
  exercises: [
    { id: 'barbell-bench-press', name: 'Barbell Bench Press', category: 'compound', primaryMuscle: 'chest', sets: 4, repsLow: 5, repsHigh: 6, restSeconds: 180, notes: 'Heavy 5s. Preserve strength while in deficit.' },
    { id: 'barbell-row', name: 'Barbell Row', category: 'compound', primaryMuscle: 'back', sets: 4, repsLow: 5, repsHigh: 6, restSeconds: 150, notes: 'Match your bench progression. Bar to lower chest.' },
    { id: 'overhead-press', name: 'Overhead Press', category: 'compound', primaryMuscle: 'shoulders', sets: 3, repsLow: 6, repsHigh: 8, restSeconds: 120, notes: 'Strict press. No leg drive, no swaying.' },
    { id: 'pull-ups', name: 'Pull-ups (or assisted)', category: 'compound', primaryMuscle: 'back', sets: 3, repsLow: 6, repsHigh: 10, restSeconds: 90, notes: 'Bands or machine assist if needed.' },
    { id: 'barbell-curl', name: 'Barbell Curl', category: 'isolation', primaryMuscle: 'biceps', sets: 2, repsLow: 10, repsHigh: 12, restSeconds: 60, notes: 'Lower volume on accessories — focus is the big compounds.' },
    { id: 'tricep-pushdown', name: 'Tricep Pushdown', category: 'isolation', primaryMuscle: 'triceps', sets: 2, repsLow: 10, repsHigh: 12, restSeconds: 60, notes: 'Elbows pinned. Squeeze hard.' },
  ],
};

const lowerA: WorkoutDay = {
  id: 'lower-a',
  name: 'Lower Strength',
  subtitle: 'Preserve squat + deadlift strength',
  exercises: [
    { id: 'back-squat', name: 'Back Squat', category: 'compound', primaryMuscle: 'quads', sets: 4, repsLow: 5, repsHigh: 5, restSeconds: 180, notes: 'Heavy 5s. Pure strength work.' },
    { id: 'romanian-deadlift', name: 'Romanian Deadlift', category: 'compound', primaryMuscle: 'hamstrings', sets: 3, repsLow: 6, repsHigh: 8, restSeconds: 120, notes: 'Hinge from hips. Heavy but controlled.' },
    { id: 'leg-press', name: 'Leg Press', category: 'compound', primaryMuscle: 'quads', sets: 3, repsLow: 8, repsHigh: 10, restSeconds: 90, notes: 'Full range. No knee lockout at the top.' },
    { id: 'leg-curl', name: 'Leg Curl', category: 'isolation', primaryMuscle: 'hamstrings', sets: 2, repsLow: 10, repsHigh: 12, restSeconds: 60, notes: 'Lower volume than bulk programs — recovery is the bottleneck on a cut.' },
    { id: 'calf-raises', name: 'Standing Calf Raises', category: 'isolation', primaryMuscle: 'calves', sets: 3, repsLow: 12, repsHigh: 15, restSeconds: 60, notes: 'Full range. Pause at the top.' },
  ],
};

const upperB: WorkoutDay = {
  id: 'upper-b',
  name: 'Upper Volume',
  subtitle: 'Just enough volume to keep growing',
  exercises: [
    { id: 'incline-dumbbell-press', name: 'Incline Dumbbell Press', category: 'compound', primaryMuscle: 'chest', sets: 3, repsLow: 8, repsHigh: 10, restSeconds: 120, notes: 'Slight stretch at the bottom.' },
    { id: 'lat-pulldown', name: 'Lat Pulldown', category: 'compound', primaryMuscle: 'back', sets: 3, repsLow: 8, repsHigh: 10, restSeconds: 90, notes: 'Pull to upper chest. Drive elbows down.' },
    { id: 'dumbbell-bench-press', name: 'Dumbbell Bench Press', category: 'compound', primaryMuscle: 'chest', sets: 3, repsLow: 10, repsHigh: 12, restSeconds: 90, notes: 'Slight stretch at the bottom.' },
    { id: 'seated-cable-row', name: 'Seated Cable Row', category: 'compound', primaryMuscle: 'back', sets: 3, repsLow: 10, repsHigh: 12, restSeconds: 90, notes: 'Pull to lower chest. Squeeze shoulder blades.' },
    { id: 'lateral-raises', name: 'Lateral Raises', category: 'isolation', primaryMuscle: 'shoulders', sets: 2, repsLow: 12, repsHigh: 15, restSeconds: 60, notes: 'Light. Strict form.' },
    { id: 'hammer-curl', name: 'Hammer Curl', category: 'isolation', primaryMuscle: 'biceps', sets: 2, repsLow: 10, repsHigh: 12, restSeconds: 60 },
  ],
};

const lowerB: WorkoutDay = {
  id: 'lower-b',
  name: 'Lower Volume',
  subtitle: 'Higher-rep work to maintain muscle',
  exercises: [
    { id: 'front-squat', name: 'Front Squat', category: 'compound', primaryMuscle: 'quads', sets: 3, repsLow: 8, repsHigh: 10, restSeconds: 150, notes: 'Elbows high. More quad-dominant.' },
    { id: 'romanian-deadlift', name: 'Romanian Deadlift', category: 'compound', primaryMuscle: 'hamstrings', sets: 3, repsLow: 10, repsHigh: 12, restSeconds: 120, notes: 'Lighter than your Upper A weights. Volume work.' },
    { id: 'walking-lunges', name: 'Walking Lunges', category: 'compound', primaryMuscle: 'quads', sets: 3, repsLow: 10, repsHigh: 12, restSeconds: 90, notes: 'Per leg. Long stride.' },
    { id: 'leg-extension', name: 'Leg Extension', category: 'isolation', primaryMuscle: 'quads', sets: 2, repsLow: 12, repsHigh: 15, restSeconds: 60, notes: 'Squeeze at the top.' },
    { id: 'seated-calf-raises', name: 'Seated Calf Raises', category: 'isolation', primaryMuscle: 'calves', sets: 3, repsLow: 15, repsHigh: 20, restSeconds: 45, notes: 'High reps. Targets soleus.' },
  ],
};

// ============================================================
// BEGINNER FULL-BODY (exploring) — Stronglifts-inspired
// ============================================================

const fullBodyA: WorkoutDay = {
  id: 'fb-a',
  name: 'Workout A',
  subtitle: 'Squat focus — Squat, Bench, Row',
  exercises: [
    { id: 'back-squat', name: 'Back Squat', category: 'compound', primaryMuscle: 'quads', sets: 3, repsLow: 5, repsHigh: 5, restSeconds: 180, notes: 'Add 5 lbs every session you complete all 3x5.' },
    { id: 'barbell-bench-press', name: 'Barbell Bench Press', category: 'compound', primaryMuscle: 'chest', sets: 3, repsLow: 5, repsHigh: 5, restSeconds: 150, notes: '+5 lbs when you hit all reps.' },
    { id: 'barbell-row', name: 'Barbell Row', category: 'compound', primaryMuscle: 'back', sets: 3, repsLow: 5, repsHigh: 5, restSeconds: 120, notes: 'Pendlay style: bar starts on floor every rep.' },
    { id: 'tricep-pushdown', name: 'Tricep Pushdown', category: 'isolation', primaryMuscle: 'triceps', sets: 2, repsLow: 10, repsHigh: 12, restSeconds: 60, notes: 'Light accessory work.' },
    { id: 'barbell-curl', name: 'Barbell Curl', category: 'isolation', primaryMuscle: 'biceps', sets: 2, repsLow: 10, repsHigh: 12, restSeconds: 60, notes: 'Optional. Skip if pressed for time.' },
  ],
};

const fullBodyB: WorkoutDay = {
  id: 'fb-b',
  name: 'Workout B',
  subtitle: 'Deadlift focus — Squat, OHP, Deadlift',
  exercises: [
    { id: 'back-squat', name: 'Back Squat', category: 'compound', primaryMuscle: 'quads', sets: 3, repsLow: 5, repsHigh: 5, restSeconds: 180, notes: 'Squat every session — legs recover faster than upper body.' },
    { id: 'overhead-press', name: 'Overhead Press', category: 'compound', primaryMuscle: 'shoulders', sets: 3, repsLow: 5, repsHigh: 5, restSeconds: 150, notes: 'Bar at upper chest. Strict press, no leg drive.' },
    { id: 'deadlift', name: 'Conventional Deadlift', category: 'compound', primaryMuscle: 'back', sets: 1, repsLow: 5, repsHigh: 5, restSeconds: 180, notes: 'One heavy set. Add 10 lbs each session.' },
    { id: 'pull-ups', name: 'Pull-ups (or assisted)', category: 'compound', primaryMuscle: 'back', sets: 3, repsLow: 5, repsHigh: 10, restSeconds: 90, notes: 'Bands or machine assist if needed.' },
    { id: 'hammer-curl', name: 'Hammer Curl', category: 'isolation', primaryMuscle: 'biceps', sets: 2, repsLow: 10, repsHigh: 12, restSeconds: 60, notes: 'Optional accessory.' },
  ],
};

// ============================================================
// PROGRAM LIBRARY
// ============================================================

export const PROGRAMS: Program[] = [
  {
    id: 'hardgainer-ppl',
    name: 'Hardgainer PPL',
    description:
      'Heavy compounds, high volume, three sessions a week. Built for the surplus — when calories are high, recovery follows.',
    durationWeeks: 8,
    daysPerWeek: 3,
    level: 'beginner',
    goal: 'gain',
    days: [pushDay, pullDay, legDay],
  },
  {
    id: 'lean-strong',
    name: 'Lean & Strong',
    description:
      'Upper/Lower 4-day split with strength-first programming. Keep your numbers high while calories run low — the proven way to preserve muscle on a cut.',
    durationWeeks: 12,
    daysPerWeek: 4,
    level: 'intermediate',
    goal: 'lose',
    days: [upperA, lowerA, upperB, lowerB],
  },
  {
    id: 'beginner-full-body',
    name: 'Beginner Full-Body',
    description:
      'Three full-body sessions a week. Squat every visit. Add weight every session you hit all reps. Built for your first months in the gym.',
    durationWeeks: 8,
    daysPerWeek: 3,
    level: 'beginner',
    goal: 'gain',
    days: [fullBodyA, fullBodyB],
  },
];

// ============================================================
// GOAL FIT — strict 1:1 (each program serves one goal)
// ============================================================

export const PROGRAM_GOAL_FIT: Record<string, Goal[]> = {
  'hardgainer-ppl': ['bulk'],
  'lean-strong': ['lean'],
  'beginner-full-body': ['exploring'],
};

// ============================================================
// PROGRAM IMAGES — REPLACE THESE WITH YOUR OWN UNSPLASH PHOTOS
//
// To find your own:
//   1. Go to https://unsplash.com
//   2. Search "gym", "weightlifting", "fitness", "bodybuilding"
//   3. Click a photo you like → right-click the image → "Copy image address"
//   4. Paste the URL in here
//
// Add ?w=800&q=80 at the end to make the image load faster.
// Unsplash is free for commercial use. Attribution is optional but appreciated.
//
// The URLs below are best-guesses — verify they load on device. If broken,
// browse Unsplash yourself and replace.
// ============================================================

export const PROGRAM_IMAGES: Record<string, string> = {
  'hardgainer-ppl':
    'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80',
  'lean-strong':
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
  'beginner-full-body':
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
};

// ============================================================
// HELPERS
// ============================================================

export function getAllPrograms(): Program[] {
  return PROGRAMS;
}

export function getProgramById(id: string): Program | undefined {
  return PROGRAMS.find((p) => p.id === id);
}

// === NEW === programs that match the user's goal (strict 1:1)
export function getProgramsForGoal(goal: Goal | null): Program[] {
  if (!goal) return PROGRAMS;
  return PROGRAMS.filter((p) => PROGRAM_GOAL_FIT[p.id]?.includes(goal));
}
