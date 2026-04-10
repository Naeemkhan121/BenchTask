import type { ReactElement } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export interface DetailSectionErrorProps {
  message: string;
  onRetry: () => void;
}

export function DetailSectionError({
  message,
  onRetry,
}: DetailSectionErrorProps): ReactElement {
  return (
    <View style={styles.wrap}>
      <Text style={styles.message}>{message}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={onRetry}
        style={styles.retryPress}
      >
        <Text style={styles.retry}>Retry</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'flex-start',
  },
  message: {
    ...typography['body-md'],
    color: colors.on_surface_variant,
  },
  retryPress: {
    marginTop: spacing.sm,
    paddingVertical: spacing.xs,
  },
  retry: {
    ...typography['title-sm'],
    color: colors.primary_container,
  },
});
