// Taxi Sanchalak design system tokens.
// Single source of truth for color, type, spacing, radius, elevation and motion.
// Change values here — never hardcode colors/spacing in screens.

export const colors = {
  primary: '#F4A100',
  primaryDark: '#D48900',
  primarySurface: '#FFF6E5',
  primaryBorder: '#F7D998',

  background: '#F5F6FA',
  surface: '#FFFFFF',
  surfaceAlt: '#FAFAFC',

  text: '#1A1A2E',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',

  border: '#E5E7EB',
  borderStrong: '#D1D5DB',
  divider: '#EEF0F3',

  error: '#DC2626',
  errorSurface: '#FDECEC',
  success: '#16A34A',
  successSurface: '#EAF7EE',
  warning: '#F59E0B',
  warningSurface: '#FEF6E7',
  info: '#2563EB',
  infoSurface: '#EAF1FD',

  neutral: '#6B7280',
  neutralSurface: '#F1F2F5',

  overlay: 'rgba(15, 17, 21, 0.55)',
  disabledBg: '#F0F1F4',
  disabledText: '#B4B8C1',

  // legacy aliases kept for compatibility with existing call sites
  header: '#1A1A2E',
  white: '#FFFFFF',
};

/** Semantic tone used for status pills, dots and callouts. */
export type Tone = 'success' | 'warning' | 'error' | 'info' | 'primary' | 'neutral';

export const tones: Record<Tone, { bg: string; fg: string; dot: string }> = {
  success: { bg: colors.successSurface, fg: '#0F7A38', dot: colors.success },
  warning: { bg: colors.warningSurface, fg: '#9A6B00', dot: colors.warning },
  error: { bg: colors.errorSurface, fg: '#B32222', dot: colors.error },
  info: { bg: colors.infoSurface, fg: '#1D4FA6', dot: colors.info },
  primary: { bg: colors.primarySurface, fg: colors.primaryDark, dot: colors.primary },
  neutral: { bg: colors.neutralSurface, fg: colors.textSecondary, dot: colors.textTertiary },
};

/** Maps every status string used across the app (bookings, requests, tickets, vehicles...) to a tone. */
const STATUS_TONE_MAP: Record<string, Tone> = {
  open: 'warning',
  pending: 'warning',
  assigned: 'primary',
  in_progress: 'primary',
  accepted: 'success',
  responded: 'primary',
  completed: 'success',
  paid: 'success',
  active: 'success',
  resolved: 'success',
  rejected: 'error',
  failed: 'error',
  cancelled: 'error',
  closed: 'neutral',
  inactive: 'neutral',
};

export function toneForStatus(status?: string): Tone {
  if (!status) return 'neutral';
  return STATUS_TONE_MAP[status] ?? 'neutral';
}

export function statusLabel(status?: string): string {
  if (!status) return '';
  return status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/** 8-point spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64 */
export const spacing = {
  tiny: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
  massive: 64,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
};

export const shadow = {
  none: {},
  xs: {
    shadowColor: '#0B0D12',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#0B0D12',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#0B0D12',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0B0D12',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
} as const;

export const duration = {
  fast: 120,
  base: 200,
  slow: 320,
};

export const typography = {
  display: { fontSize: 30, lineHeight: 38, fontWeight: '800' as const },
  h1: { fontSize: 24, lineHeight: 31, fontWeight: '700' as const },
  h2: { fontSize: 20, lineHeight: 27, fontWeight: '700' as const },
  h3: { fontSize: 17, lineHeight: 23, fontWeight: '700' as const },
  bodyLarge: { fontSize: 16, lineHeight: 23, fontWeight: '400' as const },
  body: { fontSize: 15, lineHeight: 21, fontWeight: '400' as const },
  bodyMedium: { fontSize: 15, lineHeight: 21, fontWeight: '600' as const },
  bodySmall: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
  bodySmallMedium: { fontSize: 13, lineHeight: 18, fontWeight: '600' as const },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500' as const },
  overline: { fontSize: 11, lineHeight: 14, fontWeight: '700' as const, letterSpacing: 0.6 },
  button: { fontSize: 15, lineHeight: 20, fontWeight: '700' as const },
  label: { fontSize: 13, lineHeight: 17, fontWeight: '600' as const },
};

export const hitSlop = { top: 8, bottom: 8, left: 8, right: 8 };
