import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, radius, typography } from '../theme';
import { useOnboarding } from '../context/onboarding';
import { calculateTargets } from '../lib/nutrition';
import { useFoodLog, getTodayDateString } from '../context/foodLog';

export default function HomeScreen() {
  const router = useRouter();
  const { goal, weightLbs, heightFt, heightIn, age, activityLevel } = useOnboarding();

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
    return calculateTargets(weightLbs, heightFt, heightIn, age, activityLevel, goal);
  }, [weightLbs, heightFt, heightIn, age, activityLevel, goal]);

  if (!targets) return null;

  const caloriesLeft = Math.max(targets.calories - todayTotals.calories, 0);
  const proteinLeft = Math.max(targets.protein - todayTotals.protein, 0);
  const calorieProgress = Math.min(todayTotals.calories / targets.calories, 1);
  const proteinProgress = Math.min(todayTotals.protein / targets.protein, 1);

  const surplusLabel =
    goal === 'bulk' ? 'Bulk surplus' :
    goal === 'lean' ? 'Lean surplus' :
    'Maintenance';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>TODAY'S TARGETS</Text>
            <Text style={styles.title}>Let's grow.</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => router.push('/history')} style={styles.settingsButton} activeOpacity={0.7}>
              <Text style={styles.settingsIcon}>📅</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/settings')} style={styles.settingsButton} activeOpacity={0.7}>
              <Text style={styles.settingsIcon}>⚙</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Calorie card */}
        <View style={styles.calorieCard}>
          <Text style={styles.cardLabel}>CALORIES LEFT</Text>
          <View style={styles.valueRow}>
            <Text style={styles.cardValue}>{caloriesLeft}</Text>
            <Text style={styles.cardUnit}>kcal</Text>
          </View>
          <View style={styles.progressTrackLight}>
            <View style={[styles.progressFillLight, { width: `${calorieProgress * 100}%` }]} />
          </View>
          <Text style={styles.cardSubtext}>{todayTotals.calories} of {targets.calories} eaten</Text>
        </View>

        {/* Protein card */}
        <View style={styles.proteinCard}>
          <Text style={styles.cardLabelDark}>PROTEIN LEFT</Text>
          <View style={styles.valueRow}>
            <Text style={styles.cardValueDark}>{proteinLeft}</Text>
            <Text style={styles.cardUnitDark}>g</Text>
          </View>
          <View style={styles.progressTrackDark}>
            <View style={[styles.progressFillDark, { width: `${proteinProgress * 100}%` }]} />
          </View>
          <Text style={styles.cardSubtextDark}>{todayTotals.protein} of {targets.protein}g eaten</Text>
        </View>

        {/* === CHANGED === wrap the two workout nav cards together (Day 16) */}
        <View style={styles.navCardGroup}>
          {/* Workouts entry card */}
          <TouchableOpacity
            style={styles.navCard}
            onPress={() => router.push('/workouts')}
            activeOpacity={0.85}
          >
            <View style={styles.navCardIcon}>
              <Text style={styles.navCardIconText}>💪</Text>
            </View>
            <View style={styles.navCardText}>
              <Text style={styles.navCardLabel}>WORKOUTS</Text>
              <Text style={styles.navCardTitle}>Browse programs</Text>
            </View>
            <Text style={styles.navCardArrow}>→</Text>
          </TouchableOpacity>

          {/* === NEW === Workout history entry card (Day 16) */}
          <TouchableOpacity
            style={styles.navCard}
            onPress={() => router.push('/workout/history')}
            activeOpacity={0.85}
          >
            <View style={styles.navCardIcon}>
              <Text style={styles.navCardIconText}>📊</Text>
            </View>
            <View style={styles.navCardText}>
              <Text style={styles.navCardLabel}>HISTORY</Text>
              <Text style={styles.navCardTitle}>View past sessions</Text>
            </View>
            <Text style={styles.navCardArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Breakdown */}
        <Text style={styles.sectionTitle}>How we got there</Text>
        <View style={styles.breakdownCard}>
          <BreakdownRow label="Base metabolic rate" value={`${targets.bmr} kcal`} />
          <BreakdownRow label="With activity (TDEE)" value={`${targets.tdee} kcal`} />
          <BreakdownRow label={surplusLabel} value={targets.surplus > 0 ? `+${targets.surplus} kcal` : 'no change'} isLast />
        </View>

        {/* Today's log */}
        <Text style={styles.sectionTitle}>Today's log</Text>
        {todayEntries.length === 0 ? (
          <View style={styles.emptyLog}>
            <Text style={styles.emptyLogText}>Nothing logged yet. Tap "+ Log food" to start.</Text>
          </View>
        ) : (
          <View style={styles.logList}>
            {todayEntries.map(entry => (
              <View key={entry.id} style={styles.logItem}>
                <View style={styles.logItemContent}>
                  <Text style={styles.logItemName}>{entry.name}</Text>
                  <Text style={styles.logItemMacros}>{entry.calories} kcal · {entry.protein}g protein</Text>
                </View>
                <TouchableOpacity
                  onPress={() => deleteEntry(entry.id)}
                  style={styles.logDeleteButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.logDeleteText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* === CHANGED === footer note updated for Day 16 */}
        <Text style={styles.note}>
          Day 16: workout history.
        </Text>
      </ScrollView>

      {/* Sticky log-food button */}
      <TouchableOpacity
        style={styles.logButton}
        onPress={() => router.push('/log-food')}
        activeOpacity={0.85}
      >
        <Text style={styles.logButtonText}>+ Log food</Text>
      </TouchableOpacity>

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
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.lg, paddingTop: 80, paddingBottom: spacing.xl },
  scroll: { paddingBottom: spacing.xl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.xl },
  headerActions: { flexDirection: 'row', gap: spacing.sm },
  eyebrow: { ...typography.caption, color: colors.accent, marginBottom: spacing.xs },
  title: { ...typography.title, color: colors.textPrimary },
  settingsButton: { width: 44, height: 44, borderRadius: radius.full, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  settingsIcon: { fontSize: 22, color: colors.textPrimary },

  calorieCard: { backgroundColor: colors.accent, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md },
  proteinCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md },
  cardLabel: { ...typography.caption, color: colors.onAccent, opacity: 0.7, marginBottom: spacing.sm },
  valueRow: { flexDirection: 'row', alignItems: 'baseline' },
  cardValue: { fontSize: 56, fontWeight: '800', color: colors.onAccent, lineHeight: 60 },
  cardUnit: { ...typography.heading, color: colors.onAccent, opacity: 0.7, marginLeft: spacing.sm },
  cardSubtext: { ...typography.body, color: colors.onAccent, opacity: 0.7, marginTop: spacing.xs },

  cardLabelDark: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.sm },
  cardValueDark: { fontSize: 56, fontWeight: '800', color: colors.textPrimary, lineHeight: 60 },
  cardUnitDark: { ...typography.heading, color: colors.textTertiary, marginLeft: spacing.sm },
  cardSubtextDark: { ...typography.body, color: colors.textTertiary, marginTop: spacing.xs },

  progressTrackLight: { height: 6, backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 3, marginVertical: spacing.sm, overflow: 'hidden' },
  progressFillLight: { height: '100%', backgroundColor: colors.onAccent, borderRadius: 3 },
  progressTrackDark: { height: 6, backgroundColor: colors.surfaceElevated, borderRadius: 3, marginVertical: spacing.sm, overflow: 'hidden' },
  progressFillDark: { height: '100%', backgroundColor: colors.accent, borderRadius: 3 },

  // === NEW === wrapper for the two workout nav cards (Day 16)
  navCardGroup: { gap: spacing.md, marginBottom: spacing.xl },

  // === CHANGED === removed marginBottom (handled by navCardGroup now)
  navCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  navCardIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navCardIconText: { fontSize: 24 },
  navCardText: { flex: 1 },
  navCardLabel: { ...typography.caption, color: colors.accent, marginBottom: 2 },
  navCardTitle: { ...typography.bodyBold, color: colors.textPrimary },
  navCardArrow: { ...typography.heading, color: colors.textTertiary },

  sectionTitle: { ...typography.heading, color: colors.textPrimary, marginBottom: spacing.md },
  breakdownCard: { backgroundColor: colors.surface, borderRadius: radius.lg, paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.md },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.surfaceElevated },
  rowLabel: { ...typography.body, color: colors.textSecondary },
  rowValue: { ...typography.bodyBold, color: colors.textPrimary },

  emptyLog: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, alignItems: 'center', marginBottom: spacing.lg },
  emptyLogText: { ...typography.body, color: colors.textTertiary },
  logList: { gap: spacing.sm, marginBottom: spacing.lg },
  logItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, paddingLeft: spacing.lg },
  logItemContent: { flex: 1, paddingVertical: spacing.md },
  logItemName: { ...typography.bodyBold, color: colors.textPrimary, marginBottom: 2 },
  logItemMacros: { ...typography.body, color: colors.textSecondary, fontSize: 14 },
  logDeleteButton: { padding: spacing.lg },
  logDeleteText: { color: colors.danger, fontSize: 18, fontWeight: 'bold' },

  logButton: { backgroundColor: colors.accent, paddingVertical: 18, borderRadius: radius.lg, alignItems: 'center', marginTop: spacing.md },
  logButtonText: { ...typography.button, color: colors.onAccent },

  note: { ...typography.body, color: colors.textTertiary, fontStyle: 'italic', textAlign: 'center', marginTop: spacing.md },
});
