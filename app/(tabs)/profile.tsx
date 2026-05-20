// === CHANGED === full rewrite — real profile with avatar, sex picker, data sections, and reset
import { StatusBar } from 'expo-status-bar';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { AvatarSvg } from '../../components/AvatarSvg';
import { Pencil, RotateCcw, Target, Scale, Goal as GoalIcon, Ruler, Cake, User, Activity } from 'lucide-react-native';
import { colors, spacing, radius, typography, dualGradient } from '../../theme';
import { useOnboarding, type Goal, type ActivityLevel, type Sex } from '../../context/onboarding';
import { tapLight, tapMedium, warning } from '../../lib/haptics';

const GOAL_LABELS: Record<Goal, string> = {
  bulk: 'Bulk up',
  lean: 'Lean out',
  exploring: 'Exploring',
};
const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: 'Sedentary',
  light: 'Light',
  moderate: 'Moderate',
  active: 'Active',
};
const SEX_LABELS: Record<Sex, string> = {
  male: 'Male',
  female: 'Female',
};

export default function ProfileScreen() {
  const router = useRouter();
  const onboarding = useOnboarding();
  const { loaded, sex, goal, weightLbs, targetWeightLbs, heightFt, heightIn, age, activityLevel, setSex, reset } = onboarding;

  if (!loaded) return null;

  const handleSetSex = (s: Sex) => {
    tapMedium();
    setSex(s);
  };

  const handleEdit = () => {
    tapMedium();
    router.push('/profile-edit');
  };

  const handleReset = () => {
    tapLight();
    Alert.alert(
      'Reset profile?',
      'This clears your goals and stats. You\'ll need to redo onboarding.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            warning();
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
        {/* Header */}
        <View style={styles.eyebrowRow}>
          <LinearGradient
            colors={dualGradient.colors}
            start={dualGradient.start}
            end={dualGradient.end}
            style={styles.eyebrowBar}
          />
          <Text style={styles.eyebrow}>ACCOUNT</Text>
        </View>
        <Text style={styles.title}>Profile</Text>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <LinearGradient
            colors={dualGradient.colors}
            start={dualGradient.start}
            end={dualGradient.end}
            style={styles.avatarRing}
          >
            <View style={styles.avatarInner}>
              <AvatarSvg sex={sex} color={colors.textPrimary} size={84} />
            </View>
          </LinearGradient>
          {sex ? (
            <Text style={styles.avatarLabel}>{SEX_LABELS[sex]}</Text>
          ) : (
            <Text style={styles.avatarPrompt}>Pick your avatar</Text>
          )}
        </View>

        {/* Inline sex picker — only shown when sex is null */}
        {!sex && (
          <View style={styles.sexPicker}>
            <TouchableOpacity
              style={styles.sexPickerOption}
              onPress={() => handleSetSex('male')}
              activeOpacity={0.85}
            >
              <View style={styles.sexPickerAvatar}>
                <AvatarSvg sex="male" color={colors.textSecondary} size={48} />
              </View>
              <Text style={styles.sexPickerLabel}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sexPickerOption}
              onPress={() => handleSetSex('female')}
              activeOpacity={0.85}
            >
              <View style={styles.sexPickerAvatar}>
                <AvatarSvg sex="female" color={colors.textSecondary} size={48} />
              </View>
              <Text style={styles.sexPickerLabel}>Female</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Edit profile CTA (always available) */}
        <LinearGradient
          colors={dualGradient.colors}
          start={dualGradient.start}
          end={dualGradient.end}
          style={styles.editButtonRing}
        >
          <TouchableOpacity
            style={styles.editButtonInner}
            onPress={handleEdit}
            activeOpacity={0.85}
          >
            <Pencil size={16} color={colors.textPrimary} strokeWidth={2.5} />
            <Text style={styles.editButtonText}>Edit profile</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* GOAL section */}
        <SectionHeader label="GOAL" />
        <View style={styles.card}>
          <DataRow
            icon={<Target size={18} color={colors.accentTrain} strokeWidth={2} />}
            label="Goal"
            value={goal ? GOAL_LABELS[goal] : '—'}
          />
        </View>

        {/* BODY section */}
        <SectionHeader label="BODY" />
        <View style={styles.card}>
          <DataRow
            icon={<Scale size={18} color={colors.accentFood} strokeWidth={2} />}
            label="Weight"
            value={weightLbs !== null ? `${weightLbs} lbs` : '—'}
          />
          <Separator />
          <DataRow
            icon={<GoalIcon size={18} color={colors.accentFood} strokeWidth={2} />}
            label="Target weight"
            value={targetWeightLbs !== null ? `${targetWeightLbs} lbs` : '—'}
          />
          <Separator />
          <DataRow
            icon={<Ruler size={18} color={colors.textSecondary} strokeWidth={2} />}
            label="Height"
            value={heightFt !== null && heightIn !== null ? `${heightFt}'${heightIn}"` : '—'}
          />
          <Separator />
          <DataRow
            icon={<Cake size={18} color={colors.textSecondary} strokeWidth={2} />}
            label="Age"
            value={age !== null ? `${age}` : '—'}
          />
          <Separator />
          <DataRow
            icon={<User size={18} color={colors.textSecondary} strokeWidth={2} />}
            label="Sex"
            value={sex ? SEX_LABELS[sex] : '—'}
          />
        </View>

        {/* TRAINING section */}
        <SectionHeader label="TRAINING" />
        <View style={styles.card}>
          <DataRow
            icon={<Activity size={18} color={colors.accentTrain} strokeWidth={2} />}
            label="Activity level"
            value={activityLevel ? ACTIVITY_LABELS[activityLevel] : '—'}
          />
        </View>

        {/* Danger zone */}
        <View style={{ height: spacing.xl }} />
        <TouchableOpacity style={styles.dangerButton} onPress={handleReset} activeOpacity={0.85}>
          <View style={styles.dangerIconWrap}>
            <RotateCcw size={20} color={colors.danger} strokeWidth={2} />
          </View>
          <View style={styles.dangerTextWrap}>
            <Text style={styles.dangerButtonText}>Reset profile</Text>
            <Text style={styles.dangerButtonSubtext}>Clear stats and redo onboarding</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
}


function SectionHeader({ label }: { label: string }) {
  return (
    <Text style={styles.sectionHeader}>{label}</Text>
  );
}

function DataRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.dataRow}>
      <View style={styles.dataRowIcon}>{icon}</View>
      <Text style={styles.dataRowLabel}>{label}</Text>
      <Text style={styles.dataRowValue}>{value}</Text>
    </View>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSolid,
    paddingHorizontal: spacing.lg,
    paddingTop: 80,
  },
  scroll: { paddingBottom: 100 },

  // Header
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  eyebrowBar: { width: 20, height: 3, borderRadius: 2, marginRight: spacing.sm },
  eyebrow: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    fontSize: 12,
    letterSpacing: 1.5,
  },
  title: { ...typography.title, color: colors.textPrimary, marginBottom: spacing.xl },

  // Avatar
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatarRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    padding: 1.5,
    marginBottom: spacing.md,
  },
  avatarInner: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarLabel: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    fontSize: 15,
  },
  avatarPrompt: {
    ...typography.body,
    color: colors.textTertiary,
    fontSize: 13,
  },

  // Sex picker (inline, shown only when sex is null)
  sexPicker: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  sexPickerOption: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  sexPickerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  sexPickerLabel: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    fontSize: 14,
  },

  // Edit CTA — dual gradient ring
  editButtonRing: {
    borderRadius: radius.lg,
    padding: 1.5,
    marginBottom: spacing.xl,
  },
  editButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surfaceElevated,
    paddingVertical: 14,
    borderRadius: radius.lg - 1.5,
  },
  editButtonText: {
    ...typography.button,
    color: colors.textPrimary,
  },

  // Section header
  sectionHeader: {
    ...typography.caption,
    color: colors.textTertiary,
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },

  // Data card / rows
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    overflow: 'hidden',
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  dataRowIcon: {
    width: 24,
    alignItems: 'center',
  },
  dataRowLabel: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
  },
  dataRowValue: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  separator: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginLeft: spacing.md + 24 + spacing.md, // align with label start
  },

  // Danger zone
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
  dangerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239,68,68,0.10)',
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
});
