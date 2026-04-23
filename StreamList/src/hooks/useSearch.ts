import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchSearchMoviesPage } from '../api/movies';
import type { MovieSearchHit } from '../api/types';
import { useRecentSearchesStore } from '../store/recentSearchesStore';

const DEBOUNCE_MS = 400;

function isAbortLike(error: unknown): boolean {
  if (axios.isAxiosError(error)) {
    return error.code === 'ERR_CANCELED';
  }
  if (error instanceof Error && error.name === 'CanceledError') {
    return true;
  }
  return false;
}

export type SearchFetchStatus = 'idle' | 'loading' | 'error' | 'success';

export interface UseSearchResult {
  searchText: string;
  setSearchText: (text: string) => void;
  /** Query string for the current results header (last started fetch). */
  resultsQuery: string;
  results: MovieSearchHit[];
  totalCount: number;
  status: SearchFetchStatus;
  errorMessage: string | null;
  retry: () => void;
  /** Clears debounce, sets text, runs search immediately (or default state for `All`). */
  applyGenreChip: (label: string) => void;
  /** Same as typing + enter: set query and fetch immediately (recent search row). */
  applySearchQuery: (query: string) => void;
  /** True when trimmed input is non-empty (results / trending hidden). */
  hasActiveInput: boolean;
}

export function useSearch(): UseSearchResult {
  const [searchText, setSearchTextState] = useState('');
  const searchTextRef = useRef('');

  const [resultsQuery, setResultsQuery] = useState('');
  const [results, setResults] = useState<MovieSearchHit[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [status, setStatus] = useState<SearchFetchStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const fetchGenerationRef = useRef(0);

  const addTerm = useRecentSearchesStore((s) => s.addTerm);

  const cancelInFlight = useCallback((): void => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const runFetch = useCallback(
    (rawQuery: string) => {
      const q = rawQuery.trim();
      cancelInFlight();
      if (q.length === 0) {
        fetchGenerationRef.current += 1;
        setResultsQuery('');
        setResults([]);
        setTotalCount(0);
        setStatus('idle');
        setErrorMessage(null);
        return;
      }

      const ac = new AbortController();
      abortRef.current = ac;
      const gen = ++fetchGenerationRef.current;
      setResultsQuery(q);
      setStatus('loading');
      setErrorMessage(null);

      fetchSearchMoviesPage(q, 1, ac.signal)
        .then((data) => {
          if (gen !== fetchGenerationRef.current) {
            return;
          }
          setResults(data.results);
          setTotalCount(data.total_results);
          setStatus('success');
          addTerm(q);
        })
        .catch((e: unknown) => {
          if (isAbortLike(e)) {
            return;
          }
          if (gen !== fetchGenerationRef.current) {
            return;
          }
          setStatus('error');
          setErrorMessage(e instanceof Error ? e.message : 'Something went wrong');
        });
    },
    [addTerm, cancelInFlight],
  );

  const clearDebounce = useCallback((): void => {
    if (debounceTimerRef.current !== null) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, []);

  const setSearchText = useCallback(
    (text: string) => {
      searchTextRef.current = text;
      setSearchTextState(text);
      clearDebounce();

      const trimmed = text.trim();
      if (trimmed.length === 0) {
        cancelInFlight();
        fetchGenerationRef.current += 1;
        setResultsQuery('');
        setResults([]);
        setTotalCount(0);
        setStatus('idle');
        setErrorMessage(null);
        return;
      }

      debounceTimerRef.current = setTimeout(() => {
        debounceTimerRef.current = null;
        runFetch(searchTextRef.current.trim());
      }, DEBOUNCE_MS);
    },
    [cancelInFlight, clearDebounce, runFetch],
  );

  const applyGenreChip = useCallback(
    (label: string) => {
      clearDebounce();
      if (label === 'All') {
        cancelInFlight();
        fetchGenerationRef.current += 1;
        searchTextRef.current = '';
        setSearchTextState('');
        setResultsQuery('');
        setResults([]);
        setTotalCount(0);
        setStatus('idle');
        setErrorMessage(null);
        return;
      }
      searchTextRef.current = label;
      setSearchTextState(label);
      runFetch(label);
    },
    [cancelInFlight, clearDebounce, runFetch],
  );

  const applySearchQuery = useCallback(
    (query: string) => {
      clearDebounce();
      const q = query.trim();
      if (q.length === 0) {
        cancelInFlight();
        fetchGenerationRef.current += 1;
        searchTextRef.current = '';
        setSearchTextState('');
        setResultsQuery('');
        setResults([]);
        setTotalCount(0);
        setStatus('idle');
        setErrorMessage(null);
        return;
      }
      searchTextRef.current = q;
      setSearchTextState(q);
      runFetch(q);
    },
    [cancelInFlight, clearDebounce, runFetch],
  );

  const retry = useCallback(() => {
    const q = resultsQuery.trim();
    if (q.length === 0) {
      return;
    }
    runFetch(q);
  }, [resultsQuery, runFetch]);

  useEffect(() => {
    return () => {
      clearDebounce();
      cancelInFlight();
    };
  }, [cancelInFlight, clearDebounce]);

  const hasActiveInput = searchText.trim().length > 0;

  return {
    searchText,
    setSearchText,
    resultsQuery,
    results,
    totalCount,
    status,
    errorMessage,
    retry,
    applyGenreChip,
    applySearchQuery,
    hasActiveInput,
  };
}
