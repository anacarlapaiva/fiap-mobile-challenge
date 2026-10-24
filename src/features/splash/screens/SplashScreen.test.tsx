import { ThemeProvider } from '@shopify/restyle';
import { StyleSheet, View } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import {
  SPLASH_CAP_TIMEOUT_MS,
  SPLASH_START_TIMEOUT_MS,
  SplashScreen,
} from '@/features/splash/screens/SplashScreen';
import { splashVideoSource } from '@/features/splash/splashVideo';
import { theme } from '@/shared/theme';

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

type VideoProps = {
  source: unknown;
  resizeMode: string;
  repeat: boolean;
  muted: boolean;
  volume: number;
  paused: boolean;
  controls: boolean;
  pointerEvents: string;
  shutterColor: string;
  onEnd: () => void;
  onError: () => void;
  onLoad: (event: { duration: number }) => void;
  onProgress: (event: {
    currentTime: number;
    playableDuration: number;
    seekableDuration: number;
  }) => void;
};

async function renderSplash(onFinish: () => void = jest.fn()) {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider theme={theme}>
        <SplashScreen onFinish={onFinish} />
      </ThemeProvider>,
    );
  });
  if (!renderer) {
    throw new Error('render falhou');
  }

  const screen = renderer.root
    .findAllByType(View)
    .find(view => view.props.testID === 'splash-screen');
  const videoNode = renderer.root
    .findAllByType(View)
    .find(view => view.props.testID === 'splash-video');
  if (!screen || !videoNode) {
    throw new Error('splash não renderizou');
  }

  return { renderer, onFinish, screen, video: videoNode.props as VideoProps };
}

describe('SplashScreen', () => {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    ReactTestRenderer.act(() => {
      renderer?.unmount();
    });
    renderer = undefined;
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('CA-01: reproduz o vídeo local uma vez, inteiro, sem controle e sem som', async () => {
    const view = await renderSplash();
    renderer = view.renderer;

    expect(view.screen.props.accessibilityLabel).toBe(
      'Animação de abertura da FIAP',
    );
    expect(StyleSheet.flatten(view.screen.props.style)).toMatchObject({
      flex: 1,
      backgroundColor: theme.colors.background,
    });
    expect(view.video.source).toBe(splashVideoSource);
    expect(view.video.resizeMode).toBe('contain');
    expect(view.video.repeat).toBe(false);
    expect(view.video.muted).toBe(true);
    expect(view.video.volume).toBe(0);
    expect(view.video.paused).toBe(false);
    expect(view.video.controls).toBe(false);
    expect(view.video.pointerEvents).toBe('none');
    expect(view.video.shutterColor).toBe(theme.colors.background);
    expect(view.onFinish).not.toHaveBeenCalled();
  });

  test('CA-02: ao terminar, chama onFinish uma única vez', async () => {
    const onFinish = jest.fn();
    const view = await renderSplash(onFinish);
    renderer = view.renderer;

    await ReactTestRenderer.act(() => {
      view.video.onEnd();
    });
    await ReactTestRenderer.act(async () => {
      jest.advanceTimersByTime(SPLASH_CAP_TIMEOUT_MS);
    });

    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  test('CA-02: o progresso antes do fim, inclusive no fade, não encerra', async () => {
    const onFinish = jest.fn();
    const view = await renderSplash(onFinish);
    renderer = view.renderer;

    await ReactTestRenderer.act(() => {
      view.video.onLoad({ duration: 6.1 });
      view.video.onProgress({
        currentTime: 1,
        playableDuration: 6.1,
        seekableDuration: 6.1,
      });
      view.video.onProgress({
        currentTime: 5.8,
        playableDuration: 6.1,
        seekableDuration: 6.1,
      });
    });

    expect(onFinish).not.toHaveBeenCalled();
  });

  test('CA-04: progresso em zero não conta como início', async () => {
    const onFinish = jest.fn();
    const view = await renderSplash(onFinish);
    renderer = view.renderer;

    await ReactTestRenderer.act(() => {
      view.video.onProgress({
        currentTime: 0,
        playableDuration: 0,
        seekableDuration: 0,
      });
    });
    await ReactTestRenderer.act(async () => {
      jest.advanceTimersByTime(SPLASH_START_TIMEOUT_MS);
    });

    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  test('CA-04: progresso com tempo decorrido conta como início', async () => {
    const onFinish = jest.fn();
    const view = await renderSplash(onFinish);
    renderer = view.renderer;

    await ReactTestRenderer.act(() => {
      view.video.onProgress({
        currentTime: 0.25,
        playableDuration: 6.1,
        seekableDuration: 6.1,
      });
    });
    await ReactTestRenderer.act(async () => {
      jest.advanceTimersByTime(SPLASH_START_TIMEOUT_MS);
    });

    expect(onFinish).not.toHaveBeenCalled();
  });

  test('CA-03: erro de reprodução encerra a splash', async () => {
    const onFinish = jest.fn();
    const view = await renderSplash(onFinish);
    renderer = view.renderer;

    await ReactTestRenderer.act(() => {
      view.video.onError();
    });

    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  test('CA-04: se a reprodução não começa em 4 segundos, a splash encerra', async () => {
    const onFinish = jest.fn();
    const view = await renderSplash(onFinish);
    renderer = view.renderer;

    await ReactTestRenderer.act(async () => {
      jest.advanceTimersByTime(SPLASH_START_TIMEOUT_MS - 1);
    });
    expect(onFinish).not.toHaveBeenCalled();

    await ReactTestRenderer.act(async () => {
      jest.advanceTimersByTime(1);
    });

    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  test('CA-05: se começou e não termina, a splash encerra aos 12 segundos', async () => {
    const onFinish = jest.fn();
    const view = await renderSplash(onFinish);
    renderer = view.renderer;

    await ReactTestRenderer.act(() => {
      view.video.onLoad({ duration: 6.1 });
    });
    await ReactTestRenderer.act(async () => {
      jest.advanceTimersByTime(SPLASH_START_TIMEOUT_MS);
    });
    expect(onFinish).not.toHaveBeenCalled();

    await ReactTestRenderer.act(async () => {
      jest.advanceTimersByTime(SPLASH_CAP_TIMEOUT_MS - SPLASH_START_TIMEOUT_MS);
    });

    expect(onFinish).toHaveBeenCalledTimes(1);
  });
});
