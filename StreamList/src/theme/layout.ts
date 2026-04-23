import { spacing } from './spacing';

/** Non-spacing layout dimensions (card sizes, hero width ratio). */
export const layout = {
  contentPosterWidth: 120,
  contentPosterHeight: 180,
  heroWidthRatio: 0.9,
  /** Minimum hero backdrop height; actual height uses 16:9 from card width in HeroFeaturedCard. */
  heroMinHeight: 200,
  /** Backdrop area width:height (e.g. 16:9 for typical movie backdrops). */
  heroBackdropAspectW: 16,
  heroBackdropAspectH: 9,
  /** Detail cast avatar diameter. */
  castAvatarSize: 60,
  /** Height of the header row below the status bar (icons + wordmark). */
  headerBarContentHeight: 56,
  /** @deprecated use headerBarContentHeight for scroll padding alignment */
  headerMinHeight: spacing.md * 3,
  /** Vector icons: explicit sizes help fonts render consistently on iOS/Android. */
  iconSizeMd: spacing.lg,
  /** Bottom tab bar icons (slightly larger for visibility). */
  iconSizeTab: 26,
  iconSizeSm: 22,
  /** Space reserved above the bottom tab bar for scroll content (labels + icons). */
  tabBarStackPadding: 56,
  /** Horizontal gap between columns on Watchlist grid. */
  watchlistGridGap: spacing.md,
  genreChipPaddingHorizontal: spacing.md,
  genreChipPaddingVertical: spacing.sm,
  /** Search input corner radius (design: 12px). */
  searchBarRadius: 12,
  /** Minimum height for primary tap targets (accessibility; iOS/Android). */
  minTouchTarget: 48,
} as const;
