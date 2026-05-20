// === CHANGED === Stats day 2 — added Recent Workouts + Food Adherence sections
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
import { useFoodLog } from '../../context/foodLog';
import { useOnboarding } from '../../context/onboarding';
import { getLatestCheckIn, getTotalChangeLbs, formatWeightChange } from '../../lib/checkIns/stats';
import {
  getSessionDurationSeconds,
  formatDuration,
  getSessionVolumeLbs,
  getSessionSetCount,
} from '../../lib/workouts/sessionStats';
import { getProgramById } from '../../lib/workouts/programs';
import { calculateTargets } from '../../lib/nutrition';
import { formatDateLabel, getPastNDates } from '../../lib/dates';
import type { WorkoutSession } from '../../lib/workouts/types';
import { tapLight } from '../../lib/haptics';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_HEIGHT = 130;
const CHART_WIDTH = SCREEN_WIDTH - (spacing.lg * 2) - (spacing.lg * 2);
const MAX_CHART_POINTS = 8;
const RECENT_WORKOUTS_LIMIT = 3;
const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;

function todayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function StatsScreen() {
  const router = useRouter();
  const { checkIns, isLoaded: checkInsLoaded } = useCheckIn();
  const { sessions, isLoaded: sessionsLoaded } = useWorkoutLog();
  const { goal, weightLbs, heightFt, heightIn, age, activityLevel, sex } = useOnboarding();

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

  const targets = useMemo(() => {
    if (
      weightLbs === null || heightFt === null || heightIn === null ||
      age === null || !activityLevel || !goal
    ) return null;
    return calculateTargets(weightLbs, heightFt, heightIn, age, activityLevel, goal, sex);
  }, [weightLbs, heightFt, heightIn, age, activityLevel, goal, sex]);

  if (!checkInsLoaded || !sessionsLoaded) return null;

  // Derived
  const latest = getLatestCheckIn(checkIns);
  const totalChange = getTotalChangeLbs(checkIns);
  const hasMultipleCheckIns = checkIns.length >= 2;
  const hasAnyCompletedWorkout = sessions.some(
    (s) => s.completedAt !== null && s.sets.length > 0,
  );

  // Nav
  const goCheckIn = () => {
    tapLight();
    router.push(checkIns.length > 0 ? '/check-in' : '/log-checkin');
  };
  const goWorkouts = () => {
    tapLight();
    router.push(hasAnyCompletedWorkout ? '/workout/history' : '/workouts');
  };

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

        {/* Hero band */}
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

        {/* === NEW === Recent Workouts */}
        <RecentWorkoutsSection />

        {/* === NEW === Food Adherence (hidden if onboarding incomplete) */}
        {targets && <FoodAdherenceSection proteinTarget={targets.protein} />}
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
}

