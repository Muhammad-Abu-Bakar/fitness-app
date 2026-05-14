import { Stack } from 'expo-router';
// === NEW === import the provider
import { OnboardingProvider } from '../context/onboarding';

export default function RootLayout() {
  return (
    // === CHANGED === wrap Stack so every screen can read onboarding state
    <OnboardingProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="home" options={{ gestureEnabled: false }} />
      </Stack>
    </OnboardingProvider>
  );
}