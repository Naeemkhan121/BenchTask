import type { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../../theme/colors';
import { layout } from '../../theme/layout';
import { spacing } from '../../theme/spacing';

export function DetailHeroSkeleton(): ReactElement {
  return (
    <View
      accessibilityState={{ busy: true }}
      style={styles.hero}
    />
  );
}

export function DetailDetailsBlockSkeleton(): ReactElement {
  return (
    <View accessibilityState={{ busy: true }} style={styles.detailsBlock}>
      <View style={styles.titleLine} />
      <View style={styles.titleLineShort} />
      <View style={styles.chipRow}>
        <View style={styles.chip} />
        <View style={styles.chip} />
        <View style={styles.chip} />
      </View>
      <View style={styles.watchlistSk} />
      <View style={styles.bodyLine} />
      <View style={styles.bodyLine} />
      <View style={styles.bodyLineShort} />
    </View>
  );
}

export function DetailCastSkeleton(): ReactElement {
  return (
    <View accessibilityState={{ busy: true }} style={styles.castBlock}>
      <View style={styles.castTitle} />
      <View style={styles.castRow}>
        {[0, 1, 2, 3].map((k) => (
          <View key={k} style={styles.castItem}>
            <View style={styles.castCircle} />
            <View style={styles.castText} />
            <View style={styles.castTextShort} />
          </View>
        ))}
      </View>
    </View>
  );
}

export function DetailSimilarSkeleton(): ReactElement {
  return (
    <View accessibilityState={{ busy: true }} style={styles.similarBlock}>
      <View style={styles.similarHeader}>
        <View style={styles.similarTitle} />
        <View style={styles.similarSee} />
      </View>
      <View style={styles.similarRow}>
        {[0, 1, 2].map((k) => (
          <View key={k} style={styles.posterSk} />
        ))}
      </View>
    </View>
  );
}

const sk = {
  bg: colors.surface_container,
  radius: spacing.xs,
};

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    height: layout.heroMinHeight,
    backgroundColor: sk.bg,
  },
  detailsBlock: {
    marginTop: spacing.md,
  },
  titleLine: {
    height: spacing.lg,
    borderRadius: sk.radius,
    backgroundColor: sk.bg,
    width: '88%',
  },
  titleLineShort: {
    height: spacing.lg,
    borderRadius: sk.radius,
    backgroundColor: sk.bg,
    width: '62%',
    marginTop: spacing.xs,
  },
  chipRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  chip: {
    width: spacing.xl * 2,
    height: spacing.lg,
    borderRadius: sk.radius,
    backgroundColor: colors.surface_container_highest,
    marginRight: spacing.sm,
  },
  watchlistSk: {
    height: spacing.xl * 2,
    borderRadius: spacing.sm,
    backgroundColor: sk.bg,
    marginTop: spacing.md,
    width: '100%',
  },
  bodyLine: {
    height: spacing.md,
    borderRadius: sk.radius,
    backgroundColor: sk.bg,
    width: '100%',
    marginTop: spacing.sm,
  },
  bodyLineShort: {
    height: spacing.md,
    borderRadius: sk.radius,
    backgroundColor: sk.bg,
    width: '72%',
    marginTop: spacing.xs,
  },
  castBlock: {
    marginTop: spacing.lg,
  },
  castTitle: {
    height: spacing.xl,
    width: '30%',
    borderRadius: sk.radius,
    backgroundColor: sk.bg,
  },
  castRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  castItem: {
    alignItems: 'center',
    width: layout.castAvatarSize + spacing.md,
    marginRight: spacing.md,
  },
  castCircle: {
    width: layout.castAvatarSize,
    height: layout.castAvatarSize,
    borderRadius: layout.castAvatarSize / 2,
    backgroundColor: sk.bg,
  },
  castText: {
    height: spacing.sm,
    width: '90%',
    marginTop: spacing.xs,
    borderRadius: sk.radius,
    backgroundColor: sk.bg,
  },
  castTextShort: {
    height: spacing.sm,
    width: '70%',
    marginTop: spacing.xs / 2,
    borderRadius: sk.radius,
    backgroundColor: sk.bg,
  },
  similarBlock: {
    marginTop: spacing.lg,
  },
  similarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  similarTitle: {
    height: spacing.xl,
    width: '45%',
    borderRadius: sk.radius,
    backgroundColor: sk.bg,
  },
  similarSee: {
    height: spacing.md,
    width: spacing.xl * 2,
    borderRadius: sk.radius,
    backgroundColor: sk.bg,
  },
  similarRow: {
    flexDirection: 'row',
  },
  posterSk: {
    width: layout.contentPosterWidth,
    height: layout.contentPosterHeight,
    borderRadius: spacing.sm,
    backgroundColor: sk.bg,
    marginRight: spacing.md,
  },
});
