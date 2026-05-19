// === CHANGED === reskin — slim back, progress dots, dual eyebrow, neutral input borders, gradient CTA
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
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
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { colors, spacing, radius, typography, dualGradient } from '../../theme';
import { useOnboarding } from '../../context/onboarding';
import { tapLight, tapMedium } from '../../lib/haptics';

export default function StatsScreen() {
  const router = useRouter();
  const { setStats } = useOnboarding();

  const [weight, setWeight] = useState('');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [age, setAge] = useState('');

  const weightN = parseFloat(weight);
  const feetN = parseFloat(feet);
  const inchesN = parseFloat(inches);
  const ageN = parseFloat(age);

  const isValid =
    !isNaN(weightN) && weightN >= 50 && weightN <= 500 &&
    !isNaN(feetN) && feetN >= 3 && feetN <= 8 &&
    !isNaN(inchesN) && inchesN >= 0 && inchesN < 12 &&
    !isNaN(ageN) && ageN >= 13 && ageN <= 100;

  const handleBack = () => {
    tapLight();
    router.back();
  };

  const handleContinue = () => {
    if (!isValid) return;
    tapMedium();
    setStats({ weightLbs: weightN, heightFt: feetN, heightIn: inchesN, age: ageN });
    router.push('/onboarding/activity');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.topRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ChevronLeft size={22} color={colors.textPrimary} strokeWidth={2} />
          </TouchableOpacity>
          <View style={styles.dots}>
            {[0, 1, 2, 3].map((i) => (
              <View key={i} style={[styles.dot, i === 1 && styles.dotActive]} />
            ))}
          </View>
        </View>

        <View style={styles.eyebrowRow}>
          <LinearGradient
            colors={dualGradient.colors}
            start={dualGradient.start}
            end={dualGradient.end}
            style={styles.eyebrowBar}
          />
          <Text style={styles.eyebrow}>YOUR BODY</Text>
        </View>
        <Text style={styles.title}>Tell us about yourself</Text>
        <Text style={styles.subtitle}>
          We'll use this to calculate your daily calorie and protein targets.
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>Weight</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.textTertiary}
            />
            <Text style={styles.unit}>lbs</Text>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Height</Text>
          <View style={styles.heightRow}>
            <View style={[styles.inputRow, styles.heightInput]}>
              <TextInput
                style={styles.input}
                value={feet}
                onChangeText={setFeet}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.textTertiary}
              />
              <Text style={styles.unit}>ft</Text>
            </View>
            <View style={[styles.inputRow, styles.heightInput]}>
              <TextInput
                style={styles.input}
                value={inches}
                onChangeText={setInches}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.textTertiary}
              />
              <Text style={styles.unit}>in</Text>
            </View>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Age</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.textTertiary}
            />
            <Text style={styles.unit}>years</Text>
          </View>
        </View>
      </ScrollView>

      <LinearGradient
        colors={dualGradient.colors}
        start={dualGradient.start}
        end={dualGradient.end}
        style={[styles.ctaRing, !isValid && styles.ctaDisabled]}
      >
        <TouchableOpacity
          style={styles.ctaInner}
          onPress={handleContinue}
          disabled={!isValid}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>Continue</Text>
          <ChevronRight size={18} color={colors.textPrimary} strokeWidth={2.5} />
        </TouchableOpacity>
      </LinearGradient>

      <StatusBar style="light" />
    </KeyboardAvoidingView>
  );
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
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.surfaceElevated },
  dotActive: { width: 24, height: 6, backgroundColor: colors.textPrimary },
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
  field: { marginBottom: spacing.lg },
  label: { ...typography.bodyBold, color: colors.textPrimary, marginBottom: spacing.sm },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: 14,
    fontSize: 18,
  },
  unit: { ...typography.body, color: colors.textTertiary, marginLeft: spacing.sm },
  heightRow: { flexDirection: 'row', gap: spacing.sm },
  heightInput: { flex: 1 },
  ctaRing: { borderRadius: radius.lg, padding: 1.5 },
  ctaDisabled: { opacity: 0.4 },
  ctaInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surfaceElevated,
    paddingVertical: 18,
    borderRadius: radius.lg - 1.5,
  },
  ctaText: { ...typography.button, color: colors.textPrimary },
});
