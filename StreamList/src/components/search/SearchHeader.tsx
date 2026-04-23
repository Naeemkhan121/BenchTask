import type { ReactElement } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme/colors';
import { layout } from '../../theme/layout';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { showComingSoonToast } from '../../utils/toast';

export function SearchHeader(): ReactElement {
  const iconSize = layout.iconSizeMd;

  return (
    <View style={styles.row}>
      <View style={styles.brand}>
        <MaterialCommunityIcons
          color={colors.primary_container}
          name="movie-roll"
          size={iconSize}
        />
        <Text style={styles.wordmark}>STREAMLIST</Text>
      </View>
      <Pressable
        accessibilityLabel="Profile"
        accessibilityRole="button"
        accessibilityState={{ disabled: true }}
        onPress={() => {
          showComingSoonToast();
        }}
        hitSlop={spacing.sm}
        style={styles.avatar}
      >
        <MaterialCommunityIcons
          color={colors.on_surface_variant}
          name="account-circle-outline"
          size={layout.iconSizeMd + spacing.sm}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    minHeight: layout.headerBarContentHeight,
    paddingBottom: spacing.xs,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexShrink: 1,
  },
  wordmark: {
    ...typography['brand-wordmark'],
    color: colors.primary_container,
  },
  avatar: {
    opacity: 0.9,
  },
});
