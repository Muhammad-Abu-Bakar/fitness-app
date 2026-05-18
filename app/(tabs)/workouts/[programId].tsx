// === CHANGED === Moved from app/workouts/[programId].tsx into the (tabs) group
// so the tab bar stays visible while viewing a program's detail.
// Token migration: legacy `accent` (yellow) -> `accentTrain` (lime), legacy
// `onAccent` -> `onAccentTrain`, `background` -> `backgroundSolid`,
// `surfaceElevated`-as-divider -> `borderSubtle`/`borderDefault`. Behavior unchanged.

import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
// === CHANGED === imports one level deeper: ../../ -> ../../../
import { colors, spacing, radius, typography } from '../../../theme';
import { getProgramById } from '../../../lib/workouts/programs';
import type { WorkoutDay, Exercise } from '../../../lib/workouts/types';
import { useWorkoutLog } from '../../../context/workoutLog';
// === NEW === haptics on the back + start/resume buttons (consistent with rest of app)
import { tapLight, tapMedium } from '../../../lib/haptics';

export default function ProgramDetailScreen() {
  const router = useRouter();
  const { programId } = useLocalSearchParams<{ programId: string }>();
  const program = programId ? getProgramById(programId) : undefined;
  const { activeSession, startSession, cancelActiveSession } = useWorkoutLog();

  const handleBack = () => {
    tapLight();
    router.back();
  };

  if (!program) {
    return (
      <View style={styles.container}>
        <View style={styles.notFoundContent}>
          <Text style={styles.notFoundTitle}>Program not found</Text>
          <TouchableOpacity onPress={handleBack} style={styles.notFoundButton} activeOpacity={0.85}>
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

  function handleStartDay(dayId: string, dayName: string) {
    if (!program) return;

    const goToSession = () => {
      tapMedium();
      router.push('/workout/session');
    };

    if (!activeSession) {
      startSession(program.id, dayId);
      goToSession();
      return;
    }

    if (
      activeSession.programId === program.id &&
      activeSession.dayId === dayId
    ) {
      goToSession();
      return;
    }

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
          <TouchableOpacity onPress={handleBack} style={styles.backButton} activeOpacity={0.7}>
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

      <View style={styles.dayFooter}>
        <TouchableOpacity style={styles.startButton} onPress={onStart} activeOpacity={0.85}>
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
  // === CHANGED === backgroundSolid + tab-bar-safe bottom padding
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSolid,
    paddingHorizontal: spacing.lg,
    paddingTop: 80,
    paddingBottom: 100,
  },
  scroll: { paddingBottom: spacing.xl },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  // === CHANGED === slimmer back button with subtle border, matches home + list patterns
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  backIcon: { fontSize: 18, color: colors.textPrimary },
  headerText: { flex: 1 },
  // === CHANGED === lime eyebrow (training domain) instead of yellow
  eyebrow: { ...typography.caption, color: colors.accentTrain, marginBottom: spacing.xs },
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
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  metaItem: { flex: 1, alignItems: 'center' },
  metaValue: { ...typography.heading, color: colors.textPrimary, marginBottom: 2 },
  metaLabel: { ...typography.caption, color: colors.textTertiary },
  // === CHANGED === divider uses borderDefault for visibility on dark surface
  metaDivider: { width: 1, height: 28, backgroundColor: colors.borderDefault },

  sectionTitle: { ...typography.heading, color: colors.textPrimary, marginBottom: spacing.md },

  dayCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  dayHeader: {
    padding: spacing.lg,
    // === CHANGED === softer divider color (was surfaceElevated which now barely shows)
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  // === CHANGED === lime day number (training domain) instead of yellow
  dayNumber: { ...typography.caption, color: colors.accentTrain, marginBottom: spacing.xs },
  dayName: { ...typography.heading, color: colors.textPrimary },
  daySubtitle: { ...typography.body, color: colors.textSecondary, marginTop: 2 },

  exerciseList: { paddingHorizontal: spacing.lg },
  exerciseRow: { paddingVertical: spacing.md },
  // === CHANGED === softer divider color
  exerciseRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
  exerciseName: { ...typography.bodyBold, color: colors.textPrimary, marginBottom: 2 },
  exerciseMeta: { ...typography.body, color: colors.textSecondary, fontSize: 14 },
  exerciseNotes: {
    ...typography.body,
    color: colors.textTertiary,
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },

  dayFooter: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  // === CHANGED === lime start/resume button (training domain) instead of yellow
  startButton: {
    backgroundColor: colors.accentTrain,
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  startButtonText: { ...typography.button, color: colors.onAccentTrain },

  notFoundContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  notFoundTitle: { ...typography.heading, color: colors.textPrimary, marginBottom: spacing.lg },
  // === CHANGED === lime tokens
  notFoundButton: {
    backgroundColor: colors.accentTrain,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
  },
  notFoundButtonText: { ...typography.button, color: colors.onAccentTrain },
});
