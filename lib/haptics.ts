// === NEW === Day 18 polish — semantic haptic helpers.
// Each function wraps an expo-haptics call so screens read clearly:
//   success()    not Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
//
// All calls are .catch'd silently so failures (e.g. user has "System Haptics"
// off in iOS Settings, or Android device without a taptic engine) just no-op.

import * as Haptics from 'expo-haptics';

/** Light tap — for low-stakes interactions like nav card presses. */
export function tapLight(): void {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

/** Medium tap — for primary action buttons (Save, +Log, etc.). */
export function tapMedium(): void {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
}

/** Success — short rising double-bump for save/log completion. */
export function success(): void {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}

/** Warning — slow double-bump for destructive actions like delete. */
export function warning(): void {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
}

/** Error — sharp triple-bump for invalid/failed actions. */
export function error(): void {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
}
