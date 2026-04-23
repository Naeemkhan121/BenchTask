/**
 * Fixed chip order for the Home genre strip. IDs are resolved via TMDB
 * /genre/movie/list with fallbacks if names differ (e.g. Science Fiction → Sci-Fi).
 */
export const GENRE_CHIP_LABELS = [
  'All',
  'Action',
  'Drama',
  'Comedy',
  'Sci-Fi',
  'Horror',
  'Documentary',
] as const;

export type GenreChipLabel = (typeof GENRE_CHIP_LABELS)[number];

/** TMDB genre name → our chip label (when they differ). */
export const TMDB_NAME_TO_CHIP_LABEL: Record<string, GenreChipLabel> = {
  'Science Fiction': 'Sci-Fi',
};

/**
 * Known TMDB genre IDs when API list does not return a matching name.
 * @see https://developer.themoviedb.org/reference/genre-movie-list
 */
export const GENRE_ID_FALLBACK: Record<Exclude<GenreChipLabel, 'All'>, number> = {
  Action: 28,
  Drama: 18,
  Comedy: 35,
  'Sci-Fi': 878,
  Horror: 27,
  Documentary: 99,
};
