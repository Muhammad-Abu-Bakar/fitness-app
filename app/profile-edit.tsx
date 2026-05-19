// === NEW === edit profile screen — single form, all fields, save writes through context setters
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { X } from 'lucide-react-native';
import { colors, spacing, radius, typography, dualGradient } from '../theme';
import { useOnboarding, type Goal, type ActivityLevel, type Sex } from '../context/onboarding';
import { tapLight, tapMedium, success, warning } from '../lib/haptics';

const SEX_OPTIONS: { value: Sex; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];
const GOAL_OPTIONS: { value: Goal; label: string }[] = [
  { value: 'bulk', label: 'Bulk up' },
  { value: 'lean', label: 'Lean out' },
  { value: 'exploring', label: 'Exploring' },
];
const ACTIVITY_OPTIONS: { value: ActivityLevel; label: string }[] = [
  { value: 'sedentary', label: 'Sedentary' },
  { value: 'light', label: 'Light' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'active', label: 'Active' },
];

export default function ProfileEditScreen() {
  const router = useRouter();
  const onboarding = useOnboarding();
  const {
    loaded,
    sex: storedSex,
    goal: storedGoal,
    weightLbs: storedWeight,
    targetWeightLbs: storedTarget,
    heightFt: storedHeightFt,
    heightIn: storedHeightIn,
    age: storedAge,
    activityLevel: storedActivity,
    setSex,
    setGoal,
    setStats,
    setTargetWeight,
    setActivityLevel,
  } = onboarding;

  // Local form state — pre-populated from context
  const [sex, setSexLocal] = useState<Sex | null>(storedSex);
  const [goal, setGoalLocal] = useState<Goal | null>(storedGoal);
  const [activity, setActivityLocal] = useState<ActivityLevel | null>(storedActivity);
  const [weight, setWeightLocal] = useState(storedWeight !== null ? String(storedWeight) : '');
  const [target, setTargetLocal] = useState(storedTarget !== null ? String(storedTarget) : '');
  const [ft, setFt] = useState(storedHeightFt !== null ? String(storedHeightFt) : '');
  const [inches, setInches] = useState(storedHeightIn !== null ? String(storedHeightIn) : '');
  const [age, setAgeLocal] = useState(storedAge !== null ? String(storedAge) : '');

  if (!loaded) return null;

  // Validation
  const weightN = parseFloat(weight);
  const targetN = target.trim() === '' ? null : parseFloat(target);
  const ftN = parseInt(ft, 10);
  const inN = parseInt(inches, 10);
  const ageN = parseInt(age, 10);

  const validSex = sex !== null;
  const validGoal = goal !== null;
  const validActivity = activity !== null;
  const validWeight = !isNaN(weightN) && weightN >= 50 && weightN <= 500;
  const validTarget = targetN === null || (!isNaN(targetN) && targetN >= 50 && targetN <= 500);
  const validHeight = !isNaN(ftN) && ftN >= 3 && ftN <= 8 && !isNaN(inN) && inN >= 0 && inN <= 11;
  const validAge = !isNaN(ageN) && ageN >= 10 && ageN <= 100;

  const isValid = validSex && validGoal && validActivity && validWeight && validTarget && validHeight && validAge;

  const handleCancel = () => {
    tapLight();
    router.back();
  };

  const handleSave = () => {
    if (!isValid) {
      warning();
      Alert.alert('Some fields need fixing', 'Check the highlighted rows and try again.');
      return;
    }
    // Apply all changes through context setters
    if (sex !== null && sex !== storedSex) setSex(sex);
    if (goal !== null && goal !== storedGoal) setGoal(goal);
    if (activity !== null && activity !== storedActivity) setActivityLevel(activity);
    // setStats always takes all four together
    setStats({ weightLbs: weightN, heightFt: ftN, heightIn: inN, age: ageN });
    // Target weight is independent
    if (targetN !== null) setTargetWeight(targetN);

    success();
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Slim back/cancel button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleCancel}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <X size={20} color={colors.textPrimary} strokeWidth={2} />
        </TouchableOpacity>

        {/* Eyebrow + title */}
        <View style={styles.eyebrowRow}>
          <LinearGradient
            colors={dualGradient.colors}
            start={dualGradient.start}
            end={dualGradient.end}
            style={styles.eyebrowBar}
          />
          <Text style={styles.eyebrow}>EDIT</Text>
        </View>
        <Text style={styles.title}>Your profile</Text>
        <Text style={styles.subtitle}>
          Changes recalculate your daily targets immediately.
        </Text>

        {/* SEX */}
        <Text style={styles.sectionHeader}>SEX</Text>
        <PillGroup
          options={SEX_OPTIONS}
          selected={sex}
          onSelect={(v) => {
            tapLight();
            setSexLocal(v);
          }}
          invalid={!validSex}
        />

        {/* GOAL */}
        <Text style={styles.sectionHeader}>GOAL</Text>
        <PillGroup
          options={GOAL_OPTIONS}
          selected={goal}
          onSelect={(v) => {
            tapLight();
            setGoalLocal(v);
          }}
          invalid={!validGoal}
        />

        {/* BODY */}
        <Text style={styles.sectionHeader}>BODY</Text>
        <View style={styles.card}>
          <NumberRow
            label="Weight"
            value={weight}
            onChange={setWeightLocal}
            unit="lbs"
            placeholder="0.0"
            decimal
            invalid={weight !== '' && !validWeight}
          />
          <Separator />
          <NumberRow
            label="Target weight"
            value={target}
            onChange={setTargetLocal}
            unit="lbs"
            placeholder="optional"
            decimal
            invalid={target !== '' && !validTarget}
          />
          <Separator />
          <View style={styles.heightRow}>
            <Text style={styles.rowLabel}>Height</Text>
            <View style={styles.heightInputs}>
              <TextInput
                style={[styles.heightInput, ft !== '' && !validHeight && styles.inputInvalid]}
                value={ft}
                onChangeText={setFt}
                keyboardType="number-pad"
                placeholder="5"
                placeholderTextColor={colors.textTertiary}
              />
              <Text style={styles.heightUnit}>ft</Text>
              <TextInput
                style={[styles.heightInput, inches !== '' && !validHeight && styles.inputInvalid]}
                value={inches}
                onChangeText={setInches}
                keyboardType="number-pad"
                placeholder="10"
                placeholderTextColor={colors.textTertiary}
              />
              <Text style={styles.heightUnit}>in</Text>
            </View>
          </View>
          <Separator />
          <NumberRow
            label="Age"
            value={age}
            onChange={setAgeLocal}
            unit=""
            placeholder="0"
            invalid={age !== '' && !validAge}
          />
        </View>

        {/* TRAINING */}
        <Text style={styles.sectionHeader}>TRAINING</Text>
        <PillGroup
          options={ACTIVITY_OPTIONS}
          selected={activity}
          onSelect={(v) => {
            tapLight();
            setActivityLocal(v);
          }}
          invalid={!validActivity}
        />

        <View style={{ height: spacing.xl }} />
      </ScrollView>

      {/* Save CTA — dual gradient ring */}
      <LinearGradient
        colors={dualGradient.colors}
        start={dualGradient.start}
        end={dualGradient.end}
        style={[styles.saveRing, !isValid && styles.saveDisabled]}
      >
        <TouchableOpacity
          style={styles.saveInner}
          onPress={() => {
            tapMedium();
            handleSave();
          }}
          disabled={!isValid}
          activeOpacity={0.85}
        >
          <Text style={styles.saveText}>Save changes</Text>
        </TouchableOpacity>
      </LinearGradient>

      <StatusBar style="light" />
    </KeyboardAvoidingView>
  );
}

