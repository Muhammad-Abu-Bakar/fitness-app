// === NEW ===
// app/workout/session.tsx
//
// The active workout session screen.
// Shows one exercise at a time, with completed sets above and an input row below.
// Logs each set into the activeSession via useWorkoutLog.

import { StatusBar } from 'expo-status-bar';
import { useState, useRef } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform,
  ScrollView, StyleSheet, Text, TextInput,
  TouchableOpacity, View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, radius, typography } from '../../theme';
import { useWorkoutLog } from '../../context/workoutLog';
import { getProgramById } from '../../lib/workouts/programs';
import type { Exercise, LoggedSet } from '../../lib/workouts/types';

export default function SessionScreen() {
  const router = useRouter();
  const { activeSession, logSet, cancelActiveSession, getSetsForExercise } = useWorkoutLog();

  const program = activeSession ? getProgramById(activeSession.programId) : undefined;
  const day = program?.days.find(d => d.id === activeSession?.dayId);

  // Smart resume — start at the first exercise with incomplete sets.
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(() => {
    if (!activeSession || !day) return 0;
    for (let i = 0; i < day.exercises.length; i++) {
      const ex = day.exercises[i];
      const setsForEx = activeSession.sets.filter(s => s.exerciseId === ex.id);
      if (setsForEx.length < ex.sets) return i;
    }
    return day.exercises.length - 1;
  });

  // No active session or invalid program/day — show empty state with a way out.
  if (!activeSession || !program || !day) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContent}>
          <Text style={styles.emptyText}>No active workout.</Text>
          <TouchableOpacity
            onPress={() => router.replace('/workouts')}
            style={styles.emptyButton}
            activeOpacity={0.85}
          >
            <Text style={styles.emptyButtonText}>← Back to workouts</Text>
          </TouchableOpacity>
        </View>
        <StatusBar style="light" />
      </View>
    );
  }

  const currentExercise = day.exercises[currentExerciseIndex];
  const totalExercises = day.exercises.length;
  const isFirstExercise = currentExerciseIndex === 0;
  const isLastExercise = currentExerciseIndex === totalExercises - 1;

  function handleClose() {
    Alert.alert(
      'Exit workout?',
      'Your progress is saved — you can resume any time.',
      [
        { text: 'Stay', style: 'cancel' },
        {
          text: 'Exit & save progress',
          onPress: () => {
            if (router.canGoBack()) router.back();
            else router.replace('/workouts');
          },
        },
        {
          text: 'Discard workout',
          style: 'destructive',
          onPress: () => {
            cancelActiveSession();
            if (router.canGoBack()) router.back();
            else router.replace('/workouts');
          },
        },
      ],
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton} activeOpacity={0.7}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>
            EXERCISE {currentExerciseIndex + 1} OF {totalExercises}
          </Text>
          <Text style={styles.title}>{day.name}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* key={currentExercise.id} forces remount when switching exercises,
            so inputs reset to the new exercise's pre-fills. */}
        <ExerciseSection
          key={currentExercise.id}
          exercise={currentExercise}
          loggedSets={getSetsForExercise(currentExercise.id)}
          onLogSet={(weight, reps) => {
            const setNumber = getSetsForExercise(currentExercise.id).length + 1;
            logSet(currentExercise.id, setNumber, weight, reps);
          }}
        />
      </ScrollView>

      {/* Sticky bottom nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          onPress={() => setCurrentExerciseIndex(i => Math.max(0, i - 1))}
          disabled={isFirstExercise}
          style={[styles.navButton, isFirstExercise && styles.navButtonDisabled]}
          activeOpacity={0.7}
        >
          <Text style={[styles.navButtonText, isFirstExercise && styles.navButtonTextDisabled]}>
            ← Prev
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setCurrentExerciseIndex(i => Math.min(totalExercises - 1, i + 1))}
          disabled={isLastExercise}
          style={[
            styles.navButton,
            styles.navButtonPrimary,
            isLastExercise && styles.navButtonPrimaryDisabled,
          ]}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.navButtonText,
            styles.navButtonTextPrimary,
            isLastExercise && styles.navButtonTextPrimaryDisabled,
          ]}>
            Next →
          </Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="light" />
    </KeyboardAvoidingView>
  );
}

function ExerciseSection({
  exercise,
  loggedSets,
  onLogSet,
}: {
  exercise: Exercise;
  loggedSets: LoggedSet[];
  onLogSet: (weight: number, reps: number) => void;
}) {
  const completedCount = loggedSets.length;
  const isComplete = completedCount >= exercise.sets;
  const nextSetNumber = completedCount + 1;

  // Smart pre-fills: previous set's values, or sensible defaults for set 1.
  const previousSet = loggedSets[loggedSets.length - 1];
  const initialWeight = previousSet ? previousSet.weightLbs.toString() : '';
  const initialReps = previousSet
    ? previousSet.reps.toString()
    : exercise.repsHigh.toString();

  const [weightInput, setWeightInput] = useState(initialWeight);
  const [repsInput, setRepsInput] = useState(initialReps);
  const repsInputRef = useRef<TextInput>(null);

  function handleLog() {
    const weight = parseFloat(weightInput);
    const reps = parseInt(repsInput, 10);
    if (isNaN(weight) || weight <= 0) {
      Alert.alert('Enter a weight', 'Weight must be greater than 0.');
      return;
    }
    if (isNaN(reps) || reps <= 0) {
      Alert.alert('Enter reps', 'Reps must be greater than 0.');
      return;
    }
    onLogSet(weight, reps);
  }

  const repsLabel =
    exercise.repsLow === exercise.repsHigh
      ? `${exercise.repsLow} reps`
      : `${exercise.repsLow}–${exercise.repsHigh} reps`;

  return (
    <View>
      <Text style={styles.exerciseName}>{exercise.name}</Text>
      <Text style={styles.exerciseTarget}>
        {exercise.sets} × {repsLabel} · {exercise.restSeconds}s rest
      </Text>
      {exercise.notes && <Text style={styles.exerciseNotes}>{exercise.notes}</Text>}

      <View style={styles.setList}>
        {/* Completed sets */}
        {loggedSets.map(set => (
          <View key={set.id} style={[styles.setRow, styles.setRowDone]}>
            <Text style={styles.setNumber}>SET {set.setNumber}</Text>
            <Text style={styles.setDoneText}>
              {set.weightLbs} lbs × {set.reps} reps
            </Text>
            <Text style={styles.setCheck}>✓</Text>
          </View>
        ))}

        {/* Active input row */}
        {!isComplete && (
          <View style={[styles.setRow, styles.setRowActive]}>
            <Text style={styles.setNumber}>SET {nextSetNumber}</Text>
            <View style={styles.inputs}>
              <TextInput
                style={styles.input}
                value={weightInput}
                onChangeText={setWeightInput}
                placeholder="lbs"
                placeholderTextColor={colors.textTertiary}
                keyboardType="decimal-pad"
                returnKeyType="next"
                selectTextOnFocus
                onSubmitEditing={() => repsInputRef.current?.focus()}
              />
              <Text style={styles.inputDivider}>×</Text>
              <TextInput
                ref={repsInputRef}
                style={styles.input}
                value={repsInput}
                onChangeText={setRepsInput}
                placeholder="reps"
                placeholderTextColor={colors.textTertiary}
                keyboardType="number-pad"
                returnKeyType="done"
                selectTextOnFocus
                onSubmitEditing={handleLog}
              />
            </View>
            <TouchableOpacity onPress={handleLog} style={styles.logSetButton} activeOpacity={0.85}>
              <Text style={styles.logSetButtonText}>Log</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* All sets done */}
        {isComplete && (
          <View style={styles.completeBox}>
            <Text style={styles.completeText}>✓ Exercise complete</Text>
            <Text style={styles.completeSubtext}>Tap Next to move on</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 80,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: { fontSize: 18, color: colors.textPrimary },
  headerText: { flex: 1 },
  eyebrow: { ...typography.caption, color: colors.accent, marginBottom: spacing.xs },
  title: { ...typography.title, color: colors.textPrimary },

  scroll: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },

  // Exercise header
  exerciseName: {
    ...typography.heading,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  exerciseTarget: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  exerciseNotes: {
    ...typography.body,
    color: colors.textTertiary,
    fontStyle: 'italic',
    fontSize: 14,
    marginBottom: spacing.lg,
  },

  // Set list
  setList: { marginTop: spacing.md },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  setRowDone: { backgroundColor: colors.surface },
  setRowActive: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  setNumber: {
    ...typography.caption,
    color: colors.textTertiary,
    width: 50,
  },
  setDoneText: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    flex: 1,
  },
  setCheck: {
    fontSize: 20,
    color: colors.success,
    fontWeight: '700',
  },

  // Inputs
  inputs: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  input: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    textAlign: 'center',
    flex: 1,
    minWidth: 50,
  },
  inputDivider: {
    ...typography.body,
    color: colors.textTertiary,
  },
  logSetButton: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    minWidth: 60,
    alignItems: 'center',
  },
  logSetButtonText: {
    ...typography.bodyBold,
    color: colors.onAccent,
  },

  // Completion box
  completeBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  completeText: {
    ...typography.heading,
    color: colors.success,
    marginBottom: spacing.xs,
  },
  completeSubtext: {
    ...typography.body,
    color: colors.textSecondary,
  },

  // Sticky bottom nav
  bottomNav: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.surface,
    backgroundColor: colors.background,
  },
  navButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  navButtonPrimary: { backgroundColor: colors.accent },
  navButtonDisabled: { opacity: 0.4 },
  navButtonPrimaryDisabled: {
    backgroundColor: colors.surface,
    opacity: 0.4,
  },
  navButtonText: {
    ...typography.button,
    color: colors.textPrimary,
  },
  navButtonTextPrimary: { color: colors.onAccent },
  navButtonTextDisabled: { color: colors.textTertiary },
  navButtonTextPrimaryDisabled: { color: colors.textTertiary },

  // Empty state
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
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