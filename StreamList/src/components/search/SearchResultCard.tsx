import type { ReactElement } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { MovieSearchHit } from '../../api/types';
import { colors } from '../../theme/colors';
import { layout } from '../../theme/layout';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { buildPosterUrl } from '../../utils/image';
import { releaseYear } from '../../utils/watchlistItem';

export interface SearchResultCardProps {
  movie: MovieSearchHit;
  cardWidth: number;
  onPress: () => void;
}

export function SearchResultCard({
  movie,
  cardWidth,
  onPress,
}: SearchResultCardProps): ReactElement {
  const posterHeight = (cardWidth * 3) / 2;
  const uri = buildPosterUrl(movie.poster_path);
  const year = releaseYear(movie.release_date);
  const rating =
    movie.vote_average > 0 ? movie.vote_average.toFixed(1) : '—';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.root,
        { width: cardWidth },
        pressed && styles.pressed,
      ]}
    >
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
        <View style={styles.ratingBadge} pointerEvents="none">
          <MaterialCommunityIcons
            color={colors.primary_container}
            name="star"
            size={layout.iconSizeSm}
          />
          <Text style={styles.ratingText}>{rating}</Text>
        </View>
      </View>
      <Text numberOfLines={2} style={styles.title}>
        {movie.title}
      </Text>
      {year !== null ? (
        <Text style={styles.year}>{year}</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    maxWidth: '100%',
  },
  pressed: {
    opacity: 0.92,
  },
  posterWrap: {
    borderRadius: spacing.sm,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  poster: {
    width: '100%',
    backgroundColor: colors.surface_container_high,
  },
  placeholder: {
    backgroundColor: colors.surface_container_high,
  },
  ratingBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface_container_lowest,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    borderRadius: spacing.sm,
  },
  ratingText: {
    ...typography['label-sm'],
    color: colors.on_surface,
    fontWeight: '600',
  },
  title: {
    ...typography['title-lg'],
    color: colors.on_surface,
  },
  year: {
    ...typography['label-sm'],
    color: colors.on_surface_variant,
    marginTop: spacing.xs,
  },
});
