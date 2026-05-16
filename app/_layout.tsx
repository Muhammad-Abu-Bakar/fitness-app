import { Stack } from 'expo-router';
import { OnboardingProvider } from '../context/onboarding';
import { FoodLogProvider } from '../context/foodLog';
import { WorkoutLogProvider } from '../context/workoutLog';
import { CheckInProvider } from '../context/checkIn'; // === NEW === Day 17

// Provider order doesn't matter functionally — none of these depend on each other.
// Just keeping a consistent shape: outermost = oldest feature, innermost = newest.
export default function RootLayout() {
  return (
    <OnboardingProvider>
      <FoodLogProvider>
        <WorkoutLogProvider>
          {/* === NEW === Day 17 */}
          <CheckInProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="home" options={{ gestureEnabled: false }} />
            </Stack>
          </CheckInProvider>
        </WorkoutLogProvider>
      </FoodLogProvider>
    </OnboardingProvider>
  );
}
