// Theme colors matching web client design system
// Based on shadcn/ui theme with OKLCH color space
export const colors = {
  // Light theme - matches web :root variables
  light: {
    // Primary green color - main brand color
    primary: '#4ade80', // oklch(0.723 0.219 149.579)
    primaryForeground: '#f0fdf4', // oklch(0.982 0.018 155.826)
    
    // Secondary neutral colors
    secondary: '#f1f5f9', // oklch(0.967 0.001 286.375)
    secondaryForeground: '#1e293b', // oklch(0.21 0.006 285.885)
    
    // Background colors
    background: '#f6f7f9', // Main background - var(--bg-color)
    foreground: '#0f172a', // oklch(0.141 0.005 285.823)
    
    // Card colors
    card: '#ffffff', // oklch(1 0 0)
    cardForeground: '#0f172a', // oklch(0.141 0.005 285.823)
    
    // Muted colors for less emphasis
    muted: '#f1f5f9', // oklch(0.967 0.001 286.375)
    mutedForeground: '#64748b', // oklch(0.552 0.016 285.938)
    
    // Accent color for highlights
    accent: '#f1f5f9', // oklch(0.967 0.001 286.375)
    accentForeground: '#1e293b', // oklch(0.21 0.006 285.885)
    
    // Border and input colors
    border: '#e2e8f0', // oklch(0.92 0.004 286.32)
    input: '#e2e8f0', // oklch(0.92 0.004 286.32)
    ring: '#4ade80', // oklch(0.723 0.219 149.579)
    
    // Destructive/Error colors
    destructive: '#ef4444', // oklch(0.577 0.245 27.325)
    destructiveForeground: '#ffffff',
    
    // Chart colors matching web
    chart1: '#fb923c', // oklch(0.646 0.222 41.116) - Orange
    chart2: '#06b6d4', // oklch(0.6 0.118 184.704) - Cyan
    chart3: '#3b82f6', // oklch(0.398 0.07 227.392) - Blue
    chart4: '#84cc16', // oklch(0.828 0.189 84.429) - Lime
    chart5: '#eab308', // oklch(0.769 0.188 70.08) - Yellow
    
    // Sidebar colors
    sidebar: '#fcfcfc', // oklch(0.985 0 0)
    sidebarForeground: '#0f172a', // oklch(0.141 0.005 285.823)
    sidebarPrimary: '#4ade80', // oklch(0.723 0.219 149.579)
    sidebarPrimaryForeground: '#f0fdf4', // oklch(0.982 0.018 155.826)
    sidebarAccent: '#f1f5f9', // oklch(0.967 0.001 286.375)
    sidebarAccentForeground: '#1e293b', // oklch(0.21 0.006 285.885)
    sidebarBorder: '#e2e8f0', // oklch(0.92 0.004 286.32)
    
    // Navbar colors (custom for mobile)
    navbar: '#1a1e2a',
    navbarForeground: '#ffffff',
  },
  
  // Dark theme - matches web .dark variables
  dark: {
    // Primary green color - adjusted for dark mode
    primary: '#4ade80', // oklch(0.696 0.17 162.48)
    primaryForeground: '#052e16', // oklch(0.393 0.095 152.535)
    
    // Secondary neutral colors
    secondary: '#1e293b', // oklch(0.274 0.006 286.033)
    secondaryForeground: '#f8fafc', // oklch(0.985 0 0)
    
    // Background colors
    background: '#0f172a', // oklch(0.141 0.005 285.823)
    foreground: '#f8fafc', // oklch(0.985 0 0)
    
    // Card colors
    card: '#1e293b', // oklch(0.21 0.006 285.885)
    cardForeground: '#f8fafc', // oklch(0.985 0 0)
    
    // Muted colors
    muted: '#1e293b', // oklch(0.274 0.006 286.033)
    mutedForeground: '#94a3b8', // oklch(0.705 0.015 286.067)
    
    // Accent color
    accent: '#1e293b', // oklch(0.274 0.006 286.033)
    accentForeground: '#f8fafc', // oklch(0.985 0 0)
    
    // Border and input colors with opacity
    border: 'rgba(255, 255, 255, 0.1)', // oklch(1 0 0 / 10%)
    input: 'rgba(255, 255, 255, 0.15)', // oklch(1 0 0 / 15%)
    ring: '#4ade80', // oklch(0.527 0.154 150.069)
    
    // Destructive/Error colors
    destructive: '#dc2626', // oklch(0.704 0.191 22.216)
    destructiveForeground: '#ffffff',
    
    // Chart colors for dark mode
    chart1: '#a855f7', // oklch(0.488 0.243 264.376) - Purple
    chart2: '#4ade80', // oklch(0.696 0.17 162.48) - Green
    chart3: '#eab308', // oklch(0.769 0.188 70.08) - Yellow
    chart4: '#c026d3', // oklch(0.627 0.265 303.9) - Magenta
    chart5: '#f97316', // oklch(0.645 0.246 16.439) - Orange
    
    // Sidebar colors
    sidebar: '#1e293b', // oklch(0.21 0.006 285.885)
    sidebarForeground: '#f8fafc', // oklch(0.985 0 0)
    sidebarPrimary: '#4ade80', // oklch(0.696 0.17 162.48)
    sidebarPrimaryForeground: '#052e16', // oklch(0.393 0.095 152.535)
    sidebarAccent: '#1e293b', // oklch(0.274 0.006 286.033)
    sidebarAccentForeground: '#f8fafc', // oklch(0.985 0 0)
    sidebarBorder: 'rgba(255, 255, 255, 0.1)', // oklch(1 0 0 / 10%)
    
    // Navbar colors
    navbar: '#1a1e2a',
    navbarForeground: '#ffffff',
  },
};

// Spacing system matching web design (using multiples of 4)
export const spacing = {
  xs: 4,    // 0.25rem
  sm: 8,    // 0.5rem
  md: 16,   // 1rem
  lg: 24,   // 1.5rem
  xl: 32,   // 2rem
  xxl: 48,  // 3rem
  xxxl: 64, // 4rem
};

// Border radius matching web --radius variable (0.5rem = 8px)
export const borderRadius = {
  none: 0,
  sm: 4,   // calc(var(--radius) - 4px)
  md: 6,   // calc(var(--radius) - 2px)
  lg: 8,   // var(--radius)
  xl: 12,  // calc(var(--radius) + 4px)
  full: 9999,
};

// Typography system matching web design
export const fontSize = {
  xs: 12,   // 0.75rem
  sm: 14,   // 0.875rem
  base: 16, // 1rem
  md: 16,   // 1rem
  lg: 18,   // 1.125rem
  xl: 20,   // 1.25rem
  '2xl': 24,  // 1.5rem
  '3xl': 30,  // 1.875rem
  '4xl': 36,  // 2.25rem
};

// Font weights
export const fontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

// Line heights
export const lineHeight = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
};

// Shadows matching web design
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
};

// Maximum width constraint matching web
export const maxWidth = {
  container: 1248, // 78rem = 1248px
};
