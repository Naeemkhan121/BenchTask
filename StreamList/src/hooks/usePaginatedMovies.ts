import { useCallback, useEffect, useRef, useState } from 'react';
import {
  fetchDiscoverMoviesPage,
  fetchSimilarMoviesPage,
  fetchTopRatedMoviesPage,
  fetchTrendingMoviesPage,
  mapMoviesPage,
} from '../api/movies';
import type { MovieSummary, PaginatedMoviesResponse } from '../api/types';

export type PaginatedRowSource =
  | 'trending'
  | 'top_rated'
  | 'discover'
  | 'similar';

export interface UsePaginatedMoviesResult {
  movies: MovieSummary[];
  isInitialLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  retry: () => void;
  loadMore: () => void;
  /** Call from horizontal list when the last visible item index is known (e.g. onViewableItemsChanged). */
  onLastVisibleIndex: (lastVisibleIndex: number) => void;
}

function fetchPageForSource(
  source: PaginatedRowSource,
  genreId: number | null,
  page: number,
  similarMovieId: string | null,
): Promise<PaginatedMoviesResponse> {
  switch (source) {
    case 'trending':
      if (genreId !== null) {
        return fetchDiscoverMoviesPage(page, genreId, {
          sortBy: 'popularity.desc',
        });
      }
      return fetchTrendingMoviesPage(page);
    case 'top_rated':
      if (genreId !== null) {
        return fetchDiscoverMoviesPage(page, genreId, {
          sortBy: 'vote_average.desc',
          voteCountGte: 200,
        });
      }
      return fetchTopRatedMoviesPage(page);
    case 'discover':
      return fetchDiscoverMoviesPage(page, genreId);
    case 'similar':
      if (similarMovieId === null || similarMovieId.length === 0) {
        return Promise.reject(new Error('movieId is required for similar'));
      }
      return fetchSimilarMoviesPage(similarMovieId, page);
  }
}

/**
 * Independent paginated row: resets when `listKey` changes (e.g. genre chip).
 * Loads more when the user scrolls within 3 items of the end (`onLastVisibleIndex`).
 */
export function usePaginatedMovies(
  listKey: string,
  source: PaginatedRowSource,
  genreId: number | null,
  /** Required when `source` is `similar`. */
  similarMovieId?: string | null,
): UsePaginatedMoviesResult {
  const [movies, setMovies] = useState<MovieSummary[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const pageRef = useRef(0);
  const loadingMoreRef = useRef(false);

  const hasMore = page > 0 && page < totalPages;

  const runInitial = useCallback(async () => {
    setIsInitialLoading(true);
    setError(null);
    setMovies([]);
    setPage(0);
    pageRef.current = 0;
    setTotalPages(1);
    loadingMoreRef.current = false;
    if (
      source === 'similar' &&
      (similarMovieId === null ||
        similarMovieId === undefined ||
        similarMovieId.length === 0)
    ) {
      setError('Unable to load similar titles.');
      setIsInitialLoading(false);
      return;
    }
    try {
      const data = await fetchPageForSource(
        source,
        genreId,
        1,
        similarMovieId ?? null,
      );
      setMovies(mapMoviesPage(data));
      setPage(1);
      pageRef.current = 1;
      setTotalPages(data.total_pages);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setIsInitialLoading(false);
    }
  }, [genreId, similarMovieId, source]);

  useEffect(() => {
    runInitial().catch(() => {
      /* error surfaced via state */
    });
  }, [listKey, runInitial]);

  const loadMore = useCallback(async () => {
    if (isInitialLoading || loadingMoreRef.current) {
      return;
    }
    const currentPage = pageRef.current;
    if (currentPage >= totalPages) {
      return;
    }
    loadingMoreRef.current = true;
    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const data = await fetchPageForSource(
        source,
        genreId,
        nextPage,
        similarMovieId ?? null,
      );
      setMovies((prev) => {
        const seen = new Set(prev.map((m) => m.id));
        const next = [...prev];
        for (const m of mapMoviesPage(data)) {
          if (!seen.has(m.id)) {
            seen.add(m.id);
            next.push(m);
          }
        }
        return next;
      });
      setPage(nextPage);
      pageRef.current = nextPage;
      setTotalPages(data.total_pages);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      loadingMoreRef.current = false;
      setIsLoadingMore(false);
    }
  }, [genreId, isInitialLoading, similarMovieId, source, totalPages]);

  const onLastVisibleIndex = useCallback(
    (lastVisibleIndex: number) => {
      if (movies.length === 0 || isInitialLoading) {
        return;
      }
      const thresholdIndex = Math.max(0, movies.length - 4);
      if (lastVisibleIndex >= thresholdIndex) {
        loadMore().catch(() => {
          /* error surfaced via state */
        });
      }
    },
    [isInitialLoading, loadMore, movies.length],
  );

  const retry = useCallback(() => {
    runInitial().catch(() => {
      /* error surfaced via state */
    });
  }, [runInitial]);

  return {
    movies,
    isInitialLoading,
    isLoadingMore,
    error,
    hasMore,
    retry,
    loadMore,
    onLastVisibleIndex,
  };
}
