/**
 * Registered names for fonts linked via `assets/fonts` + `react-native-asset`.
 * Use the face-specific `fontFamily` string (matches linked `.ttf` stems on both platforms).
 */
export const fontFamilies = {
  manrope: {
    semiBold: 'Manrope-SemiBold',
    bold: 'Manrope-Bold',
    extraBold: 'Manrope-ExtraBold',
  },
  inter: {
    regular: 'Inter-Regular',
    semiBold: 'Inter-SemiBold',
  },
} as const;

const m = fontFamilies.manrope;
const i = fontFamilies.inter;

/**
 * Centralized text styles. Use explicit `fontFamily` per weight (no `fontWeight`)
 * for consistent rendering on Android.
 */
export const typography = {
  /** Large marketing / hero numerals */
  'display-lg': {
    fontFamily: m.extraBold,
    fontSize: 56,
    letterSpacing: -0.02,
  },
  'display-md': {
    fontFamily: m.extraBold,
    fontSize: 40,
    letterSpacing: -0.02,
  },
  /** Section titles */
  'headline-md': {
    fontFamily: m.bold,
    fontSize: 28,
    letterSpacing: -0.01,
  },
  'title-lg': {
    fontFamily: m.semiBold,
    fontSize: 20,
    letterSpacing: 0,
  },
  /** Home header wordmark: bold, title case (e.g. StreamList). */
  'brand-wordmark': {
    fontFamily: m.bold,
    fontSize: 20,
    letterSpacing: 0,
  },
  'title-sm': {
    fontFamily: i.semiBold,
    fontSize: 14,
    letterSpacing: 0,
  },
  'body-md': {
    fontFamily: i.regular,
    fontSize: 14,
    letterSpacing: 0,
  },
  'label-sm': {
    fontFamily: i.regular,
    fontSize: 12,
    letterSpacing: 0,
  },
  /** Uppercase section labels (e.g. YOUR COLLECTION). */
  'label-sm-tracked': {
    fontFamily: i.regular,
    fontSize: 12,
    letterSpacing: 1.2,
  },

  // --- Semantic scale (aliases for new UI) ---
  /** Primary page / block heading */
  heading: {
    fontFamily: m.bold,
    fontSize: 28,
    letterSpacing: -0.01,
  },
  /** Secondary heading under `heading` */
  subheading: {
    fontFamily: m.semiBold,
    fontSize: 20,
    letterSpacing: 0,
  },
  /** Default paragraph */
  body: {
    fontFamily: i.regular,
    fontSize: 14,
    letterSpacing: 0,
  },
  /** Supporting / meta text */
  caption: {
    fontFamily: i.regular,
    fontSize: 12,
    letterSpacing: 0,
  },
  /** Uppercase small caps with tracking */
  overline: {
    fontFamily: i.regular,
    fontSize: 12,
    letterSpacing: 1.2,
  },
} as const;

export type TypographyToken = keyof typeof typography;
