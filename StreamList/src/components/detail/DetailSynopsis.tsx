import type { ReactElement } from 'react';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export interface DetailSynopsisProps {
  overview: string;
}

/** Rough threshold so ~3 lines at body-md width triggers toggle (avoids double layout measure). */
const APPROX_CHARS_FOR_THREE_LINES = 200;

export function DetailSynopsis({ overview }: DetailSynopsisProps): ReactElement {
  const [expanded, setExpanded] = useState(false);

  const showToggle = useMemo(
    () => overview.trim().length > APPROX_CHARS_FOR_THREE_LINES,
    [overview],
  );

  if (overview.length === 0) {
    return (
      <View style={styles.block}>
        <Text style={styles.headline}>Synopsis</Text>
        <Text style={styles.body}>No synopsis available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.block}>
      <Text style={styles.headline}>Synopsis</Text>
      <Text
        numberOfLines={expanded ? undefined : 3}
        style={styles.body}
      >
        {overview}
      </Text>
      {showToggle ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            setExpanded((v) => !v);
          }}
          style={styles.togglePress}
        >
          <Text style={styles.toggle}>
            {expanded ? 'Show less' : 'Read more'}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    marginTop: spacing.lg,
  },
  headline: {
    ...typography['headline-md'],
    color: colors.on_surface,
    marginBottom: spacing.sm,
  },
  body: {
    ...typography['body-md'],
    color: colors.on_surface,
  },
  togglePress: {
    marginTop: spacing.xs,
    alignSelf: 'flex-start',
  },
  toggle: {
    ...typography['body-md'],
    color: colors.primary_container,
  },
});
