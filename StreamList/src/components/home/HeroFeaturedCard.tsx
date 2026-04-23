import type { ReactElement } from 'react';
import {
  Dimensions,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { MovieSummary } from '../../api/types';
import { colors } from '../../theme/colors';
import { layout } from '../../theme/layout';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { buildBackdropUrl } from '../../utils/image';

const SCREEN_W = Dimensions.get('window').width;
const CARD_W = SCREEN_W * layout.heroWidthRatio;
const HERO_CARD_MIN_HEIGHT = Math.max(
  Math.round((CARD_W * layout.heroBackdropAspectH) / layout.heroBackdropAspectW),
  layout.heroMinHeight,
);

export interface HeroFeaturedCardProps {
  movie: MovieSummary | null;
  isLoading: boolean;
  error: string | null;
  onWatchNow: () => void;
  onDetails: () => void;
  onRetry: () => void;
}

export function HeroFeaturedCard({
  movie,
  isLoading,
  error,
  onWatchNow,
  onDetails,
  onRetry,
}: HeroFeaturedCardProps): ReactElement {
  if (isLoading) {
    return (
      <View style={[styles.card, styles.skeletonCard]}>
        <View style={styles.skeletonBackdrop} />
        <View style={styles.skeletonLines}>
          <View style={styles.skeletonBadge} />
          <View style={styles.skeletonTitle} />
          <View style={styles.skeletonBody} />
          <View style={styles.skeletonActions}>
            <View style={styles.skeletonButton} />
            <View style={styles.skeletonButtonSecondary} />
          </View>
        </View>
      </View>
    );
  }

  if (error !== null) {
    return (
      <View style={[styles.card, styles.errorCard]}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable accessibilityRole="button" onPress={onRetry} style={styles.retry}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (movie === null) {
    return (
      <View style={[styles.card, styles.errorCard]}>
        <Text style={styles.errorText}>No featured title right now.</Text>
      </View>
    );
  }

  const backdropUri = buildBackdropUrl(movie.backdrop_path);

  return (
    <View style={styles.card}>
      {backdropUri.length > 0 ? (
        <ImageBackground
          accessibilityIgnoresInvertColors
          imageStyle={styles.bgImage}
          source={{ uri: backdropUri }}
          style={styles.bg}
        >
          <LinearGradient
            colors={['transparent', colors.surface]}
            locations={[0, 1]}
            style={styles.gradient}
          />
          <View style={styles.inner}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>NEW RELEASE</Text>
            </View>
            <Text numberOfLines={2} style={styles.heroTitle}>
              {movie.title}
            </Text>
            <Text numberOfLines={2} style={styles.synopsis}>
              {movie.overview}
            </Text>
            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                onPress={onWatchNow}
                style={({ pressed }) => [
                  styles.watchBtn,
                  pressed && styles.pressed,
                ]}
              >
                <LinearGradient
                  colors={[colors.primary_container, colors.secondary_container]}
                  end={{ x: 1, y: 1 }}
                  start={{ x: 0, y: 0 }}
                  style={styles.watchGradientFill}
                >
                  <View style={styles.watchGradientRow}>
                    <MaterialCommunityIcons
                      color={colors.on_surface}
                      name="play"
                      size={layout.iconSizeMd}
                      style={styles.watchIcon}
                    />
                    <Text numberOfLines={1} style={styles.watchLabel}>
                      Watch Now
                    </Text>
                  </View>
                </LinearGradient>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={onDetails}
                style={({ pressed }) => [
                  styles.detailsBtn,
                  pressed && styles.pressed,
                ]}
              >
                <Text numberOfLines={1} style={styles.detailsLabel}>
                  Details
                </Text>
              </Pressable>
            </View>
          </View>
        </ImageBackground>
      ) : (
        <View style={[styles.bg, styles.fallbackBg]}>
          <LinearGradient
            colors={['transparent', colors.surface]}
            locations={[0, 1]}
            style={styles.gradient}
          />
          <View style={styles.inner}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>NEW RELEASE</Text>
            </View>
            <Text numberOfLines={2} style={styles.heroTitle}>
              {movie.title}
            </Text>
            <Text numberOfLines={2} style={styles.synopsis}>
              {movie.overview}
            </Text>
            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                onPress={onWatchNow}
                style={({ pressed }) => [
                  styles.watchBtn,
                  pressed && styles.pressed,
                ]}
              >
                <LinearGradient
                  colors={[colors.primary_container, colors.secondary_container]}
                  end={{ x: 1, y: 1 }}
                  start={{ x: 0, y: 0 }}
                  style={styles.watchGradientFill}
                >
                  <View style={styles.watchGradientRow}>
                    <MaterialCommunityIcons
                      color={colors.on_surface}
                      name="play"
                      size={layout.iconSizeMd}
                      style={styles.watchIcon}
                    />
                    <Text numberOfLines={1} style={styles.watchLabel}>
                      Watch Now
                    </Text>
                  </View>
                </LinearGradient>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={onDetails}
                style={({ pressed }) => [
                  styles.detailsBtn,
                  pressed && styles.pressed,
                ]}
              >
                <Text numberOfLines={1} style={styles.detailsLabel}>
                  Details
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const GRADIENT_HEIGHT = '40%';

const styles = StyleSheet.create({
  card: {
    width: CARD_W,
    alignSelf: 'center',
    borderRadius: spacing.md,
    overflow: 'hidden',
    minHeight: HERO_CARD_MIN_HEIGHT,
    marginBottom: spacing.md,
  },
  bg: {
    width: '100%',
    minHeight: HERO_CARD_MIN_HEIGHT,
    justifyContent: 'flex-end',
  },
  bgImage: {
    borderRadius: spacing.md,
  },
  fallbackBg: {
    backgroundColor: colors.surface_container,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    height: GRADIENT_HEIGHT,
    bottom: 0,
    top: undefined,
  },
  inner: {
    width: '100%',
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary_container,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.lg,
    marginBottom: spacing.sm,
  },
  badgeText: {
    ...typography['label-sm'],
    color: colors.on_surface,
    textTransform: 'uppercase',
  },
  heroTitle: {
    ...typography['display-md'],
    color: colors.on_surface,
    marginBottom: spacing.xs,
  },
  synopsis: {
    ...typography['body-md'],
    color: colors.on_surface_variant,
    marginBottom: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'stretch',
    width: '100%',
  },
  watchBtn: {
    flex: 1,
    minWidth: 0,
    marginRight: spacing.sm,
    borderRadius: spacing.sm,
    overflow: 'hidden',
  },
  watchGradientFill: {
    flex: 1,
    width: '100%',
    minHeight: layout.minTouchTarget,
    justifyContent: 'center',
    alignItems: 'center',
  },
  watchGradientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    width: '100%',
  },
  watchIcon: {
    marginRight: spacing.sm,
    flexShrink: 0,
  },
  watchLabel: {
    ...typography['title-sm'],
    color: colors.on_surface,
    flexShrink: 1,
  },
  detailsBtn: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: layout.minTouchTarget,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: spacing.sm,
    backgroundColor: colors.surface_container_highest,
  },
  detailsLabel: {
    ...typography['title-sm'],
    color: colors.on_surface,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.9,
  },
  skeletonCard: {
    backgroundColor: colors.surface_container,
    minHeight: HERO_CARD_MIN_HEIGHT + spacing.md,
  },
  skeletonBackdrop: {
    height: HERO_CARD_MIN_HEIGHT,
    backgroundColor: colors.surface_container_high,
  },
  skeletonLines: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  skeletonBadge: {
    width: spacing.xl * 4,
    height: spacing.lg,
    borderRadius: spacing.lg,
    backgroundColor: colors.surface_container_high,
  },
  skeletonTitle: {
    height: spacing.xl * 2,
    borderRadius: spacing.xs,
    backgroundColor: colors.surface_container_high,
  },
  skeletonBody: {
    height: spacing.lg,
    borderRadius: spacing.xs,
    backgroundColor: colors.surface_container_high,
  },
  skeletonActions: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: spacing.sm,
    width: '100%',
  },
  skeletonButton: {
    flex: 1,
    minWidth: 0,
    marginRight: spacing.sm,
    minHeight: layout.minTouchTarget,
    borderRadius: spacing.sm,
    backgroundColor: colors.surface_container_high,
  },
  skeletonButtonSecondary: {
    flex: 1,
    minWidth: 0,
    minHeight: layout.minTouchTarget,
    borderRadius: spacing.sm,
    backgroundColor: colors.surface_container_highest,
  },
  errorCard: {
    minHeight: HERO_CARD_MIN_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface_container,
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
});
