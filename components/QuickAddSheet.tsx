// === NEW === Bulkify redesign step 5: quick-add bottom sheet.
// Triggered by the "+" button in the custom tab bar. Three actions —
// log food (cyan), start workout (lime), log weigh-in (dual).
// Uses RN Modal for v1; can swap to @gorhom/bottom-sheet later for snap
// points and gesture-driven dismissal.

import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet, TouchableWithoutFeedback, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Apple, Dumbbell, Scale, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, radius, typography, dualGradient } from '../theme';
import { tapLight } from '../lib/haptics';

interface QuickAddSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function QuickAddSheet({ visible, onClose }: QuickAddSheetProps) {
  const router = useRouter();

  const handleAction = (path: string) => {
    tapLight();
    onClose();
    // Tiny delay so the sheet animates out before navigation
    setTimeout(() => router.push(path), 120);
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View style={styles.sheet}>
        <View style={styles.handle} />

        <View style={styles.headerRow}>
          <Text style={styles.sheetTitle}>QUICK ADD</Text>
          <Pressable onPress={onClose} hitSlop={12}>
            <X size={20} color={colors.textSecondary} strokeWidth={1.8} />
          </Pressable>
        </View>

        <Pressable style={[styles.action, styles.actionFood]} onPress={() => handleAction('/log-food')}>
          <View style={[styles.actionIconWrap, styles.iconWrapFood]}>
            <Apple size={22} color={colors.accentFood} strokeWidth={1.8} />
          </View>
          <View style={styles.actionText}>
            <Text style={[styles.actionLabel, { color: colors.accentFood }]}>FOOD</Text>
            <Text style={styles.actionTitle}>Log a meal</Text>
          </View>
          <Text style={styles.actionArrow}>→</Text>
        </Pressable>

        <Pressable style={[styles.action, styles.actionTrain]} onPress={() => handleAction('/workouts')}>
          <View style={[styles.actionIconWrap, styles.iconWrapTrain]}>
            <Dumbbell size={22} color={colors.accentTrain} strokeWidth={1.8} />
          </View>
          <View style={styles.actionText}>
            <Text style={[styles.actionLabel, { color: colors.accentTrain }]}>WORKOUT</Text>
            <Text style={styles.actionTitle}>Start a session</Text>
          </View>
          <Text style={styles.actionArrow}>→</Text>
        </Pressable>

        {/* Cross-domain weigh-in — dual gradient "border" via absolute LinearGradient + inset content */}
        <Pressable style={styles.actionDual} onPress={() => handleAction('/log-checkin')}>
          <LinearGradient
            colors={dualGradient.colors}
            start={dualGradient.start}
            end={dualGradient.end}
            style={styles.dualBorder}
            pointerEvents="none"
          />
          <View style={styles.dualInner}>
            <View style={[styles.actionIconWrap, styles.iconWrapDual]}>
              <Scale size={22} color={colors.textPrimary} strokeWidth={1.8} />
            </View>
            <View style={styles.actionText}>
              <Text style={[styles.actionLabel, { color: colors.textPrimary }]}>WEIGH-IN</Text>
              <Text style={styles.actionTitle}>Log your weight</Text>
            </View>
            <Text style={styles.actionArrow}>→</Text>
          </View>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? 36 : spacing.lg,
  },
  handle: {
    width: 44, height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderDefault,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sheetTitle: { ...typography.caption, color: colors.textSecondary },

  action: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.smd,
    gap: spacing.md,
    borderWidth: 1,
  },
  actionFood: { borderColor: 'rgba(34,211,238,0.30)' },
  actionTrain: { borderColor: 'rgba(163,230,53,0.30)' },

  actionDual: {
    borderRadius: radius.lg,
    marginBottom: spacing.smd,
    overflow: 'hidden',
    position: 'relative',
  },
  dualBorder: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    opacity: 0.6,
  },
  dualInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    margin: 1.5,
    borderRadius: radius.lg - 1,
    padding: spacing.md,
    gap: spacing.md,
  },

  actionIconWrap: {
    width: 40, height: 40,
    borderRadius: radius.full,
    alignItems: 'center', justifyContent: 'center',
  },
  iconWrapFood: { backgroundColor: 'rgba(34,211,238,0.10)' },
  iconWrapTrain: { backgroundColor: 'rgba(163,230,53,0.10)' },
  iconWrapDual: { backgroundColor: 'rgba(255,255,255,0.08)' },

  actionText: { flex: 1 },
  actionLabel: { ...typography.caption, marginBottom: 2 },
  actionTitle: { ...typography.bodyBold, color: colors.textPrimary },
  actionArrow: { fontSize: 18, color: colors.textTertiary },
});
