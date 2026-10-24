import { ThemeProvider } from '@shopify/restyle';
import { View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';
import ReactTestRenderer from 'react-test-renderer';

import { usePulse } from '@/shared/hooks/usePulse';
import { theme } from '@/shared/theme';

jest.mock('react-native-reanimated', () => ({
  __esModule: true,
  ...jest.requireActual('react-native-reanimated'),
  useReducedMotion: jest.fn(() => false),
}));

const useReducedMotionMock = jest.mocked(useReducedMotion);
const { motion } = theme;

type HarnessProps = {
  onReady: (pulse: (onDone?: () => void) => void) => void;
};

function Harness({ onReady }: HarnessProps) {
  const { pulseStyle, pulse } = usePulse();
  onReady(pulse);
  return <Animated.View testID="pulse" style={pulseStyle} />;
}

async function render() {
  let pulse: ((onDone?: () => void) => void) | undefined;
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider theme={theme}>
        <Harness
          onReady={value => {
            pulse = value;
          }}
        />
      </ThemeProvider>,
    );
  });
  if (!renderer || !pulse) {
    throw new Error('render falhou');
  }
  const root = renderer.root;
  const startPulse = pulse;
  return {
    pulse: startPulse,
    scale: () => {
      const host = root
        .findAllByType(View)
        .find(node => node.props.testID === 'pulse');
      const transform: unknown = host?.props.jestAnimatedStyle?.value.transform;
      if (!Array.isArray(transform)) {
        return undefined;
      }
      const [first] = transform as { scale?: number }[];
      return first?.scale;
    },
  };
}

describe('pulso', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    useReducedMotionMock.mockReturnValue(false);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('dado um elemento com pulso', () => {
    test('CA-05: quando pulsa, então encolhe a 0,85, volta a 1 e avisa o fim', async () => {
      const onDone = jest.fn();
      const view = await render();

      await ReactTestRenderer.act(() => {
        view.pulse(onDone);
        jest.advanceTimersByTime(motion.short);
      });
      expect(view.scale()).toBeCloseTo(motion.pulseScale, 1);
      expect(onDone).not.toHaveBeenCalled();

      await ReactTestRenderer.act(() => {
        jest.advanceTimersByTime(motion.short + 50);
      });
      expect(view.scale()).toBe(1);
      expect(onDone).toHaveBeenCalledTimes(1);
    });
  });

  describe('dado "Reduzir movimento" ligado', () => {
    test('CA-13: quando pulsa, então não anima e avisa o fim na hora', async () => {
      useReducedMotionMock.mockReturnValue(true);
      const onDone = jest.fn();
      const view = await render();

      await ReactTestRenderer.act(() => {
        view.pulse(onDone);
      });

      expect(onDone).toHaveBeenCalledTimes(1);
      expect(view.scale()).toBe(1);
    });
  });
});
