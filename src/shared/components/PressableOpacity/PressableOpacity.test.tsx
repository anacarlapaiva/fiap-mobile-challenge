import { ThemeProvider } from '@shopify/restyle';
import { View } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { PressableOpacity } from '@/shared/components/PressableOpacity';
import { theme } from '@/shared/theme';

const { motion } = theme;

async function render(onPress: () => void) {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider theme={theme}>
        <PressableOpacity testID="pressable" onPress={onPress} />
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

describe('PressableOpacity', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('CA-17: reduz a opacidade ao pressionar e volta ao soltar', async () => {
    const onPress = jest.fn();
    const view = await render(onPress);

    await ReactTestRenderer.act(() => {
      view.pressable.props.onPressIn({});
      jest.advanceTimersByTime(motion.short + 50);
    });
    expect(view.opacity()).toBe(motion.pressedOpacity);

    await ReactTestRenderer.act(() => {
      view.pressable.props.onPressOut({});
      view.pressable.props.onPress({});
      jest.advanceTimersByTime(motion.short + 50);
    });
    expect(view.opacity()).toBe(1);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
