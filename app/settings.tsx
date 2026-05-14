// === NEW === settings screen — for now, just profile reset. More options later.
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, radius, typography } from '../theme';
import { useOnboarding } from '../context/onboarding';

export default function SettingsScreen() {
  const router = useRouter();
  const { reset } = useOnboarding();

  // === NEW === confirm before resetting — destructive actions need a safety net
  const handleReset = () => {
    Alert.alert(
      'Reset profile?',
      'This clears your goals and stats. You\'ll need to redo onboarding.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            reset();
            router.replace('/');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Settings</Text>

        <Text style={styles.sectionTitle}>Profile</Text>
        <TouchableOpacity style={styles.dangerButton} onPress={handleReset} activeOpacity={0.85}>
          <Text style={styles.dangerButtonText}>Reset profile</Text>
          <Text style={styles.dangerButtonSubtext}>Clear stats and redo onboarding</Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          More settings (units, reminders, account) coming in later versions.
        </Text>
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.xl },
  scroll: { paddingBottom: spacing.xl },
  backButton: { alignSelf: 'flex-start', paddingVertical: spacing.sm, marginBottom: spacing.md },
  backText: { ...typography.bodyBold, color: colors.accent },
  title: { ...typography.title, color: colors.textPrimary, marginBottom: spacing.xl },
  sectionTitle: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.sm },
  dangerButton: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.danger },
  dangerButtonText: { ...typography.bodyBold, color: colors.danger, marginBottom: spacing.xs },
  dangerButtonSubtext: { ...typography.body, color: colors.textTertiary },
  note: { ...typography.body, color: colors.textTertiary, fontStyle: 'italic', textAlign: 'center', marginTop: spacing.xl },
});