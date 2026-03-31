/**
 * Design Tokens - Système de design unifié et cohérent
 * Utilisé par tous les composants pour la cohérence
 */

// ===== COLORS =====
export const colors = {
  // Primary palette (Luxury/Corporate)
  primary: {
    50: '#FAF7F3',
    100: '#F5EEE7',
    600: '#C9A961',
    700: '#B8934F',
    800: '#A07D3D',
    900: '#1B4D3E',
  },
  // Neutrals (Modern & Clean)
  neutral: {
    0: '#FFFFFF',
    50: '#FAFAF9',
    100: '#F5F5F4',
    200: '#E7E5E4',
    300: '#D6D3D1',
    400: '#A8A29E',
    500: '#78716B',
    600: '#57534E',
    700: '#3F3935',
    800: '#292524',
    900: '#1C1917',
  },
  // Status colors
  success: '#059669',
  warning: '#D97706',
  error: '#DC2626',
  info: '#0891B2',
  // Semantic
  background: '#FAFAF9',
  foreground: '#1C1917',
} as const;

// ===== SPACING (8px system) =====
export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
  28: '112px',
  32: '128px',
} as const;

// ===== TYPOGRAPHY =====
export const typography = {
  // Headings
  h1: {
    size: '3.5rem', // 56px
    weight: 700,
    lineHeight: '1.1',
    letterSpacing: '-0.02em',
  },
  h2: {
    size: '2.5rem', // 40px
    weight: 700,
    lineHeight: '1.2',
    letterSpacing: '-0.01em',
  },
  h3: {
    size: '2rem', // 32px
    weight: 600,
    lineHeight: '1.3',
  },
  h4: {
    size: '1.5rem', // 24px
    weight: 600,
    lineHeight: '1.4',
  },
  h5: {
    size: '1.25rem', // 20px
    weight: 600,
    lineHeight: '1.5',
  },
  h6: {
    size: '1rem', // 16px
    weight: 600,
    lineHeight: '1.5',
  },
  // Body
  body: {
    lg: { size: '1.125rem', weight: 400, lineHeight: '1.75' }, // 18px
    base: { size: '1rem', weight: 400, lineHeight: '1.5' }, // 16px
    sm: { size: '0.875rem', weight: 400, lineHeight: '1.5' }, // 14px
    xs: { size: '0.75rem', weight: 400, lineHeight: '1.5' }, // 12px
  },
} as const;

// ===== BORDER RADIUS =====
export const borderRadius = {
  none: '0px',
  sm: '4px',
  base: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  '3xl': '24px',
  full: '9999px',
} as const;

// ===== SHADOWS =====
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
} as const;

// ===== Z-INDEX SCALE =====
export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

// ===== TRANSITIONS =====
export const transitions = {
  fast: '150ms',
  base: '200ms',
  slow: '300ms',
  slower: '500ms',
  timing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;
