// === NEW === workout history list — every completed session, newest first
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, radius, typography } from '../../../theme';
import { useWorkoutLog } from '../../../context/workoutLog';
import { getProgramById } from '../../../lib/workouts/programs';
import {
  getSessionDurationSeconds,
  formatDuration,
  getSessionVolumeLbs,
  getSessionSetCount,
  getSessionExerciseCount,
} from '../../../lib/workouts/sessionStats';
import { formatDateLabel } from '../../../lib/dates';
import type { WorkoutSession } from '../../../lib/workouts/types';

export default function WorkoutHistoryScreen() {
  const router = useRouter();
  const { sessions, isLoaded } = useWorkoutLog();

  // Wait for AsyncStorage hydration so we don't flash the empty state on launch
  if (!isLoaded) return null;

  // Only show finished sessions. Defensive filter — context already separates
  // active vs completed, but this keeps the screen safe if anything changes.
  const completed = sessions.filter((s) => s.completedAt !== null);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Workout History</Text>
        <Text style={styles.subtitle}>
          Every session you've finished. Tap one to see the details.
        </Text>

        {completed.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No workouts yet</Text>
            <Text style={styles.emptyBody}>
              Finish a workout and it'll show up here with stats.
            </Text>
            <TouchableOpacity
              style={styles.emptyCta}
              onPress={() => router.push('/workouts')}
              activeOpacity={0.85}
            >
              <Text style={styles.emptyCtaText}>Browse programs</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.list}>
            {completed.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onPress={() => router.push(`/workout/history/${session.id}`)}
              />
            ))}
          </View>
        )}
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
}

interface SessionCardProps {
  session: WorkoutSession;
  onPress: () => void;
}

function SessionCard({ session, onPress }: SessionCardProps) {
  // Look up the program + day to show their friendly names.
  // Fallbacks cover the case where a program was renamed/removed after this session was saved.
  const program = getProgramById(session.programId);
  const day = program?.days.find((d) => d.id === session.dayId);
  const programName = program?.name ?? 'Workout';
  const dayName = day?.name ?? session.dayId;

  const duration = formatDuration(getSessionDurationSeconds(session));
  const volume = getSessionVolumeLbs(session);
  const sets = getSessionSetCount(session);
  const exercises = getSessionExerciseCount(session);

  return (
    <TouchableOpacity style={styles.dayCard} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.dayHeader}>
        <Text style={styles.dayLabel}>{formatDateLabel(session.date)}</Text>
        <Text style={styles.entryCount}>
          {exercises} {exercises === 1 ? 'exercise' : 'exercises'}
        </Text>
      </View>

      <Text style={styles.programLine}>
        {programName} · {dayName}
      </Text>

      <View style={styles.dayStats}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Duration</Text>
          <Text style={styles.statValue}>{duration}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Volume</Text>
          <Text style={styles.statValue}>{volume.toLocaleString()} lbs</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Sets</Text>
          <Text style={styles.statValue}>{sets}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.xl,
  },
  scroll: { paddingBottom: spacing.xl },
  backButton: { alignSelf: 'flex-start', paddingVertical: spacing.sm, marginBottom: spacing.md },
  backText: { ...typography.bodyBold, color: colors.accent },
  title: { ...typography.title, color: colors.textPrimary, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },

  // Card list
  list: { gap: spacing.md },
  dayCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dayLabel: { ...typography.heading, color: colors.textPrimary },
  entryCount: { ...typography.body, color: colors.textTertiary, fontSize: 14 },
  programLine: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
  dayStats: { marginTop: spacing.md, gap: spacing.sm },
  statRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statLabel: { ...typography.body, color: colors.textSecondary },
  statValue: { ...typography.bodyBold, color: colors.textPrimary },

  // Empty state
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  emptyTitle: { ...typography.heading, color: colors.textPrimary, marginBottom: spacing.sm },
  emptyBody: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  emptyCta: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  emptyCtaText: { ...typography.bodyBold, color: colors.onAccent },
});
