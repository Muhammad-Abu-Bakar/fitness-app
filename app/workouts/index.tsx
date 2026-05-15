// === NEW ===
// app/workouts/index.tsx
//
// Programs list. v1 shows one program; designed to scale to many.

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, radius, typography } from '../../theme';
import { getAllPrograms } from '../../lib/workouts/programs';
import type { Program } from '../../lib/workouts/types';

export default function WorkoutsScreen() {
  const router = useRouter();
  const programs = getAllPrograms();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
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
            onPress={() => router.push(`/workouts/${program.id}`)}
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
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: 80,
    paddingBottom: spacing.xl,
  },
  scroll: { paddingBottom: spacing.xl },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { fontSize: 22, color: colors.textPrimary },
  headerText: { flex: 1 },
  eyebrow: { ...typography.caption, color: colors.accent, marginBottom: spacing.xs },
  title: { ...typography.title, color: colors.textPrimary },

  // Program card
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardEyebrow: {
    ...typography.caption,
    color: colors.accent,
    marginBottom: spacing.sm,
  },
  cardTitle: {
    ...typography.heading,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  cardDescription: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },

  // Meta row — 3 stats with vertical dividers
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
    ...typography.heading,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  metaLabel: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  metaDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.surface,
  },

  // CTA
  cardCta: {
    ...typography.bodyBold,
    color: colors.accent,
  },

  note: {
    ...typography.body,
    color: colors.textTertiary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: spacing.md,
  },
});