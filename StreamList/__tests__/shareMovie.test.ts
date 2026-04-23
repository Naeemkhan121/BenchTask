jest.mock('../src/utils/toast', () => ({
  showShareErrorToast: jest.fn(),
}));

jest.mock('react-native-share', () => ({
  __esModule: true,
  default: {
    open: jest.fn(() => Promise.resolve({ success: true })),
  },
}));

jest.mock('react-native-blob-util', () => ({
  __esModule: true,
  default: {
    fs: {
      dirs: { CacheDir: '/mock/cache' },
    },
    config: () => ({
      fetch: jest.fn(() =>
        Promise.resolve({ path: () => '/mock/cache/poster.jpg' }),
      ),
    }),
  },
}));

import type { MovieDetail } from '../src/api/types';
import { buildMovieShareMessage } from '../src/utils/shareMovie';

const baseDetail: MovieDetail = {
  id: '550',
  title: 'Fight Club',
  overview: 'A ticking-time-bomb insomniac...',
  poster_path: '/poster.jpg',
  backdrop_path: '/bg.jpg',
  vote_average: 8.4,
  runtime: 139,
  release_date: '1999-10-15',
  genres: [{ id: 18, name: 'Drama' }],
  tagline: 'Mischief. Mayhem. Soap.',
};

describe('buildMovieShareMessage', () => {
  it('includes title, tagline, overview excerpt, poster line, and TMDB link', () => {
    const msg = buildMovieShareMessage(baseDetail);
    expect(msg).toContain('Fight Club');
    expect(msg).toContain('Mischief. Mayhem. Soap.');
    expect(msg).toContain('Poster:');
    expect(msg).toContain('More: https://www.themoviedb.org/movie/550');
  });

  it('omits empty tagline section', () => {
    const msg = buildMovieShareMessage({
      ...baseDetail,
      tagline: null,
    });
    expect(msg).not.toContain('Mischief');
    expect(msg).toContain('Fight Club');
  });
});
