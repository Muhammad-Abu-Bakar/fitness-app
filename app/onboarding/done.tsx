// === NEW === onboarding final celebration — reveals computed daily targets
import { useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { Trophy, ChevronRight } from 'lucide-react-native';
import { colors, spacing, radius, typography, dualGradient } from '../../theme';
import { useOnboarding } from '../../context/onboarding';
import { calculateTargets } from '../../lib/nutrition';
import { tapMedium } from '../../lib/haptics';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export default function DoneScreen() {
  const router = useRouter();
  const {
    loaded,
    goal,
    weightLbs,
    heightFt,
    heightIn,
    age,
    activityLevel,
    targetWeightLbs,
    sex,
  } = useOnboarding();

  const targets = useMemo(() => {
    if (
      weightLbs === null || heightFt === null || heightIn === null ||
      age === null || !activityLevel || !goal
    ) return null;
    return calculateTargets(weightLbs, heightFt, heightIn, age, activityLevel, goal, sex);
  }, [weightLbs, heightFt, heightIn, age, activityLevel, goal, sex]);

  if (!loaded) return null;
  // Safety fallback — if somehow we landed here without data, bounce home
  if (!targets || targetWeightLbs === null) return <Redirect href="/home" />;

  const subtitle =
    goal === 'bulk'
      ? `Hit these targets daily and you'll be at ${targetWeightLbs} lbs in no time.`
      : goal === 'lean'
        ? `Hit these targets daily to lean down to ${targetWeightLbs} lbs.`
        : `Hit these targets daily to move toward ${targetWeightLbs} lbs.`;

  const handleStart = () => {
    tapMedium();
    router.replace('/home');
  };

  return (
    <View style={styles.container}>
      {/* Aurora bookend — same treatment as welcome screen */}
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <Svg width={SCREEN_W} height={SCREEN_H}>
          <Defs>
            <RadialGradient id="doneCyan" cx="20%" cy="18%" r="55%">
              <Stop offset="0" stopColor={colors.accentFood} stopOpacity="0.45" />
              <Stop offset="1" stopColor={colors.accentFood} stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="doneLime" cx="80%" cy="22%" r="55%">
              <Stop offset="0" stopColor={colors.accentTrain} stopOpacity="0.50" />
              <Stop offset="1" stopColor={colors.accentTrain} stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width={SCREEN_W} height={SCREEN_H} fill="url(#doneCyan)" />
          <Rect x="0" y="0" width={SCREEN_W} height={SCREEN_H} fill="url(#doneLime)" />
        </Svg>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.celebration}>
          <View style={styles.trophyHalo}>
            <Trophy size={48} color={colors.accentTrain} strokeWidth={2} />
          </View>
          <Text style={styles.title}>All set.</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        {/* Two target cards with cyan stripes (food/nutrition domain) */}
        <View style={styles.cardRow}>
          <View style={styles.cardWrap}>
            <View style={[styles.cardStripe, { backgroundColor: colors.accentFood }]} />
            <View style={styles.cardInner}>
              <Text style={styles.cardLabel}>CALORIES</Text>
              <Text style={styles.cardValue}>{targets.calories.toLocaleString()}</Text>
              <Text style={styles.cardUnit}>kcal / day</Text>
            </View>
          </View>
          <View style={styles.cardWrap}>
            <View style={[styles.cardStripe, { backgroundColor: colors.accentFood }]} />
            <View style={styles.cardInner}>
              <Text style={styles.cardLabel}>PROTEIN</Text>
              <Text style={styles.cardValue}>{targets.protein}</Text>
              <Text style={styles.cardUnit}>g / day</Text>
            </View>
          </View>
        </View>

        <Text style={styles.note}>
          You can adjust your goals anytime from your profile.
        </Text>
      </ScrollView>

      <LinearGradient
        colors={dualGradient.colors}
        start={dualGradient.start}
        end={dualGradient.end}
        style={styles.ctaRing}
      >
        <TouchableOpacity style={styles.ctaInner} onPress={handleStart} activeOpacity={0.85}>
          <Text style={styles.ctaText}>Start tracking</Text>
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
    paddingTop: 80,
    paddingBottom: spacing.xl,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },

  // Celebration block
  celebration: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  trophyHalo: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(163,230,53,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(163,230,53,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.display,
    fontSize: 48,
    lineHeight: 54,
    color: colors.textPrimary,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
    fontSize: 16,
    lineHeight: 22,
  },

  // Target cards
  cardRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  cardWrap: {
    flex: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  cardStripe: { height: 4 },
  cardInner: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    alignItems: 'center',
  },
  cardLabel: {
    ...typography.bodyBold,
    color: colors.accentFood,
    fontSize: 11,
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
  },
  cardValue: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.textPrimary,
    lineHeight: 40,
  },
  cardUnit: {
    color: colors.textTertiary,
    fontSize: 12,
    marginTop: 4,
  },

  note: {
    ...typography.body,
    color: colors.textTertiary,
    textAlign: 'center',
    fontSize: 13,
  },

  // CTA
  ctaRing: { borderRadius: radius.lg, padding: 1.5 },
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
