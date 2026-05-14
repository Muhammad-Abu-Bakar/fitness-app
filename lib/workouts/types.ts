// === NEW ===
// Types for workout programs.
// A Program contains WorkoutDays. Each WorkoutDay contains Exercises.
// This is the TEMPLATE — the user's actual logged sets/weights are separate (coming Day 15+).

export type ExerciseCategory = 'compound' | 'isolation';

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'core';

export type ProgramLevel = 'beginner' | 'intermediate' | 'advanced';
export type ProgramGoal = 'gain' | 'lose' | 'maintain';

// One exercise as it appears in a program template
// (NOT a logged set — logging comes in Day 15)
export interface Exercise {
  id: string;             // slug, e.g. "barbell-bench-press"
  name: string;           // display name, e.g. "Barbell Bench Press"
  category: ExerciseCategory;
  primaryMuscle: MuscleGroup;
  sets: number;           // working sets, e.g. 4
  repsLow: number;        // bottom of rep range, e.g. 6
  repsHigh: number;       // top of rep range, e.g. 8
  restSeconds: number;    // rest between sets, e.g. 120
  notes?: string;         // optional cue, e.g. "Keep elbows tucked"
}

// One training day inside a program (e.g. "Push Day")
export interface WorkoutDay {
  id: string;             // e.g. "push"
  name: string;           // e.g. "Push Day"
  subtitle?: string;      // e.g. "Chest, Shoulders, Triceps"
  exercises: Exercise[];
}

// A full program (e.g. "Hardgainer PPL")
export interface Program {
  id: string;             // slug, e.g. "hardgainer-ppl"
  name: string;
  description: string;    // one-line pitch shown on the card
  durationWeeks: number;  // e.g. 8
  daysPerWeek: number;    // e.g. 3
  level: ProgramLevel;
  goal: ProgramGoal;
  days: WorkoutDay[];
}