import { Stack } from 'expo-router';
import { OnboardingProvider } from '../context/onboarding';
import { FoodLogProvider } from '../context/foodLog';
import { WorkoutLogProvider } from '../context/workoutLog';
import { CheckInProvider } from '../context/checkIn';
// === CHANGED === import colors instead of gradient (Bulkify redesign step 2).
// LinearGradient + gradient imports are gone — the global navy wrapper is removed.
import { colors } from '../theme';

export default function RootLayout() {
  return (
    <OnboardingProvider>
      <FoodLogProvider>
        <WorkoutLogProvider>
          <CheckInProvider>
            {/* === CHANGED === Flat dark background replaces the global navy gradient.
                Aurora glow now lives only inside hero screens (home, workout-complete). */}
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.backgroundSolid },
              }}
            >
              <Stack.Screen name="home" options={{ gestureEnabled: false }} />
            </Stack>
          </CheckInProvider>
        </WorkoutLogProvider>
      </FoodLogProvider>
    </OnboardingProvider>
  );
}
