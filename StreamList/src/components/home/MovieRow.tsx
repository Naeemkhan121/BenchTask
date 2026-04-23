import type { ReactElement } from 'react';
import { useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewToken,
} from 'react-native';
import type { MovieSummary } from '../../api/types';
import { colors } from '../../theme/colors';
import { layout } from '../../theme/layout';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { ContentCard } from '../common/ContentCard';

export interface MovieRowProps {
  title: string;
  movies: MovieSummary[];
  isInitialLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  emptyHint?: string;
  onRetry: () => void;
  onSeeAll: () => void;
  onPressMovie: (movieId: string) => void;
  onLastVisibleIndex: (lastVisibleIndex: number) => void;
}

const SKELETON_COUNT = 5;

export function MovieRow({
  title,
  movies,
  isInitialLoading,
  isLoadingMore,
  error,
  hasMore,
  emptyHint,
  onRetry,
  onSeeAll,
  onPressMovie,
  onLastVisibleIndex,
}: MovieRowProps): ReactElement {
  const onLastVisibleIndexRef = useRef(onLastVisibleIndex);
  onLastVisibleIndexRef.current = onLastVisibleIndex;

  const handleViewableItemsChanged = useCallback(
    (info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
      const { viewableItems } = info;
      if (viewableItems.length === 0) {
        return;
      }
      const indices = viewableItems
        .map((v) => v.index)
        .filter((i): i is number => typeof i === 'number');
      if (indices.length === 0) {
        return;
      }
      const lastIndex = Math.max(...indices);
      onLastVisibleIndexRef.current(lastIndex);
    },
    [],
  );

  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig: {
        itemVisiblePercentThreshold: 40,
      },
      onViewableItemsChanged: handleViewableItemsChanged,
    },
  ]);

  const renderItem = useCallback(
    ({ item }: { item: MovieSummary }) => (
      <ContentCard
        movie={item}
        onPress={() => {
          onPressMovie(item.id);
        }}
      />
    ),
    [onPressMovie],
  );

  const keyExtractor = useCallback((item: MovieSummary) => item.id, []);

  const separator = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  if (isInitialLoading) {
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <View style={styles.skeletonRow}>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <View key={i} style={styles.skeletonCard} />
          ))}
        </View>
      </View>
    );
  }

  if (error !== null) {
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable accessibilityRole="button" onPress={onRetry} style={styles.retry}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (movies.length === 0) {
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>
            {emptyHint ?? 'Nothing here yet.'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Pressable accessibilityRole="button" onPress={onSeeAll} hitSlop={spacing.sm}>
          <Text style={styles.seeAll}>See All</Text>
        </Pressable>
      </View>
      <FlatList
        horizontal
        data={movies}
        ItemSeparatorComponent={separator}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      />
      {hasMore && isLoadingMore ? (
        <View style={styles.loadingMore}>
          <Text style={styles.loadingMoreText}>LOADING MORE CONTENT</Text>
          <ActivityIndicator color={colors.on_surface_variant} size="small" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
 
  section: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography['title-lg'],
    color: colors.on_surface,
  },
  seeAll: {
    ...typography['title-sm'],
    color: colors.primary_container,
  },
  separator: {
    width: spacing.sm,
  },
  skeletonRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  skeletonCard: {
    width: layout.contentPosterWidth,
    height: layout.contentPosterHeight,
    borderRadius: spacing.sm,
    backgroundColor: colors.surface_container_high,
  },
  errorBox: {
    paddingHorizontal: spacing.md,
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  errorText: {
    ...typography['body-md'],
    color: colors.on_surface_variant,
  },
  retry: {
    paddingVertical: spacing.xs,
  },
  retryText: {
    ...typography['title-sm'],
    color: colors.primary_container,
  },
  emptyBox: {
    paddingHorizontal: spacing.md,
  },
  emptyText: {
    ...typography['body-md'],
    color: colors.on_surface_variant,
  },
  loadingMore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  loadingMoreText: {
    ...typography['label-sm'],
    color: colors.on_surface_variant,
    textTransform: 'uppercase',
  },
});
