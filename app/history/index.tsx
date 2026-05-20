// === NEW === history list — past 7 days with summary stats per day
// === CHANGED === cyan food-domain reskin
import { useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react-native'; // === NEW ===
import { colors, spacing, radius, typography } from '../../theme';
import { useFoodLog } from '../../context/foodLog';
import { useOnboarding } from '../../context/onboarding';
import { calculateTargets } from '../../lib/nutrition';
import { getPastNDates, formatDateLabel } from '../../lib/dates';
import { tapLight, tapMedium } from '../../lib/haptics';

export default function HistoryScreen() {
  const router = useRouter();
  const { getTotalsForDate, getEntriesForDate } = useFoodLog();
  const { goal, weightLbs, heightFt, heightIn, age, activityLevel, sex } = useOnboarding();

  const targets = useMemo(() => {
    if (
      weightLbs === null || heightFt === null || heightIn === null ||
      age === null || !activityLevel || !goal
    ) return null;
    return calculateTargets(weightLbs, heightFt, heightIn, age, activityLevel, goal, sex);
  }, [weightLbs, heightFt, heightIn, age, activityLevel, goal, sex]);

  if (!targets) return null;

  const dates = getPastNDates(7);

  // detect all-empty week for a friendlier empty state
  const totalEntriesAcrossWeek = dates.reduce(
    (sum, date) => sum + getEntriesForDate(date).length,
    0,
  );
  const hasAnyEntries = totalEntriesAcrossWeek > 0;

  // === NEW === light haptic on back nav
  const handleBack = () => {
    tapLight();
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* === CHANGED === slim 40x40 icon back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ChevronLeft size={22} color={colors.textPrimary} strokeWidth={2} />
        </TouchableOpacity>

        {/* === NEW === cyan eyebrow */}
        <Text style={styles.eyebrow}>HISTORY</Text>

        <Text style={styles.title}>History</Text>
        <Text style={styles.subtitle}>The past 7 days at a glance. Tap a day to see details.</Text>

        {!hasAnyEntries ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Nothing logged yet</Text>
            <Text style={styles.emptyBody}>
              Your meals and macros will show up here once you start logging.
            </Text>
            {/* === CHANGED === cyan CTA with Plus icon */}
            <TouchableOpacity
              style={styles.emptyCta}
              onPress={() => {
                tapMedium();
                router.push('/log-food');
              }}
              activeOpacity={0.85}
            >
              <Plus size={18} color={colors.onAccentFood} strokeWidth={2.5} />
              <Text style={styles.emptyCtaText}>Log your first meal</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.list}>
            {dates.map(date => {
              const totals = getTotalsForDate(date);
              const entryCount = getEntriesForDate(date).length;
              const hasData = entryCount > 0;

              return (
                <TouchableOpacity
                  key={date}
                  style={styles.dayCard}
                  onPress={() => {
                    tapLight();
                    router.push(`/history/${date}`);
                  }}
                  activeOpacity={0.85}
                >
                  <View style={styles.dayHeader}>
                    <Text style={styles.dayLabel}>{formatDateLabel(date)}</Text>
                    {/* === CHANGED === count + chevron affordance */}
                    <View style={styles.dayHeaderRight}>
                      <Text style={styles.entryCount}>
                        {hasData ? `${entryCount} ${entryCount === 1 ? 'entry' : 'entries'}` : 'No entries'}
                      </Text>
                      <ChevronRight size={16} color={colors.textTertiary} strokeWidth={2} />
                    </View>
                  </View>

                  {hasData && (
                    <View style={styles.dayStats}>
                      <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Calories</Text>
                        <Text style={styles.statValue}>
                          {totals.calories}
                          <Text style={styles.statTarget}> / {targets.calories}</Text>
                        </Text>
                      </View>
                      <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Protein</Text>
                        <Text style={styles.statValue}>
                          {totals.protein}g
                          <Text style={styles.statTarget}> / {targets.protein}g</Text>
                        </Text>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSolid, // === CHANGED ===
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.xl,
  },
  scroll: { paddingBottom: spacing.xl },
  // === CHANGED === slim 40x40 icon back button
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginBottom: spacing.lg,
  },
  // === NEW === eyebrow
  eyebrow: {
    ...typography.bodyBold,
    color: colors.accentFood,
    fontSize: 12,
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
  },
  title: { ...typography.title, color: colors.textPrimary, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },
  list: { gap: spacing.md },
  // === CHANGED === day card with thin cyan accent border
  dayCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.18)', // === NEW === 18% cyan — food domain mark
  },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  // === NEW === right side of header (count + chevron)
  dayHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  dayLabel: { ...typography.heading, color: colors.textPrimary },
  entryCount: { ...typography.body, color: colors.textTertiary, fontSize: 14 },
  dayStats: { marginTop: spacing.md, gap: spacing.sm },
  statRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statLabel: { ...typography.body, color: colors.textSecondary },
  statValue: { ...typography.bodyBold, color: colors.textPrimary },
  statTarget: { color: colors.textTertiary, fontWeight: '400' },

  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1, // === NEW ===
    borderColor: colors.borderSubtle, // === NEW ===
  },
  emptyTitle: { ...typography.heading, color: colors.textPrimary, marginBottom: spacing.sm },
  emptyBody: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  // === CHANGED === cyan CTA with icon
  emptyCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.accentFood,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  emptyCtaText: { ...typography.bodyBold, color: colors.onAccentFood },
});
