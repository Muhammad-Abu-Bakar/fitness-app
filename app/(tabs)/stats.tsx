// Stub for step 5. Real implementation (PRs, total volume, body weight trends,
// food + workout combined timeline) lands in the post-redesign polish pass.

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { BarChart3 } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '../../theme';
import { tapLight } from '../../lib/haptics';

export default function StatsScreen() {
  const router = useRouter();
  const goTo = (path: string) => { tapLight(); router.push(path); };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>YOUR PROGRESS</Text>
        <Text style={styles.title}>Stats</Text>
      </View>

      <View style={styles.placeholder}>
        <View style={styles.iconWrap}>
          <BarChart3 size={36} color={colors.textTertiary} strokeWidth={1.5} />
        </View>
        <Text style={styles.placeholderTitle}>Coming next</Text>
        <Text style={styles.placeholderBody}>
          PRs, total volume, body-weight trends, and your food + workout timeline will live here. For now you can still browse your past workout sessions.
        </Text>
        <TouchableOpacity style={styles.linkButton} onPress={() => goTo('/workout/history')} activeOpacity={0.85}>
          <Text style={styles.linkButtonText}>View workout history →</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkButtonAlt} onPress={() => goTo('/history')} activeOpacity={0.85}>
          <Text style={styles.linkButtonAltText}>View food log history →</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSolid,
    paddingHorizontal: spacing.lg,
    paddingTop: 80,
    paddingBottom: 100,
  },
  header: { marginBottom: spacing.xl },
  eyebrow: { ...typography.caption, color: colors.accentTrain, marginBottom: spacing.xs },
  title: { ...typography.title, color: colors.textPrimary },

  placeholder: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  iconWrap: {
    width: 64, height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
  },
  placeholderTitle: { ...typography.heading, color: colors.textPrimary, marginBottom: spacing.sm },
  placeholderBody: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  linkButton: {
    paddingVertical: spacing.smd,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.accentTrain,
    backgroundColor: 'rgba(163,230,53,0.10)',
    marginBottom: spacing.sm,
  },
  linkButtonText: { ...typography.bodyBold, color: colors.accentTrain },
  linkButtonAlt: {
    paddingVertical: spacing.smd,
    paddingHorizontal: spacing.md,
  },
  linkButtonAltText: { ...typography.body, color: colors.textTertiary },
});
