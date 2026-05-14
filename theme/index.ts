// === NEW === central design tokens — change colors/fonts/spacing here, app-wide
export const colors = {
    // Backgrounds
    background: '#0a0a0a',
    surface: '#1a1a1a',
    surfaceElevated: '#2a2a2a',
  
    // Brand (change these to re-theme the whole app)
    accent: '#ffb800',
    onAccent: '#0a0a0a', // text/icon color when sitting on the accent
  
    // Text
    textPrimary: '#ffffff',
    textSecondary: '#aaaaaa',
    textTertiary: '#666666',
  
    // Status
    danger: '#ff6b6b',
    success: '#4ade80',
  } as const;
  
  export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  } as const;
  
  export const radius = {
    sm: 6,
    md: 8,
    lg: 12,
    full: 9999,
  } as const;
  
  export const typography = {
    display: { fontSize: 52, fontWeight: '800' as const, lineHeight: 60 },
    title: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
    heading: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28 },
    body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
    bodyBold: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
    caption: { fontSize: 12, fontWeight: '700' as const, letterSpacing: 2, lineHeight: 16 },
    button: { fontSize: 18, fontWeight: '700' as const },
  } as const;