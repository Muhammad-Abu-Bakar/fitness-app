// === NEW === history list — past 7 days with summary stats per day
import { useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, radius, typography } from '../../theme';
import { useFoodLog } from '../../context/foodLog';
import { useOnboarding } from '../../context/onboarding';
import { calculateTargets } from '../../lib/nutrition';
import { getPastNDates, formatDateLabel } from '../../lib/dates';

export default function HistoryScreen() {
  const router = useRouter();
  const { getTotalsForDate, getEntriesForDate } = useFoodLog();
  const { goal, weightLbs, heightFt, heightIn, age, activityLevel } = useOnboarding();

  const targets = useMemo(() => {
    if (
      weightLbs === null || heightFt === null || heightIn === null ||
      age === null || !activityLevel || !goal
    ) return null;
    return calculateTargets(weightLbs, heightFt, heightIn, age, activityLevel, goal);
  }, [weightLbs, heightFt, heightIn, age, activityLevel, goal]);

  if (!targets) return null;

  // === NEW === past 7 days
  const dates = getPastNDates(7);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>History</Text>
        <Text style={styles.subtitle}>The past 7 days at a glance. Tap a day to see details.</Text>

        <View style={styles.list}>
          {dates.map(date => {
            const totals = getTotalsForDate(date);
            const entryCount = getEntriesForDate(date).length;
            const hasData = entryCount > 0;

            return (
              <TouchableOpacity
                key={date}
                style={styles.dayCard}
                onPress={() => router.push(`/history/${date}`)}
                activeOpacity={0.85}
              >
                <View style={styles.dayHeader}>
                  <Text style={styles.dayLabel}>{formatDateLabel(date)}</Text>
                  <Text style={styles.entryCount}>{hasData ? `${entryCount} ${entryCount === 1 ? 'entry' : 'entries'}` : 'No entries'}</Text>
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
  title: { ...typography.title, color: colors.textPrimary, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },
  list: { gap: spacing.md },
  dayCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dayLabel: { ...typography.heading, color: colors.textPrimary },
  entryCount: { ...typography.body, color: colors.textTertiary, fontSize: 14 },
  dayStats: { marginTop: spacing.md, gap: spacing.sm },
  statRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statLabel: { ...typography.body, color: colors.textSecondary },
  statValue: { ...typography.bodyBold, color: colors.textPrimary },
  statTarget: { color: colors.textTertiary, fontWeight: '400' },
});