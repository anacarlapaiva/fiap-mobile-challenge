import { useTheme } from '@shopify/restyle';
import type { ComponentProps } from 'react';
import type { GestureResponderEvent } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { PressableBox } from '@/shared/components/PressableBox';
import type { Theme } from '@/shared/theme';

const AnimatedPressableBox = Animated.createAnimatedComponent(PressableBox);

export type PressableOpacityProps = ComponentProps<typeof PressableBox>;

export function PressableOpacity({
  onPressIn,
  onPressOut,
  disabled,
  style,
  ...props
}: PressableOpacityProps) {
  const { motion } = useTheme<Theme>();
  const opacity = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const handlePressIn = (event: GestureResponderEvent) => {
    opacity.value = withTiming(motion.pressedOpacity, {
      duration: motion.short,
    });
    onPressIn?.(event);
  };

  const handlePressOut = (event: GestureResponderEvent) => {
    opacity.value = withTiming(1, { duration: motion.short });
    onPressOut?.(event);
  };

  return (
    <AnimatedPressableBox
      {...props}
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style, animatedStyle]}
    />
  );
}
