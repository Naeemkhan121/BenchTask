import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { MovieSearchHit } from '../api/types';
import { SearchBar } from '../components/search/SearchBar';
import { SearchGenreChips } from '../components/search/SearchGenreChips';
import { SearchHeader } from '../components/search/SearchHeader';
import { SearchRecentSection } from '../components/search/SearchRecentSection';
import { SearchResultCard } from '../components/search/SearchResultCard';
import { SearchResultsGridSkeleton } from '../components/search/SearchSkeletons';
import { SearchTrendingSection } from '../components/search/SearchTrendingSection';
import { SearchZeroState } from '../components/search/SearchZeroState';
import { useGenreChips } from '../hooks/useHome';
import { useSearch } from '../hooks/useSearch';
import { useSearchTrending } from '../hooks/useSearchTrending';
import type { SearchStackParamList } from '../navigation/types';
import { useRecentSearchesStore } from '../store/recentSearchesStore';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type SearchNav = NativeStackNavigationProp<SearchStackParamList, 'SearchMain'>;

export function SearchScreen(): ReactElement {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const navigation = useNavigation<SearchNav>();
  const search = useSearch();
  const genre = useGenreChips();
  const [searchBarFocused, setSearchBarFocused] = useState(false);

  const recentTerms = useRecentSearchesStore((s) => s.terms);
  const recentHydrated = useRecentSearchesStore((s) => s.hydrated);
  const clearAllRecent = useRecentSearchesStore((s) => s.clearAll);

  const showDefault = !search.hasActiveInput;
  const trending = useSearchTrending(showDefault);

  const gap = layout.watchlistGridGap;
  const horizontalPad = spacing.md;
  const cardWidth = (width - horizontalPad * 2 - gap) / 2;

  const navigateToDetail = (movieId: string): void => {
    navigation.navigate('Detail', { movieId });
  };

  const selectedGenreLabel = useMemo((): string | null => {
    const t = search.searchText.trim();
    if (t.length === 0) {
      return 'All';
    }
    const match = genre.chips.find((c) => c.label === t);
    return match !== undefined ? match.label : null;
  }, [search.searchText, genre.chips]);

  const showRecentSection =
    recentHydrated && !search.hasActiveInput && !searchBarFocused;

  const searchHeaderBlock = (
    <>
      <SearchHeader />
      <SearchBar
        onBlur={() => {
          setSearchBarFocused(false);
        }}
        onChangeText={search.setSearchText}
        onFocus={() => {
          setSearchBarFocused(true);
        }}
        value={search.searchText}
      />
      <SearchGenreChips
        chips={genre.chips}
        isLoading={genre.isLoading}
        selectedLabel={selectedGenreLabel}
        onChipPress={search.applyGenreChip}
      />
    </>
  );

  if (!search.hasActiveInput) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: insets.bottom + layout.tabBarStackPadding,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {searchHeaderBlock}
          {showRecentSection ? (
            <SearchRecentSection
              onClearAll={clearAllRecent}
              onSelectTerm={search.applySearchQuery}
              terms={recentTerms}
            />
          ) : null}
          <SearchTrendingSection
            cardWidth={cardWidth}
            columnGap={gap}
            onPressMovie={navigateToDetail}
            trending={trending}
          />
        </ScrollView>
      </View>
    );
  }

  const resultsHeader = (
    <View>
      {searchHeaderBlock}
      {search.status === 'error' && search.errorMessage !== null ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{search.errorMessage}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={search.retry}
            style={({ pressed }) => [
              styles.retryBtn,
              pressed && styles.retryPressed,
            ]}
          >
            <Text style={styles.retryBtnText}>Retry</Text>
          </Pressable>
        </View>
      ) : null}
      {search.status === 'loading' ? (
        <View style={styles.resultsMeta}>
          <SearchResultsGridSkeleton />
        </View>
      ) : null}
      {search.status === 'success' && search.totalCount > 0 ? (
        <Text style={styles.resultCount} numberOfLines={2}>
          {`${String(search.totalCount)} results for '${search.resultsQuery}'`}
        </Text>
      ) : null}
      {search.status === 'success' && search.totalCount === 0 ? (
        <SearchZeroState query={search.resultsQuery} />
      ) : null}
    </View>
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <FlatList
        ListHeaderComponent={resultsHeader}
        columnWrapperStyle={
          search.results.length > 1
            ? {
                paddingHorizontal: horizontalPad,
                gap,
                marginBottom: spacing.sm,
              }
            : {
                paddingHorizontal: horizontalPad,
                marginBottom: spacing.sm,
              }
        }
        contentContainerStyle={{
          paddingBottom: insets.bottom + layout.tabBarStackPadding,
        }}
        data={
          search.status === 'success' && search.totalCount > 0
            ? search.results
            : []
        }
        keyExtractor={(item: MovieSearchHit) => item.id}
        keyboardShouldPersistTaps="handled"
        numColumns={2}
        renderItem={({ item }) => (
          <SearchResultCard
            cardWidth={cardWidth}
            movie={item}
            onPress={() => {
              navigateToDetail(item.id);
            }}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  resultCount: {
    ...typography['label-sm'],
    color: colors.on_surface_variant,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  resultsMeta: {
    paddingBottom: spacing.sm,
  },
  errorBanner: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    alignItems: 'center',
  },
  errorBannerText: {
    ...typography['body-md'],
    color: colors.on_surface_variant,
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  retryPressed: {
    opacity: 0.85,
  },
  retryBtnText: {
    ...typography['title-sm'],
    color: colors.primary_container,
  },
});
