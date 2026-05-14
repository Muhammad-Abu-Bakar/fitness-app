import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, radius, typography } from '../../theme';
// === NEW === import context hook + Goal type
import { useOnboarding, Goal } from '../../context/onboarding';

type GoalOption = { id: Goal; title: string; description: string };

const GOALS: GoalOption[] = [
  { id: 'bulk', title: 'Bulk up', description: 'Gain weight and muscle as fast as possible' },
  { id: 'lean', title: 'Lean gains', description: 'Build muscle while staying lean' },
  { id: 'exploring', title: 'Just exploring', description: "I'm not sure yet — show me what's possible" },
];

export default function GoalScreen() {
  const router = useRouter();
  // === NEW === read setter from context
  const { setGoal } = useOnboarding();
  const [selected, setSelected] = useState<Goal | null>(null);

  // === CHANGED === save to context + navigate
  const handleContinue = () => {
    if (!selected) return;
    setGoal(selected);
    router.push('/onboarding/stats');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.step}>STEP 1 OF 4</Text>
        <Text style={styles.title}>What's your goal?</Text>
        <Text style={styles.subtitle}>We'll tune your calorie and protein targets to match.</Text>

        <View style={styles.options}>
          {GOALS.map((goal) => {
            const isSelected = selected === goal.id;
            return (
              <TouchableOpacity
                key={goal.id}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => setSelected(goal.id)}
                activeOpacity={0.85}
              >
                <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>{goal.title}</Text>
                <Text style={styles.cardDescription}>{goal.description}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <TouchableOpacity style={[styles.button, !selected && styles.buttonDisabled]} onPress={handleContinue} disabled={!selected} activeOpacity={0.85}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.lg, paddingTop: 80, paddingBottom: spacing.xl },
  scroll: { paddingBottom: spacing.lg },
  step: { ...typography.caption, color: colors.accent, marginBottom: spacing.md },
  title: { ...typography.title, color: colors.textPrimary, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },
  options: { gap: spacing.md },
  card: { backgroundColor: colors.surface, padding: spacing.lg, borderRadius: radius.lg, borderWidth: 2, borderColor: colors.surface },
  cardSelected: { borderColor: colors.accent, backgroundColor: colors.surfaceElevated },
  cardTitle: { ...typography.heading, color: colors.textPrimary, marginBottom: spacing.xs },
  cardTitleSelected: { color: colors.accent },
  cardDescription: { ...typography.body, color: colors.textSecondary },
  button: { backgroundColor: colors.accent, paddingVertical: 18, borderRadius: radius.lg, alignItems: 'center' },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { ...typography.button, color: colors.onAccent },
});