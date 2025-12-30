// Theme constants for consistent styling

export const COLORS = {
  primary: '#E91E63',
  primaryLight: 'rgba(233, 30, 99, 0.1)',
  secondary: '#FFD700',
  
  background: '#f8f9fa',
  surface: '#ffffff',
  
  text: {
    primary: '#1a1a1a',
    secondary: '#333333',
    tertiary: '#666666',
    light: '#999999',
    inverse: '#ffffff',
  },
  
  border: {
    light: '#f0f0f0',
    default: '#dddddd',
    dark: '#eeeeee',
  },
  
  overlay: {
    light: 'rgba(0,0,0,0.3)',
    medium: 'rgba(0,0,0,0.4)',
    dark: 'rgba(0,0,0,0.6)',
  },
  
  status: {
    success: '#4CAF50',
    error: '#f44336',
    warning: '#FF9800',
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  round: 9999,
} as const;

export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 24,
  xxxl: 28,
} as const;

export const FONT_WEIGHT = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;
