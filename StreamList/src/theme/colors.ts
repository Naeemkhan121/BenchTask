export const colors = {
  // Surfaces — layered from deepest to brightest
  surface:                   '#131313',
  /** Same RGB as `surface`, alpha 0 — for image fade gradients. */
  surface_clear:             'rgba(19, 19, 19, 0)',
  surface_container_lowest:  '#0E0E0E',
  surface_container_low:     '#1C1B1B',
  surface_container:         '#232323',
  surface_container_high:    '#2A2A2A',
  surface_container_highest: '#353534',
  surface_bright:            '#3A3939',

  // Primary accent (Coral-Red)
  primary:                   '#FFB3AE',
  primary_container:         '#FF5351',
  secondary_container:       '#822625',

  // Text
  on_surface:                '#E5E2E1',
  on_surface_variant:        '#E4BDBA',

  // Utility
  outline_variant:           'rgba(255,255,255,0.15)',

  /** Icons on dark headers / nav bars (e.g. stack back control). */
  icon_on_dark:              '#FFFFFF',
} as const;
