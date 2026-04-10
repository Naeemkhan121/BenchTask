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

export interface DetailMoreLikeThisProps {
  movies: MovieSummary[];
  onSeeAll: () => void;
  onSelectMovie: (movieId: string) => void;
}

export function DetailMoreLikeThis({
  movies,
  onSeeAll,
  onSelectMovie,
}: DetailMoreLikeThisProps): ReactElement {
  if (movies.length === 0) {
    return <View />;
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>More Like This</Text>
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
        {movies.map((m) => (
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
  wrap: {
    marginTop: spacing.lg,
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
    flex: 1,
  },
  seeAll: {
    ...typography['title-sm'],
    color: colors.primary_container,
  },
  scrollContent: {
    flexDirection: 'row',
    paddingRight: spacing.md,
  },
  cardWrap: {
    marginRight: spacing.md,
  },
});
