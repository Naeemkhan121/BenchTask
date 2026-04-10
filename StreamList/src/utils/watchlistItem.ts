import type {
  MovieDetail,
  MovieSummary,
  WatchlistItem,
  WatchlistMediaType,
} from '../api/types';

/** Legacy persisted shape before WatchlistItem fields existed. */
type LegacyWatchlistRow = MovieSummary & {
  media_type?: WatchlistMediaType;
  release_date?: string | null;
  genre_names?: string[];
  savedAt?: number;
};

function genreNamesFromMovie(m: MovieSummary | MovieDetail): string[] {
  if ('genres' in m && Array.isArray(m.genres)) {
    return m.genres.map((g) => g.name);
  }
  return [];
}

function releaseDateFromMovie(m: MovieSummary | MovieDetail): string | null {
  if ('release_date' in m) {
    return m.release_date ?? null;
  }
  return null;
}

export function toWatchlistItem(
  m: MovieSummary | MovieDetail,
  mediaType: WatchlistMediaType = 'movie',
): WatchlistItem {
  return {
    id: m.id,
    title: m.title,
    overview: m.overview,
    poster_path: m.poster_path,
    backdrop_path: m.backdrop_path,
    vote_average: m.vote_average,
    media_type: mediaType,
    release_date: releaseDateFromMovie(m),
    genre_names: genreNamesFromMovie(m),
    savedAt: Date.now(),
  };
}

/**
 * Ensures a persisted row has full WatchlistItem fields (migration + in-flight safety).
 */
export function normalizeWatchlistItem(
  raw: LegacyWatchlistRow,
  index: number,
  length: number,
): WatchlistItem {
  const base: WatchlistItem = {
    id: raw.id,
    title: raw.title,
    overview: raw.overview,
    poster_path: raw.poster_path,
    backdrop_path: raw.backdrop_path,
    vote_average: raw.vote_average,
    media_type: raw.media_type ?? 'movie',
    release_date: raw.release_date ?? null,
    genre_names: Array.isArray(raw.genre_names) ? raw.genre_names : [],
    savedAt:
      typeof raw.savedAt === 'number'
        ? raw.savedAt
        : Date.now() - (length - 1 - index) * 1000,
  };
  return base;
}

export function releaseYear(releaseDate: string | null): string | null {
  if (releaseDate === null || releaseDate.length < 4) {
    return null;
  }
  return releaseDate.slice(0, 4);
}

export function formatGenreSubtitle(names: string[], maxNames = 2): string {
  if (names.length === 0) {
    return '';
  }
  return names.slice(0, maxNames).join(', ');
}

export type WatchlistFilter = 'all' | 'movies' | 'series';

export function filterWatchlistItems(
  items: WatchlistItem[],
  filter: WatchlistFilter,
): WatchlistItem[] {
  if (filter === 'all') {
    return items;
  }
  if (filter === 'movies') {
    return items.filter((i) => i.media_type === 'movie');
  }
  return items.filter((i) => i.media_type === 'tv');
}

export function anchorItemForBecauseYouSaved(
  items: WatchlistItem[],
): WatchlistItem | null {
  if (items.length === 0) {
    return null;
  }
  let best = items[0];
  for (let i = 1; i < items.length; i += 1) {
    const cur = items[i];
    if (cur !== undefined && cur.savedAt >= best.savedAt) {
      best = cur;
    }
  }
  return best ?? null;
}
