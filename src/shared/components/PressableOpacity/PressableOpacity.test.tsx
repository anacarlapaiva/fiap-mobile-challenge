import { ThemeProvider } from '@shopify/restyle';
import { View } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { PressableOpacity } from '@/shared/components/PressableOpacity';
import { theme } from '@/shared/theme';

const { motion } = theme;

async function render() {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider theme={theme}>
        <PressableOpacity testID="pressable" />
      </ThemeProvider>,
    );
  });
  if (!renderer) {
    throw new Error('render falhou');
  }
  const root = renderer.root;
  return {
    pressable:
      root
        .findAll(node => typeof node.props.onPressIn === 'function')
        .slice(-1)[0] ?? root,
    opacity: () => {
      const host = root
        .findAllByType(View)
        .find(node => node.props.testID === 'pressable');
      if (!host) {
        throw new Error('pressable não encontrado');
      }
      return host.props.jestAnimatedStyle?.value.opacity;
    },
  };
}

describe('toque com opacidade', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('dado um componente pressionável', () => {
    test('quando pressionado, então a opacidade vai a 0,8', async () => {
      const view = await render();

      await ReactTestRenderer.act(() => {
        view.pressable.props.onPressIn({});
        jest.advanceTimersByTime(motion.short + 50);
      });

      expect(view.opacity()).toBe(motion.pressedOpacity);
    });

    test('quando solto, então a opacidade volta', async () => {
      const view = await render();

      await ReactTestRenderer.act(() => {
        view.pressable.props.onPressIn({});
        jest.advanceTimersByTime(motion.short + 50);
        view.pressable.props.onPressOut({});
        jest.advanceTimersByTime(motion.short + 50);
      });

      expect(view.opacity()).toBe(1);
    });
  });
});
