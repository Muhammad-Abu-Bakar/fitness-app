// === NEW ===
// context/checkIn.tsx
//
// Tracks weekly weight check-ins.
//
// AsyncStorage key:
//   checkIn:entries → array of all CheckIn records
//
// Same pattern as workoutLog.tsx: load on mount with an isLoaded flag,
// persist on every change, skip the persist effect until loaded so we
// don't overwrite stored data with empty state on first render.

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CheckIn } from '../lib/checkIns/types';

const ENTRIES_KEY = 'checkIn:entries';

interface CheckInContextValue {
  // ---- State ----
  checkIns: CheckIn[];
  isLoaded: boolean;

  // ---- Actions ----
  addCheckIn: (date: string, weightLbs: number, notes?: string) => void;
  deleteCheckIn: (id: string) => void;
}

const CheckInContext = createContext<CheckInContextValue | null>(null);

export function CheckInProvider({ children }: { children: ReactNode }) {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // ---- Load on mount ----
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(ENTRIES_KEY);
        if (raw) setCheckIns(JSON.parse(raw));
      } catch (err) {
        console.warn('Failed to load check-ins:', err);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  // ---- Persist on change ----
  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(checkIns)).catch((err) =>
      console.warn('Failed to save check-ins:', err),
    );
  }, [checkIns, isLoaded]);

  // ---- Actions ----

  function addCheckIn(date: string, weightLbs: number, notes?: string) {
    const entry: CheckIn = {
      id: `checkin_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      date,
      weightLbs,
      // Trim notes and treat empty string as "no notes" so we don't store junk.
      notes: notes?.trim() ? notes.trim() : undefined,
      timestamp: Date.now(),
    };
    setCheckIns((prev) => [entry, ...prev]);
  }

  function deleteCheckIn(id: string) {
    setCheckIns((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <CheckInContext.Provider value={{ checkIns, isLoaded, addCheckIn, deleteCheckIn }}>
      {children}
    </CheckInContext.Provider>
  );
}

export function useCheckIn() {
  const ctx = useContext(CheckInContext);
  if (!ctx) {
    throw new Error('useCheckIn must be used inside a CheckInProvider');
  }
  return ctx;
}
