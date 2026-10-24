import { useState } from 'react';

import { useSession } from '@/features/auth/session/SessionProvider';
import { applyCpfMask } from '@/features/auth/validation/login.validation';
import {
  Box,
  Button,
  Logo,
  Screen,
  Text,
  TextField,
} from '@/shared/components';

export function LoginScreen() {
  const { isSigningIn, signIn } = useSession();
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  function submit() {
    setMessage(null);
    signIn(cpf, password)
      .then(result => {
        if (!result.ok) {
          setMessage(result.message);
        }
      })
      .catch(() => undefined);
  }

  return (
    <Screen testID="login-screen" edges={['top']}>
      <Box flex={1} paddingHorizontal="xl" justifyContent="center">
        <Logo size="large" />
        <Box marginTop="xl">
          <TextField
            testID="login-cpf"
            label="CPF"
            value={cpf}
            onChangeText={value => setCpf(applyCpfMask(value))}
            keyboardType="number-pad"
            maxLength={14}
          />
        </Box>
        <Box marginTop="l">
          <TextField
            testID="login-password"
            label="SENHA"
            value={password}
            onChangeText={setPassword}
            secure
          />
        </Box>
        {message ? (
          <Text variant="bodyMedium" color="accent" marginTop="m">
            {message}
          </Text>
        ) : null}
      </Box>
      <Button
        testID="login-submit"
        label="FAZER LOGIN"
        onPress={submit}
        loading={isSigningIn}
        bottomInset
      />
    </Screen>
  );
}
