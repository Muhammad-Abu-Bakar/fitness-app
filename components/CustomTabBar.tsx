// === NEW === Bulkify redesign step 5: custom bottom tab bar.
// 4 real route tabs (workouts, home, stats, profile) plus a 5th FAB-style
// "+" button in the middle that opens the QuickAddSheet (not a real route).
// Active tab gets a thin cyan indicator line above its icon (matches Image 2).

import React, { useState } from 'react';
import { View, Pressable, StyleSheet, Platform } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Dumbbell, LayoutGrid, BarChart3, User, Plus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, dualGradient } from '../theme';
import { tapLight, tapMedium } from '../lib/haptics';
import { QuickAddSheet } from './QuickAddSheet';

type TabName = 'workouts' | 'home' | 'stats' | 'profile';

const TAB_CONFIG: Record<TabName, { icon: typeof Dumbbell }> = {
  workouts: { icon: Dumbbell },
  home: { icon: LayoutGrid },
  stats: { icon: BarChart3 },
  profile: { icon: User },
};

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  // Render one of the 4 real tabs by route name. Looks up its index in state
  // to determine focus.
  const renderTab = (name: TabName) => {
    const routeIndex = state.routes.findIndex(r => r.name === name);
    if (routeIndex === -1) return null;

    const route = state.routes[routeIndex];
    const focused = state.index === routeIndex;
    const Icon = TAB_CONFIG[name].icon;

    return (
      <Pressable
        key={name}
        style={styles.tabButton}
        onPress={() => {
          tapLight();
          if (!focused) navigation.navigate(route.name);
        }}
      >
        {focused && <View style={styles.activeIndicator} />}
        <Icon
          size={24}
          color={focused ? colors.textPrimary : colors.textTertiary}
          strokeWidth={1.6}
        />
      </Pressable>
    );
  };

  return (
    <>
      <View style={styles.tabBar}>
        {renderTab('workouts')}
        {renderTab('home')}

        {/* The "+" button — NOT a route. Renders raised, with dual gradient fill. */}
        <View style={styles.plusSlot}>
          <Pressable
            style={styles.plusButton}
            onPress={() => {
              tapMedium();
              setShowQuickAdd(true);
            }}
          >
            <LinearGradient
              colors={dualGradient.colors}
              start={dualGradient.start}
              end={dualGradient.end}
              style={styles.plusGradient}
            >
              <Plus size={26} color={colors.backgroundSolid} strokeWidth={3} />
            </LinearGradient>
          </Pressable>
        </View>

        {renderTab('stats')}
        {renderTab('profile')}
      </View>

      <QuickAddSheet visible={showQuickAdd} onClose={() => setShowQuickAdd(false)} />
    </>
  );
}

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 88 : 68;
const BOTTOM_INSET = Platform.OS === 'ios' ? 24 : 0;

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: TAB_BAR_HEIGHT,
    paddingBottom: BOTTOM_INSET,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0A0C',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    top: 8,
    width: 28,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#22D3EE', // cyan accent, matches Image 2's indicator
  },
  plusSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  plusButton: {
    marginTop: -18, // raise the + above the tab bar baseline
  },
  plusGradient: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
