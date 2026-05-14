// === NEW === placeholder home screen — confirms onboarding state was saved
// Day 11: we'll replace this with the real dashboard (calories, protein, today's workout)
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import { useOnboarding } from '../context/onboarding';

export default function HomeScreen() {
  const { goal, weightLbs, heightFt, heightIn, age, activityLevel, targetWeightLbs } = useOnboarding();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>YOU'RE ALL SET</Text>
        <Text style={styles.title}>Setup complete</Text>
        <Text style={styles.subtitle}>Here's what we know about you:</Text>

        <View style={styles.card}>
          <Row label="Goal" value={goal ?? '—'} />
          <Row label="Weight" value={weightLbs ? `${weightLbs} lbs` : '—'} />
          <Row label="Height" value={heightFt !== null && heightIn !== null ? `${heightFt}'${heightIn}"` : '—'} />
          <Row label="Age" value={age ? String(age) : '—'} />
          <Row label="Activity" value={activityLevel ?? '—'} />
          <Row label="Target" value={targetWeightLbs ? `${targetWeightLbs} lbs` : '—'} />
        </View>

        <Text style={styles.note}>Day 11: we'll turn these into your daily calorie + protein targets and build the real dashboard.</Text>
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.lg, paddingTop: 80, paddingBottom: spacing.xl },
  scroll: { paddingBottom: spacing.lg },
  eyebrow: { ...typography.caption, color: colors.accent, marginBottom: spacing.md },
  title: { ...typography.title, color: colors.textPrimary, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.lg },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.surfaceElevated },
  rowLabel: { ...typography.body, color: colors.textSecondary },
  rowValue: { ...typography.bodyBold, color: colors.textPrimary, textTransform: 'capitalize' },
  note: { ...typography.body, color: colors.textTertiary, fontStyle: 'italic' },
});