import { TMDB_IMAGE_BASE_URL } from '@env';

const normalizedBase = TMDB_IMAGE_BASE_URL.replace(/\/$/, '');

export function buildPosterUrl(path: string | null): string {
  if (path === null || path.length === 0) {
    return '';
  }
  return `${normalizedBase}/w342${path}`;
}

export function buildBackdropUrl(path: string | null): string {
  if (path === null || path.length === 0) {
    return '';
  }
  return `${normalizedBase}/w780${path}`;
}

/** Cast profile image (TMDB profile_path). */
export function buildProfileUrl(path: string | null): string {
  if (path === null || path.length === 0) {
    return '';
  }
  return `${normalizedBase}/w185${path}`;
}
