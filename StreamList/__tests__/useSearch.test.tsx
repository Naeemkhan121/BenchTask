/**
 * @format
 */

import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';

jest.mock('../src/api/movies', () => ({
  fetchSearchMoviesPage: jest.fn(() =>
    Promise.resolve({
      results: [],
      total_results: 0,
      page: 1,
      total_pages: 1,
    }),
  ),
}));

import { fetchSearchMoviesPage } from '../src/api/movies';
import { useSearch } from '../src/hooks/useSearch';

describe('useSearch', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    (fetchSearchMoviesPage as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('debounces API calls by 400ms after typing stops', async () => {
    let hook: ReturnType<typeof useSearch> | null = null;

    function Probe(): React.ReactElement {
      hook = useSearch();
      return <></>;
    }

    ReactTestRenderer.act(() => {
      ReactTestRenderer.create(<Probe />);
    });

    await act(async () => {
      hook!.setSearchText('inception');
    });

    expect(fetchSearchMoviesPage).not.toHaveBeenCalled();

    await act(async () => {
      jest.advanceTimersByTime(399);
      await Promise.resolve();
    });
    expect(fetchSearchMoviesPage).not.toHaveBeenCalled();

    await act(async () => {
      jest.advanceTimersByTime(1);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(fetchSearchMoviesPage).toHaveBeenCalledTimes(1);
    expect(fetchSearchMoviesPage).toHaveBeenCalledWith(
      'inception',
      1,
      expect.any(AbortSignal),
    );
  });
});
