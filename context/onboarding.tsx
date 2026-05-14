// === NEW === shared state for the onboarding flow — read/written across screens
import { createContext, useContext, useState, ReactNode } from 'react';

export type Goal = 'bulk' | 'lean' | 'exploring';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active';

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
  setGoal: (g: Goal) => void;
  setStats: (s: StatsInput) => void;
  setActivityLevel: (a: ActivityLevel) => void;
  setTargetWeight: (w: number) => void;
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

  const value: OnboardingContextValue = {
    ...state,
    setGoal: (goal) => setState(s => ({ ...s, goal })),
    setStats: ({ weightLbs, heightFt, heightIn, age }) =>
      setState(s => ({ ...s, weightLbs, heightFt, heightIn, age })),
    setActivityLevel: (activityLevel) => setState(s => ({ ...s, activityLevel })),
    setTargetWeight: (targetWeightLbs) => setState(s => ({ ...s, targetWeightLbs })),
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

// === NEW === custom hook — any screen calls useOnboarding() to read or update
export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used inside OnboardingProvider');
  return ctx;
}