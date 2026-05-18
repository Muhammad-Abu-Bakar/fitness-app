import { Stack } from 'expo-router';
import { OnboardingProvider } from '../context/onboarding';
import { FoodLogProvider } from '../context/foodLog';
import { WorkoutLogProvider } from '../context/workoutLog';
import { CheckInProvider } from '../context/checkIn';
import { colors } from '../theme';

export default function RootLayout() {
  return (
    <OnboardingProvider>
      <FoodLogProvider>
        <WorkoutLogProvider>
          <CheckInProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.backgroundSolid },
              }}
            >
              {/* === CHANGED === root child is now the (tabs) group, not a single home screen */}
              <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
            </Stack>
          </CheckInProvider>
        </WorkoutLogProvider>
      </FoodLogProvider>
    </OnboardingProvider>
  );
}
