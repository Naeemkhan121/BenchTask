import type { ReactElement } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { MovieSummary } from '../../api/types';
import type { UseSearchTrendingResult } from '../../hooks/useSearchTrending';
import { colors } from '../../theme/colors';
import { layout } from '../../theme/layout';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { SearchTrendingFeatured } from './SearchTrendingFeatured';
import { SearchTrendingGridCard } from './SearchTrendingGridCard';

export interface SearchTrendingSectionProps {
  trending: UseSearchTrendingResult;
  cardWidth: number;
  columnGap: number;
  onPressMovie: (movieId: string) => void;
}

export function SearchTrendingSection({
  trending,
  cardWidth,
  columnGap,
  onPressMovie,
}: SearchTrendingSectionProps): ReactElement {
  if (trending.status === 'loading') {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trending Now</Text>
        <View style={styles.featuredSk} />
        <View style={[styles.gridRow, { gap: columnGap }]}>
          <View style={[styles.gridSk, { width: cardWidth }]} />
          <View style={[styles.gridSk, { width: cardWidth }]} />
        </View>
        <View style={[styles.gridRow, { gap: columnGap }]}>
          <View style={[styles.gridSk, { width: cardWidth }]} />
          <View style={[styles.gridSk, { width: cardWidth }]} />
        </View>
      </View>
    );
  }

  if (trending.status === 'error') {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trending Now</Text>
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{trending.errorMessage}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={trending.retry}
            style={({ pressed }) => [
              styles.retry,
              pressed && styles.retryPressed,
            ]}
          >
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const featuredMeta = trending.featured;
  if (featuredMeta === null) {
    return <View />;
  }

  const gridPairs: MovieSummary[][] = [];
  for (let i = 0; i < trending.gridMovies.length; i += 2) {
    gridPairs.push(trending.gridMovies.slice(i, i + 2));
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Trending Now</Text>
      <SearchTrendingFeatured
        featured={featuredMeta}
        onPress={() => {
          onPressMovie(featuredMeta.movieId);
        }}
      />
      {gridPairs.map((pair, rowIndex) => (
        <View
          key={`trend-row-${String(rowIndex)}`}
          style={[styles.gridRow, { gap: columnGap }]}
        >
          {pair.map((m) => (
            <SearchTrendingGridCard
              key={m.id}
              cardWidth={cardWidth}
              movie={m}
              onPress={() => {
                onPressMovie(m.id);
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography['headline-md'],
    color: colors.on_surface,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  featuredSk: {
    alignSelf: 'center',
    width: '90%',
    height: layout.heroMinHeight + spacing.lg,
    borderRadius: spacing.md,
    backgroundColor: colors.surface_container_high,
    marginBottom: spacing.md,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  gridSk: {
    aspectRatio: 2 / 3,
    borderRadius: spacing.sm,
    backgroundColor: colors.surface_container_high,
  },
  errorBox: {
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  errorText: {
    ...typography['body-md'],
    color: colors.on_surface_variant,
    textAlign: 'center',
  },
  retry: {
    marginTop: spacing.sm,
    padding: spacing.sm,
  },
  retryPressed: {
    opacity: 0.85,
  },
  retryText: {
    ...typography['title-sm'],
    color: colors.primary_container,
  },
});
