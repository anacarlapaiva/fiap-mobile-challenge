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

test('CA-05: renderiza a raiz com o tema e fundo #000000', async () => {
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<App />);
  });
  if (!renderer) {
    throw new Error('render falhou');
  }

  const root = renderer.root
    .findAllByType(View)
    .find(node => node.props.testID === 'app-root');

  expect(StyleSheet.flatten(root?.props.style)).toMatchObject({
    flex: 1,
    backgroundColor: '#000000',
  });
});

test('CA-06: esconde a barra de status durante a splash e a mostra ao terminar', async () => {
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<App />);
  });
  if (!renderer) {
    throw new Error('render falhou');
  }

  expect(renderer.root.findByType(StatusBar).props.hidden).toBe(true);
  expect(
    renderer.root
      .findAllByType(View)
      .filter(view => view.props.testID === 'splash-screen'),
  ).toHaveLength(1);

  await ReactTestRenderer.act(() => {
    renderer?.root
      .findAllByType(View)
      .find(view => view.props.testID === 'splash-video')
      ?.props.onEnd();
  });

  expect(renderer.root.findByType(StatusBar).props.hidden).toBe(false);
  expect(
    renderer.root
      .findAllByType(View)
      .filter(view => view.props.testID === 'splash-screen'),
  ).toHaveLength(0);
  expect(
    renderer.root
      .findAllByType(View)
      .filter(view => view.props.testID === 'app-root'),
  ).toHaveLength(1);
});
