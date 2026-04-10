import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GenreFilterStrip } from '../components/home/GenreFilterStrip';
import { HeroFeaturedCard } from '../components/home/HeroFeaturedCard';
import { HomeHeader } from '../components/home/HomeHeader';
import { MovieRow } from '../components/home/MovieRow';
import {
  useGenreChips,
  useHomeHero,
  usePaginatedMovies,
} from '../hooks/useHome';
import type { HomeStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { spacing } from '../theme/spacing';

type HomeNav = NativeStackNavigationProp<HomeStackParamList, 'HomeMain'>;

/** Only mounted when “All” is selected so `usePaginatedMovies` for Popular does not run during genre filter. */
function HomePopularRow({
  navigation,
}: {
  navigation: HomeNav;
}): ReactElement {
  const discover = usePaginatedMovies('home-discover-all', 'discover', null);

  return (
    <MovieRow
      emptyHint="No popular picks right now."
      error={discover.error}
      hasMore={discover.hasMore}
      isInitialLoading={discover.isInitialLoading}
      isLoadingMore={discover.isLoadingMore}
      movies={discover.movies}
      onLastVisibleIndex={discover.onLastVisibleIndex}
      onPressMovie={(movieId) => {
        navigation.navigate('Detail', { movieId });
      }}
      onRetry={discover.retry}
      onSeeAll={() => {
        navigation.navigate('SeeAll', {
          title: 'Popular',
          listType: 'discover',
        });
      }}
      title="Popular"
    />
  );
}

export function HomeScreen(): ReactElement {
  const navigation = useNavigation<HomeNav>();
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;

  const [selectedChipIndex, setSelectedChipIndex] = useState(0);

  const { chips: genreChips, isLoading: chipsLoading } = useGenreChips();

  const selectedGenreId = useMemo((): number | null => {
    const chip = genreChips[selectedChipIndex];
    if (chip === undefined) {
      return null;
    }
    return chip.genreId;
  }, [genreChips, selectedChipIndex]);

  useEffect(() => {
    if (genreChips.length === 0) {
      return;
    }
    if (selectedChipIndex >= genreChips.length) {
      setSelectedChipIndex(0);
    }
  }, [genreChips, selectedChipIndex]);

  const trendingListKey = `home-trending-${selectedGenreId ?? 'all'}`;
  const topRatedListKey = `home-top-rated-${selectedGenreId ?? 'all'}`;

  const { movie: heroMovie, isLoading: heroLoading, error: heroError, retry: heroRetry } =
    useHomeHero(selectedGenreId);

  const trending = usePaginatedMovies(trendingListKey, 'trending', selectedGenreId);
  const topRated = usePaginatedMovies(topRatedListKey, 'top_rated', selectedGenreId);

  const scrollPaddingTop = insets.top + layout.headerBarContentHeight;
  const scrollPaddingBottom = insets.bottom + layout.tabBarStackPadding;

  return (
    <View style={styles.root}>
      <Animated.ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: scrollPaddingTop,
            paddingBottom: scrollPaddingBottom,
          },
        ]}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.filterSection}>
          <GenreFilterStrip
            chips={genreChips}
            isLoading={chipsLoading}
            onSelect={setSelectedChipIndex}
            selectedIndex={selectedChipIndex}
          />
        </View>
        <View style={styles.heroBlock}>
          <HeroFeaturedCard
            error={heroError}
            isLoading={heroLoading}
            movie={heroMovie}
            onDetails={() => {
              if (heroMovie !== null) {
                navigation.navigate('Detail', { movieId: heroMovie.id });
              }
            }}
            onRetry={heroRetry}
            onWatchNow={() => {
              if (heroMovie !== null) {
                navigation.navigate('Detail', { movieId: heroMovie.id });
              }
            }}
          />
        </View>

        <MovieRow
          error={trending.error}
          hasMore={trending.hasMore}
          isInitialLoading={trending.isInitialLoading}
          isLoadingMore={trending.isLoadingMore}
          movies={trending.movies}
          onLastVisibleIndex={trending.onLastVisibleIndex}
          onPressMovie={(movieId) => {
            navigation.navigate('Detail', { movieId });
          }}
          onRetry={trending.retry}
          onSeeAll={() => {
            navigation.navigate('SeeAll', {
              title: 'Trending Now',
              listType: 'trending',
              genreId:
                selectedGenreId !== null
                  ? String(selectedGenreId)
                  : undefined,
            });
          }}
          title="Trending Now"
        />
        <MovieRow
          error={topRated.error}
          hasMore={topRated.hasMore}
          isInitialLoading={topRated.isInitialLoading}
          isLoadingMore={topRated.isLoadingMore}
          movies={topRated.movies}
          onLastVisibleIndex={topRated.onLastVisibleIndex}
          onPressMovie={(movieId) => {
            navigation.navigate('Detail', { movieId });
          }}
          onRetry={topRated.retry}
          onSeeAll={() => {
            navigation.navigate('SeeAll', {
              title: 'Top Rated',
              listType: 'top_rated',
              genreId:
                selectedGenreId !== null
                  ? String(selectedGenreId)
                  : undefined,
            });
          }}
          title="Top Rated"
        />
        {selectedGenreId === null ? (
          <HomePopularRow navigation={navigation} />
        ) : null}
      </Animated.ScrollView>
      <HomeHeader scrollY={scrollY} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'stretch',
  },
  filterSection: {
    width: '100%',
    paddingBottom: spacing.xs,
  },
  heroBlock: {
    width: '100%',
    marginTop: spacing.sm,
  },
});
