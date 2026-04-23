import type { ReactElement } from 'react';
import { FlatList, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { WatchlistItem } from '../api/types';
import { BecauseYouSavedRow } from '../components/watchlist/BecauseYouSavedRow';
import { WatchlistEmptyState } from '../components/watchlist/WatchlistEmptyState';
import { WatchlistFilterChips } from '../components/watchlist/WatchlistFilterChips';
import { WatchlistFilterEmpty } from '../components/watchlist/WatchlistFilterEmpty';
import { WatchlistGridCard } from '../components/watchlist/WatchlistGridCard';
import { WatchlistHeader } from '../components/watchlist/WatchlistHeader';
import { useWatchlistScreenModel } from '../hooks/useWatchlistScreenModel';
import { useWatchlistSimilarRow } from '../hooks/useWatchlistSimilarRow';
import { useWatchlistTrendingPreview } from '../hooks/useWatchlistTrendingPreview';
import type { RootTabParamList } from '../navigation/types';
import { useWatchlistStore } from '../store/watchlistStore';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { spacing } from '../theme/spacing';

function WatchlistHydratingSkeleton(): ReactElement {
  return (
    <View style={styles.hydrateRoot}>
      <View style={styles.skeletonHeader} />
      <View style={styles.skeletonRow}>
        <View style={styles.skeletonCard} />
        <View style={styles.skeletonCard} />
      </View>
      <View style={styles.skeletonRow}>
        <View style={styles.skeletonCard} />
        <View style={styles.skeletonCard} />
      </View>
    </View>
  );
}

export function WatchlistScreen(): ReactElement {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const items = useWatchlistStore((s) => s.items);
  const hydrated = useWatchlistStore((s) => s.hydrated);
  const remove = useWatchlistStore((s) => s.remove);
  const navigation = useNavigation<NavigationProp<RootTabParamList>>();

  const model = useWatchlistScreenModel(items);
  const anchorId = model.anchorForBecauseYouSaved?.id ?? null;
  const similar = useWatchlistSimilarRow(
    items.length > 0 ? anchorId : null,
  );
  const trending = useWatchlistTrendingPreview(
    hydrated && items.length === 0,
  );

  const gap = layout.watchlistGridGap;
  const horizontalPad = spacing.md;
  const cardWidth = (width - horizontalPad * 2 - gap) / 2;

  const navigateToDetail = (movieId: string): void => {
    navigation.navigate('HomeTab', {
      screen: 'Detail',
      params: { movieId },
    });
  };

  if (!hydrated) {
    return (
      <View
        style={[
          styles.root,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <WatchlistHydratingSkeleton />
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <WatchlistEmptyState
          trendingMovies={trending.movies}
          trendingStatus={trending.status}
          onBrowseTrending={() => {
            navigation.navigate('HomeTab', { screen: 'HomeMain' });
          }}
          onSelectMovie={(movieId) => {
            navigateToDetail(movieId);
          }}
        />
        <View style={{ height: insets.bottom + layout.tabBarStackPadding }} />
      </View>
    );
  }

  const anchorTitle = model.anchorForBecauseYouSaved?.title ?? '';

  const listHeader = (
    <View>
      <WatchlistHeader
        onPressProfile={() => {
          navigation.navigate('ProfileTab');
        }}
        onPressSearch={() => {
          navigation.navigate('SearchTab', { screen: 'SearchMain' });
        }}
      />
      <WatchlistFilterChips
        onChange={model.setFilter}
        value={model.filter}
      />
      {anchorId !== null ? (
        <BecauseYouSavedRow
          onSeeAll={() => {
            navigation.navigate('HomeTab', {
              screen: 'SeeAll',
              params: {
                title: 'Because you saved',
                listType: 'similar',
                movieId: anchorId,
              },
            });
          }}
          onSelectMovie={navigateToDetail}
          savedTitle={anchorTitle}
          similarMovies={similar.movies}
          similarStatus={similar.status}
        />
      ) : null}
    </View>
  );

  return (
    <View style={styles.root}>
      <FlatList
        extraData={model.filter}
        ListEmptyComponent={
          model.filter !== 'all' ? (
            <WatchlistFilterEmpty
              filter={model.filter}
              onBrowseAll={() => {
                model.setFilter('all');
              }}
            />
          ) : null
        }
        ListHeaderComponent={listHeader}
        columnWrapperStyle={
          model.filteredItems.length > 1
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
        data={model.filteredItems}
        keyExtractor={(item: WatchlistItem) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <WatchlistGridCard
            cardWidth={cardWidth}
            item={item}
            onPressDetails={() => {
              navigateToDetail(item.id);
            }}
            onPressRemove={() => {
              remove(item.id);
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
  hydrateRoot: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  skeletonHeader: {
    height: 72,
    borderRadius: spacing.sm,
    backgroundColor: colors.surface_container,
    marginBottom: spacing.md,
  },
  skeletonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  skeletonCard: {
    width: '48%',
    aspectRatio: 2 / 3,
    borderRadius: spacing.md,
    backgroundColor: colors.surface_container,
  },
});
