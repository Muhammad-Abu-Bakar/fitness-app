// === NEW === Pure helpers for summarizing weight check-ins.
// No React, no storage — just math on an array of CheckIns.

import type { CheckIn } from './types';

// Internal: compare two check-ins chronologically.
// Primary key = date (YYYY-MM-DD sorts correctly lexicographically).
// Secondary key = timestamp, so two entries on the same day still have a defined order.
function isEarlier(a: CheckIn, b: CheckIn): boolean {
  if (a.date !== b.date) return a.date < b.date;
  return a.timestamp < b.timestamp;
}

/** Earliest check-in, or null if the list is empty. */
export function getStartingCheckIn(checkIns: CheckIn[]): CheckIn | null {
  if (checkIns.length === 0) return null;
  return checkIns.reduce((earliest, c) => (isEarlier(c, earliest) ? c : earliest));
}

/** Latest check-in, or null if the list is empty. */
export function getLatestCheckIn(checkIns: CheckIn[]): CheckIn | null {
  if (checkIns.length === 0) return null;
  return checkIns.reduce((latest, c) => (isEarlier(c, latest) ? latest : c));
}

/**
 * How much the user's weight has changed since their first check-in.
 * Returns 0 if fewer than 2 check-ins exist (no change to measure yet).
 * Rounded to 1 decimal place — the precision the scale gives.
 */
export function getTotalChangeLbs(checkIns: CheckIn[]): number {
  if (checkIns.length < 2) return 0;
  const start = getStartingCheckIn(checkIns)!;
  const latest = getLatestCheckIn(checkIns)!;
  return Math.round((latest.weightLbs - start.weightLbs) * 10) / 10;
}

/**
 * Format a weight change for display.
 *   +2.4 → "+2.4 lbs"
 *   -1.2 → "−1.2 lbs"  (uses Unicode minus for nicer typography)
 *    0   → "No change"
 */
export function formatWeightChange(changeLbs: number): string {
  if (changeLbs === 0) return 'No change';
  const sign = changeLbs > 0 ? '+' : '−';
  return `${sign}${Math.abs(changeLbs).toFixed(1)} lbs`;
}

/** Sort check-ins newest first. Used by the list screen. */
export function sortByDateDesc(checkIns: CheckIn[]): CheckIn[] {
  return [...checkIns].sort((a, b) => (isEarlier(a, b) ? 1 : isEarlier(b, a) ? -1 : 0));
}
