import type { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography, type TypographyToken } from '../../theme/typography';

/**
 * Dev/reference-only: demonstrates semantic and legacy typography tokens.
 * Not used in production navigation; import where you want to preview fonts.
 */
export function TypographyExample(): ReactElement {
  return (
    <View style={styles.container} testID="typography-example">
      <Text style={[styles.block, typography.heading]}>Heading — Manrope Bold</Text>
      <Text style={[styles.block, typography.subheading]}>Subheading — Manrope SemiBold</Text>
      <Text style={[styles.block, typography.body]}>Body — Inter Regular. The quick brown fox.</Text>
      <Text style={[styles.block, typography.caption]}>Caption — Inter Regular smaller.</Text>
      <Text style={[styles.block, typography.overline]}>OVERLINE — TRACKED</Text>
      <Text style={[styles.block, typography['brand-wordmark']]}>StreamList (brand-wordmark)</Text>
    </View>
  );
}

/** Helper for typed variants when composing styles elsewhere. */
export function typographyStyle(token: TypographyToken) {
  return typography[token];
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.surface_container,
    gap: spacing.sm,
  },
  block: {
    color: colors.on_surface,
  },
});
