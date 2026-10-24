import { useTheme } from '@shopify/restyle';
import { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  type ScrollViewInstance,
} from 'react-native';

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
import type { Theme } from '@/shared/theme';

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { flexGrow: 1 },
});

export function LoginScreen() {
  const theme = useTheme<Theme>();
  const { width } = useWindowDimensions();
  const { isSigningIn, signIn } = useSession();
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const scroll = useRef<ScrollViewInstance>(null);

  useEffect(() => {
    const prefix = Platform.OS === 'ios' ? 'keyboardWill' : 'keyboardDid';
    const show = Keyboard.addListener(`${prefix}Show`, () =>
      setKeyboardOpen(true),
    );
    const hide = Keyboard.addListener(`${prefix}Hide`, () =>
      setKeyboardOpen(false),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const gutter = {
    paddingHorizontal: Math.max(
      0,
      Math.min(theme.spacing.xl, (width - theme.sizes.fieldMinWidth) / 2),
    ),
  };

  const keyboardBackdrop = { backgroundColor: theme.colors.accent };
  const contentBackground = { backgroundColor: theme.colors.background };

  function revealBottom() {
    if (keyboardOpen) {
      scroll.current?.scrollToEnd({ animated: true });
    }
  }

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
      <KeyboardAvoidingView
        style={[styles.fill, keyboardBackdrop]}
        behavior="padding"
      >
        <ScrollView
          ref={scroll}
          testID="login-scroll"
          style={[styles.fill, contentBackground]}
          onLayout={revealBottom}
          onContentSizeChange={revealBottom}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Box testID="login-content" paddingTop="loginTop" style={gutter}>
            <Box alignItems="center">
              <Logo size="large" />
            </Box>
            <Box marginTop="logoGap">
              <TextField
                testID="login-cpf"
                label="CPF"
                value={cpf}
                onChangeText={value => setCpf(applyCpfMask(value))}
                keyboardType="number-pad"
                maxLength={14}
              />
            </Box>
            <Box marginTop="fieldGap">
              <TextField
                testID="login-password"
                label="SENHA"
                value={password}
                onChangeText={setPassword}
                secure
              />
            </Box>
            {message ? (
              <Text
                variant="bodyMedium"
                color="accent"
                textAlign="center"
                marginTop="errorGap"
              >
                {message}
              </Text>
            ) : null}
          </Box>
        </ScrollView>
        <Button
          testID="login-submit"
          label="FAZER LOGIN"
          onPress={submit}
          loading={isSigningIn}
          bottomInset={!keyboardOpen}
        />
      </KeyboardAvoidingView>
    </Screen>
  );
}
