import type { WatchlistItem } from '../src/api/types';
import {
  anchorItemForBecauseYouSaved,
  filterWatchlistItems,
  normalizeWatchlistItem,
} from '../src/utils/watchlistItem';

function baseSummary(id: string): WatchlistItem {
  return {
    id,
    title: 'T',
    overview: '',
    poster_path: null,
    backdrop_path: null,
    vote_average: 7,
    media_type: 'movie',
    release_date: '2020-01-01',
    genre_names: ['Action'],
    savedAt: 0,
  };
}

describe('normalizeWatchlistItem', () => {
  it('fills defaults for legacy rows', () => {
    const raw = {
      id: '1',
      title: 'Old',
      overview: '',
      poster_path: null,
      backdrop_path: null,
      vote_average: 8,
    };
    const out = normalizeWatchlistItem(raw, 0, 1);
    expect(out.media_type).toBe('movie');
    expect(out.genre_names).toEqual([]);
    expect(out.release_date).toBeNull();
    expect(typeof out.savedAt).toBe('number');
  });
});

describe('filterWatchlistItems', () => {
  const a: WatchlistItem = {
    ...baseSummary('a'),
    media_type: 'movie',
  };
  const b: WatchlistItem = {
    ...baseSummary('b'),
    media_type: 'tv',
  };

  it('returns all for filter all', () => {
    expect(filterWatchlistItems([a, b], 'all')).toHaveLength(2);
  });

  it('filters movies', () => {
    expect(filterWatchlistItems([a, b], 'movies')).toEqual([a]);
  });

  it('filters series', () => {
    expect(filterWatchlistItems([a, b], 'series')).toEqual([b]);
  });
});

describe('anchorItemForBecauseYouSaved', () => {
  it('returns null for empty list', () => {
    expect(anchorItemForBecauseYouSaved([])).toBeNull();
  });

  it('picks highest savedAt', () => {
    const older: WatchlistItem = { ...baseSummary('1'), savedAt: 100 };
    const newer: WatchlistItem = { ...baseSummary('2'), savedAt: 500 };
    expect(anchorItemForBecauseYouSaved([older, newer])?.id).toBe('2');
  });
});
