// === NEW ===
// app/workout/complete.tsx
//
// Celebration screen shown right after a workout finishes.
// Reads the just-completed session by id (passed as a URL param).

import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { colors, radius, spacing, typography } from '../../theme';
import { useWorkoutLog } from '../../context/workoutLog';
import { getProgramById } from '../../lib/workouts/programs';

export default function CompleteScreen() {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const { sessions } = useWorkoutLog();

  // Find the session by id. Fallback to newest in case of a param issue.
  const session = sessions.find(s => s.id === sessionId) ?? sessions[0];

  // === CHANGED === delay the haptic so it fires AFTER the screen transition lands.
  // iOS suppresses haptics during view animations, so firing immediately on mount
  // often gets swallowed silently.
  useEffect(() => {
    const t = setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 500);
    return () => clearTimeout(t);
  }, []);

  if (!session) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContent}>
          <Text style={styles.emptyText}>Couldn't find workout data.</Text>
          <TouchableOpacity
            onPress={() => router.replace('/home')}
            style={styles.emptyButton}
            activeOpacity={0.85}
          >
            <Text style={styles.emptyButtonText}>← Back to home</Text>
          </TouchableOpacity>
        </View>
        <StatusBar style="light" />
      </View>
    );
  }

  const program = getProgramById(session.programId);
  const day = program?.days.find(d => d.id === session.dayId);
  const dayName = day?.name ?? 'Workout';

  const totalSets = session.sets.length;
  const totalVolume = session.sets.reduce(
    (sum, s) => sum + s.weightLbs * s.reps,
    0,
  );
  const durationMinutes = session.completedAt
    ? Math.max(1, Math.round((session.completedAt - session.startedAt) / 60000))
    : 0;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.celebration}>
          <Text style={styles.emoji}>💪</Text>
          <Text style={styles.title}>Workout complete!</Text>
          <Text style={styles.subtitle}>{dayName}</Text>
        </View>

        <View style={styles.statsCard}>
          <StatItem label="sets logged" value={totalSets.toString()} />
          <View style={styles.divider} />
          <StatItem label="lbs lifted" value={totalVolume.toLocaleString()} />
          <View style={styles.divider} />
          <StatItem
            label={durationMinutes === 1 ? 'minute' : 'minutes'}
            value={durationMinutes.toString()}
          />
        </View>

        <Text style={styles.encouragement}>
          Eat well, sleep deep, repeat in 48 hours. That's how you grow.
        </Text>
      </ScrollView>

      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => router.replace('/home')}
        activeOpacity={0.85}
      >
        <Text style={styles.homeButtonText}>Back to home</Text>
      </TouchableOpacity>

      <StatusBar style="light" />
    </View>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: 80,
    paddingBottom: spacing.xl,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  celebration: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  emoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.display,
    fontSize: 40,
    lineHeight: 48,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.heading,
    color: colors.accent,
    textAlign: 'center',
  },

  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    marginBottom: spacing.xl,
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: {
    ...typography.display,
    fontSize: 32,
    lineHeight: 38,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  divider: {
    width: 1,
    height: 48,
    backgroundColor: colors.surfaceElevated,
  },

  encouragement: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: spacing.md,
  },

  homeButton: {
    backgroundColor: colors.accent,
    paddingVertical: 18,
    borderRadius: radius.lg,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  homeButtonText: {
    ...typography.button,
    color: colors.onAccent,
  },

  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...typography.heading,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  emptyButton: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
  },
  emptyButtonText: {
    ...typography.button,
    color: colors.onAccent,
  },
});