function PillGroup<T extends string>({
  options,
  selected,
  onSelect,
  invalid,
}: {
  options: { value: T; label: string }[];
  selected: T | null;
  onSelect: (v: T) => void;
  invalid?: boolean;
}) {
  return (
    <View style={[styles.pillGroup, invalid && styles.pillGroupInvalid]}>
      {options.map((opt) => {
        const isSelected = opt.value === selected;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[styles.pill, isSelected && styles.pillSelected]}
            onPress={() => onSelect(opt.value)}
            activeOpacity={0.8}
          >
            <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function NumberRow({
  label,
  value,
  onChange,
  unit,
  placeholder,
  decimal,
  invalid,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit: string;
  placeholder: string;
  decimal?: boolean;
  invalid?: boolean;
}) {
  return (
    <View style={styles.numberRow}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.numberRowRight}>
        <TextInput
          style={[styles.numberInput, invalid && styles.inputInvalid]}
          value={value}
          onChangeText={onChange}
          keyboardType={decimal ? 'decimal-pad' : 'number-pad'}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
        />
        {unit !== '' && <Text style={styles.numberUnit}>{unit}</Text>}
      </View>
    </View>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSolid,
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.xl,
  },
  scroll: { paddingBottom: spacing.lg },

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
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  eyebrowBar: { width: 20, height: 3, borderRadius: 2, marginRight: spacing.sm },
  eyebrow: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    fontSize: 12,
    letterSpacing: 1.5,
  },
  title: { ...typography.title, color: colors.textPrimary, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },

  sectionHeader: {
    ...typography.caption,
    color: colors.textTertiary,
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },

  // Pill selectors
  pillGroup: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.md,
    flexWrap: 'wrap',
  },
  pillGroupInvalid: {
    // visually highlighted via borderColor on the pills? Could add a wrapper hint.
    // keeping subtle — invalid is handled at save time, not aggressive runtime warnings
  },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  pillSelected: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.textPrimary,
  },
  pillText: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 14,
  },
  pillTextSelected: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },

  // Card + rows
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 52,
  },
  rowLabel: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
  },
  numberRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  numberInput: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    backgroundColor: colors.backgroundSolid,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    minWidth: 80,
    textAlign: 'right',
    fontSize: 15,
  },
  numberUnit: {
    color: colors.textTertiary,
    fontSize: 13,
  },
  heightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 52,
  },
  heightInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  heightInput: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    backgroundColor: colors.backgroundSolid,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    minWidth: 50,
    textAlign: 'right',
    fontSize: 15,
  },
  heightUnit: {
    color: colors.textTertiary,
    fontSize: 13,
  },
  inputInvalid: {
    borderWidth: 1,
    borderColor: colors.danger,
  },
  separator: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginLeft: spacing.md,
  },

  // Save CTA
  saveRing: {
    borderRadius: radius.lg,
    padding: 1.5,
  },
  saveDisabled: { opacity: 0.4 },
  saveInner: {
    backgroundColor: colors.surfaceElevated,
    paddingVertical: 18,
    borderRadius: radius.lg - 1.5,
    alignItems: 'center',
  },
  saveText: {
    ...typography.button,
    color: colors.textPrimary,
  },
});
