import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { useLayoutEffect, useMemo } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { MovieSummary } from '../api/types';
import { ContentCard } from '../components/common/ContentCard';
import {
  SeeAllFooterSkeleton,
  SeeAllGridSkeleton,
} from '../components/seeAll/SeeAllSkeletons';
import { usePaginatedMovies } from '../hooks/usePaginatedMovies';
import type { HomeStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const GRID_COLUMNS = 3;

export type SeeAllScreenProps = {
  route: RouteProp<HomeStackParamList, 'SeeAll'>;
  navigation: NativeStackNavigationProp<HomeStackParamList, 'SeeAll'>;
};

export function SeeAllScreen({ route, navigation }: SeeAllScreenProps): ReactElement {
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
      headerLeft: () => (
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          hitSlop={spacing.sm}
          onPress={() => {
            navigation.goBack();
          }}
          style={({ pressed }) => [
            styles.headerBackBtn,
            pressed && styles.headerBackPressed,
          ]}
        >
          <MaterialCommunityIcons
            color={colors.icon_on_dark}
            name="arrow-left"
            size={layout.iconSizeMd}
          />
        </Pressable>
      ),
    });
  }, [navigation]);
  const { listType, genreId: genreIdParam, movieId: similarMovieIdParam } =
    route.params;

  const horizontalPadding = spacing.md;
  const columnGap = layout.watchlistGridGap;
  const rowGap = spacing.md;

  const innerWidth = windowWidth - horizontalPadding * 2;
  const cardWidth = Math.floor(
    (innerWidth - columnGap * (GRID_COLUMNS - 1)) / GRID_COLUMNS,
  );
  const posterHeight = Math.round((cardWidth * 3) / 2);

  const genreId = useMemo((): number | null => {
    if (genreIdParam === undefined) {
      return null;
    }
    const n = Number.parseInt(genreIdParam, 10);
    return Number.isNaN(n) ? null : n;
  }, [genreIdParam]);

  const similarMovieId =
    listType === 'similar' ? (similarMovieIdParam ?? '') : '';

  const listKey = useMemo(() => {
    if (listType === 'similar') {
      return `seeall-similar-${similarMovieId}`;
    }
    return `seeall-${listType}-${genreIdParam ?? 'all'}`;
  }, [genreIdParam, listType, similarMovieId]);

  const {
    movies,
    isInitialLoading,
    isLoadingMore,
    error,
    hasMore,
    retry,
    loadMore,
  } = usePaginatedMovies(
    listKey,
    listType,
    genreId,
    listType === 'similar' ? similarMovieId : null,
  );

  const renderItem = ({ item }: { item: MovieSummary }) => (
    <ContentCard
      movie={item}
      posterWidth={cardWidth}
      onPress={() => {
        navigation.navigate('Detail', { movieId: item.id });
      }}
    />
  );

  const keyExtractor = (item: MovieSummary) => item.id;

  if (isInitialLoading) {
    return (
      <View style={[styles.root, { paddingBottom: insets.bottom }]}>
        <SeeAllGridSkeleton
          cardWidth={cardWidth}
          columnGap={columnGap}
          horizontalPadding={horizontalPadding}
          posterHeight={posterHeight}
          rowGap={rowGap}
        />
      </View>
    );
  }

  if (error !== null) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable accessibilityRole="button" onPress={retry} style={styles.retry}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom }]}>
      <FlatList
        columnWrapperStyle={[
          styles.columnRow,
          {
            gap: columnGap,
            marginBottom: rowGap,
          },
        ]}
        contentContainerStyle={styles.listContent}
        data={movies}
        keyExtractor={keyExtractor}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No movies found.</Text>
        }
        ListFooterComponent={
          hasMore && isLoadingMore ? (
            <SeeAllFooterSkeleton
              cardWidth={cardWidth}
              columnGap={columnGap}
              posterHeight={posterHeight}
            />
          ) : null
        }
        numColumns={GRID_COLUMNS}
        onEndReached={() => {
          if (hasMore && !isLoadingMore) {
            loadMore();
          }
        }}
        onEndReachedThreshold={0.25}
        renderItem={renderItem}
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
  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  columnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
  },
  errorText: {
    ...typography['body-md'],
    color: colors.on_surface_variant,
    textAlign: 'center',
  },
  retry: {
    marginTop: spacing.sm,
    padding: spacing.sm,
  },
  retryText: {
    ...typography['title-sm'],
    color: colors.primary_container,
  },
  emptyText: {
    ...typography['body-md'],
    color: colors.on_surface_variant,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  headerBackBtn: {
    marginLeft: spacing.xs,
    paddingVertical: spacing.sm,
    paddingRight: spacing.sm,
  },
  headerBackPressed: {
    opacity: 0.85,
  },
});
