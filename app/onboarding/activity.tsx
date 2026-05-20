// === CHANGED === reskin — same pattern as goal screen
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { colors, spacing, radius, typography, dualGradient } from '../../theme';
import { useOnboarding, ActivityLevel } from '../../context/onboarding';
import { tapLight, tapMedium } from '../../lib/haptics';

type ActivityOption = { id: ActivityLevel; title: string; description: string };

const ACTIVITIES: ActivityOption[] = [
  { id: 'sedentary', title: 'Sedentary', description: 'Desk job, little to no exercise' },
  { id: 'light', title: 'Lightly active', description: 'Light exercise 1-3 days a week' },
  { id: 'moderate', title: 'Moderately active', description: 'Exercise 3-5 days a week' },
  { id: 'active', title: 'Very active', description: 'Hard exercise 6-7 days a week' },
];

const TRANSPARENT_GRADIENT = ['transparent', 'transparent'] as const;

export default function ActivityScreen() {
  const router = useRouter();
  const { setActivityLevel } = useOnboarding();
  const [selected, setSelected] = useState<ActivityLevel | null>(null);

  const handleBack = () => {
    tapLight();
    router.back();
  };

  const handleSelect = (id: ActivityLevel) => {
    tapLight();
    setSelected(id);
  };

  const handleContinue = () => {
    if (!selected) return;
    tapMedium();
    setActivityLevel(selected);
    router.push('/onboarding/target');
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
          <View style={styles.dots}>
            {[0, 1, 2, 3, 4].map((i) => (
              <View key={i} style={[styles.dot, i === 3 && styles.dotActive]} />
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
          <Text style={styles.eyebrow}>ACTIVITY</Text>
        </View>
        <Text style={styles.title}>How active are you?</Text>
        <Text style={styles.subtitle}>Include workouts, walking, and physical work.</Text>

        <View style={styles.options}>
          {ACTIVITIES.map((option) => {
            const isSelected = selected === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                onPress={() => handleSelect(option.id)}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={isSelected ? dualGradient.colors : TRANSPARENT_GRADIENT}
                  start={dualGradient.start}
                  end={dualGradient.end}
                  style={styles.cardRing}
                >
                  <View style={[styles.cardInner, !isSelected && styles.cardInnerUnselected]}>
                    <Text style={styles.cardTitle}>{option.title}</Text>
                    <Text style={styles.cardDescription}>{option.description}</Text>
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
  cardRing: { borderRadius: radius.lg, padding: 1.5 },
  cardInner: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg - 1.5,
  },
  cardInnerUnselected: {
    borderWidth: 1,
    borderColor: colors.borderSubtle,
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
