// === NEW === log check-in screen — minimal form: weight + optional notes
// === CHANGED === dual-domain reskin (weigh-in spans food + training outcomes)
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient'; // === NEW ===
import { X } from 'lucide-react-native'; // === NEW ===
import { colors, spacing, radius, typography, dualGradient } from '../theme'; // === CHANGED === added dualGradient
import { useCheckIn } from '../context/checkIn';
import { success, tapLight } from '../lib/haptics'; // === CHANGED === added tapLight

function getTodayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function LogCheckInScreen() {
  const router = useRouter();
  const { addCheckIn } = useCheckIn();

  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');

  const weightN = parseFloat(weight);
  const isValid = !isNaN(weightN) && weightN >= 50 && weightN <= 500;

  // === NEW === light haptic when dismissing
  const handleCancel = () => {
    tapLight();
    router.back();
  };

  const handleSave = () => {
    if (!isValid) return;
    const rounded = Math.round(weightN * 10) / 10;
    addCheckIn(getTodayDateString(), rounded, notes);
    success(); // tactile confirmation
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* === CHANGED === slim 40x40 icon back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleCancel}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <X size={20} color={colors.textPrimary} strokeWidth={2} />
        </TouchableOpacity>

        {/* === NEW === eyebrow with dual-gradient accent bar */}
        <View style={styles.eyebrowRow}>
          <LinearGradient
            colors={dualGradient.colors}
            start={dualGradient.start}
            end={dualGradient.end}
            style={styles.eyebrowBar}
          />
          <Text style={styles.eyebrow}>WEIGH-IN</Text>
        </View>

        <Text style={styles.title}>Weekly check-in</Text>
        <Text style={styles.subtitle}>
          For a trustworthy trend, weigh yourself first thing in the morning — after the
          bathroom, before eating or drinking. Same conditions every week.
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>Your weight today</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
              placeholder="0.0"
              placeholderTextColor={colors.textTertiary}
              autoFocus
            />
            <Text style={styles.unit}>lbs</Text>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Notes (optional)</Text>
          <View style={[styles.inputRow, styles.inputRowMultiline]}>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Felt bloated, post-vacation, etc."
              placeholderTextColor={colors.textTertiary}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>
      </ScrollView>

      {/* === CHANGED === dual-gradient ring around save CTA */}
      <LinearGradient
        colors={dualGradient.colors}
        start={dualGradient.start}
        end={dualGradient.end}
        style={[styles.buttonRing, !isValid && styles.buttonDisabled]}
      >
        <TouchableOpacity
          style={styles.buttonInner}
          onPress={handleSave}
          disabled={!isValid}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Save check-in</Text>
        </TouchableOpacity>
      </LinearGradient>

      <StatusBar style="light" />
    </KeyboardAvoidingView>
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
  scroll: { paddingBottom: spacing.lg },
  // === CHANGED === slim icon back button
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
  // === NEW === eyebrow with gradient accent bar
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  eyebrowBar: {
    width: 20,
    height: 3,
    borderRadius: 2,
    marginRight: spacing.sm,
  },
  eyebrow: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    fontSize: 12,
    letterSpacing: 1.5,
  },
  title: { ...typography.title, color: colors.textPrimary, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },
  field: { marginBottom: spacing.lg },
  label: { ...typography.bodyBold, color: colors.textPrimary, marginBottom: spacing.sm },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1, // === NEW ===
    borderColor: colors.borderDefault, // === NEW === neutral white-ish, cross-domain
  },
  inputRowMultiline: { alignItems: 'flex-start' },
  input: { flex: 1, ...typography.body, color: colors.textPrimary, paddingVertical: 14, fontSize: 18 },
  inputMultiline: { minHeight: 80, textAlignVertical: 'top', paddingTop: 14 },
  unit: { ...typography.body, color: colors.textTertiary, marginLeft: spacing.sm },
  // === CHANGED === dual-gradient ring wrapper
  buttonRing: {
    borderRadius: radius.lg,
    padding: 1.5,
  },
  buttonInner: {
    backgroundColor: colors.surfaceElevated,
    paddingVertical: 18,
    borderRadius: radius.lg - 1.5,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { ...typography.button, color: colors.textPrimary }, // === CHANGED === white text on gradient-bordered surface
});
