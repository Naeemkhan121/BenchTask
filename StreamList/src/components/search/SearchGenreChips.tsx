import type { ReactElement } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { GenreChip } from '../../api/movies';
import { colors } from '../../theme/colors';
import { layout } from '../../theme/layout';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export interface SearchGenreChipsProps {
  chips: GenreChip[];
  isLoading: boolean;
  /**
   * Label of the chip to show as selected (Home strip: `secondary_container` + `on_surface`).
   * Use `'All'` when the search field is empty; `null` when the query does not match any chip.
   */
  selectedLabel: string | null;
  onChipPress: (label: string) => void;
}

export function SearchGenreChips({
  chips,
  isLoading,
  selectedLabel,
  onChipPress,
}: SearchGenreChipsProps): ReactElement {
  if (isLoading && chips.length === 0) {
    return (
      <View style={styles.skeletonRow}>
        {Array.from({ length: 7 }).map((_, i) => (
          <View
            key={i}
            style={[styles.skeletonChip, i < 6 && styles.skeletonChipMargin]}
          />
        ))}
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      contentContainerStyle={styles.scrollContent}
      showsHorizontalScrollIndicator={false}
    >
      {chips.map((chip, index) => {
        const isLast = index === chips.length - 1;
        const active =
          selectedLabel !== null && chip.label === selectedLabel;
        return (
          <Pressable
            key={`${chip.label}-${String(chip.genreId ?? 'all')}-${String(index)}`}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => {
              onChipPress(chip.label);
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
              {chip.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  chipSpacing: {
    marginRight: spacing.sm,
  },
  chip: {
    paddingHorizontal: layout.genreChipPaddingHorizontal,
    paddingVertical: layout.genreChipPaddingVertical,
    borderRadius: spacing.lg,
  },
  chipActive: {
    backgroundColor: colors.secondary_container,
  },
  chipInactive: {
    backgroundColor: colors.surface_container_high,
  },
  chipPressed: {
    opacity: 0.9,
  },
  chipTextActive: {
    color: colors.on_surface,
  },
  chipTextInactive: {
    color: colors.on_surface_variant,
  },
  skeletonRow: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  skeletonChip: {
    width: spacing.xl * 3,
    height: spacing.xl + spacing.sm,
    borderRadius: spacing.lg,
    backgroundColor: colors.surface_container_high,
  },
  skeletonChipMargin: {
    marginRight: spacing.sm,
  },
});
