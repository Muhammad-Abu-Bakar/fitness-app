// === NEW === day detail screen — shows entries + totals for one specific date
import { useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, spacing, radius, typography } from '../../theme';
import { useFoodLog } from '../../context/foodLog';
import { useOnboarding } from '../../context/onboarding';
import { calculateTargets } from '../../lib/nutrition';
import { formatDateFull } from '../../lib/dates';
import { warning } from '../../lib/haptics'; // === NEW === Day 18 polish

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

  // === NEW === Day 18 polish: warning haptic on delete (same pattern as home)
  const handleDeleteEntry = (id: string) => {
    warning();
    deleteEntry(id);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{formatDateFull(date)}</Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Calories</Text>
            <Text style={styles.summaryValue}>{totals.calories}</Text>
            <Text style={styles.summaryTarget}>of {targets.calories}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Protein</Text>
            <Text style={styles.summaryValue}>{totals.protein}g</Text>
            <Text style={styles.summaryTarget}>of {targets.protein}g</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Log</Text>
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
                {/* === CHANGED === Day 18 polish: haptic-wrapped delete */}
                <TouchableOpacity onPress={() => handleDeleteEntry(entry.id)} style={styles.deleteButton} activeOpacity={0.7}>
                  <Text style={styles.deleteText}>✕</Text>
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
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.xl },
  scroll: { paddingBottom: spacing.xl },
  backButton: { alignSelf: 'flex-start', paddingVertical: spacing.sm, marginBottom: spacing.md },
  backText: { ...typography.bodyBold, color: colors.accent },
  title: { ...typography.title, color: colors.textPrimary, marginBottom: spacing.xl },
  summaryCard: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.xl },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryDivider: { width: 1, backgroundColor: colors.surfaceElevated, marginHorizontal: spacing.md },
  summaryLabel: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.xs },
  summaryValue: { fontSize: 28, fontWeight: '800', color: colors.textPrimary, marginBottom: 2 },
  summaryTarget: { ...typography.body, color: colors.textTertiary, fontSize: 14 },
  sectionTitle: { ...typography.heading, color: colors.textPrimary, marginBottom: spacing.md },
  emptyState: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, alignItems: 'center' },
  emptyText: { ...typography.body, color: colors.textTertiary },
  list: { gap: spacing.sm },
  entry: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, paddingLeft: spacing.lg },
  entryContent: { flex: 1, paddingVertical: spacing.md },
  entryName: { ...typography.bodyBold, color: colors.textPrimary, marginBottom: 2 },
  entryMacros: { ...typography.body, color: colors.textSecondary, fontSize: 14 },
  deleteButton: { padding: spacing.lg },
  deleteText: { color: colors.danger, fontSize: 18, fontWeight: 'bold' },
});
