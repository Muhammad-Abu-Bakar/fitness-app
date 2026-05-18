import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
// === CHANGED === added LinearGradient for the per-card corner glow
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, radius, typography } from '../../theme';
import { getAllPrograms } from '../../lib/workouts/programs';
import type { Program } from '../../lib/workouts/types';
// === NEW === haptic on navigation taps, matching home.tsx pattern
import { tapLight } from '../../lib/haptics';

export default function WorkoutsScreen() {
  const router = useRouter();
  const programs = getAllPrograms();

  const handleBack = () => {
    tapLight();
    router.back();
  };

  const handleSelect = (programId: string) => {
    tapLight();
    router.push(`/workouts/${programId}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton} activeOpacity={0.7}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>PICK YOUR PROGRAM</Text>
            <Text style={styles.title}>Workouts</Text>
          </View>
        </View>

        {programs.map(program => (
          <ProgramCard
            key={program.id}
            program={program}
            onPress={() => handleSelect(program.id)}
          />
        ))}

        <Text style={styles.note}>
          More programs coming in premium — Upper/Lower, 5×5, full-body splits.
        </Text>
      </ScrollView>

      <StatusBar style="light" />
    </View>
  );
}

function ProgramCard({ program, onPress }: { program: Program; onPress: () => void }) {
  const levelLabel = program.level.toUpperCase();
  const goalLabel =
    program.goal === 'gain' ? 'BUILD MUSCLE' :
    program.goal === 'lose' ? 'CUT FAT' :
    'MAINTAIN';

  const totalExercises = program.days.reduce((sum, day) => sum + day.exercises.length, 0);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* === NEW === Subtle lime corner glow — training domain signature.
          Strongest in top-right, fading diagonally to nothing.
          pointerEvents="none" so taps still reach the TouchableOpacity. */}
      <LinearGradient
        colors={['rgba(163,230,53,0.22)', 'rgba(163,230,53,0.06)', 'transparent']}
        locations={[0, 0.4, 1]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0.2, y: 1 }}
        style={styles.cardGlow}
        pointerEvents="none"
      />

      <Text style={styles.cardEyebrow}>{levelLabel} · {goalLabel}</Text>
      <Text style={styles.cardTitle}>{program.name}</Text>
      <Text style={styles.cardDescription}>{program.description}</Text>

      <View style={styles.metaRow}>
        <MetaItem value={program.daysPerWeek.toString()} label="days/week" />
        <View style={styles.metaDivider} />
        <MetaItem value={program.durationWeeks.toString()} label="weeks" />
        <View style={styles.metaDivider} />
        <MetaItem value={totalExercises.toString()} label="exercises" />
      </View>

      <Text style={styles.cardCta}>View program →</Text>
    </TouchableOpacity>
  );
}

function MetaItem({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.metaItem}>
      <Text style={styles.metaValue}>{value}</Text>
      <Text style={styles.metaLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // === CHANGED === explicit dark bg (matches home.tsx pattern, no more transparent)
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSolid,
    paddingHorizontal: spacing.lg,
    paddingTop: 80,
    paddingBottom: spacing.xl,
  },
  scroll: { paddingBottom: spacing.xl },

  // Header — back button + eyebrow + title
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  // === CHANGED === slimmer back button with subtle border (matches home iconButton)
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  backIcon: { fontSize: 18, color: colors.textPrimary },
  headerText: { flex: 1 },
  // === CHANGED === lime eyebrow (training domain)
  eyebrow: { ...typography.caption, color: colors.accentTrain, marginBottom: spacing.xs },
  title: { ...typography.title, color: colors.textPrimary },

  // === CHANGED === program card — subtle lime border + overflow hidden for the corner glow
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(163,230,53,0.18)', // subtle lime tint = training domain
    overflow: 'hidden',                    // clip the corner gradient to rounded corners
    position: 'relative',
  },
  // === NEW === absolute gradient overlay; sits behind content because it renders first
  cardGlow: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  // === CHANGED === lime eyebrow inside cards too
  cardEyebrow: {
    ...typography.caption,
    color: colors.accentTrain,
    marginBottom: spacing.sm,
  },
  // === CHANGED === chunkier title (weight 900 for the gym-bro feel)
  cardTitle: {
    ...typography.heading,
    fontWeight: '900',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  cardDescription: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },

  // === CHANGED === meta row — slightly larger numbers, new divider color
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
  },
  metaValue: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  metaLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    letterSpacing: 1,
  },
  // === CHANGED === translucent white divider reads better against the new surfaceElevated
  metaDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.borderDefault,
  },

  // === CHANGED === lime CTA (training domain)
  cardCta: {
    ...typography.bodyBold,
    color: colors.accentTrain,
  },

  note: {
    ...typography.body,
    color: colors.textTertiary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
