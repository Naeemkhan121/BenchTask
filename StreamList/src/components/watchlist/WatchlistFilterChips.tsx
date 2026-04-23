import type { ReactElement } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import type { WatchlistFilter } from '../../utils/watchlistItem';

const OPTIONS: { key: WatchlistFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'movies', label: 'Movies' },
  { key: 'series', label: 'Series' },
];

export interface WatchlistFilterChipsProps {
  value: WatchlistFilter;
  onChange: (value: WatchlistFilter) => void;
}

export function WatchlistFilterChips({
  value,
  onChange,
}: WatchlistFilterChipsProps): ReactElement {
  return (
    <View style={styles.row}>
      {OPTIONS.map((opt, index) => {
        const active = value === opt.key;
        const isLast = index === OPTIONS.length - 1;
        return (
          <Pressable
            key={opt.key}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => {
              onChange(opt.key);
            }}
            style={({ pressed }) => [
              styles.chip,
              !isLast && styles.chipSpacing,
              active ? styles.chipActive : styles.chipInactive,
              pressed && styles.chipPressed,
            ]}
          >
            <Text
              style={[
                typography['title-sm'],
                active ? styles.chipTextActive : styles.chipTextInactive,
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  chipSpacing: {
    marginRight: spacing.sm,
  },
  chipActive: {
    backgroundColor: colors.secondary_container,
    borderColor: colors.secondary_container,
  },
  chipInactive: {
    backgroundColor: colors.surface_container,
    borderColor: colors.outline_variant,
  },
  chipPressed: {
    opacity: 0.92,
  },
  chipTextActive: {
    color: colors.on_surface,
  },
  chipTextInactive: {
    color: colors.on_surface_variant,
  },
});
