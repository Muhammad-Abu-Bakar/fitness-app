// === CHANGED === full rewrite — now the real dashboard, not a stub
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, radius, typography } from '../theme';
import { useOnboarding } from '../context/onboarding';
// === NEW === pulls in the math from Step 1
import { calculateTargets } from '../lib/nutrition';

export default function HomeScreen() {
  const router = useRouter();
  const { goal, weightLbs, heightFt, heightIn, age, activityLevel } = useOnboarding();

  // === NEW === compute targets — memoized so it only recalculates when inputs change
  const targets = useMemo(() => {
    if (
      weightLbs === null || heightFt === null || heightIn === null ||
      age === null || !activityLevel || !goal
    ) {
      return null;
    }
    return calculateTargets(weightLbs, heightFt, heightIn, age, activityLevel, goal);
  }, [weightLbs, heightFt, heightIn, age, activityLevel, goal]);

  // === NEW === defensive — shouldn't happen because of auto-redirect, but TS likes it
  if (!targets) return null;

  // === NEW === friendly label for surplus line
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
          <TouchableOpacity onPress={() => router.push('/settings')} style={styles.settingsButton} activeOpacity={0.7}>
            <Text style={styles.settingsIcon}>⚙</Text>
          </TouchableOpacity>
        </View>

        {/* Calorie card — the hero */}
        <View style={styles.calorieCard}>
          <Text style={styles.cardLabel}>Calories</Text>
          <View style={styles.valueRow}>
            <Text style={styles.cardValue}>{targets.calories}</Text>
            <Text style={styles.cardUnit}>kcal</Text>
          </View>
          <Text style={styles.cardSubtext}>per day to hit your goal</Text>
        </View>

        {/* Protein card */}
        <View style={styles.proteinCard}>
          <Text style={styles.cardLabelDark}>Protein</Text>
          <View style={styles.valueRow}>
            <Text style={styles.cardValueDark}>{targets.protein}</Text>
            <Text style={styles.cardUnitDark}>g</Text>
          </View>
          <Text style={styles.cardSubtextDark}>1g per lb bodyweight</Text>
        </View>

        {/* Breakdown */}
        <Text style={styles.sectionTitle}>How we got there</Text>
        <View style={styles.breakdownCard}>
          <BreakdownRow label="Base metabolic rate" value={`${targets.bmr} kcal`} />
          <BreakdownRow label="With activity (TDEE)" value={`${targets.tdee} kcal`} />
          <BreakdownRow label={surplusLabel} value={targets.surplus > 0 ? `+${targets.surplus} kcal` : 'no change'} isLast />
        </View>

        <Text style={styles.note}>
          Day 12: daily food logging — track meals against these targets.
        </Text>
      </ScrollView>
      {/* === NEW === sticky log-food CTA at the bottom of home */}
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

// === NEW === small helper component — keeps the rendering clean
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
  eyebrow: { ...typography.caption, color: colors.accent, marginBottom: spacing.xs },
  title: { ...typography.title, color: colors.textPrimary },
  settingsButton: { width: 44, height: 44, borderRadius: radius.full, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  settingsIcon: { fontSize: 22, color: colors.textPrimary },

  calorieCard: { backgroundColor: colors.accent, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md },
  proteinCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.xl },
  cardLabel: { ...typography.caption, color: colors.onAccent, opacity: 0.7, marginBottom: spacing.sm },
  valueRow: { flexDirection: 'row', alignItems: 'baseline' },
  cardValue: { fontSize: 56, fontWeight: '800', color: colors.onAccent, lineHeight: 60 },
  cardUnit: { ...typography.heading, color: colors.onAccent, opacity: 0.7, marginLeft: spacing.sm },
  cardSubtext: { ...typography.body, color: colors.onAccent, opacity: 0.7, marginTop: spacing.xs },

  sectionTitle: { ...typography.heading, color: colors.textPrimary, marginBottom: spacing.md },
  breakdownCard: { backgroundColor: colors.surface, borderRadius: radius.lg, paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.md },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.surfaceElevated },
  rowLabel: { ...typography.body, color: colors.textSecondary },
  rowValue: { ...typography.bodyBold, color: colors.textPrimary },

  note: { ...typography.body, color: colors.textTertiary, fontStyle: 'italic', textAlign: 'center', marginTop: spacing.md },cardLabelDark: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.sm },
  cardValueDark: { fontSize: 56, fontWeight: '800', color: colors.textPrimary, lineHeight: 60 },
  cardUnitDark: { ...typography.heading, color: colors.textTertiary, marginLeft: spacing.sm },
  cardSubtextDark: { ...typography.body, color: colors.textTertiary, marginTop: spacing.xs },
  // === NEW === sticky log-food button
  logButton: { backgroundColor: colors.accent, paddingVertical: 18, borderRadius: radius.lg, alignItems: 'center', marginTop: spacing.md },
  logButtonText: { ...typography.button, color: colors.onAccent },
});