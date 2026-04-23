import type { ReactElement } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme/colors';
import { layout } from '../../theme/layout';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export interface SearchRecentSectionProps {
  terms: string[];
  onClearAll: () => void;
  onSelectTerm: (term: string) => void;
}

export function SearchRecentSection({
  terms,
  onClearAll,
  onSelectTerm,
}: SearchRecentSectionProps): ReactElement {
  const hasTerms = terms.length > 0;

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Recent Searches</Text>
        {hasTerms ? (
          <Pressable
            accessibilityLabel="Clear all recent searches"
            accessibilityRole="button"
            hitSlop={spacing.sm}
            onPress={onClearAll}
          >
            <Text style={styles.clearAll}>CLEAR ALL</Text>
          </Pressable>
        ) : null}
      </View>
      {hasTerms ? (
        terms.map((term, index) => (
          <Pressable
            key={`${term}-${String(index)}`}
            accessibilityRole="button"
            onPress={() => {
              onSelectTerm(term);
            }}
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
          >
            <MaterialCommunityIcons
              color={colors.on_surface_variant}
              name="clock-outline"
              size={layout.iconSizeSm}
              style={styles.clock}
            />
            <Text style={styles.term}>{term}</Text>
          </Pressable>
        ))
      ) : (
        <Text style={styles.emptyHint}>No recent searches yet.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography['headline-md'],
    color: colors.on_surface,
  },
  clearAll: {
    ...typography['title-sm'],
    color: colors.primary_container,
    textTransform: 'uppercase',
  },
  emptyHint: {
    ...typography['body-md'],
    color: colors.on_surface_variant,
    paddingVertical: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  rowPressed: {
    opacity: 0.85,
  },
  clock: {
    marginRight: spacing.md,
  },
  term: {
    ...typography['body-md'],
    color: colors.on_surface,
    flex: 1,
  },
});
