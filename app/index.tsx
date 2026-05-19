// === CHANGED === welcome hero — aurora glow background + split-color brand title
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { ChevronRight } from 'lucide-react-native';
import { colors, spacing, radius, typography, dualGradient } from '../theme';
import { useOnboarding } from '../context/onboarding';
import { tapMedium } from '../lib/haptics';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const { loaded, goal, weightLbs, activityLevel, targetWeightLbs } = useOnboarding();

  if (!loaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.textPrimary} size="large" />
      </View>
    );
  }

  // === CHANGED === unchanged completion check; sex isn't required yet (added in next session)
  const isOnboarded =
    goal !== null && weightLbs !== null && activityLevel !== null && targetWeightLbs !== null;
  if (isOnboarded) return <Redirect href="/home" />;

  const handleGetStarted = () => {
    tapMedium();
    router.push('/onboarding/goal');
  };

  return (
    <View style={styles.container}>
      {/* === NEW === aurora glow background (hand-rolled SVG radial gradients) */}
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <Svg width={SCREEN_W} height={SCREEN_H}>
          <Defs>
            <RadialGradient id="auroraCyan" cx="20%" cy="18%" r="55%">
              <Stop offset="0" stopColor={colors.accentFood} stopOpacity="0.50" />
              <Stop offset="1" stopColor={colors.accentFood} stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="auroraLime" cx="80%" cy="22%" r="55%">
              <Stop offset="0" stopColor={colors.accentTrain} stopOpacity="0.45" />
              <Stop offset="1" stopColor={colors.accentTrain} stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width={SCREEN_W} height={SCREEN_H} fill="url(#auroraCyan)" />
          <Rect x="0" y="0" width={SCREEN_W} height={SCREEN_H} fill="url(#auroraLime)" />
        </Svg>
      </View>

      {/* Centered content */}
      <View style={styles.content}>
        <Text style={styles.eyebrow}>FOR SKINNY GUYS WHO WANT TO GROW</Text>
        <Text style={styles.title}>
          Get <Text style={{ color: colors.accentFood }}>Bigger.</Text>
        </Text>
        <Text style={styles.title}>
          Stay <Text style={{ color: colors.accentTrain }}>Consistent.</Text>
        </Text>
        <Text style={styles.subtitle}>
          Track calories, protein, and workouts built for hardgainers — not the average gym bro.
        </Text>
      </View>

      {/* CTA */}
      <View style={styles.bottom}>
        <LinearGradient
          colors={dualGradient.colors}
          start={dualGradient.start}
          end={dualGradient.end}
          style={styles.ctaRing}
        >
          <TouchableOpacity style={styles.ctaInner} onPress={handleGetStarted} activeOpacity={0.85}>
            <Text style={styles.ctaText}>Get started</Text>
            <ChevronRight size={18} color={colors.textPrimary} strokeWidth={2.5} />
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSolid,
    paddingHorizontal: spacing.lg,
    paddingTop: 100,
    paddingBottom: spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.backgroundSolid,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  eyebrow: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.display,
    fontSize: 52,
    lineHeight: 58,
    color: colors.textPrimary,
    fontWeight: '900',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.lg,
    fontSize: 16,
    lineHeight: 24,
  },
  bottom: {},
  ctaRing: {
    borderRadius: radius.lg,
    padding: 1.5,
  },
  ctaInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surfaceElevated,
    paddingVertical: 18,
    borderRadius: radius.lg - 1.5,
  },
  ctaText: {
    ...typography.button,
    color: colors.textPrimary,
  },
});
