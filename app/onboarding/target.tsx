// === NEW === onboarding step 4 — target weight; final step before main app
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, radius, typography } from '../../theme';
import { useOnboarding } from '../../context/onboarding';

export default function TargetScreen() {
  const router = useRouter();
  // === NEW === read current weight from context to show the gain hint
  const { weightLbs, setTargetWeight } = useOnboarding();
  const [target, setTarget] = useState('');

  const targetN = parseFloat(target);
  const isValid = !isNaN(targetN) && targetN >= 50 && targetN <= 500;

  // === NEW === computed hint — how many lbs to gain
  const diff = weightLbs && !isNaN(targetN) ? targetN - weightLbs : null;
  const hintText = diff !== null
    ? diff > 0 ? `${Math.round(diff)} lbs to gain` : diff < 0 ? `${Math.round(Math.abs(diff))} lbs to lose` : 'Same as current'
    : null;

  const handleContinue = () => {
    if (!isValid) return;
    setTargetWeight(targetN);
    // === NEW === replace = no back gesture into onboarding from home
    router.replace('/home');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.step}>STEP 4 OF 4</Text>
        <Text style={styles.title}>What's your target weight?</Text>
        <Text style={styles.subtitle}>
          {weightLbs ? `You're at ${weightLbs} lbs now. ` : ''}Pick a realistic target — we'll plan around it.
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>Target weight</Text>
          <View style={styles.inputRow}>
            <TextInput style={styles.input} value={target} onChangeText={setTarget} keyboardType="numeric" placeholder="0" placeholderTextColor={colors.textTertiary} />
            <Text style={styles.unit}>lbs</Text>
          </View>
          {hintText && <Text style={styles.hint}>{hintText}</Text>}
        </View>
      </ScrollView>

      <TouchableOpacity style={[styles.button, !isValid && styles.buttonDisabled]} onPress={handleContinue} disabled={!isValid} activeOpacity={0.85}>
        <Text style={styles.buttonText}>Finish setup</Text>
      </TouchableOpacity>

      <StatusBar style="light" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.lg, paddingTop: 80, paddingBottom: spacing.xl },
  scroll: { paddingBottom: spacing.lg },
  step: { ...typography.caption, color: colors.accent, marginBottom: spacing.md },
  title: { ...typography.title, color: colors.textPrimary, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },
  field: { marginBottom: spacing.lg },
  label: { ...typography.bodyBold, color: colors.textPrimary, marginBottom: spacing.sm },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: spacing.md },
  input: { flex: 1, ...typography.body, color: colors.textPrimary, paddingVertical: 14, fontSize: 18 },
  unit: { ...typography.body, color: colors.textTertiary, marginLeft: spacing.sm },
  hint: { ...typography.body, color: colors.accent, marginTop: spacing.sm },
  button: { backgroundColor: colors.accent, paddingVertical: 18, borderRadius: radius.lg, alignItems: 'center' },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { ...typography.button, color: colors.onAccent },
});