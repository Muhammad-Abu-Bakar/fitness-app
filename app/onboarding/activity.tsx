// === NEW === onboarding step 3 — activity level for TDEE estimate
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, radius, typography } from '../../theme';
import { useOnboarding, ActivityLevel } from '../../context/onboarding';

type ActivityOption = { id: ActivityLevel; title: string; description: string };

const ACTIVITIES: ActivityOption[] = [
  { id: 'sedentary', title: 'Sedentary', description: 'Desk job, little to no exercise' },
  { id: 'light', title: 'Lightly active', description: 'Light exercise 1-3 days a week' },
  { id: 'moderate', title: 'Moderately active', description: 'Exercise 3-5 days a week' },
  { id: 'active', title: 'Very active', description: 'Hard exercise 6-7 days a week' },
];

export default function ActivityScreen() {
  const router = useRouter();
  const { setActivityLevel } = useOnboarding();
  const [selected, setSelected] = useState<ActivityLevel | null>(null);

  const handleContinue = () => {
    if (!selected) return;
    setActivityLevel(selected);
    router.push('/onboarding/target');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.step}>STEP 3 OF 4</Text>
        <Text style={styles.title}>How active are you?</Text>
        <Text style={styles.subtitle}>Include workouts, walking, and physical work.</Text>

        <View style={styles.options}>
          {ACTIVITIES.map((option) => {
            const isSelected = selected === option.id;
            return (
              <TouchableOpacity key={option.id} style={[styles.card, isSelected && styles.cardSelected]} onPress={() => setSelected(option.id)} activeOpacity={0.85}>
                <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>{option.title}</Text>
                <Text style={styles.cardDescription}>{option.description}</Text>
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