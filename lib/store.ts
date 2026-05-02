import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Entry {
  id: string;
  date: string; // YYYY-MM-DD
  highlight1: string;
  highlight2?: string;
  photoUri?: string;
  prompt: string;
  createdAt: string;
}

interface AppState {
  entries: Entry[];
  isHydrated: boolean;
  addEntry: (entry: Omit<Entry, 'id' | 'createdAt'>) => void;
  updateEntry: (id: string, updates: Partial<Entry>) => void;
  deleteEntry: (id: string) => void;
  getEntryByDate: (date: string) => Entry | undefined;
  getTodayEntry: () => Entry | undefined;
  getStreak: () => number;
  getMemoriesForToday: () => Entry[];
  hydrate: () => Promise<void>;
}

const STORAGE_KEY = 'dayloom_entries';

const generateId = () =>
  Math.random().toString(36).substring(2) + Date.now().toString(36);

const getTodayStr = () => new Date().toISOString().split('T')[0];

export const useStore = create<AppState>((set, get) => ({
  entries: [],
  isHydrated: false,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const entries = JSON.parse(raw) as Entry[];
        set({ entries, isHydrated: true });
      } else {
        set({ isHydrated: true });
      }
    } catch (_e) {
      set({ isHydrated: true });
    }
  },

  addEntry: (entryData) => {
    const newEntry: Entry = {
      ...entryData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    set((state) => {
      const entries = [newEntry, ...state.entries];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      return { entries };
    });
  },

  updateEntry: (id, updates) => {
    set((state) => {
      const entries = state.entries.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      );
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      return { entries };
    });
  },

  deleteEntry: (id) => {
    set((state) => {
      const entries = state.entries.filter((e) => e.id !== id);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      return { entries };
    });
  },

  getEntryByDate: (date) => {
    return get().entries.find((e) => e.date === date);
  },

  getTodayEntry: () => {
    return get().entries.find((e) => e.date === getTodayStr());
  },

  getStreak: () => {
    const { entries } = get();
    if (!entries.length) return 0;
    const sorted = [...entries].sort((a, b) =>
      b.date.localeCompare(a.date)
    );
    let streak = 0;
    let current = new Date();
    current.setHours(0, 0, 0, 0);

    // Check today or yesterday to start streak
    const todayStr = getTodayStr();
    const yesterday = new Date(current);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const hasTodayEntry = sorted[0]?.date === todayStr;
    const hasYesterdayEntry = sorted[0]?.date === yesterdayStr;

    if (!hasTodayEntry && !hasYesterdayEntry) return 0;

    let checkDate = hasTodayEntry ? new Date() : yesterday;
    checkDate.setHours(0, 0, 0, 0);

    for (const entry of sorted) {
      const entryDate = new Date(entry.date + 'T12:00:00');
      entryDate.setHours(0, 0, 0, 0);
      if (entryDate.getTime() === checkDate.getTime()) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  },

  getMemoriesForToday: () => {
    const today = new Date();
    const monthDay = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const currentYear = today.getFullYear();
    return get().entries.filter((e) => {
      const [year, rest] = e.date.split('-');
      const entryMonthDay = rest + '-' + e.date.split('-')[2];
      const entryMD = e.date.substring(5); // MM-DD
      return entryMD === monthDay && parseInt(year) < currentYear;
    });
  },
}));
