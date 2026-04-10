import type { ReactElement } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { MovieSummary } from '../../api/types';
import { colors } from '../../theme/colors';
import { layout } from '../../theme/layout';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { buildPosterUrl } from '../../utils/image';

export interface ContentCardProps {
  movie: MovieSummary;
  onPress: () => void;
  /** When set, poster and card width follow this value; height keeps a 2:3 ratio. */
  posterWidth?: number;
}

export function ContentCard({
  movie,
  onPress,
  posterWidth: posterWidthProp,
}: ContentCardProps): ReactElement {
  const uri = buildPosterUrl(movie.poster_path);
  const posterW = posterWidthProp ?? layout.contentPosterWidth;
  const posterH = Math.round((posterW * 3) / 2);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.pressable,
        { width: posterW },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.column, { width: posterW }]}>
        <View style={styles.imageWrap}>
          {uri.length > 0 ? (
            <Image
              accessibilityIgnoresInvertColors
              source={{ uri }}
              style={[styles.image, { width: posterW, height: posterH }]}
            />
          ) : (
            <View
              style={[
                styles.image,
                styles.placeholder,
                { width: posterW, height: posterH },
              ]}
            />
          )}
        </View>
        <Text
          ellipsizeMode="tail"
          numberOfLines={2}
          style={[styles.title, { width: posterW }]}
        >
          {movie.title}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    maxWidth: '100%',
  },
  column: {
    alignItems: 'flex-start',
  },
  pressed: {
    opacity: 0.92,
  },
  imageWrap: {
    borderRadius: spacing.sm,
    overflow: 'hidden',
    alignSelf: 'stretch',
  },
  image: {
    backgroundColor: colors.surface_container_high,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography['title-sm'],
    color: colors.on_surface,
    marginTop: spacing.xs,
    /** Explicit line height avoids iOS clipping/wrap glitches with Inter + fixed column width. */
    lineHeight: 20,
  },
});