// === NEW === Recent Workouts section
function RecentWorkoutsSection() {
  const router = useRouter();
  const { sessions } = useWorkoutLog();

  const completedSessions = useMemo(() => {
    return sessions
      .filter((s) => s.completedAt !== null && s.sets.length > 0)
      .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0));
  }, [sessions]);

  const recent = completedSessions.slice(0, RECENT_WORKOUTS_LIMIT);
  const hasMore = completedSessions.length > RECENT_WORKOUTS_LIMIT;

  const goSession = (id: string) => {
    tapLight();
    router.push(`/workout/history/${id}`);
  };
  const goAll = () => {
    tapLight();
    router.push('/workout/history');
  };
  const goStart = () => {
    tapLight();
    router.push('/workouts');
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeaderRow}>
        <View style={[styles.eyebrowBar, { backgroundColor: colors.accentTrain }]} />
        <Text style={styles.sectionHeader}>RECENT WORKOUTS</Text>
      </View>

      {recent.length === 0 ? (
        <View style={styles.sectionEmpty}>
          <Dumbbell size={28} color={colors.textTertiary} strokeWidth={1.5} />
          <Text style={styles.sectionEmptyTitle}>No workouts yet</Text>
          <Text style={styles.sectionEmptyBody}>
            Complete a workout and it'll show up here.
          </Text>
          <TouchableOpacity style={styles.linkRowInline} onPress={goStart} activeOpacity={0.7}>
            <Text style={[styles.linkRowInlineText, { color: colors.accentTrain }]}>Browse programs</Text>
            <ChevronRight size={14} color={colors.accentTrain} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {recent.map((session) => (
            <RecentWorkoutRow
              key={session.id}
              session={session}
              onPress={() => goSession(session.id)}
            />
          ))}
          {hasMore && (
            <TouchableOpacity style={styles.linkRowInline} onPress={goAll} activeOpacity={0.7}>
              <Text style={[styles.linkRowInlineText, { color: colors.accentTrain }]}>View all workouts</Text>
              <ChevronRight size={14} color={colors.accentTrain} strokeWidth={2.5} />
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}

function RecentWorkoutRow({
  session,
  onPress,
}: {
  session: WorkoutSession;
  onPress: () => void;
}) {
  const program = getProgramById(session.programId);
  const day = program?.days.find((d) => d.id === session.dayId);
  const programName = program?.name ?? 'Workout';
  const dayName = day?.name ?? session.dayId;

  const duration = formatDuration(getSessionDurationSeconds(session));
  const volume = getSessionVolumeLbs(session);
  const sets = getSessionSetCount(session);

  return (
    <TouchableOpacity style={styles.recentRow} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.recentRowContent}>
        <View style={styles.recentRowTop}>
          <Text style={styles.recentRowDate}>{formatDateLabel(session.date)}</Text>
          <Text style={styles.recentRowProgram} numberOfLines={1}>
            {programName} · {dayName}
          </Text>
        </View>
        <Text style={styles.recentRowStats}>
          {duration} · {volume.toLocaleString()} lbs · {sets} {sets === 1 ? 'set' : 'sets'}
        </Text>
      </View>
      <ChevronRight size={16} color={colors.textTertiary} strokeWidth={2} />
    </TouchableOpacity>
  );
}

// === NEW === Food Adherence section
function FoodAdherenceSection({ proteinTarget }: { proteinTarget: number }) {
  const router = useRouter();
  const { getTotalsForDate, getEntriesForDate } = useFoodLog();

  const orderedDays = useMemo(() => {
    // getPastNDates returns newest first; reverse for left-to-right oldest→today reading
    return [...getPastNDates(7)].reverse();
  }, []);

  const today = todayDateString();

  const dayData = orderedDays.map((date) => {
    const totals = getTotalsForDate(date);
    const entries = getEntriesForDate(date);
    const hasEntries = entries.length > 0;
    const hitProtein = hasEntries && totals.protein >= proteinTarget * 0.9;
    const d = new Date(date + 'T00:00:00');
    const letter = DAY_LETTERS[d.getDay()];
    return { date, hasEntries, hitProtein, letter, isToday: date === today };
  });

  const hitCount = dayData.filter((d) => d.hitProtein).length;

  const goFood = () => {
    tapLight();
    router.push('/history');
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeaderRow}>
        <View style={[styles.eyebrowBar, { backgroundColor: colors.accentFood }]} />
        <Text style={styles.sectionHeader}>FOOD ADHERENCE</Text>
      </View>

      <TouchableOpacity style={styles.adherenceCard} onPress={goFood} activeOpacity={0.85}>
        <View style={styles.adherenceGrid}>
          {dayData.map((d) => (
            <View key={d.date} style={styles.adherenceCell}>
              <Text
                style={[
                  styles.adherenceDayLabel,
                  d.isToday && styles.adherenceDayLabelToday,
                ]}
              >
                {d.letter}
              </Text>
              <View
                style={[
                  styles.adherenceDot,
                  !d.hasEntries && styles.adherenceDotEmpty,
                  d.hasEntries && !d.hitProtein && styles.adherenceDotPartial,
                  d.hitProtein && styles.adherenceDotHit,
                ]}
              />
            </View>
          ))}
        </View>

        <View style={styles.adherenceFooter}>
          <Text style={styles.adherenceFooterText}>
            <Text style={styles.adherenceFooterCount}>{hitCount} of 7 days</Text>
            {' '}hit protein target
          </Text>
          <ChevronRight size={14} color={colors.textTertiary} strokeWidth={2} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

// Hand-drawn SVG sparkline — dual gradient stroke + soft cyan area fill
function WeightTrendChart({ points }: { points: { weightLbs: number; date: string }[] }) {
  const weights = points.map((p) => p.weightLbs);
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const range = Math.max(0.5, max - min);

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
  scroll: { paddingBottom: 100 },

  // Header
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

  // Hero band
  heroBand: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl },
  heroCardWrap: {
    flex: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  heroStripe: { height: 4 },
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
  heroLabel: { ...typography.bodyBold, fontSize: 11, letterSpacing: 1.5 },
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
  heroUnit: { color: colors.textTertiary, fontSize: 13, marginTop: 2 },
  heroSubLabel: { color: colors.textSecondary, fontSize: 12, marginTop: spacing.xs },

  // Generic section header
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  sectionHeader: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    fontSize: 12,
    letterSpacing: 1.5,
  },
  // === NEW === wrapper for sub-sections so each gets bottom spacing
  section: { marginTop: spacing.xl },

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
  trendSmallLabel: { color: colors.textTertiary, fontSize: 11, letterSpacing: 0.5 },
  trendSmallValue: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    fontSize: 14,
    marginTop: 2,
  },
  trendEmpty: { alignItems: 'center', paddingVertical: spacing.lg },
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

  // === NEW === Recent Workouts
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(163,230,53,0.18)', // 18% lime — domain mark
    marginBottom: spacing.sm,
  },
  recentRowContent: { flex: 1 },
  recentRowTop: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
    marginBottom: 2,
    flexWrap: 'wrap',
  },
  recentRowDate: { ...typography.bodyBold, color: colors.textPrimary, fontSize: 15 },
  recentRowProgram: { color: colors.textSecondary, fontSize: 13 },
  recentRowStats: { color: colors.textTertiary, fontSize: 12 },

  // Inline "view all" / "browse programs" link rows
  linkRowInline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
  },
  linkRowInlineText: { ...typography.bodyBold, fontSize: 13 },

  // Empty section state
  sectionEmpty: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  sectionEmptyTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  sectionEmptyBody: {
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 14,
  },

  // === NEW === Food Adherence
  adherenceCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  adherenceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  adherenceCell: { alignItems: 'center', gap: spacing.sm },
  adherenceDayLabel: {
    fontSize: 11,
    color: colors.textTertiary,
    letterSpacing: 0.5,
    fontWeight: '700',
  },
  adherenceDayLabelToday: { color: colors.accentFood },
  adherenceDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  adherenceDotEmpty: {
    backgroundColor: 'transparent',
    borderColor: colors.borderDefault,
  },
  adherenceDotPartial: {
    backgroundColor: 'rgba(34,211,238,0.25)',
    borderColor: 'rgba(34,211,238,0.40)',
  },
  adherenceDotHit: {
    backgroundColor: colors.accentFood,
    borderColor: colors.accentFood,
  },
  adherenceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  adherenceFooterText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  adherenceFooterCount: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
});
