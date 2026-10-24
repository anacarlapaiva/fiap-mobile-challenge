import { useTheme } from '@shopify/restyle';
import { useEffect } from 'react';
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import type { Theme } from '@/shared/theme';

export function useCaretStyle(open: boolean) {
  const { motion } = useTheme<Theme>();
  const progress = useSharedValue(open ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(open ? 1 : 0, { duration: motion.medium });
  }, [motion.medium, open, progress]);

  return useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(progress.value, [0, 1], [0, 180])}deg` },
    ],
  }));
}
