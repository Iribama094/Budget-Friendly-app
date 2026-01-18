import { tokens } from './tokens';

export type Theme = {
  mode: 'light' | 'dark';
  colors: {
    background: string;
    backgroundAlt: string;
    surface: string;
    surfaceAlt: string;
    border: string;
    text: string;
    textMuted: string;
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    error: string;
  };
};

export function getTheme(mode: Theme['mode']): Theme {
  if (mode === 'dark') {
    return {
      mode,
      colors: {
        background: tokens.colors.gray[950],
        backgroundAlt: tokens.colors.gray[900],
        surface: 'rgba(30, 41, 59, 0.65)',
        surfaceAlt: 'rgba(15, 23, 42, 0.55)',
        border: 'rgba(148, 163, 184, 0.18)',
        text: tokens.colors.gray[50],
        textMuted: tokens.colors.gray[300],
        primary: tokens.colors.primary[500],
        secondary: tokens.colors.secondary[500],
        accent: tokens.colors.accent[500],
        success: tokens.colors.success[500],
        error: tokens.colors.error[500]
      }
    };
  }

  return {
    mode,
    colors: {
      background: tokens.colors.gray[50],
      backgroundAlt: tokens.colors.white,
      surface: 'rgba(255, 255, 255, 0.82)',
      surfaceAlt: 'rgba(248, 250, 252, 0.8)',
      border: 'rgba(226, 232, 240, 1)',
      text: tokens.colors.gray[900],
      textMuted: tokens.colors.gray[600],
      primary: tokens.colors.primary[500],
      secondary: tokens.colors.secondary[500],
      accent: tokens.colors.accent[500],
      success: tokens.colors.success[600],
      error: tokens.colors.error[600]
    }
  };
}
