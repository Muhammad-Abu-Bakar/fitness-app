// === NEW === food log state — date-indexed entries, persisted across restarts
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@fitness_app:foodLog';

export type FoodEntry = {
  id: string;
  date: string;       // YYYY-MM-DD (local timezone)
  name: string;
  calories: number;
  protein: number;
  createdAt: number;  // ms timestamp — used for sort order within a day
};

// === NEW === local-date string helper (used across the app for "today")
export function getTodayDateString(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

type AddEntryInput = Omit<FoodEntry, 'id' | 'createdAt'>;

type FoodLogContextValue = {
  entries: FoodEntry[];
  loaded: boolean;
  addEntry: (entry: AddEntryInput) => void;
  deleteEntry: (id: string) => void;
  getEntriesForDate: (date: string) => FoodEntry[];
  getTotalsForDate: (date: string) => { calories: number; protein: number };
};

const FoodLogContext = createContext<FoodLogContextValue | null>(null);

export function FoodLogProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load on mount
  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored !== null) setEntries(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load food log:', e);
      } finally {
        setLoaded(true);
      }
    };
    load();
  }, []);

  // Save on change (after initial load)
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries)).catch(e =>
      console.error('Failed to save food log:', e)
    );
  }, [entries, loaded]);

  const addEntry: FoodLogContextValue['addEntry'] = (entry) => {
    const newEntry: FoodEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };
    setEntries(prev => [newEntry, ...prev]);
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const getEntriesForDate = (date: string) =>
    entries.filter(e => e.date === date);

  const getTotalsForDate = (date: string) =>
    entries
      .filter(e => e.date === date)
      .reduce(
        (acc, e) => ({ calories: acc.calories + e.calories, protein: acc.protein + e.protein }),
        { calories: 0, protein: 0 }
      );

  return (
    <FoodLogContext.Provider value={{ entries, loaded, addEntry, deleteEntry, getEntriesForDate, getTotalsForDate }}>
      {children}
    </FoodLogContext.Provider>
  );
}

export function useFoodLog() {
  const ctx = useContext(FoodLogContext);
  if (!ctx) throw new Error('useFoodLog must be used inside FoodLogProvider');
  return ctx;
}