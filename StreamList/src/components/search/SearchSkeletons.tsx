import type { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export function SearchResultsGridSkeleton(): ReactElement {
  return (
    <View style={styles.grid}>
      {Array.from({ length: 6 }).map((_, i) => (
        <View key={i} style={styles.cell}>
          <View style={styles.poster} />
          <View style={styles.line} />
          <View style={styles.lineShort} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  cell: {
    width: '48%',
    marginBottom: spacing.md,
  },
  poster: {
    width: '100%',
    aspectRatio: 2 / 3,
    borderRadius: spacing.sm,
    backgroundColor: colors.surface_container_high,
    marginBottom: spacing.sm,
  },
  line: {
    height: spacing.md,
    borderRadius: spacing.xs,
    backgroundColor: colors.surface_container_high,
    marginBottom: spacing.xs,
  },
  lineShort: {
    height: spacing.sm,
    width: '40%',
    borderRadius: spacing.xs,
    backgroundColor: colors.surface_container_high,
  },
});
