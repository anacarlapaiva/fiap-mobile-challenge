import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@shopify/restyle';
import {
  Dimensions,
  Keyboard,
  StyleSheet,
  Text as NativeText,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ReactTestRenderer from 'react-test-renderer';

import { LoginScreen } from '@/features/auth/screens/LoginScreen';
import { SessionProvider } from '@/features/auth/session/SessionProvider';
import { theme } from '@/shared/theme';

jest.mock('@/features/auth/session/sessionStorage', () => ({
  readSession: jest.fn(() => Promise.resolve(null)),
  saveSession: jest.fn(() => Promise.resolve()),
  clearSession: jest.fn(() => Promise.resolve()),
}));

const metrics = {
  frame: { x: 0, y: 0, width: 414, height: 736 },
  insets: { top: 47, bottom: 34, left: 0, right: 0 },
};

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

async function pressLogin(renderer: ReactTestRenderer.ReactTestRenderer) {
  await ReactTestRenderer.act(async () => {
    renderer.root.findByProps({ testID: 'login-submit' }).props.onPress();
    await flush();
  });
  await settle();
}

function style(renderer: ReactTestRenderer.ReactTestRenderer, testID: string) {
  return StyleSheet.flatten(
    renderer.root.findAllByType(View).find(view => view.props.testID === testID)
      ?.props.style,
  );
}

function window(width: number, height: number) {
  jest
    .spyOn(Dimensions, 'get')
    .mockReturnValue({ width, height, scale: 3, fontScale: 1 });
}

function texts(renderer: ReactTestRenderer.ReactTestRenderer) {
  return renderer.root
    .findAllByType(NativeText)
    .map(node => node.props.children);
}

async function openKeyboard() {
  const addListener = jest.spyOn(Keyboard, 'addListener');
  const renderer = await renderLogin();
  const listeners = addListener.mock.calls
    .filter(([event]) => event === 'keyboardWillShow')
    .map(([, listener]) => listener);

  await ReactTestRenderer.act(() => {
    listeners.forEach(listener =>
      listener({} as Parameters<typeof listener>[0]),
    );
  });
  return renderer;
}

describe('tela de login', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('dado uma tela de 414 de largura', () => {
    test('quando renderizada, então o conteúdo começa a 100 do topo seguro com margem 48', async () => {
      window(414, 736);
      const renderer = await renderLogin();

      expect(style(renderer, 'login-content')).toMatchObject({
        paddingTop: 100,
        paddingHorizontal: 48,
      });
    });
  });

  describe('dado uma tela de 320 de largura', () => {
    test('quando renderizada, então a margem encolhe para o CPF caber', async () => {
      window(320, 568);
      const renderer = await renderLogin();

      expect(style(renderer, 'login-content')).toMatchObject({
        paddingHorizontal: 30,
      });
    });
  });

  describe('dado um login recusado', () => {
    test('quando a frase aparece, então fica centralizada abaixo da senha', async () => {
      window(414, 736);
      const renderer = await renderLogin();
      await settle();

      await pressLogin(renderer);

      const message = renderer.root
        .findAllByType(NativeText)
        .find(node => node.props.children === 'Informe o CPF.');
      expect(StyleSheet.flatten(message?.props.style)).toMatchObject({
        textAlign: 'center',
        marginTop: 31,
      });
    });
  });

  describe('dado o teclado aberto', () => {
    test('quando o botão fica acima dele, então mantém a altura 60 sem a área segura e o fundo atrás do teclado é acento', async () => {
      window(414, 736);
      const renderer = await openKeyboard();

      expect(style(renderer, 'login-submit')).toMatchObject({
        paddingBottom: 0,
      });
      expect(
        renderer.root
          .findAllByType(View)
          .some(
            node =>
              StyleSheet.flatten(node.props.style)?.backgroundColor ===
                theme.colors.accent &&
              StyleSheet.flatten(node.props.style)?.flex === 1,
          ),
      ).toBe(true);
    });

    test('quando o teclado termina de abrir, então a tela rola até o fim para mostrar a senha', async () => {
      window(414, 736);
      const renderer = await openKeyboard();
      const scrollToEnd = jest.fn();
      renderer.root.findByProps({
        testID: 'login-scroll',
      }).instance.scrollToEnd = scrollToEnd;

      await settle();

      expect(scrollToEnd).toHaveBeenCalledWith({ animated: true });
    });

    test('quando a frase de erro aparece, então a tela rola até o fim para mostrá-la', async () => {
      window(414, 736);
      const renderer = await openKeyboard();
      const scroll = renderer.root.findByProps({ testID: 'login-scroll' });
      const scrollToEnd = jest.fn();
      scroll.instance.scrollToEnd = scrollToEnd;

      await pressLogin(renderer);
      await ReactTestRenderer.act(() => {
        scroll.props.onContentSizeChange(414, 600);
      });

      expect(texts(renderer)).toContain('Informe o CPF.');
      expect(scrollToEnd).toHaveBeenCalledWith({ animated: true });
    });
  });
});
