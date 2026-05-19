// === CHANGED === Stats day 1 — hero band + weight trend
import { useMemo } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { Scale, Dumbbell, ChevronRight, TrendingUp } from 'lucide-react-native';
import { colors, spacing, radius, typography, dualGradient } from '../../theme';
import { useCheckIn } from '../../context/checkIn';
import { useWorkoutLog } from '../../context/workoutLog';
import { getLatestCheckIn, getTotalChangeLbs, formatWeightChange } from '../../lib/checkIns/stats';
import { formatDateLabel } from '../../lib/dates';
import { tapLight } from '../../lib/haptics';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_HEIGHT = 130;
// Chart fits inside outer padding + card padding
const CHART_WIDTH = SCREEN_WIDTH - (spacing.lg * 2) - (spacing.lg * 2);
const MAX_CHART_POINTS = 8;

export default function StatsScreen() {
  const router = useRouter();
  const { checkIns, isLoaded: checkInsLoaded } = useCheckIn();
  const { sessions, isLoaded: sessionsLoaded } = useWorkoutLog();

  // Hooks before any early returns
  const workoutsLast7Days = useMemo(() => {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return sessions.filter(
      (s) => s.completedAt !== null && s.sets.length > 0 && s.completedAt >= cutoff,
    ).length;
  }, [sessions]);

  const trendPoints = useMemo(() => {
    return [...checkIns]
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-MAX_CHART_POINTS);
  }, [checkIns]);

  if (!checkInsLoaded || !sessionsLoaded) return null;

  // Derived values
  const latest = getLatestCheckIn(checkIns);
  const totalChange = getTotalChangeLbs(checkIns);
  const hasMultipleCheckIns = checkIns.length >= 2;
  const hasAnyCompletedWorkout = sessions.some(
    (s) => s.completedAt !== null && s.sets.length > 0,
  );

  // Smart routing — go where it's useful based on state
  const goCheckIn = () => {
    tapLight();
    router.push(checkIns.length > 0 ? '/check-in' : '/log-checkin');
  };
  const goWorkouts = () => {
    tapLight();
    router.push(hasAnyCompletedWorkout ? '/workout/history' : '/workouts');
  };
  const goFoodHistory = () => {
    tapLight();
    router.push('/history');
  };

  const links = [
    { label: 'Workout history', onPress: goWorkouts },
    { label: 'Check-in history', onPress: goCheckIn },
    { label: 'Food log history', onPress: goFoodHistory },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.eyebrowRow}>
          <LinearGradient
            colors={dualGradient.colors}
            start={dualGradient.start}
            end={dualGradient.end}
            style={styles.eyebrowBar}
          />
          <Text style={styles.eyebrow}>OVERVIEW</Text>
        </View>
        <Text style={styles.title}>Stats</Text>
        <Text style={styles.subtitle}>
          How body, food, and training are trending together.
        </Text>

        {/* Hero band — weight + workouts side by side */}
        <View style={styles.heroBand}>
          {/* Weight card */}
          <TouchableOpacity style={styles.heroCardWrap} onPress={goCheckIn} activeOpacity={0.85}>
            <View style={[styles.heroStripe, { backgroundColor: colors.accentFood }]} />
            <View style={styles.heroCardInner}>
              <View style={styles.heroIconRow}>
                <Scale size={16} color={colors.accentFood} strokeWidth={2.5} />
                <Text style={[styles.heroLabel, { color: colors.accentFood }]}>WEIGHT</Text>
              </View>
              {latest ? (
                <>
                  <Text style={styles.heroValue}>{latest.weightLbs.toFixed(1)}</Text>
                  <Text style={styles.heroUnit}>lbs</Text>
                  <Text style={styles.heroSubLabel}>
                    {hasMultipleCheckIns ? `${formatWeightChange(totalChange)} all-time` : 'First check-in'}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.heroValueEmpty}>—</Text>
                  <Text style={styles.heroSubLabel}>Tap to log</Text>
                </>
              )}
            </View>
          </TouchableOpacity>

          {/* Workouts card */}
          <TouchableOpacity style={styles.heroCardWrap} onPress={goWorkouts} activeOpacity={0.85}>
            <View style={[styles.heroStripe, { backgroundColor: colors.accentTrain }]} />
            <View style={styles.heroCardInner}>
              <View style={styles.heroIconRow}>
                <Dumbbell size={16} color={colors.accentTrain} strokeWidth={2.5} />
                <Text style={[styles.heroLabel, { color: colors.accentTrain }]}>WORKOUTS</Text>
              </View>
              <Text style={styles.heroValue}>{workoutsLast7Days}</Text>
              <Text style={styles.heroUnit}>{workoutsLast7Days === 1 ? 'session' : 'sessions'}</Text>
              <Text style={styles.heroSubLabel}>past 7 days</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Weight trend */}
        <View style={styles.sectionHeaderRow}>
          <LinearGradient
            colors={dualGradient.colors}
            start={dualGradient.start}
            end={dualGradient.end}
            style={styles.eyebrowBar}
          />
          <Text style={styles.sectionHeader}>WEIGHT TREND</Text>
        </View>

        <TouchableOpacity style={styles.trendCard} onPress={goCheckIn} activeOpacity={0.85}>
          {trendPoints.length < 2 ? (
            <View style={styles.trendEmpty}>
              <TrendingUp size={28} color={colors.textTertiary} strokeWidth={1.5} />
              <Text style={styles.trendEmptyTitle}>
                {trendPoints.length === 0 ? 'No check-ins yet' : 'Need at least 2 check-ins'}
              </Text>
              <Text style={styles.trendEmptyBody}>
                Log your weight weekly to see the line take shape.
              </Text>
            </View>
          ) : (
            <>
              <WeightTrendChart points={trendPoints} />
              <View style={styles.trendFooter}>
                <View>
                  <Text style={styles.trendSmallLabel}>{formatDateLabel(trendPoints[0].date)}</Text>
                  <Text style={styles.trendSmallValue}>{trendPoints[0].weightLbs.toFixed(1)} lbs</Text>
                </View>
                <ChevronRight size={16} color={colors.textTertiary} strokeWidth={2} />
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.trendSmallLabel}>
                    {formatDateLabel(trendPoints[trendPoints.length - 1].date)}
                  </Text>
                  <Text style={styles.trendSmallValue}>
                    {trendPoints[trendPoints.length - 1].weightLbs.toFixed(1)} lbs
                  </Text>
                </View>
              </View>
            </>
          )}
        </TouchableOpacity>

        {/* Quick links — temporary until we add Recent Workouts + Food Adherence sections */}
        <Text style={styles.sectionHeaderQuiet}>MORE</Text>
        <View style={styles.linksList}>
          {links.map((link, i) => (
            <TouchableOpacity
              key={link.label}
              style={[styles.linkRow, i === links.length - 1 && styles.linkRowLast]}
              onPress={link.onPress}
              activeOpacity={0.7}
            >
              <Text style={styles.linkText}>{link.label}</Text>
              <ChevronRight size={16} color={colors.textTertiary} strokeWidth={2} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
}

// Hand-drawn SVG sparkline — dual gradient stroke + soft cyan area fill
function WeightTrendChart({ points }: { points: { weightLbs: number; date: string }[] }) {
  const weights = points.map((p) => p.weightLbs);
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const range = Math.max(0.5, max - min); // floor so flat trend doesn't divide by zero

  const padding = 10;
  const innerW = CHART_WIDTH - padding * 2;
  const innerH = CHART_HEIGHT - padding * 2;

  const coords = points.map((p, i) => {
    const x = padding + (i * innerW) / Math.max(1, points.length - 1);
    const y = padding + innerH - ((p.weightLbs - min) / range) * innerH;
    return { x, y };
  });

  const linePath = coords
    .map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(' ');

  const areaPath =
    linePath +
    ` L ${coords[coords.length - 1].x.toFixed(1)} ${(CHART_HEIGHT - padding).toFixed(1)}` +
    ` L ${coords[0].x.toFixed(1)} ${(CHART_HEIGHT - padding).toFixed(1)}` +
    ` Z`;

  return (
    <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
      <Defs>
        <SvgLinearGradient id="strokeGrad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={colors.accentFood} stopOpacity="1" />
          <Stop offset="1" stopColor={colors.accentTrain} stopOpacity="1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={colors.accentFood} stopOpacity="0.18" />
          <Stop offset="1" stopColor={colors.accentFood} stopOpacity="0" />
        </SvgLinearGradient>
      </Defs>
      <Path d={areaPath} fill="url(#areaGrad)" />
      <Path
        d={linePath}
        stroke="url(#strokeGrad)"
        strokeWidth={2.5}
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSolid,
    paddingHorizontal: spacing.lg,
    paddingTop: 80,
  },
  scroll: {
    paddingBottom: 100, // tab bar clearance
  },

  // Header
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  eyebrowBar: {
    width: 20,
    height: 3,
    borderRadius: 2,
    marginRight: spacing.sm,
  },
  eyebrow: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    fontSize: 12,
    letterSpacing: 1.5,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },

  // Hero band
  heroBand: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  heroCardWrap: {
    flex: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  heroStripe: {
    height: 4,
  },
  heroCardInner: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    minHeight: 130,
  },
  heroIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  heroLabel: {
    ...typography.bodyBold,
    fontSize: 11,
    letterSpacing: 1.5,
  },
  heroValue: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.textPrimary,
    lineHeight: 40,
  },
  heroValueEmpty: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.textTertiary,
    lineHeight: 40,
  },
  heroUnit: {
    color: colors.textTertiary,
    fontSize: 13,
    marginTop: 2,
  },
  heroSubLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: spacing.xs,
  },

  // Section header
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionHeader: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    fontSize: 12,
    letterSpacing: 1.5,
  },
  sectionHeaderQuiet: {
    ...typography.caption,
    color: colors.textTertiary,
    letterSpacing: 1.5,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },

  // Trend card
  trendCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  trendFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  trendSmallLabel: {
    color: colors.textTertiary,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  trendSmallValue: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    fontSize: 14,
    marginTop: 2,
  },
  trendEmpty: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  trendEmptyTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  trendEmptyBody: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  // Quick links
  linksList: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    overflow: 'hidden',
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  linkRowLast: {
    borderBottomWidth: 0,
  },
  linkText: {
    ...typography.body,
    color: colors.textPrimary,
  },
});
