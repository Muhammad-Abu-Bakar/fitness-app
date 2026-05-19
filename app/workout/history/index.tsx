// === NEW === workout history list — every completed session, newest first
// === CHANGED === lime training-domain reskin
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight, Dumbbell } from 'lucide-react-native'; // === NEW ===
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
import { tapLight, tapMedium } from '../../../lib/haptics';

export default function WorkoutHistoryScreen() {
  const router = useRouter();
  const { sessions, isLoaded } = useWorkoutLog();

  if (!isLoaded) return null;

  // === CHANGED === filter out empty sessions — they clutter history with no value
  const completed = sessions.filter((s) => s.completedAt !== null && s.sets.length > 0);

  // === NEW === light haptic on back nav
  const handleBack = () => {
    tapLight();
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* === CHANGED === slim 40x40 icon back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ChevronLeft size={22} color={colors.textPrimary} strokeWidth={2} />
        </TouchableOpacity>

        {/* === NEW === lime eyebrow */}
        <Text style={styles.eyebrow}>HISTORY</Text>

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
              onPress={() => {
                tapMedium();
                router.push('/workouts');
              }}
              activeOpacity={0.85}
            >
              <Dumbbell size={18} color={colors.onAccentTrain} strokeWidth={2.5} />
              <Text style={styles.emptyCtaText}>Browse programs</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.list}>
            {completed.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onPress={() => {
                  tapLight();
                  router.push(`/workout/history/${session.id}`);
                }}
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
        {/* === CHANGED === count + chevron affordance */}
        <View style={styles.dayHeaderRight}>
          <Text style={styles.entryCount}>
            {exercises} {exercises === 1 ? 'exercise' : 'exercises'}
          </Text>
          <ChevronRight size={16} color={colors.textTertiary} strokeWidth={2} />
        </View>
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
    backgroundColor: colors.backgroundSolid, // === CHANGED ===
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.xl,
  },
  scroll: { paddingBottom: spacing.xl },
  // === CHANGED === slim 40x40 icon back button
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginBottom: spacing.lg,
  },
  // === NEW === eyebrow
  eyebrow: {
    ...typography.bodyBold,
    color: colors.accentTrain,
    fontSize: 12,
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
  },
  title: { ...typography.title, color: colors.textPrimary, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },

  list: { gap: spacing.md },
  // === CHANGED === session card with thin lime accent border
  dayCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(163,230,53,0.18)', // === NEW === 18% lime — domain mark
  },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  // === NEW === right side of header (count + chevron)
  dayHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  dayLabel: { ...typography.heading, color: colors.textPrimary },
  entryCount: { ...typography.body, color: colors.textTertiary, fontSize: 14 },
  programLine: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
  dayStats: { marginTop: spacing.md, gap: spacing.sm },
  statRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statLabel: { ...typography.body, color: colors.textSecondary },
  statValue: { ...typography.bodyBold, color: colors.textPrimary },

  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1, // === NEW ===
    borderColor: colors.borderSubtle, // === NEW ===
  },
  emptyTitle: { ...typography.heading, color: colors.textPrimary, marginBottom: spacing.sm },
  emptyBody: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  // === CHANGED === lime CTA with icon
  emptyCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.accentTrain,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  emptyCtaText: { ...typography.bodyBold, color: colors.onAccentTrain },
});
