import { BrandTheme } from '../types';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  cardBg: string;
  cardBgSoft: string;
  canvasBg: string;
  borderColor: string;
  borderSubtle: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  navBg: string;
  navBorder: string;
}

export function getThemeColors(theme: BrandTheme): ThemeColors {
  switch (theme) {
    case 'dark':
      // Palette provided by user:
      // Espresso Base: #1C1712 (Page background)
      // Ink Brown: #3A3028 (Card/section surfaces)
      // Sand Fiber: #D6C3A3 (Primary accent - buttons, links, active states, headings)
      // Soft Taupe (brightened): #BFA9C7 (Secondary accent / borders / muted UI)
      // Rice White: #FFF9EF (Primary text - headings and body copy)
      // Warm Paper (dimmed): #E8D9C0 (Secondary/muted text, input backgrounds)
      return {
        primary: '#D6C3A3', // Sand Fiber
        secondary: '#BFA9C7', // Soft Taupe (brightened)
        accent: '#BFA9C7',
        cardBg: '#3A3028', // Ink Brown
        cardBgSoft: '#2C241E',
        canvasBg: '#1C1712', // Espresso Base
        borderColor: '#3A3028',
        borderSubtle: '#4A3E35',
        textPrimary: '#FFF9EF', // Rice White
        textSecondary: '#E8D9C0', // Warm Paper (dimmed)
        textMuted: '#BFA9C7',
        navBg: 'rgba(28, 23, 18, 0.95)',
        navBorder: '#3A3028',
      };

    case 'warm-earth':
    default:
      // "أرضي" Light Mode - tuned for high contrast, crisp legibility (no dimming)
      return {
        primary: '#3A3028', // Ink Brown
        secondary: '#D6C3A3', // Sand Fiber
        accent: '#BFA9C7',
        cardBg: '#FFFFFF',
        cardBgSoft: '#F7EFE3',
        canvasBg: '#FCF8F2',
        borderColor: '#D6C3A3',
        borderSubtle: '#EAE0D2',
        textPrimary: '#1C1712', // Espresso Base (crisp and high-contrast)
        textSecondary: '#3E3229', // Rich clear readable text
        textMuted: '#68574B',
        navBg: 'rgba(252, 248, 242, 0.95)',
        navBorder: '#D6C3A3',
      };
  }
}

