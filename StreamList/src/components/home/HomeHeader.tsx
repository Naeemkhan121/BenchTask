import type { ReactElement } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme/colors';
import { layout } from '../../theme/layout';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { showComingSoonToast } from '../../utils/toast';

export interface HomeHeaderProps {
  scrollY: Animated.Value;
}

export function HomeHeader({ scrollY }: HomeHeaderProps): ReactElement {
  const insets = useSafeAreaInsets();
  const iconSize = layout.iconSizeMd;

  const backgroundColor = scrollY.interpolate({
    inputRange: [0, 72],
    outputRange: [colors.surface, 'rgba(19, 19, 19, 0)'],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          paddingTop: insets.top,
          backgroundColor,
        },
      ]}
    >
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
          accessibilityLabel="Notifications"
          accessibilityRole="button"
          accessibilityState={{ disabled: true }}
          onPress={() => {
            showComingSoonToast();
          }}
          hitSlop={spacing.sm}
          style={styles.bell}
        >
          <MaterialCommunityIcons
            color={colors.on_surface_variant}
            name="bell-outline"
            size={iconSize}
          />
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
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
  bell: {
    opacity: 0.85,
  },
});
