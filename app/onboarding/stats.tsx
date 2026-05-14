// === NEW === onboarding step 2 — weight, height, age (numeric inputs)
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, radius, typography } from '../../theme';
import { useOnboarding } from '../../context/onboarding';

export default function StatsScreen() {
  const router = useRouter();
  const { setStats } = useOnboarding();

  // === NEW === keep inputs as strings (TextInput value must be string), parse on submit
  const [weight, setWeight] = useState('');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [age, setAge] = useState('');

  const weightN = parseFloat(weight);
  const feetN = parseFloat(feet);
  const inchesN = parseFloat(inches);
  const ageN = parseFloat(age);

  // === NEW === sanity-check ranges — disables Continue until all fields are valid
  const isValid =
    !isNaN(weightN) && weightN >= 50 && weightN <= 500 &&
    !isNaN(feetN) && feetN >= 3 && feetN <= 8 &&
    !isNaN(inchesN) && inchesN >= 0 && inchesN < 12 &&
    !isNaN(ageN) && ageN >= 13 && ageN <= 100;

  const handleContinue = () => {
    if (!isValid) return;
    setStats({ weightLbs: weightN, heightFt: feetN, heightIn: inchesN, age: ageN });
    router.push('/onboarding/activity');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.step}>STEP 2 OF 4</Text>
        <Text style={styles.title}>Tell us about yourself</Text>
        <Text style={styles.subtitle}>We'll use this to calculate your daily calorie and protein targets.</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Weight</Text>
          <View style={styles.inputRow}>
            <TextInput style={styles.input} value={weight} onChangeText={setWeight} keyboardType="numeric" placeholder="0" placeholderTextColor={colors.textTertiary} />
            <Text style={styles.unit}>lbs</Text>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Height</Text>
          <View style={styles.heightRow}>
            <View style={[styles.inputRow, styles.heightInput]}>
              <TextInput style={styles.input} value={feet} onChangeText={setFeet} keyboardType="numeric" placeholder="0" placeholderTextColor={colors.textTertiary} />
              <Text style={styles.unit}>ft</Text>
            </View>
            <View style={[styles.inputRow, styles.heightInput]}>
              <TextInput style={styles.input} value={inches} onChangeText={setInches} keyboardType="numeric" placeholder="0" placeholderTextColor={colors.textTertiary} />
              <Text style={styles.unit}>in</Text>
            </View>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Age</Text>
          <View style={styles.inputRow}>
            <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" placeholder="0" placeholderTextColor={colors.textTertiary} />
            <Text style={styles.unit}>years</Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={[styles.button, !isValid && styles.buttonDisabled]} onPress={handleContinue} disabled={!isValid} activeOpacity={0.85}>
        <Text style={styles.buttonText}>Continue</Text>
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
  heightRow: { flexDirection: 'row', gap: spacing.sm },
  heightInput: { flex: 1 },
  button: { backgroundColor: colors.accent, paddingVertical: 18, borderRadius: radius.lg, alignItems: 'center' },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { ...typography.button, color: colors.onAccent },
});