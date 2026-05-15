// === NEW ===
// context/workoutLog.tsx
//
// Tracks workout sessions and the currently-active session.
//
// Two AsyncStorage keys:
//   workoutLog:sessions      → all completed sessions (history, used Day 16)
//   workoutLog:activeSession → in-progress session (cleared when finished/cancelled)
//
// The active session is persisted so the user can close the app mid-workout
// and resume exactly where they were.

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LoggedSet, WorkoutSession } from '../lib/workouts/types';

const SESSIONS_KEY = 'workoutLog:sessions';
const ACTIVE_KEY = 'workoutLog:activeSession';

interface WorkoutLogContextValue {
  // ---- State ----
  activeSession: WorkoutSession | null;
  sessions: WorkoutSession[];
  isLoaded: boolean;

  // ---- Actions ----
  startSession: (programId: string, dayId: string) => void;
  cancelActiveSession: () => void;
  logSet: (
    exerciseId: string,
    setNumber: number,
    weightLbs: number,
    reps: number,
  ) => void;
  finishSession: () => void;
  getSetsForExercise: (exerciseId: string) => LoggedSet[];
}

const WorkoutLogContext = createContext<WorkoutLogContextValue | null>(null);

// Tiny local helper — avoids cross-context dependency on foodLog.
function todayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function WorkoutLogProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // ---- Load on mount ----
  useEffect(() => {
    (async () => {
      try {
        const [sessionsRaw, activeRaw] = await Promise.all([
          AsyncStorage.getItem(SESSIONS_KEY),
          AsyncStorage.getItem(ACTIVE_KEY),
        ]);
        if (sessionsRaw) setSessions(JSON.parse(sessionsRaw));
        if (activeRaw) setActiveSession(JSON.parse(activeRaw));
      } catch (err) {
        console.warn('Failed to load workout log:', err);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  // ---- Persist completed sessions ----
  // Skipped until isLoaded so we don't overwrite stored data with empty state on first render.
  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions)).catch(err =>
      console.warn('Failed to save sessions:', err),
    );
  }, [sessions, isLoaded]);

  // ---- Persist active session (or remove the key when there isn't one) ----
  useEffect(() => {
    if (!isLoaded) return;
    if (activeSession) {
      AsyncStorage.setItem(ACTIVE_KEY, JSON.stringify(activeSession)).catch(err =>
        console.warn('Failed to save active session:', err),
      );
    } else {
      AsyncStorage.removeItem(ACTIVE_KEY).catch(() => {});
    }
  }, [activeSession, isLoaded]);

  // ---- Actions ----

  function startSession(programId: string, dayId: string) {
    const session: WorkoutSession = {
      id: `session_${Date.now()}`,
      programId,
      dayId,
      date: todayDateString(),
      startedAt: Date.now(),
      completedAt: null,
      sets: [],
    };
    setActiveSession(session);
  }

  function cancelActiveSession() {
    setActiveSession(null);
  }

  function logSet(
    exerciseId: string,
    setNumber: number,
    weightLbs: number,
    reps: number,
  ) {
    setActiveSession(prev => {
      if (!prev) return prev;
      const newSet: LoggedSet = {
        id: `set_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        exerciseId,
        setNumber,
        weightLbs,
        reps,
        timestamp: Date.now(),
      };
      return { ...prev, sets: [...prev.sets, newSet] };
    });
  }

  function finishSession() {
    setActiveSession(prev => {
      if (!prev) return prev;
      const finished: WorkoutSession = { ...prev, completedAt: Date.now() };
      setSessions(s => [finished, ...s]); // newest first
      return null;
    });
  }

  function getSetsForExercise(exerciseId: string): LoggedSet[] {
    if (!activeSession) return [];
    return activeSession.sets
      .filter(s => s.exerciseId === exerciseId)
      .sort((a, b) => a.setNumber - b.setNumber);
  }

  return (
    <WorkoutLogContext.Provider
      value={{
        activeSession,
        sessions,
        isLoaded,
        startSession,
        cancelActiveSession,
        logSet,
        finishSession,
        getSetsForExercise,
      }}
    >
      {children}
    </WorkoutLogContext.Provider>
  );
}

export function useWorkoutLog() {
  const ctx = useContext(WorkoutLogContext);
  if (!ctx) {
    throw new Error('useWorkoutLog must be used inside a WorkoutLogProvider');
  }
  return ctx;
}