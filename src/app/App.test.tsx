import * as Keychain from 'react-native-keychain';
import type { UserCredentials } from 'react-native-keychain';
import { StatusBar, StyleSheet, View } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import App from '@/app/App';

jest.mock('react-native-keychain', () => ({
  getGenericPassword: jest.fn(() => Promise.resolve(false)),
  setGenericPassword: jest.fn(() => Promise.resolve(false)),
  resetGenericPassword: jest.fn(() => Promise.resolve(true)),
}));

const getGenericPassword = jest.mocked(Keychain.getGenericPassword);
const resetGenericPassword = jest.mocked(Keychain.resetGenericPassword);

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
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
    for (let step = 0; step < 5; step += 1) {
      await Promise.resolve();
    }
  });
  if (!renderer) {
    throw new Error('render falhou');
  }
  return renderer;
}

async function finishSplash(view: ReactTestRenderer.ReactTestRenderer) {
  await ReactTestRenderer.act(() => {
    view.root
      .findAllByType(View)
      .find(node => node.props.testID === 'splash-video')
      ?.props.onEnd();
  });
  for (let step = 0; step < 5; step += 1) {
    await ReactTestRenderer.act(async () => {
      await new Promise<void>(resolve => {
        setTimeout(() => resolve(), 0);
      });
    });
  }
}

describe('abertura do app', () => {
  beforeEach(() => {
    getGenericPassword.mockReset();
    getGenericPassword.mockResolvedValue(false);
    resetGenericPassword.mockReset();
    resetGenericPassword.mockResolvedValue(true);
  });

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

  describe('dado a splash concluída e nenhuma sessão', () => {
    test('CA-01: quando a rota abre, então a tela é o login', async () => {
      const view = await renderApp();
      await finishSplash(view);

      expect(
        view.root
          .findAllByType(View)
          .filter(node => node.props.testID === 'login-screen'),
      ).toHaveLength(1);
    });
  });

  describe('dado a splash concluída e uma sessão cujo responsável não está no mock', () => {
    test('CA-16: quando a rota abre, então a tela é o login', async () => {
      getGenericPassword.mockResolvedValue({
        username: 'session',
        password: JSON.stringify({ guardianId: 99, studentRm: 1 }),
        service: 'br.com.fiap.school.session',
        storage: 'KeystoreAESGCM_NoAuth',
      } as UserCredentials);
      const view = await renderApp();
      await finishSplash(view);

      expect(resetGenericPassword).toHaveBeenCalled();
      expect(
        view.root
          .findAllByType(View)
          .filter(node => node.props.testID === 'login-screen'),
      ).toHaveLength(1);
      expect(
        view.root
          .findAllByType(View)
          .filter(node => node.props.testID === 'schedule-screen'),
      ).toHaveLength(0);
    });
  });

  describe('dado a splash concluída e uma sessão válida', () => {
    test('CA-02: quando a rota abre, então a tela autenticada aparece', async () => {
      getGenericPassword.mockResolvedValue({
        username: 'session',
        password: JSON.stringify({ guardianId: 1, studentRm: 12567 }),
        service: 'br.com.fiap.school.session',
        storage: 'KeystoreAESGCM_NoAuth',
      } as UserCredentials);
      const view = await renderApp();
      await finishSplash(view);

      expect(
        view.root
          .findAllByType(View)
          .filter(node => node.props.testID === 'schedule-screen'),
      ).toHaveLength(1);
    });
  });

  describe('dado a área autenticada', () => {
    test('CA-13: quando SAIR é tocado, então o login volta', async () => {
      getGenericPassword.mockResolvedValue({
        username: 'session',
        password: JSON.stringify({ guardianId: 1, studentRm: 12567 }),
        service: 'br.com.fiap.school.session',
        storage: 'KeystoreAESGCM_NoAuth',
      } as UserCredentials);
      const view = await renderApp();
      await finishSplash(view);
      await ReactTestRenderer.act(async () => {
        view.root.findByProps({ testID: 'logout' }).props.onPress();
        for (let step = 0; step < 5; step += 1) {
          await Promise.resolve();
        }
      });

      expect(resetGenericPassword).toHaveBeenCalled();
      expect(
        view.root
          .findAllByType(View)
          .filter(node => node.props.testID === 'login-screen'),
      ).toHaveLength(1);
    });
  });
});
