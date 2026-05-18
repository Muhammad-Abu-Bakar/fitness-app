import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
// === CHANGED === added LinearGradient back, this time for the bottom CTA fade.
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, radius, typography } from '../theme';
import { useOnboarding } from '../context/onboarding';
import { calculateTargets } from '../lib/nutrition';
import { useFoodLog, getTodayDateString } from '../context/foodLog';
import { tapLight, tapMedium, warning } from '../lib/haptics';
import { HomeHero } from '../components/HomeHero';

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
      <View style={styles.iconRow}>
        <TouchableOpacity onPress={() => goTo('/history')} style={styles.iconButton} activeOpacity={0.7}>
          <Text style={styles.iconEmoji}>📅</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => goTo('/settings')} style={styles.iconButton} activeOpacity={0.7}>
          <Text style={styles.iconEmoji}>⚙</Text>
        </TouchableOpacity>
      </View>

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

        <View style={styles.navCardGroup}>
          <TouchableOpacity style={styles.navCard} onPress={() => goTo('/workouts')} activeOpacity={0.85}>
            <View style={styles.navCardIcon}><Text style={styles.navCardIconText}>💪</Text></View>
            <View style={styles.navCardText}>
              <Text style={styles.navCardLabelTrain}>WORKOUTS</Text>
              <Text style={styles.navCardTitle}>Browse programs</Text>
            </View>
            <Text style={styles.navCardArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navCard} onPress={() => goTo('/workout/history')} activeOpacity={0.85}>
            <View style={styles.navCardIcon}><Text style={styles.navCardIconText}>📊</Text></View>
            <View style={styles.navCardText}>
              <Text style={styles.navCardLabelTrain}>HISTORY</Text>
              <Text style={styles.navCardTitle}>View past sessions</Text>
            </View>
            <Text style={styles.navCardArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navCard} onPress={() => goTo('/check-in')} activeOpacity={0.85}>
            <View style={styles.navCardIcon}><Text style={styles.navCardIconText}>⚖️</Text></View>
            <View style={styles.navCardText}>
              <Text style={styles.navCardLabelFood}>CHECK-IN</Text>
              <Text style={styles.navCardTitle}>Track your weight</Text>
            </View>
            <Text style={styles.navCardArrow}>→</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>How we got there</Text>
        <View style={styles.breakdownCard}>
          <BreakdownRow label="Base metabolic rate" value={`${targets.bmr} kcal`} />
          <BreakdownRow label="With activity (TDEE)" value={`${targets.tdee} kcal`} />
          <BreakdownRow label={surplusLabel} value={targets.surplus > 0 ? `+${targets.surplus} kcal` : 'no change'} isLast />
        </View>

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
                <TouchableOpacity onPress={() => handleDeleteEntry(entry.id)} style={styles.logDeleteButton} activeOpacity={0.7}>
                  <Text style={styles.logDeleteText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* === NEW === bottom fade — sits between ScrollView and the floating CTA so
          scrolling content fades to bg color before reaching the button area.
          pointerEvents="none" lets taps fall through to the scroll. */}
      <LinearGradient
        colors={['rgba(10,15,18,0)', colors.backgroundSolid]}
        locations={[0, 0.7]}
        style={styles.bottomFade}
        pointerEvents="none"
      />

      <TouchableOpacity
        style={styles.logButton}
        onPress={() => {
          tapMedium();
          router.push('/log-food');
        }}
        activeOpacity={0.85}
      >
        <Text style={styles.logButtonText}>+ LOG FOOD</Text>
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
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSolid,
    paddingHorizontal: spacing.lg,
  },
  scroll: {
    paddingTop: 110,
    paddingBottom: 110,
  },
  iconRow: {
    position: 'absolute',
    top: 60,
    right: spacing.lg,
    flexDirection: 'row',
    gap: spacing.sm,
    zIndex: 10,
  },
  iconButton: {
    width: 40, height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  iconEmoji: { fontSize: 18 },

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

  navCardGroup: { gap: spacing.smd, marginBottom: spacing.lg },
  navCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  navCardIcon: {
    width: 40, height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center', justifyContent: 'center',
  },
  navCardIconText: { fontSize: 20 },
  navCardText: { flex: 1 },
  navCardLabelTrain: { ...typography.caption, color: colors.accentTrain, marginBottom: 2 },
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

  // === NEW === fade strip behind the floating CTA — masks scroll content as it
  // approaches the button area so nothing bleeds through.
  bottomFade: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    height: 120,
  },

  logButton: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
    paddingVertical: 16,
    borderRadius: radius.full,
    alignItems: 'center',
    backgroundColor: 'rgba(34,211,238,0.10)',
    borderWidth: 1.5,
    borderColor: colors.accentFood,
  },
  logButtonText: { ...typography.button, color: colors.textPrimary },
});
