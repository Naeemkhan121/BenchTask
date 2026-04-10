import Toast from 'react-native-toast-message';
import { layout } from '../theme/layout';
import { spacing } from '../theme/spacing';

/** Shown when Profile (or similar) is not available yet; clears the bottom tab bar. */
export function showComingSoonToast(): void {
  Toast.show({
    type: 'info',
    text1: 'Coming Soon',
    position: 'bottom',
    visibilityTime: 2800,
    bottomOffset: layout.tabBarStackPadding + spacing.md,
  });
}

export function showWatchlistErrorToast(): void {
  Toast.show({
    type: 'info',
    text1: 'Could not update watchlist',
    text2: 'Please try again.',
    position: 'bottom',
    visibilityTime: 2600,
    bottomOffset: layout.tabBarStackPadding + spacing.md,
  });
}

export function showShareErrorToast(): void {
  Toast.show({
    type: 'info',
    text1: 'Could not share',
    text2: 'Please try again.',
    position: 'bottom',
    visibilityTime: 2600,
    bottomOffset: layout.tabBarStackPadding + spacing.md,
  });
}
