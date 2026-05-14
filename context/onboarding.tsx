// === CHANGED === full rewrite — adds persistence, loaded flag, and reset
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// === NEW === storage import
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Goal = 'bulk' | 'lean' | 'exploring';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active';

// === NEW === one storage key, easy to find
const STORAGE_KEY = '@fitness_app:onboarding';

type OnboardingState = {
  goal: Goal | null;
  weightLbs: number | null;
  heightFt: number | null;
  heightIn: number | null;
  age: number | null;
  activityLevel: ActivityLevel | null;
  targetWeightLbs: number | null;
};

type StatsInput = { weightLbs: number; heightFt: number; heightIn: number; age: number };

type OnboardingContextValue = OnboardingState & {
  // === NEW === lets UI wait for storage load before rendering
  loaded: boolean;
  setGoal: (g: Goal) => void;
  setStats: (s: StatsInput) => void;
  setActivityLevel: (a: ActivityLevel) => void;
  setTargetWeight: (w: number) => void;
  // === NEW === wipes everything (used by settings → reset profile)
  reset: () => void;
};

const initialState: OnboardingState = {
  goal: null,
  weightLbs: null,
  heightFt: null,
  heightIn: null,
  age: null,
  activityLevel: null,
  targetWeightLbs: null,
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>(initialState);
  // === NEW === tracks whether initial AsyncStorage read is finished
  const [loaded, setLoaded] = useState(false);

  // === NEW === load saved state on mount
  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored !== null) {
          setState(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to load onboarding state:', e);
      } finally {
        setLoaded(true);
      }
    };
    load();
  }, []);

  // === NEW === save state whenever it changes (but not before initial load completes)
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(e =>
      console.error('Failed to save onboarding state:', e)
    );
  }, [state, loaded]);

  const value: OnboardingContextValue = {
    ...state,
    loaded,
    setGoal: (goal) => setState(s => ({ ...s, goal })),
    setStats: ({ weightLbs, heightFt, heightIn, age }) =>
      setState(s => ({ ...s, weightLbs, heightFt, heightIn, age })),
    setActivityLevel: (activityLevel) => setState(s => ({ ...s, activityLevel })),
    setTargetWeight: (targetWeightLbs) => setState(s => ({ ...s, targetWeightLbs })),
    reset: () => setState(initialState),
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used inside OnboardingProvider');
  return ctx;
}