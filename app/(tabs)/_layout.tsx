// === NEW === Bulkify redesign step 5: tab group layout.
// Registers the 4 real tab routes and wires up the CustomTabBar.
// The "+" button is rendered inside CustomTabBar — it's NOT a tab route.

import { Tabs } from 'expo-router';
import { CustomTabBar } from '../../components/CustomTabBar';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="workouts" />
      <Tabs.Screen name="home" />
      <Tabs.Screen name="stats" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
