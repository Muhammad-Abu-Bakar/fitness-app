// === CHANGED === reskin — slim back, progress dots, dual eyebrow, gradient-ring selected cards + CTA
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { colors, spacing, radius, typography, dualGradient } from '../../theme';
import { useOnboarding, Goal } from '../../context/onboarding';
import { tapLight, tapMedium } from '../../lib/haptics';

type GoalOption = { id: Goal; title: string; description: string };

const GOALS: GoalOption[] = [
  { id: 'bulk', title: 'Bulk up', description: 'Gain weight and muscle as fast as possible' },
  { id: 'lean', title: 'Lean gains', description: 'Build muscle while staying lean' },
  { id: 'exploring', title: 'Just exploring', description: "I'm not sure yet — show me what's possible" },
];

const TRANSPARENT_GRADIENT = ['transparent', 'transparent'] as const;

export default function GoalScreen() {
  const router = useRouter();
  const { setGoal } = useOnboarding();
  const [selected, setSelected] = useState<Goal | null>(null);

  const handleBack = () => {
    tapLight();
    router.back();
  };

  const handleSelect = (id: Goal) => {
    tapLight();
    setSelected(id);
  };

  const handleContinue = () => {
    if (!selected) return;
    tapMedium();
    setGoal(selected);
    router.push('/onboarding/stats');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ChevronLeft size={22} color={colors.textPrimary} strokeWidth={2} />
          </TouchableOpacity>
          <ProgressDots current={0} total={4} />
        </View>

        <View style={styles.eyebrowRow}>
          <LinearGradient
            colors={dualGradient.colors}
            start={dualGradient.start}
            end={dualGradient.end}
            style={styles.eyebrowBar}
          />
          <Text style={styles.eyebrow}>YOUR GOAL</Text>
        </View>
        <Text style={styles.title}>What's your goal?</Text>
        <Text style={styles.subtitle}>We'll tune your calorie and protein targets to match.</Text>

        <View style={styles.options}>
          {GOALS.map((goal) => {
            const isSelected = selected === goal.id;
            return (
              <TouchableOpacity
                key={goal.id}
                onPress={() => handleSelect(goal.id)}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={isSelected ? dualGradient.colors : TRANSPARENT_GRADIENT}
                  start={dualGradient.start}
                  end={dualGradient.end}
                  style={styles.cardRing}
                >
                  <View style={[styles.cardInner, !isSelected && styles.cardInnerUnselected]}>
                    <Text style={styles.cardTitle}>{goal.title}</Text>
                    <Text style={styles.cardDescription}>{goal.description}</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <LinearGradient
        colors={dualGradient.colors}
        start={dualGradient.start}
        end={dualGradient.end}
        style={[styles.ctaRing, !selected && styles.ctaDisabled]}
      >
        <TouchableOpacity
          style={styles.ctaInner}
          onPress={handleContinue}
          disabled={!selected}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>Continue</Text>
          <ChevronRight size={18} color={colors.textPrimary} strokeWidth={2.5} />
        </TouchableOpacity>
      </LinearGradient>

      <StatusBar style="light" />
    </View>
  );
}

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <View style={styles.dots}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[styles.dot, i === current && styles.dotActive]} />
      ))}
    </View>
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
  options: { gap: spacing.md },
  cardRing: {
    borderRadius: radius.lg,
    padding: 1.5,
  },
  cardInner: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg - 1.5,
  },
  cardInnerUnselected: {
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    // negate the 1.5 padding from cardRing visually
  },
  cardTitle: { ...typography.heading, color: colors.textPrimary, marginBottom: spacing.xs },
  cardDescription: { ...typography.body, color: colors.textSecondary },
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
