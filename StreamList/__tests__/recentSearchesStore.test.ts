import { useRecentSearchesStore } from '../src/store/recentSearchesStore';

describe('recentSearchesStore', () => {
  beforeEach(() => {
    useRecentSearchesStore.setState({ terms: [], hydrated: true });
  });

  it('dedupes case-insensitively and promotes newest', () => {
    const { addTerm } = useRecentSearchesStore.getState();
    addTerm('Batman');
    addTerm('Thor');
    addTerm('batman');
    expect(useRecentSearchesStore.getState().terms).toEqual(['batman', 'Thor']);
  });

  it('keeps at most 5 terms', () => {
    const { addTerm } = useRecentSearchesStore.getState();
    addTerm('a');
    addTerm('b');
    addTerm('c');
    addTerm('d');
    addTerm('e');
    addTerm('f');
    expect(useRecentSearchesStore.getState().terms).toEqual([
      'f',
      'e',
      'd',
      'c',
      'b',
    ]);
  });

  it('clearAll empties terms', () => {
    const { addTerm, clearAll } = useRecentSearchesStore.getState();
    addTerm('x');
    clearAll();
    expect(useRecentSearchesStore.getState().terms).toEqual([]);
  });
});
