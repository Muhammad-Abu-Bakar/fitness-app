// === NEW === pure helpers for summarizing a completed workout session
import type { WorkoutSession } from './types';

/**
 * Duration of a finished session in seconds.
 * Returns 0 if the session was never marked completed (defensive).
 */
export function getSessionDurationSeconds(session: WorkoutSession): number {
  if (!session.completedAt) return 0;
  return Math.max(0, Math.round((session.completedAt - session.startedAt) / 1000));
}

/**
 * Human-readable duration like "47m" or "1h 12m".
 * Takes seconds so it's reusable for any time span (rest timer too, later).
 */
export function formatDuration(totalSeconds: number): string {
  const totalMinutes = Math.round(totalSeconds / 60);
  if (totalMinutes < 1) return '<1m';
  if (totalMinutes < 60) return `${totalMinutes}m`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
}

/**
 * Sum of weight × reps across every logged set.
 * This is the standard "total volume" gym metric — a single number that
 * captures how much hard work the user did.
 */
export function getSessionVolumeLbs(session: WorkoutSession): number {
  return session.sets.reduce((sum, set) => sum + set.weightLbs * set.reps, 0);
}

/** Total number of logged sets across all exercises. */
export function getSessionSetCount(session: WorkoutSession): number {
  return session.sets.length;
}

/** How many distinct exercises had at least one logged set. */
export function getSessionExerciseCount(session: WorkoutSession): number {
  return new Set(session.sets.map((s) => s.exerciseId)).size;
}