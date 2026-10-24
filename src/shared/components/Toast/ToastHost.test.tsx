import { ThemeProvider } from '@shopify/restyle';
import { StyleSheet, Text as NativeText, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ReactTestRenderer from 'react-test-renderer';

import { ToastHost } from '@/shared/components/Toast';
import { showSuccessToast } from '@/shared/lib/toast';
import { theme } from '@/shared/theme';

const metrics = {
  frame: { x: 0, y: 0, width: 414, height: 736 },
  insets: { top: 47, bottom: 34, left: 0, right: 0 },
};

let renderer: ReactTestRenderer.ReactTestRenderer | undefined;

async function render() {
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <SafeAreaProvider initialMetrics={metrics}>
        <ThemeProvider theme={theme}>
          <ToastHost />
        </ThemeProvider>
      </SafeAreaProvider>,
    );
  });
  if (!renderer) {
    throw new Error('render falhou');
  }
  return renderer.root;
}

describe('mensagem de sucesso', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    ReactTestRenderer.act(() => {
      renderer?.unmount();
      jest.runOnlyPendingTimers();
    });
    renderer = undefined;
    jest.useRealTimers();
  });

  describe('dado o host na raiz', () => {
    test('CA-15: quando a mensagem é mostrada, então aparece com fundo de superfície, raio 8, barra de destaque de 4 e padding 16', async () => {
      const root = await render();

      await ReactTestRenderer.act(() => {
        showSuccessToast('Perfil alterado para JOANA');
      });

      const container = root
        .findAllByType(View)
        .find(
          node =>
            StyleSheet.flatten(node.props.style)?.borderLeftWidth ===
            theme.borderWidths.accentBar,
        );
      expect(
        root.findAllByType(NativeText).map(node => node.props.children),
      ).toContain('Perfil alterado para JOANA');
      expect(StyleSheet.flatten(container?.props.style)).toMatchObject({
        backgroundColor: theme.colors.surface,
        borderRadius: 8,
        borderLeftColor: theme.colors.accent,
        padding: 16,
      });
    });
  });
});
