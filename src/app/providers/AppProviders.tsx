import { ThemeProvider } from '@shopify/restyle';
import type { PropsWithChildren } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { theme } from '@/shared/theme';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </SafeAreaProvider>
  );
}
