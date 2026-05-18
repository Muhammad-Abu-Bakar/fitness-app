// Stub for step 5. Will become the real profile (avatar, name, goals,
// achievements) in the polish pass. For now it surfaces the existing settings.

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Settings, User } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '../../theme';
import { tapLight } from '../../lib/haptics';

export default function ProfileScreen() {
  const router = useRouter();
  const goTo = (path: string) => { tapLight(); router.push(path); };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>YOUR ACCOUNT</Text>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.placeholder}>
        <View style={styles.iconWrap}>
          <User size={36} color={colors.textTertiary} strokeWidth={1.5} />
        </View>
        <Text style={styles.placeholderTitle}>Coming next</Text>
        <Text style={styles.placeholderBody}>
          Avatar, training stats, goals, and achievements will live here.
        </Text>
      </View>

      <TouchableOpacity style={styles.row} onPress={() => goTo('/settings')} activeOpacity={0.85}>
        <View style={styles.rowIcon}>
          <Settings size={20} color={colors.textPrimary} strokeWidth={1.6} />
        </View>
        <Text style={styles.rowLabel}>Settings</Text>
        <Text style={styles.rowArrow}>→</Text>
      </TouchableOpacity>

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
  eyebrow: { ...typography.caption, color: colors.accentFood, marginBottom: spacing.xs },
  title: { ...typography.title, color: colors.textPrimary },

  placeholder: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginBottom: spacing.lg,
  },
  iconWrap: {
    width: 64, height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
  },
  placeholderTitle: { ...typography.heading, color: colors.textPrimary, marginBottom: spacing.sm },
  placeholderBody: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  rowIcon: {
    width: 40, height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center', justifyContent: 'center',
  },
  rowLabel: { ...typography.bodyBold, color: colors.textPrimary, flex: 1 },
  rowArrow: { fontSize: 18, color: colors.textTertiary },
});
