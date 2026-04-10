import { useCallback, useEffect, useState } from 'react';
import {
  fetchMovieById,
  fetchTrendingMoviesPage,
  mapMovie,
} from '../api/movies';
import type { MovieDetail, MovieSummary } from '../api/types';
import { releaseYear } from '../utils/watchlistItem';

export type SearchTrendingStatus = 'loading' | 'error' | 'success';

export interface SearchTrendingFeaturedMeta {
  title: string;
  subtitle: string;
  backdropPath: string | null;
  movieId: string;
}

export interface UseSearchTrendingResult {
  status: SearchTrendingStatus;
  errorMessage: string | null;
  retry: () => void;
  featured: SearchTrendingFeaturedMeta | null;
  gridMovies: MovieSummary[];
}

function formatFeaturedSubtitle(detail: MovieDetail): string {
  const year = releaseYear(detail.release_date);
  const genrePart =
    detail.genres.length > 0
      ? detail.genres.map((g) => g.name).join(', ')
      : '';
  const runtime =
    detail.runtime !== null && detail.runtime > 0
      ? `${detail.runtime} min`
      : '';
  const parts = [genrePart, year, runtime].filter(
    (p) => p !== null && p.length > 0,
  );
  return parts.join(' • ');
}

export function useSearchTrending(enabled: boolean): UseSearchTrendingResult {
  const [status, setStatus] = useState<SearchTrendingStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [featured, setFeatured] = useState<SearchTrendingFeaturedMeta | null>(
    null,
  );
  const [gridMovies, setGridMovies] = useState<MovieSummary[]>([]);

  const load = useCallback(async () => {
    if (!enabled) {
      return;
    }
    setStatus('loading');
    setErrorMessage(null);
    try {
      const page = await fetchTrendingMoviesPage(1);
      const raw = page.results;
      if (raw.length === 0) {
        setFeatured(null);
        setGridMovies([]);
        setStatus('success');
        return;
      }
      const first = raw[0];
      if (first === undefined) {
        setFeatured(null);
        setGridMovies([]);
        setStatus('success');
        return;
      }
      const firstSummary = mapMovie(first);
      const detail = await fetchMovieById(firstSummary.id);
      setFeatured({
        movieId: detail.id,
        title: detail.title,
        subtitle: formatFeaturedSubtitle(detail),
        backdropPath: detail.backdrop_path,
      });
      setGridMovies(raw.slice(1).map(mapMovie));
      setStatus('success');
    } catch (e) {
      setStatus('error');
      setErrorMessage(e instanceof Error ? e.message : 'Something went wrong');
      setFeatured(null);
      setGridMovies([]);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    load().catch(() => {
      /* surfaced via state */
    });
  }, [enabled, load]);

  return {
    status,
    errorMessage,
    retry: load,
    featured,
    gridMovies,
  };
}
