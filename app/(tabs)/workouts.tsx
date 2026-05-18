// Same lime corner-glow program list as step 4, but with the back button
// removed (tabs don't have back) and bottom padding adjusted for the tab bar.

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, radius, typography } from '../../theme';
import { getAllPrograms } from '../../lib/workouts/programs';
import type { Program } from '../../lib/workouts/types';
import { tapLight } from '../../lib/haptics';

export default function WorkoutsScreen() {
  const router = useRouter();
  const programs = getAllPrograms();

  const handleSelect = (programId: string) => {
    tapLight();
    router.push(`/workouts/${programId}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>PICK YOUR PROGRAM</Text>
          <Text style={styles.title}>Workouts</Text>
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
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSolid,
    paddingHorizontal: spacing.lg,
  },
  // === CHANGED === paddingTop 80 (status bar room), paddingBottom 100 (tab bar)
  scroll: { paddingTop: 80, paddingBottom: 100 },

  header: { marginBottom: spacing.xl },
  eyebrow: { ...typography.caption, color: colors.accentTrain, marginBottom: spacing.xs },
  title: { ...typography.title, color: colors.textPrimary },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(163,230,53,0.18)',
    overflow: 'hidden',
    position: 'relative',
  },
  cardGlow: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  cardEyebrow: { ...typography.caption, color: colors.accentTrain, marginBottom: spacing.sm },
  cardTitle: {
    ...typography.heading,
    fontWeight: '900',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  cardDescription: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  metaItem: { flex: 1, alignItems: 'center' },
  metaValue: { fontSize: 22, fontWeight: '900', color: colors.textPrimary, marginBottom: 2 },
  metaLabel: { ...typography.caption, color: colors.textTertiary, letterSpacing: 1 },
  metaDivider: { width: 1, height: 28, backgroundColor: colors.borderDefault },

  cardCta: { ...typography.bodyBold, color: colors.accentTrain },
  note: {
    ...typography.body,
    color: colors.textTertiary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
