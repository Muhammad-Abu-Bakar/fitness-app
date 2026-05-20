// === CHANGED === reskin — same input pattern as stats screen + dual eyebrow + gradient CTA "Finish setup"
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
import { ChevronLeft, Sparkles } from 'lucide-react-native';
import { colors, spacing, radius, typography, dualGradient } from '../../theme';
import { useOnboarding } from '../../context/onboarding';
import { tapLight, success } from '../../lib/haptics';

export default function TargetScreen() {
  const router = useRouter();
  const { weightLbs, setTargetWeight } = useOnboarding();
  const [target, setTarget] = useState('');

  const targetN = parseFloat(target);
  const isValid = !isNaN(targetN) && targetN >= 50 && targetN <= 500;

  const diff = weightLbs && !isNaN(targetN) ? targetN - weightLbs : null;
  const hintText =
    diff !== null
      ? diff > 0
        ? `${Math.round(diff)} lbs to gain`
        : diff < 0
          ? `${Math.round(Math.abs(diff))} lbs to lose`
          : 'Same as current'
      : null;
  const hintColor =
    diff !== null && diff > 0
      ? colors.accentTrain // gain = training accent
      : diff !== null && diff < 0
        ? colors.accentFood // lose = food accent
        : colors.textTertiary;

  const handleBack = () => {
    tapLight();
    router.back();
  };

  const handleContinue = () => {
    if (!isValid) return;
    setTargetWeight(targetN);
    router.push('/onboarding/done'); // push so done screen handles the celebration + replace
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
            {[0, 1, 2, 3, 4].map((i) => (
              <View key={i} style={[styles.dot, i === 4 && styles.dotActive]} />
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
          <Text style={styles.eyebrow}>TARGET</Text>
        </View>
        <Text style={styles.title}>What's your target weight?</Text>
        <Text style={styles.subtitle}>
          {weightLbs ? `You're at ${weightLbs} lbs now. ` : ''}
          Pick a realistic target — we'll plan around it.
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>Target weight</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={target}
              onChangeText={setTarget}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.textTertiary}
            />
            <Text style={styles.unit}>lbs</Text>
          </View>
          {hintText && <Text style={[styles.hint, { color: hintColor }]}>{hintText}</Text>}
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
          <Sparkles size={18} color={colors.textPrimary} strokeWidth={2.5} />
          <Text style={styles.ctaText}>Finish setup</Text>
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
  hint: { ...typography.bodyBold, marginTop: spacing.sm },
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
