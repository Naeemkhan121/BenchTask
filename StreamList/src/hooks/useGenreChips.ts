import { useCallback, useEffect, useState } from 'react';
import { fetchGenreChips, type GenreChip } from '../api/movies';

export interface UseGenreChipsResult {
  chips: GenreChip[];
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

export function useGenreChips(): UseGenreChipsResult {
  const [chips, setChips] = useState<GenreChip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const next = await fetchGenreChips();
      setChips(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load().catch(() => {
      /* error surfaced via state */
    });
  }, [load]);

  return { chips, isLoading, error, retry: load };
}
