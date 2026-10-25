import type { PropsWithChildren } from 'react';
import {
  ErrorBoundary as ReactErrorBoundary,
  type FallbackProps,
} from 'react-error-boundary';

import { Box, Button, Screen, Text } from '@/shared/components';

function ErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <Screen testID="error-fallback">
      <Box flex={1} justifyContent="center" padding="m">
        <Text variant="bodyMedium" textAlign="center" accessibilityRole="alert">
          Algo deu errado.
        </Text>
      </Box>
      <Button label="TENTAR NOVAMENTE" onPress={resetErrorBoundary} />
    </Screen>
  );
}

export function ErrorBoundary({ children }: PropsWithChildren) {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
}
