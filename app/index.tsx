import { StatusBar } from 'expo-status-bar';
// === CHANGED === added ActivityIndicator
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
// === CHANGED === added Redirect
import { useRouter, Redirect } from 'expo-router';
import { colors, spacing, radius, typography } from '../theme';
// === NEW === read context to decide what to render
import { useOnboarding } from '../context/onboarding';

export default function WelcomeScreen() {
  const router = useRouter();
  // === NEW === pull state to check onboarding status
  const { loaded, goal, weightLbs, activityLevel, targetWeightLbs } = useOnboarding();

  // === NEW === show spinner while AsyncStorage is loading
  if (!loaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  // === NEW === if user already completed onboarding, send them to home
  const isOnboarded = goal !== null && weightLbs !== null && activityLevel !== null && targetWeightLbs !== null;
  if (isOnboarded) {
    return <Redirect href="/home" />;
  }

  const handleGetStarted = () => {
    router.push('/onboarding/goal');
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.lg, paddingTop: 100, paddingBottom: spacing.xl, justifyContent: 'space-between' },
  // === NEW === full-screen loading state
  loadingContainer: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  content: { marginTop: spacing.xl },
  eyebrow: { ...typography.caption, color: colors.accent, marginBottom: spacing.lg },
  title: { ...typography.display, color: colors.textPrimary },
  titleAccent: { ...typography.display, color: colors.accent, marginBottom: spacing.lg },
  subtitle: { ...typography.body, color: colors.textSecondary },
  button: { backgroundColor: colors.accent, paddingVertical: 18, borderRadius: radius.lg, alignItems: 'center' },
  buttonText: { ...typography.button, color: colors.onAccent },
});