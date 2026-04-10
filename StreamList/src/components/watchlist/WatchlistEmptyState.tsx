import type { ReactElement } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { MovieSummary } from '../../api/types';
import { ContentCard } from '../common/ContentCard';
import { colors } from '../../theme/colors';
import { layout } from '../../theme/layout';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import type { TrendingPreviewStatus } from '../../hooks/useWatchlistTrendingPreview';

export interface WatchlistEmptyStateProps {
  trendingStatus: TrendingPreviewStatus;
  trendingMovies: MovieSummary[];
  onBrowseTrending: () => void;
  onSelectMovie: (movieId: string) => void;
}

function SkeletonCards(): ReactElement {
  return (
    <ScrollView
      horizontal
      contentContainerStyle={styles.trendingScroll}
      showsHorizontalScrollIndicator={false}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <View key={String(i)} style={styles.skeletonCard} />
      ))}
    </ScrollView>
  );
}

export function WatchlistEmptyState({
  trendingStatus,
  trendingMovies,
  onBrowseTrending,
  onSelectMovie,
}: WatchlistEmptyStateProps): ReactElement {
  const showSkeleton =
    trendingStatus === 'loading' || trendingStatus === 'error';

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerBlock}>
        <Text style={styles.label}>YOUR COLLECTION</Text>
        <Text style={styles.title}>My Watchlist</Text>
        <Text style={styles.countLine}>0 titles</Text>
      </View>
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons
          color={colors.secondary_container}
          name="bookmark-outline"
          size={80}
        />
      </View>
      <Text style={styles.headline}>Your watchlist is empty</Text>
      <Text style={styles.body}>
        Save movies and shows you want to watch later and they&apos;ll appear
        here
      </Text>
      <Pressable
        accessibilityLabel="Browse trending now"
        accessibilityRole="button"
        onPress={onBrowseTrending}
        style={({ pressed }) => [styles.ctaPressable, pressed && styles.pressed]}
      >
        <LinearGradient
          colors={[colors.primary, colors.primary_container]}
          end={{ x: 1, y: 0.5 }}
          start={{ x: 0, y: 0.5 }}
          style={styles.ctaGradient}
        >
          <View style={styles.ctaInner}>
            <Text numberOfLines={1} style={styles.ctaLabel}>
              Browse Trending Now
            </Text>
          </View>
        </LinearGradient>
      </Pressable>
      <Text style={styles.popularLabel}>POPULAR RECOMMENDATIONS</Text>
      {showSkeleton ? (
        <SkeletonCards />
      ) : (
        <ScrollView
          horizontal
          contentContainerStyle={styles.trendingScroll}
          showsHorizontalScrollIndicator={false}
        >
          {trendingMovies.map((m) => (
            <View key={m.id} style={styles.trendingCardWrap}>
              <ContentCard
                movie={m}
                onPress={() => {
                  onSelectMovie(m.id);
                }}
              />
            </View>
          ))}
        </ScrollView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  headerBlock: {
    width: '100%',
    marginBottom: spacing.lg,
    paddingTop: spacing.xs,
  },
  label: {
    ...typography['label-sm-tracked'],
    color: colors.on_surface_variant,
    textTransform: 'uppercase',
  },
  title: {
    ...typography['display-md'],
    color: colors.on_surface,
    marginTop: spacing.xs,
  },
  countLine: {
    ...typography['body-md'],
    color: colors.on_surface_variant,
    marginTop: spacing.xs,
  },
  iconWrap: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  headline: {
    ...typography['headline-md'],
    color: colors.on_surface,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  body: {
    ...typography['body-md'],
    color: colors.on_surface_variant,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  ctaPressable: {
    width: '100%',
    alignSelf: 'stretch',
    borderRadius: spacing.sm,
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  ctaGradient: {
    width: '100%',
    minHeight: layout.minTouchTarget,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaInner: {
    width: '100%',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaLabel: {
    ...typography['title-sm'],
    color: colors.on_surface,
    textAlign: 'center',
  },
  popularLabel: {
    ...typography['label-sm-tracked'],
    color: colors.on_surface_variant,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    width: '100%',
  },
  trendingScroll: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: spacing.md,
  },
  trendingCardWrap: {
    marginRight: spacing.sm,
  },
  skeletonCard: {
    width: layout.contentPosterWidth,
    height: layout.contentPosterHeight,
    borderRadius: spacing.sm,
    backgroundColor: colors.surface_container,
  },
  pressed: {
    opacity: 0.92,
  },
});
