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

const fill = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
} as const;

const borderWidths = {
  thin: 1,
} as const;

const sizes = {
  actionsBarHeight: 48,
  buttonHeight: 60,
  inputHeight: 96,
  dropdownHeight: 45,
  cardHeight: 90,
  optionRowHeight: 36,
  subjectRowHeight: 37,
  lessonRowHeight: 59,
  bullet: 6,
  fieldMinWidth: 260,
  emptyImage: { width: 328, height: 208 },
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
    tabLabelGap: 4,
    xs: 7,
    fieldLineGap: 8,
    iconGap: 8,
    tabTop: 11,
    s: 12,
    tabBottom: 13,
    m: 16,
    emptyGap: 20,
    l: 24,
    fieldLabelGap: 25,
    errorGap: 31,
    greetingGap: 36,
    fieldGap: 39,
    xl: 48,
    sectionGap: 64,
    logoGap: 80,
    loginTop: 100,
  },
  borderRadii: {
    none: 0,
    m: 8,
    bullet: 3,
  },
  breakpoints: {
    phone: 0,
  },
  borderWidths,
  sizes,
  iconSizes: {
    s: 10,
    m: 14,
    l: 24,
  },
  motion: {
    pressedOpacity: 0.8,
    pulseScale: 0.85,
    short: 150,
    medium: 200,
    caretBlink: 500,
  },
  logoVariants: {
    large: { width: 306, height: 49 },
    small: { width: 100, height: 16 },
  },
  tabBarVariants: {
    bar: {
      flexDirection: 'row',
      backgroundColor: 'surface',
    },
    item: {
      alignItems: 'center',
      paddingTop: 'tabTop',
    },
    label: {
      marginTop: 'tabLabelGap',
    },
    layer: {
      ...fill,
      alignItems: 'center',
    },
  },
  emptyVariants: {
    root: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    message: {
      marginTop: 'emptyGap',
    },
  },
  emptyImageVariants: {
    illustration: {
      width: '100%',
      maxWidth: sizes.emptyImage.width,
      aspectRatio: sizes.emptyImage.width / sizes.emptyImage.height,
    },
  },
  buttonVariants: {
    primary: {
      height: sizes.buttonHeight,
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  cardVariants: {
    surface: {
      height: sizes.cardHeight,
      borderRadius: 'm',
      backgroundColor: 'card',
      justifyContent: 'center',
    },
    selectedOutline: {
      ...fill,
      borderRadius: 'm',
      borderWidth: borderWidths.thin,
      borderColor: 'accent',
    },
  },
  dropdownVariants: {
    field: {
      height: sizes.dropdownHeight,
      backgroundColor: 'surface',
      borderRadius: 'm',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingRight: 's',
    },
    list: {
      position: 'absolute',
      backgroundColor: 'surface',
      borderRadius: 'm',
      paddingVertical: 'm',
      overflow: 'hidden',
    },
    overlay: fill,
  },
  textFieldVariants: {
    container: {
      alignSelf: 'stretch',
      alignItems: 'center',
    },
    value: {
      alignSelf: 'stretch',
      marginTop: 'fieldLabelGap',
    },
    mask: {
      ...fill,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    caret: {
      width: borderWidths.thin,
      alignSelf: 'stretch',
      backgroundColor: 'textPrimary',
    },
    line: {
      alignSelf: 'stretch',
      height: borderWidths.thin,
      marginTop: 'fieldLineGap',
    },
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
    actionAccent: { ...body, fontFamily: fonts.bold, color: 'accent' },
    tabLabel: { fontFamily: fonts.bold, fontSize: 10, lineHeight: 12 },
  },
});

export type Theme = typeof theme;
