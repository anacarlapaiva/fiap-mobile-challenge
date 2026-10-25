import { ThemeProvider } from '@shopify/restyle';
import { ActivityIndicator, Text as NativeText } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { UserFallback } from '@/features/auth/components/UserFallback';
import type { UserState } from '@/features/auth/types';
import { theme } from '@/shared/theme';

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

describe('estado do usuário fora do pronto', () => {
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

      expect(
        root.findAllByType(NativeText).map(node => node.props.children),
      ).toEqual([
        'Não foi possível carregar seus dados. Tente novamente.',
        'TENTAR NOVAMENTE',
      ]);
      await ReactTestRenderer.act(() => {
        root.findByProps({ testID: 'user-retry' }).props.onPress();
      });
      expect(retry).toHaveBeenCalledTimes(1);
    });
  });
});
