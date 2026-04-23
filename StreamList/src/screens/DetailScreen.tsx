import type { NavigationProp, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DetailCastSection } from '../components/detail/DetailCastSection';
import { DetailHero } from '../components/detail/DetailHero';
import { DetailMetadataChips } from '../components/detail/DetailMetadataChips';
import { DetailMoreLikeThis } from '../components/detail/DetailMoreLikeThis';
import { DetailSectionError } from '../components/detail/DetailSectionError';
import {
  DetailCastSkeleton,
  DetailDetailsBlockSkeleton,
  DetailHeroSkeleton,
  DetailSimilarSkeleton,
} from '../components/detail/DetailSkeletons';
import { DetailSynopsis } from '../components/detail/DetailSynopsis';
import { DetailWatchlistButton } from '../components/detail/DetailWatchlistButton';
import { useMovieDetail } from '../hooks/useMovieDetail';
import type {
  HomeStackParamList,
  RootTabParamList,
  SearchStackParamList,
} from '../navigation/types';
import { useWatchlistStore } from '../store/watchlistStore';
import { colors } from '../theme/colors';
import { shareMovieDetail } from '../utils/shareMovie';
import { layout } from '../theme/layout';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type DetailRouteParams = { movieId: string };

export type DetailScreenProps = {
  route: RouteProp<{ Detail: DetailRouteParams }, 'Detail'>;
  navigation:
    | NativeStackNavigationProp<HomeStackParamList, 'Detail'>
    | NativeStackNavigationProp<SearchStackParamList, 'Detail'>;
};

export function DetailScreen({
  route,
  navigation,
}: DetailScreenProps): ReactElement {
  const { movieId } = route.params;
  const insets = useSafeAreaInsets();
  const { details, credits, similar } = useMovieDetail(movieId);

  const hydrated = useWatchlistStore((s) => s.hydrated);
  const toggleWatchlist = useWatchlistStore((s) => s.toggle);
  const detailId = details.data?.id;
  const inWatchlist = useWatchlistStore((s) =>
    detailId !== undefined
      ? s.items.some((i) => i.id === detailId)
      : false,
  );

  const canShare = details.status === 'success' && details.data !== null;

  const onPressShare = useCallback(() => {
    if (details.data === null) {
      return;
    }
    void shareMovieDetail(details.data);
  }, [details.data]);

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {details.status === 'loading' ? (
          <>
            <DetailHeroSkeleton />
            <View style={styles.padded}>
              <DetailDetailsBlockSkeleton />
            </View>
          </>
        ) : null}

        {details.status === 'error' ? (
          <View style={[styles.padded, { paddingTop: insets.top + spacing.xl * 2 }]}>
            <DetailSectionError
              message={details.error ?? 'Something went wrong'}
              onRetry={() => {
                details.retry().catch(() => {
                  /* surfaced via hook state */
                });
              }}
            />
          </View>
        ) : null}

        {details.status === 'success' && details.data !== null ? (
          <>
            <DetailHero
              backdropPath={details.data.backdrop_path}
              posterPath={details.data.poster_path}
            />
            <View style={styles.padded}>
              <Text style={styles.title}>{details.data.title}</Text>
              <DetailMetadataChips movie={details.data} />
              <DetailWatchlistButton
                hydrated={hydrated}
                inWatchlist={inWatchlist}
                onToggle={() => {
                  if (details.data !== null) {
                    toggleWatchlist(details.data);
                  }
                }}
              />
              <DetailSynopsis overview={details.data.overview} />
            </View>
          </>
        ) : null}

        {credits.status === 'loading' ? (
          <View style={styles.padded}>
            <DetailCastSkeleton />
          </View>
        ) : null}

        {credits.status === 'error' ? (
          <View style={styles.padded}>
            <DetailSectionError
              message={credits.error ?? 'Something went wrong'}
              onRetry={() => {
                credits.retry().catch(() => {
                  /* surfaced via hook state */
                });
              }}
            />
          </View>
        ) : null}

        {credits.status === 'success' && credits.data !== null ? (
          <View style={styles.padded}>
            <DetailCastSection cast={credits.data} />
          </View>
        ) : null}

        {similar.status === 'loading' ? (
          <View style={styles.padded}>
            <DetailSimilarSkeleton />
          </View>
        ) : null}

        {similar.status === 'error' ? (
          <View style={styles.padded}>
            <DetailSectionError
              message={similar.error ?? 'Something went wrong'}
              onRetry={() => {
                similar.retry().catch(() => {
                  /* surfaced via hook state */
                });
              }}
            />
          </View>
        ) : null}

        {similar.status === 'success' &&
        similar.data !== null &&
        similar.data.length > 0 ? (
          <View style={styles.padded}>
            <DetailMoreLikeThis
              movies={similar.data}
              onSeeAll={() => {
                const tabNav = navigation.getParent() as
                  | NavigationProp<RootTabParamList>
                  | undefined;
                if (tabNav !== undefined) {
                  tabNav.navigate('HomeTab', {
                    screen: 'SeeAll',
                    params: {
                      title: 'More Like This',
                      listType: 'similar',
                      movieId,
                    },
                  });
                }
              }}
              onSelectMovie={(id) => {
                const nav = navigation as NativeStackNavigationProp<
                  HomeStackParamList,
                  'Detail'
                >;
                nav.push('Detail', { movieId: id });
              }}
            />
          </View>
        ) : null}
      </ScrollView>

      <View
        pointerEvents="box-none"
        style={[styles.headerOverlay, { paddingTop: insets.top }]}
      >
        <View style={styles.headerRow}>
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            hitSlop={spacing.sm}
            onPress={() => {
              navigation.goBack();
            }}
            style={({ pressed }) => [pressed && styles.headerPressed]}
          >
            <MaterialCommunityIcons
              color={colors.icon_on_dark}
              name="arrow-left"
              size={layout.iconSizeMd}
            />
          </Pressable>
          <Pressable
            accessibilityLabel="Share movie"
            accessibilityRole="button"
            accessibilityState={{ disabled: !canShare }}
            disabled={!canShare}
            hitSlop={spacing.sm}
            onPress={onPressShare}
            style={({ pressed }) => [
              !canShare && styles.headerIconDisabled,
              pressed && canShare && styles.headerPressed,
            ]}
          >
            <MaterialCommunityIcons
              color={colors.icon_on_dark}
              name="share-variant-outline"
              size={layout.iconSizeMd}
            />
          </Pressable>
        </View>
      </View>
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
  },
  padded: {
    width: '100%',
    maxWidth: '100%',
    alignSelf: 'stretch',
    paddingHorizontal: spacing.md,
  },
  title: {
    ...typography['display-md'],
    color: colors.on_surface,
    marginTop: spacing.md,
  },
  headerOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 10,
    elevation: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  headerPressed: {
    opacity: 0.85,
  },
  headerIconDisabled: {
    opacity: 0.45,
  },
});
