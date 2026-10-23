import { createTheme } from '@shopify/restyle';

import { fonts } from './fonts';

const palette = {
  black: '#000000',
  white: '#FFFFFF',
  aqua: '#29F4D5',
  gray777: '#777777',
  gray262: '#262626',
  gray4D: '#4D4D4D',
  gray525: '#525252',
  grayCC: '#CCCCCC',
} as const;

const body = {
  fontFamily: fonts.regular,
  fontSize: 16,
  lineHeight: 20,
} as const;

const caption = {
  fontFamily: fonts.regular,
  fontSize: 12,
  lineHeight: 15,
} as const;

export const theme = createTheme({
  colors: {
    background: palette.black,
    accent: palette.aqua,
    textPrimary: palette.white,
    textOnAccent: palette.black,
    textDisabled: palette.gray777,
    surface: palette.gray262,
    card: palette.gray4D,
    inputLine: palette.gray525,
    inputLineFilled: palette.white,
    bulletBorder: palette.grayCC,
  },
  spacing: {
    none: 0,
    xs: 7,
    s: 12,
    m: 16,
    l: 24,
    xl: 48,
  },
  borderRadii: {
    none: 0,
    m: 8,
    bullet: 3,
  },
  breakpoints: {
    phone: 0,
  },
  textVariants: {
    defaults: {
      ...body,
      color: 'textPrimary',
      letterSpacing: 0,
      includeFontPadding: false,
    },
    inputValue: { fontFamily: fonts.regular, fontSize: 32, lineHeight: 39 },
    greeting: { fontFamily: fonts.regular, fontSize: 24, lineHeight: 29 },
    greetingName: { fontFamily: fonts.bold, fontSize: 24, lineHeight: 29 },
    sectionTitle: {
      fontFamily: fonts.bold,
      fontSize: 20,
      lineHeight: 24,
      color: 'accent',
    },
    inputLabel: { fontFamily: fonts.regular, fontSize: 20, lineHeight: 24 },
    button: { fontFamily: fonts.medium, fontSize: 20, lineHeight: 24 },
    body,
    bodyMedium: { ...body, fontFamily: fonts.medium },
    bodySemiBold: { ...body, fontFamily: fonts.semiBold },
    bodyBold: { ...body, fontFamily: fonts.bold },
    caption,
    captionMedium: { ...caption, fontFamily: fonts.medium },
    tabLabel: { fontFamily: fonts.bold, fontSize: 10, lineHeight: 12 },
  },
});

export type Theme = typeof theme;
