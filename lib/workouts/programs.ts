// === NEW ===
// lib/workouts/programs.ts
//
// Starter program library.
// v1 ships with one program: the Hardgainer PPL.
// More programs (Upper/Lower, PHUL, 5x5, etc.) come in the premium tier later.

import type { Program, WorkoutDay } from './types';

// -------- PUSH DAY --------
const pushDay: WorkoutDay = {
  id: 'push',
  name: 'Push Day',
  subtitle: 'Chest, Shoulders, Triceps',
  exercises: [
    {
      id: 'barbell-bench-press',
      name: 'Barbell Bench Press',
      category: 'compound',
      primaryMuscle: 'chest',
      sets: 4,
      repsLow: 6,
      repsHigh: 8,
      restSeconds: 150,
      notes: 'Pinch shoulder blades. Bar to mid-chest, not neck.',
    },
    {
      id: 'overhead-press',
      name: 'Overhead Press',
      category: 'compound',
      primaryMuscle: 'shoulders',
      sets: 3,
      repsLow: 6,
      repsHigh: 8,
      restSeconds: 120,
      notes: 'Squeeze glutes. Bar travels straight up over your head.',
    },
    {
      id: 'incline-dumbbell-press',
      name: 'Incline Dumbbell Press',
      category: 'compound',
      primaryMuscle: 'chest',
      sets: 3,
      repsLow: 8,
      repsHigh: 10,
      restSeconds: 90,
      notes: 'Bench at 30–45°. Stop just short of lockout.',
    },
    {
      id: 'dips',
      name: 'Dips',
      category: 'compound',
      primaryMuscle: 'triceps',
      sets: 3,
      repsLow: 8,
      repsHigh: 12,
      restSeconds: 90,
      notes: 'Lean forward for chest, stay upright for triceps.',
    },
    {
      id: 'lateral-raises',
      name: 'Lateral Raises',
      category: 'isolation',
      primaryMuscle: 'shoulders',
      sets: 3,
      repsLow: 12,
      repsHigh: 15,
      restSeconds: 60,
      notes: 'Light weight, slow tempo. Lead with your elbows.',
    },
    {
      id: 'tricep-pushdown',
      name: 'Tricep Pushdown',
      category: 'isolation',
      primaryMuscle: 'triceps',
      sets: 3,
      repsLow: 10,
      repsHigh: 12,
      restSeconds: 60,
      notes: 'Elbows pinned to your sides. Squeeze hard at the bottom.',
    },
  ],
};

// -------- PULL DAY --------
const pullDay: WorkoutDay = {
  id: 'pull',
  name: 'Pull Day',
  subtitle: 'Back, Biceps',
  exercises: [
    {
      id: 'deadlift',
      name: 'Deadlift',
      category: 'compound',
      primaryMuscle: 'back',
      sets: 3,
      repsLow: 5,
      repsHigh: 5,
      restSeconds: 180,
      notes: "Bar over mid-foot. Push the floor away, don't yank up.",
    },
    {
      id: 'pull-ups',
      name: 'Pull-ups',
      category: 'compound',
      primaryMuscle: 'back',
      sets: 3,
      repsLow: 6,
      repsHigh: 10,
      restSeconds: 120,
      notes: 'Full hang at bottom, chin over bar at top. Sub lat pulldown if you can\'t hit 6 yet.',
    },
    {
      id: 'barbell-row',
      name: 'Barbell Row',
      category: 'compound',
      primaryMuscle: 'back',
      sets: 3,
      repsLow: 6,
      repsHigh: 8,
      restSeconds: 120,
      notes: 'Hinge at the hips. Pull the bar to your lower chest.',
    },
    {
      id: 'face-pulls',
      name: 'Face Pulls',
      category: 'isolation',
      primaryMuscle: 'shoulders',
      sets: 3,
      repsLow: 12,
      repsHigh: 15,
      restSeconds: 60,
      notes: 'High elbows. Pull rope to your forehead, not your chin.',
    },
    {
      id: 'barbell-curl',
      name: 'Barbell Curl',
      category: 'isolation',
      primaryMuscle: 'biceps',
      sets: 3,
      repsLow: 8,
      repsHigh: 12,
      restSeconds: 60,
      notes: 'No swinging. Slow on the way down.',
    },
    {
      id: 'hammer-curl',
      name: 'Hammer Curl',
      category: 'isolation',
      primaryMuscle: 'biceps',
      sets: 3,
      repsLow: 10,
      repsHigh: 12,
      restSeconds: 60,
      notes: 'Neutral grip. Keep elbows still.',
    },
  ],
};

// -------- LEG DAY --------
const legDay: WorkoutDay = {
  id: 'legs',
  name: 'Leg Day',
  subtitle: 'Quads, Hamstrings, Glutes, Calves',
  exercises: [
    {
      id: 'back-squat',
      name: 'Back Squat',
      category: 'compound',
      primaryMuscle: 'quads',
      sets: 4,
      repsLow: 6,
      repsHigh: 8,
      restSeconds: 180,
      notes: 'Chest up. Sit between your heels. Hit at least parallel.',
    },
    {
      id: 'romanian-deadlift',
      name: 'Romanian Deadlift',
      category: 'compound',
      primaryMuscle: 'hamstrings',
      sets: 3,
      repsLow: 8,
      repsHigh: 10,
      restSeconds: 120,
      notes: 'Soft knees, push hips back. Feel it in your hamstrings.',
    },
    {
      id: 'leg-press',
      name: 'Leg Press',
      category: 'compound',
      primaryMuscle: 'quads',
      sets: 3,
      repsLow: 10,
      repsHigh: 12,
      restSeconds: 90,
      notes: "Don't lock your knees at the top. Feet shoulder-width.",
    },
    {
      id: 'leg-curl',
      name: 'Leg Curl',
      category: 'isolation',
      primaryMuscle: 'hamstrings',
      sets: 3,
      repsLow: 10,
      repsHigh: 12,
      restSeconds: 60,
      notes: 'Slow on the way down. Squeeze at the top.',
    },
    {
      id: 'calf-raises',
      name: 'Standing Calf Raises',
      category: 'isolation',
      primaryMuscle: 'calves',
      sets: 4,
      repsLow: 12,
      repsHigh: 15,
      restSeconds: 60,
      notes: 'Full range of motion. Pause one second at the top of every rep.',
    },
  ],
};

// -------- PROGRAMS LIBRARY --------
// Add new programs to this array and they'll show up in the list automatically.
export const PROGRAMS: Program[] = [
  {
    id: 'hardgainer-ppl',
    name: 'Hardgainer PPL',
    description:
      'Three sessions a week built around heavy compounds. The fastest path to size for skinny lifters who hate junk volume.',
    durationWeeks: 8,
    daysPerWeek: 3,
    level: 'beginner',
    goal: 'gain',
    days: [pushDay, pullDay, legDay],
  },
];

// -------- HELPERS --------
// Used by the programs list screen (Step 3).
export function getAllPrograms(): Program[] {
  return PROGRAMS;
}

// Used by the program detail screen (Step 4) to look up a program by URL param.
export function getProgramById(id: string): Program | undefined {
  return PROGRAMS.find((p) => p.id === id);
}