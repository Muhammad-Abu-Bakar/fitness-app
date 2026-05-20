// === CHANGED === strict goal filtering (only programs matching user's goal)
// + hero image on each program card

import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, radius, typography } from '../../../theme';
import { getProgramsForGoal, PROGRAM_IMAGES } from '../../../lib/workouts/programs';
import type { Program } from '../../../lib/workouts/types';
import { useOnboarding } from '../../../context/onboarding';
import { tapLight } from '../../../lib/haptics';

const GOAL_LABELS: Record<string, string> = {
  bulk: 'BULK UP',
  lean: 'LEAN GAINS',
  exploring: 'EXPLORING',
};

const GOAL_TAGLINES: Record<string, string> = {
  bulk: 'Built to put size on skinny frames. Hit your surplus and trust the process.',
  lean: 'Keep your strength. Drop the fat. Trust the lifts more than the scale.',
  exploring: "You don't have to have it figured out yet. Start with the basics. The body follows.",
};

export default function WorkoutsScreen() {
  const router = useRouter();
  const { goal } = useOnboarding();

  const programs = useMemo(() => getProgramsForGoal(goal), [goal]);

  const handleSelect = (programId: string) => {
    tapLight();
    router.push(`/workouts/${programId}`);
  };

  const goalLabel = goal ? GOAL_LABELS[goal] : 'ALL PROGRAMS';
  const tagline = goal ? GOAL_TAGLINES[goal] : '';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>{goalLabel}</Text>
          <Text style={styles.title}>Workouts</Text>
          {tagline && <Text style={styles.tagline}>{tagline}</Text>}
        </View>

        {programs.map((program) => (
          <ProgramCard
            key={program.id}
            program={program}
            onPress={() => handleSelect(program.id)}
          />
        ))}

        <Text style={styles.note}>
          Want a different program? Update your goal in Profile.
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

  const totalExercises = program.days.reduce(
    (sum, day) => sum + day.exercises.length,
    0,
  );

  const imageUrl = PROGRAM_IMAGES[program.id];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* === NEW === hero image header */}
      {imageUrl && (
        <View style={styles.imageWrap}>
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
          {/* dark gradient overlay at the bottom for text legibility */}
          <LinearGradient
            colors={['transparent', 'rgba(10,15,18,0.95)']}
            locations={[0, 1]}
            style={styles.imageOverlay}
            pointerEvents="none"
          />
        </View>
      )}

      <View style={styles.cardContent}>
        {/* corner glow only on the content area */}
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
      </View>
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
  scroll: { paddingTop: 80, paddingBottom: 100 },

  header: { marginBottom: spacing.xl },
  eyebrow: {
    ...typography.caption,
    color: colors.accentTrain,
    marginBottom: spacing.xs,
    letterSpacing: 1.5,
  },
  title: { ...typography.title, color: colors.textPrimary, marginBottom: spacing.sm },
  tagline: { ...typography.body, color: colors.textSecondary, fontStyle: 'italic' },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(163,230,53,0.18)',
    overflow: 'hidden',
  },
  imageWrap: {
    width: '100%',
    height: 180,
    position: 'relative',
    backgroundColor: colors.surfaceElevated, // shown while image loads or if it fails
  },
  image: { width: '100%', height: '100%' },
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  cardContent: {
    padding: spacing.lg,
    position: 'relative',
  },
  cardGlow: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  cardEyebrow: {
    ...typography.caption,
    color: colors.accentTrain,
    marginBottom: spacing.sm,
    letterSpacing: 1.5,
  },
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
