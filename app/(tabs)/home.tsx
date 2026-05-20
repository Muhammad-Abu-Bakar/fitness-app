import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, radius, typography } from '../../theme';
import { useOnboarding } from '../../context/onboarding';
import { calculateTargets } from '../../lib/nutrition';
import { useFoodLog, getTodayDateString } from '../../context/foodLog';
import { tapLight, warning } from '../../lib/haptics';
import { HomeHero } from '../../components/HomeHero';

export default function HomeScreen() {
  const router = useRouter();
  const { goal, weightLbs, heightFt, heightIn, age, activityLevel, sex } = useOnboarding();

  const { getTotalsForDate, getEntriesForDate, deleteEntry } = useFoodLog();
  const todayTotals = getTotalsForDate(getTodayDateString());
  const todayEntries = getEntriesForDate(getTodayDateString());

  const targets = useMemo(() => {
    if (
      weightLbs === null || heightFt === null || heightIn === null ||
      age === null || !activityLevel || !goal
    ) {
      return null;
    }
    return calculateTargets(weightLbs, heightFt, heightIn, age, activityLevel, goal, sex);
  }, [weightLbs, heightFt, heightIn, age, activityLevel, goal, sex]);

  useEffect(() => {
    if (targets !== null) return;
    const timer = setTimeout(() => {
      router.replace('/');
    }, 500);
    return () => clearTimeout(timer);
  }, [targets, router]);

  if (!targets) return null;

  const caloriesLeft = Math.max(targets.calories - todayTotals.calories, 0);
  const proteinLeft = Math.max(targets.protein - todayTotals.protein, 0);

  const surplusLabel =
    goal === 'bulk' ? 'Bulk surplus' :
    goal === 'lean' ? 'Lean surplus' :
    'Maintenance';

  const handleDeleteEntry = (id: string) => {
    warning();
    deleteEntry(id);
  };

  const goTo = (path: string) => {
    tapLight();
    router.push(path);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <HomeHero
          caloriesEaten={todayTotals.calories}
          caloriesTarget={targets.calories}
          mealsLogged={todayEntries.length}
          goal={goal as string}
        />

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>CALORIES LEFT</Text>
            <View style={styles.statValueRow}>
              <Text style={styles.statValue}>{caloriesLeft}</Text>
              <Text style={styles.statUnit}>kcal</Text>
            </View>
            <Text style={styles.statSub}>{todayTotals.calories} of {targets.calories} eaten</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>PROTEIN LEFT</Text>
            <View style={styles.statValueRow}>
              <Text style={styles.statValue}>{proteinLeft}</Text>
              <Text style={styles.statUnit}>g</Text>
            </View>
            <Text style={styles.statSub}>{todayTotals.protein} of {targets.protein}g eaten</Text>
          </View>
        </View>

        {/* === CHANGED === only Check-in card remains; Workouts + History moved to tab bar */}
        <TouchableOpacity style={styles.navCard} onPress={() => goTo('/check-in')} activeOpacity={0.85}>
          <View style={styles.navCardIcon}><Text style={styles.navCardIconText}>⚖️</Text></View>
          <View style={styles.navCardText}>
            <Text style={styles.navCardLabelFood}>CHECK-IN</Text>
            <Text style={styles.navCardTitle}>Track your weight</Text>
          </View>
          <Text style={styles.navCardArrow}>→</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>How we got there</Text>
        <View style={styles.breakdownCard}>
          <BreakdownRow label="Base metabolic rate" value={`${targets.bmr} kcal`} />
          <BreakdownRow label="With activity (TDEE)" value={`${targets.tdee} kcal`} />
          <BreakdownRow label={surplusLabel} value={targets.surplus > 0 ? `+${targets.surplus} kcal` : 'no change'} isLast />
        </View>

        <Text style={styles.sectionTitle}>Today's log</Text>
        {todayEntries.length === 0 ? (
          <View style={styles.emptyLog}>
            <Text style={styles.emptyLogText}>Nothing logged yet. Tap "+" in the tab bar to start.</Text>
          </View>
        ) : (
          <View style={styles.logList}>
            {todayEntries.map(entry => (
              <View key={entry.id} style={styles.logItem}>
                <View style={styles.logItemContent}>
                  <Text style={styles.logItemName}>{entry.name}</Text>
                  <Text style={styles.logItemMacros}>{entry.calories} kcal · {entry.protein}g protein</Text>
                </View>
                <TouchableOpacity onPress={() => handleDeleteEntry(entry.id)} style={styles.logDeleteButton} activeOpacity={0.7}>
                  <Text style={styles.logDeleteText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <StatusBar style="light" />
    </View>
  );
}

function BreakdownRow({ label, value, isLast }: { label: string; value: string; isLast?: boolean }) {
  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSolid,
    paddingHorizontal: spacing.lg,
  },
  // === CHANGED === paddingTop 60 (no floating icons), paddingBottom 100 (tab bar clearance)
  scroll: { paddingTop: 60, paddingBottom: 100 },

  statsRow: {
    flexDirection: 'row',
    gap: spacing.smd,
    marginBottom: spacing.lg,
    marginTop: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.18)',
  },
  statLabel: { ...typography.caption, color: colors.accentFood, marginBottom: spacing.xs },
  statValueRow: { flexDirection: 'row', alignItems: 'baseline' },
  statValue: { fontSize: 32, fontWeight: '900', color: colors.textPrimary, lineHeight: 36 },
  statUnit: { fontSize: 13, fontWeight: '500', color: colors.textTertiary, marginLeft: 4 },
  statSub: { fontSize: 11, color: colors.textTertiary, marginTop: spacing.xs },

  // === CHANGED === single nav card (was a group of 3)
  navCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginBottom: spacing.lg,
  },
  navCardIcon: {
    width: 40, height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center', justifyContent: 'center',
  },
  navCardIconText: { fontSize: 20 },
  navCardText: { flex: 1 },
  navCardLabelFood: { ...typography.caption, color: colors.accentFood, marginBottom: 2 },
  navCardTitle: { ...typography.bodyBold, color: colors.textPrimary },
  navCardArrow: { fontSize: 18, color: colors.textTertiary },

  sectionTitle: { ...typography.heading, color: colors.textPrimary, marginBottom: spacing.md, marginTop: spacing.sm },
  breakdownCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.md },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
  rowLabel: { ...typography.body, color: colors.textSecondary },
  rowValue: { ...typography.bodyBold, color: colors.textPrimary },

  emptyLog: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  emptyLogText: { ...typography.body, color: colors.textTertiary, textAlign: 'center' },
  logList: { gap: spacing.sm, marginBottom: spacing.lg },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingLeft: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  logItemContent: { flex: 1, paddingVertical: spacing.smd },
  logItemName: { ...typography.bodyBold, color: colors.textPrimary, marginBottom: 2 },
  logItemMacros: { ...typography.body, color: colors.textSecondary, fontSize: 13 },
  logDeleteButton: { padding: spacing.md },
  logDeleteText: { color: colors.danger, fontSize: 16, fontWeight: '700' },
});
