import { ThemeProvider } from '@shopify/restyle';
import { StyleSheet, Text as NativeText, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
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
    test('CA-15: quando a mensagem é mostrada, então aparece abaixo da área segura com fundo #262626, raio 8, barra de destaque de 4 e padding 16', async () => {
      const root = await render();

      await ReactTestRenderer.act(() => {
        showSuccessToast('Perfil alterado para JOANA');
      });

      const container = root
        .findAllByType(View)
        .find(
          node => StyleSheet.flatten(node.props.style)?.borderLeftWidth === 4,
        );
      expect(
        root.findAllByType(NativeText).map(node => node.props.children),
      ).toContain('Perfil alterado para JOANA');
      expect(StyleSheet.flatten(container?.props.style)).toMatchObject({
        backgroundColor: '#262626',
        borderRadius: 8,
        borderLeftColor: theme.colors.accent,
        padding: 16,
      });
      expect(root.findByType(Toast).props.topOffset).toBe(
        metrics.insets.top + 16,
      );
    });

    test('CA-15: quando a mensagem é tocada, então ela some', async () => {
      const root = await render();
      const visible = () =>
        root.findAll(
          node =>
            typeof node.props.isVisible === 'boolean' &&
            'topOffset' in node.props,
        )[0]?.props.isVisible;

      await ReactTestRenderer.act(() => {
        showSuccessToast('Perfil alterado para JOANA');
      });
      expect(visible()).toBe(true);

      await ReactTestRenderer.act(() => {
        root.findByProps({ testID: 'toast-success' }).props.onPress();
      });

      expect(visible()).toBe(false);
    });
  });
});
