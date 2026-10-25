import { useTheme } from '@shopify/restyle';
import { ActivityIndicator } from 'react-native';

import type { UserState } from '@/features/auth/types';
import { loginMessages } from '@/features/auth/validation/login.validation';
import { Box, Text, TextButton } from '@/shared/components';
import type { Theme } from '@/shared/theme';

type UserFallbackProps = {
  state: Exclude<UserState, { status: 'ready' }>;
};

export function UserFallback({ state }: UserFallbackProps) {
  const { colors } = useTheme<Theme>();

  return (
    <Box
      flex={1}
      alignItems="center"
      justifyContent="center"
      paddingHorizontal="m"
    >
      {state.status === 'error' ? (
        <>
          <Text
            testID="user-error"
            variant="body"
            textAlign="center"
            accessibilityRole="alert"
          >
            {loginMessages.unavailable}
          </Text>
          <Box marginTop="m">
            <TextButton
              testID="user-retry"
              label="TENTAR NOVAMENTE"
              tone="accent"
              onPress={state.retry}
            />
          </Box>
        </>
      ) : (
        <ActivityIndicator
          testID="user-loading"
          accessibilityLabel="Carregando"
          color={colors.accent}
        />
      )}
    </Box>
  );
}
