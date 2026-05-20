// === NEW === onboarding step 2 — sex picker with avatar previews
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { colors, spacing, radius, typography, dualGradient } from '../../theme';
import { useOnboarding, type Sex } from '../../context/onboarding';
import { AvatarSvg } from '../../components/AvatarSvg';
import { tapLight, tapMedium } from '../../lib/haptics';

const TRANSPARENT_GRADIENT = ['transparent', 'transparent'] as const;

const OPTIONS: { value: Sex; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

export default function SexScreen() {
  const router = useRouter();
  const { setSex } = useOnboarding();
  const [selected, setSelected] = useState<Sex | null>(null);

  const handleBack = () => {
    tapLight();
    router.back();
  };

  const handleSelect = (s: Sex) => {
    tapLight();
    setSelected(s);
  };

  const handleContinue = () => {
    if (!selected) return;
    tapMedium();
    setSex(selected);
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
          <View style={styles.dots}>
            {[0, 1, 2, 3, 4].map((i) => (
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
          <Text style={styles.eyebrow}>ABOUT YOU</Text>
        </View>
        <Text style={styles.title}>What's your sex?</Text>
        <Text style={styles.subtitle}>
          We'll use this to personalize your daily targets and avatar.
        </Text>

        <View style={styles.cardRow}>
          {OPTIONS.map((opt) => {
            const isSelected = selected === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                style={styles.cardOuter}
                onPress={() => handleSelect(opt.value)}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={isSelected ? dualGradient.colors : TRANSPARENT_GRADIENT}
                  start={dualGradient.start}
                  end={dualGradient.end}
                  style={styles.cardRing}
                >
                  <View style={[styles.cardInner, !isSelected && styles.cardInnerUnselected]}>
                    <View style={styles.avatarHole}>
                      <AvatarSvg sex={opt.value} color={colors.textPrimary} size={84} />
                    </View>
                    <Text style={styles.cardLabel}>{opt.label}</Text>
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

  // Side-by-side avatar cards
  cardRow: { flexDirection: 'row', gap: spacing.md },
  cardOuter: { flex: 1 },
  cardRing: { borderRadius: radius.lg, padding: 1.5 },
  cardInner: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg - 1.5,
    alignItems: 'center',
    gap: spacing.md,
  },
  cardInnerUnselected: {
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  avatarHole: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cardLabel: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    fontSize: 16,
  },

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
