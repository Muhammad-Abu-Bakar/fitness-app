// === NEW === Inner Stack for the Workouts tab.
// Lets the tab bar stay visible while the user drills from the program list
// into a program's detail screen (and any deeper sub-screens we add later).

import { Stack } from 'expo-router';
import { colors } from '../../../theme';

export default function WorkoutsTabLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.backgroundSolid },
      }}
    />
  );
}
