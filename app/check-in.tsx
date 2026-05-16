// === NEW === check-in list screen — stats card + history with delete
import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, radius, typography } from '../theme';
import { useCheckIn } from '../context/checkIn';
import {
  getStartingCheckIn,
  getLatestCheckIn,
  getTotalChangeLbs,
  formatWeightChange,
  sortByDateDesc,
} from '../lib/checkIns/stats';
import { formatDateLabel } from '../lib/dates';
import type { CheckIn } from '../lib/checkIns/types';

export default function CheckInScreen() {
  const router = useRouter();
  const { checkIns, isLoaded, deleteCheckIn } = useCheckIn();

  if (!isLoaded) return null;

  const sorted = sortByDateDesc(checkIns);
  const latest = getLatestCheckIn(checkIns);
  const starting = getStartingCheckIn(checkIns);
  const totalChange = getTotalChangeLbs(checkIns);
  const hasProgress = checkIns.length >= 2 && starting !== null;

  const confirmDelete = (entry: CheckIn) => {
    Alert.alert(
      'Delete this check-in?',
      `${formatDateLabel(entry.date)} · ${entry.weightLbs.toFixed(1)} lbs`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteCheckIn(entry.id) },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Check-ins</Text>
        <Text style={styles.subtitle}>Your weight, week by week.</Text>

        {!latest ? (
          <View style={styles.emptyStatsCard}>
            <Text style={styles.emptyTitle}>No check-ins yet</Text>
            <Text style={styles.emptyBody}>
              Log your weight to start tracking your progress over time.
            </Text>
          </View>
        ) : (
          <View style={styles.statsCard}>
            <Text style={styles.statsLabel}>CURRENT WEIGHT</Text>
            <View style={styles.statsValueRow}>
              <Text style={styles.statsValue}>{latest.weightLbs.toFixed(1)}</Text>
              <Text style={styles.statsUnit}>lbs</Text>
            </View>
            {hasProgress ? (
              <Text style={styles.statsChange}>
                {formatWeightChange(totalChange)} since {formatDateLabel(starting!.date)}
              </Text>
            ) : (
              <Text style={styles.statsHint}>First check-in — keep going!</Text>
            )}
          </View>
        )}

        {sorted.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>HISTORY</Text>
            <View style={styles.list}>
              {sorted.map((entry) => (
                <View key={entry.id} style={styles.entryCard}>
                  <View style={styles.entryContent}>
                    <View style={styles.entryHeader}>
                      <Text style={styles.entryDate}>{formatDateLabel(entry.date)}</Text>
                      <Text style={styles.entryWeight}>{entry.weightLbs.toFixed(1)} lbs</Text>
                    </View>
                    {entry.notes && <Text style={styles.entryNotes}>{entry.notes}</Text>}
                  </View>
                  <TouchableOpacity
                    onPress={() => confirmDelete(entry)}
                    style={styles.deleteButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.deleteText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.logButton}
        onPress={() => router.push('/log-checkin')}
        activeOpacity={0.85}
      >
        <Text style={styles.logButtonText}>+ Log check-in</Text>
      </TouchableOpacity>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.xl,
  },
  scroll: { paddingBottom: spacing.xl },
  backButton: { alignSelf: 'flex-start', paddingVertical: spacing.sm, marginBottom: spacing.md },
  backText: { ...typography.bodyBold, color: colors.accent },
  title: { ...typography.title, color: colors.textPrimary, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },

  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  statsLabel: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.sm },
  statsValueRow: { flexDirection: 'row', alignItems: 'baseline' },
  statsValue: { fontSize: 56, fontWeight: '800', color: colors.textPrimary, lineHeight: 60 },
  statsUnit: { ...typography.heading, color: colors.textTertiary, marginLeft: spacing.sm },
  statsChange: { ...typography.bodyBold, color: colors.accent, marginTop: spacing.sm },
  statsHint: { ...typography.body, color: colors.textTertiary, marginTop: spacing.sm },

  emptyStatsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  emptyTitle: { ...typography.heading, color: colors.textPrimary, marginBottom: spacing.sm },
  emptyBody: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },

  sectionTitle: { ...typography.caption, color: colors.textTertiary, marginBottom: spacing.md },
  list: { gap: spacing.sm },
  entryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingLeft: spacing.lg,
  },
  entryContent: { flex: 1, paddingVertical: spacing.md },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryDate: { ...typography.bodyBold, color: colors.textPrimary },
  entryWeight: { ...typography.bodyBold, color: colors.textPrimary, marginRight: spacing.md },
  entryNotes: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 2,
    marginRight: spacing.md,
  },
  deleteButton: { padding: spacing.lg },
  deleteText: { color: colors.danger, fontSize: 18, fontWeight: 'bold' },

  logButton: {
    backgroundColor: colors.accent,
    paddingVertical: 18,
    borderRadius: radius.lg,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  logButtonText: { ...typography.button, color: colors.onAccent },
});
