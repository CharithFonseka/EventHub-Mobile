// src/theme/index.ts

export const colors = {
  // Primary palette
  primary: '#7B2FBE',
  primaryLight: '#9D5CD0',
  primaryDark: '#5A1E8E',
  primaryGlow: 'rgba(123, 47, 190, 0.25)',

  // Accent
  accent: '#FF6B6B',
  accentLight: '#FF8E8E',
  success: '#4CAF82',
  warning: '#FFB547',
  error: '#FF5252',
  info: '#42A5F5',

  // Background layers
  background: '#0D1B2A',
  backgroundCard: '#162236',
  backgroundElevated: '#1E2F45',
  backgroundModal: '#1A2B3E',

  // Surface
  surface: '#162236',
  surfaceBorder: 'rgba(255,255,255,0.08)',

  // Text
  textPrimary: '#F0F4F8',
  textSecondary: '#8FA3B8',
  textMuted: '#4A6278',
  textOnPrimary: '#FFFFFF',

  // Tab bar
  tabActive: '#7B2FBE',
  tabInactive: '#4A6278',
  tabBackground: '#0F1E2E',

  // Gradients (used as array pairs in LinearGradient)
  gradientPrimary: ['#7B2FBE', '#4A1A7A'] as [string, string],
  gradientCard: ['#162236', '#1E2F45'] as [string, string],
  gradientHero: ['#0D1B2A', '#1E1040'] as [string, string],

  // Divider
  divider: 'rgba(255,255,255,0.06)',
};

export const typography = {
  fontSizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 30,
    display: 36,
  },
  fontWeights: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
    extraBold: '800' as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },
};

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  xxl: 28,
  full: 9999,
};

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  modal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  glow: {
    shadowColor: '#7B2FBE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
};

const theme = { colors, typography, spacing, borderRadius, shadows };
export default theme;
