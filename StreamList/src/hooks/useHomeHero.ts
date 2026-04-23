import { useCallback, useEffect, useState } from 'react';
import {
  fetchHeroFromDiscoverGenre,
  fetchHeroFromTrending,
} from '../api/movies';
import type { MovieSummary } from '../api/types';

export interface UseHomeHeroResult {
  movie: MovieSummary | null;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

/**
 * @param genreId - When set, hero is the top popular title in that genre; otherwise global trending.
 */
export function useHomeHero(genreId: number | null): UseHomeHeroResult {
  const [movie, setMovie] = useState<MovieSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const next =
        genreId === null
          ? await fetchHeroFromTrending()
          : await fetchHeroFromDiscoverGenre(genreId);
      setMovie(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [genreId]);

  useEffect(() => {
    load().catch(() => {
      /* error surfaced via state */
    });
  }, [load]);

  return { movie, isLoading, error, retry: load };
}
