// === NEW === log check-in screen — minimal form: weight + optional notes
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
import { colors, spacing, radius, typography } from '../theme';
import { useCheckIn } from '../context/checkIn';

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

  const handleSave = () => {
    if (!isValid) return;
    const rounded = Math.round(weightN * 10) / 10;
    addCheckIn(getTodayDateString(), rounded, notes);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.backText}>← Cancel</Text>
        </TouchableOpacity>

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

      <TouchableOpacity
        style={[styles.button, !isValid && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={!isValid}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>Save check-in</Text>
      </TouchableOpacity>

      <StatusBar style="light" />
    </KeyboardAvoidingView>
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
  scroll: { paddingBottom: spacing.lg },
  backButton: { alignSelf: 'flex-start', paddingVertical: spacing.sm, marginBottom: spacing.md },
  backText: { ...typography.bodyBold, color: colors.accent },
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
  },
  inputRowMultiline: { alignItems: 'flex-start' },
  input: { flex: 1, ...typography.body, color: colors.textPrimary, paddingVertical: 14, fontSize: 18 },
  inputMultiline: { minHeight: 80, textAlignVertical: 'top', paddingTop: 14 },
  unit: { ...typography.body, color: colors.textTertiary, marginLeft: spacing.sm },
  button: {
    backgroundColor: colors.accent,
    paddingVertical: 18,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { ...typography.button, color: colors.onAccent },
});
