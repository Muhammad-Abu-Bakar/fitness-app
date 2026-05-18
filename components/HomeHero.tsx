// === NEW === Bulkify redesign step 3: home screen hero.
// Aurora glow (two radial gradients, cyan-left + lime-right), dual-tone progress
// ring showing daily calorie target %, goal-aware headline, and a floating
// "meals logged" pill on the food-domain (cyan) side.

import { View, Text, StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, LinearGradient, Stop, Circle, Rect } from 'react-native-svg';
import { colors, spacing, radius, typography } from '../theme';

interface HomeHeroProps {
  caloriesEaten: number;
  caloriesTarget: number;
  mealsLogged: number;
  goal: string;
}

const RING_SIZE = 200;
const RING_RADIUS = 80;
const RING_STROKE = 10;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function HomeHero({ caloriesEaten, caloriesTarget, mealsLogged, goal }: HomeHeroProps) {
  const progress = Math.min(caloriesEaten / Math.max(caloriesTarget, 1), 1);
  const percent = Math.round(progress * 100);

  const headline =
    goal === 'bulk' ? ['YOUR DAY IS', 'BULKING UP.'] :
    goal === 'lean' ? ['YOUR DAY IS', 'LEANING UP.'] :
    ['HOLDING THE', 'LINE TODAY.'];

  return (
    <View style={styles.hero}>
      <View style={styles.auroraBox} pointerEvents="none">
        <Svg width="100%" height="100%" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
          <Defs>
            <RadialGradient id="auraCyan" cx="30%" cy="50%" rx="55%" ry="55%">
              <Stop offset="0%" stopColor="#22D3EE" stopOpacity="0.55" />
              <Stop offset="60%" stopColor="#22D3EE" stopOpacity="0.15" />
              <Stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="auraLime" cx="70%" cy="50%" rx="55%" ry="55%">
              <Stop offset="0%" stopColor="#A3E635" stopOpacity="0.55" />
              <Stop offset="60%" stopColor="#A3E635" stopOpacity="0.15" />
              <Stop offset="100%" stopColor="#A3E635" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect width="400" height="400" fill="url(#auraCyan)" />
          <Rect width="400" height="400" fill="url(#auraLime)" />
        </Svg>
      </View>

      <View style={styles.headlineWrap}>
        <Text style={styles.headlineLine}>{headline[0]}</Text>
        <Text style={styles.headlineLine}>{headline[1]}</Text>
      </View>

      <View style={styles.ringWrap}>
        <Svg width={RING_SIZE} height={RING_SIZE} viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}>
          <Defs>
            <LinearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#22D3EE" />
              <Stop offset="1" stopColor="#A3E635" />
            </LinearGradient>
          </Defs>
          {/* === CHANGED === Inner dark stage — masks the aurora inside the ring so the
              % and DAILY TARGET text sit on a clean dark background like Image 2. */}
          <Circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_RADIUS - RING_STROKE / 2}
            fill={colors.backgroundSolid}
          />
          {/* === CHANGED === Base ring track — bumped from 0.08 to 0.18 opacity
              for better visibility now that aurora is masked from inside. */}
          <Circle
            cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_RADIUS}
            stroke="rgba(255,255,255,0.18)" strokeWidth={RING_STROKE} fill="none"
          />
          {progress > 0 && (
            <Circle
              cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_RADIUS}
              stroke="url(#ringGrad)" strokeWidth={RING_STROKE} fill="none"
              strokeDasharray={`${progress * RING_CIRCUMFERENCE} ${RING_CIRCUMFERENCE}`}
              strokeLinecap="round"
              transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
            />
          )}
        </Svg>

        <View style={styles.ringCenter} pointerEvents="none">
          <Text style={styles.ringPercent}>{percent}%</Text>
          <Text style={styles.ringLabel}>DAILY TARGET</Text>
        </View>

        {mealsLogged > 0 && (
          <View style={styles.pillTopLeft}>
            <Text style={styles.pillText}>
              {mealsLogged} {mealsLogged === 1 ? 'meal' : 'meals'} logged
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    marginHorizontal: -spacing.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  auroraBox: {
    position: 'absolute',
    top: -40, left: 0, right: 0, bottom: -40,
    zIndex: 0,
  },
  headlineWrap: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    zIndex: 1,
  },
  headlineLine: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 32,
  },
  ringWrap: {
    width: RING_SIZE, height: RING_SIZE,
    alignItems: 'center', justifyContent: 'center',
    zIndex: 1,
    position: 'relative',
  },
  // === CHANGED === added top/left/right/bottom: 0 so the absolute View fills the
  // ring's bounding box and alignItems/justifyContent actually centers the text.
  ringCenter: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringPercent: {
    fontSize: 44,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: 0.5,
    lineHeight: 48,
  },
  // === CHANGED === bumped from textTertiary to textSecondary for a readable label.
  ringLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  pillTopLeft: {
    position: 'absolute',
    top: 4,
    left: -28,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.smd,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.45)',
    zIndex: 3,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textPrimary,
  },
});
