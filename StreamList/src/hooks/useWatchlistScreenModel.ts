import { useMemo, useState } from 'react';
import type { WatchlistItem } from '../api/types';
import {
  anchorItemForBecauseYouSaved,
  filterWatchlistItems,
  type WatchlistFilter,
} from '../utils/watchlistItem';

export interface UseWatchlistScreenModelResult {
  filter: WatchlistFilter;
  setFilter: (f: WatchlistFilter) => void;
  filteredItems: WatchlistItem[];
  anchorForBecauseYouSaved: WatchlistItem | null;
}

export function useWatchlistScreenModel(
  items: WatchlistItem[],
): UseWatchlistScreenModelResult {
  const [filter, setFilter] = useState<WatchlistFilter>('all');

  const filteredItems = useMemo(
    () => filterWatchlistItems(items, filter),
    [items, filter],
  );

  const anchorForBecauseYouSaved = useMemo(
    () => anchorItemForBecauseYouSaved(items),
    [items],
  );

  return {
    filter,
    setFilter,
    filteredItems,
    anchorForBecauseYouSaved,
  };
}
