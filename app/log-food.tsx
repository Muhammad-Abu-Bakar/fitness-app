// Log food screen — minimal form: name + calories + protein.
// Food domain throughout (cyan). Pushed from the QuickAdd sheet ("+" tab)
// or anywhere on home that points to /log-food.

import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, radius, typography } from '../theme';
import { useFoodLog, getTodayDateString } from '../context/foodLog';
// === CHANGED === added tapLight for the cancel button; success was already here
import { tapLight, success } from '../lib/haptics';

export default function LogFoodScreen() {
  const router = useRouter();
  const { addEntry } = useFoodLog();

  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');

  const caloriesN = parseFloat(calories);
  const proteinN = parseFloat(protein);

  const isValid =
    name.trim().length > 0 &&
    !isNaN(caloriesN) && caloriesN >= 0 && caloriesN <= 5000 &&
    !isNaN(proteinN) && proteinN >= 0 && proteinN <= 500;

  // === NEW === cancel button gets a light haptic, consistent with rest of app
  const handleCancel = () => {
    tapLight();
    router.back();
  };

  const handleSave = () => {
    if (!isValid) return;
    addEntry({
      name: name.trim(),
      calories: Math.round(caloriesN),
      protein: Math.round(proteinN),
      date: getTodayDateString(),
    });
    success();
    router.back();
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backButton} onPress={handleCancel} activeOpacity={0.7}>
          <Text style={styles.backText}>← Cancel</Text>
        </TouchableOpacity>

        {/* === NEW === eyebrow marks the screen as food domain */}
        <Text style={styles.eyebrow}>FOOD</Text>
        <Text style={styles.title}>Log food</Text>
        <Text style={styles.subtitle}>Anything you ate or drank — meal, snack, shake.</Text>

        <View style={styles.field}>
          <Text style={styles.label}>What did you eat?</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Chicken & rice, whey shake…"
              placeholderTextColor={colors.textTertiary}
              autoFocus
              returnKeyType="next"
            />
          </View>
        </View>

        <View style={styles.fieldRow}>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Calories</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={calories}
                onChangeText={setCalories}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.textTertiary}
              />
              <Text style={styles.unit}>kcal</Text>
            </View>
          </View>

          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Protein</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={protein}
                onChangeText={setProtein}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.textTertiary}
              />
              <Text style={styles.unit}>g</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.button, !isValid && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={!isValid}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>Add to today's log</Text>
      </TouchableOpacity>

      <StatusBar style="light" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // === CHANGED === explicit dark bg (was transparent — relied on the deleted global gradient)
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSolid,
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.xl,
  },
  scroll: { paddingBottom: spacing.lg },
  backButton: { alignSelf: 'flex-start', paddingVertical: spacing.sm, marginBottom: spacing.md },
  // === CHANGED === cancel link is cyan now (was yellow accent)
  backText: { ...typography.bodyBold, color: colors.accentFood },

  // === NEW === cyan eyebrow above title — food domain marker
  eyebrow: { ...typography.caption, color: colors.accentFood, marginBottom: spacing.xs },

  title: { ...typography.title, color: colors.textPrimary, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },

  field: { marginBottom: spacing.lg },
  fieldRow: { flexDirection: 'row', gap: spacing.md },
  halfField: { flex: 1 },
  label: { ...typography.bodyBold, color: colors.textPrimary, marginBottom: spacing.sm },

  // === CHANGED === input rows get a subtle cyan border (food domain marker)
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.18)',
  },
  input: { flex: 1, ...typography.body, color: colors.textPrimary, paddingVertical: 14, fontSize: 18 },
  unit: { ...typography.body, color: colors.textTertiary, marginLeft: spacing.sm },

  // === CHANGED === save button is solid cyan with dark text (was yellow)
  button: {
    backgroundColor: colors.accentFood,
    paddingVertical: 18,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { ...typography.button, color: colors.onAccentFood },
});
