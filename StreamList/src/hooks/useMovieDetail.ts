import { useCallback, useEffect, useState } from 'react';
import {
  fetchMovieById,
  fetchMovieCredits,
  fetchSimilarMoviesPage,
  mapMoviesPage,
} from '../api/movies';
import type { CastMember, MovieDetail, MovieSummary } from '../api/types';

export type SectionStatus = 'loading' | 'success' | 'error';

export interface DetailSection<T> {
  status: SectionStatus;
  data: T | null;
  error: string | null;
  retry: () => Promise<void>;
}

export interface UseMovieDetailResult {
  details: DetailSection<MovieDetail>;
  credits: DetailSection<CastMember[]>;
  similar: DetailSection<MovieSummary[]>;
}

interface SectionState<T> {
  status: SectionStatus;
  data: T | null;
  error: string | null;
}

export function useMovieDetail(movieId: string): UseMovieDetailResult {
  const [details, setDetails] = useState<SectionState<MovieDetail>>({
    status: 'loading',
    data: null,
    error: null,
  });
  const [credits, setCredits] = useState<SectionState<CastMember[]>>({
    status: 'loading',
    data: null,
    error: null,
  });
  const [similar, setSimilar] = useState<SectionState<MovieSummary[]>>({
    status: 'loading',
    data: null,
    error: null,
  });

  const loadDetailsOnly = useCallback(async () => {
    if (movieId.length === 0) {
      setDetails({
        status: 'success',
        data: null,
        error: null,
      });
      return;
    }
    setDetails((s) => ({ ...s, status: 'loading', error: null }));
    try {
      const data = await fetchMovieById(movieId);
      setDetails({
        status: 'success',
        data,
        error: null,
      });
    } catch (e) {
      setDetails({
        status: 'error',
        data: null,
        error: e instanceof Error ? e.message : 'Something went wrong',
      });
    }
  }, [movieId]);

  const loadCreditsOnly = useCallback(async () => {
    if (movieId.length === 0) {
      setCredits({
        status: 'success',
        data: [],
        error: null,
      });
      return;
    }
    setCredits((s) => ({ ...s, status: 'loading', error: null }));
    try {
      const data = await fetchMovieCredits(movieId);
      setCredits({
        status: 'success',
        data,
        error: null,
      });
    } catch (e) {
      setCredits({
        status: 'error',
        data: null,
        error: e instanceof Error ? e.message : 'Something went wrong',
      });
    }
  }, [movieId]);

  const loadSimilarOnly = useCallback(async () => {
    if (movieId.length === 0) {
      setSimilar({
        status: 'success',
        data: [],
        error: null,
      });
      return;
    }
    setSimilar((s) => ({ ...s, status: 'loading', error: null }));
    try {
      const page = await fetchSimilarMoviesPage(movieId, 1);
      setSimilar({
        status: 'success',
        data: mapMoviesPage(page),
        error: null,
      });
    } catch (e) {
      setSimilar({
        status: 'error',
        data: null,
        error: e instanceof Error ? e.message : 'Something went wrong',
      });
    }
  }, [movieId]);

  const loadAll = useCallback(() => {
    if (movieId.length === 0) {
      setDetails({ status: 'success', data: null, error: null });
      setCredits({ status: 'success', data: [], error: null });
      setSimilar({ status: 'success', data: [], error: null });
      return;
    }

    setDetails((s) => ({ ...s, status: 'loading', error: null }));
    setCredits((s) => ({ ...s, status: 'loading', error: null }));
    setSimilar((s) => ({ ...s, status: 'loading', error: null }));

    Promise.allSettled([
      fetchMovieById(movieId),
      fetchMovieCredits(movieId),
      fetchSimilarMoviesPage(movieId, 1),
    ])
      .then((results) => {
      const [r0, r1, r2] = results;

      if (r0.status === 'fulfilled') {
        setDetails({
          status: 'success',
          data: r0.value,
          error: null,
        });
      } else {
        const err =
          r0.reason instanceof Error
            ? r0.reason.message
            : 'Something went wrong';
        setDetails({
          status: 'error',
          data: null,
          error: err,
        });
      }

      if (r1.status === 'fulfilled') {
        setCredits({
          status: 'success',
          data: r1.value,
          error: null,
        });
      } else {
        const err =
          r1.reason instanceof Error
            ? r1.reason.message
            : 'Something went wrong';
        setCredits({
          status: 'error',
          data: null,
          error: err,
        });
      }

      if (r2.status === 'fulfilled') {
        setSimilar({
          status: 'success',
          data: mapMoviesPage(r2.value),
          error: null,
        });
      } else {
        const err =
          r2.reason instanceof Error
            ? r2.reason.message
            : 'Something went wrong';
        setSimilar({
          status: 'error',
          data: null,
          error: err,
        });
      }
    })
      .catch(() => {
        /* unexpected; sections may stay loading */
      });
  }, [movieId]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return {
    details: {
      ...details,
      retry: loadDetailsOnly,
    },
    credits: {
      ...credits,
      retry: loadCreditsOnly,
    },
    similar: {
      ...similar,
      retry: loadSimilarOnly,
    },
  };
}
