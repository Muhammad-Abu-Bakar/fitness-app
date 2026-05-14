import { Stack } from 'expo-router';
import { OnboardingProvider } from '../context/onboarding';
// === NEW === food log provider
import { FoodLogProvider } from '../context/foodLog';

export default function RootLayout() {
  return (
    <OnboardingProvider>
      {/* === NEW === wrap inside onboarding provider — both are now available to all screens */}
      <FoodLogProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="home" options={{ gestureEnabled: false }} />
        </Stack>
      </FoodLogProvider>
    </OnboardingProvider>
  );
}