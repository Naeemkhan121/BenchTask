import { Platform, Share } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import ShareNative from 'react-native-share';
import type { MovieDetail } from '../api/types';
import { buildPosterUrl } from './image';
import { showShareErrorToast } from './toast';

const OVERVIEW_MAX_CHARS = 280;

function tmdbMovieUrl(movieId: string): string {
  return `https://www.themoviedb.org/movie/${movieId}`;
}

/**
 * Builds share text with title, tagline, synopsis excerpt, poster image URL, and TMDB link.
 */
export function buildMovieShareMessage(detail: MovieDetail): string {
  const posterUrl = buildPosterUrl(detail.poster_path);
  const link = tmdbMovieUrl(detail.id);
  const lines: string[] = [];

  lines.push(detail.title);

  if (detail.tagline !== null && detail.tagline.trim().length > 0) {
    lines.push(detail.tagline.trim());
  }

  lines.push('');

  const overview = detail.overview.trim();
  if (overview.length > 0) {
    const excerpt =
      overview.length > OVERVIEW_MAX_CHARS
        ? `${overview.slice(0, OVERVIEW_MAX_CHARS)}…`
        : overview;
    lines.push(excerpt);
    lines.push('');
  }

  if (posterUrl.length > 0) {
    lines.push(`Poster: ${posterUrl}`);
  }

  lines.push(`More: ${link}`);

  return lines.join('\n');
}

async function downloadPosterToCache(
  posterUrl: string,
  movieId: string,
): Promise<string> {
  const path = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/streamlist_share_${movieId}.jpg`;
  await ReactNativeBlobUtil.config({ path }).fetch('GET', posterUrl);
  return path;
}

async function shareWithSystemSheet(message: string, title: string): Promise<void> {
  await Share.share(
    {
      message,
      title,
    },
    {
      dialogTitle: `Share “${title}”`,
      subject: title,
    },
  );
}

export async function shareMovieDetail(detail: MovieDetail): Promise<void> {
  const message = buildMovieShareMessage(detail);
  const posterUrl = buildPosterUrl(detail.poster_path);

  if (posterUrl.length === 0) {
    try {
      await shareWithSystemSheet(message, detail.title);
    } catch {
      showShareErrorToast();
    }
    return;
  }

  try {
    const localPath = await downloadPosterToCache(posterUrl, detail.id);
    const fileUrl =
      Platform.OS === 'android' ? `file://${localPath}` : localPath;

    await ShareNative.open({
      title: detail.title,
      message,
      urls: [fileUrl],
      type: 'image/jpeg',
      filename: `streamlist_${detail.id}.jpg`,
      failOnCancel: false,
      subject: detail.title,
    });
  } catch (e) {
    const err = e as { message?: string };
    if (
      typeof err.message === 'string' &&
      err.message.toLowerCase().includes('user did not share')
    ) {
      return;
    }
    try {
      await shareWithSystemSheet(message, detail.title);
    } catch {
      showShareErrorToast();
    }
  }
}
