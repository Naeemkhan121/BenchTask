import { TMDB_ACCESS_TOKEN, TMDB_BASE_URL } from '@env';
import {
  GENRE_CHIP_LABELS,
  GENRE_ID_FALLBACK,
  TMDB_NAME_TO_CHIP_LABEL,
  type GenreChipLabel,
} from '../constants/genreChips';
import { createApiClient } from './client';
import type {
  CastMember,
  GenreListResponse,
  MovieDetail,
  MovieSearchHit,
  MovieSummary,
  PaginatedMoviesResponse,
  PaginatedSearchMoviesResponse,
  TmdbCreditsResponse,
  TmdbMovieDetailResult,
  TmdbMovieResult,
  TmdbMovieSearchResult,
} from './types';

const client = createApiClient({
  baseUrl: TMDB_BASE_URL,
  accessToken: TMDB_ACCESS_TOKEN,
});

export function mapMovie(r: TmdbMovieResult): MovieSummary {
  return {
    id: String(r.id),
    title: r.title,
    overview: r.overview,
    poster_path: r.poster_path,
    backdrop_path: r.backdrop_path,
    vote_average: r.vote_average,
  };
}

function mapSearchMovie(r: TmdbMovieSearchResult): MovieSearchHit {
  return {
    ...mapMovie(r),
    release_date: r.release_date,
  };
}

function mapMovieDetail(r: TmdbMovieDetailResult): MovieDetail {
  return {
    ...mapMovie(r),
    runtime: r.runtime,
    release_date: r.release_date,
    genres: r.genres ?? [],
    tagline:
      r.tagline !== undefined &&
      r.tagline !== null &&
      String(r.tagline).trim().length > 0
        ? String(r.tagline).trim()
        : null,
  };
}

export async function fetchTrendingMoviesPage(
  page: number,
): Promise<PaginatedMoviesResponse> {
  const data = await client.getJson<PaginatedMoviesResponse>(
    `/trending/movie/week?page=${page}`,
  );
  return {
    ...data,
    results: data.results,
  };
}

export async function fetchTopRatedMoviesPage(
  page: number,
): Promise<PaginatedMoviesResponse> {
  return client.getJson<PaginatedMoviesResponse>(
    `/movie/top_rated?page=${page}`,
  );
}

export interface DiscoverMoviesOptions {
  /** TMDB `sort_by`, default `popularity.desc`. */
  sortBy?: string;
  /** Minimum vote count (e.g. for “top rated” quality). */
  voteCountGte?: number;
}

export async function fetchDiscoverMoviesPage(
  page: number,
  genreId: number | null,
  options?: DiscoverMoviesOptions,
): Promise<PaginatedMoviesResponse> {
  const sortBy = options?.sortBy ?? 'popularity.desc';
  const queryParts = [`sort_by=${encodeURIComponent(sortBy)}`];
  if (options?.voteCountGte !== undefined) {
    queryParts.push(`vote_count.gte=${String(options.voteCountGte)}`);
  }
  const base = `/discover/movie?${queryParts.join('&')}`;
  const genre =
    genreId === null ? '' : `&with_genres=${encodeURIComponent(String(genreId))}`;
  return client.getJson<PaginatedMoviesResponse>(
    `${base}${genre}&page=${encodeURIComponent(String(page))}`,
  );
}

/** First discover result for a genre (hero when a chip is selected). */
export async function fetchHeroFromDiscoverGenre(
  genreId: number,
): Promise<MovieSummary | null> {
  const data = await fetchDiscoverMoviesPage(1, genreId, {
    sortBy: 'popularity.desc',
  });
  const first = data.results[0];
  if (first === undefined) {
    return null;
  }
  return mapMovie(first);
}

export interface GenreChip {
  label: GenreChipLabel;
  /** `null` means “All” — no genre filter. */
  genreId: number | null;
}

export async function fetchGenreChips(): Promise<GenreChip[]> {
  const { genres } = await client.getJson<GenreListResponse>('/genre/movie/list');

  const byNormalizedName = new Map<string, number>();
  for (const g of genres) {
    byNormalizedName.set(g.name, g.id);
    const alias = TMDB_NAME_TO_CHIP_LABEL[g.name];
    if (alias !== undefined) {
      byNormalizedName.set(alias, g.id);
    }
  }

  const result: GenreChip[] = [];

  for (const label of GENRE_CHIP_LABELS) {
    if (label === 'All') {
      result.push({ label: 'All', genreId: null });
      continue;
    }
    const fromApi = byNormalizedName.get(label);
    const id = fromApi ?? GENRE_ID_FALLBACK[label];
    result.push({ label, genreId: id });
  }

  return result;
}

export async function fetchHeroFromTrending(): Promise<MovieSummary | null> {
  const data = await fetchTrendingMoviesPage(1);
  const first = data.results[0];
  if (first === undefined) {
    return null;
  }
  return mapMovie(first);
}

export function mapMoviesPage(data: PaginatedMoviesResponse): MovieSummary[] {
  return data.results.map(mapMovie);
}

export async function fetchMovieById(movieId: string): Promise<MovieDetail> {
  const raw = await client.getJson<TmdbMovieDetailResult>(`/movie/${movieId}`);
  return mapMovieDetail(raw);
}

export async function fetchMovieCredits(movieId: string): Promise<CastMember[]> {
  const data = await client.getJson<TmdbCreditsResponse>(
    `/movie/${movieId}/credits`,
  );
  return data.cast.map((c) => ({
    id: String(c.id),
    name: c.name,
    character: c.character,
    profile_path: c.profile_path,
  }));
}

export async function fetchSimilarMoviesPage(
  movieId: string,
  page: number,
): Promise<PaginatedMoviesResponse> {
  return client.getJson<PaginatedMoviesResponse>(
    `/movie/${movieId}/similar?page=${page}`,
  );
}

export interface SearchMoviesPageResult {
  page: number;
  results: MovieSearchHit[];
  total_pages: number;
  total_results: number;
}

export async function fetchSearchMoviesPage(
  query: string,
  page: number,
  signal?: AbortSignal,
): Promise<SearchMoviesPageResult> {
  const q = query.trim();
  const path = `/search/movie?query=${encodeURIComponent(q)}&page=${encodeURIComponent(String(page))}`;
  const data = await client.getJson<PaginatedSearchMoviesResponse>(path, {
    signal,
  });
  return {
    page: data.page,
    total_pages: data.total_pages,
    total_results: data.total_results,
    results: data.results.map(mapSearchMovie),
  };
}
