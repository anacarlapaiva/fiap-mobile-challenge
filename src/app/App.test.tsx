import { StatusBar, StyleSheet, View } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import App from '@/app/App';

jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
);

jest.mock('react-native-video', () => {
  const React = require('react');
  const { View: NativeView } = require('react-native');

  return {
    __esModule: true,
    default: (props: Record<string, unknown>) =>
      React.createElement(NativeView, props),
    ResizeMode: { CONTAIN: 'contain' },
    MixWithOthersType: { MIX: 'mix' },
  };
});

let renderer: ReactTestRenderer.ReactTestRenderer | undefined;

afterEach(() => {
  ReactTestRenderer.act(() => {
    renderer?.unmount();
  });
  renderer = undefined;
});

async function renderApp() {
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<App />);
  });
  if (!renderer) {
    throw new Error('render falhou');
  }
  return renderer;
}

describe('abertura do app', () => {
  describe('dado o app iniciado', () => {
    test('CA-05: quando a raiz é exibida, então o fundo é preto', async () => {
      const view = await renderApp();

      const root = view.root
        .findAllByType(View)
        .find(node => node.props.testID === 'app-root');

      expect(StyleSheet.flatten(root?.props.style)).toMatchObject({
        flex: 1,
        backgroundColor: '#000000',
      });
    });
  });

  describe('dado a splash visível', () => {
    test('CA-06: quando a abertura está na tela, então a barra de status fica oculta', async () => {
      const view = await renderApp();

      expect(view.root.findByType(StatusBar).props.hidden).toBe(true);
      expect(
        view.root
          .findAllByType(View)
          .filter(node => node.props.testID === 'splash-screen'),
      ).toHaveLength(1);
    });

    test('CA-06: quando a splash termina, então a barra de status volta e a raiz continua', async () => {
      const view = await renderApp();

      await ReactTestRenderer.act(() => {
        view.root
          .findAllByType(View)
          .find(node => node.props.testID === 'splash-video')
          ?.props.onEnd();
      });

      expect(view.root.findByType(StatusBar).props.hidden).toBe(false);
      expect(
        view.root
          .findAllByType(View)
          .filter(node => node.props.testID === 'splash-screen'),
      ).toHaveLength(0);
      expect(
        view.root
          .findAllByType(View)
          .filter(node => node.props.testID === 'app-root'),
      ).toHaveLength(1);
    });
  });
});
