import type { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { MovieDetail } from '../../api/types';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export interface DetailMetadataChipsProps {
  movie: MovieDetail;
}

function buildChips(movie: MovieDetail): { key: string; label: string }[] {
  const chips: { key: string; label: string }[] = [];
  if (movie.release_date !== null && movie.release_date.length >= 4) {
    chips.push({ key: 'year', label: movie.release_date.slice(0, 4) });
  }
  if (movie.vote_average > 0) {
    chips.push({
      key: 'rating',
      label: `★ ${movie.vote_average.toFixed(1)}`,
    });
  }
  const genre = movie.genres[0];
  if (genre !== undefined) {
    chips.push({ key: 'genre', label: genre.name });
  }
  if (movie.runtime !== null && movie.runtime > 0) {
    const h = Math.floor(movie.runtime / 60);
    const m = movie.runtime % 60;
    const label =
      h > 0 ? `${h}h ${m}m` : `${m}m`;
    chips.push({ key: 'runtime', label });
  }
  return chips;
}

export function DetailMetadataChips({
  movie,
}: DetailMetadataChipsProps): ReactElement {
  const chips = buildChips(movie);
  if (chips.length === 0) {
    return <View style={styles.row} />;
  }
  return (
    <View style={styles.row}>
      {chips.map((c, index) => (
        <View key={c.key} style={styles.chipWrap}>
          {index > 0 ? <Text style={styles.sep}>|</Text> : null}
          <View style={styles.chip}>
            <Text style={styles.chipText}>{c.label}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  chipWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sep: {
    ...typography['label-sm'],
    color: colors.on_surface_variant,
    marginHorizontal: spacing.xs,
  },
  chip: {
    backgroundColor: colors.surface_container_highest,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.xs,
  },
  chipText: {
    ...typography['label-sm'],
    color: colors.on_surface_variant,
  },
});
