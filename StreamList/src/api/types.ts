/** Raw movie object from TMDB list/detail responses (subset). */
export interface TmdbMovieResult {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
}

/** TMDB `GET /search/movie` result row (includes release_date). */
export interface TmdbMovieSearchResult extends TmdbMovieResult {
  release_date: string | null;
}

export interface TmdbGenre {
  id: number;
  name: string;
}

/** TMDB `GET /movie/{id}` response fields used by the app. */
export interface TmdbMovieDetailResult extends TmdbMovieResult {
  runtime: number | null;
  release_date: string | null;
  genres: TmdbGenre[];
  /** Marketing tagline; may be omitted or empty from API. */
  tagline?: string | null;
}

export interface PaginatedMoviesResponse {
  page: number;
  results: TmdbMovieResult[];
  total_pages: number;
  total_results: number;
}

export interface PaginatedSearchMoviesResponse {
  page: number;
  results: TmdbMovieSearchResult[];
  total_pages: number;
  total_results: number;
}

export interface MovieSummary {
  id: string;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
}

/** Search grid row: summary plus year from TMDB `release_date`. */
export interface MovieSearchHit extends MovieSummary {
  release_date: string | null;
}

export interface MovieDetail extends MovieSummary {
  runtime: number | null;
  release_date: string | null;
  genres: TmdbGenre[];
  /** Short marketing line from TMDB (may be empty). */
  tagline: string | null;
}

export type WatchlistMediaType = 'movie' | 'tv';

/** Persisted watchlist row: summary fields plus snapshots for grid UI and filtering. */
export interface WatchlistItem extends MovieSummary {
  media_type: WatchlistMediaType;
  release_date: string | null;
  genre_names: string[];
  /** Milliseconds; highest among items = most recently saved. */
  savedAt: number;
}

/** Cast row for detail screen (from credits). */
export interface CastMember {
  id: string;
  name: string;
  character: string;
  profile_path: string | null;
}

/** TMDB `GET /movie/{id}/credits` — subset. */
export interface TmdbCreditsResponse {
  cast: {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }[];
}

export interface GenreListResponse {
  genres: TmdbGenre[];
}
