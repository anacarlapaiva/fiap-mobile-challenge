import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@shopify/restyle';
import { StyleSheet, Text as NativeText, TextInput, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ReactTestRenderer from 'react-test-renderer';

import { LoginScreen } from '@/features/auth/screens/LoginScreen';
import {
  SessionProvider,
  useSession,
} from '@/features/auth/session/SessionProvider';
import * as sessionStorage from '@/features/auth/session/sessionStorage';
import { theme } from '@/shared/theme';

jest.mock('@/features/auth/session/sessionStorage', () => ({
  readSession: jest.fn(() => Promise.resolve(null)),
  saveSession: jest.fn(() => Promise.resolve()),
  clearSession: jest.fn(() => Promise.resolve()),
}));

const saveSession = jest.mocked(sessionStorage.saveSession);

const metrics = {
  frame: { x: 0, y: 0, width: 414, height: 736 },
  insets: { top: 47, bottom: 34, left: 0, right: 0 },
};

function SessionProbe() {
  const { session } = useSession();
  return (
    <NativeText>
      {session ? `${session.guardianId}:${session.studentRm}` : 'none'}
    </NativeText>
  );
}

async function flush() {
  for (let step = 0; step < 5; step += 1) {
    await Promise.resolve();
  }
}

async function renderLogin() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(
      <SafeAreaProvider initialMetrics={metrics}>
        <QueryClientProvider client={client}>
          <ThemeProvider theme={theme}>
            <SessionProvider>
              <LoginScreen />
              <SessionProbe />
            </SessionProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>,
    );
    await flush();
  });
  if (!renderer) {
    throw new Error('render falhou');
  }
  return renderer;
}

async function settle() {
  for (let step = 0; step < 5; step += 1) {
    await ReactTestRenderer.act(async () => {
      await new Promise<void>(resolve => {
        setTimeout(() => resolve(), 0);
      });
    });
  }
}

function texts(renderer: ReactTestRenderer.ReactTestRenderer) {
  return renderer.root
    .findAllByType(NativeText)
    .map(node => node.props.children);
}

function field(renderer: ReactTestRenderer.ReactTestRenderer, testID: string) {
  const input = renderer.root
    .findAllByType(TextInput)
    .find(node => node.props.testID === testID);
  if (!input) {
    throw new Error(`campo ${testID} não encontrado`);
  }
  return input;
}

async function pressLogin(renderer: ReactTestRenderer.ReactTestRenderer) {
  await ReactTestRenderer.act(async () => {
    renderer.root.findByProps({ testID: 'login-submit' }).props.onPress();
    await flush();
  });
  await settle();
}

describe('tela de login', () => {
  beforeEach(() => {
    saveSession.mockClear();
  });

  describe('dado o login', () => {
    test('quando a tela renderiza, então o botão cobre a base da tela', async () => {
      const renderer = await renderLogin();
      const hostStyle = (testID: string) =>
        StyleSheet.flatten(
          renderer.root
            .findAllByType(View)
            .find(view => view.props.testID === testID)?.props.style,
        );
      const screenStyle = hostStyle('login-screen');
      const buttonStyle = hostStyle('login-submit');

      expect(screenStyle.paddingTop).toBe(metrics.insets.top);
      expect(screenStyle.paddingBottom).toBe(0);
      expect(buttonStyle.paddingBottom).toBe(metrics.insets.bottom);
      expect(buttonStyle.backgroundColor).toBe(theme.colors.accent);
    });
  });

  describe('dado o campo de CPF', () => {
    test('CA-03: quando a pessoa digita dígitos, então o campo mostra a máscara', async () => {
      const renderer = await renderLogin();
      await settle();

      await ReactTestRenderer.act(() => {
        field(renderer, 'login-cpf').props.onChangeText('96929456004');
      });

      expect(field(renderer, 'login-cpf').props.value).toBe('969.294.560-04');
    });
  });

  describe('dado o CPF vazio', () => {
    test('CA-04: quando FAZER LOGIN é tocado, então aparece a frase do CPF', async () => {
      const renderer = await renderLogin();
      await settle();

      await pressLogin(renderer);

      expect(texts(renderer)).toContain('Informe o CPF.');
    });
  });

  describe('dado o CPF e a senha de um responsável do mock', () => {
    test('CA-10: quando FAZER LOGIN é tocado, então a sessão gravada usa o primeiro aluno', async () => {
      const renderer = await renderLogin();
      await settle();

      await ReactTestRenderer.act(() => {
        field(renderer, 'login-cpf').props.onChangeText('96929456004');
        field(renderer, 'login-password').props.onChangeText('123456');
      });
      await pressLogin(renderer);

      expect(saveSession).toHaveBeenCalledWith({
        guardianId: 1,
        studentRm: 12567,
      });
      expect(texts(renderer)).toContain('1:12567');
    });
  });
});
