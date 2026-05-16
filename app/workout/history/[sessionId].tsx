// === NEW === workout session detail — full breakdown of one completed session
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, spacing, radius, typography } from '../../../theme';
import { useWorkoutLog } from '../../../context/workoutLog';
import { getProgramById } from '../../../lib/workouts/programs';
import {
  getSessionDurationSeconds,
  formatDuration,
  getSessionVolumeLbs,
  getSessionSetCount,
} from '../../../lib/workouts/sessionStats';
import { formatDateLabel } from '../../../lib/dates';
import type { LoggedSet } from '../../../lib/workouts/types';

export default function WorkoutSessionDetailScreen() {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const { sessions, isLoaded } = useWorkoutLog();

  if (!isLoaded) return null;

  const session = sessions.find((s) => s.id === sessionId);

  // Session not found — friendly fallback instead of a blank screen.
  // Can happen if the user shares an old link or the session was cleared.
  if (!session) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.notFoundCard}>
          <Text style={styles.notFoundTitle}>Session not found</Text>
          <Text style={styles.notFoundBody}>
            This workout session doesn't exist or was deleted.
          </Text>
        </View>
        <StatusBar style="light" />
      </View>
    );
  }

  const program = getProgramById(session.programId);
  const day = program?.days.find((d) => d.id === session.dayId);
  const programName = program?.name ?? 'Workout';
  const dayName = day?.name ?? session.dayId;

  // Summary stats
  const duration = formatDuration(getSessionDurationSeconds(session));
  const volume = getSessionVolumeLbs(session);
  const setCount = getSessionSetCount(session);

  // Group sets by exercise, in program order
  const exerciseGroups = buildExerciseGroups(session.sets, day?.exercises);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.date}>{formatDateLabel(session.date)}</Text>
        <Text style={styles.programLine}>{programName} · {dayName}</Text>

        {/* Summary stats grid — 3 tiles side by side */}
        <View style={styles.statsGrid}>
          <View style={styles.statTile}>
            <Text style={styles.statTileValue}>{duration}</Text>
            <Text style={styles.statTileLabel}>Duration</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={styles.statTileValue}>{volume.toLocaleString()}</Text>
            <Text style={styles.statTileLabel}>Volume (lbs)</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={styles.statTileValue}>{setCount}</Text>
            <Text style={styles.statTileLabel}>{setCount === 1 ? 'Set' : 'Sets'}</Text>
          </View>
        </View>

        {/* Exercise-by-exercise breakdown */}
        <Text style={styles.sectionTitle}>EXERCISES</Text>

        {exerciseGroups.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyBody}>No sets were logged in this session.</Text>
          </View>
        ) : (
          <View style={styles.exerciseList}>
            {exerciseGroups.map((group) => (
              <View key={group.exerciseId} style={styles.exerciseCard}>
                <Text style={styles.exerciseName}>{group.name}</Text>
                <View style={styles.setsList}>
                  {group.sets.map((set) => (
                    <View key={set.id} style={styles.setRow}>
                      <Text style={styles.setLabel}>Set {set.setNumber}</Text>
                      <Text style={styles.setValue}>
                        {set.weightLbs} lbs × {set.reps} {set.reps === 1 ? 'rep' : 'reps'}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
}

// ---- Helpers ----

interface ExerciseGroup {
  exerciseId: string;
  name: string;
  sets: LoggedSet[];
}

/**
 * Group logged sets by exercise.
 * - If we have the program template: iterate the day's exercises in their
 *   original order, attach each one's sets, and skip exercises with no sets.
 * - If the template is missing (program renamed/removed): fall back to
 *   grouping by exerciseId in first-logged order, using the ID as the name.
 */
function buildExerciseGroups(
  sets: LoggedSet[],
  templateExercises: { id: string; name: string }[] | undefined,
): ExerciseGroup[] {
  if (templateExercises) {
    return templateExercises
      .map((ex) => ({
        exerciseId: ex.id,
        name: ex.name,
        sets: sets
          .filter((s) => s.exerciseId === ex.id)
          .sort((a, b) => a.setNumber - b.setNumber),
      }))
      .filter((g) => g.sets.length > 0);
  }

  // Fallback path — template not found
  const order: string[] = [];
  const map = new Map<string, LoggedSet[]>();
  for (const set of sets) {
    if (!map.has(set.exerciseId)) {
      order.push(set.exerciseId);
      map.set(set.exerciseId, []);
    }
    map.get(set.exerciseId)!.push(set);
  }
  return order.map((id) => ({
    exerciseId: id,
    name: id,
    sets: map.get(id)!.sort((a, b) => a.setNumber - b.setNumber),
  }));
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

  // Header
  date: { ...typography.title, color: colors.textPrimary, marginBottom: spacing.xs },
  programLine: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },

  // 3-tile stats grid up top
  statsGrid: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  statTile: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  statTileValue: { ...typography.heading, color: colors.accent, marginBottom: spacing.xs },
  statTileLabel: { ...typography.body, color: colors.textTertiary, fontSize: 13 },

  // Section heading
  sectionTitle: { ...typography.caption, color: colors.textTertiary, marginBottom: spacing.md },

  // Exercise cards
  exerciseList: { gap: spacing.md },
  exerciseCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  exerciseName: { ...typography.heading, color: colors.textPrimary, marginBottom: spacing.md },
  setsList: { gap: spacing.sm },
  setRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  setLabel: { ...typography.body, color: colors.textSecondary },
  setValue: { ...typography.bodyBold, color: colors.textPrimary },

  // Empty state — session has no logged sets
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  emptyBody: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },

  // Not-found state
  notFoundCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  notFoundTitle: { ...typography.heading, color: colors.textPrimary, marginBottom: spacing.sm },
  notFoundBody: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
});
