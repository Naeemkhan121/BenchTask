import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { StateStorage } from 'zustand/middleware';
import type { MovieDetail, MovieSummary, WatchlistItem } from '../api/types';
import { showWatchlistErrorToast } from '../utils/toast';
import {
  normalizeWatchlistItem,
  toWatchlistItem,
} from '../utils/watchlistItem';

const PERSIST_NAME = 'streamlist-watchlist';

/** Rollback for the next persist `setItem` failure (optimistic remove). */
let pendingPersistRollback: (() => void) | null = null;

type LegacyWatchlistRow = MovieSummary & {
  media_type?: WatchlistItem['media_type'];
  release_date?: string | null;
  genre_names?: string[];
  savedAt?: number;
};

type PersistedSlice = Pick<WatchlistState, 'items'>;

const rollbackAwareStateStorage: StateStorage = {
  getItem: (name) => AsyncStorage.getItem(name),
  setItem: (name, value) => {
    const result = AsyncStorage.setItem(name, value);
    return Promise.resolve(result).then(
      () => {
        pendingPersistRollback = null;
      },
      () => {
        const rollback = pendingPersistRollback;
        pendingPersistRollback = null;
        rollback?.();
        showWatchlistErrorToast();
      },
    );
  },
  removeItem: (name) => AsyncStorage.removeItem(name),
};

const jsonStorage = createJSONStorage<PersistedSlice>(
  () => rollbackAwareStateStorage,
);

if (jsonStorage === undefined) {
  throw new Error('Watchlist persist storage is unavailable');
}

export interface WatchlistState {
  items: WatchlistItem[];
  /** True after persist rehydration from AsyncStorage completes. */
  hydrated: boolean;
  add: (movie: MovieSummary | MovieDetail) => void;
  remove: (movieId: string) => void;
  toggle: (movie: MovieSummary | MovieDetail) => void;
  isInWatchlist: (movieId: string) => boolean;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      items: [],
      hydrated: false,
      add: (movie) => {
        const item = toWatchlistItem(movie, 'movie');
        set((s) => {
          if (s.items.some((i) => i.id === item.id)) {
            return s;
          }
          return { items: [...s.items, item] };
        });
      },
      remove: (movieId) => {
        const prev = get().items;
        pendingPersistRollback = () => {
          set({ items: prev });
        };
        set({
          items: prev.filter((i) => i.id !== movieId),
        });
      },
      toggle: (movie) => {
        const { items } = get();
        const exists = items.some((i) => i.id === movie.id);
        if (exists) {
          const prev = get().items;
          pendingPersistRollback = () => {
            set({ items: prev });
          };
          set({
            items: prev.filter((i) => i.id !== movie.id),
          });
        } else {
          const item = toWatchlistItem(movie, 'movie');
          set({ items: [...items, item] });
        }
      },
      isInWatchlist: (movieId) => get().items.some((i) => i.id === movieId),
    }),
    {
      name: PERSIST_NAME,
      storage: jsonStorage,
      partialize: (state) => ({ items: state.items }),
      merge: (persistedState, currentState) => {
        const p = persistedState as Partial<PersistedSlice> | undefined;
        const rawItems = p?.items;
        if (!Array.isArray(rawItems)) {
          return currentState;
        }
        const items = rawItems.map((it, idx, arr) =>
          normalizeWatchlistItem(it as LegacyWatchlistRow, idx, arr.length),
        );
        return {
          ...currentState,
          items,
        };
      },
      onRehydrateStorage: () => {
        return () => {
          useWatchlistStore.setState({ hydrated: true });
        };
      },
    },
  ),
);
