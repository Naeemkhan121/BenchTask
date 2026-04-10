import type { ReactElement } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { WatchlistItem } from '../../api/types';
import { colors } from '../../theme/colors';
import { layout } from '../../theme/layout';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import {
  formatGenreSubtitle,
  releaseYear,
} from '../../utils/watchlistItem';
import { buildPosterUrl } from '../../utils/image';

export interface WatchlistGridCardProps {
  item: WatchlistItem;
  cardWidth: number;
  onPressDetails: () => void;
  onPressRemove: () => void;
}

export function WatchlistGridCard({
  item,
  cardWidth,
  onPressDetails,
  onPressRemove,
}: WatchlistGridCardProps): ReactElement {
  const posterHeight = (cardWidth * 3) / 2;
  const uri = buildPosterUrl(item.poster_path);
  const year = releaseYear(item.release_date);
  const genres = formatGenreSubtitle(item.genre_names);
  const subtitleParts = [year ?? '', genres].filter((p) => p.length > 0);
  const subtitle = subtitleParts.join(' • ');
  const rating =
    item.vote_average > 0 ? item.vote_average.toFixed(1) : '—';

  return (
    <View style={[styles.root, { width: cardWidth }]}>
      <View style={[styles.posterWrap, { height: posterHeight }]}>
        {uri.length > 0 ? (
          <Image
            accessibilityIgnoresInvertColors
            source={{ uri }}
            style={[styles.poster, { height: posterHeight }]}
          />
        ) : (
          <View
            style={[
              styles.poster,
              styles.placeholder,
              { height: posterHeight },
            ]}
          />
        )}
        <View style={styles.rightStack} pointerEvents="box-none">
          <View style={styles.ratingBadge}>
            <MaterialCommunityIcons
              color={colors.primary_container}
              name="star"
              size={layout.iconSizeSm}
            />
            <Text style={styles.ratingText}>{rating}</Text>
          </View>
          <Pressable
            accessibilityLabel="Remove from watchlist"
            accessibilityRole="button"
            hitSlop={spacing.sm}
            onPress={onPressRemove}
            style={({ pressed }) => [
              styles.removeBtn,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.removeIcon}>×</Text>
          </Pressable>
        </View>
      </View>
      <Text numberOfLines={2} style={styles.cardTitle}>
        {item.title}
      </Text>
      {subtitle.length > 0 ? (
        <Text numberOfLines={2} style={styles.meta}>
          {subtitle}
        </Text>
      ) : null}
      <Pressable
        accessibilityLabel={`Details for ${item.title}`}
        accessibilityRole="button"
        onPress={onPressDetails}
        style={({ pressed }) => [
          styles.detailsBtn,
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.detailsLabel}>Details</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    marginBottom: spacing.md,
  },
  posterWrap: {
    position: 'relative',
    borderRadius: spacing.md,
    overflow: 'hidden',
    backgroundColor: colors.surface_container_high,
  },
  poster: {
    width: '100%',
    borderRadius: spacing.md,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightStack: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.sm,
    backgroundColor: colors.surface_container_highest,
  },
  ratingText: {
    ...typography['label-sm'],
    color: colors.on_surface,
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surface_container_highest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeIcon: {
    ...typography['title-lg'],
    color: colors.on_surface,
    lineHeight: 24,
    marginTop: -2,
  },
  cardTitle: {
    ...typography['title-lg'],
    color: colors.on_surface,
    marginTop: spacing.sm,
  },
  meta: {
    ...typography['label-sm'],
    color: colors.on_surface_variant,
    marginTop: spacing.xs,
  },
  detailsBtn: {
    marginTop: spacing.sm,
    width: '100%',
    paddingVertical: spacing.sm,
    borderRadius: spacing.sm,
    backgroundColor: colors.surface_container_highest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsLabel: {
    ...typography['title-sm'],
    color: colors.on_surface,
  },
  pressed: {
    opacity: 0.9,
  },
});
