// === CHANGED === adds useWorkoutLog + Alert, plus Start/Resume buttons per day.
import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, spacing, radius, typography } from '../../theme';
import { getProgramById } from '../../lib/workouts/programs';
import type { WorkoutDay, Exercise } from '../../lib/workouts/types';
import { useWorkoutLog } from '../../context/workoutLog';

export default function ProgramDetailScreen() {
  const router = useRouter();
  const { programId } = useLocalSearchParams<{ programId: string }>();
  const program = programId ? getProgramById(programId) : undefined;
  const { activeSession, startSession, cancelActiveSession } = useWorkoutLog();

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

  // === NEW === Decide what happens when the user taps Start/Resume on a day.
  function handleStartDay(dayId: string, dayName: string) {
    if (!program) return; // appease TS — already guarded above

    const goToSession = () => router.push('/workout/session');

    // 1. No active session → start fresh and go
    if (!activeSession) {
      startSession(program.id, dayId);
      goToSession();
      return;
    }

    // 2. Active session is THIS day → just resume, keep all logged sets
    if (
      activeSession.programId === program.id &&
      activeSession.dayId === dayId
    ) {
      goToSession();
      return;
    }

    // 3. Active session is a DIFFERENT day → confirm before discarding
    Alert.alert(
      'Workout in progress',
      `You're in the middle of another workout. Discard it and start ${dayName}?`,
      [
        { text: 'Keep current', style: 'cancel' },
        {
          text: 'Discard & start new',
          style: 'destructive',
          onPress: () => {
            cancelActiveSession();
            startSession(program.id, dayId);
            goToSession();
          },
        },
      ],
    );
  }

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

        <View style={styles.metaRow}>
          <MetaItem value={program.daysPerWeek.toString()} label="days/week" />
          <View style={styles.metaDivider} />
          <MetaItem value={program.durationWeeks.toString()} label="weeks" />
          <View style={styles.metaDivider} />
          <MetaItem value={totalExercises.toString()} label="exercises" />
        </View>

        <Text style={styles.sectionTitle}>The split</Text>
        {program.days.map((day, idx) => (
          <DayCard
            key={day.id}
            day={day}
            dayNumber={idx + 1}
            // === NEW === active flag + start handler
            isActive={
              !!activeSession &&
              activeSession.programId === program.id &&
              activeSession.dayId === day.id
            }
            onStart={() => handleStartDay(day.id, day.name)}
          />
        ))}
      </ScrollView>

      <StatusBar style="light" />
    </View>
  );
}

function DayCard({
  day,
  dayNumber,
  isActive,
  onStart,
}: {
  day: WorkoutDay;
  dayNumber: number;
  isActive: boolean;
  onStart: () => void;
}) {
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

      {/* === NEW === Start/Resume button at the bottom of every day card */}
      <View style={styles.dayFooter}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={onStart}
          activeOpacity={0.85}
        >
          <Text style={styles.startButtonText}>
            {isActive ? `Resume ${day.name}` : `Start ${day.name}`}
          </Text>
        </TouchableOpacity>
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

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.xl,
  },
  metaItem: { flex: 1, alignItems: 'center' },
  metaValue: { ...typography.heading, color: colors.textPrimary, marginBottom: 2 },
  metaLabel: { ...typography.caption, color: colors.textTertiary },
  metaDivider: { width: 1, height: 28, backgroundColor: colors.surfaceElevated },

  sectionTitle: { ...typography.heading, color: colors.textPrimary, marginBottom: spacing.md },

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
  dayNumber: { ...typography.caption, color: colors.accent, marginBottom: spacing.xs },
  dayName: { ...typography.heading, color: colors.textPrimary },
  daySubtitle: { ...typography.body, color: colors.textSecondary, marginTop: 2 },

  exerciseList: { paddingHorizontal: spacing.lg },
  exerciseRow: { paddingVertical: spacing.md },
  exerciseRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.surfaceElevated },
  exerciseName: { ...typography.bodyBold, color: colors.textPrimary, marginBottom: 2 },
  exerciseMeta: { ...typography.body, color: colors.textSecondary, fontSize: 14 },
  exerciseNotes: {
    ...typography.body,
    color: colors.textTertiary,
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },

  // === NEW === Day footer + Start/Resume button
  dayFooter: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  startButton: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  startButtonText: { ...typography.button, color: colors.onAccent },

  notFoundContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  notFoundTitle: { ...typography.heading, color: colors.textPrimary, marginBottom: spacing.lg },
  notFoundButton: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
  },
  notFoundButtonText: { ...typography.button, color: colors.onAccent },
});