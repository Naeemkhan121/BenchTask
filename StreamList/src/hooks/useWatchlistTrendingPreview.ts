import { useCallback, useEffect, useState } from 'react';
import { fetchTrendingMoviesPage, mapMoviesPage } from '../api/movies';
import type { MovieSummary } from '../api/types';

export type TrendingPreviewStatus = 'loading' | 'success' | 'error';

export interface UseWatchlistTrendingPreviewResult {
  status: TrendingPreviewStatus;
  movies: MovieSummary[];
  error: string | null;
  retry: () => void;
}

export function useWatchlistTrendingPreview(
  enabled: boolean,
): UseWatchlistTrendingPreviewResult {
  const [status, setStatus] = useState<TrendingPreviewStatus>(
    enabled ? 'loading' : 'success',
  );
  const [movies, setMovies] = useState<MovieSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!enabled) {
      setMovies([]);
      setStatus('success');
      setError(null);
      return;
    }
    setStatus('loading');
    setError(null);
    fetchTrendingMoviesPage(1)
      .then((page) => {
        setMovies(mapMoviesPage(page));
        setStatus('success');
      })
      .catch((e: unknown) => {
        setMovies([]);
        setError(e instanceof Error ? e.message : 'Something went wrong');
        setStatus('error');
      });
  }, [enabled]);

  useEffect(() => {
    load();
  }, [load]);

  const retry = useCallback(() => {
    load();
  }, [load]);

  return {
    status,
    movies,
    error,
    retry,
  };
}
