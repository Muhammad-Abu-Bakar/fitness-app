// Central design tokens for Bulkify's dark + dual-tone (cyan + lime) system.
// Discipline rule:
//   cyan = nutrition domain (food, calories, protein, hydration)
//   lime = training domain (workouts, sets, reps, programs)
// Use ONE per UI element based on what it represents. Mix the two only on
// hero / cross-domain surfaces (home ring, brand surfaces, weigh-in / progress).

export const colors = {
  // === CHANGED === backgroundSolid cooled to a blue-tinted near-black.
  // background stays transparent until step 2 rips out the legacy navy gradient
  // wrapper in _layout.tsx; then screens use backgroundSolid directly.
  background: 'transparent',
  backgroundSolid: '#0A0F12',

  // === CHANGED === card surfaces cooled to match the new bg
  surface: '#15151A',
  surfaceElevated: '#1F1F26',

  // === NEW === Semantic brand colors. Don't use interchangeably — pick by
  // domain (food vs training). Cross-domain hero elements use dualGradient.
  accentFood: '#22D3EE',     // cyan
  accentTrain: '#A3E635',    // lime
  onAccentFood: '#06141A',   // dark text on cyan fills
  onAccentTrain: '#0F1A05',  // dark text on lime fills

  // === DEPRECATED === legacy yellow accent. Existing screens still reference
  // colors.accent — we migrate screen-by-screen to accentFood / accentTrain and
  // delete these two lines at the end. Don't write new code against this.
  accent: '#ffb800',
  onAccent: '#0a0a0a',

  // === NEW === translucent borders for outlined elements (pill chips, dividers)
  borderSubtle: 'rgba(255,255,255,0.06)',
  borderDefault: 'rgba(255,255,255,0.12)',

  textPrimary: '#ffffff',
  // === CHANGED === cooled greys (Tailwind zinc-400 / zinc-600) read better
  // against the cool-tinted dark bg.
  textSecondary: '#a1a1aa',
  textTertiary: '#52525b',

  danger: '#ff6b6b',
  success: '#4ade80',
} as const;

// === DEPRECATED === legacy global navy gradient. Step 2 removes the _layout
// wrapper that uses this, then this export gets deleted.
export const gradient = {
  colors: ['#0a0a0a', '#0a1525', '#0d2138', '#0a1525', '#0a0a0a'] as const,
  locations: [0, 0.3, 0.5, 0.7, 1] as const,
} as const;

// === NEW === Aurora hero gradient — used ONLY on hero moments (home behind
// the ring, workout-complete screen, milestone toasts). Render as two stacked
// LinearGradient layers (cyan-leaning left, lime-leaning right) inside the
// hero component, NOT globally. Glow on every screen = visual fatigue + perf cost.
export const auroraGradient = {
  cyan: {
    colors: ['rgba(34,211,238,0.55)', 'rgba(34,211,238,0.18)', 'rgba(34,211,238,0)'] as const,
    locations: [0, 0.6, 1] as const,
  },
  lime: {
    colors: ['rgba(163,230,53,0.55)', 'rgba(163,230,53,0.18)', 'rgba(163,230,53,0)'] as const,
    locations: [0, 0.6, 1] as const,
  },
} as const;

// === NEW === Cross-domain dual-tone linear gradient. Use on UI elements that
// represent the whole-day state: home progress ring stroke, hero CTA borders,
// the floating "+" tab button. Domain-specific elements use accentFood or
// accentTrain solo instead.
export const dualGradient = {
  colors: ['#22D3EE', '#A3E635'] as const,
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
} as const;

// === CHANGED === added smd=12 (cards prefer 12 over 16 in the new design)
export const spacing = {
  xs: 4,
  sm: 8,
  smd: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// === CHANGED === added pill=20 for chip-style elements ("Meal 1 Logged" etc.)
export const radius = {
  sm: 6,
  md: 8,
  lg: 12,
  pill: 20,
  full: 9999,
} as const;

// === CHANGED === Heavier display weights (900) for the gym-bro feel.
// Inter family target, four weights only: 900 / 700 / 500 / 400.
// (We're not loading Inter yet — system bold on iOS gives SF Pro Heavy which
// is visually very close. We can add expo-google-fonts/inter in a later step.)
export const typography = {
  display:  { fontSize: 52, fontWeight: '900' as const, lineHeight: 56, letterSpacing: 0.3 },
  title:    { fontSize: 32, fontWeight: '900' as const, lineHeight: 36, letterSpacing: 0.2 },
  heading:  { fontSize: 22, fontWeight: '700' as const, lineHeight: 28 },
  body:     { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyBold: { fontSize: 16, fontWeight: '700' as const, lineHeight: 24 },
  caption:  { fontSize: 12, fontWeight: '700' as const, letterSpacing: 2, lineHeight: 16 },
  button:   { fontSize: 16, fontWeight: '700' as const, letterSpacing: 1.5 },
} as const;
