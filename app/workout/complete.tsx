// === NEW ===
// app/workout/complete.tsx
//
// Celebration screen shown right after a workout finishes.
// Reads the just-completed session by id (passed as a URL param).
// === CHANGED === lime training-domain reskin (hero moment of the training flow)

import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Home, ChevronLeft } from 'lucide-react-native'; // === NEW ===
import { colors, radius, spacing, typography } from '../../theme';
import { useWorkoutLog } from '../../context/workoutLog';
import { getProgramById } from '../../lib/workouts/programs';
import { tapLight, tapMedium, success } from '../../lib/haptics'; // === CHANGED === use helpers

export default function CompleteScreen() {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const { sessions } = useWorkoutLog();

  // Find the session by id. Fallback to newest in case of a param issue.
  const session = sessions.find(s => s.id === sessionId) ?? sessions[0];

  // Delay the haptic so it fires AFTER the screen transition lands.
  // iOS suppresses haptics during view animations, so firing immediately on mount
  // often gets swallowed silently.
  useEffect(() => {
    const t = setTimeout(() => {
      success(); // === CHANGED === use helper
    }, 500);
    return () => clearTimeout(t);
  }, []);

  if (!session) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContent}>
          <Text style={styles.emptyText}>Couldn't find workout data.</Text>
          <TouchableOpacity
            onPress={() => {
              tapLight();
              router.replace('/home');
            }}
            style={styles.emptyButton}
            activeOpacity={0.85}
          >
            <ChevronLeft size={18} color={colors.onAccentTrain} strokeWidth={2.5} />
            <Text style={styles.emptyButtonText}>Back to home</Text>
          </TouchableOpacity>
        </View>
        <StatusBar style="light" />
      </View>
    );
  }

  const program = getProgramById(session.programId);
  const day = program?.days.find(d => d.id === session.dayId);
  const dayName = day?.name ?? 'Workout';

  const totalSets = session.sets.length;
  const totalVolume = session.sets.reduce(
    (sum, s) => sum + s.weightLbs * s.reps,
    0,
  );
  const durationMinutes = session.completedAt
    ? Math.max(1, Math.round((session.completedAt - session.startedAt) / 60000))
    : 0;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.celebration}>
          {/* === CHANGED === emoji inside lime halo ring (hero brand mark) */}
          <View style={styles.emojiRing}>
            <Text style={styles.emoji}>💪</Text>
          </View>
          <Text style={styles.title}>Workout complete!</Text>
          <Text style={styles.subtitle}>{dayName}</Text>
        </View>

        {/* === CHANGED === stats card with lime top stripe */}
        <View style={styles.statsCardWrap}>
          <View style={styles.statsStripe} />
          <View style={styles.statsCard}>
            <StatItem label="sets logged" value={totalSets.toString()} />
            <View style={styles.divider} />
            <StatItem label="lbs lifted" value={totalVolume.toLocaleString()} />
            <View style={styles.divider} />
            <StatItem
              label={durationMinutes === 1 ? 'minute' : 'minutes'}
              value={durationMinutes.toString()}
            />
          </View>
        </View>

        <Text style={styles.encouragement}>
          Eat well, sleep deep, repeat in 48 hours. That's how you grow.
        </Text>
      </ScrollView>

      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => {
          tapMedium(); // === NEW ===
          router.replace('/home');
        }}
        activeOpacity={0.85}
      >
        <Home size={18} color={colors.onAccentTrain} strokeWidth={2.5} />
        <Text style={styles.homeButtonText}>Back to home</Text>
      </TouchableOpacity>

      <StatusBar style="light" />
    </View>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSolid, // === CHANGED ===
    paddingHorizontal: spacing.lg,
    paddingTop: 80,
    paddingBottom: spacing.xl,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  celebration: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  // === NEW === lime halo ring around the emoji
  emojiRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(163,230,53,0.10)', // lime at 10%
    borderWidth: 1,
    borderColor: 'rgba(163,230,53,0.25)', // lime at 25%
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emoji: {
    fontSize: 56,
  },
  title: {
    ...typography.display,
    fontSize: 40,
    lineHeight: 48,
    color: colors.textPrimary, // white display title — pops against dark bg
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.heading,
    color: colors.accentTrain, // === CHANGED === lime (training accent)
    textAlign: 'center',
  },

  // === NEW === stats card with lime top stripe
  statsCardWrap: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  statsStripe: {
    height: 4,
    backgroundColor: colors.accentTrain, // === NEW === lime brand stripe
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: spacing.lg,
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: {
    ...typography.display,
    fontSize: 32,
    lineHeight: 38,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    letterSpacing: 1.5, // === NEW ===
  },
  divider: {
    width: 1,
    height: 48,
    backgroundColor: colors.borderSubtle, // === CHANGED ===
  },

  encouragement: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: spacing.md,
  },

  homeButton: {
    flexDirection: 'row', // === NEW === for icon + text
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.accentTrain, // === CHANGED ===
    paddingVertical: 18,
    borderRadius: radius.lg,
    marginTop: spacing.md,
  },
  homeButtonText: {
    ...typography.button,
    color: colors.onAccentTrain, // === CHANGED ===
  },

  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...typography.heading,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  emptyButton: {
    flexDirection: 'row', // === NEW ===
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.accentTrain, // === CHANGED ===
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
  },
  emptyButtonText: {
    ...typography.button,
    color: colors.onAccentTrain, // === CHANGED ===
  },
});
