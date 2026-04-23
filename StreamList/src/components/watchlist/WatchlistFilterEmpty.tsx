import type { ReactElement } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import type { WatchlistFilter } from '../../utils/watchlistItem';

export interface WatchlistFilterEmptyProps {
  filter: Exclude<WatchlistFilter, 'all'>;
  onBrowseAll: () => void;
}

function filterLabel(filter: Exclude<WatchlistFilter, 'all'>): string {
  if (filter === 'movies') {
    return 'Movies';
  }
  return 'Series';
}

export function WatchlistFilterEmpty({
  filter,
  onBrowseAll,
}: WatchlistFilterEmptyProps): ReactElement {
  const label = filterLabel(filter);
  return (
    <View style={styles.wrap}>
      <Text style={styles.message}>
        No {label} in your watchlist yet
      </Text>
      <Pressable
        accessibilityLabel="Browse all watchlist items"
        accessibilityRole="button"
        onPress={onBrowseAll}
        style={({ pressed }) => [
          styles.chip,
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.chipLabel}>Browse All</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  message: {
    ...typography['body-md'],
    color: colors.on_surface_variant,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.lg,
    backgroundColor: colors.surface_container_highest,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.outline_variant,
  },
  chipLabel: {
    ...typography['title-sm'],
    color: colors.primary_container,
  },
  pressed: {
    opacity: 0.9,
  },
});
