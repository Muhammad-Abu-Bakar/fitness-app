// === NEW === settings screen — for now, just profile reset. More options later.
// === CHANGED === neutral reskin (no domain accent — this is a meta screen)
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, RotateCcw } from 'lucide-react-native'; // === NEW ===
import { colors, spacing, radius, typography } from '../theme';
import { useOnboarding } from '../context/onboarding';
import { tapLight, warning } from '../lib/haptics'; // === NEW ===

export default function SettingsScreen() {
  const router = useRouter();
  const { reset } = useOnboarding();

  // === NEW === light haptic on back nav
  const handleBack = () => {
    tapLight();
    router.back();
  };

  // confirm before resetting — destructive actions need a safety net
  const handleReset = () => {
    tapLight(); // === NEW === neutral tap to open the alert
    Alert.alert(
      'Reset profile?',
      'This clears your goals and stats. You\'ll need to redo onboarding.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            warning(); // === NEW === warning haptic on confirmed destructive action
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
        {/* === CHANGED === slim 40x40 icon back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ChevronLeft size={22} color={colors.textPrimary} strokeWidth={2} />
        </TouchableOpacity>

        <Text style={styles.title}>Settings</Text>

        <Text style={styles.sectionTitle}>PROFILE</Text>
        {/* === CHANGED === danger button with icon */}
        <TouchableOpacity style={styles.dangerButton} onPress={handleReset} activeOpacity={0.85}>
          <View style={styles.dangerIconWrap}>
            <RotateCcw size={20} color={colors.danger} strokeWidth={2} />
          </View>
          <View style={styles.dangerTextWrap}>
            <Text style={styles.dangerButtonText}>Reset profile</Text>
            <Text style={styles.dangerButtonSubtext}>Clear stats and redo onboarding</Text>
          </View>
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
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSolid, // === CHANGED ===
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.xl,
  },
  scroll: { paddingBottom: spacing.xl },
  // === CHANGED === slim 40x40 icon back button
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.textTertiary, // === CHANGED === tertiary feels more like a section header
    marginBottom: spacing.md,
    letterSpacing: 1.5, // === NEW === consistency with other section caps
  },
  // === CHANGED === danger button now a row with icon + text block
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  // === NEW === icon halo (subtle danger-tinted square)
  dangerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239,68,68,0.10)', // assumes danger ~ red-500; soft tint behind icon
  },
  dangerTextWrap: { flex: 1 },
  dangerButtonText: {
    ...typography.bodyBold,
    color: colors.danger,
    marginBottom: spacing.xs,
  },
  dangerButtonSubtext: {
    ...typography.body,
    color: colors.textTertiary,
  },
  note: {
    ...typography.body,
    color: colors.textTertiary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
