import type { ReactElement } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { MovieSummary } from '../../api/types';
import { ContentCard } from '../common/ContentCard';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import type { SimilarRowStatus } from '../../hooks/useWatchlistSimilarRow';
import {
  DetailSimilarSkeleton,
} from '../detail/DetailSkeletons';

export interface BecauseYouSavedRowProps {
  savedTitle: string;
  similarStatus: SimilarRowStatus;
  similarMovies: MovieSummary[];
  onSeeAll: () => void;
  onSelectMovie: (movieId: string) => void;
}

export function BecauseYouSavedRow({
  savedTitle,
  similarStatus,
  similarMovies,
  onSeeAll,
  onSelectMovie,
}: BecauseYouSavedRowProps): ReactElement | null {
  const showLoading =
    similarStatus === 'loading' || similarStatus === 'idle';

  if (showLoading) {
    return (
      <View style={styles.section}>
        <View style={styles.headerRow}>
          <Text numberOfLines={1} style={styles.sectionTitle}>
            Because you saved {savedTitle}
          </Text>
          <Text style={styles.seeAllPlaceholder}>See All</Text>
        </View>
        <DetailSimilarSkeleton />
      </View>
    );
  }

  if (similarStatus === 'error' || similarMovies.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text numberOfLines={1} style={styles.sectionTitle}>
          Because you saved {savedTitle}
        </Text>
        <Pressable
          accessibilityLabel="See all similar titles"
          accessibilityRole="button"
          onPress={onSeeAll}
        >
          <Text style={styles.seeAll}>See All</Text>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        contentContainerStyle={styles.scrollContent}
        showsHorizontalScrollIndicator={false}
      >
        {similarMovies.map((m) => (
          <View key={m.id} style={styles.cardWrap}>
            <ContentCard
              movie={m}
              onPress={() => {
                onSelectMovie(m.id);
              }}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography['title-lg'],
    color: colors.on_surface,
    flex: 1,
  },
  seeAll: {
    ...typography['title-sm'],
    color: colors.primary_container,
  },
  seeAllPlaceholder: {
    ...typography['title-sm'],
    color: colors.on_surface_variant,
    opacity: 0.5,
  },
  scrollContent: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingBottom: spacing.xs,
  },
  cardWrap: {
    marginRight: spacing.sm,
  },
});
