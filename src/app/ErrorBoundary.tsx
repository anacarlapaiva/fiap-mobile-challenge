import { Fragment, useState, type PropsWithChildren } from 'react';
import {
  ErrorBoundary as ReactErrorBoundary,
  type FallbackProps,
} from 'react-error-boundary';

import { Box, Button, Screen, Text } from '@/shared/components';

function ErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <Screen testID="error-fallback">
      <Box flex={1} justifyContent="center" padding="m">
        <Text variant="bodyMedium" textAlign="center">
          Algo deu errado.
        </Text>
      </Box>
      <Button label="TENTAR NOVAMENTE" onPress={resetErrorBoundary} />
    </Screen>
  );
}

export function ErrorBoundary({ children }: PropsWithChildren) {
  const [attempt, setAttempt] = useState(0);

  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => setAttempt(current => current + 1)}
    >
      <Fragment key={attempt}>{children}</Fragment>
    </ReactErrorBoundary>
  );
}
