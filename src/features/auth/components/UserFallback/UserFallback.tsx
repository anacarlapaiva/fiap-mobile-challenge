import { useTheme } from '@shopify/restyle';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

import type { UserState } from '@/features/auth/types';
import { loginMessages } from '@/features/auth/validation/login.validation';
import { Box, Text, TextButton } from '@/shared/components';
import { isOffline } from '@/shared/lib/reachability';
import type { Theme } from '@/shared/theme';

type UserFallbackProps = {
  state: Exclude<UserState, { status: 'ready' }>;
};

export function UserFallback({ state }: UserFallbackProps) {
  const { colors } = useTheme<Theme>();
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if (state.status !== 'error') {
      setOffline(false);
      return;
    }
    let active = true;
    isOffline().then(value => {
      if (active) {
        setOffline(value);
      }
    });
    return () => {
      active = false;
    };
  }, [state.status]);

  const message = offline ? loginMessages.offline : loginMessages.unavailable;

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
            {message}
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
