// === NEW === day detail screen — shows entries + totals for one specific date
// === CHANGED === cyan food-domain reskin
import { useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Trash2 } from 'lucide-react-native'; // === NEW ===
import { colors, spacing, radius, typography } from '../../theme';
import { useFoodLog } from '../../context/foodLog';
import { useOnboarding } from '../../context/onboarding';
import { calculateTargets } from '../../lib/nutrition';
import { formatDateFull } from '../../lib/dates';
import { tapLight, warning } from '../../lib/haptics'; // === CHANGED === added tapLight

export default function DayDetailScreen() {
  const router = useRouter();
  const { date } = useLocalSearchParams<{ date: string }>();
  const { getEntriesForDate, getTotalsForDate, deleteEntry } = useFoodLog();
  const { goal, weightLbs, heightFt, heightIn, age, activityLevel } = useOnboarding();

  const targets = useMemo(() => {
    if (
      weightLbs === null || heightFt === null || heightIn === null ||
      age === null || !activityLevel || !goal
    ) return null;
    return calculateTargets(weightLbs, heightFt, heightIn, age, activityLevel, goal);
  }, [weightLbs, heightFt, heightIn, age, activityLevel, goal]);

  if (!targets || !date) return null;

  const entries = getEntriesForDate(date);
  const totals = getTotalsForDate(date);

  // === NEW === light haptic on back nav
  const handleBack = () => {
    tapLight();
    router.back();
  };

  // warning haptic on delete (same pattern as home)
  const handleDeleteEntry = (id: string) => {
    warning();
    deleteEntry(id);
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

        {/* === NEW === cyan eyebrow (domain mark) */}
        <Text style={styles.eyebrow}>FOOD</Text>

        <Text style={styles.title}>{formatDateFull(date)}</Text>

        {/* === CHANGED === summary card with cyan top stripe, cyan hero values */}
        <View style={styles.summaryCardWrap}>
          <View style={styles.summaryStripe} />
          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>CALORIES</Text>
              <Text style={styles.summaryValue}>{totals.calories}</Text>
              <Text style={styles.summaryTarget}>of {targets.calories}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>PROTEIN</Text>
              <Text style={styles.summaryValue}>{totals.protein}g</Text>
              <Text style={styles.summaryTarget}>of {targets.protein}g</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>LOG</Text>
        {entries.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Nothing was logged on this day.</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {entries.map(entry => (
              <View key={entry.id} style={styles.entry}>
                <View style={styles.entryContent}>
                  <Text style={styles.entryName}>{entry.name}</Text>
                  <Text style={styles.entryMacros}>{entry.calories} kcal · {entry.protein}g protein</Text>
                </View>
                {/* === CHANGED === icon-based delete (matches check-in dashboard) */}
                <TouchableOpacity
                  onPress={() => handleDeleteEntry(entry.id)}
                  style={styles.deleteButton}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Trash2 size={18} color={colors.danger} strokeWidth={2} />
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
  title: { ...typography.title, color: colors.textPrimary, marginBottom: spacing.xl },

  // === NEW === summary card with cyan top stripe
  summaryCardWrap: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  summaryStripe: {
    height: 4,
    backgroundColor: colors.accentFood, // === NEW === cyan brand stripe
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryDivider: {
    width: 1,
    backgroundColor: colors.borderSubtle, // === CHANGED ===
    marginHorizontal: spacing.md,
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    letterSpacing: 1.5, // === NEW === caps consistency
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '900', // === CHANGED === 800 → 900 per design system
    color: colors.accentFood, // === CHANGED === cyan hero values
    marginBottom: 2,
  },
  summaryTarget: { ...typography.body, color: colors.textTertiary, fontSize: 14 },

  // === CHANGED === section title to caption-style caps
  sectionTitle: {
    ...typography.caption,
    color: colors.textTertiary,
    marginBottom: spacing.md,
    letterSpacing: 1.5,
  },
  emptyState: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1, // === NEW ===
    borderColor: colors.borderSubtle, // === NEW ===
  },
  emptyText: { ...typography.body, color: colors.textTertiary },
  list: { gap: spacing.sm },
  entry: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingLeft: spacing.lg,
    borderWidth: 1, // === NEW ===
    borderColor: colors.borderSubtle, // === NEW ===
  },
  entryContent: { flex: 1, paddingVertical: spacing.md },
  entryName: { ...typography.bodyBold, color: colors.textPrimary, marginBottom: 2 },
  entryMacros: { ...typography.body, color: colors.textSecondary, fontSize: 14 },
  deleteButton: { padding: spacing.lg },
  // deleteText style removed — using Trash2 icon now
});
