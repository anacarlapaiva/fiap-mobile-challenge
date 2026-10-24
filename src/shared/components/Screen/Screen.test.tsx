import { ThemeProvider } from '@shopify/restyle';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ReactTestRenderer from 'react-test-renderer';

import { Screen } from '@/shared/components/Screen';
import { theme } from '@/shared/theme';

const metrics = {
  frame: { x: 0, y: 0, width: 414, height: 736 },
  insets: { top: 47, bottom: 34, left: 0, right: 0 },
};

async function renderStyle(element: React.ReactElement) {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <SafeAreaProvider initialMetrics={metrics}>
        <ThemeProvider theme={theme}>{element}</ThemeProvider>
      </SafeAreaProvider>,
    );
  });
  if (!renderer) {
    throw new Error('render falhou');
  }
  const screen = renderer.root
    .findAllByType(View)
    .find(view => view.props.testID === 'screen');
  return StyleSheet.flatten(screen?.props.style);
}

describe('tela', () => {
  describe('dado uma tela sem bordas pedidas', () => {
    test('quando renderizada, então o fundo é preto e a área segura fica no topo e na base', async () => {
      const style = await renderStyle(<Screen testID="screen" />);

      expect(style).toMatchObject({
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: 47,
        paddingBottom: 34,
      });
    });
  });

  describe('dado uma tela só com a borda superior', () => {
    test('quando renderizada, então a área segura fica só nessa borda', async () => {
      const style = await renderStyle(
        <Screen testID="screen" edges={['top']} />,
      );

      expect(style).toMatchObject({ paddingTop: 47, paddingBottom: 0 });
    });
  });
});
