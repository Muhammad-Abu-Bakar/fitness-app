import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
// === NEW === import design tokens
import { colors, spacing, radius, typography } from './theme';

export default function App() {
  const handleGetStarted = () => {
    console.log('Get Started tapped');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>FOR SKINNY GUYS WHO WANT TO GROW</Text>
        <Text style={styles.title}>Get Bigger.</Text>
        <Text style={styles.titleAccent}>Stay Consistent.</Text>
        <Text style={styles.subtitle}>
          Track calories, protein, and workouts built for hardgainers — not the average gym bro.
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleGetStarted} activeOpacity={0.85}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>

      <StatusBar style="light" />
    </View>
  );
}

// === CHANGED === all hardcoded values replaced with tokens
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: 100,
    paddingBottom: spacing.xl,
    justifyContent: 'space-between',
  },
  content: {
    marginTop: spacing.xl,
  },
  eyebrow: {
    ...typography.caption,
    color: colors.accent,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.display,
    color: colors.textPrimary,
  },
  titleAccent: {
    ...typography.display,
    color: colors.accent,
    marginBottom: spacing.lg,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  button: {
    backgroundColor: colors.accent,
    paddingVertical: 18,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  buttonText: {
    ...typography.button,
    color: colors.onAccent,
  },
});