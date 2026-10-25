import { ThemeProvider } from '@shopify/restyle';
import { ActivityIndicator, Text as NativeText } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { UserFallback } from '@/features/auth/components/UserFallback';
import type { UserState } from '@/features/auth/types';
import { loginMessages } from '@/features/auth/validation/login.validation';
import { isOffline } from '@/shared/lib/reachability';
import { theme } from '@/shared/theme';

jest.mock('@/shared/lib/reachability', () => ({
  isOffline: jest.fn(),
}));

let resolveOffline: (value: boolean) => void = () => undefined;

async function renderFallback(state: Exclude<UserState, { status: 'ready' }>) {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider theme={theme}>
        <UserFallback state={state} />
      </ThemeProvider>,
    );
  });
  if (!renderer) {
    throw new Error('render falhou');
  }
  return renderer.root;
}

async function settleOffline(value: boolean) {
  await ReactTestRenderer.act(async () => {
    resolveOffline(value);
  });
}

describe('estado do usuário fora do pronto', () => {
  beforeEach(() => {
    jest.mocked(isOffline).mockReset();
    jest.mocked(isOffline).mockImplementation(
      () =>
        new Promise(resolve => {
          resolveOffline = resolve;
        }),
    );
  });

  describe('dado o usuário carregando', () => {
    test('quando renderizado, então só o indicador de carregamento aparece', async () => {
      const root = await renderFallback({ status: 'loading' });

      expect(root.findAllByType(ActivityIndicator)).toHaveLength(1);
      expect(root.findAllByType(NativeText)).toHaveLength(0);
    });
  });

  describe('dado a leitura com erro', () => {
    test('quando TENTAR NOVAMENTE é tocado, então a leitura é refeita', async () => {
      const retry = jest.fn();
      const root = await renderFallback({ status: 'error', retry });
      await settleOffline(false);

      expect(
        root.findAllByType(NativeText).map(node => node.props.children),
      ).toEqual([loginMessages.unavailable, 'TENTAR NOVAMENTE']);
      await ReactTestRenderer.act(() => {
        root.findByProps({ testID: 'user-retry' }).props.onPress();
      });
      expect(retry).toHaveBeenCalledTimes(1);
    });
  });

  describe('dado a leitura sem internet', () => {
    test('CA-08: quando o erro aparece, então a frase pede para verificar a rede', async () => {
      const root = await renderFallback({ status: 'error', retry: jest.fn() });
      await settleOffline(true);

      expect(
        root.findAllByType(NativeText).map(node => node.props.children),
      ).toContain(loginMessages.offline);
    });
  });
});
