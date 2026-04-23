import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const PERSIST_NAME = 'streamlist-recent-searches';

type PersistedSlice = Pick<RecentSearchesState, 'terms'>;

export interface RecentSearchesState {
  terms: string[];
  /** True after rehydration from AsyncStorage completes. */
  hydrated: boolean;
  addTerm: (term: string) => void;
  clearAll: () => void;
}

const jsonStorage = createJSONStorage<PersistedSlice>(() => AsyncStorage);

export const useRecentSearchesStore = create<RecentSearchesState>()(
  persist(
    (set, get) => ({
      terms: [],
      hydrated: false,
      addTerm: (term) => {
        const t = term.trim();
        if (t.length === 0) {
          return;
        }
        const lower = t.toLowerCase();
        const withoutDup = get().terms.filter(
          (x) => x.toLowerCase() !== lower,
        );
        const next = [t, ...withoutDup].slice(0, 5);
        set({ terms: next });
      },
      clearAll: () => {
        set({ terms: [] });
      },
    }),
    {
      name: PERSIST_NAME,
      storage: jsonStorage,
      partialize: (state) => ({ terms: state.terms }),
      merge: (persisted, current) => {
        const p = persisted as Partial<PersistedSlice> | undefined;
        const raw = p?.terms;
        const terms = Array.isArray(raw)
          ? raw.filter((x): x is string => typeof x === 'string')
          : current.terms;
        return { ...current, terms };
      },
      onRehydrateStorage: () => {
        return () => {
          useRecentSearchesStore.setState({ hydrated: true });
        };
      },
    },
  ),
);
