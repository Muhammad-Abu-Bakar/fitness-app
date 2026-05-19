// === CHANGED === added sex field (used by Profile avatar)
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Goal = 'bulk' | 'lean' | 'exploring';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active';
export type Sex = 'male' | 'female'; // === NEW ===

const STORAGE_KEY = '@fitness_app:onboarding';

type OnboardingState = {
  goal: Goal | null;
  weightLbs: number | null;
  heightFt: number | null;
  heightIn: number | null;
  age: number | null;
  activityLevel: ActivityLevel | null;
  targetWeightLbs: number | null;
  sex: Sex | null; // === NEW ===
};

type StatsInput = { weightLbs: number; heightFt: number; heightIn: number; age: number };

type OnboardingContextValue = OnboardingState & {
  loaded: boolean;
  setGoal: (g: Goal) => void;
  setStats: (s: StatsInput) => void;
  setActivityLevel: (a: ActivityLevel) => void;
  setTargetWeight: (w: number) => void;
  setSex: (s: Sex) => void; // === NEW ===
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
  sex: null, // === NEW ===
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>(initialState);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored !== null) {
          // === CHANGED === merge with initialState so old saves without `sex` get null default
          setState({ ...initialState, ...JSON.parse(stored) });
        }
      } catch (e) {
        console.error('Failed to load onboarding state:', e);
      } finally {
        setLoaded(true);
      }
    };
    load();
  }, []);

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
    setSex: (sex) => setState(s => ({ ...s, sex })), // === NEW ===
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
