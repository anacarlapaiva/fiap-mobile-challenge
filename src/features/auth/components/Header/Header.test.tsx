import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@shopify/restyle';
import {
  Alert,
  Image,
  StyleSheet,
  Text as NativeText,
  View,
  type AlertButton,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ReactTestRenderer from 'react-test-renderer';

import { Header } from '@/features/auth/components/Header';
import { SessionProvider } from '@/features/auth/session/SessionProvider';
import * as sessionStorage from '@/features/auth/session/sessionStorage';
import type { Session } from '@/features/auth/types';
import { theme } from '@/shared/theme';

jest.mock('@/features/auth/session/sessionStorage', () => ({
  readSession: jest.fn(() => Promise.resolve(null)),
  saveSession: jest.fn(() => Promise.resolve()),
  clearSession: jest.fn(() => Promise.resolve()),
}));

const readSession = jest.mocked(sessionStorage.readSession);
const clearSession = jest.mocked(sessionStorage.clearSession);

const metrics = {
  frame: { x: 0, y: 0, width: 414, height: 736 },
  insets: { top: 47, bottom: 34, left: 0, right: 0 },
};

async function flush() {
  for (let step = 0; step < 5; step += 1) {
    await Promise.resolve();
  }
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

async function renderHeader(session: Session, onSwitchProfile?: () => void) {
  readSession.mockResolvedValue(session);
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
              <Header onSwitchProfile={onSwitchProfile} />
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
  await settle();
  return renderer;
}

function labels(renderer: ReactTestRenderer.ReactTestRenderer) {
  return renderer.root
    .findAllByType(NativeText)
    .map(node => node.props.children);
}

describe('cabeçalho autenticado', () => {
  beforeEach(() => {
    clearSession.mockReset();
    clearSession.mockResolvedValue(undefined);
    readSession.mockReset();
  });

  describe('dado o cabeçalho', () => {
    test('CA-17: quando renderizado, então a barra tem altura 48, margem 16, inset no topo e o logo 100 por 16', async () => {
      const renderer = await renderHeader({
        guardianId: 1,
        studentRm: 12567,
      });
      const bar = renderer.root
        .findAllByType(View)
        .find(node => StyleSheet.flatten(node.props.style).height === 48);
      const inset = renderer.root
        .findAllByType(View)
        .find(node => StyleSheet.flatten(node.props.style).paddingTop === 47);

      expect(inset).toBeDefined();
      expect(StyleSheet.flatten(bar?.props.style)).toMatchObject({
        height: 48,
        paddingHorizontal: 16,
        justifyContent: 'space-between',
      });
      expect(
        StyleSheet.flatten(renderer.root.findByType(Image).props.style),
      ).toEqual({
        width: 100,
        height: 16,
      });
      expect(bar?.findByProps({ testID: 'switch-profile' })).toBeDefined();
      expect(bar?.findByProps({ testID: 'logout' })).toBeDefined();
    });
  });

  describe('dado o Gustavo com o Rafael', () => {
    test('CA-18: quando o cabeçalho é exibido, então a saudação, o aluno e as ações aparecem', async () => {
      const renderer = await renderHeader({
        guardianId: 1,
        studentRm: 12567,
      });

      expect(labels(renderer)).toEqual(
        expect.arrayContaining([
          'Olá, ',
          'GUSTAVO',
          'RAFAEL',
          '7EF - RM 12567 - Matutino',
          'SAIR',
          'TROCAR PERFIL',
        ]),
      );
    });
  });

  describe('dado a Adelaide', () => {
    test('CA-19: quando o cabeçalho é exibido, então só SAIR aparece com os dados dela', async () => {
      const renderer = await renderHeader({
        guardianId: 2,
        studentRm: 13752,
      });
      const text = labels(renderer);

      expect(text).toEqual(
        expect.arrayContaining([
          'Olá, ',
          'ADELAIDE',
          'BIANCA',
          '1EF - RM 13752 - Tarde',
          'SAIR',
        ]),
      );
      expect(text).not.toContain('TROCAR PERFIL');
    });
  });

  describe('dado TROCAR PERFIL visível', () => {
    test('CA-12: quando o botão é tocado, então a troca de perfil é pedida e a sessão permanece', async () => {
      const onSwitchProfile = jest.fn();
      const renderer = await renderHeader(
        {
          guardianId: 1,
          studentRm: 12567,
        },
        onSwitchProfile,
      );

      await ReactTestRenderer.act(() => {
        renderer.root.findByProps({ testID: 'switch-profile' }).props.onPress();
      });

      expect(onSwitchProfile).toHaveBeenCalledTimes(1);
      expect(clearSession).not.toHaveBeenCalled();
      expect(labels(renderer)).toContain('GUSTAVO');
    });
  });

  describe('dado a área autenticada', () => {
    async function openSignOutAlert() {
      const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
      const renderer = await renderHeader({
        guardianId: 1,
        studentRm: 12567,
      });
      await ReactTestRenderer.act(() => {
        renderer.root.findByProps({ testID: 'logout' }).props.onPress();
      });
      const [title, message, buttons, options] = alert.mock.calls[0] ?? [];
      const button = (text: string): AlertButton | undefined =>
        buttons?.find(item => item.text === text);
      alert.mockRestore();
      return { renderer, title, message, buttons, options, button };
    }

    test('CA-01: quando SAIR é tocado, então o alerta pede confirmação e a sessão continua', async () => {
      const view = await openSignOutAlert();

      expect(view.title).toBe('Sair da conta?');
      expect(view.message).toBe(
        'Você vai precisar entrar de novo com CPF e senha.',
      );
      expect(view.buttons?.map(item => [item.text, item.style])).toEqual([
        ['Cancelar', 'cancel'],
        ['Sair', 'destructive'],
      ]);
      expect(view.options).toMatchObject({ cancelable: true });
      expect(clearSession).not.toHaveBeenCalled();
      expect(labels(view.renderer)).toContain('GUSTAVO');
    });

    test('CA-02: quando Sair é confirmado, então a sessão sai do Keychain', async () => {
      const view = await openSignOutAlert();

      await ReactTestRenderer.act(async () => {
        view.button('Sair')?.onPress?.();
        await flush();
      });

      expect(clearSession).toHaveBeenCalledTimes(1);
    });

    test('CA-03: quando Cancelar é tocado, então a sessão e a tela não mudam', async () => {
      const view = await openSignOutAlert();

      await ReactTestRenderer.act(async () => {
        view.button('Cancelar')?.onPress?.();
        await flush();
      });

      expect(clearSession).not.toHaveBeenCalled();
      expect(labels(view.renderer)).toContain('GUSTAVO');
    });
  });
});
