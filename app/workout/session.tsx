// === CHANGED === lime training-domain reskin
import { StatusBar } from 'expo-status-bar';
import { useState, useRef, useEffect } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform,
  ScrollView, StyleSheet, Text, TextInput,
  TouchableOpacity, View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { X, Check, ChevronLeft, ChevronRight } from 'lucide-react-native'; // === NEW ===
import { colors, spacing, radius, typography } from '../../theme';
import { useWorkoutLog } from '../../context/workoutLog';
import { getProgramById } from '../../lib/workouts/programs';
import type { Exercise, LoggedSet } from '../../lib/workouts/types';
import { RestTimer } from '../../components/RestTimer';
import { tapLight, success, warning } from '../../lib/haptics'; // === CHANGED === use project helpers instead of raw expo-haptics

export default function SessionScreen() {
  const router = useRouter();
  const {
    activeSession,
    logSet,
    cancelActiveSession,
    finishSession,
    getSetsForExercise,
  } = useWorkoutLog();

  const program = activeSession ? getProgramById(activeSession.programId) : undefined;
  const day = program?.days.find(d => d.id === activeSession?.dayId);

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(() => {
    if (!activeSession || !day) return 0;
    for (let i = 0; i < day.exercises.length; i++) {
      const ex = day.exercises[i];
      const setsForEx = activeSession.sets.filter(s => s.exerciseId === ex.id);
      if (setsForEx.length < ex.sets) return i;
    }
    return day.exercises.length - 1;
  });

  const [restKey, setRestKey] = useState(0);
  const [restActive, setRestActive] = useState(false);

  useEffect(() => {
    setRestActive(false);
  }, [currentExerciseIndex]);

  if (!activeSession || !program || !day) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContent}>
          <Text style={styles.emptyText}>No active workout.</Text>
          <TouchableOpacity
            onPress={() => {
              tapLight();
              router.replace('/workouts');
            }}
            style={styles.emptyButton}
            activeOpacity={0.85}
          >
            <ChevronLeft size={18} color={colors.onAccentTrain} strokeWidth={2.5} />
            <Text style={styles.emptyButtonText}>Back to workouts</Text>
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
    tapLight(); // === NEW ===
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
            warning(); // === NEW ===
            cancelActiveSession();
            if (router.canGoBack()) router.back();
            else router.replace('/workouts');
          },
        },
      ],
    );
  }

  // Finish workout: warn about any incomplete exercises, then save + navigate.
  function handleFinish() {
    if (!activeSession || !day) return;
    const id = activeSession.id;

    const performFinish = () => {
      success(); // === NEW === big win celebration haptic
      finishSession();
      router.replace({
        pathname: '/workout/complete',
        params: { sessionId: id },
      });
    };

    let incompleteCount = 0;
    for (const ex of day.exercises) {
      const logged = activeSession.sets.filter(s => s.exerciseId === ex.id).length;
      if (logged < ex.sets) incompleteCount++;
    }

    if (incompleteCount > 0) {
      const noun = incompleteCount === 1 ? 'exercise' : 'exercises';
      Alert.alert(
        'Workout not complete',
        `${incompleteCount} ${noun} still have unfinished sets. Finish anyway?`,
        [
          { text: 'Keep going', style: 'cancel' },
          { text: 'Finish anyway', style: 'destructive', onPress: performFinish },
        ],
      );
      return;
    }

    performFinish();
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        {/* === CHANGED === slim 40x40 borderSubtle close button with X icon */}
        <TouchableOpacity
          onPress={handleClose}
          style={styles.closeButton}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <X size={20} color={colors.textPrimary} strokeWidth={2} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>
            EXERCISE {currentExerciseIndex + 1} OF {totalExercises}
          </Text>
          <Text style={styles.title}>{day.name}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollOuter}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ExerciseSection
          key={currentExercise.id}
          exercise={currentExercise}
          loggedSets={getSetsForExercise(currentExercise.id)}
          onLogSet={(weight, reps) => {
            const setNumber = getSetsForExercise(currentExercise.id).length + 1;
            logSet(currentExercise.id, setNumber, weight, reps);
            tapLight(); // === CHANGED === use helper
            setRestKey(k => k + 1);
            setRestActive(true);
          }}
        />
      </ScrollView>

      {restActive && (
        <RestTimer
          key={restKey}
          totalSeconds={currentExercise.restSeconds}
          onSkip={() => setRestActive(false)}
        />
      )}

      <View style={styles.bottomNav}>
        <TouchableOpacity
          onPress={() => {
            tapLight();
            setCurrentExerciseIndex(i => Math.max(0, i - 1));
          }}
          disabled={isFirstExercise}
          style={[styles.navButton, isFirstExercise && styles.navButtonDisabled]}
          activeOpacity={0.7}
        >
          <ChevronLeft
            size={16}
            color={isFirstExercise ? colors.textTertiary : colors.textPrimary}
            strokeWidth={2.5}
          />
          <Text style={[styles.navButtonText, isFirstExercise && styles.navButtonTextDisabled]}>
            Prev
          </Text>
        </TouchableOpacity>

        {!isLastExercise ? (
          <TouchableOpacity
            onPress={() => {
              tapLight();
              setCurrentExerciseIndex(i => Math.min(totalExercises - 1, i + 1));
            }}
            style={[styles.navButton, styles.navButtonPrimary]}
            activeOpacity={0.7}
          >
            <Text style={[styles.navButtonText, styles.navButtonTextPrimary]}>Next</Text>
            <ChevronRight size={16} color={colors.onAccentTrain} strokeWidth={2.5} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleFinish}
            style={[styles.navButton, styles.navButtonPrimary]}
            activeOpacity={0.85}
          >
            <Text style={[styles.navButtonText, styles.navButtonTextPrimary]}>Finish workout</Text>
            <ChevronRight size={16} color={colors.onAccentTrain} strokeWidth={2.5} />
          </TouchableOpacity>
        )}
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
      warning(); // === NEW ===
      Alert.alert('Enter a weight', 'Weight must be greater than 0.');
      return;
    }
    if (isNaN(reps) || reps <= 0) {
      warning(); // === NEW ===
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
        {loggedSets.map(set => (
          <View key={set.id} style={[styles.setRow, styles.setRowDone]}>
            <Text style={styles.setNumber}>SET {set.setNumber}</Text>
            <Text style={styles.setDoneText}>
              {set.weightLbs} lbs × {set.reps} reps
            </Text>
            {/* === CHANGED === lime Check icon */}
            <Check size={18} color={colors.accentTrain} strokeWidth={2.5} />
          </View>
        ))}

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

        {isComplete && (
          <View style={styles.completeBox}>
            {/* === CHANGED === Check icon + text row */}
            <View style={styles.completeRow}>
              <Check size={20} color={colors.accentTrain} strokeWidth={2.5} />
              <Text style={styles.completeText}>Exercise complete</Text>
            </View>
            <Text style={styles.completeSubtext}>
              Tap the button below to continue.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSolid, // === CHANGED ===
    paddingTop: 80,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  // === CHANGED === slim 40x40 borderSubtle close button (was 44x44 filled circle)
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  headerText: { flex: 1 },
  eyebrow: {
    ...typography.caption,
    color: colors.accentTrain, // === CHANGED === lime
    marginBottom: spacing.xs,
    letterSpacing: 1.5, // === NEW ===
  },
  title: { ...typography.title, color: colors.textPrimary },

  scrollOuter: { flex: 1 },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },

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
  setRowDone: {
    backgroundColor: colors.surface,
    borderWidth: 1, // === NEW ===
    borderColor: colors.borderSubtle, // === NEW ===
  },
  setRowActive: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.accentTrain, // === CHANGED === lime focus border
  },
  setNumber: {
    ...typography.caption,
    color: colors.textTertiary,
    width: 50,
    letterSpacing: 1.5, // === NEW ===
  },
  setDoneText: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    flex: 1,
  },

  inputs: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  input: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    backgroundColor: colors.backgroundSolid, // === CHANGED ===
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
    backgroundColor: colors.accentTrain, // === CHANGED ===
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    minWidth: 60,
    alignItems: 'center',
  },
  logSetButtonText: {
    ...typography.bodyBold,
    color: colors.onAccentTrain, // === CHANGED ===
  },

  completeBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.sm,
    borderWidth: 1, // === NEW ===
    borderColor: colors.borderSubtle, // === NEW ===
  },
  // === NEW === row for Check icon + headline
  completeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  completeText: {
    ...typography.heading,
    color: colors.accentTrain, // === CHANGED === lime instead of generic success
  },
  completeSubtext: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  bottomNav: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle, // === CHANGED ===
    backgroundColor: colors.backgroundSolid, // === CHANGED ===
  },
  navButton: {
    flex: 1,
    flexDirection: 'row', // === NEW === for icon + label
    paddingVertical: 14,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs, // === NEW ===
    borderWidth: 1, // === NEW ===
    borderColor: colors.borderSubtle, // === NEW ===
  },
  navButtonPrimary: {
    backgroundColor: colors.accentTrain, // === CHANGED ===
    borderColor: colors.accentTrain, // === NEW === border matches fill
  },
  navButtonDisabled: { opacity: 0.4 },
  navButtonText: {
    ...typography.button,
    color: colors.textPrimary,
  },
  navButtonTextPrimary: { color: colors.onAccentTrain }, // === CHANGED ===
  navButtonTextDisabled: { color: colors.textTertiary },

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
    flexDirection: 'row', // === NEW ===
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.accentTrain, // === CHANGED ===
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
  },
  emptyButtonText: {
    ...typography.button,
    color: colors.onAccentTrain, // === CHANGED ===
  },
});
