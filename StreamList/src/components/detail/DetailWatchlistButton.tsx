import type { ReactElement } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme/colors';
import { layout } from '../../theme/layout';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export interface DetailWatchlistButtonProps {
  inWatchlist: boolean;
  hydrated: boolean;
  onToggle: () => void;
}

export function DetailWatchlistButton({
  inWatchlist,
  hydrated,
  onToggle,
}: DetailWatchlistButtonProps): ReactElement {
  if (!hydrated) {
    return (
      <View
        accessibilityState={{ busy: true }}
        style={[styles.wrapper, styles.skeleton]}
      />
    );
  }

  if (inWatchlist) {
    return (
      <View style={styles.wrapper}>
        <Pressable
          accessibilityLabel="In Watchlist"
          accessibilityRole="button"
          onPress={onToggle}
          style={({ pressed }) => [
            styles.rowButton,
            pressed && styles.pressed,
          ]}
        >
          <MaterialCommunityIcons
            color={colors.primary_container}
            name="bookmark"
            size={layout.iconSizeMd}
            style={styles.leadIcon}
          />
          <Text style={styles.outlineLabel} numberOfLines={1}>
            In Watchlist
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <Pressable
        accessibilityLabel="Add to Watchlist"
        accessibilityRole="button"
        onPress={onToggle}
        style={({ pressed }) => [styles.fillPressable, pressed && styles.pressed]}
      >
        <LinearGradient
          colors={[colors.primary, colors.primary_container]}
          end={{ x: 1, y: 0.5 }}
          start={{ x: 0, y: 0.5 }}
          style={styles.gradientInner}
        >
          <MaterialCommunityIcons
            color={colors.on_surface}
            name="bookmark-plus-outline"
            size={layout.iconSizeMd}
            style={styles.leadIcon}
          />
          <Text style={styles.gradientLabel} numberOfLines={1}>
            Add to Watchlist
          </Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginTop: spacing.md,
  },
  fillPressable: {
    width: '100%',
    borderRadius: spacing.sm,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.92,
  },
  gradientInner: {
    width: '100%',
    minHeight: layout.minTouchTarget,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leadIcon: {
    marginRight: spacing.sm,
  },
  gradientLabel: {
    ...typography['title-sm'],
    color: colors.on_surface,
    flexShrink: 1,
    textAlign: 'center',
  },
  rowButton: {
    width: '100%',
    minHeight: layout.minTouchTarget,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface_container_highest,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.outline_variant,
  },
  outlineLabel: {
    ...typography['title-sm'],
    color: colors.on_surface,
    flexShrink: 1,
    textAlign: 'center',
  },
  skeleton: {
    minHeight: layout.minTouchTarget,
    borderRadius: spacing.sm,
    backgroundColor: colors.surface_container,
  },
});
