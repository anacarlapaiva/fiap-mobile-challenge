import { DefaultTheme } from '@react-navigation/native';

import { theme } from '@/shared/theme';

export const navigationTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: theme.colors.background,
  },
};
