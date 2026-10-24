import { Component, Fragment, type PropsWithChildren } from 'react';

import { Box, Button, Screen, Text } from '@/shared/components';

type ErrorBoundaryState = {
  failed: boolean;
  attempt: number;
};

export class ErrorBoundary extends Component<
  PropsWithChildren,
  ErrorBoundaryState
> {
  override state: ErrorBoundaryState = { failed: false, attempt: 0 };

  static getDerivedStateFromError(): Partial<ErrorBoundaryState> {
    return { failed: true };
  }

  retry = () => {
    this.setState(current => ({ failed: false, attempt: current.attempt + 1 }));
  };

  override render() {
    if (this.state.failed) {
      return (
        <Screen testID="error-fallback">
          <Box flex={1} justifyContent="center" padding="m">
            <Text variant="bodyMedium" textAlign="center">
              Algo deu errado.
            </Text>
          </Box>
          <Button label="TENTAR NOVAMENTE" onPress={this.retry} />
        </Screen>
      );
    }
    return <Fragment key={this.state.attempt}>{this.props.children}</Fragment>;
  }
}
