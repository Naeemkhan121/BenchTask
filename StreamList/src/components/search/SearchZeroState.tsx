import type { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme/colors';
import { layout } from '../../theme/layout';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export interface SearchZeroStateProps {
  query: string;
}

export function SearchZeroState({ query }: SearchZeroStateProps): ReactElement {
  return (
    <View style={styles.root}>
      <MaterialCommunityIcons
        color={colors.on_surface_variant}
        name="movie-search-outline"
        size={spacing.xl * 2}
        style={styles.icon}
      />
      <Text style={styles.title}>{`No results for '${query}'`}</Text>
      <Text style={styles.body}>
        Try a different title, spelling, or browse trending titles below when you
        clear the search.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  icon: {
    marginBottom: spacing.md,
    opacity: 0.85,
  },
  title: {
    ...typography['headline-md'],
    color: colors.on_surface,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  body: {
    ...typography['body-md'],
    color: colors.on_surface_variant,
    textAlign: 'center',
    maxWidth: layout.contentPosterWidth * 3,
  },
});
