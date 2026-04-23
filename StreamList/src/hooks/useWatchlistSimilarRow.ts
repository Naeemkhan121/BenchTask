import { useCallback, useEffect, useState } from 'react';
import { fetchSimilarMoviesPage, mapMoviesPage } from '../api/movies';
import type { MovieSummary } from '../api/types';

export type SimilarRowStatus = 'idle' | 'loading' | 'success' | 'error';

export interface UseWatchlistSimilarRowResult {
  status: SimilarRowStatus;
  movies: MovieSummary[];
  error: string | null;
  retry: () => void;
}

export function useWatchlistSimilarRow(
  anchorMovieId: string | null,
): UseWatchlistSimilarRowResult {
  const [status, setStatus] = useState<SimilarRowStatus>('idle');
  const [movies, setMovies] = useState<MovieSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (anchorMovieId === null || anchorMovieId.length === 0) {
      setStatus('idle');
      setMovies([]);
      setError(null);
      return;
    }
    setStatus('loading');
    setError(null);
    fetchSimilarMoviesPage(anchorMovieId, 1)
      .then((page) => {
        setMovies(mapMoviesPage(page));
        setStatus('success');
      })
      .catch((e: unknown) => {
        setMovies([]);
        setError(e instanceof Error ? e.message : 'Something went wrong');
        setStatus('error');
      });
  }, [anchorMovieId]);

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
