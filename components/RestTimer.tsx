// === NEW ===
// components/RestTimer.tsx
//
// Countdown timer that runs between sets.
// Self-contained: ticks down, fires a haptic at 0, supports −30/+30/Skip.
// Mount with a fresh `key` to restart from totalSeconds.

import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, radius, spacing, typography } from '../theme';

type Props = {
  totalSeconds: number;
  onSkip: () => void;
};

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function RestTimer({ totalSeconds, onSkip }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const isComplete = secondsLeft === 0;

  // Countdown tick — stops itself once secondsLeft reaches 0.
  useEffect(() => {
    if (isComplete) return;
    const id = setInterval(() => {
      setSecondsLeft(prev => {
        const next = Math.max(0, prev - 1);
        if (next === 0 && prev > 0) {
          // Just crossed zero — fire success haptic.
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isComplete]);

  function adjust(delta: number) {
    setSecondsLeft(s => Math.max(0, s + delta));
  }

  const progress = totalSeconds > 0 ? 1 - secondsLeft / totalSeconds : 1;

  return (
    <View style={styles.banner}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={[styles.label, isComplete && styles.labelComplete]}>
            {isComplete ? 'REST OVER' : 'REST'}
          </Text>
          <Text style={[styles.value, isComplete && styles.valueComplete]}>
            {isComplete ? 'Go!' : formatTime(secondsLeft)}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => adjust(-30)}
            style={styles.adjustBtn}
            disabled={isComplete}
            activeOpacity={0.7}
          >
            <Text style={[styles.adjustText, isComplete && styles.adjustTextDisabled]}>
              −30
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onSkip} style={styles.skipBtn} activeOpacity={0.85}>
            <Text style={styles.skipText}>{isComplete ? 'Done' : 'Skip'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => adjust(30)}
            style={styles.adjustBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.adjustText}>+30</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceElevated,
  },
  progressTrack: {
    height: 3,
    backgroundColor: colors.surfaceElevated,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  info: { flex: 1 },
  label: {
    ...typography.caption,
    color: colors.textTertiary,
    marginBottom: 2,
  },
  labelComplete: { color: colors.accent },
  value: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  valueComplete: { color: colors.accent },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  adjustBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceElevated,
    minWidth: 44,
    alignItems: 'center',
  },
  adjustText: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    fontSize: 13,
  },
  adjustTextDisabled: {
    color: colors.textTertiary,
  },
  skipBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.accent,
    minWidth: 60,
    alignItems: 'center',
  },
  skipText: {
    ...typography.bodyBold,
    color: colors.onAccent,
    fontSize: 13,
  },
});