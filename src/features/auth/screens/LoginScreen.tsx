import { useTheme } from '@shopify/restyle';
import { useCallback, useEffect, useRef, useState } from 'react';
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
import {
  formatLoginIdentifier,
  LOGIN_IDENTIFIER_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
} from '@/features/auth/validation/login.validation';
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
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const scroll = useRef<ScrollViewInstance>(null);

  const keyboard = useRef({ open: false, duration: 0 });
  const revealTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const revealFrame = useRef<number>(undefined);

  const cancelReveal = useCallback(() => {
    clearTimeout(revealTimer.current);
    if (revealFrame.current !== undefined) {
      cancelAnimationFrame(revealFrame.current);
    }
  }, []);

  const revealBottom = useCallback(() => {
    cancelReveal();
    if (!keyboard.current.open) {
      return;
    }
    revealTimer.current = setTimeout(() => {
      revealFrame.current = requestAnimationFrame(() => {
        scroll.current?.scrollToEnd({ animated: true });
      });
    }, keyboard.current.duration);
  }, [cancelReveal]);

  useEffect(() => {
    const prefix = Platform.OS === 'ios' ? 'keyboardWill' : 'keyboardDid';
    const show = Keyboard.addListener(`${prefix}Show`, event => {
      keyboard.current = { open: true, duration: event.duration ?? 0 };
      setKeyboardOpen(true);
      revealBottom();
    });
    const hide = Keyboard.addListener(`${prefix}Hide`, () => {
      keyboard.current = { open: false, duration: 0 };
      cancelReveal();
      setKeyboardOpen(false);
    });
    return () => {
      show.remove();
      hide.remove();
      cancelReveal();
    };
  }, [cancelReveal, revealBottom]);

  const gutter = {
    paddingHorizontal: Math.max(
      0,
      Math.min(theme.spacing.xl, (width - theme.sizes.fieldMinWidth) / 2),
    ),
  };

  const keyboardBackdrop = { backgroundColor: theme.colors.accent };
  const contentBackground = { backgroundColor: theme.colors.background };

  function submit() {
    setMessage(null);
    signIn(identifier, password)
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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
                label="CPF OU E-MAIL"
                value={identifier}
                onChangeText={value =>
                  setIdentifier(formatLoginIdentifier(value))
                }
                keyboardType="email-address"
                maxLength={LOGIN_IDENTIFIER_MAX_LENGTH}
              />
            </Box>
            <Box marginTop="fieldGap">
              <TextField
                testID="login-password"
                label="SENHA"
                value={password}
                onChangeText={setPassword}
                maxLength={PASSWORD_MAX_LENGTH}
                secure
              />
            </Box>
            {message ? (
              <Text
                variant="bodyMedium"
                color="accent"
                textAlign="center"
                marginTop="errorGap"
                accessibilityRole="alert"
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
