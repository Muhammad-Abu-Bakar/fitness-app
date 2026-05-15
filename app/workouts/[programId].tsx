// === NEW ===
// app/workouts/[programId].tsx
//
// Program detail screen. Reads programId from the URL, looks up the program,
// renders all days + exercises with sets/reps/rest and coaching notes.

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, spacing, radius, typography } from '../../theme';
import { getProgramById } from '../../lib/workouts/programs';
import type { WorkoutDay, Exercise } from '../../lib/workouts/types';

export default function ProgramDetailScreen() {
  const router = useRouter();
  const { programId } = useLocalSearchParams<{ programId: string }>();
  const program = programId ? getProgramById(programId) : undefined;

  // Handle bad URL / unknown id
  if (!program) {
    return (
      <View style={styles.container}>
        <View style={styles.notFoundContent}>
          <Text style={styles.notFoundTitle}>Program not found</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.notFoundButton}
            activeOpacity={0.85}
          >
            <Text style={styles.notFoundButtonText}>← Back to programs</Text>
          </TouchableOpacity>
        </View>
        <StatusBar style="light" />
      </View>
    );
  }

  const levelLabel = program.level.toUpperCase();
  const goalLabel =
    program.goal === 'gain' ? 'BUILD MUSCLE' :
    program.goal === 'lose' ? 'CUT FAT' :
    'MAINTAIN';

  const totalExercises = program.days.reduce(
    (sum, day) => sum + day.exercises.length,
    0
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>{levelLabel} · {goalLabel}</Text>
            <Text style={styles.title}>{program.name}</Text>
          </View>
        </View>

        <Text style={styles.description}>{program.description}</Text>

        {/* Meta row */}
        <View style={styles.metaRow}>
          <MetaItem value={program.daysPerWeek.toString()} label="days/week" />
          <View style={styles.metaDivider} />
          <MetaItem value={program.durationWeeks.toString()} label="weeks" />
          <View style={styles.metaDivider} />
          <MetaItem value={totalExercises.toString()} label="exercises" />
        </View>

        {/* Days */}
        <Text style={styles.sectionTitle}>The split</Text>
        {program.days.map((day, idx) => (
          <DayCard key={day.id} day={day} dayNumber={idx + 1} />
        ))}

        <Text style={styles.note}>
          Workout execution with rest timer coming next.
        </Text>
      </ScrollView>

      <StatusBar style="light" />
    </View>
  );
}

function DayCard({ day, dayNumber }: { day: WorkoutDay; dayNumber: number }) {
  return (
    <View style={styles.dayCard}>
      <View style={styles.dayHeader}>
        <Text style={styles.dayNumber}>DAY {dayNumber}</Text>
        <Text style={styles.dayName}>{day.name}</Text>
        {day.subtitle && <Text style={styles.daySubtitle}>{day.subtitle}</Text>}
      </View>

      <View style={styles.exerciseList}>
        {day.exercises.map((exercise, idx) => (
          <ExerciseRow
            key={exercise.id}
            exercise={exercise}
            isLast={idx === day.exercises.length - 1}
          />
        ))}
      </View>
    </View>
  );
}

function ExerciseRow({ exercise, isLast }: { exercise: Exercise; isLast: boolean }) {
  const repsLabel =
    exercise.repsLow === exercise.repsHigh
      ? `${exercise.repsLow} reps`
      : `${exercise.repsLow}–${exercise.repsHigh} reps`;

  return (
    <View style={[styles.exerciseRow, !isLast && styles.exerciseRowBorder]}>
      <Text style={styles.exerciseName}>{exercise.name}</Text>
      <Text style={styles.exerciseMeta}>
        {exercise.sets} × {repsLabel} · {exercise.restSeconds}s rest
      </Text>
      {exercise.notes && (
        <Text style={styles.exerciseNotes}>{exercise.notes}</Text>
      )}
    </View>
  );
}

function MetaItem({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.metaItem}>
      <Text style={styles.metaValue}>{value}</Text>
      <Text style={styles.metaLabel}>{label}</Text>
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
  scroll: { paddingBottom: spacing.xl },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { fontSize: 22, color: colors.textPrimary },
  headerText: { flex: 1 },
  eyebrow: { ...typography.caption, color: colors.accent, marginBottom: spacing.xs },
  title: { ...typography.title, color: colors.textPrimary },

  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },

  // Meta row
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.xl,
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
  },
  metaValue: {
    ...typography.heading,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  metaLabel: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  metaDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.surfaceElevated,
  },

  // Section
  sectionTitle: {
    ...typography.heading,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },

  // Day card
  dayCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  dayHeader: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceElevated,
  },
  dayNumber: {
    ...typography.caption,
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  dayName: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  daySubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // Exercise list
  exerciseList: {
    paddingHorizontal: spacing.lg,
  },
  exerciseRow: {
    paddingVertical: spacing.md,
  },
  exerciseRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceElevated,
  },
  exerciseName: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  exerciseMeta: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 14,
  },
  exerciseNotes: {
    ...typography.body,
    color: colors.textTertiary,
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },

  // Not found state
  notFoundContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  notFoundTitle: {
    ...typography.heading,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  notFoundButton: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
  },
  notFoundButtonText: {
    ...typography.button,
    color: colors.onAccent,
  },

  note: {
    ...typography.body,
    color: colors.textTertiary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: spacing.md,
  },
});