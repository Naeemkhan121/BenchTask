import type { ReactElement } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme/colors';
import { layout } from '../../theme/layout';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export interface WatchlistHeaderProps {
  onPressSearch: () => void;
  onPressProfile: () => void;
}

export function WatchlistHeader({
  onPressSearch,
  onPressProfile,
}: WatchlistHeaderProps): ReactElement {
  const insets = useSafeAreaInsets();
  const iconSize = layout.iconSizeMd;

  return (
    <View style={[styles.wrap, { paddingTop: insets.top }]}>
      <View style={styles.textBlock}>
        <Text style={styles.label}>YOUR COLLECTION</Text>
        <Text style={styles.title}>My Watchlist</Text>
      </View>
      <View style={styles.actions}>
        <Pressable
          accessibilityLabel="Search"
          accessibilityRole="button"
          hitSlop={spacing.sm}
          onPress={onPressSearch}
          style={({ pressed }) => [pressed && styles.pressed]}
        >
          <MaterialCommunityIcons
            color={colors.on_surface}
            name="magnify"
            size={iconSize}
          />
        </Pressable>
        <Pressable
          accessibilityLabel="Profile"
          accessibilityRole="button"
          hitSlop={spacing.sm}
          onPress={onPressProfile}
          style={({ pressed }) => [styles.avatar, pressed && styles.pressed]}
        >
          <MaterialCommunityIcons
            color={colors.on_surface}
            name="account-circle"
            size={iconSize + 4}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  textBlock: {
    flex: 1,
    marginRight: spacing.md,
  },
  label: {
    ...typography['label-sm-tracked'],
    color: colors.on_surface_variant,
    textTransform: 'uppercase',
  },
  title: {
    ...typography['display-md'],
    color: colors.on_surface,
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  avatar: {
    borderRadius: layout.iconSizeMd,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.88,
  },
});
