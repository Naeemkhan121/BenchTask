import type { ReactElement } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme/colors';
import { layout } from '../../theme/layout';
import { spacing } from '../../theme/spacing';
import { buildBackdropUrl, buildPosterUrl } from '../../utils/image';

export interface DetailHeroProps {
  backdropPath: string | null;
  posterPath: string | null;
}

export function DetailHero({
  backdropPath,
  posterPath,
}: DetailHeroProps): ReactElement {
  const backdropUri = buildBackdropUrl(backdropPath);
  const posterUri = buildPosterUrl(posterPath);
  const uri = backdropUri.length > 0 ? backdropUri : posterUri;

  return (
    <View
      accessibilityRole="image"
      style={styles.wrap}
    >
      {uri.length > 0 ? (
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="cover"
          source={{ uri }}
          style={styles.image}
        />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <MaterialCommunityIcons
            color={colors.on_surface_variant}
            name="play-box-multiple"
            size={spacing.xl * 2}
          />
        </View>
      )}
      <LinearGradient
        colors={[colors.surface_clear, colors.surface]}
        locations={[0, 1]}
        pointerEvents="none"
        style={styles.gradient}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    height: layout.heroMinHeight,
    backgroundColor: colors.surface_container_high,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface_container_high,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '40%',
  },
});
