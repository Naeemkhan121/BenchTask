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
import type { SearchTrendingFeaturedMeta } from '../../hooks/useSearchTrending';
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

export interface SearchTrendingFeaturedProps {
  featured: SearchTrendingFeaturedMeta;
  onPress: () => void;
}

export function SearchTrendingFeatured({
  featured,
  onPress,
}: SearchTrendingFeaturedProps): ReactElement {
  const backdropUri = buildBackdropUrl(featured.backdropPath);

  const inner = (
    <View style={styles.inner}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>FEATURED</Text>
      </View>
      <Text numberOfLines={2} style={styles.title}>
        {featured.title}
      </Text>
      <Text numberOfLines={2} style={styles.subtitle}>
        {featured.subtitle}
      </Text>
    </View>
  );

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
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
          {inner}
        </ImageBackground>
      ) : (
        <View style={[styles.bg, styles.fallbackBg]}>
          <LinearGradient
            colors={['transparent', colors.surface]}
            locations={[0, 1]}
            style={styles.gradient}
          />
          {inner}
        </View>
      )}
    </Pressable>
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
  pressed: {
    opacity: 0.92,
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
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.secondary_container,
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
  title: {
    ...typography['title-lg'],
    color: colors.on_surface,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography['body-md'],
    color: colors.on_surface_variant,
  },
});
