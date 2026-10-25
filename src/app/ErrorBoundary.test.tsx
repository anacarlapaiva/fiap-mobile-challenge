import { ThemeProvider } from '@shopify/restyle';
import { StyleSheet, Text as NativeText, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ReactTestRenderer from 'react-test-renderer';

import { ErrorBoundary } from '@/app/ErrorBoundary';
import { theme } from '@/shared/theme';

const metrics = {
  frame: { x: 0, y: 0, width: 414, height: 736 },
  insets: { top: 47, bottom: 34, left: 0, right: 0 },
};

let shouldThrow = true;

function Fragile() {
  if (shouldThrow) {
    throw new Error('falha');
  }
  return <NativeText>conteúdo</NativeText>;
}

async function renderBoundary() {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <SafeAreaProvider initialMetrics={metrics}>
        <ThemeProvider theme={theme}>
          <ErrorBoundary>
            <Fragile />
          </ErrorBoundary>
        </ThemeProvider>
      </SafeAreaProvider>,
    );
  });
  if (!renderer) {
    throw new Error('render falhou');
  }
  return renderer;
}

function texts(renderer: ReactTestRenderer.ReactTestRenderer) {
  return renderer.root
    .findAllByType(NativeText)
    .map(node => node.props.children);
}

describe('proteção contra falha de tela', () => {
  let consoleError: jest.SpyInstance;

  beforeEach(() => {
    shouldThrow = true;
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  describe('dado uma tela que falha ao renderizar', () => {
    test('CA-24: quando a falha acontece, então aparece a mensagem e TENTAR NOVAMENTE', async () => {
      const renderer = await renderBoundary();

      expect(texts(renderer)).toEqual(['Algo deu errado.', 'TENTAR NOVAMENTE']);
      expect(
        renderer.root.findAllByType(NativeText)[0]?.props.accessibilityRole,
      ).toBe('alert');
      expect(
        StyleSheet.flatten(
          renderer.root
            .findAllByType(View)
            .find(node => node.props.testID === 'error-fallback')?.props.style,
        ),
      ).toMatchObject({ backgroundColor: '#000000' });
    });

    test('CA-24: quando TENTAR NOVAMENTE é tocado e a falha passou, então a tela volta', async () => {
      const renderer = await renderBoundary();
      shouldThrow = false;

      await ReactTestRenderer.act(() => {
        renderer.root
          .findByProps({ accessibilityLabel: 'TENTAR NOVAMENTE' })
          .props.onPress();
      });

      expect(texts(renderer)).toEqual(['conteúdo']);
    });
  });
});
