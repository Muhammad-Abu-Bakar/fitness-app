// === NEW === check-in list screen — stats card + history with delete
// === CHANGED === dual-domain reskin (paired with log-checkin)
import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient'; // === NEW ===
import { ChevronLeft, Trash2, Plus } from 'lucide-react-native'; // === NEW ===
import { colors, spacing, radius, typography, dualGradient } from '../theme'; // === CHANGED === added dualGradient
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
import { tapLight, tapMedium, warning } from '../lib/haptics'; // === CHANGED === added tapLight

export default function CheckInScreen() {
  const router = useRouter();
  const { checkIns, isLoaded, deleteCheckIn } = useCheckIn();

  if (!isLoaded) return null;

  const sorted = sortByDateDesc(checkIns);
  const latest = getLatestCheckIn(checkIns);
  const starting = getStartingCheckIn(checkIns);
  const totalChange = getTotalChangeLbs(checkIns);
  const hasProgress = checkIns.length >= 2 && starting !== null;

  // === NEW === light haptic on back nav
  const handleBack = () => {
    tapLight();
    router.back();
  };

  const confirmDelete = (entry: CheckIn) => {
    Alert.alert(
      'Delete this check-in?',
      `${formatDateLabel(entry.date)} · ${entry.weightLbs.toFixed(1)} lbs`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            warning();
            deleteCheckIn(entry.id);
          },
        },
      ],
    );
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

        {/* === NEW === eyebrow with dual-gradient accent bar */}
        <View style={styles.eyebrowRow}>
          <LinearGradient
            colors={dualGradient.colors}
            start={dualGradient.start}
            end={dualGradient.end}
            style={styles.eyebrowBar}
          />
          <Text style={styles.eyebrow}>PROGRESS</Text>
        </View>

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
          // === CHANGED === stats card with dual-gradient top stripe (hero brand mark)
          <View style={styles.statsCardWrap}>
            <LinearGradient
              colors={dualGradient.colors}
              start={dualGradient.start}
              end={dualGradient.end}
              style={styles.statsStripe}
            />
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
                  {/* === CHANGED === icon-based delete */}
                  <TouchableOpacity
                    onPress={() => confirmDelete(entry)}
                    style={styles.deleteButton}
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Trash2 size={18} color={colors.danger} strokeWidth={2} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {/* === CHANGED === dual-gradient ring around log CTA */}
      <LinearGradient
        colors={dualGradient.colors}
        start={dualGradient.start}
        end={dualGradient.end}
        style={styles.logButtonRing}
      >
        <TouchableOpacity
          style={styles.logButtonInner}
          onPress={() => {
            tapMedium();
            router.push('/log-checkin');
          }}
          activeOpacity={0.85}
        >
          <Plus size={18} color={colors.textPrimary} strokeWidth={2.5} />
          <Text style={styles.logButtonText}>Log check-in</Text>
        </TouchableOpacity>
      </LinearGradient>

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
  // === CHANGED === slim icon back button
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
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  eyebrowBar: {
    width: 20,
    height: 3,
    borderRadius: 2,
    marginRight: spacing.sm,
  },
  eyebrow: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    fontSize: 12,
    letterSpacing: 1.5,
  },
  title: { ...typography.title, color: colors.textPrimary, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },

  // === NEW === stats card with gradient stripe
  statsCardWrap: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  statsStripe: {
    height: 4,
    width: '100%',
  },
  statsCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  statsLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    letterSpacing: 1.5,
  },
  statsValueRow: { flexDirection: 'row', alignItems: 'baseline' },
  statsValue: { fontSize: 56, fontWeight: '900', color: colors.textPrimary, lineHeight: 60 }, // === CHANGED === 900 weight per design system
  statsUnit: { ...typography.heading, color: colors.textTertiary, marginLeft: spacing.sm },
  statsChange: { ...typography.bodyBold, color: colors.textPrimary, marginTop: spacing.sm }, // === CHANGED === white instead of yellow accent
  statsHint: { ...typography.body, color: colors.textTertiary, marginTop: spacing.sm },

  emptyStatsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    alignItems: 'center',
    borderWidth: 1, // === NEW ===
    borderColor: colors.borderSubtle, // === NEW ===
  },
  emptyTitle: { ...typography.heading, color: colors.textPrimary, marginBottom: spacing.sm },
  emptyBody: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },

  sectionTitle: {
    ...typography.caption,
    color: colors.textTertiary,
    marginBottom: spacing.md,
    letterSpacing: 1.5,
  },
  list: { gap: spacing.sm },
  entryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingLeft: spacing.lg,
    borderWidth: 1, // === NEW ===
    borderColor: colors.borderSubtle, // === NEW ===
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

  // === CHANGED === dual-gradient ring CTA
  logButtonRing: {
    borderRadius: radius.lg,
    padding: 1.5,
    marginTop: spacing.md,
  },
  logButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surfaceElevated,
    paddingVertical: 18,
    borderRadius: radius.lg - 1.5,
  },
  logButtonText: { ...typography.button, color: colors.textPrimary }, // === CHANGED === white text on gradient-bordered surface
});
