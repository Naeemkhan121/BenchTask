import type { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

const GRID_COLUMNS = 3;
const SKELETON_ROWS = 4;

export interface SeeAllGridSkeletonProps {
  cardWidth: number;
  posterHeight: number;
  columnGap: number;
  rowGap: number;
  horizontalPadding: number;
}

export function SeeAllGridSkeleton({
  cardWidth,
  posterHeight,
  columnGap,
  rowGap,
  horizontalPadding,
}: SeeAllGridSkeletonProps): ReactElement {
  const rows = Array.from({ length: SKELETON_ROWS }).map((_, row) => (
    <View
      key={row}
      style={[
        styles.row,
        {
          gap: columnGap,
          marginBottom: rowGap,
        },
      ]}
    >
      {Array.from({ length: GRID_COLUMNS }).map((__, col) => (
        <View
          key={col}
          style={[
            styles.posterSk,
            {
              width: cardWidth,
              height: posterHeight,
            },
          ]}
        />
      ))}
    </View>
  ));

  return (
    <View
      accessibilityState={{ busy: true }}
      style={[styles.gridRoot, { paddingHorizontal: horizontalPadding }]}
    >
      {rows}
    </View>
  );
}

export interface SeeAllFooterSkeletonProps {
  cardWidth: number;
  posterHeight: number;
  columnGap: number;
}

export function SeeAllFooterSkeleton({
  cardWidth,
  posterHeight,
  columnGap,
}: SeeAllFooterSkeletonProps): ReactElement {
  return (
    <View style={styles.footerWrap}>
      <Text style={styles.footerLabel}>LOADING MORE CONTENT</Text>
      <View style={[styles.footerRow, { gap: columnGap }]}>
        {Array.from({ length: GRID_COLUMNS }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.posterSk,
              {
                width: cardWidth,
                height: posterHeight,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gridRoot: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  posterSk: {
    borderRadius: spacing.sm,
    backgroundColor: colors.surface_container,
  },
  footerWrap: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  footerLabel: {
    ...typography['label-sm'],
    color: colors.on_surface_variant,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
