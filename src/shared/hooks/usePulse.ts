import { useTheme } from '@shopify/restyle';
import { useCallback } from 'react';
import {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import type { Theme } from '@/shared/theme';

export function usePulse() {
  const { motion } = useTheme<Theme>();
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(1);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const pulse = useCallback(
    (onDone?: () => void) => {
      if (reducedMotion) {
        onDone?.();
        return;
      }
      scale.value = withSequence(
        withTiming(motion.pulseScale, { duration: motion.short }),
        withTiming(1, { duration: motion.short }, finished => {
          if (finished && onDone) {
            scheduleOnRN(onDone);
          }
        }),
      );
    },
    [motion.pulseScale, motion.short, reducedMotion, scale],
  );

  return { pulseStyle, pulse };
}
